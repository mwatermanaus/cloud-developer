import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { deleteTodoItem } from '../businessLogic/todoLogic'

const logger = createLogger('createTodos')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  logger.info('Deletion request sent for ', event)
  
  // TODO: Remove a TODO item by id

  const userId = getUserId(event)
  await deleteTodoItem(todoId, userId)

  return  {
    statusCode: 200,
    body: ''
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