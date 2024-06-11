import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
const s3Client = new S3Client()

const todosTable = process.env.TODOS_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export async function generateImageUrl(todoId) {
  const validTodoId = await todoExists(todoId)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  if (!validTodoId) {
    return null
  }

  const imageId = uuidv4()

  const url = await getUploadUrl(imageId)
  
  return url
}

async function todoExists(todoId) {
  const result = await dynamoDbClient.get({
    TableName: todosTable,
    Key: {
      todoID: todoId
    }
  })

  console.log('Get todo: ', result)
  return !!result.Item
}

async function getUploadUrl(imageId) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: imageId
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })
  return url
}
