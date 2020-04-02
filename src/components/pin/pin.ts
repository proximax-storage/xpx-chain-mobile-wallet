import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from "@angular/core";
import { HapticProvider } from '../../providers/haptic/haptic';
import * as BcryptJS from "bcryptjs";
import { Storage } from "@ionic/storage";
/**
 * Generated class for the PinComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: "ngx-pin",
  templateUrl: "pin.html"
})
export class PinComponent implements OnChanges {
  @Input() title: string = "Setup PIN";
  @Input() subtitle: string = "The following 6 PIN number is used to access your wallet. Please don't forget it: we won't be able to access your account.";
  @Input() previousPin = "";
  @Input() isVerify = false;

  activePin: string = ""
  inputPin: string = "";
  maxLength: number = 6;
  keypadNums: number[];

  styleClasses = {
    miss: false
  };

  @Output() submit: EventEmitter<string> = new EventEmitter<string>();

  constructor(private haptic: HapticProvider, private storage: Storage) {
    this.keypadNums = this.random9DigitNumberNotStartingWithZero().toString().split(",").map(Number);
    this.storage.set("isQrActive", true);
  }

  ngOnChanges(val: any) {
    if ("isVerify" in val && "previousPin" in val) {
      this.isVerify = val["isVerify"].currentValue;
      this.previousPin = val["previousPin"].currentValue;
    }
  }

  /**
   *
   *
   * @memberof PinComponent
   */
  backspace() {
    if (this.inputPin.length) {
      this.inputPin = this.inputPin.slice(0, -1);
      this.activePin = this.activePin.slice(0, -1);
    }
  }

  /**
   *
   *
   * @memberof PinComponent
   */
  emitEvent() {
    this.submit.emit(this.inputPin);
  }
  /**
   *
   *
   * @param {string} pin
   * @memberof PinComponent
   */
  handleInput(pin: string) {
    this.styleClasses.miss = false;
    this.activePin += "1";
    if (this.inputPin.length !== this.maxLength) {
      this.inputPin += pin;
      if (this.inputPin.length === this.maxLength) {
        if (this.isVerify && !BcryptJS.compareSync(this.inputPin, this.previousPin)) {
          this.styleClasses.miss = true;
          this.activePin = "";
          this.haptic.notification({ type: 'error' });
        }
        
        this.emitEvent();
        this.inputPin = "";
      }
    }
  }

  /**
   *
   *
   * @returns
   * @memberof PinComponent
   */
  random9DigitNumberNotStartingWithZero() {
    var digits = "123456789".split(""), first = this.shuffle(digits).pop();
    digits.push("0");
    return parseInt(first + this.shuffle(digits).join("").substring(0, 9), 10).toString().split("");
  }


  /**
   *
   *
   * @param {*} o
   * @returns
   * @memberof PinComponent
   */
  shuffle(o: any) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }
}
