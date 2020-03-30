import { Router } from 'express'
import container from '../middlewares/container'
import { Result } from '../../types'

import bitconin from '../../services/bitconin'
const route = Router()

export default (app: Router) => {
  app.use('/', route)

  route.get('/', container(async (req): Promise<Result> => {
    return {
      httpCode: 200,
      message: 'hello World'
    }
  }))

  route.get('/blockchain', container(async (req): Promise<Result> => {
    return {
      httpCode: 200,
      data: bitconin,
    }
  }))

  route.post('/transaction', container(async (req): Promise<Result> => {
    const {
      amount,
      sender,
      recipient,
    } = req.body
    const blockIndex: number = bitconin.createNewTransaction(amount, sender, recipient)
    return {
      httpCode: 200,
      message: `Transaction will be added in block ${blockIndex}`,
      data: blockIndex,
    }
  }))

  route.get('/mine', container(async (req): Promise<Result> => {
    const lastBlock = bitconin.getLastBlcok()
    const previousBlockHash = lastBlock.hash
    const currentBlockData = {
      transactions: bitconin.pendingTransactions,
      index: lastBlock.index + 1
    }
    const nonce = bitconin.proofOfWerk(previousBlockHash, currentBlockData)
    const blockHash = bitconin.hashBlock(previousBlockHash, currentBlockData, nonce)
    
    const nodeAddress = 'temp'
    bitconin.createNewTransaction(12.5, "00", nodeAddress) 
    const newBlock = bitconin.createNewBlcok(nonce, previousBlockHash, blockHash)
    // TODO: get node address
    return {
      httpCode: 200,
      data: newBlock,
    }
  }))
}
