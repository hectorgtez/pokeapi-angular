import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';

import { Result } from '../../interfaces/pokeapi.interface';

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
}
