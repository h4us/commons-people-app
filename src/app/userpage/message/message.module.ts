import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageRoutingModule } from './message-routing.module';
import { MessageRootComponent } from './message-root/message-root.component';
import { ThreadEditorComponent } from './thread-editor/thread-editor.component';
import { MessageEditorComponent } from './message-editor/message-editor.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { MessageSearchComponent } from './message-search/message-search.component';

@NgModule({
  declarations: [MessageRootComponent, ThreadEditorComponent, MessageEditorComponent, MessageDetailComponent, MessageSearchComponent],
  imports: [
    CommonModule,
    MessageRoutingModule
  ]
})
export class MessageModule { }
