"use client";

import Input from './Input'
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap'
import Output from './Output';
import { YnabTransaction } from '@/types';
import { use, useCallback, useState } from 'react';
import * as NordeaCsvParser from '@/parsers/nordea-csv-parser';
import * as NorwegianExcelParser from '@/parsers/norwegian-excel-parser';

export default function Home() {
  const [transactions, setTransactions] = useState<YnabTransaction[]>([]);

  const onInputChange = useCallback((async (source: string, selectedFile: File | null, pasteText: string) => {
    // use file contents if file is selected, otherwise use paste text
    const inputText = await (selectedFile ? selectedFile.text() : Promise.resolve(pasteText));
    switch (source) {
      case 'nordea':
        setTransactions(NordeaCsvParser.parse(inputText));
        break;

      case 'norwegian':
        if (selectedFile) {
          setTransactions(await NorwegianExcelParser.parseFile(selectedFile));
        }
        break;
      default:
        setTransactions([]);
        break;
    }
  }), []);

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
            <Input onInputChange={onInputChange}/>
          </Col>
          <Col>
            <Output transactions={transactions}/>
          </Col>
        </Row>
      </Container>
    </main>
  )
}
