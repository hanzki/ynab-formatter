import {DateTime} from 'luxon';

export interface YnabTransaction {
  date: DateTime,
  payee: string,
  outflow: number,
  inflow: number,
  description?: string
}
