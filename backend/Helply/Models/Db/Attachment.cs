using System.ComponentModel.DataAnnotations.Schema;

namespace Helply.Models.Db;

public class Attachment
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = null!;
    public string RelativePath { get; set; } = null!;
    public string FileType { get; set; } = null!;
    public long FileSize { get; set; }
    public DateTime CreatedAt { get; set; }

    [ForeignKey(nameof(Author))]
    public Guid AuthorId { get; set; }
    public User Author { get; set; } = null!;

    [ForeignKey(nameof(Ticket))]
    public Guid TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;
}
