import { Ctx } from "blitz"
import { HookType, HookFn, ActionType, ModelNameType } from "./prisma-proxy"
import jsonDiff from "json-diff"
const paperTrailHook: HookFn = async (modelName, action, ctx, args, result) => {
  const CRUDActions: ActionType[] = [
    "create",
    "delete",
    "deleteMany",
    "executeRaw",
    "update",
    "updateMany",
    "upsert",
    "aggregate",
  ]

  const excludedModels: ModelNameType[] = ["session", "changes"]
  const skipChanges =
    !modelName || excludedModels.includes(modelName) || !CRUDActions.includes(action)

  if (!skipChanges) {
    try {
      await ctx.db.changes.create({
        data: {
          action,
          change: JSON.stringify(result),
          modelId: result.id,
          modelType: modelName,
          updatedBy: { connect: { id: ctx.session.userId || undefined } },
        },
      })
    } catch (e) {
      console.error("The changes could not be saved", e)
    }
  }
}

export const changes = async (model: ModelNameType, id, limit: number = 1, ctx: Ctx) => {
  const changes = await ctx.db.changes.findMany({
    include: { updatedBy: { select: { name: true, id: true } } },
    where: { modelId: id, modelType: model },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
  })

  if (changes.length === 0) console.log(`No changes were found for ${model}:${id}`)

  const reversedChanges = changes.reverse()

  const processedChanges: (typeof changes[0] & { diff: string })[] = []

  reversedChanges.forEach((c, i) =>
    processedChanges.push({
      ...c,
      diff: jsonDiff.diffString(
        processedChanges[i - 1] ? JSON.parse(processedChanges[i - 1]?.change) : {},
        JSON.parse(c.change)
      ),
    })
  )
  processedChanges.shift()
  return processedChanges
}

export const hook: HookType = {
  all: {
    after: {
      all: paperTrailHook,
    },
  },
}
