import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';

import { switchMap, tap } from 'rxjs/operators';

import * as fs from 'tns-core-modules/file-system';

import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { Page } from 'tns-core-modules/ui/page';

import { NewsService } from '../../news.service';

// TODO: user iOS only..
import { android } from 'tns-core-modules/application';
import { WebViewExt } from '@nota/nativescript-webview-ext';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit, OnDestroy {
  title: string = 'お知らせ';
  postObj: any;
  assetsPath: string;
  fontsPath: string;
  wrappedPost: any;

  wv: WebViewExt;

  constructor(
    private router: RouterExtensions,
    private pageRoute: PageRoute,
    private page: Page,
    private newsService: NewsService,
  ) {
    page.actionBarHidden = true;
  }

  ngOnInit() {
    const cf = fs.knownFolders.currentApp();
    this.assetsPath = fs.path.join(cf.path, 'assets');
    this.fontsPath = fs.path.join(cf.path, 'fonts');

    this.pageRoute.activatedRoute
      .pipe(switchMap((aRoute) => aRoute.params))
      .forEach((params) => {
        //
        const desireId: number = <number>params.id;

        // this.postObj = this.newsService.items.find((el) => {
        //   return el.id == desireId;
        // });
        // this.postObj = this.newsService.fetchPost(desireId);

        // if (android) {
        //   console.log('Android device uses default WebView');
        //   this.wrappedPost = this.wrappedPostObj();
        // }

        this.newsService.fetchPost(desireId).subscribe((res: any) => {
          this.postObj = res;

          if (android) {
            console.log('Android device uses default WebView');
            this.wrappedPost = this.wrappedPostObj();
          }
        });
      });
  }

  ngOnDestroy() {

  }

  onLoaded(args: any) {
    this.wv = args.object;
    this.wv.registerLocalResource('fonts/NotoSansJP-Regular.otf', `${this.fontsPath}/NotoSansJP-Regular.otf`);
    this.wv.registerLocalResource('assets/logo.png', `${this.assetsPath}/logo.png`);
    this.wrappedPost = this.wrappedPostObj();
  }

  wrappedPostObj(): string {
    const { title, date, content } = this.postObj;
    let wrapped = '';

    // TODO:
    if (title && date && content) {
      wrapped = `<html>
<head>
<style>
@font-face {
font-family: "NotoSansJP Regular";:
src: local("NotoSansJP Regular"),
url("x-local://fonts/NotoSansJP-Regular.otf") format("opentype"),
url("${this.fontsPath}/NotoSansJP-Regular.otf") format("opentype");
font-weight: normal;
font-style: normal;
}
@font-face {
font-family: "Noto Sans JP Regular";
src: local("NotoSansJP-Regular"),
url("x-local://fonts/NotoSansJP-Regular.otf") format("opentype"),
url("${this.fontsPath}/NotoSansJP-Regular.otf") format("opentype");
font-weight: normal;
font-style: normal;
}
@font-face {
font-family: "NotoSansJP-Regular";
src: local("NotoSansJP-Regular"),
url("x-local://fonts/NotoSansJP-Regular.otf") format("opentype"),
url("${this.fontsPath}/NotoSansJP-Regular.otf") format("opentype");
font-weight: normal;
font-style: normal;
}
* { font-family:NotoSansJP Regular, NotoSansJP-Regular, Noto Sans JP Regular; }
html { background-color: #f6f6f6; width: 100vw; margin: 0; padding: 0; }
body { background-color: #f6f6f6; width: 100%; margin: 0; padding: 0; overflow-wrap: break-word; }
img { max-width: 100%; height: auto; }
header, main { padding: .5rem 1.5rem; background-color:#fff; }
header {
margin: 0 2rem;
}
main { margin: 0 2rem 2rem 2rem; }
</style>
</head>
<body>
<header>
<h1>${ title.rendered }</h1>
<h4>${ date }</h4>
</header>
<main>
${content.rendered}
</main>
</body>
</html>`;
    }

    return wrapped;
  }
}
