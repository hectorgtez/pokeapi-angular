import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { Result } from '../../interfaces/pokeapi.interface';

import { PokemonService } from '../../services/pokemon.service';
import { SearchService } from '../../services/search.service';
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
  private _searchService = inject(SearchService);
  public pokemonService = inject(PokemonService);

  public pokemonList: Result[] = [];
  public backupPokemonList: Result[] = [];

  private debounceTimer?: NodeJS.Timeout;

  changeOrder() {
    this.pokemonService.changeOrder();
  }

  search(term: string) {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout( () => {
      if (!term) {
        this.pokemonList = this.backupPokemonList;
      } else {
        this.pokemonList = this._searchService.searchPokemon(
          [...this.backupPokemonList],
          term,
          'pokemon'
        );
      }
    }, 500);
  }
}
