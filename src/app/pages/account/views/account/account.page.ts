import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/pages/auth/service/auth.service';
import { WalletService } from 'src/app/pages/wallets/service/wallet.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  user: string;
  accounts: any;
  otrosUser: any;
  userservice: any;
  data: any;
  username: any;
  firstname: any;
  lastname: any;

  constructor(
    private nav: NavController,
    public authService: AuthService,
    public walletService: WalletService,
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.userservice = this.authService.user
    this.getUserStore()
  }
  
  getUserStore() {
    this.storage.get('accounts').then(async (user) => {
      user.forEach(element => {
        this.otrosUser = user.filter(element => element.username !== this.userservice)
        if(element.username ===  this.userservice){
          this.data = element
          this.username = this.data.username
          this.firstname = this.data.firstname
          this.lastname = this.data.lastname
          this.authService.userData(this.data, this.otrosUser);
        }
      });
    });
  }

  editarUser() {
    this.nav.navigateRoot(['/edit-user'])
  }

  logout() {
    this.authService.logout();
    return this.nav.navigateRoot(`/login`);
  }
  async openNotification(valor) {
    console.log('notification')
      // this.nav.navigateRoot(['/account-detail']);
  }
}
