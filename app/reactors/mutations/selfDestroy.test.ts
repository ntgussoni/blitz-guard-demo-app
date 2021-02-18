import { AuthorizationError } from "blitz"
import db from "db"
import { getSession } from "test/utils"
import selfDestroy from "./selfDestroy"

beforeAll(async () => {
  await db.user.deleteMany({})
})

afterAll(async () => {
  await db.$disconnect()
})

describe("selfDestroy", () => {
  describe("when user is not authorized", () => {
    it("throws an AuhtorizationError", async () => {
      try {
        await selfDestroy(null, getSession())
        fail("This call should throw an exception")
      } catch (e) {
        let error = e as AuthorizationError
        expect(error.statusCode).toEqual(403)
        expect(error.name).toEqual("AuthorizationError")
      }
    })
  })
})
