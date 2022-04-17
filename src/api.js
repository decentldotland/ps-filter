import express from "express";
import base64url from "base64url";
import cors from "cors";
import { getFeed, cache } from "./utils/cache.js";
import { timeout } from "./utils/arweave.js";

const app = express();
const port = process.env.PORT || 7777;

app.use(
  cors({
    origin: "*",
  })
);

app.get("/feeds", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const encodedFeed = await getFeed();
  const jsonRes = JSON.parse(base64url.decode(encodedFeed));
  res.send(jsonRes);
});

app.listen(port, async () => {
  await polling();
  console.log(`listening at PORT:${port}`);
});

async function polling() {
  while (true) {
    try {
      await cache();
      await timeout();
    } catch (error) {
      console.log(error);
    }
  }
}
