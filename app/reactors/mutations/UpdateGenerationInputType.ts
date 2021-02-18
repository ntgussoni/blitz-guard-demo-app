import { Prisma } from "db"

export type UpdateGenerationInputType = NonNullable<
  Required<{
    data: {
      generationMw: NonNullable<
        Required<Pick<Prisma.ReactorUpdateArgs, "data">["data"]["generationMw"]>
      >
    }
  }>
>
