import {Component, ElementRef, ViewChild} from '@angular/core';
import { PagesControlService } from '../pagesControl.service';

import '@tensorflow/tfjs';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/pose';
import * as pose from '@tensorflow-models/pose-detection';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.css']
})
export class GamePageComponent {
  cameras: Object = {};
  labels: string[] = [];
  @ViewChild("video")
  public video: ElementRef | undefined;
  interval: number | undefined;
  detector: any;
  formActive: boolean = true;
  labelInUse: any;
  currentStream: MediaStream | undefined;

  document: HTMLElement | undefined;

  constructor(public pcs: PagesControlService) {
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
        this.startCamera(idInUse).then(() => this.setDetector().then(() => this.interval = setInterval(() => this.poses(), 1000)));
    });
  }

  async startCamera(deviceId: string) {
    if(this.currentStream !== undefined) {
      this.currentStream.getTracks().forEach(track => track.stop())
      this.currentStream = undefined;
    }

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

  changeCamera(label: string) {
    this.labelInUse = label
    clearInterval(this.interval);
    // @ts-ignore
    this.startCamera(this.cameras[label]).then(() => this.setDetector().then(() => this.interval = setInterval(() => this.poses(), 1000)));
  }

  send(audio: boolean, fullscreen: boolean, camera: string) {
    let el = this.video?.nativeElement;
    el.id = 'video';
    this.document?.appendChild(el);
    console.log(audio, fullscreen, camera)
    this.formActive = false;
    if(fullscreen) {
      this.document?.requestFullscreen().then(() => { });
      this.document?.addEventListener('fullscreenchange', () => this.pcs.isFullScreen = !this.pcs.isFullScreen);
    }
  }

  async setDetector() {
    this.detector = await pose.createDetector(pose.SupportedModels.BlazePose, {runtime: 'tfjs', modelType: 'full'});
  }

  async poses() {
    const poses = await this.detector?.estimatePoses(this.video?.nativeElement as HTMLVideoElement);
    console.log(poses);
  }
}
