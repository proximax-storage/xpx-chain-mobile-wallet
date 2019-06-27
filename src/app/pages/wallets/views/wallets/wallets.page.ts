import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
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
  ) { }

  ngOnInit() {
    this.selectWallet();
    // this.getWalletsStore();
  }

  // getWalletsStore() {
  //   this.user = this.authService.user;
  //   this.storage.get('wallets'.concat(this.user)).then((data) => {
      
  //     this.wallets = data;
  //     console.log('.....store wallets', this.wallets);
      
  //   });
  // }

  selectWallet() {
    this.user = this.authService.user;
    console.log("user", this.user)
    this.storage.get('wallets'.concat(this.user)).then( (val) => {
      const arr = val;
      if(arr){
      this.walletService.walletFormatList(arr);
      this.wallets = this.walletService.wallets
      console.log('formatformat', this.wallets);
      // this.getWalletsStore();
    }
    }, reason => {
      console.log('es un error', reason);
    });
  }

  async create() {
    this.nav.navigateRoot(['/wallet-create']);
  }

  async openWallet(valor) {
    console.log('open', valor);
    this.walletService.use(valor, false);
      this.nav.navigateRoot(['/wallet-detail']);
  }
}
