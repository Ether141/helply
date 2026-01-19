using Helply.Models.Dto.Notifications;
using Helply.Notifications;
using Helply.Repository;
using Helply.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Helply.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly AppDbContext _db;

    public NotificationController(AppDbContext db)
    {
        _db = db;
    }

    [Authorize]
    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<NotificationResponse>>> GetAll()
    {
        var notifications = _db.Notifications
            .AsNoTrackingWithIdentityResolution()
            .Include(n => n.Ticket)
            .Where(n => !n.IsRead && n.UserId == User.GetUserId())
            .Select(n => new NotificationResponse
            {
                NotificationId = n.Id,
                TicketId = n.TicketId,
                TicketSlug = n.Ticket.Slug,
                Message = NotificationsMessageProvider.GetNotificationMessage(n.Type, n.Ticket),
                CreatedAt = n.CreatedAt
            });

        return Ok(notifications);
    }

    [Authorize]
    [HttpPost("read/{notificationId}")]
    public async Task<ActionResult> MarkAsRead(string notificationId)
    {
        if (!Guid.TryParse(notificationId, out var id))
        {
            return BadRequest("Invalid notification ID format.");
        }

        var notification = await _db.Notifications.FirstOrDefaultAsync(n => n.Id == id);

        if (notification == null) return NotFound();

        notification.IsRead = true;

        await _db.SaveChangesAsync();
        return NoContent();
    }
}
