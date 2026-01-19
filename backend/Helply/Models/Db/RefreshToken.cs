using System.ComponentModel.DataAnnotations.Schema;

namespace Helply.Models.Db;

public class RefreshToken
{
    public Guid Id { get; set; }

    public string TokenHash { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? RevokedAt { get; set; }

    [ForeignKey(nameof(User))]
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public bool IsActive => RevokedAt == null && DateTime.UtcNow <= ExpiresAt;
}
