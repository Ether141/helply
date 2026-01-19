using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Helply.Models.Db;

public class TicketComment
{
    public Guid Id { get; set; }

    [Required]
    [ForeignKey(nameof(Ticket))]
    public Guid TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;

    [Required]
    [MaxLength(4000)]
    public string Content { get; set; } = null!;

    [ForeignKey(nameof(Author))]
    public Guid AuthorId { get; set; }
    public User Author { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
