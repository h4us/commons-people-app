import {
  Component, OnInit, OnDestroy, AfterViewInit,
  Input, Output, EventEmitter,
  ViewChild, ElementRef
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

import { Subscription, fromEvent, interval, timer } from 'rxjs';
import { takeUntil, delay, debounceTime } from 'rxjs/operators';

import { isIOS } from 'tns-core-modules/platform';

@Component({
  selector: 'CustomSearchbox',
  templateUrl: './custom-searchbox.component.html',
  styleUrls: ['./custom-searchbox.component.scss']
})
export class CustomSearchboxComponent implements OnInit, OnDestroy, AfterViewInit {

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

  // private rSubscription: Subscription;
  private kSubscription: Subscription;

  constructor() {
    // TODO:
    this.kSubscription = this.keywords.valueChanges.pipe(
      debounceTime(3000)
    ).subscribe((val) => {
      this.onSearch.emit({ search: val });
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.focusAtInit) {
      timer(isIOS ? 200 : 100, 100).pipe(
        takeUntil(fromEvent(this.sInput.nativeElement, 'focus'))
      ).subscribe(_ => this.sInput.nativeElement.focus())
    }
  }

  ngOnDestroy() {
    this.kSubscription.unsubscribe();
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
