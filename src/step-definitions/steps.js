const { Given, When, Then } = require('@wdio/cucumber-framework');

const LoginPage = require('../pageobjects/login.page');
const SecurePage = require('../pageobjects/secure.page');

const pages = {
    login: LoginPage
}

Given(/^I am on the (\w+) page$/, async (page) => {
    await pages[page].open()
});

When(/^I login with (\w+) and (.+)$/, async (username, password) => {
    await LoginPage.login(username, password)
});

Then(/^I should see a flash message saying (.*)$/, async (message) => {
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveTextContaining(message);
});

Given(/^I published a content for (.+) segment with (.+) image ID, (.+) image url, (.+) redirection url, (.+) alt text for (.+) slot on Amplience$/,   async function (fragmentToOverride, slotDeliveryKey) {
    setMdnsCookie(`X-Mdns-Slot-Id_${fragmentToOverride}`, slotDeliveryKey)
  });

  Given(/^I overrode \"([^\"]*)\" fragment with (.+) slot delivery key$/, function (slotdeliverykey, , callbackfirstorymobileslotgroup2, callback) {
    callback.pending();
  });

  When(/^I open \"([^\"]*)\" page in \"([^\"]*)\" platform, (.+) country code, (.+) language as a user in (.+) segment$/, function (countrycode, language, usersegment, , callbackhomepage, mobile, callback) {
    callback.pending();
  });

  Then(/^I should see content with (.+) image ID, (.+) image URL, (.+) redirection URL, (.+) alt text on (.+) slot$/, function (imageid, imageurl, redirectionurl, alttext, slotdeliverykey, callback) {
    callback.pending();
  });


