import {Component, ElementRef, HostListener, Input, ViewChild, OnDestroy} from '@angular/core';
import { CalibrazioneService } from "../calibrazione.service";
import { PagesControlService } from "../pagesControl.service";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-game-piano-page',
  templateUrl: './game-piano-page.component.html',
  styleUrls: ['./game-piano-page.component.css']
})
export class GamePianoPageComponent implements OnDestroy {
  N_VOLUME: number = 5;

  @Input() isFullScreen: boolean | undefined;
  @Input() conBase: boolean | undefined;

  @ViewChild('barra') public Barra: ElementRef | undefined;
  @ViewChild('home') public Home: ElementRef | undefined;
  @ViewChild('pauseResume') public PauseResume: ElementRef | undefined;
  @ViewChild('piano') public Piano: ElementRef | undefined;
  @ViewChild('select') public Select: MatSelect | undefined;

  mainInterval: number | undefined;
  icon: string = 'pause';
  voidArr: any[] = [];
  inner_width: number = 0;
  canzoni: string[] = ['Dimmi', 'Good Enough - Cheeky', 'Nights', 'Siri', 'Softy - Bridges'];
  note: string[] = ['C2', 'Dd2', 'D2', 'Eb2', 'E2', 'F2', 'Gb2', 'G2', 'Ab2', 'A2', 'Bb2', 'B2',
                    'C3', 'Dd3', 'D3', 'Eb3', 'E3', 'F3', 'Gb3', 'G3', 'Ab3', 'A3', 'Bb3', 'B3'];
  classNotes: number[] = [1, 2, 3, 2, 5, 6, 2, 8, 2, 10, 2, 12, 1, 2, 3, 2, 5, 1, 2, 3, 2, 5, 2, 3];

  soundTrack: any = { title: undefined, sound: undefined };
  titleReproduced: string = this.canzoni[0];
  volume: number = 100;
  isPause: boolean = false;
  timeSong: string = '00:00 - 00:00';
  intervalUpdateTime: number | undefined;
  posRot: string = 'auto';
  arrOpt: any[] = [];

  constructor(public cs: CalibrazioneService, public pcs: PagesControlService) {
    for(let n = 0; n < this.N_VOLUME; n ++)
      this.voidArr.push(n * 25);
    cs.indexs = [29, 30, 31, 32];
    this.inner_width = window.innerWidth;

    let int = setInterval(() => {
      if(this.Piano !== undefined && this.Home !== undefined && this.Barra !== undefined && this.PauseResume !== undefined) {
        if(this.conBase && this.Select === undefined) { }
        else {
          clearInterval(int);
          let arr = this.conBase ? [this.Home, this.PauseResume, this.Select?._elementRef] : [this.Home, this.PauseResume];
          cs.init(arr, [this.Barra, this.Piano]);
          this.mainInterval = setInterval(() => this.action(), 1000 / cs.FRAMES);
        }
      }
    }, 5);

    let i = setInterval(() => {
      if(this.Barra !== undefined) {
        if(this.conBase)
          this.music(this.titleReproduced);
        this.changeVolume(4);
        clearInterval(i);
      }
    }, 5);
  }


  sound(nota: string): void {
    if(!this.isPause) {
      let a = new Audio('assets/notes/' + nota + '.mp3');
      a.volume = this.volume / 100;
      a.play().then(() => { });
    }
  }

  itoa(i: number): string { //if the number is < 10 add 0 before number (5->05)
    return i < 10? '0' + i: i.toString();
  }

  music(title: string): void {
    if(title === this.soundTrack.audio)
      return;
    if(this.soundTrack.sound !== undefined)
      this.soundTrack.sound.pause();
    if(this.intervalUpdateTime !== undefined)
      clearInterval(this.intervalUpdateTime)

    this.soundTrack.sound = new Audio('assets/soundtracks/' + title + '.mp3');
    this.soundTrack.sound.load();
    this.soundTrack.sound.volume = this.volume / 1000;
    if(!this.isPause)
      this.soundTrack.sound.play().then(() => {
        let base = this.soundTrack.sound;
        let baseDuration = { m: Math.floor(parseInt(base.duration) / 60), s: parseInt(base.duration) % 60 };
        this.timeSong = '00:00 - ' + this.itoa(baseDuration.m) + ':' + this.itoa(baseDuration.s);
        let secBasePassati = 0;

        this.intervalUpdateTime = setInterval(() => {
          if(!this.isPause) {
            secBasePassati++;
            this.timeSong = this.itoa(Math.floor(secBasePassati / 60)) + ':' + this.itoa(secBasePassati % 60)+ ' - ' + this.itoa(baseDuration.m) + ':' + this.itoa(baseDuration.s);

            if (secBasePassati >= parseInt(base.duration)) {
              clearInterval(this.intervalUpdateTime);
              this.intervalUpdateTime = undefined;
              this.titleReproduced = this.canzoni[(this.canzoni.indexOf(base.title) + 1) % this.canzoni.length];
              this.music(this.titleReproduced);
            }
          }
        }, 1000);
      });
  }

