import { Component, Input, OnChanges, inject } from '@angular/core';

import { Result } from '../../interfaces/pokeapi.interface';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.scss'
})
export class PokemonCardComponent implements OnChanges {
  private _pokemonService = inject(PokemonService);

  @Input() data!: Result;
  id: string = '0';

  ngOnChanges(): void {
    this.extractInfo();
  }

  extractInfo() {
    if (this.data) {
      this.id = this.data.url.substring(34, (this.data.url.length-1));
    }
  }
}
