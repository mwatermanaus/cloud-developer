import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { updateTodoItem } from '../businessLogic/todoLogic'

const logger = createLogger('updateTodos')


export const handler = middy (async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  logger.info('Updated the following request' +  updatedTodo + ' ' + userId)
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

  await updateTodoItem(updatedTodo, todoId, userId)

  return { statusCode: 200,
  body: ''}
}
)

handler
 .use(httpErrorHandler())
 .use(
     cors({
       credentials: true
  })
)