import { TodoItem } from '../../models/TodoItem'
import { TodoDbAccess } from '../dataLayer/todoDbAccess'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoUpdate } from '../../models/TodoUpdate'
import { getUserId } from '../utils'

import { APIGatewayProxyEvent } from 'aws-lambda'
import * as uuid from 'uuid'

const todoDbAccess = new TodoDbAccess()

export async function getAllTodosForUser(event: APIGatewayProxyEvent): Promise<TodoItem[]> {
  const userId = getUserId(event)
  return todoDbAccess.getAllTodosForUser(userId)
}

export async function createTodoForUser(
        createTodoRequest: CreateTodoRequest,
        userId: string): Promise<TodoItem> {

    const todoId = uuid.v4()
    const timestamp = new Date().toISOString()

    const todoItem:TodoItem = {
        userId: userId,
        todoId: todoId,
        createdAt: timestamp,
        ...createTodoRequest,
        done: false
      }
    return await todoDbAccess.createNewTodo(todoItem)    
}

export async function updateTodoItem(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<string> {

    return await todoDbAccess.updateTodo(todoUpdate, todoId, userId)
}

export async function deleteTodoItem(todoId: string, userId: string): Promise<string> {
 
    return await todoDbAccess.deleteTodo(todoId, userId)
}

export async function updateTodoUrl(todoId: string, userId: string): Promise<string> {

    return await todoDbAccess.updateTodoUrl(todoId, userId)
}
