import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'type',
  standalone: true
})
export class TypePipe implements PipeTransform {

  transform(value: string): string {
    return `./../assets/img/types/${ value }.svg`
  }

}
