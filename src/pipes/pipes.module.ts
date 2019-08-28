import { NgModule } from '@angular/core';
import { FormatXemPipe } from './format-xem/format-xem';
import { FormatMosaicPipe } from './format-mosaic/format-mosaic';
import { FormatLevyPipe } from './format-levy/format-levy';
import { TimeagoPipe } from './timeago/timeago';
import { GetWalletTypePipe } from './get-wallet-type/get-wallet-type';
import { SearchContactPipe } from './search-contact/search-contact';
import { GetMarketPricePipe } from './get-market-price/get-market-price';
import { NemAddressPrettyPipe } from './nem-address-pretty/nem-address-pretty';
import { ShortNumPipe } from './short-num/short-num';
import { FormatImportancePipe } from './format-importance/format-importance';
@NgModule({
  declarations: [FormatXemPipe, FormatMosaicPipe, FormatLevyPipe,
    TimeagoPipe,
    GetWalletTypePipe,
    SearchContactPipe,
    GetMarketPricePipe,
    NemAddressPrettyPipe,
    ShortNumPipe,
    FormatImportancePipe],
  imports: [],
  exports: [FormatXemPipe, FormatMosaicPipe, FormatLevyPipe,
    TimeagoPipe,
    GetWalletTypePipe,
    SearchContactPipe,
    GetMarketPricePipe,
    NemAddressPrettyPipe,
    ShortNumPipe,
    FormatImportancePipe],
  providers: [FormatXemPipe, FormatMosaicPipe, FormatLevyPipe]
})
export class PipesModule {}
