import z from "zod";

export default function PagedResponse<T extends z.ZodType>(schema: T) {
  return z.object({
    content: z.array(schema),
    page: z.object({
      size: z.number(),
      number: z.number(),
      totalElements: z.number(),
      totalPages: z.number(),
    }),
  });
}
