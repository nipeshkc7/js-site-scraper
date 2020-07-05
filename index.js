const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

if (process.env.NODE_ENV !== 'production') {
  process.env.AWS_LAMBDA_FUNCTION_NAME = 'mock';
}

async function scrape(url) {
  const chromeExecPath = await chrome.executablePath;
  try {
    browser = await puppeteer.launch({
      args: chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath: process.env.CHROME_BIN || (await chrome.executablePath),
      headless: chrome.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const pageContent = await page.content();
    console.log(pageContent);
    await browser.close();
    return pageContent;
  } catch (error) {
    console.log(`Error trying to scrape : ${url}, ${error}`);
    throw error;
  }
}

console.log('test scraping');
console.log(`Scraping instagram.com: ${scrape('https://instagram.com')}`);

module.exports = {
  scrape,
};
