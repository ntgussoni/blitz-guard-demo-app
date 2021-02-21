import { changes } from "app/libs/paper-trail"
import { ModelNameType } from "app/libs/prisma-proxy"
import { Ctx } from "blitz"
import { PrismaProxyMiddleware } from "db/secureDb"

type ChangesType = { data: { model: ModelNameType; id: number; limit: number } }
export const middleware = [PrismaProxyMiddleware]

export default async function getChanges(
  { data: { model, id, limit = 1 } }: ChangesType,
  ctx: Ctx
) {
  return await changes(model, id, limit, ctx)
}
