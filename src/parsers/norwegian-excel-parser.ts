// parses an excel file exported from norwegian bank to YNAB transactions using xlsx library

import { YnabTransaction } from '@/types';
import XLSX from 'xlsx'
import { parseExcelDate } from './utils';

export async function parseFile(fileOrBuffer: File | Buffer): Promise<YnabTransaction[]> {
    let data: ArrayBuffer;

    if (typeof File !== 'undefined' && fileOrBuffer instanceof File) {
      // In the browser, fileOrBuffer is a File object
      data = await fileOrBuffer.arrayBuffer();
    } else if (fileOrBuffer instanceof Buffer) {
      // In Node.js, fileOrBuffer is a Buffer
      data = fileOrBuffer.buffer;
    } else {
      throw new Error('Unsupported file type'); // Handle unsupported types as needed
    }

    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rawTransactions = XLSX.utils.sheet_to_json(sheet);

    // filter out reservations (Type is 'Katevaraus')
    const filteredTransactions = rawTransactions.filter((rawTransaction: any) => rawTransaction.Type !== 'Katevaraus');

    return filteredTransactions.map((rawTransaction: any) => {
        const date = parseExcelDate(rawTransaction.TransactionDate);
        const payee = rawTransaction.Text?.trim();
        const amount = rawTransaction.Amount;
        const outflow = amount < 0 ? -amount : 0;
        const inflow = amount > 0 ? amount : 0;
        const merchantArea = rawTransaction['Merchant Area']?.trim();
        const merchantCategory = rawTransaction['Merchant Category']?.trim();
        const description = merchantArea + ' | ' + merchantCategory;

        return {
            date,
            payee,
            outflow,
            inflow,
            description
        }
    });
}