namespace RenartRing.Services;

public class GoldPriceUpdateWorker : BackgroundService
{
    private readonly ILogger<GoldPriceUpdateWorker> _logger;
    private readonly IGoldPriceService _goldPriceService;

    public GoldPriceUpdateWorker(ILogger<GoldPriceUpdateWorker> logger, IGoldPriceService goldPriceService)
    {
        _logger = logger;
        _goldPriceService = goldPriceService;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Gold price update worker running at: {time}", DateTimeOffset.Now);
            
            await _goldPriceService.UpdateGoldPriceAsync();
            
            await Task.Delay(TimeSpan.FromMinutes(60), stoppingToken);
        }
    }
}