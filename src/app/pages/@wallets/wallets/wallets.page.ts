import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import {  WalletService} from '../../../providers/wallet.service';
// import { environment } from '../../../../environments/environment';
// import { Wallet } from 'proximax-nem2-sdk';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DepFlags } from '@angular/core/src/view';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.page.html',
  styleUrls: ['./wallets.page.scss'],
})
export class WalletsPage implements OnInit {
  // formWallets: FormGroup;
  // wallet: boolean;
  // create: boolean;
  // checkbox: boolean;
  // private: boolean;
  wallets: any;
  constructor(
    private storage: Storage,
    private nav: NavController
    ) { }

    check = [
      { val: '', isChecked: false }
    ];
  ngOnInit() {
    // this.createForm();
    // this.checkbox = false;
    this.selectWallet();
    // this.wallets = [
    //   {
    //     'style': 'background-green',
    //     'name': 'Wallet 1',
    //     'addres': 'SDOOCNMY3K7RWSQFZKQQ7OYPXUJJLDTURYOS54ZP',
    //     'encryptedKey': '5acd11ef9efd001cd67cc6d631b89e8398dc6f09ec254861f07ed04bca72a937c2103dc0663d176261af5fd177c10c3d',
    //     'amount': 'USD 1.234',
    //     'iv': 'EFB06DA52242CDF20732F6B06F56BB82'
    //   },
    //   {
    //     'style': 'background-blue',
    //     'name': 'Wallet 2',
    //     'addres': 'SDOOCNMY3K7RWSQFZKQQ7OYPXUJJLDTURYOS54ZP',
    //     'encryptedKey': '5acd11ef9efd001cd67cc6d631b89e8398dc6f09ec254861f07ed04bca72a937c2103dc0663d176261af5fd177c10c3d',
    //     'amount': 'USD 12.494',
    //     'iv': 'EFB06DA52242CDF20732F6B06F56BB82'
    //   },
    //   {
    //     'style': 'background-yelow',
    //     'name': 'Wallet 3',
    //     'addres': 'SDOOCNMY3K7RWSQFZKQQ7OYPXUJJLDTURYOS54ZP',
    //     'encryptedKey': '5acd11ef9efd001cd67cc6d631b89e8398dc6f09ec254861f07ed04bca72a937c2103dc0663d176261af5fd177c10c3d',
    //     'amount': 'USD 1.900',
    //     'iv': 'EFB06DA52242CDF20732F6B06F56BB82'
    //   },
    //   {
    //     'style': 'background-orange',
    //     'name': 'Wallet 4',
    //     'addres': 'SDOOCNMY3K7RWSQFZKQQ7OYPXUJJLDTURYOS54ZP',
    //     'encryptedKey': '5acd11ef9efd001cd67cc6d631b89e8398dc6f09ec254861f07ed04bca72a937c2103dc0663d176261af5fd177c10c3d',
    //     'amount': 'USD 234',
    //     'iv': 'EFB06DA52242CDF20732F6B06F56BB82'
    //   }
    // ]
    // console.log(this.wallets);
  }

  
  // createForm() {
  //   this.formWallets = this.formBuilder.group({
  //     // img1: [''],
  //     // img2: [''],
  //     // img3: [''],
  //     // img4: [''],
  //     walletname: ['', Validators.required],
  //     checkbox: [false],
  //     privateKey: [''],
  //   });
  // }

  // createWallet() {
  //   // this.createForm();
  //   // this.wallet = false;
  //   // this.create = true;
  //   this.nav.navigateForward(`/wallet-create`);
  //   console.log('create new wallet');
  // }

  // onSubmit(form) {

