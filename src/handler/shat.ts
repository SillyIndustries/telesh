import Sh, { defaultModifiers } from 'sh';

import config from '../config.js';

const sh = new Sh.default({
  gitHubToken: config.github_token,
  modifiers: defaultModifiers
});

export async function getRepositories() {
  let merge = false;

  for (const configKey in config.sources) {
    const sourceConfig = config.sources[configKey as keyof typeof config.sources];
    const [repository, branch] = configKey.split('#');
    for (const base of sourceConfig.bases) {
      try {
        if (sourceConfig.useMsgPack)
          merge =
            (await sh.useSourcesFromGitHubMsgPack(repository, branch, base)) ||
            merge;
        else
          merge =
            (await sh.useSourcesFromGitHub(repository, branch, base)) || merge;
      } catch (err) {}
    }
  }

  if (merge) sh.mergeSources();
}

getRepositories();

export const interval = setInterval(getRepositories, 60 * 60 * 1000);
export default sh;