import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions } from 'nativescript-angular/router';

import { Page } from 'tns-core-modules/ui/page';


@Component({
  selector: 'app-more-demo-page',
  templateUrl: './more-demo-page.component.html',
  styleUrls: ['./more-demo-page.component.scss']
})
export class MoreDemoPageComponent implements OnInit {
  title: string = 'more demo';

  constructor(
    private router: RouterExtensions,
    private page: Page,
    private aRoute: ActivatedRoute,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
  }

  onBackTap() {
    // this.router.navigate([{
    //   outlets: {
    //     extOutlet: ['moredemo']
    //   }
    // }], { relativeTo: this.aRoute });
  }
}
