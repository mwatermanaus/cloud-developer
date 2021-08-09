import { TodoItem } from '../../models/TodoItem'
import { TodoDbAccess } from '../dataLayer/todoDbAccess'


const todoDbAccess = new TodoDbAccess()

export async function getAllTodosForUser(userId: string): Promise<TodoItem[]> {
  return todoDbAccess.getAllTodosForUser(userId)
}
