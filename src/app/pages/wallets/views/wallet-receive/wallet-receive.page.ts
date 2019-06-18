import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { WalletService } from '../../service/wallet.service';
import { ToastProvider } from 'src/app/providers/toast/toast.provider';

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
    private clipboardService: ClipboardService,
    private socialSharing: SocialSharing,
    private toastProvider: ToastProvider
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
    this.toastProvider.showToast('Copied address.')
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
