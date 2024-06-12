import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class TodosAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE,
    createdAtIndex = process.env.TODOS_CREATED_AT_INDEX
  ) {
    this.documentClient = documentClient
    this.todosTable = todosTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
    this.createdAtIndex = createdAtIndex
  }

  async getTodosByUserId(userId) {
    console.log('Getting todos of ' + userId)

    const result = await this.dynamoDbClient.query({
      TableName: this.todosTable,
      IndexName: this.createdAtIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })

    return result.Items
  }

  async createTodo(todo) {
    console.log(`Creating a todo with id ${todo.todoId}`)

    await this.dynamoDbClient.put({
      TableName: this.todosTable,
      Item: todo
    })

    return todo
  }

  async deleteTodo(todo) {
    console.log(`Deleting a todo with id ${todo.todoId}`)

    return await this.dynamoDbClient.delete({
      TableName: this.todosTable,
      Key: {
        userId: todo.userId,
        todoId: todo.todoId
      },
    })
  }

  async updateTodo(todo) {
    console.log(`Updating a todo with id ${todo.todoId}`)

    return await this.dynamoDbClient.update({
      TableName: this.todosTable,
      Key: {
        userId: todo.userId,
        todoId: todo.todoId
      },
      ExpressionAttributeNames: {
        "#name":"name",
        "#dueDate":"dueDate",
        "#done":"done",
        },
      UpdateExpression: "set #name = :name, #dueDate = :dueDate, #done = :done",
      ExpressionAttributeValues: {
        ":name": todo.name,
        ":dueDate": todo.dueDate,
        ":done": todo.done
      },
      ReturnValues: "ALL_NEW",
    });
  }

  async updateAttachmentUrl(todo) {
    console.log(`Updating attachment Url with id ${todo.todoId}`)

    return await this.dynamoDbClient.update({
      TableName: this.todosTable,
      Key: {
        userId: todo.userId,
        todoId: todo.todoId
      },
      ExpressionAttributeNames: {
        "#attachmentUrl":"attachmentUrl"
        },
      UpdateExpression: "set #attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
        ":attachmentUrl": todo.attachmentUrl
      },
      ReturnValues: "ALL_NEW",
    });
  }
}
