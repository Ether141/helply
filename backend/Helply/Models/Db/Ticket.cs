using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Helply.Models.Db;

public class Ticket
{
    public Guid Id { get; set; }
    public int Slug { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = null!;

    [Required]
    [MaxLength(4000)]
    public string Description { get; set; } = null!;

    public TicketStatus Status { get; set; } = TicketStatus.Open;
    public Priority Priority { get; set; } = Priority.Medium;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    [ForeignKey(nameof(Assistant))]
    public Guid? AssistantId { get; set; }
    public User? Assistant { get; set; }

    [ForeignKey(nameof(Category))]
    public Guid TicketCategoryId { get; set; }
    public TicketCategory Category { get; set; } = null!;
}
