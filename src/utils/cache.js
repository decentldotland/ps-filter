import { readFilterContract, arweave } from "./arweave.js";
import { readAndEncode } from "./filter.js";
import { getLastInteraction } from "./getLastInteraction.js";
import NodeCache from "node-cache";
import base64url from "base64url";

const base64Cache = new NodeCache();

export async function cache() {
  const lastInteraction = (await getLastInteraction())[0]?.block;
  const currentBlock = (await arweave.blocks.getCurrent())?.height;

  // initialization
  if (!base64Cache.has("feed")) {
    const feed = await readAndEncode();
    base64Cache.set("raw", feed.raw);
    base64Cache.set("feed", feed.loaded);
    base64Cache.set("height", currentBlock);

    console.log(`STATE ALREADY CACHED - HEIGHT: ${base64Cache.get("height")}`);
  }

  // cache new interactions
  if (
    !base64Cache.get("height") ||
    base64Cache.get("height") < lastInteraction
  ) {
    const feed = await readAndEncode();
    base64Cache.set("raw", feed.raw);
    base64Cache.set("feed", feed.loaded);
    base64Cache.set("height", lastInteraction);

    console.log(`NEW STATE CACHED - HEIGHT: ${lastInteraction}`);
  }
}

export async function getPidData(pid) {
  try {
    // feed is passed by readAndEncode();
    if (base64Cache.has(pid)) {
      return base64Cache.get(pid);
    }
    // if not cached, cache it
    const contentData = await arweave.transactions.getData(pid, {
      decode: true,
      string: true,
    });
    base64Cache.set(pid, contentData);
    return base64Cache.get(pid);
  } catch (error) {
    console.log(error);
  }
}

export async function getFeed() {
  if (!base64Cache.has("feed")) {
    return "e30";
  }

  return base64Cache.get("feed");
}
