import Guard from "app/guard/ability"
import { Ctx } from "blitz"
import { PrismaProxyMiddleware } from "db/secureDb"
import { UpdateGenerationInputType } from "./UpdateGenerationInputType"

const reactorId = 2
export const middleware = [PrismaProxyMiddleware]
async function decreaseGeneration({ data: { generationMw } }: UpdateGenerationInputType, ctx: Ctx) {
  const reactor = await ctx.db.reactor.update({
    where: { id: reactorId },
    data: { generationMw: Math.min(Math.max(Number(generationMw), 0), 2000) },
  })

  return reactor
}

export default Guard.authorize("control", "reactor", decreaseGeneration)
