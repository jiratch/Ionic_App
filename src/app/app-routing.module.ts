import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [

  { path: 'main_tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },

 //{ path: '', loadChildren: './login/login.module#LoginPageModule' },

  //{ path: '', redirectTo:"login",pathMatch:"full" },
   { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  //{ path: '', loadChildren: './details/details.module#DetailsPageModule' },
  //{ path: '', loadChildren: './home/home.module#HomePageModule',canActivate: [AuthGuard] },
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule',canActivate: [AuthGuard]  },
  { path: 'details', loadChildren: './details/details.module#DetailsPageModule',canActivate: [AuthGuard] },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'favorite', loadChildren: './favorite/favorite.module#FavoritePageModule',canActivate: [AuthGuard] },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
