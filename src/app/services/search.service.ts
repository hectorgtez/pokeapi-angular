import { Injectable } from '@angular/core';
import { Result } from '../interfaces/pokeapi.interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchPokemon(array: any[], term: string, searchObject: string): Result[] {
    if (!searchObject || !term) return [];

    switch (searchObject) {
      case 'pokemon':
        return array.filter( pokemon => pokemon.name.includes(term.toLowerCase()) );
      default:
        return [];
    }
  }
}
