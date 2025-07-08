using System.Text.Json.Serialization;

namespace RenartRing.Models;

public class GoldPriceDto
{
    public decimal Price { get; set; }
    public DateTime LastUpdatedUtc { get; set; }
}

public class ExternalGoldPrice
{
    [JsonPropertyName("rates")]
    public Rates Rates { get; set; }
    [JsonPropertyName("timestamp")]
    public long Timestamp { get; set; }
}

public class Rates
{
    [JsonPropertyName("USDXAU")]
    public decimal PriceOunce24k { get; set; }

    [JsonPropertyName("XAU")]
    public decimal XauRate { get; set; }
}