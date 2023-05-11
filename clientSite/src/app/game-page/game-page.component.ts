import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { PagesControlService } from '../pagesControl.service';
import { CalibrazioneService } from "../calibrazione.service";

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.css']
})
export class GamePageComponent implements OnDestroy {
  cameras: Object = { };
  labels: string[] = [];
  labelInUse: any;

  document: HTMLElement | undefined;
  @ViewChild("video") public video: ElementRef | undefined;
  positionForm: string = 'relative';
  topForm: string = '0';

  formActive: boolean = true;
  currentStream: MediaStream | undefined;

  constructor(public pcs: PagesControlService, public calibrazioneService: CalibrazioneService) {
    this.document = document.documentElement;
    navigator.mediaDevices.enumerateDevices().then(arr => {
      let idInUse: string = '';
      for (let device of arr)
        if (device.kind === 'videoinput') {
          if (idInUse == '') {
            idInUse = device.deviceId;
            this.labelInUse = device.label;
          }
          // @ts-ignore
          this.cameras[device.label] = device.deviceId;
          this.labels.push(device.label);
        }
      if (idInUse !== '')
        this.startCamera(idInUse).then(() => { });
    });
  }

  async startCamera(deviceId: string): Promise<void> {
    this.closeStream();
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: deviceId
          }
        });
        if (stream && this.video !== undefined) {
          this.currentStream = stream;
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
        }
      } catch (e) { }
    }
  }

  changeCamera(label: string): void {
    this.labelInUse = label
    // @ts-ignore
    this.startCamera(this.cameras[label]).then(() => { });
  }

  send(audio: boolean, fullscreen: boolean, camera: string): void {
    let el = this.video?.nativeElement;
    el.id = 'video';
    this.document?.appendChild(el);
    console.log(audio, fullscreen, camera)
    this.formActive = false;
    if(fullscreen) {
      this.document?.requestFullscreen().then(() => { });
      this.document?.addEventListener('fullscreenchange', () => this.pcs.isFullScreen = !this.pcs.isFullScreen);
    }
    this.positionForm = 'absolute';
    this.topForm = '-1000px';

    this.calibrazioneService.video = this.video;
    this.calibrazioneService.setDetector()
      .then(() => this.calibrazioneService.interval = setInterval(() => this.calibrazioneService.poses(), 1000 / this.calibrazioneService.FRAMES));
  }

  closeStream(): void {
    if(this.currentStream !== undefined) {
      this.currentStream.getTracks().forEach(track => track.stop())
      this.currentStream = undefined;
    }
  }

  ngOnDestroy(): void {
    this.closeStream();
    clearInterval(this.calibrazioneService.interval);
  }
}
