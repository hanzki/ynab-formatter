import { TestBed, inject } from '@angular/core/testing';

import { YnabExporterService } from './ynab-exporter.service';
import { DateTime } from 'luxon';

describe('YnabExporterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YnabExporterService]
    });
  });

  it('should be created', inject([YnabExporterService], (service: YnabExporterService) => {
    expect(service).toBeTruthy();
  }));

  describe('#exportToCsv', () => {

    it('should result in empty result with empty input', inject([YnabExporterService], (service: YnabExporterService) => {
      const input = [];
      const expectedOutput = 'Date,Payee,Category,Memo,Outflow,Inflow';
      expect(service.exportToCsv(input)).toEqual(expectedOutput)
    }));

    it('should export single transaction in correct format', inject([YnabExporterService], (service: YnabExporterService) => {
      const input = [{
        date: DateTime.utc(2019, 11, 12),
        payee: 'Pet Shop',
        inflow: 0,
        outflow: 3.50
      }];
      const expectedOutput = 'Date,Payee,Category,Memo,Outflow,Inflow\n' +
        '12/11/2019,Pet Shop,,,3.50,';
      expect(service.exportToCsv(input)).toEqual(expectedOutput)
    }));

    it('should export multiple transactions in correct format', inject([YnabExporterService], (service: YnabExporterService) => {
      const input = [{
        date: DateTime.utc(2019, 11, 12),
        payee: 'Pet Shop',
        inflow: 0,
        outflow: 3.50
      },
      {
        date: DateTime.utc(2019, 11, 12),
        payee: 'Timmy\'s comma, ampersand & percentile: 50% off everything',
        inflow: 123.45,
        outflow: 0
      }];
      const expectedOutput = 'Date,Payee,Category,Memo,Outflow,Inflow\n' +
        '12/11/2019,Pet Shop,,,3.50,\n' +
        '12/11/2019,Timmy\'s comma ampersand & percentile: 50% off everything,,,,123.45';
      expect(service.exportToCsv(input)).toEqual(expectedOutput)
    }));

    it('should export also description if present', inject([YnabExporterService], (service: YnabExporterService) => {
      const input = [{
        date: DateTime.utc(2019, 11, 12),
        payee: 'Pet Shop',
        inflow: 0,
        outflow: 3.50,
        description: 'a fluffy meow'
      }];
      const expectedOutput = 'Date,Payee,Category,Memo,Outflow,Inflow\n' +
        '12/11/2019,Pet Shop,,a fluffy meow,3.50,';
      expect(service.exportToCsv(input)).toEqual(expectedOutput)
    }));
  });
});
