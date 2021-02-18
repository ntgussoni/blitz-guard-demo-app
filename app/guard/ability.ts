import db from "db"
import { GuardBuilder, PrismaModelsType } from "@blitz-guard/core"
import { UpdateGenerationInputType } from "app/reactors/mutations/UpdateGenerationInputType"

type ExtendedResourceTypes = PrismaModelsType<typeof db>
type ExtendedAbilityTypes = "control" | "read_access_log" | "self_destroy"

const Guard = GuardBuilder<ExtendedResourceTypes, ExtendedAbilityTypes>(
  async (ctx, { can, cannot }) => {
    cannot("manage", "all")

    if (!ctx.session.isAuthorized()) return

    if (ctx.session.roles.includes("director")) {
      can("control", "reactor")
      can("read_access_log", "reactor")
      can("self_destroy", "reactor")
    } else if (ctx.session.roles.includes("technician")) {
      can(
        "control",
        "reactor",
        async ({ data }: UpdateGenerationInputType) => data.generationMw <= 1800
      )
      can("read_access_log", "reactor")
    } else if (ctx.session.roles.includes("secret-service")) {
      can("self_destroy", "reactor")
    }
  }
)

export default Guard
