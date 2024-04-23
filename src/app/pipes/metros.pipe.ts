import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metros',
  standalone: true
})
export class MetrosPipe implements PipeTransform {
  transform(value: unknown): number {
    return value as number / 10;
  }
}
