import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { App } from '../../../../providers/app/app';
import { ProximaxProvider } from '../../../../providers/proximax/proximax';
import { MosaicInfo, Mosaic, MosaicId, UInt64, TransferTransaction, Deadline, PlainMessage, Address, AggregateTransaction, Account, SignedTransaction } from 'tsjs-xpx-chain-sdk';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from "@ionic/storage";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertProvider } from '../../../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';
import { WalletProvider } from '../../../../providers/wallet/wallet';
import { ConfigurationForm } from '../../../../providers/shared-service/shared-service';

/**
 * Generated class for the GiftCardsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gift-cards',
  templateUrl: 'gift-cards.html',
})
export class GiftCardsPage {

  App = App;
  addressOrigin: Address;
  addressDetination: Address;
  addressSourceType: { from: string; to: string; };
  amountFormatter: string = '0';
  block: boolean;
  configurationForm: ConfigurationForm = {};
  currentWallet: any;
  dataGif: any;
  divisibility: number;
  form: FormGroup;
  hexadecimal: any;
  loading: boolean = true;
  mosaicsID: any;
  mosaics: any;
  mosaicsHex: any;
  mosaicsAmount: any;
  msgErrorUnsupported: any;
  nameMosaic: string;
  showTransferable: boolean;

  constructor(
    public alertProvider: AlertProvider,
    private barcodeScanner: BarcodeScanner,
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    private proximaxProvider: ProximaxProvider,
    private storage: Storage,
    private translateService: TranslateService,
    public utils: UtilitiesProvider,
    private viewCtrl: ViewController,
    public walletProvider: WalletProvider
  ) {
    this.dataGif = this.navParams.data;
    this.mosaicsHex = this.dataGif[0].mosaicGift
    this.mosaicsAmount = this.dataGif[0].amountGift
    this.mosaics = new Mosaic(new MosaicId(this.mosaicsHex), UInt64.fromUint(Number(this.mosaicsAmount)));
    this.mosaicsID = new MosaicId(this.mosaicsHex)

    this.createForm()
    this.dataMosaics()
    this.getAccountSelected()
    this.mosaicName()
    this.subscribeValue()
  }

  createForm() {
    this.form = this.formBuilder.group({
      recipientName: "",
      recipientAddress: [
        "",
        [
          Validators.required,
          Validators.minLength(40),
          Validators.maxLength(46)
        ]
      ],
      idenficatorUser: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(1000),
        ]
      ]
    })

    this.addressSourceType = {
      from: "contact",
      to: "contact"
    };

    // Defaults to manual contact input
    this.addressSourceType.to = "manual";
    if (this.addressSourceType.to === "manual") {
      this.form.get("recipientAddress").setValue("");
    }
  }

  // OBTENER INFO DEL MOSAIC 
  async dataMosaics() {
    const mosaicsFound: MosaicInfo[] = await this.proximaxProvider.getMosaics([this.mosaicsID.id]).toPromise();
    this.addressDetination = mosaicsFound[0].owner.address
    this.divisibility = mosaicsFound[0].divisibility
    this.amountFormatter = this.proximaxProvider.amountFormatter(this.mosaicsAmount, this.divisibility)

    if (this.addressDetination.pretty()) {
      this.loading = false
    }

    if (this.dataGif[0].typeGif === '0') {
      this.showTransferable = false
    } else {
      this.showTransferable = true
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  // OBTENER LA CUENTA DEL DISTRIBUIDOR QUE ESTA EN STORAGE
  getAccountSelected() {
    this.walletProvider.getAccountSelected().then(currentWallet => {
      this.currentWallet = this.proximaxProvider.createFromRawAddress(currentWallet.account.address['address'])
      this.addressOrigin = this.currentWallet
    })
  }

  // OBTENER NAME DEL MOSAIC 
  async mosaicName() {
    this.proximaxProvider.getMosaicsName([this.mosaicsID.id]).subscribe(name => {
      this.nameMosaic = name[0].names[0].name
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GiftCardsPage');
  }

  init() {
  }


  onChangeTo(val) {
    if (val === "manual") {
      this.form.get("recipientName").setValue(null);
      this.form.get("recipientAddress").setValue(null);
    }
    if (val === "qrcode") {
      this.scan();
    }
  }

  onSubmit() {
    this.block = true;
    console.log(this.form);
    const networkType = this.addressDetination.networkType
    const giftCardAccount = Account.createFromPrivateKey(this.dataGif.pkGift, networkType);
    // toGovernmentTx
    const deadLine = Deadline.create()
    const toDetinationTx = TransferTransaction.create(
      deadLine,
      this.addressDetination,
      [this.mosaics],
      PlainMessage.create('send 1 care pack to Goverment'),
      networkType
    )

    console.log('toDetinationTx', toDetinationTx)
    // toOriginTx
    const toOriginTx = TransferTransaction.create(
      deadLine,
      this.addressOrigin,
      [],
      PlainMessage.create('Distribuitor Tx'),
      networkType
    )
    console.log('toOriginTx', toOriginTx)
    // Build Complete Transaction
    const aggregateTransaction = AggregateTransaction.createComplete(
      deadLine,
      [],
      networkType,
      []
    );

    console.log('\n aggregateTransaction \n', aggregateTransaction)
    // Sign bonded Transaction
    const signedTransaction: SignedTransaction = giftCardAccount.sign(aggregateTransaction, this.walletProvider.generationHash);
    console.log('\n signedTransaction \n', signedTransaction)
    // Announce Transaction
    this.proximaxProvider.announceTx(signedTransaction).subscribe(
      next => console.log('Tx sent......'),
      error => console.log('Error to Sent ->', error)
    );
  }

  scan() {
    this.storage.set("isQrActive", true);
    this.form.patchValue({ recipientAddress: "", emitEvent: false, onlySelf: true });
    this.barcodeScanner.scan().then(barcodeData => {
      barcodeData.format = "QR_CODE";
      let address = barcodeData.text.split("-").join("")
      if (address.length != 40) {
        this.alertProvider.showMessage(this.translateService.instant("WALLETS.SEND.ADDRESS.INVALID"))
      } else if (!this.proximaxProvider.verifyNetworkAddressEqualsNetwork(this.addressOrigin.pretty(), address)) {
        this.alertProvider.showMessage(this.translateService.instant("WALLETS.SEND.ADDRESS.UNSOPPORTED"))
      } else {
        this.form.patchValue({ recipientAddress: barcodeData.text });
      }
    }).catch(err => {
      if (err.toString().indexOf(this.translateService.instant("WALLETS.SEND.ERROR.CAMERA1")) >= 0) {
        let message = this.translateService.instant("WALLETS.SEND.ERROR.CAMERA2");
        this.alertProvider.showMessage(message);
      }
    });
  }

  selectContact(title) {
    this.utils.showInsetModal("SendContactSelectPage", { title: title }).subscribe(data => {
      if (data != undefined || data != null) {
        this.form.get("recipientName").setValue(data.name);
        this.form.get("recipientAddress").setValue(data.address);
      }
    });
  }

  subscribeValue() {
    // Account recipient
    this.form.get("recipientAddress").valueChanges.subscribe(value => {
      const accountRecipient = value !== undefined && value !== null && value !== "" ? value.split("-").join("") : "";
      if (accountRecipient !== null && accountRecipient !== undefined && accountRecipient.length === 40) {
        if (!this.proximaxProvider.verifyNetworkAddressEqualsNetwork(this.addressOrigin.pretty(), accountRecipient)) {
          // this.blockSendButton = true;
          this.msgErrorUnsupported = this.translateService.instant("WALLETS.SEND.ADDRESS.UNSOPPORTED");
        } else {
          // this.blockSendButton = false;
          this.msgErrorUnsupported = "";
        }
      } else {
        // this.blockSendButton = true;
        this.msgErrorUnsupported = this.translateService.instant("WALLETS.SEND.ADDRESS.INVALID");
      }
    });
  }
}
