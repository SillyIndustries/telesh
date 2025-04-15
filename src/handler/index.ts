import { createHash } from 'crypto';
import { InlineQueryContext } from '@mtcute/dispatcher';
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

export async function onInlineQuery(ctx: InlineQueryContext) {
  try {
    if (!(await wait(ctx.user.id)))
      throw new Error();

    const identifier = 'shat_' + createHash('sha1').end(ctx.query).digest('hex');

    const chatsounds = sh.new(ctx.query);
    const buffer = await chatsounds.buffer({
      format: 'ogg',
      codec: 'libopus',
      audioChannels: 2,
      sampleRate: 48000
    });

    if (!buffer)
      throw new Error();

    const file = await ctx.client.uploadMedia({
      file: buffer,
      type: 'voice'
    });

    await ctx.answer([
      BotInline.voice(
        identifier,
        file.fileId,
        {
          title: ctx.query,
          message: {
            type: 'media',
            text: ctx.query
          }
        }
      )
    ], { cacheTime: 300 });
  } catch (err) {
    console.log(err);
    return await ctx.answer([]);
  }
}