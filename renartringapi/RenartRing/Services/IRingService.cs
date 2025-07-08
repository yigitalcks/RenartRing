using RenartRing.Models;

namespace RenartRing.Services;

public interface IRingService
{   
    Task<RingsDTO> GetRingsAsync(int page);
    Task<Ring?> GetRingAsync(int id);
    Task<RingsDTO> GetRingsByPriceRangeAsync(decimal minPrice, decimal maxPrice, int page);
    Task<IEnumerable<Ring>> PostRingsAsync(IEnumerable<Ring> rings);
}