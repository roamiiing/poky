import { Vote } from '~/shared/domain'

export type RoomModel = {
  id: number
  name: string
  stage: 'idle' | 'voting' | 'finished'
  votes: Vote[]
}
