import { Ctx } from "blitz"
import db from "db"
import * as z from "zod"

export const ImpersonateUserInput = z.object({
  userId: z.number(),
})
export type ImpersonateUserInputType = z.infer<typeof ImpersonateUserInput>

export default async function impersonateUser(input: ImpersonateUserInputType, ctx: Ctx) {
  ctx.session.authorize()
  const { userId } = ImpersonateUserInput.parse(input)

  const user = await db.user.findFirst({ where: { id: userId } })
  if (!user) return null

  await ctx.session.create({
    name: user.name,
    userId: user.id,
    roles: [user.role],
    impersonatingFromUserId: ctx.session.userId,
  })

  return user
}
