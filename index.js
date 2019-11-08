const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const page = await browser.newPage();
  await page.goto('https://www.stubhub.com/taking-back-sunday-tickets-taking-back-sunday-new-york-terminal-5-11-15-2019/event/104069570/?sort=price+asc');
  await page.waitForSelector('.ticket-item-wrapper')
  const ticketSalesData = await page.$$eval('.ticket-item-wrapper', ticketItemWrappers => {
    // findBiggestNumber finds the biggest number in a provided ticketsText string,
    // which takes the format "1-4 tickets"
    const findBiggestNumber = ticketsText => {
      let array = [...ticketsText.matchAll(/\d+/g)].map(number => parseInt(number));
      return Math.max(...array);
    }
    const data = ticketItemWrappers.map(ticketItemWrapper => {
      const tickets = findBiggestNumber(
        ticketItemWrapper.querySelector('.ticketsText').innerText
      );
      const price = ticketItemWrapper.querySelector('.dollar-value').innerText;
      return { tickets, price };
    });
    return data
  });
  const fileBuffer = await fs.readFile('data.json');
  const data = JSON.parse(fileBuffer);
  data[new Date().toUTCString()] = ticketSalesData;
  await fs.writeFile('data.json', JSON.stringify(data, null, 2));
  console.log('wrote to file');
  await browser.close();
})();
