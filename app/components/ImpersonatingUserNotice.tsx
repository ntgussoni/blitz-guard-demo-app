import { useSession } from "blitz"

export const ImpersonatingUserNotice = () => {
  const session = useSession()
  if (!session.impersonatingFromUserId) return null

  return (
    <div className="bg-yellow-400 px-2 py-1 text-center font-semibold">
      Currently impersonating user {session.name}{" "}
    </div>
  )
}
