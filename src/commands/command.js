const {geocode, nearbySearch} = require('../services/maps-service');

// Listens to incoming commands
const setupCommand = async (app) => {
  app.command('/lunch', async ({command, context, ack}) => {
    await ack();
    const text = command.text;
    const channel = command.channel_id;
    const matchesWithCategory = text.match(/(.*) restos near (.*)/);
    const matchesWithoutCategory = text.match(/restos near (.*)/);

    let address; let keyword;
    if (matchesWithCategory == null) {
      address = matchesWithoutCategory[1];
    } else {
      keyword = matchesWithCategory[1];
      address = matchesWithCategory[2];
    }
    const latLong = await geocode(address);
    const results = await nearbySearch(keyword, latLong, 'restaurant');
    console.log(results);

    await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: channel,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `:fork_and_knife: Got some resto suggestions for y'all! \n`
          },
        },
        ..._getFormattedResults(results)
      ],
    });
  });

  app.command('/hh', async ({command, context, ack}) => {
    await ack();
    const text = command.text;
    const channel = command.channel_id;
    const matchesWithCategory = text.match(/(.*) near (.*)/);
    const matchesWithoutCategory = text.match(/bars near (.*)/);

    let address; let keyword;
    if (matchesWithCategory == null) {
      address = matchesWithoutCategory[1];
    } else {
      keyword = matchesWithCategory[1];
      address = matchesWithCategory[2];
    }
    const latLong = await geocode(address);
    const results = await nearbySearch(keyword, latLong, 'bar');

    await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: channel,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `:cocktail: Got some happiest hour suggestions for y'all! \n`
          },
        },
        ..._getFormattedResults(results)
      ],
    });
  });


}

const _getFormattedResults = (results) => {
  return results.map(res => ({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `- <${res.url}|${res.name}> ${res.rating} :star: - ${res.address}\n`
    },
  })
)}

module.exports = { setupCommand }