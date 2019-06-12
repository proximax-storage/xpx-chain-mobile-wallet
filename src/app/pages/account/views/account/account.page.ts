import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/pages/auth/service/auth.service';
import { WalletService } from 'src/app/pages/wallets/service/wallet.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  user: string;
  accounts: any;

  constructor(
    private nav: NavController,
    public authService: AuthService,
    public walletService: WalletService,
  ) { }

  ngOnInit() {

  }

  async openNotification(valor) {
    console.log('notification')
      // this.nav.navigateRoot(['/account-detail']);
  }
}
