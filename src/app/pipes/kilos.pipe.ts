import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kilos',
  standalone: true
})
export class KilosPipe implements PipeTransform {
  transform(value: unknown): number {
    return value as number / 2.205;
  }
}
