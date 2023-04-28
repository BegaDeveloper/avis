import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], search: any) {
    if (!items) return [];

    if (!search) return items;

    search = search.toString().toLowerCase();

    return items.filter(it => {
      return (
        it.id ||
        it.operator.name.toLowerCase() ||
        it.trainCategory.name.toLowerCase() ||
        it.name.toLowerCase().includes(search)
      );
    });
  }
}
