// Services/IGoldPriceService.cs

using RenartRing.Models;

public interface IGoldPriceService
{
    Task<GoldPriceDto> GetCurrentGoldPriceAsync();
    Task UpdateGoldPriceAsync();
}