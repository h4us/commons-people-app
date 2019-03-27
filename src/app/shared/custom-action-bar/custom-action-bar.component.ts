import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'CustomActionBar',
  templateUrl: './custom-action-bar.component.html',
  styleUrls: ['./custom-action-bar.component.scss'],
  inputs: ['title', 'leftIcon', 'rightIcon']
})
export class CustomActionBarComponent implements OnInit {
  @Input() title: string;
  @Input() leftIcon: string;
  @Input() rightIcon: string;
  @Input() colorScheme: string;

  //
  @Input() routerLink: Array<any>;
  @Input() routerLinkOptions: any;
  //
  @Input() cancelAction: Array<any>;
  @Input() aproveAction: Array<any>;

  //
  @Output() onCancel = new EventEmitter<string>();
  @Output() onAprove = new EventEmitter<string>();

  //
  @Input() debugBorder: boolean = false;

  constructor(
    private router:RouterExtensions) {
  }

  ngOnInit() {
  }

  cancelOrBack() {
    // TODO:
    if (this.onCancel.observers.length > 0) {
      this.onCancel.emit('tap cancel');
    } else {
      if (this.cancelAction && this.cancelAction.length > 0) {
        if (this.cancelAction.length > 1) {
          this.cancelAction[0](this.cancelAction[1]);
        } else {
          this.cancelAction[0]();
        }
      } else {
        this.router.backToPreviousPage();
      }
    }
  }

  aproveOrNext() {
    // TODO:
    if (this.onAprove.observers.length > 0) {
      this.onAprove.emit('tap aprove');
    } else {
      if (this.aproveAction && this.aproveAction.length > 0) {
        if (this.aproveAction.length > 1) {
          this.aproveAction[0](this.aproveAction[1]);
        } else {
          this.aproveAction[0]();
        }
      } else if (this.routerLink) {
        this.router.navigate(this.routerLink, this.routerLinkOptions);
      }
    }
  }
}
