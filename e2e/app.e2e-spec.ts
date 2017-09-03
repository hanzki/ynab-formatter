import { YnabFormatterPage } from './app.po';

describe('ynab-formatter App', () => {
  let page: YnabFormatterPage;

  beforeEach(() => {
    page = new YnabFormatterPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
