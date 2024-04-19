import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';

import { Pokemon } from '../../interfaces/pokemon.interface';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-info',
  templateUrl: './pokemon-info.component.html',
  styleUrl: './pokemon-info.component.scss'
})
export class PokemonInfoComponent implements OnChanges {
  @Input() pokemon?: Pokemon;
  @Input() opened: boolean = false;
  @Output() clicked = new EventEmitter();

  private _pokemonService = inject(PokemonService);

  public description: string = '';

  ngOnChanges(): void {
    if (this.pokemon)  {
      this._pokemonService.getDescription(this.pokemon?.id)
      .subscribe( resp => {
        this.description = resp;
      });
    }
  }
}
