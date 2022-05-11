const { setupCommand } = require("./commands/command");
const { App } = require('@slack/bolt');
require('dotenv').config()

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000
});

setupCommand(app);

(async () => {
  // Start your app
  await app.start();

  console.log('⚡️ Bolt app is running!');
})();

module.exports = { app }