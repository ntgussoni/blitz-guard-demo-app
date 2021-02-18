import { Ctx } from "blitz"
import db, { Reactor } from "db"

const reactorId = 1

async function selfDestroy(_: null, ctx: Ctx) {
  ctx.session.authorize()

  const { selfDestroy } = (await db.reactor.findFirst({ where: { id: reactorId } })) as Reactor

  const reactor = await db.reactor.update({
    where: { id: reactorId },
    data: { selfDestroy: !selfDestroy },
  })

  return reactor
}

export default selfDestroy
