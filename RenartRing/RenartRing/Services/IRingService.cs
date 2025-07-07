using RenartRing.Models;

namespace RenartRing.Services;

public interface IRingService
{   
    Task<RingsDTO> GetRingsAsync(int page);
    Task<Ring?> GetRingAsync(int id);
    Task<IEnumerable<Ring>> PostRingsAsync(IEnumerable<Ring> rings);
}