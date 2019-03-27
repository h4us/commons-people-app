import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TextField } from 'tns-core-modules/ui/text-field';

@Component({
  selector: 'CustomSearchBox',
  templateUrl: './custom-search-box.component.html',
  styleUrls: ['./custom-search-box.component.scss']
})
export class CustomSearchBoxComponent implements OnInit {

  @Input() debugBorder: boolean = false;
  @Input() freeze: boolean = false;

  @Output() onClear = new EventEmitter<string>();
  @Output() onSearch = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onClearAction() {
    this.onClear.emit('search bar clear');
  }

  onDoneAction(e: any) {
    console.log('do search');
    const tf: TextField = <TextField>e.object;
    this.onSearch.emit(tf.text);
  }

  onFocus() {
    this.focusProxy('proxied by TextField!');
  }

  focusProxy(fromOther?: string) {
    console.log('focus proxy', fromOther);
  }
}
