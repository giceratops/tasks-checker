import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  findByMonth: publicProcedure
    .input(z.object({
      name: z.string(),
      month: z.string(),
      key: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const r = await ctx.db.example.findFirst({
        select: {
          value: true
        },
        where: {
          name: input.name,
          month: input.month,
          key: input.key
        }
      })
      return r?.value ?? 0;
    }),
  setByMonth: publicProcedure.input(z.object({
    name: z.string(),
    month: z.string(),
    key: z.string(),
    value: z.number(),
  }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.example.upsert({
        where: {
          name_month_key: {
            name: input.name,
            month: input.month,
            key: input.key,
          }
        },
        update: {
          value: input.value,
        },
        create: {
          name: input.name,
          month: input.month,
          key: input.key,
          value: input.value
        }
      })

    }),
});
