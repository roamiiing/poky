import { HooksObject } from '@feathersjs/feathers'
import { RoomModel } from '~/server/app/models'

export const roomsHooks: HooksObject<RoomModel> = {
  after: {},
  before: {},
  error: {},
  finally: {},
}
