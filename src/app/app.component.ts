import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { Result } from './interfaces/pokeapi.interface';
import { PokemonService } from './services/pokemon.service';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pokedex-angular';

  private debounceTimer?: NodeJS.Timeout;

  public pokemonService = inject(PokemonService);
  public searchService = inject(SearchService);

  changeOrder() {
    this.pokemonService.changeOrder();
  }

  search(term: string) {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout( () => {
      if (!term) {
        this.pokemonService.pokemonList = this.pokemonService.backupPokemonList;
      } else {
        this.searchService.searchPokemon(
          [...this.pokemonService.backupPokemonList],
          term,
          'pokemon'
        );
        this.pokemonService.pokemonList = this.searchService.searchResults;
      }
    }, 500);
  }
}
