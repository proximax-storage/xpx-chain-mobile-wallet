import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { WalletService } from '../../service/wallet.service'
import { ProximaxProvider } from 'src/app/providers/sdk/proximax.provider';
import { environment } from '../../../../../environments/environment'
import { ClipboardService } from 'ngx-clipboard';
import { ToastProvider } from 'src/app/providers/toast/toast.provider';
import { AuthService } from 'src/app/pages/auth/service/auth.service';
import { AlertProvider } from 'src/app/providers/alert/alert.provider';


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
  alfaNumberPattern  = '^[a-zA-Z0-9 *#$.&]+$';
  showPasword: boolean;
  password: any;
  user: string;
  walletStore: any;
  deleteIn = false;
  subscriptions: any = [
    'delete'
  ];
  constructor(
    private nav: NavController,
    private storage: Storage,
    private clipboardService: ClipboardService,
    public formBuilder: FormBuilder,
    private walletService: WalletService,
    private proximaxProvider: ProximaxProvider,
    private toastProvider: ToastProvider,
    private alertProvider: AlertProvider,
    public authservice: AuthService,
  ) { }

  ngOnInit() {
    this.showPasword = true;
    this.segmentMosaic = true;
    this.wallet = this.walletService.current;
    this.user = this.authservice.user;
    this.createForm()
    this.getMisaicsStore();
    this.getWalletStore();
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
   showPrivateKey(form) {
    if (form.password == '') {
      this.toastProvider.showToast('Password required. Please try again.')
    } else {
     if(form.password === this.password ){
      this.formAccount.patchValue({
        privateKey: this.privateKey.toUpperCase()
      })
      this.showPasword = false;
      } else {
        this.toastProvider.showToast('incorrect information. Try again.')

      }  
    }
  }
  
   copyMessage(valor, type) {
    this.clipboardService.copyFromContent(valor);
    this.toastProvider.showToast('Copied '+ `${type}`)
  }

  selectAllTransaction(data) {
    this.storage.get('pin').then(val => {
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
    this.walletService.transactionDetail(info);
    this.nav.navigateRoot(`/transaction-info`);
  }

  getWalletStore() {
    this.storage.get('wallets'.concat(this.user)).then(async (wallets) => {
      this.walletStore = wallets.filter(element => element.address !==  this.wallet.address)
    });
  }

  delete() {
    const header = 'You are about to delete ' + `${this.wallet.name}` + ' wallet!'
    const message = 'Continuing this action will delete the wallet from your account and it cannot be undone. Please make sure you backup your wallet first so that you can recover it anytime.'
    this.alertProvider.show(header, message)
    this.deleted()
  }

  deleted() {
    this.subscriptions.delete = this.alertProvider.getDelete();
    this.subscriptions.delete.subscribe(
      response => {
        this.deleteIn = response;
        if (this.deleteIn) {
          this.storage.set('wallets'.concat(this.user), this.walletStore)
          this.nav.navigateRoot(`/wallets`);
          this.alertProvider.setDelete(false);
        } else {
          console.log('Cancel');
        }
      });
  }
}
