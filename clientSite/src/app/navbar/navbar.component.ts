import { Component } from '@angular/core';
import { PagesControlService } from '../pagesControl.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
  constructor(public pageService: PagesControlService) { }

  changePage(newPage: string) {
    this.pageService.pageSelected = newPage;
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
