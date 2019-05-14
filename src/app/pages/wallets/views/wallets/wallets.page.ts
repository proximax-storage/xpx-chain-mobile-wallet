import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
// import {  ProximaxProvider} from '../../../../providers/proximax.provider';
import { WalletService } from '../../service/wallet.service';
import { AuthService } from '../../../auth/service/auth.service';
import { first } from 'rxjs/operators';
// import { from } from 'rxjs';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.page.html',
  styleUrls: ['./wallets.page.scss'],
})
export class WalletsPage implements OnInit {

  wallets: any=[];
  user: string;
  arrcuenta: any;
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
    this.storage.get('wallets'.concat(this.user)).then(async (val) => {
      const arr = val;
      arr.forEach(element => {
        
        const myAddress = element.address;
        console.log('direcciones', myAddress);
        this.walletService.getAccountInfo(myAddress).pipe(first()).subscribe(
          next => {
            console.log('...................nex', next);
            this.wallets[myAddress] = next;

            // this.arrcuenta.push(this.wallets)

            console.log('walet info', this.wallets);
          }, error => {
            // this.wallets = val;
            this.wallets[myAddress] = [];
            console.log('te dio un error, posibles causas!', this.wallets);
          }
        );

      });

      console.log('cuentaaaa', val[0].address);

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
