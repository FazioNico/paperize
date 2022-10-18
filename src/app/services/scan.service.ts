
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import QrScanner from 'qr-scanner';

@Injectable({
  providedIn: 'root'
})
export class ScanService {

  public readonly state$ = new BehaviorSubject(null as any);
  private _scanner!: QrScanner;

  async scanWithCamera(htmlVideoElement: HTMLVideoElement): Promise<{
    decodedText?: string, result?: any
  }> {
    this.state$.next('[INFO] Initialize scanner...');
    // check camera availability
    const hasCamera = await QrScanner.hasCamera();
    const cameraIsAvailable = await QrScanner.listCameras()
      .then((cameras) => cameras.length > 0)
      .catch(() => false);
    if (!hasCamera || !cameraIsAvailable) {
      this.state$.next('[ERROR] No camera available.');
      throw new Error('[ERROR] No camera available.');
    }
    const result: QrScanner.ScanResult = await new Promise(async (resolve, reject) => {
      // create and Configure scanner
      this._scanner = new QrScanner(
        htmlVideoElement, 
        // success Methood
        result => {
          this._scanner.stop();
          this.state$.next('[INFO] Scanning with success.');
          resolve(result);
        }, 
        // Options
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      this.state$.next('[INFO] Start scanning...');
      // start scanning
      await this._scanner.start();
    });
    // return result
    return {
      decodedText: result.data
    };
  }

  async scanFile(file: File): Promise<{
    decodedText?: string, result?: any
  }> {
    await new Promise((resolve) => {
      const t = setTimeout(() => resolve(true), 250);
    });
    const {data: decodedText = 'No QR code found.'} = await QrScanner
      .scanImage(file, { returnDetailedScanResult: true })
      .catch(error => {
        throw error || 'Error scanning image'
      });
    console.log('decodedText', decodedText);    
    return {
      decodedText
    };
  }

  async stop() {
    throw new Error('Not implemented');
  }

  private async _cameraScanResult() {}
}