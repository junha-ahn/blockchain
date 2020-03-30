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

  route.get('/bloc', container(async (req): Promise<Result> => {
    return {
      httpCode: 200,
      message: 'hello World'
    }
  }))
}
