import { Injectable } from '@angular/core';


@Injectable()
export class SharedService {

  configurationForm: ConfigurationForm = {
    address: {
      minLength: 40,
      maxLength: 46
    },
    amount: {
      maxLength: 20
    },
    nameWallet: {
      minLength: 3,
      maxLength: 30
    },
    privateKey: {
      minLength: 64,
      maxLength: 66
    },
    publicKey: {
      minLength: 64,
      maxLength: 64
    },
    passwordWallet: {
      minLength: 8,
      maxLength: 30
    },
    message: {
      maxLength: 1024
    },
  };

  constructor(

  ) { }

    /**
   * Method to add leading zeros
   *
   * @param cant Quantity of zeros to add
   * @param amount Amount to add zeros
   */
  
  addZeros(cant: any, amount = 0) {
    let decimal: any;
    let realAmount: any;
    if (amount === 0) {
      decimal = this.addDecimals(cant);
      realAmount = `0${decimal}`;
    } else {
      const arrAmount = amount.toString().replace(/,/g, "").split(".");
      if (arrAmount.length < 2) {
        decimal = this.addDecimals(cant);
      } else {
        const arrDecimals = arrAmount[1].split("");
        decimal = this.addDecimals(cant - arrDecimals.length, arrAmount[1]);
      }
      realAmount = `${arrAmount[0]}${decimal}`;
    }
    return realAmount;
  }


  /**
   * Method to add leading zeros
   *
   * @param cant Quantity of zeros to add
   * @param amount Amount to add zeros
   */
  addDecimals(cant: any, amount = "0") {
    const x = "0";
    if (amount === "0") {
      for (let index = 0; index < cant - 1; index++) {
        amount += x;
      }
    } else {
      for (let index = 0; index < cant; index++) {
        amount += x;
      }
    }
    return amount;
  }

}



export interface ConfigurationForm {
  address?: {
    minLength: number;
    maxLength: number;
  };
  amount?: {
    maxLength: number;
  };
  message?: {
    maxLength: 1024
  }
  nameWallet?: {
    minLength: number;
    maxLength: number;
  };
  privateKey?: {
    minLength: number;
    maxLength: number;
  };
  publicKey?: {
    minLength: number;
    maxLength: number;
  };
  passwordWallet?: {
    minLength: number;
    maxLength: number;
  };
}

