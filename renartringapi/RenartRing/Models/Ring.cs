using System.ComponentModel.DataAnnotations;

namespace RenartRing.Models;

public class Ring
{
    [Key]
    public int RingId { get; set; }
    public string Name { get; set; }
    public double PopularityScore { get; set; }
    public double Weight { get; set; }
    public RingColors Images { get; set; } 
}

public class RingColors
{
    public string Yellow { get; set; }
    public string Rose { get; set; }
    public string White { get; set; }
}