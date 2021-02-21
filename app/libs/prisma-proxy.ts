import { Ctx } from "blitz"
import db, { Prisma } from "db"

export type ModelNameType = Lowercase<Prisma.ModelName> | "all"
export type ActionType = Prisma.PrismaAction | "all"
export type HookFn = (
  modelName: ModelNameType,
  action: ActionType,
  ctx: Ctx,
  args: any,
  result?: any
) => Promise<void>

type HookSigType = {
  before?: { [key in ActionType]?: HookFn }
  after?: { [key in ActionType]?: HookFn }
}
export type HookType = { [key in ModelNameType]?: HookSigType }

const setupBeforeHook = async (
  hooks: HookType,
  ctx: Ctx,
  methodArgs: any,
  modelName: ModelNameType,
  action: ActionType
) => {
  for await (let model of [modelName, "all"]) {
    for await (let act of [action, "all"]) {
      await hooks?.[model]?.["before"]?.[act]?.(modelName, action, ctx, methodArgs)
    }
  }
}

const setupAfterHook = async (
  hooks: HookType,
  ctx: Ctx,
  methodArgs: any,
  modelName: ModelNameType,
  action: ActionType,
  result?: any
) => {
  for await (let model of [modelName, "all"]) {
    for await (let act of [action, "all"]) {
      await hooks?.[model]?.["after"]?.[act]?.(modelName, action, ctx, methodArgs, result)
    }
  }
}

const proxyHandler = (ctx, args, parentKey: unknown = null, hooks: HookType) => ({
  get: function (target, key, receiver) {
    // console.log("PROXY: ", target, key)
    const origMethod = target[key]

    if (typeof origMethod === "object" && origMethod !== null) {
      return new Proxy(origMethod, proxyHandler(ctx, args, key, hooks))
    }

    if (typeof origMethod === "function") {
      // const actions: Prisma.PrismaAction[] = CanCanPrismaActions.alternatives.map((i) => i.value)

      // if (actions.includes(key)) {
      return async (methodArgs) => {
        // console.log("TARGET", parentKey, key)
        const modelName = parentKey as Lowercase<Prisma.ModelName>
        const action = key as Prisma.PrismaAction
        await setupBeforeHook(hooks, ctx, methodArgs, modelName, action)
        const result = await Reflect.get(target, key, receiver)(methodArgs)
        await setupAfterHook(hooks, ctx, methodArgs, modelName, action, result)
        return result
      }
      // }
    }

    if (key === "then") {
      return (fn) => new Proxy(target.then(fn), proxyHandler(ctx, args, parentKey, hooks))
    }

    if (key === "finally" || key === "catch") {
      return (fn) => new Proxy(origMethod(fn), proxyHandler(ctx, args, parentKey, hooks))
    }

    return Reflect.get(target, key, receiver)
  },
})

const proxiedDB = (ctx, args, hooks: HookType = {}) =>
  new Proxy<typeof db>(db, proxyHandler(ctx, args, null, hooks))
export default proxiedDB
