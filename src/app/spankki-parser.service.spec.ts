import { TestBed, inject } from '@angular/core/testing';
import { DateTime } from 'luxon';

import { SPankkiParserService } from './spankki-parser.service';
import { YnabTransaction } from './ynab-transaction';

describe('SPankkiParserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SPankkiParserService]
    });
  });

  it('should be created', inject([SPankkiParserService], (service: SPankkiParserService) => {
    expect(service).toBeTruthy();
  }));

  describe('#parse', () => {
    it('should parse input correctly', inject([SPankkiParserService], async (service: SPankkiParserService) => {

      const input = await fetch('/base/src/app/test-resources/bank_chrome_1.txt');
      const expectedOutput: YnabTransaction[] = [
        { date: DateTime.local(2018, 1, 1), payee: 'S market Vaasanhalli', outflow: 3.88, inflow: 0 },
        { date: DateTime.local(2018, 1, 1), payee: 'S market Ympyrätalo', outflow: 11.02, inflow: 0 },
        { date: DateTime.local(2018, 1, 1), payee: 'Alepa Otaniemi', outflow: 0, inflow: 9.31 },
        { date: DateTime.local(2018, 1, 1), payee: 'Prisma Sello', outflow: 35.59, inflow: 0 }
      ]
      const output = service.parse(input);

      expect(output).toEqual(expectedOutput);
    }));
  });
});
