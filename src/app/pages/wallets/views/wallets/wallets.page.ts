import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, ToastController } from '@ionic/angular';
import { WalletService } from '../../service/wallet.service';
import { AuthService } from '../../../auth/service/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.page.html',
  styleUrls: ['./wallets.page.scss'],
})
export class WalletsPage implements OnInit {

  wallets: any=[];
  user: string;
  params: { name: any; address: any; amount: any; mosaics: any; };
  constructor(
    private storage: Storage,
    private nav: NavController,
    public walletService: WalletService,
    public authService: AuthService,
    public toastController: ToastController,
  ) { }

  check = [
    { val: '', isChecked: false }
  ];
  ngOnInit() {
    this.selectWallet();
  }

  selectWallet() {
    this.user = this.authService.user;
    console.log(this.user)
    this.storage.get('wallets'.concat(this.user)).then(async (val) => {
      const arr = val;
      arr.forEach(element => {
        const myAddress = element.address;
        console.log('direcciones', myAddress);
        this.walletService.getAccountInfo(myAddress).pipe(first()).subscribe(
          next => {
              console.log('nex................', next)
            // const sup = next['mosaics'][0]['amount']['higher']
            const valor = next['mosaics'][0]['amount'].compact()
            const amount = this.walletService.amountFormatterSimple(valor);

            // const mosaicshigher= next['mosaics'][0]['id']['id']['higher']
            // const mosaicslower= next['mosaics'][0]['id']['id']['lower']



            const valores = {
              name: element.name,
              address: next['address']['address'],
              amount: amount,
              mosaics: next['mosaics'][0]['id']['id'].toHex() 
            };
            console.log('valores valores', valores);
            this.wallets.push(valores);
            // console.log('walet info', this.wallets);
          }, error => {
            const valores = {
              name: element.name,
              schema: element.schema,
              address: element.address,
              encryptedKey: element.encryptedKey,
              iv: element.iv
            };
            this.wallets.push(valores);
            console.log('te dio un error, posibles causas!', this.wallets);
          }
        );
      });
    }, reason => {
      console.log('es un error');
    });
  }

  // updateCucumber(e) {
  //   console.log('eeeeeeeeee', e.target.checked);
  //   this.checkbox = !this.checkbox;
  //   if ( this.checkbox === false ) {
  //     console.log('limpieza');
  //   } else {
  //     this.private = true;
  //   }
  // }


  async openWallet(valor) {
    
    // const params = {
    //   name: valor.name,
    //   address: valor.address,
    //   amount: valor.amount,
    //   mosaics: valor.mosaics
    // };
    // if(valor === undefined){
    //   console.log('is open wallet', valor);
    //   console.log('WALLET SON TRANSACCION')
    //   const toast = await this.toastController.create({
    //     message: 'the account has no transactions.',
    //     duration: 3000
    //   });
    //   toast.present();
    // } else {
      console.log('is open wallet', valor);
      this.nav.navigateRoot(['/wallet-detail/', JSON.stringify(valor)]);
    // }
  }
}
