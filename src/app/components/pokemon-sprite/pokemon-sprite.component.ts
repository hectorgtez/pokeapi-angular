import { Component, Input } from '@angular/core';
import { Pokemon } from '../../interfaces/pokemon.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-sprite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-sprite.component.html',
  styleUrl: './pokemon-sprite.component.scss'
})
export class PokemonSpriteComponent {
  @Input() pokemon?: Pokemon;
}
