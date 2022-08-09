import { Service } from 'feathers-memory'
import { RoomModel } from '~/server/app/models'
import { Id } from '@feathersjs/feathers'
import { Room, Vote, VoteFinalMap } from '~/shared/domain'

export class Rooms extends Service<RoomModel> {
  private static map(model: RoomModel): Room {
    return <Room>{
      id: model.id,
      name: model.name,
      stage: model.stage,
      ...(model.stage === 'voting'
        ? {
            playersVoted: model.votes.length,
          }
        : model.stage === 'finished'
        ? {
            votes: Rooms.mapVotes(model.votes),
          }
        : {}),
    }
  }

  private static mapVotes(votes: Vote[]): VoteFinalMap {
    return [...votes].sort().reduce((acc, vote) => {
      acc[vote] = acc[vote] ? acc[vote] + 1 : 1
      return acc
    }, <VoteFinalMap>{})
  }

  public async listRooms(): Promise<Pick<Room, 'id' | 'name'>[]> {
    const rooms = <RoomModel[]>await this.find()

    return rooms.map(({ id, name }) => ({ id, name }))
  }

  public async getState(id: Id): Promise<Room> {
    const room = await this.get(id)

    return Rooms.map(room)
  }

  public async deleteRoom(id: Id): Promise<boolean> {
    await this.remove(id)

    return true
  }

  public async createRoom(data: Pick<RoomModel, 'name'>): Promise<Room> {
    const created = <RoomModel>await this.create({
      stage: 'idle',
      name: data.name || 'Тут могло быть ваше название',
      votes: [],
    })

    return Rooms.map(created)
  }

  public async startVoting(id: Id): Promise<Room> {
    const patched = <RoomModel>await this.patch(id, {
      stage: 'voting',
      votes: [],
    })

    return Rooms.map(patched)
  }

  public async stopVoting(id: Id): Promise<Room> {
    const patched = <RoomModel>await this.patch(id as string, {
      stage: 'finished',
    })

    return Rooms.map(patched)
  }

  public async vote(id: Id, vote: Vote): Promise<Room> {
    const before = await this.get(id)
    const after = <RoomModel>await this.patch(id as string, {
      stage: 'voting',
      votes: [...before.votes, vote],
    })

    return Rooms.map(after)
  }
}
