// tests for spankki-csv-parser.ts

import { YnabTransaction } from '@/types';
import * as SpankkiCsvParser from './spankki-csv-parser';

describe('SpankkiCsvParser', () => {

    const fileHeader = "Kirjauspäivä;Maksupäivä;Summa;Tapahtumalaji;Maksaja;Saajan nimi;Saajan tilinumero;Saajan BIC-tunnus;Viitenumero;Viesti;Arkistointitunnus";

    it('parses an empty file', () => {
        const input = fileHeader + '\n';
        const expected: YnabTransaction[] = [];
        const actual = SpankkiCsvParser.parse(input);
        expect(actual).toEqual(expected);
    });

    it('parses a file with one transaction', () => {
        const input = fileHeader +
            "\n31.01.2023;30.01.2023;-11,10;KORTTIOSTO;TEPPO TESTI;CRV*RAVINTOLA FOOD;-;-;-;'000000******0000 1234567890';20230131000000000" +
            "\n";
        const expected: YnabTransaction[] = [{
            date: new Date('2023-01-31'),
            payee: 'CRV*RAVINTOLA FOOD',
            outflow: 11.10,
            inflow: 0,
            description: "000000******0000 1234567890"
        }];
        const actual = SpankkiCsvParser.parse(input);
        expect(actual).toEqual(expected);
    });

    it('parses a file with multiple transactions', () => {
        const input = fileHeader + 
            "\n31.01.2023;30.01.2023;-11,10;KORTTIOSTO;TEPPO TESTI;CRV*RAVINTOLA FOOD;-;-;-;'000000******0000 1234567890';20230131000000000" +
            "\n03.01.2023;02.01.2023;-7,30;KORTTIOSTO;TEPPO TESTI;CATERING RESTAURANT;-;-;-;'000000******0000 1234567890';20230130000000000" +
            "\n";
        const expected: YnabTransaction[] = [
            {
                date: new Date('2023-01-31'),
                payee: 'CRV*RAVINTOLA FOOD',
                outflow: 11.10,
                inflow: 0,
                description: "000000******0000 1234567890"
            },
            {
                date: new Date('2023-01-03'),
                payee: 'CATERING RESTAURANT',
                outflow: 7.30,
                inflow: 0,
                description: "000000******0000 1234567890"
            }
        ];
        const actual = SpankkiCsvParser.parse(input);
        expect(actual).toEqual(expected);
    });
});