import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { WalletService } from '../../service/wallet.service'
import { ProximaxProvider } from 'src/app/providers/proximax.provider';
import { environment } from '../../../../../environments/environment'
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-wallet-detail',
  templateUrl: './wallet-detail.page.html',
  styleUrls: ['./wallet-detail.page.scss'],
})
export class WalletDetailPage implements OnInit {
  formAccount: FormGroup;
  segmentInformation: boolean;
  segmentTransaction: boolean;
  segmentMosaic: boolean;
  wallet: any;
  transactions: any[];
  publicKey: string;
  mosaics: any;
  wall: any;
  mosaic: any[];
  privateKey: string;
  alfaNumberPattern = '^[a-zA-Z0-9]+$';
  showPasword: boolean;
  password: any;
  constructor(
    private nav: NavController,
    private storage: Storage,
    public toastController: ToastController,
    private clipboardService: ClipboardService,
    public formBuilder: FormBuilder,
    private walletService: WalletService,
    private proximaxProvider: ProximaxProvider
  ) { }

  ngOnInit() {
    this.showPasword = true;
    this.createForm()
    this.segmentMosaic = true;
    this.wallet = this.walletService.current;
    this.getMisaicsStore();
    // this.getTansaction()
    this.selectAllTransaction(this.wallet);
    this.selectMosaics(this.wallet.mosaics);
    
  }

  createForm() {
    this.formAccount = this.formBuilder.group({
      publicKey: [this.publicKey],
      password: ['', [Validators.required, Validators.pattern(this.alfaNumberPattern)]],
      privateKey: [this.privateKey]
    });
  }

  segmentChanged(ev: any) {
    const segment = ev.detail.value;
    console.log('Segment changed', segment);
    if (segment === 'segmentMosaic') {
      this.segmentMosaic = true;
      this.segmentTransaction = false;
      this.segmentInformation = false;
      this.showPasword = true;
      this.formAccount.patchValue({
        password:'',
      });
    } else if (segment === 'segmentTransaction') {
      this.segmentTransaction = true;
      this.segmentMosaic = false;
      this.segmentInformation = false;
      this.showPasword = true;
      this.formAccount.patchValue({
        password:'',
      });
    } else {
      this.segmentMosaic = false;
      this.segmentTransaction = false;
      this.segmentInformation = true;
    }
  }
  async showPrivateKey(form) {
    if (form.password == '') {
      const toast = await this.toastController.create({
        message: 'Password required',
        duration: 3000
      });
      toast.present();
    } else {
     if(form.password === this.password ){
      this.formAccount.patchValue({
        privateKey: this.privateKey.toUpperCase()
      })
      this.showPasword = false;
      } else {
        const toast = await this.toastController.create({
          message: 'wrong password',
          duration: 3000
        });
        toast.present();
      }  
    }
  }
  
  async copyMessage(valor, type) {
    this.clipboardService.copyFromContent(valor);
    const toast = await this.toastController.create({
      message: 'Copied '+ `${type}`,
      duration: 3000
    });
    toast.present();
  }


  selectAllTransaction(data) {
    this.storage.get('pin').then(async (val) => {
      this.password = val;
      const password = this.proximaxProvider.createPassword(val);
      const PrivateKey = this.proximaxProvider.decryptPrivateKey(password, data.encrypted, data.iv);
      this.privateKey = PrivateKey
      // this.formAccount.patchValue({
      //   privateKey: this.privateKey
      // })
      const publicAccount = this.walletService.getPublicAccountFromPrivateKey(PrivateKey, environment.network);
      this.publicKey = publicAccount.publicKey
      this.formAccount.patchValue({
        publicKey: this.publicKey
      })
      this.walletService.getAllTransactionsFromAccount(publicAccount).subscribe(
        response => {
          const data = [];
          response.forEach(element => {
            // console.log('element', element)
            data.push(this.walletService.buidTansaction(element));
          });
          this.transactions = data
          // console.log('transaction from address', this.transactions)
        }
      );
      // this.storage.set('transactions'.concat(this.wall), this.transactions)
    });
  }

  getMisaicsStore() {
    // console.log('.....getMisaicsStorel');
    this.wall = this.walletService.address.address;
    // console.log('.....this.wall', this.wall);
    this.storage.get('mosaics'.concat(this.wall)).then((mosaic) => {
      // console.log('.....store mosaic', mosaic);
      this.mosaics = mosaic;
    });
  }

  selectMosaics(data) {
    if (data){
    const datos = data.map(element => {
      return element.id;
    })
    this.mosaic = [];
    this.wall = this.walletService.address.address; 
        // console.log('yyyyyyyyy', this.mosaic)
    this.walletService.getMosaicNames(datos).subscribe(
      response => {
        response.forEach(element => {
          data.forEach(element2 => {
            if (element.mosaicId.toHex() === element2.id.toHex()) {
              let valores = {
                mosaicId: element.mosaicId.id.toHex(),
                name: element.names,
                amount: this.walletService.amountFormatterSimple(element2.amount.compact())
              }
              
              this.mosaic.push(valores)

              this.storage.get('mosaics').then(val => {
                let storagem = val;
                if (val.mosaicId != null && val.mosaicId != element.mosaicId.toHex()) {
                  storagem.push(valores)
                  this.storage.set('mosaics', storagem)
                }
              })
            }
          });
        
        });
        
        this.storage.set('mosaics', this.mosaic)
        this.mosaics = this.mosaic
        
        // console.log('xxxxxxx', this.mosaic)
        // this.walletService.mosaicsFormWallet(this.mosaics,);
      }, error => {
        console.log('xxxxxxx', error)
      });
    }
  }

  sendwallets() {
    console.log('Send changed');
    this.nav.navigateRoot(['/wallet-send']);
  }

  recivedwallets() {
    console.log('Recived changed');
    this.nav.navigateRoot(`/wallet-receive`);
  }

  infoTransaction(info) {
    // console.log('Recived changed',JSON.stringify(info));
    this.walletService.transactionDetail(info);
    this.nav.navigateRoot(`/transaction-info`);
  }
}
