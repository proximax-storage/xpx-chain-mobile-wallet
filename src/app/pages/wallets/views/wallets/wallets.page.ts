import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
// import {  ProximaxProvider} from '../../../../providers/proximax.provider';
import { WalletService } from '../../service/wallet.service';
import { AuthService } from '../../../auth/service/auth.service';
// import { from } from 'rxjs';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.page.html',
  styleUrls: ['./wallets.page.scss'],
})
export class WalletsPage implements OnInit {

  wallets: any;
  user: string;
  constructor(
    private storage: Storage,
    private nav: NavController,
    public walletService: WalletService,
    public authService: AuthService,
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
    this.storage.get('wallets'.concat(this.user)).then((val) => {
      // this.wallets = val;
      console.log('cuentaaaa', val[0].address);
      this.walletService.getAccountInfo(val[0].address);

      console.log('walet en el store', this.wallets);
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


  openWallet(valor) {
    console.log('is open wallet', valor);
    // const detail = {
    //   name: valor.name,
    //   address: valor.addres,
    //   encryptedKey: valor.encryptedKey,
    //   iv: valor.iv,
    //   schema: valor.schema
    // }
    this.nav.navigateRoot(`/wallet-detail`);
    // this.router.navigate(['/wallet-detail', valor]);
  }
}
