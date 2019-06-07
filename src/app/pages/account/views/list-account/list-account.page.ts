import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/pages/auth/service/auth.service';
import { WalletService } from 'src/app/pages/wallets/service/wallet.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.page.html',
  styleUrls: ['./list-account.page.scss'],
})
export class ListAccountPage implements OnInit {
  user: string;
  accounts: any;

  constructor(
    private storage: Storage,
    private nav: NavController,
    public authService: AuthService,
    public walletService: WalletService,
  ) { }

  ngOnInit() {
    this.getWalletsStore();
  }

   getWalletsStore() {
    this.user = this.authService.user;
    this.storage.get('wallets'.concat(this.user)).then((data) => {
      this.accounts = data;
      console.log('.....store wallets', this.accounts);
    });
  }

  async openWallet(valor) {
    this.walletService.use(valor, false);
      this.nav.navigateRoot(['/account-detail']);
  }
}
