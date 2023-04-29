import {Component, OnInit} from '@angular/core';
import {PagesControlService} from "../pagesControl.service";


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  constructor(public pageService: PagesControlService) { }

  ngOnInit() {
    setInterval(() => console.log(this.getPageSel()), 1000);
  }

  changePage(newPage: string) {
    this.pageService.pageSelected = newPage;
  }

  getNamePages(): Array<string> {
    return this.pageService.NAME_PAGES;
  }
  getPageSel(): string {
    return this.pageService.pageSelected
  }


}
