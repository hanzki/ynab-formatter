import { Injectable } from '@angular/core';
import { YnabTransaction } from './ynab-transaction';

@Injectable()
export class YnabExporterService {

  Header = 'Date,Payee,Category,Memo,Outflow,Inflow';

  constructor() { }


  public exportToCsv(input: YnabTransaction[]): string {

    const csvLines = input.map(this.csvLine).join('\n');

    let csv = this.Header;

    if (csvLines) {
      csv = csv + '\n' + csvLines
    }

    return csv;
  }

  csvLine(transaction: YnabTransaction): string {
    const dateStr = transaction.date.toFormat('dd/MM/yyyy');
    const payeeStr = transaction.payee.replace(/,/g, '');
    const categoryStr = '';
    const descStr = transaction.description && transaction.description.replace(/,/g, '');
    const outflowStr = (transaction.outflow > 0) ? transaction.outflow.toFixed(2) : '';
    const inflowStr = (transaction.inflow > 0) ? transaction.inflow.toFixed(2) : '';
    return [dateStr, payeeStr, categoryStr, descStr, outflowStr, inflowStr].join(',');
  }

}
