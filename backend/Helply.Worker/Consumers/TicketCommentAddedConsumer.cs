using Helply.MessagingContracts;
using MassTransit;

namespace Helply.Worker.Consumers;

public sealed class TicketCommentAddedConsumer : IConsumer<TicketCommentAdded>
{
    private readonly ILogger<TicketCommentAddedConsumer> _logger;

    public TicketCommentAddedConsumer(ILogger<TicketCommentAddedConsumer> logger) => _logger = logger;

    public async Task Consume(ConsumeContext<TicketCommentAdded> context)
    {
        var m = context.Message;

        _logger.LogInformation("ticket_comment_added: {TicketId} at {At}", m.TicketId, m.AddedAt);

        if (m.UserId == m.AuthorId)
        {
            _logger.LogInformation("Skipping notification for author (UserId == AuthorId == {UserId})", m.UserId);
            return;
        }

        await context.Publish(new TicketNotification
        {
            NotificationId = Guid.NewGuid(),
            UserId = m.UserId,
            TicketId = m.TicketId,
            Type = 1
        }, context.CancellationToken);
    }
}
