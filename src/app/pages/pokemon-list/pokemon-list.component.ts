import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';

import { Pokemon } from '../../interfaces/pokemon.interface';
import { OrderByPipe } from '../../pipes/order-by.pipe';
import { PokemonService } from '../../services/pokemon.service';

import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';
import { PokemonInfoComponent } from '../../components/pokemon-info/pokemon-info.component';
import { PokemonSpriteComponent } from '../../components/pokemon-sprite/pokemon-sprite.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    PokemonCardComponent,
    PokemonInfoComponent,
    PokemonSpriteComponent,
    OrderByPipe,
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss'
})
export class PokemonListComponent {
  @ViewChild('cards') cardsElement!: ElementRef;
  @ViewChild('colorFilter') colorFilter!: ElementRef;
  @ViewChild('eggGroupFilter') eggGroupFilter!: ElementRef;

  public pokemonService = inject(PokemonService);

  public selectedPokemon?: Pokemon;
  public info: boolean = false;

  changeInfoStatus() {
    if(this.selectedPokemon) {
      this.info = !this.info;
    }
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

  onChangeFilter(type: string, term: string) {
    if (!type || !term) {
      this.pokemonService.restartList();
    } else {

      switch (type) {
        case 'color':
          this.pokemonService.getByColor(term);
          this.eggGroupFilter.nativeElement.value = '';
          break;
        case 'eggGroup':
          this.pokemonService.getByEggGroup(term);
          this.colorFilter.nativeElement.value = '';
          break;
      }
    }
  }

  onScroll(event: any) {
    if (this.pokemonService.cLoading()) return;

    const cardsHeight = this.cardsElement.nativeElement.clientHeight;
    const scrolled = this.cardsElement.nativeElement.scrollTop;

    if (Math.round(cardsHeight + scrolled) === event.srcElement.scrollHeight) {
      this.pokemonService.setLoading(true);
      this.pokemonService.getByPage();
    }
  }
}
