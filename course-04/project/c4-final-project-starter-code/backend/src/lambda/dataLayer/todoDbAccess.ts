import * as AWS  from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { createLogger } from '../../utils/logger'
import { TodoItem } from '../../models/TodoItem'
import { TodoUpdate } from '../../models/TodoUpdate'

// const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('createTodos')

export class TodoDbAccess {

    constructor (
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly indexTable = process.env.TODOS_CREATED_AT_INDEX,
        private readonly todoBucket = process.env.ATTACHMENTS_S3_BUCKET
    ){}

    async getAllTodosForUser(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all todos')

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.indexTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
              ':userId': userId
            },
            ScanIndexForward: false
          }).promise()
        
          const items = result.Items
          return items as TodoItem[]
    }

    async createNewTodo(newTodo: TodoItem): Promise<TodoItem> {
        const todoItem:TodoItem = {
            ...newTodo,
            done: false
          }
        
          await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
          }).promise()
        
        return newTodo
    }

    async deleteTodo(todoId: string, userId: string): Promise<string> {
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
              userId: userId,
              todoId: todoId
            }
          }).promise()
        return ''
    }

    async updateTodo(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<string> {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
              userId: userId,
              todoId: todoId
            },
            UpdateExpression: 'set done = :done, dueDate = :dueDate',
            ExpressionAttributeValues: { 
              ":done": todoUpdate.done,
              ":dueDate": todoUpdate.dueDate
             }
          }).promise()
        return ''
    }

    async updateTodoUrl(todoId: string, userId: string): Promise<string> {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
              userId: userId,
              todoId: todoId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: { 
              ":attachmentUrl": `https://${this.todoBucket}.s3.amazonaws.com/${todoId}`
              
             }
        }).promise()
        
        return ''
    }
}

