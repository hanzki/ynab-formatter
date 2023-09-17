"use client";

import Input from './Input'
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap'

export default function Home() {
  return (
    <main>
      <Container>
        <Navbar bg='primary'>
          <Container>
            <Navbar.Brand>YNAB Formatter</Navbar.Brand>
            <Nav>
              <Nav.Link href='https://app.youneedabudget.com'>YNAB</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Row>
          <Col>
            <Input />
          </Col>
          <Col>
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
          </Col>
        </Row>
      </Container>
    </main>
  )
}
