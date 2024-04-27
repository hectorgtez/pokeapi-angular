import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { PokemonListComponent } from './pages/pokemon-list/pokemon-list.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: PokemonListComponent },
    ]
  },
];
