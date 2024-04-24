import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';

import { Data, Result } from '../interfaces/pokeapi.interface';
import { Pokemon } from '../interfaces/pokemon.interface';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private _http = inject(HttpClient);
  private _apiUrl = environment.apiUrl;

  public pokemonList: Result[] = [];
  public order: 'number' | 'name' = 'number';

  getByPage(page: number, size: number = 40): Observable<Result[]> {
    if (page > 5) return of([]);

    const offset = size * (page-1);
    return this._http.get<Data>(`${ this._apiUrl }/pokemon?limit=${ size }&offset=${ offset }`)
      .pipe(
        map( resp => resp.results )
      );
  }

  getById(id: string): Observable<Pokemon> {
    return this._http.get<Pokemon>(`${ this._apiUrl }/pokemon/${ id }`);
  }

  getDescription(id: number) {
    return this._http.get(`${ this._apiUrl }/pokemon-species/${ id }`)
      .pipe(
        map( (resp: any) =>
          resp.flavor_text_entries.find( (text: any) => text.language.name === 'es')),
        map( resp => resp.flavor_text ),
      );
  }

  orderBy(order: string) {
    if ( order === 'name') {
      this.pokemonList.sort( (a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else if (order === 'number') {
      this.pokemonList.sort( (a, b) => {
        const aId: string = a.url.substring(34, (a.url.length-1));
        const bId: string = b.url.substring(34, (b.url.length-1));

        return aId.localeCompare(bId, undefined, { numeric: true, sensitivity: 'base' });
      });
    }
  }

  changeOrder() {
    if (this.order === 'name') {
      this.order = 'number';
    } else {
      this.order = 'name';
    }

    this.orderBy(this.order);
  }
}
