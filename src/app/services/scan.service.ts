
import { Injectable } from '@angular/core';
import { Html5QrcodeScanner, Html5QrcodeScanType, Html5Qrcode } from 'html5-qrcode';
import { Html5QrcodeResult } from 'html5-qrcode/esm/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScanService {

  public readonly state$ = new BehaviorSubject(null as any);
  private _html5QrcodeScanner!: Html5Qrcode|undefined;

  async scanWithCamera(htmlElementId: string): Promise<{
    decodedText?: string, result?: Html5QrcodeResult
  }> {
    this.state$.next('[INFO] Initialize scanner...');
    const html5QrcodeScanner = new Html5Qrcode(
      htmlElementId,
      { verbose: false }
    );
    this._html5QrcodeScanner = html5QrcodeScanner;
    this.state$.next('[INFO] Get available camera...');
    await Html5Qrcode.getCameras()
      .then(devices => {
      /**
       * devices would be an array of objects of type:
       * { id: "id", label: "label" }
       */
      if (devices && devices.length) {
        var cameraId = devices?.[0]?.id;
        return cameraId;
      } else {
        throw new Error('No camera found');
      }
    });
    this.state$.next('[INFO] Start scanning...');
    const config = { fps: 10, qrbox: { width: 600, height: 600 } };
    const decodedText: string = await new Promise((resolve, reject) => {
      if (!this._html5QrcodeScanner){
        throw Error('QrcodeScanner not initialized!')
      }
      this._html5QrcodeScanner.start(
        {
          facingMode: "user"
        },
        config,
        (event) => resolve(event),
        (error) => reject(error)
      );
    });
    this.state$.next('[INFO] Scanning...');
    return {
      decodedText
    };

  }

  async scanFile(htmlElementId: string, file: File): Promise<{
    decodedText?: string, result?: Html5QrcodeResult
  }> {
    const html5QrcodeScanner = new Html5Qrcode(
      htmlElementId,
      { verbose: false }
    );
    this._html5QrcodeScanner = html5QrcodeScanner;
    await new Promise((resolve) => {
      const t = setTimeout(() => resolve(true), 250);
    });
    const decodedText = await this._html5QrcodeScanner
      .scanFile(file, false)
      .catch((err:Error) => {
        throw err.message;
      });
    return {
      decodedText
    };
  }

  async stop() {
    if (!this._html5QrcodeScanner) {
      throw new Error('Html5QrcodeScanner is not initialized');
    }
    await this._html5QrcodeScanner.clear();
    this._html5QrcodeScanner = undefined;
  }

  private async _onScanSuccess(decodedText: string, decodedResult: Html5QrcodeResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
  }
  
  private async _onScanFailure(error: any) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  }
}