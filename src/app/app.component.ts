import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import { saveAs } from 'file-saver';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/of';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  bankTransactions = new FormControl();
  ynabTransactions = [];

  ngOnInit(): void {
    this.bankTransactions
      .valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .map(input => this.formatBankTransactionsToYnab(input))
      .catch((err, caught) => {
        console.error(err);
        return Observable.of([]).concat(caught)
      })
      .subscribe(transactions => this.ynabTransactions = transactions);
  }

  formatBankTransactionsToYnab(input: string): any[] {
    const lines = input.split('\n');
    const transactions  = lines.map(line => {
      const fields = line.split('\t');

      const parsedAmount = this.parseNumber(fields[1]);
      const inflow = (parsedAmount > 0) ? parsedAmount : 0;
      const outflow = (parsedAmount < 0) ? -parsedAmount : 0;

      return {
        date: this.formatDate(fields[0]),
        payee: fields[4],
        outflow: outflow,
        inflow: inflow
      };
    });
    return transactions;
  }

  formatDate(input: string): string {
    const fields = input.split('.');
    const day = fields[0];
    const month = fields[1];
    const year = fields[2];

    const paddedDay = (day.length === 1) ? '0' + day : day;
    const paddedMonth = (month.length === 1) ? '0' + month : month;

    return paddedDay + '/' + paddedMonth + '/' + year;
  }

  parseNumber(input: string): number {
    const sansSpaces = input.replace(/ /g, '');
    const commaReplaced = sansSpaces.replace(',', '.');
    return Number(commaReplaced);
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
