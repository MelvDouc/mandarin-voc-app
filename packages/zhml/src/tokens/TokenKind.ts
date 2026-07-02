const enum TokenKind {
  Text,
  Space,
  LineBreak,
  ZhDef,
  VarDef,
  VarRef,
  TranslationRef,
  SquareBracketStart,
  SquareBracketEnd,
  EndOfInput
}

export default TokenKind;