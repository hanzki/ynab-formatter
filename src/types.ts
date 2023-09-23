// YNAB Transaction type
// inflow and outflow are mutually exclusive, one must be 0
export interface YnabTransaction {
    date: Date,
    payee: string,
    outflow: number,
    inflow: number,
    description?: string
}