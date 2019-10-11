export class DefaultMosaic {
    public namespaceId: string;
    public mosaicId: string;
    public hex: string;
    public amount: number;
    public divisibility: number;

    constructor({ namespaceId, mosaicId, hex, amount, divisibility }: {
        namespaceId: string;
        mosaicId: string;
        hex: string;
        amount: number;
        divisibility: number;
    }) {
        this.namespaceId = namespaceId;
        this.mosaicId = mosaicId;
        this.hex = hex;
        this.amount = amount;
        this.divisibility = divisibility;
    }
}