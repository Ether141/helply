import { Injectable } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

interface Icon {
  name: string;
  path: string;
  namespace: string | null;
}

const ICONS: Icon[] = [
  { name: 'app-logo', path: 'full-logo.svg', namespace: null }
]

@Injectable({ providedIn: 'root' })
export class IconService {
  private readonly basePath: string = '/assets/'

  constructor(
    private readonly registry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer
  ) {}

  register(name: string, path: string, namespace?: string | null): void {
    const url = this.safeUrl(this.basePath + path);

    if (namespace) {
      this.registry.addSvgIconInNamespace(namespace, name, url);
    } else {
      this.registry.addSvgIcon(name, url);
    }
  }

  registerAll(): void {
    ICONS.forEach(icon => this.register(icon.name, icon.path, icon.namespace));
  }

  private safeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}