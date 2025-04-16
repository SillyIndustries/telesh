import { createHash } from 'crypto';
import { filters, InlineQueryContext, MessageContext } from '@mtcute/dispatcher';
import { BotInline } from '@mtcute/core';

import sh from './shat.js';

interface Waiter {
  timeout: NodeJS.Timeout;
  resolve: (_: boolean) => void;
}

const TIMEOUT_MS = 1500;
const map: Map<number, Waiter> = new Map;

async function wait(id: number) {
  if (map.has(id)) {
    const timeout = map.get(id);
    clearTimeout(timeout?.timeout);
    timeout?.resolve(false);
  }

  return new Promise<boolean>((res) =>
    map.set(id, {
      timeout: setTimeout(() => res(true), TIMEOUT_MS),
      resolve: res
    })
  );
}

class Skip extends Error {}

export async function onInlineQuery(ctx: InlineQueryContext) {
  const input = ctx.query.replaceAll('—', '--');

  try {
    if (!(await wait(ctx.user.id)))
      throw new Skip;

    const identifier = 'shat_' + createHash('sha1').end(input).digest('hex');

    const chatsounds = sh.new(input);
    const buffer = await chatsounds.buffer({
      format: 'ogg',
      codec: 'libopus',
      audioChannels: 2,
      sampleRate: 48000
    });

    if (!buffer)
      throw new Skip;

    const file = await ctx.client.uploadMedia({
      file: buffer,
      type: 'voice'
    });

    await ctx.answer([
      BotInline.voice(
        identifier,
        file.fileId,
        {
          title: input,
          message: {
            type: 'media',
            text: input
          }
        }
      )
    ], { cacheTime: 300 });
  } catch (err) {
    if (!(err instanceof Skip))
      console.log(err);
    return await ctx.answer([]);
  }
}

type TextMessage = filters.Modify<MessageContext, {
  media: null;
  isService: false;
}>

export async function onNewMessage(msg: TextMessage) {
  const input = msg.text.replaceAll('—', '--');

  const chatsounds = sh.new(input);
  const buffer = await chatsounds.buffer({
    format: 'ogg',
    codec: 'libopus',
    audioChannels: 2,
    sampleRate: 48000
  });

  if (!buffer) {
    await msg.replyText('no output could be generated for this input...');
    return;
  }

  await msg.replyMedia({
    file: buffer,
    type: 'voice',
    caption: input,
  });
}