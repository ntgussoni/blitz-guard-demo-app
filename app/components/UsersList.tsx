import { useQuery } from "blitz"
import { useMutation } from "blitz"
import { queryCache } from "react-query"

import getUsers from "app/users/queries/getUsers"
import impersonateUser from "app/auth/mutations/impersonateUser"

export function UsersList(props) {
  const [impersonateUserMutation, { isLoading }] = useMutation(impersonateUser)

  const [users] = useQuery(getUsers, null)

  const onImpersonateUser = async (userId) => {
    try {
      await impersonateUserMutation({ userId })
      queryCache.clear()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {users.map(({ id, name = "" }) => (
        <div className="panel relative flex-1 py-3 ">
          <div className="relative bg-primary-transparent border-primary border-2 mx-8 md:mx-0 shadow p-1">
            <div className="flex items-center space-x-5">
              <div className="  block pl-2 font-semibold  w-full self-start text-white">
                <h2 className="leading-relaxed">{name}</h2>
                <button
                  className="text-yellow-400"
                  disabled={isLoading}
                  onClick={() => onImpersonateUser(id)}
                >
                  Switch to User
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
