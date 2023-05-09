import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from '@angular/material/icon';
import { HomePageComponent } from './home-page/home-page.component';
import { InstructionsPageComponent } from './instructions-page/instructions-page.component';
import { DownloadsPageComponent } from './downloads-page/downloads-page.component';
import {MatExpansionModule} from "@angular/material/expansion";
import { GameHomePageComponent } from './game-home-page/game-home-page.component';
import { GamePageComponent } from './game-page/game-page.component';
import {MatRadioModule} from "@angular/material/radio";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {NgForOf} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    HomePageComponent,
    InstructionsPageComponent,
    DownloadsPageComponent,
    GameHomePageComponent,
    GamePageComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatIconModule,
        MatExpansionModule,
        MatRadioModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatCheckboxModule,
        NgForOf
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
