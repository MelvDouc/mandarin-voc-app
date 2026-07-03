const NodeKinds = {
  Text: 0,
  Zh: 1,
  TranslatedPhrase: 2,
  BlockElement: 3,
  ExampleList: 4,
  Example: 5
} as const;

export type NodeKind = typeof NodeKinds[keyof typeof NodeKinds];

export default NodeKinds;