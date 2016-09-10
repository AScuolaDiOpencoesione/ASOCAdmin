import { BecloudDashboardPage } from './app.po';

describe('becloud-dashboard App', function() {
  let page: BecloudDashboardPage;

  beforeEach(() => {
    page = new BecloudDashboardPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
