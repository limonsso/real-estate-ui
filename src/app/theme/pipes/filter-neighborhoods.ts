import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterNeighborhoods',
    standalone: false
})
export class FilterNeighborhoodsPipe implements PipeTransform {
  transform(items:Array<any>, id?) {
    if(id){
      return items.filter(item => item.cityId == id);
    } 
    return items;  
  }
}