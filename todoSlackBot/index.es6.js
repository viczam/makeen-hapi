'use strict';

import { RtmClient, MemoryDataStore, RTM_EVENTS, CLIENT_EVENTS } from '@slack/client';

const token = 'xoxb-141316592309-NYcqt4PndoZhPZtQuWw6DJRt';

const slackClient = new RtmClient(
  token, {
    logLevel: 'error',
    dataStore: new MemoryDataStore(),
    autoReconnect: true,
    autoMark: true,
  });

slackClient.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  const user = slackClient.dataStore.getUserById(slackClient.activeUserId);
  const team = slackClient.dataStore.getTeamById(slackClient.activeTeamId);

  console.log(`
    connected to ${team.name} as ${user.name}
  `);

  const joinedChannels = getChannels(slackClient.dataStore.channels);

  const allMembers = joinedChannels
    .map((channel) => getChannelMembers(channel, slackClient))
    .reduce((total, users) => total.concat(users), []);

  allMembers.forEach((member) => console.log(`member name ${member}`));
  console.log(slackClient.dataStore.getChannelByName('todo'));
  // slackClient.sendMessage(`Hi @all, don't mind me for now....`, slackClient.dataStore.getChannelByName('todo').id);
});

slackClient.on(RTM_EVENTS.MESSAGE, (message) => {
  const user = slackClient.dataStore.getUserById(message.user);
  if (user && user.is_bot) {
    return;
  }

  if (message.text) {
    let msg = message.text.toLowerCase();

    if (new RegExp(`todobot|${slackClient.activeUserId}`, 'gi').test(msg)) {
      const channel = slackClient.dataStore.getChannelById(message.channel);
      const toDoId = slackClient.dataStore.getChannelByName('todo').id;
      slackClient.sendMessage(`${user.name} just texted me "${message.text}" on ${channel ? `#${channel.name}` : 'DM!'}`, toDoId);
    }
  }
});

slackClient.start();


const getChannels = (allChannels) => {
  return Object.keys(allChannels).filter((id) => {
    console.log(`${allChannels[id].name} is available ${allChannels[id].is_member}`);
    return allChannels[id].is_member;
  }).map((id) => allChannels[id]);
};

const getChannelMembers = (channel, slack) => {
  channel
    .members.map((id) => slack.dataStore.getUserById(id))
    .filter((user) => !user.is_bot);
};


