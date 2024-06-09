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
        todoId: todoId,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: timestamp
    })
}

export async function updateTodo(updateTodoRequest, userId) {
    const timestamp = new Date().toISOString()
    return await todosAccess.updateTodo({
        todoId: updateTodoRequest.todoId,
        userId: userId,
        name: updateTodoRequest.name,
        dueDate: timestamp,
        done: updateTodoRequest.done
    })
}

export async function deleteTodo(deleteTodoRequest, userId) {
    return await todosAccess.deleteTodo({
        todoId: deleteTodoRequest.todoId,
        userId: userId
    })
}

