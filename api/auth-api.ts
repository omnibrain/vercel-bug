import { QueryFunction, QueryKey } from 'react-query/types/core/types'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { auth } from './auth'
import { User } from './domain/user'

enum Keys {
  CURRENT_USER = 'CURRENT_USER',
  SIGN_IN_WITH_LINK = 'SIGN_IN_WITH_LINK',
}

export function currentUserQuery(): [QueryKey, QueryFunction<User | null>] {
  return [Keys.CURRENT_USER, () => auth.getCurrentUser()]
}

export function useCurrentUserQuery() {
  return useQuery<User | null>(...currentUserQuery())
}

export function useSignInWithLinkQuery() {
  return useQuery<boolean>(
    [Keys.SIGN_IN_WITH_LINK],
    () => auth.signInWithLink(),
    {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )
}

export function useSendLoginLinkMutation() {
  return useMutation((email: string) => auth.signInWithEmail(email))
}

export function useSignOutMutation() {
  const queryClient = useQueryClient()
  return useMutation(() => auth.signOut(), {
    onMutate: () => {
      queryClient.setQueryData(Keys.CURRENT_USER, () => null)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(Keys.CURRENT_USER)
    },
  })
}
