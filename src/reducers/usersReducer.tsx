import { UnknownAction } from 'redux'

interface UsersState {
  value: number
}

const initialState: UsersState = {
  value: 0
}

export default function usersReducer(
  state = initialState,
  action: UnknownAction
) {
  // logic here
  return state;
}