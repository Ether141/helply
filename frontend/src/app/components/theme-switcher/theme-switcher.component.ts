import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

type Theme = 'light' | 'dark';

@Component({
    selector: 'app-theme-switcher',
    imports: [MatIconModule, MatButtonModule, MatTooltipModule],
    templateUrl: './theme-switcher.component.html',
})
export class ThemeSwitcherComponent implements OnInit {
    private themes: Theme[] = ['light', 'dark'];

    currentTheme: Theme = 'light';
    currentIcon: string = 'light_mode';

    ngOnInit(): void {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme && this.themes.includes(savedTheme)) {
            this.setTheme(savedTheme);
        } else {
            this.setTheme('light');
        }
    }

    toggleTheme(): void {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.setTheme(this.themes[nextIndex]);
    }

    private setTheme(theme: Theme): void {
        this.currentTheme = theme;
        this.updateIcon();

        const root = document.documentElement;

        if (this.currentTheme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }

        root.style.colorScheme = this.currentTheme;
        localStorage.setItem('theme', this.currentTheme);
    }

    private updateIcon(): void {
        switch (this.currentTheme) {
            case 'light':
                this.currentIcon = 'light_mode';
                break;
            case 'dark':
                this.currentIcon = 'dark_mode';
                break;
        }
    }
}