import { GuardBuilder } from "@blitz-guard/core"
import { UpdateGenerationInputType } from "app/reactors/mutations/UpdateGenerationInputType"

type ExtendedResourceTypes = "reactor"
type ExtendedAbilityTypes = "control" | "read_access_logs" | "self_destroy"

const Guard = GuardBuilder<ExtendedResourceTypes, ExtendedAbilityTypes>(
  async (ctx, { can, cannot }) => {
    cannot("manage", "all")

    if (!ctx.session.isAuthorized()) return

    if (ctx.session.roles.includes("director")) {
      can("control", "reactor")
      can("read_access_logs", "reactor")
      can("self_destroy", "reactor")
    } else if (ctx.session.roles.includes("technician")) {
      can(
        "control",
        "reactor",
        async ({ data: { generationMw } }: UpdateGenerationInputType) => generationMw <= 1800
      )
      can("read_access_logs", "reactor")
    } else if (ctx.session.roles.includes("secret-service")) {
      can("self_destroy", "reactor")
    }
  }
)

export default Guard
