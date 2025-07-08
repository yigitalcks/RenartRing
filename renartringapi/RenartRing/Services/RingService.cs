using Microsoft.EntityFrameworkCore;
using RenartRing.Models;
using RenartRing.Data;

namespace RenartRing.Services;

public class RingService: IRingService
{
    private readonly ApplicationDbContext _context;
    private readonly IGoldPriceService _goldPriceService;
    private const int PageSize = 4;
    
    public RingService(ApplicationDbContext context, IGoldPriceService goldPriceService)
    {
        _context = context;
        _goldPriceService = goldPriceService;
    }
    
    public async Task<Ring?> GetRingAsync(int id)
    {
        return await _context.Rings
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.RingId == id);
    }

    public async Task<RingsDTO> GetRingsAsync(int page)
    {
        var totalItems = await _context.Rings.CountAsync();
        
        var rings = await _context.Rings
            .AsNoTracking()
            .OrderBy(r => r.RingId)
            .Skip((page - 1) * PageSize)
            .Take(PageSize)
            .ToListAsync();
        
        var totalPages = (int)Math.Ceiling(totalItems / (double)PageSize);

        var goldData = await _goldPriceService.GetCurrentGoldPriceAsync();
        var paginationInfo = new PaginationInfo
        {
            CurrentPage = page,
            PageSize = PageSize,
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasNextPage = page < totalPages
        };
        
        return new RingsDTO
        {
            Data = rings,
            GoldData = goldData,
            Pagination = paginationInfo
        };
    }
    
    public async Task<RingsDTO> GetRingsByPriceRangeAsync(decimal minPrice, decimal maxPrice, int page)
    {
        var goldData = await _goldPriceService.GetCurrentGoldPriceAsync();
        
        var query = _context.Rings
            .AsNoTracking()
            .Where(r => (decimal)r.Weight * goldData.Price >= minPrice &&
                        (decimal)r.Weight * goldData.Price <= maxPrice);

        var totalItems = await query.CountAsync();
    
        var rings = await query
            .OrderBy(r => r.RingId)
            .Skip((page - 1) * PageSize)
            .Take(PageSize)
            .ToListAsync();
    
        var totalPages = (int)Math.Ceiling(totalItems / (double)PageSize);
        
        var paginationInfo = new PaginationInfo
        {
            CurrentPage = page,
            PageSize = PageSize,
            TotalItems = totalItems,
            TotalPages = totalPages,
            HasNextPage = page < totalPages
        };

        return new RingsDTO
        {
            Data = rings,
            GoldData = goldData,
            Pagination = paginationInfo
        };
    }
    
    public async Task<IEnumerable<Ring>> PostRingsAsync(IEnumerable<Ring> rings)
    {
        await _context.Rings.AddRangeAsync(rings);
        await _context.SaveChangesAsync();
        
        return rings;
    }
}