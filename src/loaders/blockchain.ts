import * as sha256 from 'sha256'
import * as _ from 'lodash'
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
  constructor(
    public amount:number,
    public sender: string,
    public recipient: string,
  ) {
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
  public createNewBlcok = (nonce, previousBlockHash, hash) => {
    const newBlock = new Block(
      this.chain.length + 1,
      nonce,
      this.pendingTransactions,
      hash,
      previousBlockHash,
      Date.now()
    )
    this.pendingTransactions = []
    this.chain.push(newBlock)
    return newBlock
  }
  public getLastBlcok = (): Block => this.chain[this.chain.length - 1]
  public createNewTransaction = (amount: number, sender: string, recipient: string): number => {
    const newTransaction = new Transaction(amount, sender, recipient)
    this.pendingTransactions.push(newTransaction)
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
  public pushNetworkNodes = (newUrl: string) => {
    if (!_.some(this.networkNodes, url => url === newUrl) && this.currentNodeUrl != newUrl) {
      this.networkNodes.push(newUrl)
      return true
    }
    return false
  }
}