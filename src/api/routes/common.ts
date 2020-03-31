import * as _ from 'lodash'
import { Router } from 'express'
import container from '../middlewares/container'
import { Result } from '../../types'

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
}
