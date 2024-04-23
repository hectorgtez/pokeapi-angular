import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { TypePipe } from '../../pipes/type.pipe';

@Component({
  selector: 'app-type',
  standalone: true,
  imports: [
    CommonModule,
    TypePipe,
  ],
  templateUrl: './type.component.html',
  styleUrl: './type.component.scss'
})
export class TypeComponent {
  @Input() type!: string;
}
