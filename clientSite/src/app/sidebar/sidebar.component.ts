import { Component } from '@angular/core';
import { PagesControlService } from "../pagesControl.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  menuOpen: boolean = false;
  iconMenu: string = 'menu';

  ICONS: Array<string> = ['home', 'integration_instructions', 'download', 'play_arrow'];

  constructor(public pageService: PagesControlService) { }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.iconMenu = this.iconMenu === 'menu'? 'close': 'menu';
    this.pageService.isSidebarOpened = this.menuOpen;
  }

  setNewVoice(page: string): void {
    this.pageService.pageSelected = page;
    setTimeout(() => this.toggleMenu(), 200);
  }

  getNamePages(): Array<string> {
    return this.pageService.NAME_PAGES;
  }
  getPageSel(): string {
    return this.pageService.pageSelected
  }
  getRoutes(): Array<string> {
    return this.pageService.ROUTES;
  }
}