  action(): void {
    let el = this.cs.elClicked();
    let i = this.arrOpt.indexOf(el);
    if(i > -1) {
      this.titleReproduced = this.canzoni[i];
      this.music(this.canzoni[i]);
      this.Select?.close();
      clearInterval(this.mainInterval);
      // @ts-ignore
      this.cs.init([this.Home, this.PauseResume, this.Select._elementRef],[this.Barra, this.Piano]);
      this.mainInterval = setInterval(() => this.action(), 1000 / this.cs.FRAMES);
    } else if (el !== undefined && el.nativeElement !== undefined) {
        if(this.Select !== undefined && el === this.Select._elementRef) {
          this.Select?.open();
          clearInterval(this.mainInterval);
          setTimeout(() => {
            this.arrOpt = [];
            if (this.arrOpt.length === 0)
              // @ts-ignore
              for (let el of this.Select?.options) {
                // @ts-ignore
                this.arrOpt.push(el._element)
              }

            this.cs.init(this.arrOpt);
            setTimeout(() => this.mainInterval = setInterval(() => this.action(), 1000 / this.cs.FRAMES), 1200);
          }, 500);
        } else {
          el.nativeElement.click();
          if (el.nativeElement.id === 'pauseResume') {
            clearInterval(this.mainInterval);
            setTimeout(() => this.mainInterval = setInterval(() => this.action(), 1000 / this.cs.FRAMES), 2000);
          }
        }
    } else if(el != null) {
      clearInterval(this.mainInterval);
      el.click();
      setTimeout(() => this.mainInterval = setInterval(() => this.action(), 1000 / this.cs.FRAMES), 800);
      /*
      clearInterval(this.mainInterval);
      if(el !== null && el.id !== undefined && el.id.indexOf('_') > -1)
        setTimeout(() => this.mainInterval = setInterval(() => this.action(), 1000 / this.cs.FRAMES), 800);
      else {
        setTimeout(() => this.mainInterval = setInterval(() => this.action(), 1000 / this.cs.FRAMES), 750);
        if(el.className !== 'key-2') {
          el.style.animation = 'keyClicked 0.7s ease';
          setTimeout(() => {
            el.style.removeProperty('animation');
          }, 1400);
        } else {
          el.style.animation = 'key2Clicked 0.7s ease';
          setTimeout(() => {
            el.element.style.removeProperty('animation');
          }, 1400);
        }
      }
      el.click();*/
    }
  }

  changeVolume(i: number): void {
    let clicked = this.Barra?.nativeElement.children[i];
    this.volume = i * 25;
    if(this.soundTrack.sound !== undefined)
      this.soundTrack.sound.volume = this.volume / 1000;
    let { x } = clicked.getBoundingClientRect();
    this.posRot = x + 10 + 'px';
  }

  togglePauseResume(): void {
    this.isPause = !this.isPause;
    this.icon = this.icon === 'pause'? 'play_arrow' : 'pause';

    if(this.soundTrack.sound !== undefined && this.isPause)
      this.soundTrack.sound.pause();
    else if(this.soundTrack.sound !== undefined)
      this.soundTrack.sound.play();
  }

  getNote(): string[] {
    let ret = [];
    if(this.inner_width >= 1600)
      ret = this.note;
    else
      for(let k = 0; k < this.note.length / 2; k ++)
        ret.push(this.note[k]);
    return ret;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.inner_width = window.innerWidth;
    clearInterval(this.mainInterval);
    this.cs.init([this.Home, this.PauseResume],[this.Barra, this.Piano]);
    this.mainInterval = setInterval(() => this.action(), 1000 / this.cs.FRAMES);
  }

  ngOnDestroy() {
    if(this.soundTrack.sound !== undefined)
      this.soundTrack.sound.pause();
    if(this.mainInterval !== undefined)
      clearInterval(this.mainInterval);
    this.soundTrack = undefined;
  }
}
