const Page = require("./page");

/**
 * sub page containing specific selectors and methods for a specific page
 */


class Homepage extends Page {
    get loginButton() {
        return $(`//a[@id='headerLoginUrl']`);
    }
    async clickLogin() {
        await this.loginButton.click();
    }

    async goLoginPage() {
        await browser.url(
            `https://layout-service-web-playground.modanisa.net/membership/login/?return=%2F`
        );
    }
}

module.exports = new Homepage();
