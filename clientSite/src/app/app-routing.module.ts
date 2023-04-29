import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InstructionsPageComponent} from './instructions-page/instructions-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import {DownloadsPageComponent} from './downloads-page/downloads-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'instructions', component: InstructionsPageComponent },
  { path: 'downloads', component: DownloadsPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
