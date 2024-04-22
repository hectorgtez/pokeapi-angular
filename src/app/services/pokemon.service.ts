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
}
