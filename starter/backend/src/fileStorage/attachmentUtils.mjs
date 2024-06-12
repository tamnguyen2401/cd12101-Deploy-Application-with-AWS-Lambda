import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'
import { updateAttachmentUrl } from '../businessLogic/todos.mjs'

const s3Client = new S3Client()

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export async function generateImageUrl(todoId, userId) {
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const imageId = uuidv4()

  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`

  const result = await updateAttachmentUrl(todoId, userId, attachmentUrl)

  console.log('result: ', result)
  
  return await getUploadUrl(imageId)
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