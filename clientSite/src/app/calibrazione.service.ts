import { Injectable } from '@angular/core';

import '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/pose';
import * as pose from '@tensorflow-models/pose-detection';

@Injectable({
  providedIn: 'root'
})

export class CalibrazioneService {
  MIN_VISIBILITY: number = 0.7;
  INDEXS: any = {
    PIEDI: {
      SX : [29, 31],
      DX : [30, 32]
    },
    OCCHI : [1, 2, 3, 4, 5, 6],
    MANI : {
      SX : [17, 19, 21],
      DX : [18, 20, 22]
    }
  };
  CALIB: any = {
    b_dx: {score: 0.98, x: 124.65, y: 92.821, z: 9581},
    b_sx: {score: 0.95, x: 269.54, y: 102.00, z: 8772},
    a_sx: {score: 0.98, x: 173.96, y: 175.53, z: 6316},
    a_dx: {score: 0.96, x: 62.489, y: 149.35, z: 17404}
  }

  detector: any;
  video: any;
  interval: any;

  coordinates: any[] = [];
  indexs: undefined | number[];

  rette: any = { up: ['m', 'q'], down: ['m', 'q'], right: ['m', 'q'], left: ['m', 'q'] };
  puntoP: any = { x: 'x', y: 'y' };

  FRAMES: number = 30;

  elements: any[] = [];
  completedElements: any[] = [];

  async setDetector(): Promise<void> {
    await tf.ready();
    this.detector = await pose.createDetector(pose.SupportedModels.BlazePose, { runtime: 'tfjs', modelType: 'full' });
  }

  async poses(): Promise<void> {
    try {
      let poses = await this.detector?.estimatePoses(this.video?.nativeElement as HTMLVideoElement);
      if(poses.length > 0)
        try {
          if (this.indexs === undefined)
            this.coordinates = poses[0].keypoints;
          else {
            this.coordinates = [];
            for (let i of this.indexs)
              this.coordinates.push(poses[0].keypoints[i]);
          }
          //console.log(this.coordinates);
        } catch(e) { }
    } catch(e) { }
  }


  allVisible(): string {
    let arr = this.INDEXS.PIEDI.DX.concat(this.INDEXS.PIEDI.SX).concat(this.INDEXS.OCCHI).concat(this.INDEXS.MANI.DX).concat(this.INDEXS.MANI.SX);
    for(let i = 0; i < arr.length; i ++) {
      if (this.coordinates[arr[i]].score <= this.MIN_VISIBILITY) {
        if (i < 2)
          return 'non si vede bene il piede destro';
        else if (i < 4)
          return 'non si vede bene il piede sinistro';
        else if (i < 10)
          return 'non si vedono bene gli occhi';
        else if (i < 13)
          return 'non si vede bene la mano destra';
        else
          return 'non si vede bene la mano sinistra';
      }
    }
    return 'yes';
  }

  manoSopraLaTesta(pos: any[]): string | false {
    let y_occhi = [], y_mano_sx = [], y_mano_dx = [];
    for(let i of this.INDEXS.OCCHI)
      y_occhi.push(pos[i].y);
    for(let i of this.INDEXS.MANI.SX)
      y_mano_sx.push(pos[i].y);

    if(this.getMax(y_mano_sx) < this.getMin(y_occhi))
      return 'sinistra';

    for(let i of this.INDEXS.MANI.DX)
      y_mano_dx.push(pos[i].y);
    if(this.getMax(y_mano_dx) < this.getMin(y_occhi) + 0.05)
      return 'destra';
    return false;
  }

  getIndex(mano: string): number {
    return mano === 'sinistra'? this.INDEXS.PIEDI.SX[1] : this.INDEXS.PIEDI.DX[1];
  }

  getMax(arr: number[]): number {
    let m = arr[0];
    for(let n of arr)
      if(n > m)
        m = n;
    return m;
  }

  getMin(arr: number[]): number {
    let m = arr[0];
    for(let n of arr)
      if(n < m)
        m = n;
    return m;
  }


  pointInPolygon(polygon: any[], point: any): boolean {
    //A point is in a polygon if a line from the point to infinity crosses the polygon an odd number of times
    let odd = false;
    //For each edge (In this case for each point of the polygon and the previous one)
    for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
      //If a line from the point into infinity crosses this edge
      if (((polygon[i].y > point.y) !== (polygon[j].y > point.y)) // One point needs to be above, one below our y coordinate
        // ...and the edge doesn't cross our Y corrdinate before our x coordinate (but between our x coordinate and infinity)
        && (point.x < ((polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x))) {
        // Invert odd
        odd = !odd;
      }
      j = i;

    }
    //If the number of crossings was odd, the point is in the polygon
    return odd;
  }

  getM_Q(p1: any, p2: any): number[] {
    let m = (p1.y - p2.y) / (p1.x - p2.x);
    return [ m, p2.y - m * p2.x ];
  }

