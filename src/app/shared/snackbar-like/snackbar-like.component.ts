import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'CustomSnackbarLike',
  templateUrl: './snackbar-like.component.html',
  styleUrls: ['./snackbar-like.component.scss']
})
export class SnackbarLikeComponent implements OnInit {
  @Input() approveMessage: string = 'この内容でよろしいですか？';
  @Input() doneMessage: string = '送信しました';
  @Input() colorScheme: string;

  @Output() onCancel = new EventEmitter<string>();
  @Output() onApprove = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<string>();

  @Input() debugBorder: boolean = false;
  // @Input() isShown: boolean = true;
  isShown: boolean = true;
  // @Input() isApproved: boolean = false;
  isApproved: boolean = false;

  constructor(
    private router:RouterExtensions) {
  }

  ngOnInit() {
  }

  cancelOrBack() {
    console.log('snackbar action, cancel');

    if (this.onCancel.observers.length > 0) {
      this.onCancel.emit('tap cancel');
    }
  }

  approveOrNext() {
    this.isApproved = !this.isApproved;
    console.log('snackbar action, aprove');

    if (this.onApprove.observers.length > 0) {
      this.onApprove.emit('tap approve');
    }
  }

  afterClose() {
    console.log('snackbar action, afterClose');

    if (this.onClose.observers.length > 0) {
      this.onClose.emit('tap afterClose');
    }
  }
}
