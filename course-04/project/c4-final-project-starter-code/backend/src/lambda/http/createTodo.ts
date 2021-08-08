import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'

const logger = createLogger('createTodos')
const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE
//const todoBucket = process.env.ATTACHMENTS_S3_BUCKET


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // TODO: Implement creating a new TODO item
  const timestamp = new Date().toISOString()
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const todoId = uuid.v4()

  logger.info('Creating new item ', {message: newTodo + ' creation started as id ' + todoId})

  const userId = getUserId(event)


  const todoItem:TodoItem = {
    userId: userId,
    todoId: todoId,
    createdAt: timestamp,
    ...newTodo,
    done: false
  }

  await docClient.put({
    TableName: todosTable,
    Item: todoItem
  }).promise()


  return {
    statusCode: 201,
    body: JSON.stringify(todoItem)
  }
})


handler
 .use(httpErrorHandler())
 .use(
     cors({
       credentials: true
  })
)