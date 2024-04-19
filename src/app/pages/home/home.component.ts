import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';

import { Result } from '../../interfaces/pokeapi.interface';
import { Pokemon } from '../../interfaces/pokemon.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private _pokemonService = inject(PokemonService);

  public pokemonList: Result[] = [];
  public page: number = 1;
  public loading: boolean = false;
  public selectedPokemon?: Pokemon;
  public info: boolean = false;

  @ViewChild('cards') cardsElement!: ElementRef;

  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    this.loading = true;
    this._pokemonService.getByPage(this.page)
    .subscribe( resp => {
      this.pokemonList = [...this.pokemonList, ...resp];
      this.page++;
      this.loading = false;
    });
  }

  onScroll(event: any) {
    if (this.loading) return;

    const nativeElement = this.cardsElement.nativeElement;
    if (Math.round(nativeElement.clientHeight + nativeElement.scrollTop)
        === event.srcElement.scrollHeight) {
      this.loadList();
    }
  }

  cardClicked(id: string) {
    if (this.selectedPokemon && id === this.selectedPokemon?.id.toString()) {
      return this.changeInfoStatus();
    }

    this._pokemonService.getById(id)
      .subscribe( resp => {
        this.selectedPokemon = resp;
      });
  }

  changeInfoStatus() {
    if(this.selectedPokemon) {
      this.info = !this.info;
    }
  }
}
