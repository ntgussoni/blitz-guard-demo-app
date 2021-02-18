import { useQuery } from "blitz"
import getUsers from "app/users/queries/getUsers"
import { User } from "./User"

export function UsersList(props) {
  const [users] = useQuery(getUsers, null)

  return (
    <>
      {users.map((user) => (
        <User {...props} id={user.id} name={user.name || ""} role={user.role}></User>
      ))}
    </>
  )
}
