using System.ComponentModel.DataAnnotations.Schema;

namespace Helply.Models.Db;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public UserRole Role { get; set; } = UserRole.User;

    [InverseProperty(nameof(Ticket.User))]
    public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();

    [InverseProperty(nameof(Ticket.Assistant))]
    public ICollection<Ticket> AssignedTickets { get; set; } = new List<Ticket>();

    [InverseProperty(nameof(TicketComment.Author))]
    public ICollection<TicketComment> TicketComments { get; set; } = new List<TicketComment>();

    [InverseProperty(nameof(RefreshToken.User))]
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public string GetFullName() => $"{FirstName} {LastName}";
}

