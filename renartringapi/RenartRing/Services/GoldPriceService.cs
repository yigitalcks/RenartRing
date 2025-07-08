using RenartRing.Models;

namespace RenartRing.Services;
public class GoldPriceService : IGoldPriceService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<GoldPriceService> _logger;
    private readonly IConfiguration _configuration;
    private GoldPriceDto _currentGoldPrice;

    private const decimal OunceToGram = 28.3495231m;
    
    private static readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);
    
    public GoldPriceService(IHttpClientFactory httpClientFactory, ILogger<GoldPriceService> logger, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _logger = logger;
        _configuration = configuration;
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
            
            var goldApiSettings = _configuration.GetSection("GoldApiSettings");
            var apiKey = goldApiSettings["ApiKey"];
            var url = $"v1/latest?api_key={apiKey}&base=USD&currencies=XAU";
            
            var response = await client.GetFromJsonAsync<ExternalGoldPrice>(url);

            if (response != null)
            {
                _currentGoldPrice = new GoldPriceDto
                {
                    Price = response.Rates.PriceOunce24k / OunceToGram,
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