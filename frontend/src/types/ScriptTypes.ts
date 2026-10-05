import z, { number } from "zod";
import { User } from "./LoginTypes";
import PagedResponse from "./UtilTypes";

export const Tag = z.object({
  id: z.number(),
  tag: z.string(),
  createDate: z.coerce.date(),
  type: z.string(),
});
export type Tag = z.infer<typeof Tag>;

export const ScriptImage = z.object({
  id: z.number(),
  scriptOrder: z.number(),
  scriptId: z.number(),
  name: z.string(),
  cropX: z.number(),
  cropPositionX: z.number(),
  cropPositionY: z.number(),
  cropY: z.number(),
  cropWidth: z.number(),
  cropHeight: z.number(),
  zoom: z.number(),
});
export type ScriptImage = z.infer<typeof ScriptImage>;

export const Script = z.object({
  id: z.number(),
  author: User,
  tags: z.array(Tag),
  title: z.string(),
  content: z.string(),
  createDate: z.coerce.date(),
  modifyDate: z.coerce.date().nullable(),
  status: z.string(),
  assetId: z.string().nullable(),
  images: z.array(ScriptImage).optional(),
});
export type Script = z.infer<typeof Script>;

export const ScriptSubmission = z.object({
  title: z.string(),
  tags: z.array(z.number()),
  content: z.string(),
  scriptImages: z.array(ScriptImage).optional,
});
export type ScriptSubmission = z.infer<typeof ScriptSubmission>;

export const Tags = PagedResponse(Tag);
export type Tags = z.infer<typeof Tags>;

export const Scripts = PagedResponse(Script);
export type Scripts = z.infer<typeof Scripts>;

export const SearchDate = z.object({
  date: z.coerce.date().optional(),
  sort: z.string(),
});
export type SearchDate = z.infer<typeof SearchDate>;

export const ScriptSearch = z.object({
  scriptTitle: z.string(),
  tags: z.array(Tag).optional(),
  authors: z.array(User),
  createDate: SearchDate.nullable(),
  modifyDate: SearchDate.nullable(),
});
export type ScriptSearch = z.infer<typeof ScriptSearch>;

export const fileUpload = z
  .file()
  .max(5_000_000, "Uploaded files must be smaller than 5MB")
  .mime("application/pdf", "Uploaded files must be a PDF");

export const FileUploadRequest = z.object({
  title: z.string(),
  script: fileUpload,
  tags: z.array(Tag).optional(),
});
export type FileUploadRequest = z.infer<typeof FileUploadRequest>;
