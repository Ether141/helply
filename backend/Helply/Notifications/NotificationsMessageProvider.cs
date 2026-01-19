using Helply.Models.Db;

namespace Helply.Notifications;

public static class NotificationsMessageProvider
{
    public static string GetNotificationMessage(NotificationType notificationType, in Ticket ticket) => notificationType switch
    {
        NotificationType.TicketStatusChanged => $"Status zgłoszenia został zmieniony na: {TicketStatusToNiceString(ticket.Status)}",
        NotificationType.NewTicketComment => $"Nowy komentarz został dodany do zgłoszenia.",
        NotificationType.TicketAssigned => $"Asystent przypisany do zgłoszenia został zmieniony.",
        _ => $"Nowa powiad omienie dotyczące zgłoszenia.",
    };

    public static string TicketStatusToNiceString(TicketStatus status) => status switch
    {
        TicketStatus.Open => "Otwarte",
        TicketStatus.InProgress => "W trakcie realizacji",
        TicketStatus.WaitingForCustomer => "Oczekujące na klienta",
        TicketStatus.OnHold => "Wstrzymane",
        TicketStatus.Resolved => "Rozwiązane",
        TicketStatus.Closed => "Zamknięte",
        _ => "Nieznany status",
    };
}
