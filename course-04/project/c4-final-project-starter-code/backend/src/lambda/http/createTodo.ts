import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { createTodoForUser } from '../businessLogic/todoLogic'

const logger = createLogger('createTodos')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // TODO: Implement creating a new TODO item
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  if (!newTodo.name){
    return {
      statusCode: 400,
      body: 'No todo item name entered.'
    } 
  }
  logger.info('Creating new item ', {message: newTodo + ' creation started'})

  const userId = getUserId(event)
  const todoItem = await createTodoForUser(newTodo, userId)

  return {
    statusCode: 201,
    body: JSON.stringify({"item": todoItem})
  }
})


handler
 .use(httpErrorHandler())
 .use(
     cors({
       credentials: true
  })
)