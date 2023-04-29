import {Component, HostListener, OnInit} from '@angular/core';
import {PagesControlService} from "./pagesControl.service";

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

  constructor(public pageService: PagesControlService) { }

  getPage(): string {
    return this.pageService.pageSelected;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.inner_width = window.innerWidth;
  }
}
