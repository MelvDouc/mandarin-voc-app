import { XMLParser, XMLValidator } from "fast-xml-parser";

const TagNames = [
  "page",
  "structure",
  "main-trl",
  "content",
  "example-list",
  "item",
  "example",
  "hanzi",
  "trl",
  "trl-list"
] as const;

const commonOptions = {
  allowBooleanAttributes: true,
  unpairedTags: ["hanzi"],
};

const parser = new XMLParser({
  alwaysCreateTextNode: true,
  attributeNamePrefix: "",
  ignoreAttributes: false,
  preserveOrder: true,
  trimValues: false,
  ...commonOptions
});

export function parseXml(input: string): XmlNode[] {
  return parser.parse(input);
}

export function validateXml(input: string) {
  return XMLValidator.validate(input, commonOptions);
}

// ===== ===== ===== ===== =====
// TYPES
// ===== ===== ===== ===== =====

export type TagName = typeof TagNames[number];

type XmlElement<T extends TagName = TagName> =
  & {
    [K in T]: XmlNode[]
  }
  & {
    ":@"?: Record<string, string>;
  };

type XmlText = {
  "#text": string;
};

export type XmlNode<T extends TagName = TagName> = XmlElement<T> | XmlText;