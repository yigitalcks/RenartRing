using Microsoft.EntityFrameworkCore;
using RenartRing.Models;

namespace RenartRing.Data;

public class ApplicationDbContext: DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<Ring> Rings { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Ring>()
            .Property(u => u.RingId)
            .UseIdentityByDefaultColumn();
        
        modelBuilder.Entity<Ring>()
            .OwnsOne(r => r.Images);
    }
}