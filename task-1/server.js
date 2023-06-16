'use strict';

const express = require('express');

const { parseUrl } = require('./handler.js');
const { urlRegExp } = require('./services.js');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.post('/parse', async (req, res) => {
  const { domainName } = req.body;
  if (typeof domainName !== 'string' || !urlRegExp.test(domainName)) {
    return res
      .status(400)
      .json({ message: 'Invalid `domainName` was provided' });
  }

  try {
    const allUrls = await parseUrl(domainName);

    return res.json(allUrls);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `'${domainName}' parsing failed` });
  }
});

app.listen(port, () => console.log(`The server is running on port ${port}`));
