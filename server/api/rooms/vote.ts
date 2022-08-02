import { defineEventHandler, sendError, useBody } from 'h3'
import { app } from '~/server/app'
import { Services } from '~/server/app/services'
import { Vote } from '~/shared/domain'
import { Id } from '@feathersjs/feathers'

export default defineEventHandler(async event => {
  try {
    const { id, vote } = await useBody(event)

    return app.services[Services.Rooms].vote(
      <Id>parseInt(id as string),
      <Vote>parseInt(vote as string),
    )
  } catch (e) {
    return sendError(event, e)
  }
})
