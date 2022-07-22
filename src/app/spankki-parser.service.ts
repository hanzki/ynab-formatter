import { Injectable } from '@angular/core';
import { YnabTransaction } from './ynab-transaction';

@Injectable()
export class SPankkiParserService {

  constructor() { }

  public parse(input): YnabTransaction[] {
    return [];
  }

}
