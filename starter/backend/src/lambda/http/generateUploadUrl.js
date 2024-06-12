import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { generateImageUrl } from '../../fileStorage/attachmentUtils.mjs'
import { getUserId } from '../utils.mjs'
import { updateAttachmentUrl } from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Caller event', event)
    const todoId = event.pathParameters.todoId
  
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const userId = getUserId(event)

    const url = await generateImageUrl(todoId, userId)

    console.log('Caller event', url)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credencials': true
      },
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  })
