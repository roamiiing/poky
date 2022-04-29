export const POSSIBLE_VOTES = [1, 2, 3, 5, 8, 13, 21, 34] as const

export type Vote = typeof POSSIBLE_VOTES[number]

export type VoteFinalMap = Record<Vote, number>
