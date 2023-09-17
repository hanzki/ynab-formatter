// tests for norwegian-excel-parser

import { YnabTransaction } from '@/types';
import * as NorwegianExcelParser from './norwegian-excel-parser';
import fs from 'fs';

describe('NorwegianExcelParser', () => {
    it('parses a single transaction', async () => {
        const input = fs.readFileSync('src/parsers/test-resources/norwegian_single_test_case.xlsx');
        const expected: YnabTransaction[] = [
            {
                date: new Date('2023-08-17'),
                payee: 'VFI*KAMPIZZA OY',
                outflow: 1.7,
                inflow: 0,
                description: 'HELSINKI | Fast Food Restaurants'
              }
        ];
        const actual = await NorwegianExcelParser.parseFile(input);
        expect(actual).toEqual(expected);
    });

    it('parses multiple transaction', async () => {
        const input = fs.readFileSync('src/parsers/test-resources/norwegian_multiple_test_cases.xlsx');
        const expected: YnabTransaction[] = [
            {
                date: new Date('2023-08-17'),
                payee: 'VFI*KAMPIZZA OY',
                outflow: 1.7,
                inflow: 0,
                description: 'HELSINKI | Fast Food Restaurants'
            },
            {
                date: new Date('2023-08-17'),
                payee: 'IZETTLE AS PAYPAL SERVICE',
                outflow: 134,
                inflow: 0,
                description: 'HELSINKI | Miscellaneous and Specialty Retail S'
            },
            {
                date: new Date('2023-09-03'),
                payee: 'AWS EMEA',
                outflow: 0.6,
                inflow: 0,
                description: 'aws.amazon.co | Business Services, Not Elsewhere Cla'
            },
            {
                date: new Date('2023-09-05'),
                payee: 'VFI*KINLEYSON',
                outflow: 26,
                inflow: 0,
                description: 'ESPOO | Taxicabs and Limousines'
            },
        ];
        const actual = await NorwegianExcelParser.parseFile(input);
        expect(actual).toEqual(expected);
    });

    it('filters out reservations', async () => {
        const input = fs.readFileSync('src/parsers/test-resources/norwegian_reservation_test_cases.xlsx');
        const expected: YnabTransaction[] = [
            {
              date: new Date('2023-08-17'),
              payee: 'VFI*KAMPIZZA OY',
              outflow: 1.7,
              inflow: 0,
              description: 'HELSINKI | Fast Food Restaurants'
            }
          ];
        const actual = await NorwegianExcelParser.parseFile(input);
        expect(actual).toEqual(expected);
    });

    it('parses mixed transactions', async () => {
        const input = fs.readFileSync('src/parsers/test-resources/norwegian_mixed_test_cases.xlsx');
        const expected: YnabTransaction[] = [
            {
              date: new Date('2023-08-17'),
              payee: 'VFI*KAMPIZZA OY',
              outflow: 1.7,
              inflow: 0,
              description: 'HELSINKI | Fast Food Restaurants'
            },
            {
              date: new Date('2023-08-17'),
              payee: 'IZETTLE AS PAYPAL SERVICE',
              outflow: 134,
              inflow: 0,
              description: 'HELSINKI | Miscellaneous and Specialty Retail S'
            },
            {
              date: new Date('2023-09-03'),
              payee: 'AWS EMEA',
              outflow: 0.6,
              inflow: 0,
              description: 'aws.amazon.co | Business Services, Not Elsewhere Cla'
            },
            {
              date: new Date('2023-09-05'),
              payee: 'VFI*KINLEYSON',
              outflow: 26,
              inflow: 0,
              description: 'ESPOO | Taxicabs and Limousines'
            },
            {
              date: new Date('2023-09-15'),
              payee: 'From  TEPPO TESTI',
              outflow: 0,
              inflow: 2500.23,
              description: 'undefined | undefined'
            }
          ];
        const actual = await NorwegianExcelParser.parseFile(input);
        expect(actual).toEqual(expected);
    });
});