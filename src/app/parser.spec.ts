// Straight Jasmine testing without Angular's testing support
import {ParserService} from './parser';

describe('ValueService', () => {
  let parser: ParserService;
  beforeEach(() => { parser = new ParserService(); });

  describe('#formatBankTransactionsToYnab', () => {

    it('should return empty array on empty input', () => {
      expect(parser.formatBankTransactionsToYnab('')).toEqual([]);
    });

    it('should parse single transaction correctly', () => {
      const input = '13.3.2018 \t-3,88 \t  \tKORTTIOSTO \tS market Vaasanhalli';
      const expectation = {date: '13/03/2018', payee: 'S market Vaasanhalli', outflow: 3.88, inflow: 0};
      expect(parser.formatBankTransactionsToYnab(input)).toEqual([expectation]);
    });

    it('should parse multiple transaction correctly', () => {
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
      expect(parser.formatBankTransactionsToYnab(input)).toEqual(expectation);
    });

  });

  describe('#formatTicketDuoTransactionsToYnab', () => {

    it('should return empty array on empty input', () => {
      expect(parser.formatTicketDuoTransactionsToYnab('')).toEqual([]);
    });

    it('should parse single transaction correctly', () => {
      const input = '07.03.18 17:24\tMCD KAMPPI - MCD KAMPPI\n' +
                    '\t\t-7,70\t';
      const expectation = {date: '07/03/2018', payee: 'MCD KAMPPI - MCD KAMPPI', outflow: 7.70, inflow: 0};
      expect(parser.formatTicketDuoTransactionsToYnab(input)).toEqual([expectation]);
    });

    it('should parse multiple transaction correctly', () => {
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
      expect(parser.formatTicketDuoTransactionsToYnab(input)).toEqual(expectation);
    });

    it('should parse top up transaction correctly', () => {
      const input = 'Lataus, 06.02.18\t\t\t150,00\t';
      const expectation = [
        { date: '06/02/2018', payee: '', outflow: 0, inflow: 150 }
      ];
      expect(parser.formatTicketDuoTransactionsToYnab(input)).toEqual(expectation);
    });

  });

  describe('#formatBankOfNorwegianTransactionsToYnab', () => {

    it('should return empty array on empty input', () => {
      expect(parser.formatBankOfNorwegianTransactionsToYnab('')).toEqual([]);
    });

    it('should parse single transaction correctly', () => {

      const input = '\n' +
      'Päiväys\tTeksti\tValuuttasumma\tValuuttakurssi\tMäärä\n' +
      '22.06.18\t\n' +
      'ABC PITKAJARVI\n' +
      'Osto\n' +
      '-31,15';

      const expectation = {date: '22/06/2018', payee: 'ABC PITKAJARVI', outflow: 31.15, inflow: 0};
      expect(parser.formatBankOfNorwegianTransactionsToYnab(input)).toEqual([expectation]);
    });

    it('should parse multiple transactions correctly', () => {

      const input = '\n' +
        'Päiväys\tTeksti\tValuuttasumma\tValuuttakurssi\tMäärä\n' +
        '22.06.18\t\n' +
        'ABC PITKAJARVI\n' +
        'Osto\n' +
        '-31,15\n' +
        '22.06.18\t\n' +
        'S MARKET JUANKOSKI\n' +
        'Osto\n' +
        '-367,29\n' +
        '15.06.18\t\n' +
        'K market BioCity\n' +
        'Osto\n' +
        '-5,20';

      const expectation = [
        {date: '22/06/2018', payee: 'ABC PITKAJARVI', outflow: 31.15, inflow: 0},
        {date: '22/06/2018', payee: 'S MARKET JUANKOSKI', outflow: 367.29, inflow: 0},
        {date: '15/06/2018', payee: 'K market BioCity', outflow: 5.20, inflow: 0}
      ];

      expect(parser.formatBankOfNorwegianTransactionsToYnab(input)).toEqual(expectation);
    });

    it('should parse transactions done in foreign currency', () => {

      const input = '\n' +
        'Päiväys\tTeksti\tValuuttasumma\tValuuttakurssi\tMäärä\n' +
        '08.07.18\t\n' +
        'TFL.GOV.UK/CP\n' +
        'Osto\n' +
        '-5,60 GBP\t1,1518\t-6,45\n' +
        '05.07.18\t\n' +
        'ATM LHR T3 ASA\n' +
        'Käteisnosto\n' +
        '-100,00 GBP\t1,1557\t-115,57\n' +
        '03.07.18\t\n' +
        'AWS\n' +
        'Osto\n' +
        '-0,74 USD\t0,8784\t-0,65\n';

      const expectation = [
        {date: '08/07/2018', payee: 'TFL.GOV.UK/CP', outflow: 6.45, inflow: 0},
        {date: '05/07/2018', payee: 'ATM LHR T3 ASA', outflow: 115.57, inflow: 0},
        {date: '03/07/2018', payee: 'AWS', outflow: 0.65, inflow: 0}
      ];

      expect(parser.formatBankOfNorwegianTransactionsToYnab(input)).toEqual(expectation);
    });

  })


});
