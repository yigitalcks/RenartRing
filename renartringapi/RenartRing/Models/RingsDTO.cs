namespace RenartRing.Models;

public class RingsDTO
{
    public List<Ring> Data { get; set; }
    public GoldPriceDto GoldData { get; set; }
    public PaginationInfo Pagination { get; set; }
}

public class PaginationInfo
{
    public int CurrentPage { get; set; }
    public int PageSize { get; set; }
    public int TotalItems { get; set; }
    public int TotalPages { get; set; }
    public bool HasNextPage { get; set; }
}
