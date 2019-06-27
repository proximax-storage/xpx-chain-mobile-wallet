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
  { path: 'account', loadChildren: './pages/account/views/account/account.module#AccountPageModule' },
  { path: 'service', loadChildren: './pages/services/views/service/service.module#ServicePageModule' },  
  { path: 'address-book', loadChildren: './pages/services/views/address-book/address-book.module#AddressBookPageModule' },
  { path: 'add-contact', loadChildren: './pages/services/views/add-contact/add-contact.module#AddContactPageModule' },
  { path: 'edit-contact', loadChildren: './pages/services/views/edit-contact/edit-contact.module#EditContactPageModule' },
  { path: 'edit-user', loadChildren: './pages/account/views/edit-user/edit-user.module#EditUserPageModule' },
  { path: 'multisign-support', loadChildren: './pages/services/views/multisign-support/multisign-support.module#MultisignSupportPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
