import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';

import { Data, Result } from '../interfaces/pokeapi.interface';
import { Pokemon } from '../interfaces/pokemon.interface';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private _http = inject(HttpClient);
  private _api_url = 'https://pokeapi.co/api/v2';

  getByPage(page: number, size: number = 40): Observable<Result[]> {
    if (page > 5) return of([]);

    const offset = size * (page-1);
    return this._http.get<Data>(`${ this._api_url }/pokemon?limit=${ size }&offset=${ offset }`)
      .pipe(
        map( resp => resp.results )
      );
  }

  getById(id: string): Observable<Pokemon> {
    return this._http.get<Pokemon>(`${ this._api_url }/pokemon/${ id }`);
  }

  getDescription(id: number) {
    return this._http.get(`${ this._api_url }/pokemon-species/${ id }`)
      .pipe(
        map( (resp: any) =>
          resp.flavor_text_entries.find( (text: any) => text.language.name === 'es')),
        map( resp => resp.flavor_text ),
      );
  }
}
