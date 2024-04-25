import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Pokemon } from '../../interfaces/pokemon.interface';

import { PokemonService } from '../../services/pokemon.service';
import { SearchService } from '../../services/search.service';
import { OrderByPipe } from '../../pipes/order-by.pipe';

import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';
import { PokemonSpriteComponent } from '../../components/pokemon-sprite/pokemon-sprite.component';
import { PokemonInfoComponent } from '../../components/pokemon-info/pokemon-info.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    PokemonCardComponent,
    PokemonSpriteComponent,
    PokemonInfoComponent,
    OrderByPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  public pokemonService = inject(PokemonService);
  public searchService = inject(SearchService);

  public loading: boolean = false;
  public selectedPokemon?: Pokemon;
  public info: boolean = false;

  @ViewChild('cards') cardsElement!: ElementRef;

  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    this.loading = true;
    this.pokemonService.getAllPokemons()
    .subscribe( (resp: any) => {
      this.pokemonService.pokemonList =
        [...this.pokemonService.pokemonList, ...resp];
      this.pokemonService.backupPokemonList = this.pokemonService.pokemonList;
      this.loading = false;
    });
  }

  cardClicked(id: string) {
    if (this.selectedPokemon && id === this.selectedPokemon?.id.toString()) {
      return this.changeInfoStatus();
    }

    this.pokemonService.getById(id)
      .subscribe( (resp: any) => {
        this.selectedPokemon = resp;
      });
  }

  changeInfoStatus() {
    if(this.selectedPokemon) {
      this.info = !this.info;
    }
  }
}
