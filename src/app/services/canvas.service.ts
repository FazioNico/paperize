import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {

  public readonly state$: BehaviorSubject<string> = new BehaviorSubject(null as any);
  private _canvas!: HTMLCanvasElement;
  private _context!: CanvasRenderingContext2D;
  private _actions: Function[] = [];

  setCanvas(canvas: HTMLCanvasElement, options?: {size?: { width: number; height: number }}) {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('[ERROR] Canvas context is not set.');
    }
    this.state$.next('[INFO] set Canvas element to build QR code...');
    this._canvas = canvas;
    this._context = context;
    this._setSize(options?.size);
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._context.font = '30px Arial';
    return this;
  }

  private _setSize(size?: { width: number; height: number }) {
    if (!this._canvas) {
      throw new Error('[ERROR] Canvas element is not set.');
    }
    this._canvas.width =  (size?.width || window.innerWidth);
    this._canvas.height = (size?.height || window.innerWidth);
    return this;
  }

  setbackground(color: string) {
    this._actions.push(async () => await this._setbackground(color));
    return this;
  }

  private async _setbackground(color: string) {
    // background
    this._context.beginPath();
    this._context.rect(0, 0, this._canvas.width, this._canvas.height);
    this._context.fillStyle = color;
    this._context.fill();
    return this;
  }

  drawImage(url: string) {
    this._actions.push(async () => await this._drawImage(url));
    return this;
  }

  private async _drawImage(url: string) {
    if (!this._context) {
      throw new Error('[ERROR] Canvas context is not set.');
    }
    const image = new Image();
    image.src = url;
    await new Promise((resolve) => {
      image.onload = () => {
        resolve(true);
      };
    });
    this._context.drawImage(
      image,
      10,
      0,
      this._canvas.width - 20,
      this._canvas.height - 30
    );
    return this;
  }

  drawText(text: string) {
    this._actions.push(async () => await this._drawText(text));
    return this;
  }

  private async _drawText(text: string) {
    if (!this._context) {
      throw new Error('[ERROR] Canvas context is not set.');
    }
    const textWidth = this._context.measureText(text).width;
    this._context.textAlign = 'left';
    this._context.fillStyle = '#000';
    this._context.fillText(
      text,
      this._canvas.width / 2 - textWidth / 2,
      this._canvas.height - 15
    );
    return this;
  }

  async download(fileName:string) {
    if (!this._canvas) {
      throw new Error('[ERROR] Canvas element is not set.');
    }
    const blob: Blob = await new Promise((resolve, reject) => {
      this._canvas.toBlob((blob) => {
        if (!blob) {
          reject('[ERROR] Canvas toBlob method failed.');
          return;
        }
        this.state$.next('[INFO] Saving QR code...');
        resolve(blob);
      });
    });
    await this._sleep(1618);
    saveAs(blob, `${fileName}.png`);
    this.state$.next('[INFO] QR code downloaded');
    return this;
  }

  async build() {
    this.state$.next('[INFO] Building QR code with aditional metadata...');
    // hide element with opacity 0
    this._canvas.style.opacity = '0';
    // loop through actions array and execute them with sleep interval
    for (const action of this._actions) {
      await action();
      await this._sleep();   
    }
    this.state$.next('[INFO] QR code builded successfully');
    await this._sleep(1618);
    // show element with opacity fade effect after all actions are executed
    this._canvas.style.opacity = '1';
    this._actions = [];
    this.state$.next('[INFO] QR code ready to display');
    return this;
  }

  private async _sleep(durationMs: number = 1000) {
    await new Promise((resolve) => {
      const t = setTimeout(()=> {
        resolve(true);
        clearTimeout(t);
      }, durationMs)
    });
  }
}
