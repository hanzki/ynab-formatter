import { TestBed, inject } from '@angular/core/testing';

import { ParserService } from './parser.service';

describe('ParserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParserService]
    });
  });

  it('should be created', inject([ParserService], (service: ParserService) => {
    expect(service).toBeTruthy();
  }));

  describe('#formatBankTransactionsToYnab', () => {

    it('should return empty array on empty input', inject([ParserService], (service: ParserService) => {
      expect(service.formatBankTransactionsToYnab('')).toEqual([]);
    }));

    it('should parse single transaction correctly', inject([ParserService], (service: ParserService) => {
      const input = '13.3.2018 \t-3,88 \t  \tKORTTIOSTO \tS market Vaasanhalli';
      const expectation = {date: '13/03/2018', payee: 'S market Vaasanhalli', outflow: 3.88, inflow: 0};
      expect(service.formatBankTransactionsToYnab(input)).toEqual([expectation]);
    }));

    it('should parse multiple transaction correctly', inject([ParserService], (service: ParserService) => {
      const input = '13.3.2018 \t-3,88 \t  \tKORTTIOSTO \tS market Vaasanhalli\n' +
        '12.3.2018 \t-11,02 \t  \tKORTTIOSTO \tS market Ympyrätalo\n' +
        '12.3.2018 \t+9,31 \t  \tKORTTIOSTO \tAlepa Otaniemi\n' +
        '11.3.2018 \t-35,59 \t*  \tKORTTIOSTO \tPrisma Sello';
      const expectation = [
        { date: '13/03/2018', payee: 'S market Vaasanhalli', outflow: 3.88, inflow: 0 },
        { date: '12/03/2018', payee: 'S market Ympyrätalo', outflow: 11.02, inflow: 0 },
        { date: '12/03/2018', payee: 'Alepa Otaniemi', outflow: 0, inflow: 9.31 },
        { date: '11/03/2018', payee: 'Prisma Sello', outflow: 35.59, inflow: 0 }
      ];
      expect(service.formatBankTransactionsToYnab(input)).toEqual(expectation);
    }));

  });

  describe('#formatTicketDuoTransactionsToYnab', () => {

    it('should return empty array on empty input', inject([ParserService], (service: ParserService) => {
      expect(service.formatTicketDuoTransactionsToYnab('')).toEqual([]);
    }));

    it('should parse single transaction correctly', inject([ParserService], (service: ParserService) => {
      const input = '07.03.18 17:24\tMCD KAMPPI - MCD KAMPPI\n' +
        '\t\t-7,70\t';
      const expectation = {date: '07/03/2018', payee: 'MCD KAMPPI - MCD KAMPPI', outflow: 7.70, inflow: 0};
      expect(service.formatTicketDuoTransactionsToYnab(input)).toEqual([expectation]);
    }));

    it('should parse multiple transaction correctly', inject([ParserService], (service: ParserService) => {
      const input = '13.03.18 12:17\tSodexo Teollisuuskatu HELSINKI\n' +
        '\tKatevaraus\t-9,40\t\n' +
        '10.03.18 17:37\tHesburger 09101 Karkki - Hesburger 09101 Karkkila\n' +
        '\t\t-7,90\t\n' +
        '07.03.18 17:24\tMCD KAMPPI - MCD KAMPPI\n' +
        '\t\t-7,70\t\n' +
        '27.02.18 19:08\tAALTO T-TALO SUBWAY - AALTO T-TALO SUBWAY\n' +
        '\t\t-7,93\t';
      const expectation = [
        { date: '13/03/2018', payee: 'Sodexo Teollisuuskatu HELSINKI', outflow: 9.4, inflow: 0 },
        { date: '10/03/2018', payee: 'Hesburger 09101 Karkki - Hesburger 09101 Karkkila', outflow: 7.9, inflow: 0 },
        { date: '07/03/2018', payee: 'MCD KAMPPI - MCD KAMPPI', outflow: 7.7, inflow: 0 },
        { date: '27/02/2018', payee: 'AALTO T-TALO SUBWAY - AALTO T-TALO SUBWAY', outflow: 7.93, inflow: 0 }
      ];
      expect(service.formatTicketDuoTransactionsToYnab(input)).toEqual(expectation);
    }));

    it('should parse top up transaction correctly', inject([ParserService], (service: ParserService) => {
      const input = 'Lataus, 06.02.18\t\t\t150,00\t';
      const expectation = [
        { date: '06/02/2018', payee: '', outflow: 0, inflow: 150 }
      ];
      expect(service.formatTicketDuoTransactionsToYnab(input)).toEqual(expectation);
    }));

  });

  describe('#formatBankOfNorwegianTransactionsToYnab', () => {

    it('should return empty array on empty input', inject([ParserService], (service: ParserService) => {
      expect(service.formatBankOfNorwegianTransactionsToYnab('')).toEqual([]);
    }));

    it('should parse single transaction correctly', inject([ParserService], (service: ParserService) => {

      const input = 'R ESPOO AALTOYO METROKESK\n' +
        '27.02.19 - Osto\n' +
        '-4,00\n' +
        '\n';

      const expectation = {date: '27/02/2019', payee: 'R ESPOO AALTOYO METROKESK', outflow: 4.00, inflow: 0};
      expect(service.formatBankOfNorwegianTransactionsToYnab(input)).toEqual([expectation]);
    }));

    it('should parse multiple transactions correctly', inject([ParserService], (service: ParserService) => {

      const input = 'R ESPOO AALTOYO METROKESK\n' +
        '27.02.19 - Osto\n' +
        '-4,00\n' +
        '\n' +
        'VFI*Manhattan Fast Food O\n' +
        '27.02.19 - Osto\n' +
        '-4,80\n' +
        '\n' +
        'R ESPOO AALTOYO METROKESK\n' +
        '26.02.19 - Osto\n' +
        '-4,00\n' +
        '\n' +
        'Maksaja HANNU HUHTAN\n' +
        '15.02.19 - Maksu\n' +
        '1 690,64\n';

      const expectation = [
        {date: '27/02/2019', payee: 'R ESPOO AALTOYO METROKESK', outflow: 4.00, inflow: 0},
        {date: '27/02/2019', payee: 'VFI*Manhattan Fast Food O', outflow: 4.80, inflow: 0},
        {date: '26/02/2019', payee: 'R ESPOO AALTOYO METROKESK', outflow: 4.00, inflow: 0},
        {date: '15/02/2019', payee: 'Maksaja HANNU HUHTAN', outflow: 0, inflow: 1690.64}
      ];

      expect(service.formatBankOfNorwegianTransactionsToYnab(input)).toEqual(expectation);
    }));

    it('should parse transactions done in foreign currency', inject([ParserService], (service: ParserService) => {

      const input = 'jiu mu za wu she\n' +
        '09.02.19 - Osto\n' +
        '-88,00 CNY\n' +
        'Valutabeløp\n' +
        '0,134\n' +
        'Valutakurs\n' +
        '-11,76\n' +
        '\n';

      const expectation = [
        {date: '09/02/2019', payee: 'jiu mu za wu she', outflow: 11.76, inflow: 0}
      ];

      expect(service.formatBankOfNorwegianTransactionsToYnab(input)).toEqual(expectation);
    }));

  });

  describe('#formatKPlussaCardBillToYnab', () => {

    it('should return empty array on empty input', inject([ParserService], (service: ParserService) => {
      expect(service.formatKPlussaCardBillToYnab('')).toEqual([]);
    }));

    it('should parse single expense row', inject([ParserService], (service: ParserService) => {
      const input = '01.03. Osto  K MARKET OTANIEMI/ESPOO                                        9,34';

      const expectation = [
        {date: '01/03/2019', payee: 'K MARKET OTANIEMI/ESPOO', outflow: 9.34, inflow: 0}
      ];

      expect(service.formatKPlussaCardBillToYnab(input)).toEqual(expectation);
    }));

    it('should parse multiple expense rows', inject([ParserService], (service: ParserService) => {
      const input =
        '01.03. Osto  K MARKET OTANIEMI/ESPOO                                        9,34\n' +
        '04.03. Osto  K SUPERMARKET KAMPPI/HELSINK                                   7,56\n' +
        '05.03. Osto  K MARKET OTANIEMI/ESPOO                                       11,57';

      const expectation = [
        {date: '01/03/2019', payee: 'K MARKET OTANIEMI/ESPOO', outflow: 9.34, inflow: 0},
        {date: '04/03/2019', payee: 'K SUPERMARKET KAMPPI/HELSINK', outflow: 7.56, inflow: 0},
        {date: '05/03/2019', payee: 'K MARKET OTANIEMI/ESPOO', outflow: 11.57, inflow: 0}
      ];

      expect(service.formatKPlussaCardBillToYnab(input)).toEqual(expectation);
    }));

    it('should parse credit card payment', inject([ParserService], (service: ParserService) => {
      const input = '25.03. Lyhennys                                                67,28';

      const expectation = [
        {date: '25/03/2019', payee: 'Lyhennys', outflow: 0, inflow: 67.28}
      ];

      expect(service.formatKPlussaCardBillToYnab(input)).toEqual(expectation);
    }));


    it('should ignore extraneous rows', inject([ParserService], (service: ParserService) => {
      const input =
        'K-PLUSSA MASTERCARD\n' +
        'Luottoraja                                                              2.000,00\n' +
        'Kuukausierä                                                                60,00\n' +
        'Luoton korko                                                              9,19 %\n' +
        '25.03. Saldo                                                               67,28\n' +
        '25.03. Lyhennys                                                67,28\n' +
        '       Saapuneet maksut yhteensä                                           67,28\n' +
        '01.03. Osto  K MARKET OTANIEMI/ESPOO                                        9,34\n' +
        '04.03. Osto  K SUPERMARKET KAMPPI/HELSINK                                   7,56\n' +
        '05.03. Osto  K MARKET OTANIEMI/ESPOO                                       11,57\n' +
        '       Lyhennyksen osuus kuukausierästä                        60,00\n' +
        '       Luoton määrä ennen maksua                                          166,02\n' +
        'Maksettava vähintään EUR                                                   60,00\n' +
        'Maksettava enintään EUR                                                   166,02\n' +
        'Viitenumero on aina mainittava maksettaessa 00 00000 00000';

      const expectation = [
        {date: '25/03/2019', payee: 'Lyhennys', outflow: 0, inflow: 67.28},
        {date: '01/03/2019', payee: 'K MARKET OTANIEMI/ESPOO', outflow: 9.34, inflow: 0},
        {date: '04/03/2019', payee: 'K SUPERMARKET KAMPPI/HELSINK', outflow: 7.56, inflow: 0},
        {date: '05/03/2019', payee: 'K MARKET OTANIEMI/ESPOO', outflow: 11.57, inflow: 0}
      ];

      expect(service.formatKPlussaCardBillToYnab(input)).toEqual(expectation);
    }));

  });
});
