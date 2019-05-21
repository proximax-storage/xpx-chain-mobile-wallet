import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/auth/views/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/auth/views/register/register.module#RegisterPageModule' },
  { path: 'wallets', loadChildren: './pages/wallets/views/wallets/wallets.module#WalletsPageModule' },
  { path: 'wallet-detail/:data', loadChildren: './pages/wallets/views/wallet-detail/wallet-detail.module#WalletDetailPageModule' },
  { path: 'wallet-send/:data', loadChildren: './pages/wallets/views/wallet-send/wallet-send.module#WalletSendPageModule' },
  { path: 'wallet-create', loadChildren: './pages/wallets/views/wallet-create/wallet-create.module#WalletCreatePageModule' },
  { path: 'wallet-receive', loadChildren: './pages/wallets/views/wallet-receive/wallet-receive.module#WalletReceivePageModule' },
  { path: 'wallet-mosaics', loadChildren: './pages/wallets/views/wallet-mosaics/wallet-mosaics.module#WalletMosaicsPageModule' },
  { path: 'transaction-info', loadChildren: './pages/wallets/views/transaction-info/transaction-info.module#TransactionInfoPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
