import db from "db"

export default async function getUsers(_ = null) {
  const users = await db.user.findMany({
    select: { id: true, name: true, role: true },
  })

  return users
}
