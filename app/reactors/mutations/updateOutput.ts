import Guard from "app/guard/ability"
import { Ctx } from "blitz"
import db from "db"
import { UpdateGenerationInputType } from "./UpdateGenerationInputType"

const reactorId = 1

async function decreaseGeneration({ data: { generationMw } }: UpdateGenerationInputType, ctx: Ctx) {
  const reactor = await db.reactor.update({
    where: { id: reactorId },
    data: { generationMw: Math.min(Math.max(Number(generationMw), 0), 2000) },
  })

  return reactor
}

export default Guard.authorize("control", "reactor", decreaseGeneration)
