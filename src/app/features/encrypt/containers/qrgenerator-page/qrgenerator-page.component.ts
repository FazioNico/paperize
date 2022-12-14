import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonToggle } from '@ionic/angular';
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
  @ViewChild('toggleElement', { static: false, read: ElementRef }) readonly toggleEncryptionElement!: ElementRef<IonToggle>;
  @ViewChild('qrVideoElement', {static: false, read: ElementRef}) readonly qrVideoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', {static: false, read: ElementRef}) readonly canvasElement!: ElementRef<HTMLCanvasElement>;
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
  isMnemonicSeedPhrase: boolean = false;
  secret: string[] = [''];
  text: string = '';
  seedWordList: string[] = [];

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _service: CryptoService,
    private readonly _canvasService: CanvasService,
    private readonly _alertCtrl: AlertController,
    private readonly _scanService: ScanService
  ) {}

  get isEncryptionEnabled() {
    return this.toggleEncryptionElement?.nativeElement?.checked;
  }

  async encrypt() {
    let encryptedText, hash;
    if (this.isEncryptionEnabled) {
      const ionAlert = await this._alertCtrl.create({
        header: 'Warning',
        message: `
          <p>
            Please make sure that you have backup of your ${this. isMnemonicSeedPhrase ? 'seed phrase words': 'password'}. <br/>
            If you lose your seed words, you will definitly lose access to your encryppted data.
          </p>
          <ion-text color="primary">
            <p>Current ${this. isMnemonicSeedPhrase ? 'seed phrase words': 'password'}:</p>
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
      encryptedText = encrypted;
      hash = shortHash;
    }
    // toggle global state
    this.isWoring$.next(true);
    hash = hash || Date.now().toString();
    const imgUrl = await this.generateQR(encryptedText||this.text);
    this.result$.next({
      encryptedText: encryptedText||this.text,
      shortHash: hash,
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
            width: 600,
            height: 600
          }
        }
      )
      .setbackground('#fff')
      .drawImage(imgUrl)
      .drawText(hash)
      .build(); 
    // toggle global state
    this.isWoring$.next(false);
    this.isImportSeedWords = false;
    // this.text = '';
    // this.secret = generateMnemonic(wordlist).split(' ');
    const ionWarning = await this._alertCtrl.create({
      header: 'Caution',
      message: `
        <p>
          Please download and try to scan the QR code to make sure that your data backup was successful and can be recovered. <br/>
          If you have any scanning issue, try again to generate a new QR code.
        </p>
        <p>
          And again, make sure that you have backup of your ${this. isMnemonicSeedPhrase ? 'seed words': 'password'}. <br/>
          <b>If you lose your seed words, you will definitly lose access to your encryppted data</b>.
        </p>
        `,
      buttons: [
        { text: 'ok', role: 'confirm' }
      ]
    });
    await ionWarning.present();
  }

  async download() {
    const {shortHash = Date.now().toString()} = await firstValueFrom(this.result$);
    await this._canvasService.download(shortHash);
    this.result$.next(null as any);
  }

  async scanFile($event: any) {
    const file = $event.target.files[0];
    const {decodedText = '', result} = await this._scanService.scanFile(file);
    console.log(`Code matched = ${decodedText}`, result);
    if (this.isEncryptionEnabled) {
      const decrypted = await this._service.decryptString(
        this.secret.join(' '),
        decodedText
      );
      console.log('[INFO] decrypted text:', decrypted);
      this.result$.next({
        decryptedText: decrypted
      }); 
    } else {
      this.result$.next({
        decryptedText: decodedText
      });    
    }
  }

  async scanWithCamera() {
    const {decodedText} = await this._scanService.scanWithCamera(this.qrVideoElement.nativeElement);
    console.log(`Code matched = ${decodedText}`);
  }

  async generateQR(text: string): Promise<string> {
    console.log('[INFO] generating QR code...');
    try {
      const qr =  await toDataURL(text, {
        type: 'image/png',
        rendererOpts: {
          quality: 1,
        },
        errorCorrectionLevel: 'L'
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
      this.isMnemonicSeedPhrase = true;
      this.secret = generateMnemonic(wordlist).split(' ');
    }
  }

  async toggleIsMnemonicSeedPhrase() {
    this.isMnemonicSeedPhrase = !this.isMnemonicSeedPhrase;
    if (this.isMnemonicSeedPhrase) {
      this.secret = generateMnemonic(wordlist).split(' ');
    } else {
      this.secret = [''];
    }
  }

}