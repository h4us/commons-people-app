import {
  Component, OnInit, AfterViewInit,
  ViewChild, ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms'

// import { Observable, Subject, forkJoin, from, of, zip } from 'rxjs';
// import { distinct, switchMap, map, mergeAll, filter } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { isIOS } from 'tns-core-modules/platform';
import { Page } from 'tns-core-modules/ui/page';

import { UserService } from '../../../user.service';
import { TopicValidatorService } from '../../topic-validator.service';

@Component({
  selector: 'app-topic-editor-field',
  templateUrl: './topic-editor-field.component.html',
  styleUrls: ['./topic-editor.component.scss']
})
export class TopicEditorFieldComponent implements OnInit, AfterViewInit {
  title: string = '';
  field: string = '';
  tForm: FormGroup;

  @ViewChild('forceNumKey') nkbd: ElementRef;

  constructor(
    private page: Page,
    private routerExt: RouterExtensions,
    private aRoute: ActivatedRoute,
    private pageRoute: PageRoute,
    private userService: UserService,
    private tvService: TopicValidatorService,
  ) {
    page.actionBarHidden = true;

    this.tForm = tvService.sendForm;
  }

  ngOnInit() {
    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        //
        const fld: string = <string>params.field;
        this.title = this.tvService.labelsForInput[fld].title;
        this.field = fld;
        //
      });
  }

  ngAfterViewInit() {
    if (isIOS && this.nkbd) {
      this.nkbd.nativeElement.keyboardType = 11;
    }
  }

  onValidate() {
  }
}
