import { createClient } from 'postchain-client';

export async function sendTx(transaction) {
  const client = await createClient({
    nodeUrlPool: 'http://localhost:7740',
    blockchainIid: 0,
  });
  await client.sendTransaction(transaction);
}

export async function query(name, params) {
  const client = await createClient({
    nodeUrlPool: 'http://localhost:7740',
    blockchainIid: 0,
  });
  return client.query(name, params);
}
