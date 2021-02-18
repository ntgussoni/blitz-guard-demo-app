import { Ctx } from "blitz"
import db from "db"

const reactorId = 1

export default async function readData(_: null, ctx: Ctx) {
  ctx.session.authorize()

  const reactor = await db.reactor.findFirst({ where: { id: reactorId } })

  return reactor
}
