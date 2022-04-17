import axios from "axios";
import { FILTER_SWC_ADDRESS } from "./constants.js";
import { arweave } from "./arweave.js";

const gqlQuery = {
  query: `query {
  transactions(
    tags: [
        { name: "App-Name", values: "SmartWeaveAction"},
        { name: "Contract", values: "${FILTER_SWC_ADDRESS}"}
        ]
    first: 1
  ) {
    edges {
      node {
        id
        owner { address }
        block { height }

      }
    }
  }
}`,
};

async function gqlTemplate(query) {
  const response = await axios.post("https://arweave.net/graphql", query, {
    headers: { "Content-Type": "application/json" },
  });

  const transactionIds = [];

  const res_arr = response.data.data.transactions.edges;

  for (let element of res_arr) {
    const tx = element["node"];
    const txExistence = transactionIds.find((txObj) => txObj.id === tx.id);

    if (!txExistence) {
      transactionIds.push({
        id: tx.id,
        owner: tx.owner.address,
        block: tx.block ? tx.block.height : void 0,
      });
    }
  }

  return transactionIds;
}

export async function getLastInteraction() {
  try {
    const re = await gqlTemplate(gqlQuery);
    return re;
  } catch (error) {
    console.log(error);
  }
}
