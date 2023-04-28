import { Component, EventEmitter, Output } from '@angular/core';

export interface SearchBox {
  searchText: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  private _searchText = '';
  @Output() readonly searchBox: EventEmitter<SearchBox> = new EventEmitter<SearchBox>();

  get searchText(): string {
    return this._searchText;
  }

  set searchText(value: string) {
    this._searchText = value;
  }

  send(event: Event) {
    this._searchText = (event.target as HTMLInputElement).value;
    this.searchBox.emit({ searchText: this._searchText });
  }

  clear(element: HTMLInputElement) {
    element.value = this._searchText = '';
    this.searchBox.emit({ searchText: this._searchText });
  }
}
