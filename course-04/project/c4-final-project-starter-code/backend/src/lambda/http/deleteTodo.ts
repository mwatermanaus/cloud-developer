import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('createTodos')
const docClient = new AWS.DynamoDB.DocumentClient()
// const s3 = new AWS.S3({
//    signatureVersion: 'v4'
// })

const todosTable = process.env.TODOS_TABLE
// const indexTable = process.env.TODOS_CREATED_AT_INDEX
// const todoBucket = process.env.ATTACHMENTS_S3_BUCKET
// const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  logger.info('Deletion request sent for ', event)
  // TODO: Remove a TODO item by id

  const userId = getUserId(event)
  await docClient.delete({
    TableName: todosTable,
    Key: {
      userId: userId,
      todoId: todoId
    }
  }).promise()

  return  {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: 'Deleted the following ' + todoId
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