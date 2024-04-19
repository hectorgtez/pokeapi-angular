import { Component, Input } from '@angular/core';
import { Pokemon } from '../../interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-sprite',
  templateUrl: './pokemon-sprite.component.html',
  styleUrl: './pokemon-sprite.component.scss'
})
export class PokemonSpriteComponent {
  @Input() pokemon?: Pokemon;
}
