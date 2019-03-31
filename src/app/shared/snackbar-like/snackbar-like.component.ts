import {
  Component, OnInit, OnDestroy, AfterViewInit,
  Input, Output, EventEmitter,
  ViewChild, ElementRef
} from '@angular/core';

import { RouterExtensions } from 'nativescript-angular/router';
import { AnimationCurve } from 'tns-core-modules/ui/enums';
import { AbsoluteLayout } from 'tns-core-modules/ui/layouts/absolute-layout';
// import { FlexboxLayout } from 'tns-core-modules/ui/layouts/flexbox-layout';
// import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { screen } from 'tns-core-modules/platform';
import { layout } from 'tns-core-modules/utils/utils';

import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { TrayService } from '../tray.service';

@Component({
  selector: 'CustomSnackbarLike',
  templateUrl: './snackbar-like.component.html',
  styleUrls: ['./snackbar-like.component.scss']
})
export class SnackbarLikeComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() approveMessage: string = 'この内容でよろしいですか？';
  @Input() doneMessage: string = '送信しました';
  // @Input() colorScheme: string;

  @Output() onCancel = new EventEmitter<string>();
  @Output() onApprove = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<string>();

  @Input() debugBorder: boolean = false;
  @Input() isShown: boolean = false;
  @Input() containerId: string = '';

  isApproved: boolean = false;
  step: number = 0;
  cancelAsClose: boolean = true;
  autoNextStep: boolean = true;
  positionRef: number = 0;
  basePosition: number = 0;
  baseOffset: number = 120;

  @ViewChild('componentRoot') cRootRef: ElementRef;

  tRequestSubscription: Subscription;
  tPositionSubscription: Subscription;

  constructor(
    private router:RouterExtensions,
    private trayService: TrayService,
  ) {

    this.tPositionSubscription = trayService.trayPosition$.subscribe((data: any) => {
      if (typeof data == 'number') {
        this.positionRef = data;
      } else {
        const p = data.position || this.basePosition;
        const s = data.safeArea || 0;
        this.positionRef = p - s;
      }
      this.resetPosition();
    });

    this.tRequestSubscription = trayService.requestFromUser$.pipe(debounceTime(150)).subscribe((data: any) => {
      if (data[0] == `snackbar/${this.containerId}`) {
        console.log(data);

        const cmdOption: any = data.length > 2 ? data[2] : {};

        console.log(cmdOption);

        if (data[1] == 'close') {
          console.log(`close external! @${this.containerId}`);
          this.disposeBar();
        }

        if (data[1] == 'open') {
          console.log(`open external! @${this.containerId}`, this.positionRef);
          this.cRootRef.nativeElement.translateY = 200;
          this.cRootRef.nativeElement.opacity = 0;
          this.isShown = true;
          // this.isApproved = false;
          // TODO:
          this.isApproved = typeof cmdOption.isApproved != 'undefined' ? cmdOption.isApproved : false;
          this.step = cmdOption.step ? cmdOption.step : 0;
          this.cancelAsClose = typeof cmdOption.isApproved != 'undefined' ? cmdOption.cancelAsClose : true;
          this.autoNextStep = typeof cmdOption.autoNextStep != 'undefined' ? cmdOption.autoNextStep : true;
          this.approveMessage = cmdOption.approveMessage || this.approveMessage;
          this.doneMessage = cmdOption.doneMessage || this.doneMessage;
          //

          this.trayService.notify(`snackbar/${this.containerId}`, 'willRise');

          setTimeout(() => {
            AbsoluteLayout.setTop(this.cRootRef.nativeElement, this.positionRef - this.baseOffset);
            this.cRootRef.nativeElement.animate({
              translate: { x:0, y:0 },
              opacity: 1,
              duration: 300,
              curve: AnimationCurve.easeOut
            }).then(() => {
              this.cRootRef.nativeElement.translateY = 0;
              this.trayService.notify(`snackbar/${this.containerId}`, 'riseAnimationDone');
            }, () => {});
          }, 100);
        }

        if (data[1] == 'next') {
          this.isApproved = !this.isApproved;
          this.step = (this.step + 1) % 2;
        }

        if (data[1] == 'prev') {
        }

      }
    });
  }

  ngOnInit() {
    // TODO:
    this.cRootRef.nativeElement.opacity = 0;
  }

  ngAfterViewInit() {
    // TODO:
    if (this.trayService.lastMeasuredPosition) {
      setTimeout(() => {
        this.positionRef = this.trayService.lastMeasuredPosition;
        // this.baseOffset = Math.min(this.cRootRef.nativeElement.getMeasuredHeight() / screen.mainScreen.scale, 120);
        AbsoluteLayout.setTop(this.cRootRef.nativeElement, this.positionRef - this.baseOffset);
        console.log('last stored poistion?', this.trayService.lastMeasuredPosition, this.baseOffset);
      }, 100)
    }
  }

  ngOnDestroy() {
    console.log(`destroied snackbar container @${this.containerId}`);
    this.tRequestSubscription.unsubscribe();
    this.tPositionSubscription.unsubscribe();
  }

  resetPosition(pos?: Number) {
    AbsoluteLayout.setTop(this.cRootRef.nativeElement, this.positionRef - this.baseOffset);
  }

  cancelOrBack() {
    console.log(`snackbar action, cancel @${this.containerId}`);

    this.trayService.notify(`snackbar/${this.containerId}`, 'cancelOrBack');

    if (this.cancelAsClose) {
      this.disposeBar();
    }

    if (this.onCancel.observers.length > 0) {
      this.onCancel.emit(`tap cancel`);
    }
  }

  approveOrNext() {
    console.log(`snackbar action, aprove @${this.containerId}`);

    if (this.autoNextStep) {
      this.isApproved = true;
      this.step ++;
    }

    this.trayService.notify(`snackbar/${this.containerId}`, 'approveOrNext', { step: this.step });

    if (this.onApprove.observers.length > 0) {
      this.onApprove.emit(`tap approve`);
    }
  }

  disposeBar() {
    if (this.isShown) {
      setTimeout(() => {
        this.cRootRef.nativeElement.animate({
          translate: { x:0, y:200 },
          opacity: 0,
          duration: 300,
          curve: AnimationCurve.easeIn
        }).then(() => {
          this.isShown = false;
          this.cRootRef.nativeElement.opacity = 0;
          this.cRootRef.nativeElement.translateX = 0;
          this.cRootRef.nativeElement.translateY = 0;

          this.trayService.notify(`snackbar/${this.containerId}`, 'disposeAnimationDone');
        }, () => {});
        console.log(`snackbar action, afterClose @${this.containerId}`);
      }, 100);
    }

    this.trayService.notify(`snackbar/${this.containerId}`, 'disposeBar');

    if (this.onClose.observers.length > 0) {
      this.onClose.emit(`tap afterClose`);
    }
  }

  blockTap() {
    //
    console.log(`blocked by snackbar! @${this.containerId}`);
  }
}
