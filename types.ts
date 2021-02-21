import { DefaultCtx, SessionContext, DefaultPublicData } from "blitz"
import { User } from "db"
import db from "db"
declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    db: typeof db
    session: SessionContext
  }
  export interface PublicData extends DefaultPublicData {
    name: User["name"]
    userId: User["id"]
    impersonatingFromUserId?: number
  }
}
