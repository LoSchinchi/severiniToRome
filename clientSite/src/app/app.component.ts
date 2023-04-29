import {Component, HostListener, OnInit} from '@angular/core';
import {PagesControlService} from './pagesControl.service';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  inner_width: undefined | number;
  title: string = 'clientSite';
  page: string = 'home';

  ngOnInit() {
    this.inner_width = window.innerWidth;
  }

  constructor(public pageService: PagesControlService, private router: Router) {
    this.router.events.forEach((event: any) => {
      if(event instanceof NavigationEnd)
        this.routeToPage(event.url);
    })
  }

  routeToPage(url: string) {
    if(url === '/')
      this.pageService.pageSelected = 'home';
    else if(url === '/instructions' || url === '/downloads')
      this.pageService.pageSelected = url.substring(1);
    else
      this.pageService.pageSelected = 'let\' play';
  }

  getPage(): string {
    return this.pageService.pageSelected;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.inner_width = window.innerWidth;
  }
}
