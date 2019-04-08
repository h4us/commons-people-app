import {
  Component, OnInit, OnDestroy,
  Input, Output, EventEmitter,
  ViewChild, ElementRef
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { fromEvent } from 'rxjs';
import { take, delay, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'CustomSearchbox',
  templateUrl: './custom-searchbox.component.html',
  styleUrls: ['./custom-searchbox.component.scss']
})
export class CustomSearchboxComponent implements OnInit, OnDestroy {

  @Input() debugBorder: boolean = false;

  @Input() followContent: string = null;
  @Input() followIsIcon: boolean = false;
  @Input() focusAtInit: boolean = false;
  @Input() placeholder: string = 'トピックを検索';

  @Output() onClear = new EventEmitter<string>();
  @Output() onTapFollowContent = new EventEmitter<string>();
  @Output() onFocus = new EventEmitter<string>();
  @Output() onSearch = new EventEmitter<any>();

  @ViewChild('searchInput') sInput: ElementRef;

  keywords = new FormControl('');

  constructor() {
    // TODO:
    this.keywords.valueChanges.pipe(
      debounceTime(3000)
    ).subscribe((val) => {
      // console.log(val);
      this.onSearch.emit({ search: val });
    });
  }

  ngOnInit() {
    //
    if (this.focusAtInit) {
      this.sInput.nativeElement.focus();
    }

    // fromEvent(this.sInput.nativeElement, 'loaded').pipe(
    //   take(1), delay(1)
    // ).subscribe(_ => {
    //   this.sInput.nativeElement.focus();
    // });
  }

  ngOnDestroy() {
    //
  }

  onTapFollowAction() {
    this.onTapFollowContent.emit('tap');
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
