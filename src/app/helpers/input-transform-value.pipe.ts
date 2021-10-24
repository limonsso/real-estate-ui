import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputTransformValue'
})
export class InputTransformValuePipe implements PipeTransform {

  transform(value: string, symbole:string): string {
    return `${value} ${symbole}`;
  }

}
