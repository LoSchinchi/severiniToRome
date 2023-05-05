import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructionsPageComponent } from './instructions-page/instructions-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { DownloadsPageComponent } from './downloads-page/downloads-page.component';
import { GamePageComponent } from "./game-page/game-page.component";

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'instructions', component: InstructionsPageComponent },
  { path: 'downloads', component: DownloadsPageComponent },
  { path: 'game', component: GamePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
