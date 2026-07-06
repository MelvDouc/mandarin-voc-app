const NodeKinds = {
  Text: 0,
  Zh: 1,
  TranslatedPhrase: 2,
  BlockElement: 3,
  InlineElement: 4,
  ExampleList: 5,
  Example: 6
} as const;

export type NodeKind = typeof NodeKinds[keyof typeof NodeKinds];

export default NodeKinds;