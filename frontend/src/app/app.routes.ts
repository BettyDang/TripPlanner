import { Routes } from '@angular/router';
import { TripListComponent } from './pages/trip-list/trip-list.component';
import { TripDetailComponent } from './pages/trip-detail/trip-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { AddTripComponent } from './pages/add-trip/add-trip.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'add-trip', component: AddTripComponent },
    { path: 'trips', component: TripListComponent },
    { path: 'trips/:id', component: TripDetailComponent },

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }
  ];