  //   this.storage.get('pin').then((val) => {
  //     const pin = val;
  //     const password = WalletService.createPassword(pin);
  //     if ( form.checkbox === true ) {
  //       const decrip = WalletService.decryptPrivateKey(password, '6250f592f723fc61f914b2da4ccd2912b72ee74dec86769f76b0bfc506c98bd1477e015f27491a325259b9de208262d9', '0C07B4B25A335020F27A9C5D3A95E751');
  //       console.log('.....................encryptedKey', decrip);
  //       const walletPrivatekey = WalletService.createAccountFromPrivateKey(form.walletname, password, decrip, environment.network);
  //       console.log('.....................', walletPrivatekey);
  //       const walletGenerate = [{
  //         name: walletPrivatekey.name,
  //         schema: walletPrivatekey.schema,
  //         address: walletPrivatekey.address['address'],
  //         encryptedKey: walletPrivatekey.encryptedPrivateKey['encryptedKey'],
  //         iv: walletPrivatekey.encryptedPrivateKey['iv']
  //       }];
  //       this.storage.get('wallets').then((wallet) => {
  //         if( wallet === null ) {
  //           console.log('........... sin push unique' );
  //           this.storage.set('wallets', walletGenerate);
  //           this.selectWallet();
  //         } else {
  //           const walletGenerate1 = {
  //             name: walletPrivatekey.name,
  //             schema: walletPrivatekey.schema,
  //             address: walletPrivatekey.address['address'],
  //             encryptedKey: walletPrivatekey.encryptedPrivateKey['encryptedKey'],
  //             iv: walletPrivatekey.encryptedPrivateKey['iv']
  //           };
  //           console.log('...........push' );
  //           wallet.push(walletGenerate1);
  //           this.selectWallet();
  //           this.storage.set('wallets', wallet);
  //         }
         
  //       });
  //       this.wallet = true;
  //       this.create = false;
  //       this.formWallets.reset();
  //       // console.log('se llama la funcion inportar cuenta', form.privateKey);
  //     } else {
  //       const walletSimple = WalletService.createSimpleWallet(form.walletname, password, environment.network);
  //       // console.log('..............walletSimple addres.', walletSimple.address['address']);

  //       const walletGenerayte = [{
  //         name: walletSimple.name,
  //         schema: walletSimple.schema,
  //         address: walletSimple.address['address'],
  //         encryptedKey: walletSimple.encryptedPrivateKey['encryptedKey'],
  //         iv: walletSimple.encryptedPrivateKey['iv']
  //       }];
  //       // console.log('....................walletSimple convertida.', walletGenerayte);
  //       this.storage.get('wallets').then((wallet) => {
  //         console.log('retona', wallet);
  //         // JSON.parse(wallet);
  //         if( wallet === null ) {
  //           console.log('........... sin push unique' );
  //           this.storage.set('wallets', walletGenerayte);
  //           this.selectWallet();
  //         } else {
  //           const walletGenerayte1 = {
  //             name: walletSimple.name,
  //             schema: walletSimple.schema,
  //             address: walletSimple.address['address'],
  //             encryptedKey: walletSimple.encryptedPrivateKey['encryptedKey'],
  //             iv: walletSimple.encryptedPrivateKey['iv']
  //           };
  //           console.log('...........push' );
  //           wallet.push(walletGenerayte1);
  //           this.selectWallet();
  //           this.storage.set('wallets', wallet);
  //         }
         
  //       });

  //       // this.selectWallet();
  //       // const encryptedKey = walletSimple['encryptedPrivateKey'].encryptedKey;
  //       // const iv = walletSimple['encryptedPrivateKey'].iv;
  //       // console.log('.....................encryptedKey', encryptedKey);
  //       // console.log('.....................encryptedKey', iv);
  //       this.wallet = true;
  //       this.create = false;
  //       this.formWallets.reset({});
  //       console.log('se crea la cuenta nueva');
  //     }
  //   });
  // }

selectWallet() {
  this.storage.get('wallets').then((val) => { 
    this.wallets = val;
    console.log('walet en el store', val);
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
    this.nav.navigateForward(`/wallet-detail`);
    // this.router.navigate(['/wallet-detail', valor]);
  }
}
