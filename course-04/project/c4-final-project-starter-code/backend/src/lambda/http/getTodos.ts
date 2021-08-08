import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import * as AWS  from 'aws-sdk'
import * as middy from 'middy'

import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'

const logger = createLogger('getTodos')
const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE
const indexTable = process.env.TODOS_CREATED_AT_INDEX

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info('Processing todo event', event)
  const userId = getUserId(event)

  const todoList = await getTaskForUser(userId)

  logger.info('Returned this list from DB todo event' + JSON.stringify(todoList))

  return  {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      "items": todoList
    })
  }
}
)


async function getTaskForUser(userId: string) {
  const result = await docClient.query({
    TableName: todosTable,
    IndexName: indexTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false
  }).promise()

  return result.Items
}




handler
 .use(httpErrorHandler())
 .use(
     cors({
       credentials: true
  })
)