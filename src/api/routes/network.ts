import * as _ from 'lodash'
import axios from 'axios'
import { Router } from 'express'
import container from '../middlewares/container'
import { Result, TransactionData } from '../../types'

import bitcoin from '../../services/bitcoin'
const route = Router()

const requestAllNode = (promises) => Promise.all(promises).then((datas) => _.map(datas, ({data}) => data.data))
  
export default (app: Router) => {
  app.use('/', route)

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
    // const newTransaction = bitcoin.createNewTransaction(12.5, "00", nodeAddress) 
    // bitcoin.addTransactionToPendingTransaction(newTransaction)
    const newBlock = bitcoin.createNewBlcok(nonce, previousBlockHash, blockHash)
    // TODO: get node address
    await requestAllNode(_.map(bitcoin.networkNodes, url => (axios.post(`${url}/receive-new-block`, {
      newBlock,
    }))))

    await axios.post(`${bitcoin.currentNodeUrl}/transaction/broadcast`, {
      amount: 12.5,
      sender: "00",
      recipient: nodeAddress,
    })
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
    
    await requestAllNode(_.map(bitcoin.networkNodes, url => (
      axios.post(`${url}/register-node`, {
        newNodeUrl,
    }))))
    await axios.post(`${newNodeUrl}/register-node-bulk`, {
      allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl],
    })
    return {
      httpCode: 200,
      message: '성공',
    }
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
    await requestAllNode(_.map(bitcoin.networkNodes, url => (
      axios.post(`${url}/transaction`, {
        newTransaction,
    }))))
    return {
      httpCode: 200,
      message: '성공',
    }
  }))
  route.post('/receive-new-block', container(async (req): Promise<Result> => {
    const newBlock = req.body.newBlock
    const lastBlock = bitcoin.getLastBlcok()
    const correctHash = lastBlock.hash === newBlock.previousHash
    const correctIndex = lastBlock.index + 1 === newBlock.index
    if (!(correctHash && correctIndex)) {
      return {
        httpCode: 403,
        message: '실패',
      }
    }
    bitcoin.pushNewBlock(newBlock)
    return {
      httpCode: 200,
      message: '성공',
    }
  }))

  route.get('/consensus', container(async (req): Promise<Result> => {
    const blockchains = await requestAllNode(_.map(bitcoin.networkNodes, url => (
      axios.get(`${url}/blockchain`))))
    let maxChainLength = bitcoin.chain.length
    let newLongestChain = null
    let newPendingTransactions = null

    _.forEach(blockchains, blockchain => {
      if (blockchain.chain.length > maxChainLength) {
        maxChainLength = blockchain.chain.length
        newLongestChain = blockchain.chain
        newPendingTransactions = blockchain.pendingTransactions
      }
    })
    if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
      return {
        httpCode: 401,
        message: 'Current chain has not been replaced.',
        data: bitcoin.chain,
      }
    }
    bitcoin.chain = newLongestChain
    bitcoin.pendingTransactions = newPendingTransactions
    return {
      httpCode: 200,
      message: 'This chain has been replaced',
      data: bitcoin.chain,
    }
  }))
}
