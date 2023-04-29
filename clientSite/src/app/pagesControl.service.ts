import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PagesControlService {
  NAME_PAGES: Array<string> = ['home', 'instructions', 'downloads', 'let\'s play'];
  pageSelected = 'home';
  ROUTES: Array<string> = ['/', '/instructions', '/downloads', '/game'];
  isSidebarOpened: boolean = false;
}
