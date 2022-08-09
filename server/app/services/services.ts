import { Application as FeathersApp } from '@feathersjs/feathers'

export enum Services {
  Rooms = 'rooms',
}

export interface ServiceTypes {}

export type Application = FeathersApp<ServiceTypes>
