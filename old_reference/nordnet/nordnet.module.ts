import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NordnetParserService } from '../nordnet-parser.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [NordnetParserService]
})
export class NordnetModule { }
