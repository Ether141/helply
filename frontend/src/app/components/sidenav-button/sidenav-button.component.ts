import { Component, Input } from "@angular/core";
import { MatRippleModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
    selector: 'app-sidenav-button',
    imports: [MatIconModule, RouterLink, RouterLinkActive, MatTooltipModule, MatRippleModule],
    templateUrl: './sidenav-button.component.html',
    styleUrls: ['./sidenav-button.component.scss']
})
export class SidenavButton {
    @Input() label: string = "Sidenav Button";
    @Input() icon: string = "";
    @Input() link: string = "";
    @Input() mini: boolean = false;
}