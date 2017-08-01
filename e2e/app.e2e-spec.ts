import { Untitled3Page } from './app.po';

describe('untitled3 App', () => {
  let page: Untitled3Page;

  beforeEach(() => {
    page = new Untitled3Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
