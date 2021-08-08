import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import { createLogger } from '../../utils/logger'

// const docClient = new AWS.DynamoDB.DocumentClient()
// const s3 = new AWS.S3({
//   signatureVersion: 'v4'
// })
const logger = createLogger('updateTodos')
// const todosTable = process.env.TODOS_TABLE
// const todoBucket = process.env.ATTACHMENTS_S3_BUCKET
// const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  logger.info('Updated the following request', updatedTodo)
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  return undefined
}
