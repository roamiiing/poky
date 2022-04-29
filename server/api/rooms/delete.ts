import { defineEventHandler, sendError, useQuery } from 'h3'
import { app } from '~/server/app'
import { Services } from '~/server/app/services'
import { Id } from '@feathersjs/feathers'

export default defineEventHandler(async event => {
  try {
    const { id } = await useQuery(event)
    return app.services[Services.Rooms].deleteRoom(<Id>id)
  } catch (e) {
    return sendError(event, e)
  }
})
