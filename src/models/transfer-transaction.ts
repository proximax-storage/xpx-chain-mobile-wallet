import { Mosaic, Message, Address, Deadline, UInt64, PublicAccount, TransactionInfo } from 'tsjs-xpx-chain-sdk';

export class TransferTransaction {
    deadline: Deadline;
    maxFee: UInt64;
    message: Message;
    mosaics: Mosaic[];
    networkType: 168
    recipient: Address;
    signature: string;
    signer: PublicAccount;
    transactionInfo: TransactionInfo;
    type: number
    version: number
}