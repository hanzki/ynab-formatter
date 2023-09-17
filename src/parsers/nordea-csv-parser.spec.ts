// unit tests for nordea-csv-parser

import * as NordeaCsvParser from './nordea-csv-parser';
import { YnabTransaction } from '@/types';

describe('NordeaCsvParser', () => {
    it('parses an empty file', () => {
        const input = "Kirjauspäivä;Määrä;Maksaja;Maksunsaaja;Nimi;Otsikko;Viitenumero;Valuutta";
        const expected: YnabTransaction[] = [];
        const actual = NordeaCsvParser.parse(input);
        expect(actual).toEqual(expected);
    });

    it('parses a file with one transaction', () => {
        const input = "Kirjauspäivä;Määrä;Maksaja;Maksunsaaja;Nimi;Otsikko;Viitenumero;Valuutta\n2023/09/17;-10000,00;FIXX XXXX XXXX XXXX XX;;;BANK NORWEGIAN SAVINGS;;EUR";
        const expected: YnabTransaction[] = [{
            date: new Date('2023-09-17'),
            payee: 'BANK NORWEGIAN SAVINGS',
            outflow: 10000,
            inflow: 0,
            description: "FIXX XXXX XXXX XXXX XX"
        }];
        const actual = NordeaCsvParser.parse(input);
        expect(actual).toEqual(expected);
    });

    it('parses a file with multiple transactions', () => {
        const input = "Kirjauspäivä;Määrä;Maksaja;Maksunsaaja;Nimi;Otsikko;Viitenumero;Valuutta\n2023/09/17;-10000,00;FIXX XXXX XXXX XXXX XX;;;BANK NORWEGIAN SAVINGS;;EUR\n2023/09/15;3402,40;FIXX XXXX XXXX XXXX XX;;;ORG CORP;;EUR";
        const expected: YnabTransaction[] = [
            {
                date: new Date('2023-09-17'),
                payee: 'BANK NORWEGIAN SAVINGS',
                outflow: 10000,
                inflow: 0,
                description: "FIXX XXXX XXXX XXXX XX"
            },
            {
                date: new Date('2023-09-15'),
                payee: 'ORG CORP',
                outflow: 0,
                inflow: 3402.4,
                description: "FIXX XXXX XXXX XXXX XX"
            }
        ];
        const actual = NordeaCsvParser.parse(input);
        expect(actual).toEqual(expected);
    });

    it('parses a file with a reservation and a transaction', () => {
        const input = "Kirjauspäivä;Määrä;Maksaja;Maksunsaaja;Nimi;Otsikko;Viitenumero;Valuutta\nVaraus;-100,00;FIXX XXXX XXXX XXXX XX;;;Sääst_ Korko Kasvu;;EUR\n2023/09/17;-10000,00;FIXX XXXX XXXX XXXX XX;;;BANK NORWEGIAN SAVINGS;;EUR";
        const expected: YnabTransaction[] = [
            {
                date: new Date('2023-09-17'),
                payee: 'BANK NORWEGIAN SAVINGS',
                outflow: 10000,
                inflow: 0,
                description: "FIXX XXXX XXXX XXXX XX"
            }
        ];
        const actual = NordeaCsvParser.parse(input);
        expect(actual).toEqual(expected);
    });
});
