import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'metros',
  standalone: true
})
export class MetrosPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
