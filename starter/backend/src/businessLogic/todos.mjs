import { v4 as uuidv4 } from 'uuid'
import { TodosAccess } from '../dataLayer/todoAccess.mjs'

const todosAccess = new TodosAccess()

export async function getTodosByUserId(userId) {
  return todosAccess.getTodosByUserId(userId)
}

export async function createTodo(createTodoRequest, userId) {
  const todoId = uuidv4()
  const timestamp = new Date().toISOString()

  return await todosAccess.createTodo({
    userId: userId,
    todoId: todoId,
    createdAt: timestamp,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: ''
  })
}

export async function updateTodo(updateTodoRequest, todoId, userId) {
  return await todosAccess.updateTodo({
    userId: userId,
    todoId: todoId,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  })
}

export async function deleteTodo(todoId, userId) {
  return await todosAccess.deleteTodo({
    userId: userId,
    todoId: todoId
  })
}

export async function updateAttachmentUrl(todoId, userId, attachmentUrl) {
  return await todosAccess.updateAttachmentUrl({
    userId: userId,
    todoId: todoId,
    attachmentUrl: attachmentUrl
  })
}

