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

  private pokemonsBackup = signal<Result[]>([]);
  private pokemons = signal<Result[]>([]);
  private orderBy = signal<'number' | 'name'>('number');
  private colors = signal<Result[]>([]);
  private eggGroups = signal<Result[]>([]);

  public cPokemonsBackup = computed( () => this.pokemonsBackup() );
  public cPokemons = computed( () => this.pokemons() );
  public cOrderBy = computed( () => this.orderBy() );
  public cColors = computed( () => this.colors() );
  public cEggGroups = computed( () => this.eggGroups() );

  constructor() {
    this.loadData();
  }

  loadData() {
    this.getAllPokemons();
    this.loadFilterOptions();
  }

  getAllPokemons(): void {
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

  getDescription(id: number): Observable<string> {
    return this._http.get(`${ this._apiUrl }/pokemon-species/${ id }`)
      .pipe(
        map( (resp: any) =>
          resp.flavor_text_entries.find( (text: any) => text.language.name === 'es')),
        map( resp => resp.flavor_text ),
      );
  }

  getByColor(color: string): void {
    if (!color) {
      this.setFullPokemonList();
    } else {
      this._http.get(`${ this._apiUrl }/pokemon-color/${ color }`)
          .pipe( map( (resp: any) => resp.pokemon_species ) )
          .subscribe( resp => this.pokemons.set(resp) );
    }
  }

  getByEggGroup(eggGroup: string): void {
    if (!eggGroup) {
      this.setFullPokemonList();
    } else {
      this._http.get(`${ this._apiUrl }/egg-group/${ eggGroup }`)
          .pipe( map( (resp: any) => resp.pokemon_species ) )
          .subscribe( resp => this.pokemons.set(resp) );
    }
  }

  searchPokemon(term: string): void {
    if (!term) {
      this.pokemons.set(this.pokemonsBackup());
    } else {
      this.pokemons.set(this.cPokemonsBackup()
          .filter( pokemon => pokemon.name.includes(term.toLowerCase()) ));
    }
  }

  setFullPokemonList() {
    this.pokemons.set(this.cPokemonsBackup());
  }

  changeOrder(): void {
    if (this.orderBy() === 'name') {
      this.orderBy.set('number');
    } else {
      this.orderBy.set('name');
    }
  }

  loadFilterOptions() {
    this._http.get<Result[]>(`${ this._apiUrl }/pokemon-color`)
        .pipe( map((resp: any) => resp.results) )
        .subscribe( resp => {
          this.colors.set(resp);
        });

    this._http.get<Result[]>(`${ this._apiUrl }/egg-group`)
        .pipe( map((resp: any) => resp.results) )
        .subscribe( resp => {
          this.eggGroups.set(resp);
        });
  }
}
