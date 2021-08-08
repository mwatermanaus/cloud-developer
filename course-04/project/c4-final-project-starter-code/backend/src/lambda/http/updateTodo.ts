import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()

const logger = createLogger('updateTodos')
const todosTable = process.env.TODOS_TABLE


export const handler = middy (async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId

  logger.info('Updated the following request' +  updatedTodo + ' ' + userId)
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

  await docClient.update({
    TableName: todosTable,
    Key: {
      userId: userId,
      todoId: todoId
    },
    UpdateExpression: 'set done = :done, dueDate = :dueDate',
    ExpressionAttributeValues: { 
      ":done": updatedTodo.done,
      ":dueDate": updatedTodo.dueDate
     }
  }).promise()

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