import { defineEventHandler, sendError } from 'h3'
import { app } from '~/server/app'
import { Services } from '~/server/app/services'

export default defineEventHandler(async event => {
  try {
    return app.services[Services.Rooms].listRooms()
  } catch (e) {
    return sendError(event, e)
  }
})