  setRetteAndP() {
    this.rette.up = this.getM_Q(this.CALIB.a_sx, this.CALIB.a_dx);
    this.rette.down = this.getM_Q(this.CALIB.b_sx, this.CALIB.b_dx);
    this.rette.left = this.getM_Q(this.CALIB.b_sx, this.CALIB.a_sx);
    this.rette.right = this.getM_Q(this.CALIB.b_dx, this.CALIB.a_dx);

    this.puntoP.x = (this.rette.right[1] - this.rette.left[1]) / (this.rette.left[0] - this.rette.right[0]);
    this.puntoP.y = this.rette.left[0] * this.puntoP.x + this.rette.left[1];
  }

  getOffsetLeft(el: any): number {
    if(el == null || el === document.getElementsByTagName('body')[0])
      return 0;
    return el.offsetLeft + this.getOffsetLeft(el.offsetParent);
  }

  getOffsetTop(el: any): number {
    if(el == null || el === document.getElementsByTagName('body')[0])
      return 0;
    return el.offsetTop + this.getOffsetTop(el.offsetParent);
  }

  init(elToClick: any[], contElem: any[] = []) { //elementRef
    this.setRetteAndP();

    this.elements = [];
    this.completedElements = [];

    for(let _el of elToClick) {
      let el = _el.nativeElement;
      try {
        let {width, height} = el.getBoundingClientRect();

        this.elements.push({
          element: _el,
          punti: {
            a_sx: {x: this.getOffsetLeft(el), y: this.getOffsetTop(el)},
            a_dx: {x: this.getOffsetLeft(el) + width, y: this.getOffsetTop(el)},
            b_sx: {x: this.getOffsetLeft(el), y: this.getOffsetTop(el) + height},
            b_dx: {x: this.getOffsetLeft(el) + width, y: this.getOffsetTop(el) + height}
          }
        });
      } catch(e) {
        return;
      }
    }
    for(let _el of contElem) {
      let el = _el.nativeElement;
      let cs = [];

      for(let i = 0; i < el.children.length; i ++)
        cs.push(el.children[i]);

      for (let i in cs) {
        let child = cs[i];
        let bsx = child.children[0].getBoundingClientRect(), asx = child.children[1].getBoundingClientRect();
        let bdx = child.children[2].getBoundingClientRect(), adx = child.children[3].getBoundingClientRect();

        this.elements.push({
          element: child,
          punti: {
            b_sx: { x: bsx.x, y: bsx.y },
            a_sx: { x: asx.x, y: asx.y },
            b_dx: { x: bdx.x, y: bdx.y },
            a_dx: { x: adx.x, y: adx.y }
          }
        });
      }
    }

    let widthI = ((this.CALIB.b_sx.x - this.CALIB.b_dx.x) ** 2 + (this.CALIB.b_sx.y - this.CALIB.b_dx.y) ** 2) ** .5;
    let heightC = this.CALIB.a_sx.y - this.CALIB.b_sx.y;

    for(let el of this.elements) {
      let x_terra_sx = this.CALIB.b_sx.x - widthI * el.punti.b_sx.x / innerWidth;
      let y_terra_sx = this.rette.down[0] * x_terra_sx + this.rette.down[1];
      let x_terra_dx = this.CALIB.b_sx.x - widthI * el.punti.b_dx.x / innerWidth;
      let y_terra_dx = this.rette.down[0] * x_terra_dx + this.rette.down[1];

      let re_sx = this.getM_Q({ x: x_terra_sx, y: y_terra_sx }, this.puntoP);
      let re_dx = this.getM_Q({ x: x_terra_dx, y: y_terra_dx }, this.puntoP);

      let y_to = this.CALIB.a_sx.y - heightC * el.punti.a_sx.y / innerHeight;
      let y_bo = this.CALIB.a_sx.y - heightC * el.punti.b_sx.y / innerHeight;

      let r_y_to = [ this.rette.down[0], this.rette.down[1] + y_to - this.CALIB.b_sx.y ];
      let r_y_bo = [ this.rette.down[0], this.rette.down[1] + y_bo - this.CALIB.b_sx.y ];

      let __b_sx_x = (r_y_bo[1] - re_sx[1]) / (re_sx[0] - r_y_bo[0]);
      let __b_dx_x = (r_y_bo[1] - re_dx[1]) / (re_dx[0] - r_y_bo[0]);
      let __a_sx_x = (r_y_to[1] - re_sx[1]) / (re_sx[0] - r_y_to[0]);
      let __a_dx_x = (r_y_to[1] - re_dx[1]) / (re_dx[0] - r_y_to[0]);

      this.completedElements.push({
        element: el.element,
        punti: {
          b_sx: { x: __b_sx_x, y: re_sx[0] * __b_sx_x + re_sx[1] },
          b_dx: { x: __b_dx_x, y: re_dx[0] * __b_dx_x + re_dx[1] },
          a_sx: { x: __a_sx_x, y: re_sx[0] * __a_sx_x + re_sx[1] },
          a_dx: { x: __a_dx_x, y: re_dx[0] * __a_dx_x + re_dx[1] }
        }
      });
    }
  }

  elClicked(): any {
    for(let el of this.completedElements)
      for(let _pos of this.coordinates)
        if(this.pointInPolygon([el.punti.a_dx, el.punti.a_sx, el.punti.b_dx, el.punti.b_sx], _pos))
          return el.element;

    return undefined;
  }
}
