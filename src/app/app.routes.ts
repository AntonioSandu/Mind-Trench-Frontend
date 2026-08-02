import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login';
import { RegisterComponent } from './features/auth/pages/register/register';
import { DashboardComponent } from './features/home/pages/dashboard/dashboard';
import { LandingComponent } from './features/home/pages/landing/landing';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { DeleteAccountComponent } from './features/user/pages/delete-account/delete-account';
import { ChangePasswordComponent } from './features/user/pages/change-password/change-password';
import { NotFoundComponent } from './features/error/pages/not-found/not-found';
import { GamePageComponent } from './features/game/pages/game-page/game-page';
import { LeaderboardComponent } from './features/home/pages/leaderboard/leaderboard';
import { ManualComponent } from './features/home/pages/manual/manual';

export const routes: Routes = [

  {
    path: '',
    component: LandingComponent,
    canActivate: [guestGuard]
  },

  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard]
  },

  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [guestGuard]
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  {
    path: 'user/change-password',
    component: ChangePasswordComponent,
    canActivate: [authGuard]
  },

  {
    path: 'user/delete-account',
    component: DeleteAccountComponent,
    canActivate: [authGuard]
  },
  
  {
    path: 'game/:id',
    component: GamePageComponent,
    canActivate: [authGuard]
  },

  {
    path: 'not-found',
    component: NotFoundComponent
  },

  {
    path: 'leaderboard',
    component: LeaderboardComponent,
    canActivate: [authGuard]
  },

  {
    path: 'manual',
    component: ManualComponent,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: '/not-found'
  }

];