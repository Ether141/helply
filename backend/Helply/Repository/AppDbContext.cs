using Helply.Models.Db;
using Microsoft.EntityFrameworkCore;

namespace Helply.Repository;

public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<TicketComment> TicketComments { get; set; }
    public DbSet<TicketCategory> TicketCategories { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Attachment> Attachments { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}
