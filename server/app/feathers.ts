import feathers from '@feathersjs/feathers'
import { PrismaClient } from '@prisma/client'
import { Application, configureRoomsService } from './services'

const app: Application = feathers()

app.prismaClient = new PrismaClient()

configureRoomsService(app)

export { app }
