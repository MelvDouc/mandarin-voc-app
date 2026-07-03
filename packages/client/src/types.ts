import {
  type BlockElementNode as ZhmlBlockElementNode,
  type ExampleListNode as ZhmlExampleListNode,
  type ExampleNode as ZhmlExampleNode,
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
  ZhmlBlockElementNode, ZhmlExampleListNode, ZhmlExampleNode, ZhmlNode
};
