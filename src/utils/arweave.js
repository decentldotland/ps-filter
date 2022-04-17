import Arweave from "arweave";
import { SmartWeaveNodeFactory } from "redstone-smartweave";
import { FILTER_SWC_ADDRESS, BLOCK_SLEEPING_TIMEOUT } from "./constants.js";

export const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false,
});

const smartweave = SmartWeaveNodeFactory.memCached(arweave);

export async function readFilterContract() {
  try {
    const contract = smartweave.contract(FILTER_SWC_ADDRESS);
    const { state, validity } = await contract.readState();

    return state;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function timeout() {
  // a block is ~ 2 min
  const ms = BLOCK_SLEEPING_TIMEOUT * 2 * 60 * 1e3;
  console.log(
    `\nsleeping for ${BLOCK_SLEEPING_TIMEOUT} network blocks or ${ms} ms\n`
  );
  return new Promise((resolve) => setTimeout(resolve, ms));
}
