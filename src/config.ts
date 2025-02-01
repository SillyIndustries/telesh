import { readFileSync } from 'fs';

interface SourceInfo {
  bases: string[];
  useMsgPack: boolean;
}

interface Config {
  bot_token: string;
  api_id: string;
  api_hash: string;
  port: number;
  host: string;

  github_token: string;

  sources: Record<string, SourceInfo>;
}

const config: Config = JSON.parse(readFileSync('./config.json').toString('utf-8'));
export default config;