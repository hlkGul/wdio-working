const {
  evaluate,
  goto,
  click,
  $,
  setCookie,
  write,
  press,
  waitFor,
  setConfig,
} = require("taiko");
const { segmentUserMap } = require("./data");
const cookieOptionsForDifferentDomains = [
  {
    url: process.env.layout_service_desktop_url,
  },
  {
    url: process.env.layout_service_mobile_url,
  },
  {
    domain: ".modanisa.com",
  },
  {
    domain: ".modanisa.net",
  },
];

const isHtmlSourceSaveEnabled = process.env["html_source_save"]
  ? process.env["html_source_save"] == "true"
  : false;

fs = require("fs");

setConfig({
  waitForNavigation: false,
});

const getBaseUrl = (platform, lang = "TR") => {
  const platformDomain =
    platform === "Desktop"
      ? process.env.layout_service_desktop_url
      : process.env.layout_service_mobile_url;

  return lang === "TR"
    ? platformDomain
    : `${platformDomain}${lang.toLowerCase()}/`;
};

const elementExistsAndVisible = async (element) => {
  return (await element.exists(0, 0)) && (await element.isVisible(0, 0));
};

const closePopups = async () => {
  const insiderPopupButton = $(
    "#insider-notification-content > .element-close-button"
  );
  if (await elementExistsAndVisible(insiderPopupButton)) {
    await click(insiderPopupButton, { force: true });
  }

  const insiderPopupButton2 = $(
    ".ins-element-close-button .ins-element-content"
  );
  if (await elementExistsAndVisible(insiderPopupButton2)) {
    await click(insiderPopupButton2, { force: true });
  }

  const continueShoppingButton = $(".welcomePopupInfo-topCloseIcon");
  if (await elementExistsAndVisible(continueShoppingButton)) {
    await click(continueShoppingButton, { force: true });
  }

  const cookieAlert = $(".cookieNotification-close");
  if (await elementExistsAndVisible(cookieAlert)) {
    await click(cookieAlert, { force: true });
  }
};

const setMdnsCookie = async (key, value) => {
  cookieOptionsForDifferentDomains.forEach((options) => {
    setCookie(key.toString(), value.toString(), options);
  });
};

exports.setMdnsCookie = setMdnsCookie;

