export class DefaultMosaic {
    public namespaceId: string;
    public mosaicId: string;
    public hex: string;
    public amount: number;
    constructor({ namespaceId, mosaicId, hex, amount }: {
        namespaceId: string;
        mosaicId: string;
        hex: string;
        amount: number;
    }) {
        this.namespaceId = namespaceId;
        this.mosaicId = mosaicId;
        this.hex = hex;
        this.amount = amount;
    }
}
