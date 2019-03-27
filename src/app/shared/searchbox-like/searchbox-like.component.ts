import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'SearchboxLike',
  templateUrl: './searchbox-like.component.html',
  styleUrls: ['./searchbox-like.component.scss']
})
export class SearchboxLikeComponent implements OnInit {

  @Input() debugBorder: boolean = false;
  // @Input() freeze: boolean = false;

  @Input() followContent: string = null;
  @Input() followIsIcon: boolean = false;
  @Input() placeholder: string = 'トピックを検索';

  @Output() onClear = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<string>();
  @Output() onSearch = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {

  }

  onCancelAction() {
    this.onCancel.emit('cancel');
  }

  onClearAction() {
    this.onClear.emit('clear');
  }

  onSearchAction() {
    this.onSearch.emit('search');
  }

  get canClear(): boolean {
    return this.onClear.observers.length > 0;
  }
}
