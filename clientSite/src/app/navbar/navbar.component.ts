import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  OPTIONS: [string, string, string, string] = ['home', 'instructions', 'downloads', 'let\'s play'];

  option: string = 'home';
}
