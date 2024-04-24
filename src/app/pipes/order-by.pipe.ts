import { Pipe, PipeTransform } from '@angular/core';
import { Result } from '../interfaces/pokeapi.interface';

@Pipe({
  name: 'orderBy',
  standalone: true
})
export class OrderByPipe implements PipeTransform {
  transform(value: Result[], order: string) {
    if ( order === 'name') {
      value.sort( (a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else if (order === 'number') {
      value.sort( (a, b) => {
        const aId: string = a.url.substring(34, (a.url.length-1));
        const bId: string = b.url.substring(34, (b.url.length-1));

        return aId.localeCompare(bId, undefined, { numeric: true, sensitivity: 'base' });
      });
    }

    return value;
  }
}
