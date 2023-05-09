import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PagesControlService {
  NAME_PAGES: string[] = ['home', 'instructions', 'downloads', 'let\'s play'];
  pageSelected: string = 'home';
  ROUTES: string[] = ['/', '/instructions', '/downloads', '/game'];
  isSidebarOpened: boolean = false;
  isFullScreen = false;
}
