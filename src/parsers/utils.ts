export function parseExcelDate(excelDate: number) {
    // Excel dates are stored as number of days since 1900-01-01
    const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000))
    return date
}