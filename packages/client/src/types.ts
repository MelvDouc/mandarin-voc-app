import {
  type BlockElementNode as ZhmlBlockElementNode,
  type ExampleListNode as ZhmlExampleListNode,
  type ExampleNode as ZhmlExampleNode,
  type InlineElementNode as ZhmlInlineElementNode,
  type Node as ZhmlNode
} from "zhml";

type HighlightState = {
  highlightedId: number | null;
  setHighlightedId: (id: number | null) => void;
};

type Topic = {
  slug: string;
  title: string;
  zhml: string;
};

export type {
  HighlightState, Topic, ZhmlBlockElementNode, ZhmlExampleListNode, ZhmlExampleNode, ZhmlInlineElementNode, ZhmlNode
};
