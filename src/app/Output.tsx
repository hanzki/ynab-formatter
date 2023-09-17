// React component named Output with the following props: list of YnabTransaction objects
// Path: src/app/Output.tsx

import { YnabTransaction } from "@/types";

interface OutputProps {
    transactions: YnabTransaction[]
}

export default function Output({
    transactions
}: OutputProps) {
    // Table of transactions with columns for date, payee, outflow, and inflow
    // Date format: dd.mm.yyyy
    const transactionsTable = (
        <table className="table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Payee</th>
                    <th>Outflow</th>
                    <th>Inflow</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((t, i) => (
                    <tr key={i}>
                        <td>{t.date.toLocaleDateString()}</td>
                        <td>{t.payee}</td>
                        <td>{t.outflow}</td>
                        <td>{t.inflow}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    // Download button
    // Download file name: ynab-transactions.csv
    // Download file contents: CSV file with the following columns: Date, Payee, Memo, Outflow, Inflow
    // Date format: MM/DD/YYYY
    // Memo: empty
    const downloadCsv = () => {
        const filterCommas = (s: string) => s.replace(/,/g, ' ');
        const header = 'Date,Payee,Memo,Outflow,Inflow\n';
        const csv = header + transactions.map(t => {
            const date = t.date.toLocaleDateString('en-US');
            const payee = filterCommas(t.payee);
            const memo = filterCommas(t.description || "");
            const outflow = t.outflow;
            const inflow = t.inflow;
            return `${date},${payee},${memo},${outflow},${inflow}`;
        }).join('\n');
        const blob = new Blob([csv], {type: 'text/csv'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ynab-transactions.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    const downloadButton = (
        <button className="btn btn-primary" onClick={downloadCsv}>Download CSV</button>
    );
    
    return (
        <>
            <h2>Output</h2>
            {transactionsTable}
            {downloadButton}
        </>
    )
}
