import sha256 from 'sha256'
class Block {
  constructor(
    public index:number,
    public nonce: string,
    public transactions: any,
    public hash: string,
    public previousHash: string,
    public timestamp: number
  ) {
  }
}
class Transaction {
  constructor(
    public amount:number,
    public sender: string,
    public recipient: string,
  ) {
  }
}

export default class BlockChain {
  static chain: Block[] = []
  static pendingTransactions: Transaction[] = []
  constructor() {}
  static createNewBlcok = (nonce, previousBlockHash, hash) => {
    const newBlock = new Block(
      BlockChain.chain.length + 1,
      nonce,
      BlockChain.pendingTransactions,
      hash,
      previousBlockHash,
      Date.now()
    )
    BlockChain.pendingTransactions = [];
    BlockChain.chain.push(newBlock)
    return newBlock
  }
  static getLastBlcok = (): Block => BlockChain.chain[BlockChain.chain.length - 1]
  static createNewTransaction = (amount: number, sender: string, recipient: string): number => {
    const newTransaction = new Transaction(amount, sender, recipient)
    BlockChain.pendingTransactions.push(newTransaction)
    return BlockChain.getLastBlcok().index + 1
  }
  static hashBlock = (previousBlockHash, currentBlockData, nonce): string => sha256(previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData))
}