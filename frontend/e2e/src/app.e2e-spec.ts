import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('page title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Meta Studio');
  });

  it('register', () => {
    page.register();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:4200/login');
  });

  it('login', () => {
    page.login();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:4200/home');
  });

  it('add board', () => {
    expect(page.addBoard()).toEqual("Test board from protractor");
  });

  it('add team', () => {
    expect(page.addTeam()).toEqual("Test team from protractor");
  });

  it('add list', () => {
    expect(page.addList()).toEqual("Test list from protractor");
  });

  it('add card', () => {
    expect(page.addCard()).toEqual("Test card from protractor");
  });

  it('navigate from board to home', () => {
    page.fromBoardToHome();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:4200/home');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
