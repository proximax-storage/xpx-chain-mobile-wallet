import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UtilitiesProvider } from '../../../../providers/utilities/utilities';
import { App } from '../../../../providers/app/app';
import { ProximaxProvider } from '../../../../providers/proximax/proximax';
import { MosaicInfo, Mosaic, MosaicId, UInt64, TransferTransaction, Deadline, PlainMessage, Address, AggregateTransaction, Account, SignedTransaction, Convert } from 'tsjs-xpx-chain-sdk';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from "@ionic/storage";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertProvider } from '../../../../providers/alert/alert';
import { TranslateService } from '@ngx-translate/core';
import { WalletProvider } from '../../../../providers/wallet/wallet';
import { ConfigurationForm } from '../../../../providers/shared-service/shared-service';
import { AppConfig } from '../../../../app/app.config';
import { TransferTransactionProvider } from '../../../../providers/transfer-transaction/transfer-transaction';
import { HapticProvider } from '../../../../providers/haptic/haptic';
import { MosaicsProvider } from '../../../../providers/mosaics/mosaics';

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
  displaySuccessMessage: boolean = false;
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
  feeMax: number;

  constructor(
    public alertProvider: AlertProvider,
    private barcodeScanner: BarcodeScanner,
    public formBuilder: FormBuilder,
    private haptic: HapticProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private proximaxProvider: ProximaxProvider,
    private storage: Storage,
    private translateService: TranslateService,
    private transferTransaction: TransferTransactionProvider,
    public utils: UtilitiesProvider,
    private viewCtrl: ViewController,
    public walletProvider: WalletProvider,
    public mosaicsProvider: MosaicsProvider,
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
    this.calculateFeeTxComplete()
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
          Validators.maxLength(10),
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


  calculateFeeTxComplete() {
    const networkType = AppConfig.sirius.networkType
    const giftCardAccount: Account = Account.createFromPrivateKey(this.dataGif[0].pkGift, networkType);
    const msg = JSON.stringify({ type: 'gift', msg: this.serializeData('C3975E', '1237654637') })
    const deadLine = Deadline.create()

    const Tx1 = TransferTransaction.create(
      deadLine,
      this.addressOrigin,
      [this.mosaics],
      PlainMessage.create(msg),
      networkType
    )

    const Tx2 = TransferTransaction.create(
      deadLine,
      this.addressOrigin,
      [],
      PlainMessage.create(msg),
      networkType
    )

    const aggregateTx = AggregateTransaction.createComplete(
      deadLine,
      [
        Tx1.toAggregate(giftCardAccount.publicAccount),
        Tx2.toAggregate(giftCardAccount.publicAccount)
      ],
      networkType,
      []
    );

    this.feeMax = aggregateTx.maxFee.compact() * 20 / 100 + aggregateTx.maxFee.compact()
  }

  // OBTENER INFO DEL MOSAIC 
  async dataMosaics() {
    const mosaicsFound: MosaicInfo[] = await this.proximaxProvider.getMosaics([this.mosaicsID.id]).toPromise();
    this.addressDetination = mosaicsFound[0].owner.address
    this.divisibility = mosaicsFound[0].divisibility
    this.amountFormatter = this.proximaxProvider.amountFormatter(this.mosaicsAmount, this.divisibility)

    if (this.addressDetination.pretty()) {
      // this.test()
      this.loading = false
    }

    if (this.dataGif[0].typeGif === '0') {
      this.showTransferable = false
    } else {
      this.showTransferable = true
    }
  }

  // test(){
  //   this.mosaicsProvider.getMosaics(this.addressDetination).subscribe(async mosaics => {

  //     console.log('\n ########_______******** \n', JSON.stringify(mosaics))
  //   })
  // }

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

  hexToString(hex) {
    var string = '';
    for (var i = 0; i < hex.length; i += 2) {
      string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GiftCardsPage');
  }

  init() {
  }

  // OBTENER NAME DEL MOSAIC 
  async mosaicName() {
    this.proximaxProvider.getMosaicsName([this.mosaicsID.id]).subscribe(name => {
      this.nameMosaic = name[0].names[0].name
    })
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
    let addressDetination: any
    if(this.form.controls.recipientAddress.value === ''){
      addressDetination = this.addressDetination
    } else {
      addressDetination = this.proximaxProvider.createFromRawAddress(this.form.controls.recipientAddress.value)
    }

    this.block = true;
    const networkType = AppConfig.sirius.networkType
    const giftCardAccount: Account = Account.createFromPrivateKey(this.dataGif[0].pkGift, networkType);
    // toGovernmentTx
    const deadLine = Deadline.create()
    const msg = JSON.stringify({ type: 'gift', msg: this.serializeData(this.dataGif[0].codeGift, this.form.get("idenficatorUser").value) })

    const toDetinationTx = TransferTransaction.create(
      deadLine,
      addressDetination,
      [this.mosaics],
      PlainMessage.create(msg),
      networkType
    )

    // toOriginTx
    const toOriginTx = TransferTransaction.create(
      deadLine,
      this.addressOrigin,
      [],
      PlainMessage.create(msg),
      networkType
    )
    // Build Complete Transaction
    const aggregateTransaction = AggregateTransaction.createComplete(
      deadLine,
      [
        toDetinationTx.toAggregate(giftCardAccount.publicAccount),
        toOriginTx.toAggregate(giftCardAccount.publicAccount)
      ],
      networkType,
      [],
      UInt64.fromUint(this.feeMax)
    );

    // Sign bonded Transaction
    const signedTransaction: SignedTransaction = giftCardAccount.sign(aggregateTransaction, AppConfig.sirius.networkGenerationHash);
    // console.log('\n signedTransaction \n', JSON.stringify(signedTransaction))
    // Announce Transaction
    this.proximaxProvider.announceTx(signedTransaction).subscribe(
      next => console.log('Tx sent......'),
      error => console.log('Error to Sent ->', error)
    );

    this.transferTransaction.checkTransaction(signedTransaction).subscribe(status => {
      if (status.group && status.group === 'unconfirmed' || status.group === 'confirmed') {
        this.block = false;
        this.displaySuccessMessage = true;
        this.showSuccessMessage();
      } else {
        this.showErrorMessage(status.status);
        this.block = false;
      }
    }, error => {
      this.block = false;
      this.showErrorMessage(error);
    })
  }

  serializeData(code, dni) {
    const codeUin8 = Convert.hexToUint8(code)
    const dniUin8 = Convert.hexToUint8(Convert.utf8ToHex(Convert.rstr2utf8(dni)))
    return this.concatUniArray(codeUin8, dniUin8)
 }

  showErrorMessage(error) {
    this.haptic.notification({ type: 'warning' });
    console.log(error);
    if (error.toString().indexOf('FAILURE_INSUFFICIENT_BALANCE') >= 0) {
      this.alertProvider.showMessage(this.translateService.instant("SERVICES.GIFT_CARD.NOTES.PLACEHOLDER"));
    } else if (error.toString().indexOf('Failure_Core_Insufficient_Balance') >= 0) {
      this.alertProvider.showMessage(this.translateService.instant("SERVICES.GIFT_CARD.NOTES.PLACEHOLDER"));
    } else if (error.toString().indexOf('Failure_Multisig_Operation_Not_Permitted_By_Account') >= 0) {
      this.alertProvider.showMessage(this.translateService.instant("WALLETS.TRANSFER.ALLOWED_FOR_MULTISIG"));
    } else {
      this.alertProvider.showMessage(
        error
      );
    }
  }

  showSuccessMessage() {
    setTimeout(() => {
      this.displaySuccessMessage = false;
      this.haptic.notification({ type: 'success' });
      this.utils.setTabIndex(2);
      this.navCtrl.setRoot(
        'TabsPage',
        {},
        {
          animate: true,
          direction: 'backward'
        }
      );
    }, 3000);
  }

  concatUniArray(buffer1, buffer2) {
    const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength)
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    console.log(tmp)
    return Convert.uint8ToHex(tmp);
  }

  unSerialize(hex) {
    const dataUin8 = Convert.hexToUint8(hex)
    const codeUin8 = new Uint8Array(20)
    const dniUin8 = new Uint8Array(8)
    codeUin8.set(new Uint8Array(dataUin8.subarray(0, 20)), 0)
    dniUin8.set(new Uint8Array(dataUin8.subarray(20, 28)), 0)
    const code = this.hexToString(Convert.uint8ToHex(codeUin8))
    const dni = UInt64.fromHex(Convert.uint8ToHex(dniUin8))
    console.log('code', code)
    console.log('dni', dni)
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
