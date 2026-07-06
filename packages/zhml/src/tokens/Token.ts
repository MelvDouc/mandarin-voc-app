import type Position from "$/tokens/Position.ts";
import type TokenKind from "$/tokens/TokenKind.ts";

type TextToken = {
  kind: TokenKind.Text;
  value: string;
  pos: Position;
};

type SpaceToken = {
  kind: TokenKind.Space;
  pos: Position;
};

type InlineTagToken = {
  kind: TokenKind.InlineTag;
  localName: string;
  pos: Position;
};

type LineBreakToken = {
  kind: TokenKind.LineBreak;
  pos: Position;
};

type ZhDefToken = {
  kind: TokenKind.ZhDef;
  id: number | null;
  pos: Position;
};

type VarDefToken = {
  kind: TokenKind.VarDef;
  pos: Position;
};

type VarRefToken = {
  kind: TokenKind.VarRef;
  varName: string;
  pos: Position;
};

type TranslationRefToken = {
  kind: TokenKind.TranslationRef;
  id: number;
  pos: Position;
};

type SquareBracketStartToken = {
  kind: TokenKind.SquareBracketStart;
  pos: Position;
};

type SquareBracketEndToken = {
  kind: TokenKind.SquareBracketEnd;
  pos: Position;
};

type EndOfInputToken = {
  kind: TokenKind.EndOfInput;
  pos: Position;
};

export type Token =
  | TextToken
  | SpaceToken
  | InlineTagToken
  | LineBreakToken
  | ZhDefToken
  | VarDefToken
  | VarRefToken
  | TranslationRefToken
  | SquareBracketStartToken
  | SquareBracketEndToken
  | EndOfInputToken;

export interface TokenMap {
  [TokenKind.Text]: TextToken;
  [TokenKind.Space]: SpaceToken;
  [TokenKind.InlineTag]: InlineTagToken;
  [TokenKind.LineBreak]: LineBreakToken;
  [TokenKind.ZhDef]: ZhDefToken;
  [TokenKind.VarDef]: VarDefToken;
  [TokenKind.VarRef]: VarRefToken;
  [TokenKind.TranslationRef]: TranslationRefToken;
  [TokenKind.SquareBracketStart]: SquareBracketStartToken;
  [TokenKind.SquareBracketEnd]: SquareBracketEndToken;
  [TokenKind.EndOfInput]: EndOfInputToken;
}
