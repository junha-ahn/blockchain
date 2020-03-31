import * as _ from 'lodash'
import axios from 'axios'
import { Router } from 'express'
import container from '../middlewares/container'
import { Result, TransactionData } from '../../types'

import bitcoin from '../../services/bitcoin'
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
      data: bitcoin,
    }
  }))
  route.post('/transaction', container(async (req): Promise<Result> => {
    const newTransaction = req.body.newTransaction
    const blockIndex:number = bitcoin.addTransactionToPendingTransaction(newTransaction)
    return {
      httpCode: 200,
      message: `Transaction will be added in block ${blockIndex}`,
      data: blockIndex,
    }
  }))

  route.get('/mine', container(async (req): Promise<Result> => {
    const lastBlock = bitcoin.getLastBlcok()
    const previousBlockHash = lastBlock.hash
    const currentBlockData = {
      transactions: bitcoin.pendingTransactions,
      index: lastBlock.index + 1
    }
    const nonce = bitcoin.proofOfWerk(previousBlockHash, currentBlockData)
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce)
    
    const nodeAddress = 'temp'
    const newTransaction = bitcoin.createNewTransaction(12.5, "00", nodeAddress) 
    bitcoin.addTransactionToPendingTransaction(newTransaction)
    const newBlock = bitcoin.createNewBlcok(nonce, previousBlockHash, blockHash)
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
    bitcoin.pushNetworkNodes(newNodeUrl)
    const promises = []
    _.forEach(bitcoin.networkNodes, url => {
      promises.push(axios.post(`${url}/register-node`, {
        newNodeUrl,
      }))
    })
    return Promise.all(promises).then(async data => {
      await axios.post(`${newNodeUrl}/register-node-bulk`, {
        allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl],
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
    bitcoin.pushNetworkNodes(newNodeUrl)
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
    _.forEach(allNetworkNodes, url => {bitcoin.pushNetworkNodes(url)})
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
    const newTransaction = bitcoin.createNewTransaction(amount, sender, recipient)
    bitcoin.addTransactionToPendingTransaction(newTransaction)
    const promises = []
    _.forEach(bitcoin.networkNodes, url => {
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
