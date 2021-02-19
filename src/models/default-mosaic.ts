export class DefaultMosaic {
    public namespaceId: string;
    public mosaicId: string;
    public hex: string;
    public amount: number;
    public amountCompact: number;
    public divisibility: number;
    public name: string

    constructor({ namespaceId, mosaicId, hex, amount, amountCompact, divisibility, name }: {
        namespaceId: string;
        mosaicId: string;
        hex: string;
        amount: number;
        amountCompact: number;
        divisibility: number;
        name?: string;
    }) {
        this.namespaceId = namespaceId;
        this.mosaicId = mosaicId;
        this.hex = hex;
        this.amount = amount;
        this.amountCompact = amountCompact;
        this.divisibility = divisibility;
        this.name = name;
    }
}