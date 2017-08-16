import { OviedoFirePage } from './app.po';

describe('OvideoFire App', () => {
  let page: OviedoFirePage;

  beforeEach(() => {
    page = new OviedoFirePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
