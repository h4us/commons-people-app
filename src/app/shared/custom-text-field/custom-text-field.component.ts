import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TextField } from 'tns-core-modules/ui/text-field';

@Component({
  selector: 'CustomTextField',
  templateUrl: './custom-text-field.component.html',
  styleUrls: ['./custom-text-field.component.scss']
})
export class CustomTextFieldComponent implements OnInit {

  @Input() debugBorder: boolean = false;
  @Input() freeze: boolean = false;
  @Input() placeholder: string;

  @Output() onIconTap = new EventEmitter<string>();
  @Output() onDone = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onIconTapAction() {
    this.onIconTap.emit('custom icon tap');
  }

  onDoneAction(e: any) {
    const tf: TextField = <TextField>e.object;
    this.onDone.emit(tf.text);
  }

  onFocus() {
    this.focusProxy('proxied by TextField!');
  }

  onBlur() {
    // this.focusProxy('proxied by TextField!');
  }

  focusProxy(fromOther?: string) {
    console.log('focus proxy', fromOther);
  }
}
