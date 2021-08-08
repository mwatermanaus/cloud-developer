import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as middy from 'middy'

import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const todosTable = process.env.TODOS_TABLE

const todoBucket = process.env.ATTACHMENTS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler= middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const signedUrl = s3.getSignedUrl('putObject', {
    Bucket: todoBucket,
    Key: todoId,
    Expires: urlExpiration
  })

  await docClient.update({
    TableName: todosTable,
    Key: {
      userId: userId,
      todoId: todoId
    },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: { 
      ":attachmentUrl": `https://${todoBucket}.s3.amazonaws.com/${todoId}`
      
     }
  }).promise()

  return {    
    statusCode: 200,
    body: JSON.stringify({uploadUrl: signedUrl})
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