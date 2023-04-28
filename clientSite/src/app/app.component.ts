import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  inner_width: undefined | number;
  title: string = 'clientSite';

  ngOnInit() {
    this.inner_width = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.inner_width = window.innerWidth;
  }
}
