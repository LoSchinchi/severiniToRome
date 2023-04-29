import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class PagesControlService {
  NAME_PAGES: [string, string, string, string] = ['home', 'instructions', 'downloads', 'let\'s play'];

  pageSelected = 'home';
}
