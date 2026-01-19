import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDate',
  standalone: true,
})
export class LocalDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '—';
    }

    const date = this.toDate(value);
    if (!date || Number.isNaN(date.getTime())) {
      return '—';
    }

    const day = this.pad2(date.getDate());
    const month = this.pad2(date.getMonth() + 1);
    const year = String(date.getFullYear());
    const hours = this.pad2(date.getHours());
    const minutes = this.pad2(date.getMinutes());

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  private toDate(value: string | Date): Date | null {
    if (value instanceof Date) {
      return value;
    }

    const raw = value.trim();
    if (!raw) {
      return null;
    }

    const normalized = this.normalizeUtcString(raw);
    return new Date(normalized);
  }

  private normalizeUtcString(value: string): string {
    if (/[zZ]$/.test(value) || /[+-]\d{2}:\d{2}$/.test(value) || /[+-]\d{4}$/.test(value)) {
      return value;
    }

    const withT = value.includes(' ') ? value.replace(' ', 'T') : value;

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,9})?)?$/.test(withT)) {
      return `${withT}Z`;
    }

    return value;
  }

  private pad2(value: number): string {
    return String(value).padStart(2, '0');
  }
}
