import { Application as FeathersApp } from '@feathersjs/feathers'

export enum Services {
  Rooms = 'rooms',
}

export interface ServiceTypes {}

export interface AppDeps {}

export type Application = FeathersApp<ServiceTypes> & Partial<AppDeps>
