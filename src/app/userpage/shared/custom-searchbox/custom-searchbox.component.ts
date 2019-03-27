import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { debounceTime } from 'rxjs/operators';

import { TextField } from 'tns-core-modules/ui/text-field';

@Component({
  selector: 'CustomSearchbox',
  templateUrl: './custom-searchbox.component.html',
  styleUrls: ['./custom-searchbox.component.scss']
})
export class CustomSearchboxComponent implements OnInit {

  @Input() debugBorder: boolean = false;

  @Input() followContent: string = null;
  @Input() followIsIcon: boolean = false;
  @Input() placeholder: string = 'トピックを検索';

  @Output() onClear = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<string>();
  @Output() onFocus = new EventEmitter<string>();
  @Output() onSearch = new EventEmitter<any>();

  keywords = new FormControl('');

  constructor(private formBuilder: FormBuilder) {
    this.keywords.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe((val) => {
      console.log(val);
      this.onSearch.emit({ search: val });
    });
  }

  ngOnInit() {
    //
  }

  onCancelAction() {
    this.onCancel.emit('cancel');
  }

  onClearAction() {
    // this.onClear.emit(this.keywords);
  }

  onFocusAction(e: any) {
  }

  onSearchAction(e: any) {
    this.onSearch.emit({ search: this.keywords.value });
  }

  onBlurAction(e: any) {
  }

  onTextChangeAction(e: any) {
  }

  get canClear(): boolean {
    return this.onClear.observers.length > 0;
  }
}
