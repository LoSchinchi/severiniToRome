import {Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CalibrazioneService } from '../calibrazione.service';
import {PagesControlService} from "../pagesControl.service";

@Component({
  selector: 'app-game-home-page',
  templateUrl: './game-home-page.component.html',
  styleUrls: ['./game-home-page.component.css']
})
export class GameHomePageComponent {
  @Input() isFullScreen: boolean | undefined;

  @ViewChild('pianoLibero') PianoLibero: ElementRef | undefined;
  @ViewChild('calibrazione') Calibrazione: ElementRef | undefined;
  @ViewChild('pianoConBase') PianoConBase: ElementRef | undefined;

  mainInterval: number | undefined;

  constructor(public cs: CalibrazioneService, public pcs: PagesControlService) {
    cs.indexs = [29, 30, 31, 32];
    let int = setInterval((): void => {
      if(this.PianoConBase !== undefined) {
        clearInterval(int);
        cs.init([this.PianoLibero, this.Calibrazione, this.PianoConBase]);
        this.mainInterval = setInterval(() => this.action(), 1000 / cs.FRAMES);
      }
    }, 5);
  }

  action() {
    let el = this.cs.elClicked();
    if (el !== undefined && typeof el !== 'number') {
      clearInterval(this.mainInterval);
      el.nativeElement.click();
    }
  }

  goToPiano(withTrack: boolean): void {
    this.pcs.withTrack = withTrack;
    this.pcs.gamePageActive = 'piano';
  }
}
