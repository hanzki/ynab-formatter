import { Injectable } from '@angular/core';
import { YnabTransaction } from './ynab-transaction';

@Injectable()
export class NordnetParserService {

  constructor() { }

  public parse(input): YnabTransaction[] {
    return [];
  }

}
