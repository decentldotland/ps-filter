import { readFilterContract } from "./arweave.js";
import { getPidData } from "./cache.js";
import base64url from "base64url";

export async function readAndEncode() {
  try {
    const feed0 = (await readFilterContract()).feed;
    const feed1 = await getFeed1(feed0);
    const feed2 = await getFeed2(feed1);
  
    return {
      loaded: base64url(JSON.stringify(feed2)), // post's TXID (data) is decoded
      raw: base64url(JSON.stringify(feed0)) // post content is encoded as Arweave TXID
    }
  } catch (error) {
    console.log(error);
  }
}

async function getFeed1(feed) {
  try {
    for (let thread of feed) {
      thread.pid = await getPidData(thread.pid);
    }

    return feed;
  } catch (error) {
    console.log(error);
  }
}

async function getFeed2(feed) {
  try {
    for (let thread of feed) {
      if (thread.replies.length > 0) {
        for (let reply of thread.replies) {
          reply.pid = await getPidData(reply.pid);
        }
      }
    }

    return feed;
  } catch (error) {
    console.log(error);
  }
}
