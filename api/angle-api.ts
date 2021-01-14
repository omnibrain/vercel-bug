import { QueryFunction, QueryKey } from 'react-query/types/core/types'
import { useMutation, useQuery } from 'react-query'
import { TopicSummary } from './domain/topic-summary'
import { User } from './domain/user'
import { authFetch, fetch } from './functions'

interface VonageAccessToken {
  accessToken: string
  apiKey: string
  sessionId: string
  expiresAt: string
}

interface ConnectedUser {
  userId: string
  connectionId: string
  connectedAt: string
  displayName: string
  avatarUrl?: any
}

export interface RoomState {
  roomId: string
  sessionId: string
  createdAt: string
  users: ConnectedUser[]
}

async function fetchWaitlistUserRank(
  user: User | null | undefined
): Promise<number> {
  const { rank } = await authFetch<{ rank: number }>(
    '/getOrCreateWaitlistUser',
    user?.idToken
  )

  return rank
}

async function fetchTopicSummary(topicId: string): Promise<TopicSummary> {
  return fetch<TopicSummary>('/getTopicSummary', { id: topicId })
}

async function fetchVonageAccessToken(
  idToken: string | undefined,
  roomId: string
): Promise<VonageAccessToken> {
  return authFetch('/getVonageAccessToken', idToken, {
    roomId,
  })
}

async function fetchConversationRoomState(
  idToken: string | undefined,
  roomId: string
): Promise<RoomState> {
  return authFetch('/getConversationRoomState', idToken, {
    roomId,
  })
}

async function validateCode(
  user: User | null | undefined,
  inviteCode: string
): Promise<boolean> {
  try {
    // any error will be considered a failed validation
    await authFetch('/redeemInviteCode', user?.idToken, { inviteCode })
    return true
  } catch {
    return false
  }
}

export function topicSummaryQuery(
  topicId: string
): [QueryKey, QueryFunction<TopicSummary>] {
  return [['topicSummary', topicId], () => fetchTopicSummary(topicId)]
}

export function useTopicSummary(topicId: string) {
  return useQuery<TopicSummary>(...topicSummaryQuery(topicId), {
    retry: 2,
  })
}

export function useVonageAccessTokenQuery(
  idToken: string | undefined,
  conversationId: string
) {
  return useQuery<VonageAccessToken>(
    ['getVonageAccessToken', idToken, conversationId],
    () => fetchVonageAccessToken(idToken, conversationId),
    {
      retry: 2,
      enabled: !!idToken,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  )
}

export function useConversationRoomState(
  idToken: string | undefined,
  roomId: string,
  enabled: boolean
) {
  return useQuery<RoomState>(
    ['getConversationRoomState', idToken, roomId],
    () => fetchConversationRoomState(idToken, roomId),
    {
      retry: 2,
      enabled: !!idToken && enabled,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      cacheTime: 0,
    }
  )
}

export function useWaitlistUserQuery(user: User | null | undefined) {
  return useQuery<number>('waitlistUser', () => fetchWaitlistUserRank(user), {
    enabled: !!user && !user.unlocked,
  })
}

export function useRedeemInviteCodeMutation(user: User | null | undefined) {
  return useMutation((inviteCode: string) => validateCode(user, inviteCode))
}
