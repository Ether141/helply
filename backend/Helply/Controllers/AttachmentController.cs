using Helply.Files;
using Helply.Models.Db;
using Helply.Models.Dto.Attachments;
using Helply.Repository;
using Helply.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Helply.Controllers;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class AttachmentController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IFileManager _fileManager;
    private readonly ILogger<AttachmentController> _logger;

    public AttachmentController(AppDbContext db, IFileManager fileManager, ILogger<AttachmentController> logger)
    {
        _db = db;
        _fileManager = fileManager;
        _logger = logger;
    }

    [HttpGet("download/{attachmentId}")]
    public async Task<IActionResult> DownloadAttachment(Guid attachmentId)
    {
        Attachment? attachment = await _db.Attachments.FirstOrDefaultAsync(a => a.Id == attachmentId);

        if (attachment == null)
        {
            return NotFound("Attachment not found.");
        }

        var fileStream = await _fileManager.GetFileAsync(attachment.RelativePath);

        if (fileStream == null)
        {
            return NotFound("File not found on server.");
        }

        return File(fileStream, attachment.FileType, attachment.FileName);
    }

    [HttpGet("list/{ticketId}")]
    public async Task<ActionResult<IEnumerable<AttachmentResponse>>> ListAllForTicket(Guid ticketId)
    {
        Ticket? ticket = await _db.Tickets.AsNoTracking().FirstOrDefaultAsync(t => t.Id == ticketId);

        if (ticket == null)
        {
            return NotFound("Ticket not found.");
        }

        var attachments = await _db.Attachments.Where(a => a.TicketId == ticketId).Select(a => new AttachmentResponse { Id = a.Id, FileName = a.FileName }).ToListAsync();
        return Ok(attachments);
    }

    [HttpPost("upload/{ticketId}")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ActionResult> Upload(Guid ticketId, [FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded or empty.");
        }

        var extension = Path.GetExtension(file.FileName);

        if (!AllowedFiles.IsExtensionAllowed(extension) || !AllowedFiles.IsContentTypeAllowed(file.ContentType))
        {
            _logger.LogWarning("File type not allowed: {FileName} with content type {ContentType}", file.FileName, file.ContentType);
            return BadRequest("File type not allowed.");
        }

        Ticket? ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == ticketId);

        if (ticket == null)
        {
            return NotFound("Ticket not found.");
        }

        using var stream = file.OpenReadStream();
        string? storedFileRelativePath = await _fileManager.SaveFileAsync(stream, file.FileName, ticketId.ToString());

        if (storedFileRelativePath == null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Error saving file.");
        }

        await _db.Attachments.AddAsync(new Attachment
        {
            Id = Guid.NewGuid(),
            FileName = file.FileName,
            RelativePath = storedFileRelativePath,
            FileSize = file.Length,
            FileType = file.ContentType,
            CreatedAt = DateTime.UtcNow,
            AuthorId = User.GetUserId(),
            TicketId = ticketId
        });

        await _db.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{attachmentId}")]
    public async Task<IActionResult> DeleteAttachment(Guid attachmentId)
    {
        Attachment? attachment = await _db.Attachments.FirstOrDefaultAsync(a => a.Id == attachmentId);

        if (attachment == null)
        {
            return NotFound("Attachment not found.");
        }

        _db.Attachments.Remove(attachment);

        await _fileManager.DeleteFileAsync(attachment.RelativePath);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Deleted attachment {AttachmentId}", attachmentId);

        return Ok();
    }
}
