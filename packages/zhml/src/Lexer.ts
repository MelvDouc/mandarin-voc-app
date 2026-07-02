import {
  ASTERISK,
  CLOSING_SQUARE_BRACKET,
  DOLLAR_SIGN,
  DOUBLE_QUOTE,
  EOF,
  HASHTAG,
  isNotSpecialCharacter,
  isNumeric,
  LINE_FEED,
  OPENING_SQUARE_BRACKET,
  SPACE,
  TILDE
} from "$/special-chars.ts";
import Position from "$/tokens/Position.ts";
import type { Token } from "$/tokens/Token.ts";
import TokenKind from "$/tokens/TokenKind.ts";

export default class Lexer {
  private readonly input: string;
  private index = 0;
  private row = 1;
  private col = 1;

  public constructor(input: string) {
    this.input = input;
  }

  public lex(): Token {
    const pos = new Position(this.row, this.col);
    const ch = this.next();

    switch (ch) {
      case EOF:
        return { kind: TokenKind.EndOfInput, pos };
      case SPACE:
        return { kind: TokenKind.Space, pos };
      case LINE_FEED:
        return this.lineFeedToken(pos);
      case DOLLAR_SIGN:
        return { kind: TokenKind.VarRef, varName: this.scanText(), pos };
      case TILDE:
        return { kind: TokenKind.VarDef, pos };
      case HASHTAG:
        return this.zhDefToken(pos);
      case ASTERISK:
        return this.translationRefToken(pos);
      case DOUBLE_QUOTE:
        return this.quotedTextToken(pos);
      case OPENING_SQUARE_BRACKET:
        return { kind: TokenKind.SquareBracketStart, pos };
      case CLOSING_SQUARE_BRACKET:
        return { kind: TokenKind.SquareBracketEnd, pos };
      default:
        return this.textToken(ch, pos);
    }
  }

  private get current(): string {
    return this.index < this.input.length ? this.input[this.index] : EOF;
  }

  private next(): string {
    const { current } = this;
    this.advance();
    return current;
  }

  private scanWhile(predicate: (ch: string) => boolean): string {
    let value = "";
    let ch = this.current;

    while (ch !== EOF && predicate(ch)) {
      value += ch;
      this.advance();
      ch = this.current;
    }

    return value;
  }

  private scanText(): string {
    return this.scanWhile(isNotSpecialCharacter);
  }

  private lineFeedToken(pos: Position): Token {
    this.row++;
    this.col = 1;
    return { kind: TokenKind.LineBreak, pos };
  }

  private textToken(firstCh: string, pos: Position): Token {
    const value = firstCh + this.scanText();
    return { kind: TokenKind.Text, value, pos };
  }

  private quotedTextToken(pos: Position): Token {
    const value = this.scanWhile((ch) => ch !== DOUBLE_QUOTE);
    this.advance(); // Skip closing double quote.
    return { kind: TokenKind.Text, value, pos };
  }

  private zhDefToken(pos: Position): Token {
    const idStr = this.scanWhile(isNumeric);
    const id = idStr === "" ? null : +idStr;
    return { kind: TokenKind.ZhDef, id, pos };
  }

  private translationRefToken(pos: Position): Token {
    const idStr = this.scanWhile(isNumeric);
    return { kind: TokenKind.TranslationRef, id: +idStr, pos };
  }

  private advance(): void {
    this.index++;
    this.col++;
  }
}
