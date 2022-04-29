import { Application } from '@feathersjs/feathers'
import { Services } from '../services'
import { Rooms } from './rooms.class'
import { roomsHooks } from '~/server/app/services/rooms/rooms.hooks'

declare module '../services' {
  interface ServiceTypes {
    [Services.Rooms]: Rooms
  }
}

export const configureRoomsService = (app: Application) => {
  app.use(Services.Rooms, new Rooms())
  app.services[Services.Rooms].hooks(roomsHooks)
}
