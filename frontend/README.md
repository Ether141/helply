# Helply

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## REST API (backend)

Projekt ma przygotowaną warstwę do pracy z REST API:

- Konfiguracja base URL: [src/environments/environment.ts](src/environments/environment.ts) (`apiBaseUrl`)
- Klient HTTP: [src/app/core/api/api-client.service.ts](src/app/core/api/api-client.service.ts) (`ApiClient`)
- Interceptory: [src/app/core/api/api.interceptors.ts](src/app/core/api/api.interceptors.ts)

### Konfiguracja

Domyślnie `apiBaseUrl` jest ustawione na `'/api'` (względny adres), co dobrze współgra z reverse-proxy/proxy.

Build produkcyjny automatycznie podmienia environment na [src/environments/environment.production.ts](src/environments/environment.production.ts).

### Użycie

Przykład wywołania:

```ts
import { Component, inject } from '@angular/core';
import { ApiClient } from './core/api/api-client.service';
import { ApiError } from './core/api/api-error';

@Component({
	selector: 'app-example',
	template: ''
})
export class ExampleComponent {
	private readonly api = inject(ApiClient);

	load(): void {
		this.api.get<{ id: string; title: string }[]>('/tickets').subscribe({
			next: (tickets) => console.log(tickets),
			error: (err: ApiError) => console.error(err.message, err.status)
		});
	}
}
```
