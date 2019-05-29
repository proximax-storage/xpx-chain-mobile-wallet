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
      this.walletService.walletFormatList(arr);
      this.wallets = this.walletService.wallets
      console.log('formatformat', this.wallets);
    }, reason => {
      console.log('es un error', reason);
    });
  }

  async openWallet(valor) {
    console.log('open', valor);
    this.walletService.use(valor, false);
      this.nav.navigateRoot(['/wallet-detail']);
  }
}
