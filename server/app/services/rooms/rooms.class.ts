import { PrismaService } from 'feathers-prisma'
import { Room as RoomModel, RoomStage } from '@prisma/client'
import { Id } from '@feathersjs/feathers'
import { Room, Vote, VoteFinalMap } from '~/shared/domain'

export class Rooms extends PrismaService<RoomModel> {
  private static mapStage(stage: RoomStage): Room['stage'] {
    switch (stage) {
      case RoomStage.Voting:
        return 'voting'
      case RoomStage.Idle:
        return 'idle'
      default:
        return 'finished'
    }
  }

  private static map(model: RoomModel): Room {
    return <Room>{
      id: model.id,
      name: model.name,
      stage: Rooms.mapStage(model.stage),
      ...(model.stage === RoomStage.Voting
        ? {
            playersVoted: model.votes.length,
          }
        : model.stage === RoomStage.Finished
        ? {
            votes: Rooms.mapVotes(model.votes as Vote[]),
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
      stage: RoomStage.Idle,
      name: data.name || 'Тут могло быть ваше название',
      votes: [],
    })

    return Rooms.map(created)
  }

  public async startVoting(id: Id): Promise<Room> {
    const patched = <RoomModel>await this.patch(id, {
      stage: RoomStage.Voting,
      votes: [],
    })

    return Rooms.map(patched)
  }

  public async stopVoting(id: Id): Promise<Room> {
    const patched = <RoomModel>await this.patch(id, {
      stage: RoomStage.Finished,
    })

    return Rooms.map(patched)
  }

  public async vote(id: Id, vote: Vote): Promise<Room> {
    const before = await this.get(id)
    const after = <RoomModel>await this.patch(id, {
      stage: RoomStage.Voting,
      votes: [...before.votes, vote],
    })

    return Rooms.map(after)
  }
}
