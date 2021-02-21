import proxiedDb from "app/libs/prisma-proxy"
import { hook as paperTrailHook } from "app/libs/paper-trail"

export const PrismaProxyMiddleware = async (req, res, next) => {
  res.blitzCtx.db = proxiedDb(res.blitzCtx, res.args, {
    reactor: {
      before: {
        update: async (modelName, action, ctx, args) =>
          console.log(`USER ID ${ctx.session.userId}: BEFORE UPDATE HOOK `),
      },
      after: {
        update: async (modelName, action, ctx, args) =>
          console.log(`USER ID ${ctx.session.userId}: AFTER UPDATE HOOK`),
      },
    },
    ...paperTrailHook,
  })
  await next()
}
