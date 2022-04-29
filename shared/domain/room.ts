import { VoteFinalMap } from './vote'

export type Room = {
  id: number
  name: string
} & RoomState

export type RoomState =
  | {
      /**
       * Комната только создана и в ней ничего не происходило
       */
      stage: 'idle'
    }
  | {
      /**
       * Комната находится в состоянии голосования
       */
      stage: 'voting'
      playersVoted: number
    }
  | {
      /**
       * Голосование завершено и доступны голоса
       */
      stage: 'finished'
      votes: VoteFinalMap
    }
