import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/@auth/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/@auth/register/register.module#RegisterPageModule' },
  { path: 'wallets', loadChildren: './pages/@wallets/wallets/wallets.module#WalletsPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
