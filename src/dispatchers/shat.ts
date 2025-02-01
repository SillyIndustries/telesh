import { Dispatcher } from '@mtcute/dispatcher';

import { onInlineQuery } from '../handler/index.js';

export const shatDp = Dispatcher.child();

shatDp.onError((error) => {
  console.log(error);
  return true;
});

shatDp.onInlineQuery(onInlineQuery);