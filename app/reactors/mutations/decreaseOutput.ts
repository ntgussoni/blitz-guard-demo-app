import { Ctx } from "blitz"
import db, { Reactor } from "db"

const reactorId = 1

export default async function decreaseGeneration(_: null, ctx: Ctx) {
  ctx.session.authorize()

  const { generationMw } = (await db.reactor.findFirst({ where: { id: reactorId } })) as Reactor

  const reactor = await db.reactor.update({
    where: { id: reactorId },
    data: { generationMw: Math.min(Math.max(generationMw - 100, 0), 2000) },
  })

  return reactor
}
