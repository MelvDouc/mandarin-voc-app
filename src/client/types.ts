export type FlashKind = "success" | "error" | "info";

export interface FlashMessage {
  kind: FlashKind;
  message: string;
};

export type {
  Category,
  Entity,
  ResultTuple,
  Tag,
  Topic,
  User,
  WithoutId
} from "$/global-types.js";
