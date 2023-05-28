import Image from 'next/image'

export default function Home() {
  return (
    <main>
      <div className="container">
        <nav className="navbar navbar-dark bg-primary">
          <span className="h1 navbar-brand mb-0">YNAB Formatter</span>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="https://app.youneedabudget.com">YNAB</a>
            </li>
          </ul>
        </nav>
        <div className="row">
          <div className="col-md-6">
            <h2>Input</h2>
              <div className="form-group">
                <label htmlFor="transactionSource">Transaction Source</label>
                <select id="transactionSource">
                  <option value="bank">Bank</option>
                  <option value="ticketduo">TicketDuo</option>
                  <option value="norwegian">Bank of Norwegian</option>
                  <option value="kplussa">K-Plussa Mastercard</option>
                </select>
              </div>

            <textarea cols={20} rows={20}></textarea>
          </div>
          <div className="col-md-6">
            <h2>Output</h2>
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
              <tr>
                <td>dd.mm.yyyy</td>
                <td>ACME corp</td>
                <td className="text-right">2.00€</td>
                <td className="text-right">0.00€</td>
              </tr>
              </tbody>
            </table>
            <button className="btn btn-primary">Download CSV</button>
          </div>
        </div>
      </div>
    </main>
  )
}
