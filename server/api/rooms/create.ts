import { defineEventHandler, sendError, useBody } from 'h3'
import { app } from '~/server/app'
import { Services } from '~/server/app/services'

export default defineEventHandler(async event => {
  try {
    const data = await useBody(event)
    return app.services[Services.Rooms].createRoom(data)
  } catch (e) {
    return sendError(event, e)
  }
})
