import type NodeKinds from "$/nodes/NodeKinds.ts";

export type TextNode = {
  kind: typeof NodeKinds.Text;
  value: string;
};

export type ZhNode = {
  kind: typeof NodeKinds.Zh;
  id: number | null;
  zh: string;
  py: string;
};

export type TranslatedPhraseNode = {
  kind: typeof NodeKinds.TranslatedPhrase;
  id: number;
  value: string;
};

export type BlockElementNode = {
  kind: typeof NodeKinds.BlockElement;
  localName: string;
  children: (TextNode | ZhNode)[];
};

export type ExampleListNode = {
  kind: typeof NodeKinds.ExampleList;
  children: ExampleNode[];
};

export type ExampleNode = {
  kind: typeof NodeKinds.Example;
  zh: (TextNode | ZhNode)[];
  trl: (TextNode | TranslatedPhraseNode)[];
};

export type Node =
  | TextNode
  | ZhNode
  | TranslatedPhraseNode
  | BlockElementNode
  | ExampleListNode
  | ExampleNode;
