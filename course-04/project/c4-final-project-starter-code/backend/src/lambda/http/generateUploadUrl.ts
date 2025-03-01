import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as middy from 'middy'

import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'
import { updateTodoUrl } from '../businessLogic/todoLogic'

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

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

  await updateTodoUrl(todoId, userId) 

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