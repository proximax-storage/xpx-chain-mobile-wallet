import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/@auth/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/@auth/register/register.module#RegisterPageModule' },
  { path: 'wallets', loadChildren: './pages/@wallets/wallets/wallets.module#WalletsPageModule' },
  { path: 'wallet-detail', loadChildren: './pages/@wallets/wallet-detail/wallet-detail.module#WalletDetailPageModule' },
  { path: 'wallet-send', loadChildren: './pages/@wallets/wallet-send/wallet-send.module#WalletSendPageModule' },
  { path: 'wallet-create', loadChildren: './pages/@wallets/wallet-create/wallet-create.module#WalletCreatePageModule' },
  { path: 'wallet-receive', loadChildren: './pages/@wallets/wallet-receive/wallet-receive.module#WalletReceivePageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
