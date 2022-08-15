import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { toDataURL } from 'qrcode';
import { BehaviorSubject, firstValueFrom, map, merge, Observable, tap } from 'rxjs';
import { CanvasService } from 'src/app/services/canvas.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { ScanService } from 'src/app/services/scan.service';

interface IResult {
  decryptedText?: string;
  encryptedText?: string;
  shortHash?: string;
}

interface IComponentState {
  isWorking: boolean;
  isImportSeedWords: boolean;
}

@Component({
  selector: 'app-qrgenerator-page',
  templateUrl: './qrgenerator-page.component.html',
  styleUrls: ['./qrgenerator-page.component.scss']
})
export class QrgeneratorPageComponent {

  @ViewChild('canvas', {static: false, read: ElementRef}) canvasElement!: ElementRef<HTMLCanvasElement>;
  public readonly result$: BehaviorSubject<IResult>  = new BehaviorSubject(null as any);
  public readonly action$: Observable<'encrypt'|'decrypt'> = this._route.queryParams
    .pipe(
      map((params: any) => params?.action||'encrypt'),
      tap(() => this.result$.next(null as any)),
      tap(() => this._componentState$.next(null))
    );
  public readonly isWoring$ = new BehaviorSubject(false);
  private readonly _componentState$ = new BehaviorSubject(null);
  public readonly serviceState$ = merge(
    this._componentState$,
    this._service.state$,
    this._canvasService.state$
  ).pipe(
    map((state: string|null) => state
      ?.replace('[INFO] ', ' ')
      ?.replace('[ERROR] ', ' ')
      ?.replace('...', ' ')
    )
  );
  
  actions: 'encrypt'|'decrypt' = 'encrypt'
  isImportSeedWords = false;
  secret: string[] = generateMnemonic(wordlist).split(' ');
  text: string = '';
  seedWordList: string[] = [];

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _service: CryptoService,
    private readonly _canvasService: CanvasService,
    private readonly _alertCtrl: AlertController,
    private readonly _scanService: ScanService
  ) {}

  async encrypt() {
    const ionAlert = await this._alertCtrl.create({
      header: 'Warning',
      message: `
        <p>
          Please make sure that you have backup of your seed words. <br/>
          If you lose your seed words, you will definitly lose access to your encryppted data.
        </p>
        <ion-text color="primary">
          <p>Current seed phrase words:</p>
          <pre class="ion-text-wrap">
            ${this.secret.join(' ')}
          </pre>
        </ion-text>
        `,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Continue', role: 'confirm' }
      ]
    });
    await ionAlert.present();
    const { role } = await ionAlert.onDidDismiss();
    if (role !== 'confirm') {
      return;
    }
    // toggle global state
    this.isWoring$.next(true);
    const text = this.text;
    // sleep to allow angular gennerate templpate html
    await new Promise((resolve) => setTimeout(resolve, 25));
    // start logic
    const { encrypted, shortHash } = await this._service.encryptString(
      this.secret.join(' '),
      text
    );
    const imgUrl = await this.generateQR(encrypted);
    this.result$.next({
      encryptedText: encrypted,
      shortHash
    });
    // sleep to allow angular gennerate templpate html
    await new Promise((resolve) => setTimeout(resolve, 1025));
    // draw image to canvas
    const canvas = this.canvasElement?.nativeElement;   
    await this._canvasService
      .setCanvas(
        canvas, 
        {
          size: {
            width: window.innerWidth,
            height: window.innerWidth
          }
        }
      )
      .setbackground('#fff')
      .drawImage(imgUrl)
      .drawText(shortHash)
      .build(); 
    // toggle global state
    this.isWoring$.next(false);
    this.text = '';
    this.isImportSeedWords = false;
    // this.secret = generateMnemonic(wordlist).split(' ');
  }

  async download() {
    const {shortHash = Date.now().toString()} = await firstValueFrom(this.result$);
    await this._canvasService.download(shortHash);
  }

  async scanFile($event: any) {
    const file = $event.target.files[0];
    const {decodedText = '', result} = await this._scanService.scanFile("qrcode-reader", file);
    console.log(`Code matched = ${decodedText}`, result);
    const decrypted = await this._service.decryptString(
      this.secret.join(' '),
      decodedText
    );
    console.log('[INFO] decrypted text:', decrypted);
    this.result$.next({
      decryptedText: decrypted
    }); 
  }

  async scanWithCamera() {
    const {decodedText} = await this._scanService.scanWithCamera("qrcode-reader");
    console.log(`Code matched = ${decodedText}`);
  }

  async generateQR(text: string): Promise<string> {
    console.log('[INFO] generating QR code...');
    try {
      const qr =  await toDataURL(text, {
        type: 'image/png',
        width: 600,
        rendererOpts: {
          quality: 1
        }
      });
      console.log('[INFO] QR code generated.');
      return qr;
    } catch (err) {
      throw err;
    }
  }

  async removeAndGenerateWord(index: number, generate = true) {
    if (generate) {
      const newWord = generateMnemonic(wordlist).split(' ')[index];
      this.secret[index] = newWord;
    } else {
      this.secret.splice(index, 1);
    }
  }

  async autocomplet($event: any) {
    const inputEl = $event.target;
    const value = inputEl.value?.toLowerCase();
    if (!value||value.length <= 1) {
      this.seedWordList = [];
      return;
    }
    const words = wordlist.filter((word) => word.startsWith(value));
    if (words?.length <= 0) {
      this.seedWordList = [];
      return;
    }
    this.seedWordList = words
      .filter((word) => !this.secret.includes(word))
      .slice(0, 3);
  }

  async selectWord(word: string) {
    // reset auto complete list
    this.seedWordList = [];
    // handle input value error
    if (this.secret.length >= 12) {
      throw new Error("[ERROR] Maximum seed words count is 12");
    }
    if (this.secret.includes(word)) {
      throw new Error("[ERROR] Word already exists");
    }
    if (wordlist.findIndex((w) => w === word) < 0) {
      throw new Error("[ERROR] Word is not valid. Please select word from autocomplet list");
    }
    // add word to seed words list
    this.secret.push(word);
  }

  async toggleImportSeedWords() {
    this.isImportSeedWords = !this.isImportSeedWords;
    if (this.isImportSeedWords) {
      this.secret = [];
    } else {
      this.secret = generateMnemonic(wordlist).split(' ');
    }
  }

}