using Helply.MessagingContracts;
using Helply.Models.Db;
using Helply.Models.Dto.Tickets;
using Helply.Repository;
using Helply.Utilities;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Helply.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IPublishEndpoint _publishEndpoint;

    public TicketController(AppDbContext db, IPublishEndpoint publishEndpoint)
    {
        _db = db;
        _publishEndpoint = publishEndpoint;
    }

    [Authorize]
    [HttpPost("create")]
    public async Task<ActionResult<TicketResponse>> Create([FromBody] CreateTicketRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        if (_db.TicketCategories.All(c => c.Id != request.CategoryId))
        {
            ModelState.AddModelError("CategoryId", "Invalid category ID.");
            return ValidationProblem(ModelState);
        }

        var ticket = new Ticket
        {
            Id = Guid.NewGuid(),
            Slug = _db.Tickets.AsNoTracking().Count(),
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Status = TicketStatus.Open,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            UserId = User.GetUserId(),
            TicketCategoryId = request.CategoryId,
            Priority = request.Priority
        };

        _db.Tickets.Add(ticket);
        await _db.SaveChangesAsync();

        ticket.Category = await _db.TicketCategories.FirstAsync(c => c.Id == request.CategoryId);
        ticket.User = await _db.Users.FirstAsync(u => u.Id == ticket.UserId);

        return Ok(ToResponse(ticket));
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<TicketResponse>>> ListMy()
    {
        var userId = User.GetUserId();
        var tickets = await _db.Tickets
            .Include(t => t.Category)
            .Include(t => t.User)
            .Include(t => t.Assistant)
            .Where(t => (User.GetRole().Equals("user", StringComparison.OrdinalIgnoreCase) && t.UserId == userId) || (User.GetRole().Equals("assistant", StringComparison.OrdinalIgnoreCase) && t.AssistantId == userId))
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => ToResponse(t))
            .ToListAsync();
        return Ok(tickets);
    }

    [Authorize(Roles = "Assistant")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TicketResponse>>> ListAll()
    {
        var tickets = await _db.Tickets
            .Include(t => t.Category)
            .Include(t => t.User)
            .Include(t => t.Assistant)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => ToResponse(t))
            .ToListAsync();
        return Ok(tickets);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<TicketResponse>> Get(Guid id)
    {
        var ticket = await _db.Tickets.Include(t => t.Category).Include(t => t.User).Include(t => t.Assistant).FirstOrDefaultAsync(t => t.Id == id);

        if (ticket == null)
            return NotFound();

        var userId = User.GetUserId();
        var isAssistant = User.IsInRole("Assistant");

        if (!isAssistant && ticket.UserId != userId)
            return Forbid();

        return Ok(ToResponse(ticket));
    }

    [Authorize]
    [HttpPost("{id}/comments")]
    public async Task<ActionResult> AddComment(Guid id, [FromBody] AddCommentRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);
        if (ticket == null)
            return NotFound();

        var userId = User.GetUserId();
        var isAssistant = User.IsInRole("Assistant");
        if (!isAssistant && ticket.UserId != userId)
            return Forbid();

        var comment = new TicketComment
        {
            Id = Guid.NewGuid(),
            TicketId = ticket.Id,
            Content = request.Content.Trim(),
            AuthorId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _db.TicketComments.Add(comment);
        ticket.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        await _publishEndpoint.Publish(new TicketCommentAdded
        {
            TicketId = ticket.Id,
            AddedAt = DateTime.UtcNow,
            UserId = ticket.UserId
        });

        return Ok();
    }

    [Authorize]
    [HttpGet("{id}/comments")]
    public async Task<ActionResult<IEnumerable<TicketCommentResponse>>> ListComments(Guid id)
    {
        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);

        if (ticket == null)
            return NotFound();

        var userId = User.GetUserId();
        var isAssistant = User.IsInRole("Assistant");

        if (!isAssistant && ticket.UserId != userId)
            return Forbid();

        var comments = await _db.TicketComments
            .Include(c => c.Author)
            .Where(c => c.TicketId == id)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new TicketCommentResponse
            {
                Content = c.Content,
                AuthorName = c.Author.GetFullName(),
                CreatedAt = c.CreatedAt,
                IsOwnerComment = c.AuthorId == ticket.UserId
            })
            .ToListAsync();
        return Ok(comments);
    }

    [Authorize(Roles = "Assistant")]
    [HttpPost("{id}/assign")]
    public async Task<ActionResult> Assign(Guid id)
    {
        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);
        if (ticket == null)
            return NotFound();

        ticket.AssistantId = User.GetUserId();
        ticket.Status = TicketStatus.InProgress;
        ticket.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok();
    }

    [Authorize(Roles = "Assistant")]
    [HttpPost("{id}/status/{status}")]
    public async Task<ActionResult> ChangeStatus(Guid id, TicketStatus status)
    {
        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);

        if (ticket == null)
            return NotFound();

        TicketStatus oldStatus = ticket.Status;

        ticket.Status = status;
        ticket.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        await _publishEndpoint.Publish(new TicketStatusChanged
        {
            TicketId = ticket.Id,
            ChangedAt = DateTime.UtcNow,
            UserId = ticket.UserId
        });

        return Ok();
    }

    [Authorize(Roles = "Assistant")]
    [HttpPost("{id}/priority/{priority}")]
    public async Task<ActionResult> ChangePriority(Guid id, Priority priority)
    {
        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);

        if (ticket == null)
            return NotFound();

        ticket.Priority = priority;
        ticket.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok();
    }

    [Authorize]
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<CategoryDTO>>> ListCategories()
    {
        var categories = await _db.TicketCategories
            .AsNoTracking()
            .Select(c => new CategoryDTO
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description
            })
            .ToListAsync();

        return Ok(categories);
    }

    [Authorize]
    [HttpGet("summary")]
    public async Task<ActionResult<TicketSummaryResponse>> GetSummary()
    {
        var query = _db.Tickets.AsNoTracking();

        var openTickets = await query.CountAsync(t => t.Status == TicketStatus.Open);
        var inProgressTickets = await query.CountAsync(t => t.Status == TicketStatus.InProgress);
        var waitingForCustomerTickets = await query.CountAsync(t => t.Status == TicketStatus.WaitingForCustomer);
        var onHoldTickets = await query.CountAsync(t => t.Status == TicketStatus.OnHold);
        var resolvedTickets = await query.CountAsync(t => t.Status == TicketStatus.Resolved);
        var closedTickets = await query.CountAsync(t => t.Status == TicketStatus.Closed);

        var summary = new TicketSummaryResponse
        {
            Open = openTickets,
            InProgress = inProgressTickets,
            WaitingForCustomer = waitingForCustomerTickets,
            OnHold = onHoldTickets,
            Resolved = resolvedTickets,
            Closed = closedTickets
        };

        return Ok(summary);
    }

    private static TicketResponse ToResponse(Ticket t) => new()
    {
        Id = t.Id,
        Slug = t.Slug,
        Title = t.Title,
        Description = t.Description,
        Status = t.Status,
        CreatedAt = t.CreatedAt,
        UpdatedAt = t.UpdatedAt,
        UserId = t.UserId,
        AssistantId = t.AssistantId,
        CategoryName = t.Category.Name,
        Priority = t.Priority,
        AuthorName = t.User.GetFullName(),
        AssistantName = t.Assistant?.GetFullName()
    };
}
