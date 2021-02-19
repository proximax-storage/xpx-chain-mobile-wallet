"use strict";

import { SimpleWallet } from "tsjs-xpx-chain-sdk";

/**
 * Simple wallet model generates a private key from a PRNG
 */
export declare class CustomSimpleWallet extends SimpleWallet {
   
    walletColor:string;
    totalNumber:string;
}
exports.SimpleWallet = CustomSimpleWallet;
//# sourceMappingURL=SimpleWallet.js.map