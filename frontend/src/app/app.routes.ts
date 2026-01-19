import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { createTicketGuard } from './core/auth/create-ticket.guard';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
		canMatch: [authGuard],
		children: [
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{
				path: 'dashboard',
				loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
			},
			{
				path: 'ticket/:id',
				loadComponent: () => import('./pages/ticket/ticket.component').then(m => m.TicketComponent)
			},
			{ path: 'ticket', redirectTo: 'tickets', pathMatch: 'full' },
			{
				path: 'create-ticket',
				loadComponent: () => import('./pages/create-ticket/create-ticket.component').then(m => m.CreateTicketComponent),
				canMatch: [createTicketGuard]
			},
			{
				path: 'tickets',
				loadComponent: () => import('./pages/tickets/tickets.component').then(m => m.TicketsComponent)
			}
		]
	},
	{
		path: 'auth',
		loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
		children: [
			{
				path: 'login',
				loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
			},
			{
				path: 'register',
				loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
			},
			{ path: '', redirectTo: 'login', pathMatch: 'full' }
		]
	},
	{ path: '**', redirectTo: '' }
];
