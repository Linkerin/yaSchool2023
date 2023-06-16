'use strict';

const { fetcher } = require('./fetcher.js');

const anchorUrlRegExp = new RegExp(
  /<a\s+(?:[^>]*?\s+)?href=["']((?!(?:mailto|tel):)[^"']*)["'][^>]*>.*?<\/a>/gi
);

// https://learn.microsoft.com/en-us/previous-versions/msp-n-p/ff650303(v=pandp.10)
const urlRegExp = new RegExp(
  /^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)(\?[a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#=_]*)?$/
);

async function fetchAndParse(url) {
  let possibleTries = 2;
  let fetchRes;
  const invalidLinkRes = {
    status: 'invalid',
    urls: []
  };

  while (possibleTries > 0) {
    fetchRes = await fetcher(url);
    if (fetchRes.status === 404) return invalidLinkRes;

    if (fetchRes.status !== 200) {
      possibleTries -= 1;
      continue;
    }
    break;
  }

  if (fetchRes.status !== 200) return invalidLinkRes;

  const pageHtml = await fetchRes.text();

  const urlsToCheck = [];
  let matches;

  while ((matches = anchorUrlRegExp.exec(pageHtml)) !== null) {
    const urlString = matches[1];
    if (urlString !== url) {
      urlsToCheck.push(urlString);
    }
  }

  return { status: 'valid', urls: urlsToCheck };
}

module.exports = {
  urlRegExp,
  fetchAndParse
};
