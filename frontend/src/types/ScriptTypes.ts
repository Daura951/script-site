import z from "zod";
import { User } from "./LoginTypes";
import PagedResponse from "./UtilTypes";

export const Tag = z.object({
  id: z.number(),
  tag: z.string(),
  createDate: z.coerce.date(),
  type: z.string(),
});
export type Tag = z.infer<typeof Tag>;

export const Script = z.object({
  id: z.number(),
  author: User,
  tags: z.array(Tag),
  title: z.string(),
  content: z.string(),
  createDate: z.coerce.date(),
  modifyDate: z.coerce.date(),
  approved: z.boolean(),
});
export type Script = z.infer<typeof Script>;

export const Tags = PagedResponse(Tag);
export type Tags = z.infer<typeof Tags>;

export const Scripts = PagedResponse(Script);
export type Scripts = z.infer<typeof Scripts>;
