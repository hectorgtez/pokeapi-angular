import { Component, EventEmitter, Input, OnChanges, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Result } from '../../interfaces/pokeapi.interface';
import { Pokemon } from '../../interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-card.component.html',
  styleUrl: './pokemon-card.component.scss'
})
export class PokemonCardComponent implements OnChanges {
  @Input() data?: Result;
  @Input() fullData?: Pokemon;
  @Input() selected: boolean = false;
  @Output() clicked = new EventEmitter<string>();

  public id: string = '0';

  ngOnChanges(): void {
    this.extractInfo();
  }

  extractInfo() {
    if (this.data && this.data.url !== '') {
      this.id = this.data.url.substring(34, (this.data.url.length-1));
      return;
    } else if (this.fullData) {
      const species = this.fullData.species;

      this.id = species.url.substring(42, (species.url.length-1));
      this.data = {
        name: species.name,
        url: '',
      }
    }
  }
}
