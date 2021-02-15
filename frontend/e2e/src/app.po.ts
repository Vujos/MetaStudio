import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return browser.getTitle();
  }

  register(){
    element.all(by.tagName("a")).last().click().then(()=>{
      element(by.name("fullName")).sendKeys("Test");
      element(by.name("username")).sendKeys("test");
      element(by.name("email")).sendKeys("test@test.com");
      element(by.name("password")).sendKeys("test");
      element(by.tagName("button")).click();
    });
  }

  login() {
    element(by.name("email")).sendKeys("gavricstanko@gmail.com");
    element(by.name("password")).sendKeys("123");
    element(by.className("login-button")).click();
  }

  addBoard() {
    element.all(by.tagName("input")).first().sendKeys("Test board from protractor");
    return element.all(by.tagName("button")).first().click().then(() => { return element.all(by.className("example-box-boards")).last().getText() });
  }

  addTeam() {
    element.all(by.tagName("input")).last().sendKeys("Test team from protractor");
    return element.all(by.tagName("button")).get(1).click().then(() => { return element.all(by.className("example-box-teams")).last().getText() });
  }

  addList() {
    element.all(by.className("example-box-boards")).last().click().then(() => { element.all(by.tagName("input")).first().sendKeys("Test list from protractor") });
    return element.all(by.className("black whitesmoke transform-scale")).click().then(() => { return element.all(by.className("list-title")).last().getText() });
  }

  addCard() {
    element.all(by.tagName("input")).last().sendKeys("Test card from protractor");
    return element.all(by.className("black background-ebebeb transform-scale")).last().click().then(() => { return element.all(by.css(".example-box div")).last().getText() });
  }

  fromBoardToHome(){
    element.all(by.tagName("button")).first().click();
  }

}
