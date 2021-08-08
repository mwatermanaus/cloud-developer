import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

// const docClient = new AWS.DynamoDB.DocumentClient()
// const s3 = new AWS.S3({
//   signatureVersion: 'v4'
// })

// const todosTable = process.env.TODOS_TABLE
// const todoBucket = process.env.ATTACHMENTS_S3_BUCKET
// const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return JSON.parse(todoId)
}
