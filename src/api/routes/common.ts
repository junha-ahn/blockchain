import * as _ from 'lodash'
import axios from 'axios'
import { Router } from 'express'
import container from '../middlewares/container'
import { Result, TransactionData } from '../../types'

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
    const newTransaction = req.body.newTransaction
    const blockIndex:number = bitconin.addTransactionToPendingTransaction(newTransaction)
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
    const newTransaction = bitconin.createNewTransaction(12.5, "00", nodeAddress) 
    bitconin.addTransactionToPendingTransaction(newTransaction)
    const newBlock = bitconin.createNewBlcok(nonce, previousBlockHash, blockHash)
    // TODO: get node address
    return {
      httpCode: 200,
      data: newBlock,
    }
  }))

  route.post('/register-and-broadcast-node', container(async (req): Promise<Result> => {
    const {
      newNodeUrl
    } = req.body
    bitconin.pushNetworkNodes(newNodeUrl)
    const promises = []
    _.forEach(bitconin.networkNodes, url => {
      promises.push(axios.post(`${url}/register-node`, {
        newNodeUrl,
      }))
    })
    return Promise.all(promises).then(async data => {
      await axios.post(`${newNodeUrl}/register-node-bulk`, {
        allNetworkNodes: [...bitconin.networkNodes, bitconin.currentNodeUrl],
      })
      return {
        httpCode: 200,
        message: '성공',
      }
    })
  }))
  route.post('/register-node', container(async (req): Promise<Result> => {
    const {
      newNodeUrl
    } = req.body
    bitconin.pushNetworkNodes(newNodeUrl)
    return {
      httpCode: 200,
      message: '성공',
    }
  }))
  route.post('/register-node-bulk', container(async (req): Promise<Result> => {
    const {
      allNetworkNodes
    } = req.body
    console.log(allNetworkNodes)
    _.forEach(allNetworkNodes, url => {bitconin.pushNetworkNodes(url)})
    return {
      httpCode: 200,
      message: '성공',
    }
  }))

  
  route.post('/transaction/broadcast', container(async (req): Promise<Result> => {
    const {
      amount,
      sender,
      recipient,
    }: TransactionData = req.body
    const newTransaction = bitconin.createNewTransaction(amount, sender, recipient)
    bitconin.addTransactionToPendingTransaction(newTransaction)
    const promises = []
    _.forEach(bitconin.networkNodes, url => {
      promises.push(axios.post(`${url}/transaction`, {
        newTransaction,
      }))
    })
    return Promise.all(promises).then(data => {
      return {
        httpCode: 200,
        message: '성공',
      }
    })
  }))
}
