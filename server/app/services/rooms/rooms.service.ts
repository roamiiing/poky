import { Application } from '@feathersjs/feathers'
import { Services } from '../services'
import { Rooms } from './rooms.class'
import { roomsHooks } from '~/server/app/services/rooms/rooms.hooks'
import { PrismaClient } from '@prisma/client'

declare module '../services' {
  interface ServiceTypes {
    [Services.Rooms]: Rooms
  }

  interface AppDeps {
    prismaClient: PrismaClient
  }
}

export const configureRoomsService = (
  app: Application & {
    prismaClient?: PrismaClient
  },
) => {
  app.use(
    Services.Rooms,
    new Rooms(
      {
        model: 'Room',
      },
      app.prismaClient,
    ),
  )
  app.services[Services.Rooms].hooks(roomsHooks)
}