exports.setMdnsCookies = async (
  platform,
  country,
  lang,
  customCookies = []
) => {
  const localeCookieMapping = {
    "SE-EN":
      '{"currency":"EUR","country_id":40,"country_code":"SE","ip_welcome":"","ip_country_id":"40","ip_country_code":"SE","customer_language":"EN"}',
    "SE-AR":
      '{"currency":"EUR","country_id":40,"country_code":"SE","ip_welcome":"","ip_country_id":"40","ip_country_code":"SE","customer_language":"AR"}',
    "IT-EN":
      '{"currency":"EUR","country_id":14,"country_code":"IT","ip_welcome":"","ip_country_id":"14","ip_country_code":"IT","customer_language":"EN"}',
    "BE-EN":
      '{"currency":"EUR","country_id":4,"country_code":"BE","ip_welcome":"","ip_country_id":"4","ip_country_code":"BE","customer_language":"EN"}',
    "BE-TR":
      '{"currency":"EUR","country_id":4,"country_code":"BE","ip_welcome":"","ip_country_id":"1","ip_country_code":"TR","customer_language":"TR"}',
    "TR-TR":
      '{"currency":"TRY","country_id":1,"country_code":"TR","ip_welcome":"","ip_country_id":"1","ip_country_code":"TR","customer_language":"TR"}',
    "FR-FR":
      '{"currency":"EUR","country_id":7,"country_code":"FR","ip_welcome":"","ip_country_id":"7","ip_country_code":"FR","customer_language":"FR"}',
    "DE-DE":
      '{"currency":"EUR","country_id":2,"country_code":"DE","ip_welcome":"","ip_country_id":"2","ip_country_code":"DE","customer_language":"DE"}',
    "ID-ID":
      '{"currency":"USD","country_id":61,"country_code":"ID","ip_welcome":"","ip_country_id":"61","ip_country_code":"ID","customer_language":"ID"}',
    "MA-FR":
      '{"currency":"EUR","country_id":46,"country_code":"MA","ip_welcome":"","ip_country_id":"46","ip_country_code":"MA","customer_language":"FR"}',
    "CH-FR":
      '{"currency":"EUR","country_id":13,"country_code":"CH","ip_welcome":"","ip_country_id":"13","ip_country_code":"CH","customer_language":"FR"}',
    "CH-DE":
      '{"currency":"EUR","country_id":13,"country_code":"CH","ip_welcome":"","ip_country_id":"13","ip_country_code":"CH","customer_language":"DE"}',
    "CH-TR":
      '{"currency":"EUR","country_id":13,"country_code":"CH","ip_welcome":"","ip_country_id":"13","ip_country_code":"CH","customer_language":"TR"}',
    "LU-EN":
      '{"currency":"EUR","country_id":17,"country_code":"LU","ip_welcome":"","ip_country_id":"1","ip_country_code":"TR","customer_language":"EN"}',
    "LU-FR":
      '{"currency":"EUR","country_id":17,"country_code":"LU","ip_welcome":"","ip_country_id":"1","ip_country_code":"TR","customer_language":"FR"}',
    "LU-AR":
      '{"currency":"EUR","country_id":17,"country_code":"LU","ip_welcome":"","ip_country_id":"1","ip_country_code":"TR","customer_language":"AR"}',
    "LU-DE":
      '{"currency":"EUR","country_id":17,"country_code":"LU","ip_welcome":"","ip_country_id":"1","ip_country_code":"TR","customer_language":"DE"}',
  };

  setMdnsCookie("platform", platform === "Desktop" ? "dw" : "mw");
  setMdnsCookie("modanisa_canary", "true");

  // Close continue shopping popups on desktop
  if (platform === "Desktop") {
    setMdnsCookie("lastvisittime", new Date().valueOf());
  }

  if (platform === "Mobile") {
    // Close continue shopping popups on mobile
    setMdnsCookie("last_visit_date", new Date().valueOf());

    // Close cookie policy alert on mobile
    setMdnsCookie("cookieNotification", "1");
  }

  const locale = `${country}-${lang}`;
  if (!localeCookieMapping.hasOwnProperty(locale)) {
    throw new Error(
      `${country}-${lang} is not defined in locale cookie mapping`
    );
  }

  setMdnsCookie(
    "user_shipping_data",
    encodeURIComponent(localeCookieMapping[locale])
  );
  setMdnsCookie("customer-shipping-country-code-1", country);

  const localeCookieMappingItem = JSON.parse(localeCookieMapping[locale]);

  const countryId = localeCookieMappingItem["country_id"];
  const currency = localeCookieMappingItem["currency"];

  setMdnsCookie("customer-shipping-country-id-1", countryId);
  setMdnsCookie("customer-display-currency-1", currency);
  setMdnsCookie("customer-language-1", lang);

  customCookies.forEach((customCookie) =>
    setMdnsCookie(customCookie["key"], customCookie["value"])
  );
};

exports.loginAsUserInSegment = async (
  segmentLabel,
  platform = "Desktop",
  returnPath = "",
  language
) => {
  console.log(`Info: User is given, logining as ${segmentLabel} user...`);

  const user = segmentUserMap[segmentLabel];

  if (user === undefined) {
    throw new Error("User not found.");
  }

  returnPath = returnPath
    ? "/" + returnPath
    : language === "TR"
    ? "/"
    : `/${language.toLowerCase()}/`;

  await goToTestPage(
    platform,
    `membership/login?return=${returnPath}`,
    language
  );

  await closePopups();

  // Wait for phone - email switch button for login type
  if (platform == "Mobile") {
    waitFor(async () => await $(".loginPageTabHead-label-email").exists());
    await click($(".loginPageTabHead-label-email"));
  }

  // Fix "CustomSelector with query [name="email"]  not found" error.
  waitFor(
    async () =>
      (await $('[name="email"]').exists()) &&
      (await $('[name="password"]').exists())
  );

  await write(user.email, $('[name="email"]'));
  await write(user.password, $('[name="password"]'));
  await press("Enter");

  await waitFor(10000);
};

const goToTestPage = async (platform, page, lang) => {
  if (page === null) {
    page = "";
  }

  try {
    await goto(`${getBaseUrl(platform, lang)}${page}`);
  } catch (error) {
    console.log("goto error:", error);
  }

  await closePopups();

  // Save HTML output
  if (isHtmlSourceSaveEnabled) {
    htmlOutput = await evaluate($("html"), (element) => {
      return element.innerHTML;
    });

    filePath = `html_outputs/goToTestPage_${Math.random()
      .toString(36)
      .substring(2)}.html`;

    fs.writeFile(filePath, htmlOutput, function (err) {
      if (err)
        return console.log(`An error occured when HTML output saving: ${err}`);

      console.log(`HTML output saved to ${filePath}`);
    });
  }

  await waitFor(3000);
};

exports.goToTestPage = goToTestPage;
