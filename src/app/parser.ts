import {Injectable} from '@angular/core';

@Injectable()
export class ParserService {

  parse(source, input) { switch (source) {
      case 'bank':
        return this.formatBankTransactionsToYnab(input);
      case 'ticketduo':
        return this.formatTicketDuoTransactionsToYnab(input);
    }
  }

  formatBankTransactionsToYnab(input: string): any[] {
    const lines = input.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim() !== '');
    const transactions  = nonEmptyLines.map(line => {
      const fields = line.split('\t');

      const parsedAmount = this.parseNumber(fields[1]);
      const inflow = (parsedAmount > 0) ? parsedAmount : 0;
      const outflow = (parsedAmount < 0) ? -parsedAmount : 0;

      return {
        date: this.formatBankDate(fields[0]),
        payee: fields[4],
        outflow: outflow,
        inflow: inflow
      };
    });
    return transactions;
  }

  private formatBankDate(input: string): string {
    const fields = input.split('.');
    const day = fields[0].trim();
    const month = fields[1].trim();
    const year = fields[2].trim();

    const paddedDay = (day.length === 1) ? '0' + day : day;
    const paddedMonth = (month.length === 1) ? '0' + month : month;

    return paddedDay + '/' + paddedMonth + '/' + year;
  }

  private parseNumber(input: string): number {
    const sansSpaces = input.replace(/ /g, '');
    const commaReplaced = sansSpaces.replace(',', '.');
    return Number(commaReplaced);
  }


  formatTicketDuoTransactionsToYnab(input: string): any[] {
    const lines = input.split('\t\n');
    const nonEmptyLines = lines.filter(line => line.trim() !== '');
    const nonFailedTransactions = nonEmptyLines.filter(line => line.split('\t')[2] !== 'Hylätty');
    const transactions  = nonFailedTransactions.map(line => {
      const fields = line.split('\t');

      const parsedAmount = this.parseNumber(fields[3]);
      const inflow = (parsedAmount > 0) ? parsedAmount : 0;
      const outflow = (parsedAmount < 0) ? -parsedAmount : 0;

      return {
        date: this.formatTicketDuoDate(fields[0]),
        payee: this.formatTicketDuoPayee(fields[1]),
        outflow: outflow,
        inflow: inflow
      };
    });
    return transactions;
  }

  private formatTicketDuoDate(input: string): string {
    const date = input.match(/\d\d\.\d\d\.\d\d/)[0];
    const fields = date.split('.');
    const day = fields[0].trim();
    const month = fields[1].trim();
    const year = fields[2].trim();

    const paddedDay = (day.length === 1) ? '0' + day : day;
    const paddedMonth = (month.length === 1) ? '0' + month : month;
    const fullYear = (year.length === 2) ? '20' + year : year;

    return paddedDay + '/' + paddedMonth + '/' + fullYear;
  }

  private formatTicketDuoPayee(input: string): string {
    return input.split('\n')[0];
  }

}
