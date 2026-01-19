import { TicketStatus } from './ticket-status';
import { TicketPriority } from './ticket-priority';

export interface Ticket {
  id: string;
  slug: number;
  title: string;
  description: string;
  categoryName: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  userId: number;
  assistantId: number | null;
  authorName: string;
  assistantName: string | null;
}
