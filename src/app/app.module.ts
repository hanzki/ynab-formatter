import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { ParserService } from './parser.service';
import { YnabExporterService } from './ynab-exporter.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [ParserService, YnabExporterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
