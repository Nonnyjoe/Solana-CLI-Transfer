// Import Solana web3 functinalities
const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");

// Making a keypair and getting the private key
const newPair = Keypair.generate();
console.log(newPair);

// paste your secret that is logged here
const DEMO_FROM_SECRET_KEY = new Uint8Array(
  // paste your secret key array here
  [
    160, 20, 189, 212, 129, 188, 171, 124, 20, 179, 80, 27, 166, 17, 179, 198,
    234, 36, 113, 87, 0, 46, 186, 250, 152, 137, 244, 15, 86, 127, 77, 97, 170,
    44, 57, 126, 115, 253, 11, 60, 90, 36, 135, 177, 185, 231, 46, 155, 62, 164,
    128, 225, 101, 79, 69, 101, 154, 24, 58, 214, 219, 238, 149, 86,
  ]
);

const transferSol = async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Get Keypair from Secret Key
  var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);
  // Generate another Keypair (account we'll be sending to)
  //   const to = Keypair.generate();
  const to = new PublicKey("76ezsdsdBK8PB5gBoM3NPUwqFqg1yWNwZLsQYEeffZ");
  console.log(to);
  console.log("from public key");
  console.log(from.publicKey);
  console.log("from secret key");
  console.log(from.secretKey);
  // Aidrop 2 SOL to Sender wallet
  console.log("Airdopping some SOL to Sender wallet!");
  const fromAirDropSignature = await connection.requestAirdrop(
    new PublicKey(from.publicKey),
    2 * LAMPORTS_PER_SOL
  );

  // Latest blockhash (unique identifer of the block) of the cluster
  let latestBlockHash = await connection.getLatestBlockhash();

  // Confirm transaction using the last valid block height (refers to its time)
  // to check for transaction expiration
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: fromAirDropSignature,
  });

  console.log("Airdrop completed for the Sender account");

  const senderBalance = await connection.getBalance(from.publicKey);
  console.log(
    `Wallet balance: ${parseInt(senderBalance) / LAMPORTS_PER_SOL} SOL`
  );

  const halfOfBalance = parseInt(senderBalance) / 2 - 0.5;

  console.log(halfOfBalance);

  // Send money from "from" wallet and into "to" wallet
  var transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to,
      lamports: halfOfBalance,
    })
  );
  console.log("passedd");

  // Sign transaction
  var signature = await sendAndConfirmTransaction(connection, transaction, [
    from,
  ]);
  console.log("Signature is", signature);
  console.log("passedd2222");

  const senderBalanceAfter = await connection.getBalance(from.publicKey);
  console.log(
    `Wallet balance: ${parseInt(senderBalanceAfter) / LAMPORTS_PER_SOL} SOL`
  );
};

transferSol();
