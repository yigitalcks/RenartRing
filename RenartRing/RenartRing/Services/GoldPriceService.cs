using RenartRing.Models;

namespace RenartRing.Services;
public class GoldPriceService : IGoldPriceService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<GoldPriceService> _logger;
    private GoldPriceDto _currentGoldPrice; 
    
    private static readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);
    
    public GoldPriceService(IHttpClientFactory httpClientFactory, ILogger<GoldPriceService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }
    
    public async Task<GoldPriceDto> GetCurrentGoldPriceAsync()
    {
        if (_currentGoldPrice == null)
        {
            await UpdateGoldPriceAsync();
        }
        return _currentGoldPrice;
    }
    
    public async Task UpdateGoldPriceAsync()
    {
        await _semaphore.WaitAsync();
        try
        {
            var client = _httpClientFactory.CreateClient("GoldApiClient");
            var response = await client.GetFromJsonAsync<ExternalGoldPrice>("api/XAU/USD");

            if (response != null)
            {
                _currentGoldPrice = new GoldPriceDto
                {
                    Price = response.PriceGram24k,
                    LastUpdatedUtc = DateTimeOffset.FromUnixTimeSeconds(response.Timestamp).UtcDateTime
                };
                _logger.LogInformation(
                    "Gold price updated successfully. New price: {Price}, Last Updated: {LastUpdated}", 
                    _currentGoldPrice.Price, 
                    _currentGoldPrice.LastUpdatedUtc);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update gold price.");
        }
        finally
        {
            _semaphore.Release();
        }
    }
}