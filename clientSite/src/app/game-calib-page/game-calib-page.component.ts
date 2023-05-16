import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CalibrazioneService } from '../calibrazione.service';
import {PagesControlService} from "../pagesControl.service";

@Component({
  selector: 'app-game-calib-page',
  templateUrl: './game-calib-page.component.html',
  styleUrls: ['./game-calib-page.component.css']
})
export class GameCalibPageComponent {
  @Input() isFullScreen: boolean | undefined;

  @ViewChild('home') Home: ElementRef | undefined;
  @ViewChild('calib') Calib: ElementRef | undefined;

  messageError: string = '';
  inCalib: boolean = true;
  puntoDaCalib: string = 'b_dx';
  stylePos: any = {
    'background-color': '#fff',
    'top': 'auto',
    'bottom': '0',
    'right': '0',
    'left': 'auto'
  };
  punti: any = { };
  mainInterval: number | undefined

  constructor(public cs: CalibrazioneService, public pcs: PagesControlService) {
    cs.indexs = undefined;
    this.mainInterval = setInterval(() => this.calibra(), 1000 / cs.FRAMES);
  }

  calibra() {
    let pos = this.cs.coordinates;
    let answ = this.cs.allVisible();

    if(answ !== 'yes')
      this.messageError = answ;
    else {
      this.messageError = '';
      let mano = this.cs.manoSopraLaTesta(pos);

      if(mano) {
        this.stylePos['background-color'] = 'rgba(0, 255, 0, 0.5)';
        this.punti[this.puntoDaCalib] = pos[this.cs.getIndex(mano)];

        if(this.puntoDaCalib === 'b_sx') {
          this.cs.CALIB = this.punti;
          clearInterval(this.mainInterval);
          this.inCalib = false;

          let int = setInterval((): void => {
          if(this.Calib !== undefined && this.Home !== undefined) {
              this.cs.indexs = [29, 30, 31, 32];
              this.cs.init([this.Home, this.Calib], []);
              clearInterval(int);
              this.mainInterval = setInterval(() => this.poses(), 1000 / this.cs.FRAMES);
            }
          }, 5);
        } else {
          clearInterval(this.mainInterval);
          setTimeout(() => {
            this.stylePos['background-color'] = '#fff';
            if (this.puntoDaCalib === 'b_dx') {
              this.puntoDaCalib = 'a_dx';
              this.stylePos.bottom = 'auto';
              this.stylePos.top = this.isFullScreen? '0': '64px';
            } else if (this.puntoDaCalib === 'a_dx') {
              this.puntoDaCalib = 'a_sx';
              this.stylePos.right = 'auto';
              this.stylePos.left = '0';
            } else if (this.puntoDaCalib === 'a_sx') {
              this.puntoDaCalib = 'b_sx';
              this.stylePos.bottom = '0';
              this.stylePos.top = 'auto';
            }
            this.mainInterval = setInterval(() => this.calibra(), 1000 / this.cs.FRAMES);
          }, 2000);
        }
      }
    }
  }

  poses() {
    let el = this.cs.elClicked();
    if (el !== undefined && typeof el !== 'number') {
      clearInterval(this.mainInterval);
      el.nativeElement.click();
    }
  }
}
