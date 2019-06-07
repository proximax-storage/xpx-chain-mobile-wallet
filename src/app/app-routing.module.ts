import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/auth/views/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/auth/views/register/register.module#RegisterPageModule' },
  { path: 'wallets', loadChildren: './pages/wallets/views/wallets/wallets.module#WalletsPageModule' },
  { path: 'wallet-detail', loadChildren: './pages/wallets/views/wallet-detail/wallet-detail.module#WalletDetailPageModule' },
  { path: 'wallet-send', loadChildren: './pages/wallets/views/wallet-send/wallet-send.module#WalletSendPageModule' },
  { path: 'wallet-create', loadChildren: './pages/wallets/views/wallet-create/wallet-create.module#WalletCreatePageModule' },
  { path: 'wallet-receive', loadChildren: './pages/wallets/views/wallet-receive/wallet-receive.module#WalletReceivePageModule' },
  { path: 'transaction-info', loadChildren: './pages/wallets/views/transaction-info/transaction-info.module#TransactionInfoPageModule' },
  { path: 'congratulations', loadChildren: './pages/wallets/views/congratulations/congratulations.module#CongratulationsPageModule' },
  { path: 'list-account', loadChildren: './pages/account/views/list-account/list-account.module#ListAccountPageModule' },
  { path: 'account-detail', loadChildren: './pages/account/views/account-detail/account-detail.module#AccountDetailPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
