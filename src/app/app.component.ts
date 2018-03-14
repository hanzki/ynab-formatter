import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import { saveAs } from 'file-saver';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/of';
import {Observable} from 'rxjs/Observable';
import {ParserService} from './parser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  bankTransactions = new FormControl();
  transactionType = new FormControl('bank');
  ynabTransactions = [];

  constructor(private parser: ParserService) {}

  ngOnInit(): void {
    const transactionInput$ = this.bankTransactions.valueChanges.startWith('');
    const transactionSourceInput$ = this.transactionType.valueChanges.startWith(this.transactionType.value);

    transactionInput$
      .combineLatest(transactionSourceInput$)
      .debounceTime(300)
      .distinctUntilChanged()
      .map(([input, source]) => this.parser.parse(source, input))
      .catch((err, caught) => {
        console.error(err);
        return Observable.of([]).concat(caught)
      })
      .subscribe(transactions => this.ynabTransactions = transactions);
  }

  download(): void {
    const blob = new Blob([this.transactionsToCSV(this.ynabTransactions)], {type: 'text/csv;charset=utf-8'});
    saveAs(blob, 'transactions.csv');
  }

  transactionsToCSV(transactions: any[]): string {
    const csvRows = transactions.map(transaction => {
      const outflowStr = (transaction.outflow) ? transaction.outflow.toFixed(2) : '';
      const inflowStr = (transaction.inflow) ? transaction.inflow.toFixed(2) : '';
      return transaction.date + ','
        + transaction.payee.replace(/,/g, '') + ','
        + ','
        + ','
        + outflowStr + ','
        + inflowStr
    });
    let csv = 'Date,Payee,Category,Memo,Outflow,Inflow\n';
    csvRows.forEach(row => {
      csv += row + '\n'
    });
    return csv;
  }
}
