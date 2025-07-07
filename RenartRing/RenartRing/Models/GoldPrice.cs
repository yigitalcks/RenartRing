using System.Text.Json.Serialization;

namespace RenartRing.Models;

public class GoldPriceDto
{
    public decimal Price { get; set; }
    public DateTime LastUpdatedUtc { get; set; }
}

public class ExternalGoldPrice
{
    [JsonPropertyName("price_gram_24k")]
    public decimal PriceGram24k { get; set; }
    [JsonPropertyName("timestamp")]
    public long Timestamp { get; set; }
}