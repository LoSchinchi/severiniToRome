import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructionsPageComponent } from './instructions-page/instructions-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { DownloadsPageComponent } from './downloads-page/downloads-page.component';
import { GamePageComponent } from "./game-page/game-page.component";

const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'Severini | Home' },
  { path: 'instructions', component: InstructionsPageComponent, title: 'Severini | Instructions' },
  { path: 'downloads', component: DownloadsPageComponent, title: 'Severini | Downloads' },
  { path: 'game', component: GamePageComponent, title: 'Severini | Play' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
