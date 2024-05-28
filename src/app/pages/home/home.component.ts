import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { PokemonService } from '../../services/pokemon.service';
import { OrderByPipe } from '../../pipes/order-by.pipe';

import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';
import { PokemonSpriteComponent } from '../../components/pokemon-sprite/pokemon-sprite.component';
import { PokemonInfoComponent } from '../../components/pokemon-info/pokemon-info.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PokemonCardComponent,
    PokemonSpriteComponent,
    PokemonInfoComponent,
    OrderByPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private debounceTimer?: NodeJS.Timeout;
  public pokemonService = inject(PokemonService);

  changeOrder() {
    this.pokemonService.toggleOrder();
  }

  search(term: string) {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout( () => {
      this.pokemonService.searchPokemon(term);
    }, 500);
  }
}
