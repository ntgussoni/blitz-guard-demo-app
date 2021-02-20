import db from "./index"
import { SecurePassword } from "blitz"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seed = async () => {
  await db.reactor.deleteMany()
  await db.user.deleteMany()

  const hashedPassword = await SecurePassword.hash("password1234")

  console.log("--- Creating reactor ----")
  await db.reactor.create({ data: { generationMw: 1000 } })
  console.log("--- Creating users ----")
  await db.user.create({
    data: { email: "director@example.com", role: "director", name: "Director", hashedPassword },
  })
  await db.user.create({
    data: {
      email: "technician@example.com",
      role: "technician",
      name: "Technician",
      hashedPassword,
    },
  })
  await db.user.create({
    data: {
      email: "secret-service@example.com",
      role: "secret-service",
      name: "Secret service",
      hashedPassword,
    },
  })

  console.log("--- All done ----")
}

export default seed
