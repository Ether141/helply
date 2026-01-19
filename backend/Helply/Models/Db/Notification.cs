using System.ComponentModel.DataAnnotations.Schema;

namespace Helply.Models.Db;

public class Notification
{
    public Guid Id { get; set; }
    public NotificationType Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }

    [ForeignKey(nameof(Ticket))]
    public Guid TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;

    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}
