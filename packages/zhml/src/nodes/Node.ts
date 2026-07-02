import type NodeKind from "$/nodes/NodeKind.ts";

type RootNode = {
  kind: NodeKind.Root;
  children: Node[];
};

type TextNode = {
  kind: NodeKind.Text;
  value: string;
};

export type ZhNode = {
  kind: NodeKind.Zh;
  id: number | null;
  zh: string;
  py: string;
};

type TranslatedPhraseNode = {
  kind: NodeKind.TranslatedPhrase;
  id: number;
  value: string;
};

type BlockElementNode = {
  kind: NodeKind.BlockElement;
  localName: string;
  children: Node[];
};

type ExampleListNode = {
  kind: NodeKind.ExampleList;
  children: ExampleNode[];
};

export type ExampleNode = {
  kind: NodeKind.Example;
  zh: Node[];
  trl: Node[];
};

export type Node =
  | RootNode
  | TextNode
  | ZhNode
  | TranslatedPhraseNode
  | BlockElementNode
  | ExampleListNode
  | ExampleNode;
