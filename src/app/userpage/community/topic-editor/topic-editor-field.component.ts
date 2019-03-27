import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms'

// import { Observable, Subject, forkJoin, from, of, zip } from 'rxjs';
// import { distinct, switchMap, map, mergeAll, filter } from 'rxjs/operators';

import { switchMap } from 'rxjs/operators';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { UserService } from '../../../user.service';
import { TopicValidatorService } from '../../topic-validator.service';

@Component({
  selector: 'app-topic-editor-field',
  templateUrl: './topic-editor-field.component.html',
  styleUrls: ['./topic-editor.component.scss']
})
export class TopicEditorFieldComponent implements OnInit {
  title: string = '';
  field: string = '';
  tForm: FormGroup;

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
        this.title = fld;
        this.field = fld;
        //
      });
  }

  onValidate() {
    // console.log(this.tForm.value);
  }
}
