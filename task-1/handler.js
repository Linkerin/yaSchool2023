'use strict';

const { fetchAndParse } = require('./services.js');

async function parseUrl(baseUrl) {
  let urlsToCheck = [];
  let allUrls = [];

  urlsToCheck.push(baseUrl);

  while (urlsToCheck.length > 0) {
    let url = urlsToCheck.shift();

    if (allUrls.includes(url)) continue;
    const result = await fetchAndParse(url);

    if (result.status === 'valid') {
      allUrls.push(url);
      urlsToCheck.push(...result.urls);
    }
  }

  return [...new Set(allUrls)];
}

module.exports = {
  parseUrl
};
