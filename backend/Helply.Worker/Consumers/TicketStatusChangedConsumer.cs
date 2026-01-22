using Helply.MessagingContracts;
using MassTransit;

namespace Helply.Worker.Consumers;

public sealed class TicketStatusChangedConsumer : IConsumer<TicketStatusChanged>
{
    private readonly ILogger<TicketStatusChangedConsumer> _logger;

    public TicketStatusChangedConsumer(ILogger<TicketStatusChangedConsumer> logger) => _logger = logger;

    public async Task Consume(ConsumeContext<TicketStatusChanged> context)
    {
        var m = context.Message;

        _logger.LogInformation("ticket_status_changed: {TicketId} at {At}", m.TicketId, m.ChangedAt);

        await context.Publish(new TicketNotification()
        {
            NotificationId = Guid.NewGuid(),
            UserId = m.UserId,
            TicketId = m.TicketId,
            Type = 0
        }, context.CancellationToken);
    }
}
