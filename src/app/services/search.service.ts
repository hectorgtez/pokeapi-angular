import { Injectable } from '@angular/core';
import { Result } from '../interfaces/pokeapi.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public searchResults: Result[] = [];

  searchPokemon(array: any[], term: string, searchObject: string) {
    if (!searchObject || !term) return;
    this.searchResults = [];

    switch (searchObject) {
      case 'pokemon':
        this.searchResults = array.filter( pokemon => pokemon.name.includes(term.toLowerCase()) );
        break;
    }
  }
}
