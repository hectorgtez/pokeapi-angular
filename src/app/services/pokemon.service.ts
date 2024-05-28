import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment.development';
import { Data, Result } from '../interfaces/pokeapi.interface';
import { Pokemon } from '../interfaces/pokemon.interface';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private _http = inject(HttpClient);

  private _apiUrl: string = environment.apiUrl;
  private _totalPokemons: number = environment.totalPokemons;

  // Signals
  private pokemonFullList = signal<Result[]>([]);
  private pokemons = signal<Result[]>([]);
  private colors = signal<Result[]>([]);
  private eggGroups = signal<Result[]>([]);
  private orderBy = signal<'number' | 'name'>('number');
  private page = signal<number>(1);
  private filtered = signal<boolean>(false);
  private loading = signal<boolean>(false);

  // Computed
  public cPokemonFullList = computed( () => this.pokemonFullList() );
  public cPokemons = computed( () => this.pokemons() );
  public cColors = computed( () => this.colors() );
  public cEggGroups = computed( () => this.eggGroups() );
  public cOrderBy = computed( () => this.orderBy() );
  public cPage = computed( () => this.page() );
  public cFiltered = computed( () => this.filtered() );
  public cLoading = computed( () => this.loading() );

  constructor() {
    this.loadData();
  }

  loadData() {
    this.getByPage()
    this.getAllPokemons();
    this.loadFilterOptions();
  }

  getAllPokemons(): void {
    this._http.get<Data>(`${ this._apiUrl }/pokemon?offset=0&limit=${ this._totalPokemons }`)
      .pipe( map( resp => resp.results ) )
      .subscribe( resp => {
        this.pokemonFullList.set(resp);
      });
  }

  getById(id: string): Observable<Pokemon> {
    return this._http.get<Pokemon>(`${ this._apiUrl }/pokemon/${ id }`);
  }

  getByPage(size: number = 40) {
    if(this.cPage() > 5 || this.cFiltered()) {
      this.loading.set(false);
      return;
    }

    const offset = size * (this.cPage() - 1);
    this._http.get<Data>(`${ this._apiUrl }/pokemon?offset=${ offset }&limit=${ size }`)
      .pipe( map( resp => resp.results ) )
      .subscribe( resp => {
        this.pokemons.set([...this.cPokemons(), ...resp]);
        this.page.set(this.cPage() + 1);
        this.loading.set(false);
      });
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
      this.restartList();
    } else {
      this._http.get(`${ this._apiUrl }/pokemon-color/${ color }`)
          .pipe( map( (resp: any) => resp.pokemon_species ) )
          .subscribe( resp => {
            this.pokemons.set(resp);
            this.filtered.set(true);
          });
    }
  }

  getByEggGroup(eggGroup: string): void {
    if (!eggGroup) {
      this.restartList();
    } else {
      this._http.get(`${ this._apiUrl }/egg-group/${ eggGroup }`)
          .pipe( map( (resp: any) => resp.pokemon_species ) )
          .subscribe( resp => {
            this.pokemons.set(resp);
            this.filtered.set(true);
          });
    }
  }

  searchPokemon(term: string): void {
    if (!term) {
      this.restartList();
    } else {
      this.pokemons.set(this.cPokemonFullList()
          .filter( pokemon => pokemon.name.includes(term.toLowerCase()) ));
      this.filtered.set(true);
    }
  }

  toggleOrder(): void {
    if (this.orderBy() === 'name') {
      this.orderBy.set('number');
    } else {
      this.orderBy.set('name');
    }
  }

  setLoading(value: boolean): void {
    this.loading.set(value);
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

  restartList() {
    this.pokemons.set([]);
    this.filtered.set(false);
    this.page.set(1);

    if (!this.cLoading()) {
      setTimeout(() => {
        this.getByPage();
      }, 3);
    }
  }
}
