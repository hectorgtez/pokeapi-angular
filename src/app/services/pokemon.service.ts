import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Data, Result } from '../interfaces/pokeapi.interface';
import { Pokemon } from '../interfaces/pokemon.interface';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private _http = inject(HttpClient);

  private _apiUrl: string = environment.apiUrl;
  private _totalPokemons: number = environment.totalPokemons;

  private pokemons = signal<Result[]>([]);
  private pokemonsBackup = signal<Result[]>([]);
  private orderBy = signal<'number' | 'name'>('number');

  public cPokemons = computed( () => this.pokemons() );
  public cPokemonsBackup = computed( () => this.pokemonsBackup() );
  public cOrderBy = computed( () => this.orderBy() );

  getAllPokemons() {
    this._http.get<Data>(`${ this._apiUrl }/pokemon?offset=0&limit=${ this._totalPokemons }`)
      .pipe( map( resp => resp.results ) )
      .subscribe( resp => {
        this.pokemons.set(resp);
        this.pokemonsBackup.set(resp);
      });
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

  changeOrder() {
    if (this.orderBy() === 'name') {
      this.orderBy.set('number');
    } else {
      this.orderBy.set('name');
    }
  }
}
