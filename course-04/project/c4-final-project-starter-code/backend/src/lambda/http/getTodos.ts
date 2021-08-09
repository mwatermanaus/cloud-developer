import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
// import * as AWS  from 'aws-sdk'
import * as middy from 'middy'

import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'

import { getAllTodosForUser } from '../businessLogic/todoLogic'

const logger = createLogger('getTodos')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info('Processing todo event', event)
  
  if (event.headers.Authorization.split(' ').length !== 2) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'User is not logged on!'
      })
    }
  }
  
  const userId = getUserId(event)
  const todoList = await getAllTodosForUser(userId)

  return  {
    statusCode: 200,
    body: JSON.stringify({
      "items": todoList
    })
  }
}
)


handler
 .use(httpErrorHandler())
 .use(
     cors({
       credentials: true
  })
)