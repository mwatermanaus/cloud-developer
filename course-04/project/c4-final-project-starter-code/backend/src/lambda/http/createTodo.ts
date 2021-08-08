import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
// import * as AWS  from 'aws-sdk'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
// import { TodoItem } from '../../models/TodoItem'

const logger = createLogger('createTodos')
// const docClient = new AWS.DynamoDB.DocumentClient()

// const todosTable = process.env.TODOS_TABLE
// const todoBucket = process.env.ATTACHMENTS_S3_BUCKET


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


  // TODO: Implement creating a new TODO item
 // const timestamp = new Date().toISOString()
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  logger.info('Creating new item ', newTodo )

//  const todoItem:TodoItem = 

  // await docClient.put({
  //   TableName: todosTable,
  //   Item: todoItem
  // }).promise()


  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}
