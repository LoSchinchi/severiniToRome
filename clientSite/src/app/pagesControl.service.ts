import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class PagesControlService {
  NAME_PAGES: string[] = ['home', 'instructions', 'downloads', 'play'];
  pageSelected: string = 'home';
  ROUTES: string[] = ['/', '/instructions', '/downloads', '/game'];
  isSidebarOpened: boolean = false;
  isFullScreen: boolean = false;
  gamePageActive: string = 'home';
  withTrack: boolean | undefined;
}
