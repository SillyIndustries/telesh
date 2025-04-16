import { Dispatcher, filters } from '@mtcute/dispatcher';
import { md } from '@mtcute/node';

export const startDp = Dispatcher.child();

startDp.onNewMessage(filters.start, async (msg) => {
  const userInfo = msg.client.storage.self.getCached(true);
  if (!userInfo)
    return;
  const message = md(`
    👋 **welcome to telesh bot!** 🗣️📢

    this bot generates a voice message with sound effects (chatsounds) based on the text input that you give it.

    [to start using the bot, read this first to get the idea and the feel!!](https://foxtrot.litterbin.dev/docs/usage/soundeffects#syntax)

    📃 **[usage]**
    🔘 **inline query**: type @${userInfo.usernames[0]} followed by your text, then wait for the bot to respond with a result.
    🔘 **message**: message the bot directly with your text, and it will respond with a voice message.

    ⚠️ telesh does not have search yet, but you can use this website: https://cs.spiralp.xyz/
  `);

  msg.replyText(message, {
    disableWebPreview: true, // annoying
  });
});