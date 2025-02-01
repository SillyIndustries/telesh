import { createHash } from 'crypto';
import { InlineQueryContext } from '@mtcute/dispatcher';
import { BotInline } from '@mtcute/core';
import config from '../config.js';

interface Response {
  timeout: NodeJS.Timeout,
  resolve: (_: boolean) => void;
}

export async function onInlineQuery(ctx: InlineQueryContext) {
  const identifier = 'QUERY' + createHash('sha1').end(ctx.query).digest('hex');

  try {
    await ctx.answer([
      BotInline.voice(
        identifier,
        config.host + '/' + Buffer.from(ctx.query).toString('base64url') + '?' + Date.now(),
        {
          title: 'shat',
          message: {
            type: 'media',
            text: ctx.query
          }
        }
      )
    ], { cacheTime: 300 });
  } catch (err) {
    console.log(err);
  }
}