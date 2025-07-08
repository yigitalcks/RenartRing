using System.Text.Json.Serialization;

namespace RenartRing.Models;

public class GoldPriceDto
{
    public decimal Price { get; set; }
    public DateTime LastUpdatedUtc { get; set; }
}

public class ExternalGoldPrice
{
    [JsonPropertyName("USDXAU")]
    public decimal PriceOunce24k { get; set; }
    [JsonPropertyName("timestamp")]
    public long Timestamp { get; set; }
}