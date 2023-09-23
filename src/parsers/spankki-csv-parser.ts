import { YnabTransaction } from "@/types"

// Example input:
/*
Kirjauspäivä;Maksupäivä;Summa;Tapahtumalaji;Maksaja;Saajan nimi;Saajan tilinumero;Saajan BIC-tunnus;Viitenumero;Viesti;Arkistointitunnus
31.01.2023;30.01.2023;-11,10;KORTTIOSTO;TEPPO TESTI;CRV*RAVINTOLA FOOD;-;-;-;'000000******0000 1234567890';20230131000000000
30.01.2023;29.01.2023;-7,30;KORTTIOSTO;TEPPO TESTI;CATERING RESTAURANT;-;-;-;'000000******0000 1234567890';20230130000000000
30.01.2023;28.01.2023;-26,30;KORTTIOSTO;TEPPO TESTI;FRESH;-;-;-;'000000******0000 1234567890';20230130000000000
25.01.2023;25.01.2023;+1500,00;TILISIIRTO;TIINA TESTI;Tiina Testi;FIXX XXXX XXXX XXXX XX ;XXXXXXXXXXX;-;'love';20230125000000000
25.01.2023;24.01.2023;-14,50;KORTTIOSTO;TEPPO TESTI;SUSHISUSHI;-;-;-;'000000******0000 1234567890';20230125000000000
23.01.2023;23.01.2023;-467,64;E-LASKU;TEPPO TESTI;Bank bank Oy;FIXX XXXX XXXX XXXX XX ;XXXXXXXXXXX;0000001234;'-';20230123000000000
19.01.2023;19.01.2023;-66,81;E-LASKU;TEPPO TESTI;Corp Org;FIXX XXXX XXXX XXXX XX ;XXXXXXXXXXX;0000000000001234;'-';20230119000000000
10.01.2023;10.01.2023;+0,82;MAKSUTAPAETU;HOK-ELANTO;TEPPO TESTI;FIXX XXXX XXXX XXXX XX;XXXXXXXXXXX;-;'-';20230110000000000
10.01.2023;10.01.2023;+0,28;TANKKAUSBONUS;HOK-ELANTO;TEPPO TESTI;FIXX XXXX XXXX XXXX XX;XXXXXXXXXXX;-;'-';20230110000000000
10.01.2023;10.01.2023;+1,10;BONUS;HOK-ELANTO;TEPPO TESTI;FIXX XXXX XXXX XXXX XX;XXXXXXXXXXX;-;'-';20230110000000000
*/

function trimQuotes(s: string): string {
    if (s.startsWith("'")) {
        s = s.substring(1)
    }
    if (s.endsWith("'")) {
        s = s.substring(0, s.length - 1)
    }
    return s
}

function parseLine(line: string): YnabTransaction {
    const fields = line.split(';')
    // date is in format dd.mm.yyyy
    const date = new Date(fields[0].split('.').reverse().join('-'))
    const amount = parseFloat(fields[2].replace(',', '.'))
    const payee = fields[5]
    const outflow = amount < 0 ? -amount : 0
    const inflow = amount > 0 ? amount : 0
    const description = trimQuotes(fields[9])

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
    // remove empty lines
    const nonEmptyLines = lines.filter(line => line.length > 0)

    const transactions = nonEmptyLines.map(parseLine)
    return transactions
}