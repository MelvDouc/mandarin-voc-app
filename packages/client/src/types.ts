import {
  type BlockElementNode as ZhmlBlockElementNode,
  type ExampleListNode as ZhmlExampleListNode,
  type ExampleNode as ZhmlExampleNode,
  type InlineElementNode as ZhmlInlineElementNode,
  type Node as ZhmlNode
} from "zhml";

export type HighlightState = {
  highlightedId: number | null;
  setHighlightedId: (id: number | null) => void;
};

export type {
  ZhmlBlockElementNode, ZhmlExampleListNode, ZhmlExampleNode, ZhmlInlineElementNode, ZhmlNode
};
