import * as sha256 from 'sha256'
import * as _ from 'lodash'
import { v1 as uuidv1 } from 'uuid';
import config from '../config'
// TODO: Blockchain Class Public/Static 구조 개선 고민
//
// - 테스트 생각
//    - 각 테스트 별 초기화가 필요함. beforeEach.. 등
//    - express api 내에서 인스턴스로 존재하는것이 아닌, static 존재?..
//
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
  public transactionId: string
  constructor(
    public amount:number,
    public sender: string,
    public recipient: string,
  ) {
    this.transactionId = uuidv1().split('-').join()
  }
}

export default class BlockChain {
  public chain: Block[] = []
  public pendingTransactions: Transaction[] = []
  public currentNodeUrl: string
  public networkNodes: string[] = []
  constructor() {
    this.currentNodeUrl = `http://localhost:${config.port}`
    this.createNewBlcok(100, '0', '0')
  }
  public pushNewBlock = (newBlock) => {
    this.pendingTransactions = []
    this.chain.push(newBlock)
  }
  public pushNetworkNodes = (newUrl: string) => {
    if (!_.some(this.networkNodes, url => url === newUrl) && this.currentNodeUrl != newUrl) {
      this.networkNodes.push(newUrl)
      return true
    }
    return false
  }

  public createNewBlcok = (nonce, previousBlockHash, hash) => {
    const newBlock = new Block(
      this.chain.length + 1,
      nonce,
      this.pendingTransactions,
      hash,
      previousBlockHash,
      Date.now()
    )
    this.pushNewBlock(newBlock)
    return newBlock
  }
  public getLastBlcok = (): Block => this.chain[this.chain.length - 1]
  public createNewTransaction = (amount: number, sender: string, recipient: string): Transaction => new Transaction(amount, sender, recipient)
  public addTransactionToPendingTransaction = (transaction: Transaction): number => {
    this.pendingTransactions.push(transaction)
    return this.getLastBlcok().index + 1
  }
  public hashBlock = (previousBlockHash, currentBlockData, nonce): string => sha256(previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData))
  public proofOfWerk = (previousBlockHash, currentBlockData) => {
    let nonce = 0
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    while (hash.substring(0, 4) !== '0000') {
      nonce++
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    }
    return nonce
  }
  public chainIsValid = (blockchain: BlockChain): boolean => {
    const vaildChain = _.every(blockchain, (currentBlock: Block, idx: number, list:BlockChain) => {
      if (idx === 0) return true // genesisBlock
      const prevBlock = list[idx - 1]
      const blockHash = this.hashBlock(prevBlock.hash, { transactions: currentBlock.transactions, index: currentBlock.index }, currentBlock.nonce)
      const correctHash = blockHash.substring(0, 4) === '0000'

      const correctPreviousBlockHash = currentBlock.previousHash === prevBlock.hash
      console.log(`${idx} :: ${correctHash} / ${correctPreviousBlockHash}`)
      return correctHash && correctPreviousBlockHash
    })
    const genesisBlock = blockchain[0]
    const correctGenesisBlock = genesisBlock.nonce === 100 && genesisBlock.previousHash === "0" && genesisBlock.hash === "0"
    return vaildChain && correctGenesisBlock
  }
  public getBlock = (blockHash) => _.find(this.chain, block => block.hash === blockHash)
  public getTransaction = (transactionId) => {
    const data = {
      transaction: null,
      blcok: null,
    }
    _.forEach(this.chain, block => 
      _.forEach(block.transactions, tr => {
        if (tr.transactionId === transactionId) {
          data.transaction = tr
          data.blcok = block
          return true
        }
    }))
    return data
  }
  public getAddressData = (address) => {
    const addressTransaction = []
    _.forEach(this.chain, block => 
      _.forEach(block.transactions, tr => {
        if (tr.recipient === address || tr.sender === address) addressTransaction.push(tr)
    }))
    const AddressBalance = _.reduce(addressTransaction, (acc, cur) => {
      cur.recipient === address ? acc += cur.amount : acc -= cur.amount
      return acc
    }, 0)
    return {
      addressTransaction,
      AddressBalance
    }
  }
}