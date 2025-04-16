import { Dispatcher, filters } from '@mtcute/dispatcher';

import { onInlineQuery, onNewMessage } from '../handler/index.js';

export const shatDp = Dispatcher.child();

shatDp.onError((error) => {
  console.log(error);
  return true;
});

shatDp.onInlineQuery(onInlineQuery);
shatDp.onNewMessage(
  filters.and(filters.text, filters.not(filters.command('start'))),
  onNewMessage
);