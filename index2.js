require('dotenv').config()
const fetch = require('node-fetch')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: __dirname + '/data.csv',
    header: [
        {id: 'date', title: 'DATE'},
        {id: 'price', title: 'PRICE'},
        {id: 'sectionName', title: 'SECTION NAME'},
    ],
    append: true,
});

const token = process.env.STUBHUB_API_TOKEN;

const url = 'https://api.stubhub.com/sellers/find/listings/v3/';
const eventId = '104069570';

(async () => {
  const response = await fetch(`${url}?eventId=${eventId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  });
  const body = await response.json();
  const records = [];
  for (let listing of body.listings) {
    for (let i = 0; i < listing.quantity; i++) {
      records.push({
        date: new Date().toUTCString(),
        price: listing.pricePerProduct.amount,
        sectionName: listing.sectionName,
      })
    }
  }
  await csvWriter.writeRecords(records);
})()