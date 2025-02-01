import { TelegramClient } from '@mtcute/node';
import { Dispatcher } from '@mtcute/dispatcher';

import config from './config.js';

import { shatDp } from './dispatchers/shat.js';
import { startDp } from './dispatchers/start.js';

const tg = new TelegramClient({
  apiId: +config.api_id,
  apiHash: config.api_hash,
  storage: 'bot-data/session',
});

const dispatcher = Dispatcher.for(tg);
dispatcher.extend(shatDp);
dispatcher.extend(startDp);

export async function start() {
  const user = await tg.start({ botToken: config.bot_token });
  console.log('Logged in as', user.username);
}