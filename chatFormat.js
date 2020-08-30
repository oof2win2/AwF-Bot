const functions = require('./functions');
const { filterBan } = require("./filterBan");

module.exports = function chatFormat(line, channel, client) {
  if (line.includes('[JOIN]')) {
    filterBan(line.slice((line.indexOf(']') + 2), (line.indexOf('joined the game') - 1)));
  }
  if (line.includes('<server>')) return
  if (line.includes('; Factorio')) {
    return client.channels.cache.get(channel).setTopic(`Running ${functions.formatVersion(line)} since ${functions.formatDate(line)}`);
  }
  else if (line.includes('[JOIN]') || line.includes('[LEAVE]') || line.includes('[CHAT]')) {
    if (line.includes('[CHAT]')) {
      return client.channels.cache.get(channel).send(`<Game Chat> ${functions.formatChatData(line)}`);
    } else {
      return client.channels.cache.get(channel).send(`**${functions.formatChatData(line)}**`);
    }
  }
  else if (line.includes('JLOGGER:')) {
    line = line.slice((line.indexOf('JLOGGER:') + 'JLOGGER:'.length + 1))
    let result = functions.parseJammyLogger(line, client.channels.cache.get(channel));
    client.channels.cache.get(channel).send(result);  //hopefully will send the parsed message to the correct channel
    //somehow return $result into the Discord chat
  }
}
