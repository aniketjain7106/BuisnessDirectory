using DirectoryManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace DirectoryManagement.Data
{
    public class DirectoryDbContext : DbContext
{
    public DirectoryDbContext(DbContextOptions<DirectoryDbContext> options) : base(options) { }
    public DbSet<Business> Businesses { get; set; }
    public DbSet<Category> Categories { get; set; }
}

}
