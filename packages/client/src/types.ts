import {
  type BlockElementNode,
  type ExampleListNode,
  type ExampleNode,
  type Node as ZhmlNode
} from "zhml";

export type Highlightable = {
  isHighlighted: boolean;
  setHighlighted: ((highlighted: boolean) => void) | null;
};

export type HighlightState = {
  highlightedId: number | null;
  setHighlightedId: (id: number | null) => void;
};

export type {
  BlockElementNode as ZhmlBlockElementNode, ExampleListNode as ZhmlExampleListNode, ExampleNode as ZhmlExampleNode, ZhmlNode
};
