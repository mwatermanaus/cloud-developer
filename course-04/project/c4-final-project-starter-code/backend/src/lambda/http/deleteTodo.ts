import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('createTodos')
const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  logger.info('Deletion request sent for ', event)
  
  // TODO: Remove a TODO item by id
  // Get userId for the key to delete the item
  const userId = getUserId(event)
  await docClient.delete({
    TableName: todosTable,
    Key: {
      userId: userId,
      todoId: todoId
    }
  }).promise()

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