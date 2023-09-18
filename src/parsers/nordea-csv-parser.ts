import { YnabTransaction } from "@/types"

// Example input:
/*
Kirjauspäivä;Määrä;Maksaja;Maksunsaaja;Nimi;Otsikko;Viitenumero;Valuutta
Varaus;-100,00;FIXX XXXX XXXX XXXX XX;;;Sääst_ Korko Kasvu;;EUR
Varaus;-200,00;FIXX XXXX XXXX XXXX XX;;;Nordea North American Enh;;EUR
Varaus;-600,00;FIXX XXXX XXXX XXXX XX;;;Nordea Global Enhanced Fu;;EUR
Varaus;-50,00;FIXX XXXX XXXX XXXX XX;;;Sicav 2 Emerging Markets;;EUR
Varaus;-50,00;FIXX XXXX XXXX XXXX XX;;;Nordea Global Enhanced Sm;;EUR
2023/09/17;-10000,00;FIXX XXXX XXXX XXXX XX;;;BANK NORWEGIAN SAVINGS;;EUR
2023/09/15;3402,40;;FIXX XXXX XXXX XXXX XX;;ORG CORP;;EUR
2023/09/15;40,00;;FIXX XXXX XXXX XXXX XX;;MobilePay Matti Meikäläinen;;EUR
2023/09/15;-140,16;FIXX XXXX XXXX XXXX XX;;;BANK NORWEGIAN CREDIT CARDS;;EUR
2023/09/14;230,49;;FIXX XXXX XXXX XXXX XX;;VEROHALLINTO;;EUR
2023/09/08;177,70;;FIXX XXXX XXXX XXXX XX;;ORG CORP;;EUR
*/

function parseLine(line: string): YnabTransaction {
    const fields = line.split(';')
    const localDate = new Date(fields[0])
    const date = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()))
    const amount = parseFloat(fields[1].replace(',', '.'))
    const payee = fields[5]
    const outflow = amount < 0 ? -amount : 0
    const inflow = amount > 0 ? amount : 0
    const description = ''
    return {
        date,
        payee,
        outflow,
        inflow,
        description
    }
}

export function parse(input: string): YnabTransaction[] {
    const lines = input.split('\n')
    lines.shift() // remove header line

    // ignore reservation lines (lines starting with 'Varaus')
    const linesWithoutReservations = lines.filter(line => !line.startsWith('Varaus'))

    const transactions = linesWithoutReservations.map(parseLine)
    return transactions
}