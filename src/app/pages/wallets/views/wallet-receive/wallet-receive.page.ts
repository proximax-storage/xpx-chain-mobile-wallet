import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ClipboardService } from 'ngx-clipboard';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { WalletService } from '../../service/wallet.service';

@Component({
  selector: 'app-wallet-receive',
  templateUrl: './wallet-receive.page.html',
  styleUrls: ['./wallet-receive.page.scss'],
})
export class WalletReceivePage implements OnInit {
  wallet: any;
  qrData = null;
  createdCode: any;
  url: any
  link: string;
  file: string | string[];

  constructor(
    private walletService: WalletService,
    public toastController: ToastController,
    private clipboardService: ClipboardService,
    private socialSharing: SocialSharing
  ) { }

  ngOnInit() {
    this.wallet = this.walletService.current;
    this.createcode();
  }

  createcode() {
    this.createdCode = this.wallet.address;
    console.log(this.createdCode)
  }
  async copyAddress(address) {
    this.clipboardService.copyFromContent(address);
    const toast = await this.toastController.create({
      message: 'Copied address.',
      duration: 3000
    });
    toast.present();
  }

  shared() {
    const qrCode = document.getElementById("qrcode").firstChild.firstChild;
    this.file = qrCode['src'];
    this.socialSharing.share(this.wallet.address, null, this.file, this.link)
    .then(()=> {
    }).catch((error)=> {
      console.log('error', error)
    });
  }


}
