// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = '8a3b5c7d1e9f0a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b';

// WhatsApp Credentials
const whatsappToken = 'EAATcBoIctqABQpg5IqtPDKpeV3fc19XGSRwOBaADoG3PVHSK0LoHtfZAJmwY05q2vTx0BkSzS9HYpWKdlaNfjFZCcvTobPX5AV2yeEoKDGuZCYTMZBccjpZBsaRuTWr2ZAqusXZAMSOiCvbeKkuixkgDZAXx6rnlnwn1ZAlMiYVc56gMRz9ECRanOyoDABhxo4AZDZD';
const whatsappPhoneId = '1367820417676960';
const whatsappBusinessAccountId = '61585593160042';

// Route for GET requests (Webhook verification)
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests (Webhook events)
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2));
  res.status(200).end();
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}`);
  console.log(`Phone ID: ${whatsappPhoneId}`);
  console.log(`Business Account ID: ${whatsappBusinessAccountId}\n`);
});
