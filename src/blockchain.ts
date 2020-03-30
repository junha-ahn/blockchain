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

export default class BlockChain {
  static chain: Block[] = []
  static newTransactions = []
  constructor() {}
  static createNewBlcok = (nonce, previousBlockHash, hash) => {
    const newBlock = new Block(
      BlockChain.chain.length + 1,
      nonce,
      BlockChain.newTransactions,
      hash,
      previousBlockHash,
      Date.now()
    )
    // BlockChain.newTransactions = [];
    BlockChain.chain.push(newBlock)
    return newBlock
  }
}