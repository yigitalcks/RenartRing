using RenartRing.Services;
using RenartRing.Models;
using Microsoft.AspNetCore.Mvc;

namespace RenartRing.Controllers;

[ApiController]
[Route("api/rings")]
public class RingController : ControllerBase
{
    private readonly IRingService _service;

    public RingController(IRingService service)
    {
        _service = service;
    }

    [HttpGet("{RingId}")]
    public async Task<ActionResult<Ring>> GetRing(int RingId)
    {
        var ring = await _service.GetRingAsync(RingId);
        if (ring != null)
        {
            return NotFound();
        }

        return Ok(ring);
    }

    [HttpGet]
    public async Task<ActionResult<List<Ring>>> GetRings(
        int page = 1,
        decimal? minPrice = null,
        decimal? maxPrice = null)
    {
        if (page < 1) 
            page = 1;

        RingsDTO rings;
        if (minPrice.HasValue && maxPrice.HasValue)
        {
            rings = await _service.GetRingsByPriceRangeAsync(minPrice.Value, maxPrice.Value, page);
        }
        else
        {
            rings = await _service.GetRingsAsync(page);
        }
        
        return Ok(rings);
    }

    [HttpPost]
    public async Task<ActionResult<Ring?>> PostRings(IEnumerable<Ring> rings)
    {
        try
        {
            var addedRings = await _service.PostRingsAsync(rings);
            if (!addedRings.Any())
            {
                return StatusCode(500, "Unable to create the rings. Please try again later.");
            }

            return Created(nameof(PostRings), addedRings);
        }
        catch (ArgumentNullException ex)
        {
            return BadRequest(new { Message = "Invalid input. Missing required data.", Details = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An unexpected error occurred.", Details = ex.Message });
        }
    }
}