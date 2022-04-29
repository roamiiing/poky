import feathers from '@feathersjs/feathers'
import { Application, configureRoomsService } from './services'

const app: Application = feathers()

configureRoomsService(app)

export { app }
