import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuOpen: boolean = false;
  iconMenu: string = 'menu';
  OPTIONS: [[string, string], [string, string], [string, string], [string, string]] = [
    [ 'home', 'Home' ],
    [ 'integration_instructions', 'Instructions' ],
    [ 'download', 'Downloads' ],
    [ 'play_arrow', 'Let\'s play' ]
  ];
  option: string = 'home';

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.iconMenu = this.iconMenu === 'menu'? 'close': 'menu';
  }

  setNewVoice(opt: string): void {
    this.option = opt;
    setTimeout(() => this.toggleMenu(), 1000);
  }
}
