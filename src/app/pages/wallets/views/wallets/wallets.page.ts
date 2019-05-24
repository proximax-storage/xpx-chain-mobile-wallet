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
 
  constructor(
    private storage: Storage,
    private nav: NavController,
    public walletService: WalletService,
    public authService: AuthService,
    public toastController: ToastController,
  ) { }

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
        this.walletService.getAccountInfo(myAddress).pipe(first()).subscribe(
          next => {
            const valor = next['mosaics'][0]['amount'].compact()
            const amount = this.walletService.amountFormatterSimple(valor);
            const valores = {
              style: element.style,
              name: element.name,
              address: next['address']['address'],
              algo: element.algo,
              network: next['address']['networkType'],
              amount: amount,
              mosaics: next['mosaics'][0]['id']['id'].toHex(),
              encrypted: element.encrypted,
              iv: element.iv
            };
            this.wallets.push(valores);
          }, error => {
            const valores = {
              style: element.style,
              name: element.name,
              schema: element.schema,
              address: element.address,
              algo: element.algo,
              encrypted: element.encrypted,
              iv: element.iv,
              network: element.network
            };
            this.wallets.push(valores);
            console.log('te dio un error,  posibles causas !' , this.wallets);
          }
        );
      });
    }, reason => {
      console.log('es un error', reason);
    });
  }

  async openWallet(valor) {
    this.walletService.use(valor, false);
      this.nav.navigateRoot(['/wallet-detail']);
  }
}
