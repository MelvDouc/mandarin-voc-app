import Lexer from "$/Lexer.ts";
import type { BlockElementNode, ExampleNode, InlineElementNode, Node, ZhNode } from "$/nodes/Node.ts";
import NodeKinds from "$/nodes/NodeKinds.ts";
import {
  CLOSING_SQUARE_BRACKET,
  OPENING_SQUARE_BRACKET,
  SPACE
} from "$/special-chars.ts";
import type Position from "$/tokens/Position.ts";
import type { Token, TokenMap } from "$/tokens/Token.ts";
import TokenKind from "$/tokens/TokenKind.ts";

export default class Parser {
  private static getTokens(input: string): Token[] {
    const lexer = new Lexer(input);
    const tokens: Token[] = [];
    let token: Token;

    do {
      token = lexer.lex();
      tokens.push(token);
    } while (token.kind !== TokenKind.EndOfInput);

    return tokens;
  }

  private readonly tokens: Token[];
  private readonly vars: Record<string, ZhNode> = {};
  private readonly lastTokenIndex: number;
  private index = 0;

  public constructor(input: string) {
    this.tokens = Parser.getTokens(input);
    this.lastTokenIndex = this.tokens.length - 1;
  }

  public parse(): Node[] {
    const nodes: Node[] = [];
    let token = this.next();

    while (token.kind !== TokenKind.EndOfInput) {
      switch (token.kind) {
        case TokenKind.Text: {
          this.handleRootTextToken(token.value, token.pos, nodes);
          break;
        }
        case TokenKind.VarDef: {
          this.handleVarDef();
          break;
        }
        case TokenKind.LineBreak: {
          break;
        }
        default: {
          throw new Error(`Unexpected token kind ${token.kind} at ${token.pos}.`);
        }
      }

      token = this.next();
    }

    return nodes;
  }

  private next(): Token {
    const token = this.tokens[Math.min(this.index, this.lastTokenIndex)];
    this.index++;
    return token;
  }

  private handleRootTextToken(value: string, pos: Position, children: Node[]) {
    switch (value) {
      case "examples":
        children.push({
          kind: NodeKinds.ExampleList,
          children: this.parseExamples()
        });
        break;
      case "example":
      case "trl":
        throw new Error(`Unexpected block element "${value}" at ${pos}.`);
      default:
        children.push({
          kind: NodeKinds.BlockElement,
          localName: value,
          children: this.parseElementChildren() as BlockElementNode["children"]
        });
    }
  }

  private handleVarDef(): void {
    this.assertToken(this.next(), TokenKind.Space);
    const varName = this.assertToken(this.next(), TokenKind.Text).value;
    this.assertToken(this.next(), TokenKind.Space);
    const zhNode = this.parseZhNode(this.next());
    this.assertToken(this.next(), TokenKind.LineBreak);

    this.vars[varName] = zhNode;
  }

  private parseInlineElement(localName: string): InlineElementNode {
    this.assertToken(this.next(), TokenKind.SquareBracketStart);
    const children: InlineElementNode["children"] = [];
    let token = this.next();

    while (token.kind !== TokenKind.SquareBracketEnd) {
      switch (token.kind) {
        case TokenKind.Text: {
          this.addText(children, token.value);
          break;
        }
        case TokenKind.Space: {
          this.addText(children, SPACE);
          break;
        }
        case TokenKind.ZhDef: {
          children.push(this.parseZhNode(token));
          break;
        }
        case TokenKind.VarRef: {
          children.push(this.vars[token.varName]);
          break;
        }
        default: {
          throw new Error(`Unexpected token kind ${token.kind} at ${token.pos}`);
        }
      }

      token = this.next();
    }

    return {
      kind: NodeKinds.InlineElement,
      localName,
      children
    };
  }

  private parseZhNode(token1: Token): ZhNode {
    token1 = this.assertToken(token1, TokenKind.ZhDef);
    this.assertToken(this.next(), TokenKind.SquareBracketStart);

    const token2 = this.next();

    if (token2.kind === TokenKind.VarRef) {
      const node = this.vars[token2.varName];
      this.assertToken(this.next(), TokenKind.SquareBracketEnd);
      return { ...node, id: token1.id };
    }

    const zh = this.assertToken(token2, TokenKind.Text).value;
    this.assertToken(this.next(), TokenKind.Space);

    const py = this.assertToken(this.next(), TokenKind.Text).value;
    this.assertToken(this.next(), TokenKind.SquareBracketEnd);

    return {
      kind: NodeKinds.Zh,
      id: token1.id,
      zh,
      py
    };
  }

  private parseTranslation(): string {
    this.assertToken(this.next(), TokenKind.SquareBracketStart);
    let token = this.next();
    let value = "";

    while (token.kind !== TokenKind.SquareBracketEnd) {
      switch (token.kind) {
        case TokenKind.Text:
          value += token.value;
          break;
        case TokenKind.Space:
          value += SPACE;
          break;
        default:
          throw new Error(`Unexpected token kind ${token.kind} at ${token.pos}.`);
      }

      token = this.next();
    }

    return value;
  }

  private parseElementChildren(): Node[] {
    this.assertToken(this.next(), TokenKind.Space);

    const children: Node[] = [];
    let token = this.next();

    while (token.kind !== TokenKind.LineBreak && token.kind !== TokenKind.EndOfInput) {
      switch (token.kind) {
        case TokenKind.Text: {
          this.addText(children, token.value);
          break;
        }
        case TokenKind.Space: {
          this.addText(children, SPACE);
          break;
        }
        case TokenKind.InlineTag: {
          children.push(this.parseInlineElement(token.localName));
          break;
        }
        case TokenKind.ZhDef: {
          children.push(this.parseZhNode(token));
          break;
        }
        case TokenKind.VarRef: {
          children.push(this.vars[token.varName]);
          break;
        }
        case TokenKind.TranslationRef: {
          const value = this.parseTranslation();
          children.push({ kind: NodeKinds.TranslatedPhrase, id: token.id, value });
          break;
        }
        case TokenKind.SquareBracketStart: {
          this.addText(children, OPENING_SQUARE_BRACKET);
          break;
        }
        case TokenKind.SquareBracketEnd: {
          this.addText(children, CLOSING_SQUARE_BRACKET);
        }
      }

      token = this.next();
    }

    return children;
  }

  private parseExamples(): ExampleNode[] {
    const examples: ExampleNode[] = [];
    let run = true;

    while (run) {
      const token = this.next();

      if (token.kind === TokenKind.LineBreak)
        continue;

      const { value, pos } = this.assertToken(token, TokenKind.Text);

      switch (value) {
        case "example": {
          const zh = this.parseElementChildren() as ExampleNode["zh"];
          this.assertTextTokenValue(this.next(), "trl");
          const trl = this.parseElementChildren() as ExampleNode["trl"];

          examples.push({ kind: NodeKinds.Example, zh, trl });
          break;
        }
        case "end": {
          this.assertToken(this.next(), TokenKind.Space);
          this.assertTextTokenValue(this.next(), "examples");
          run = false;
          break;
        }
        default: {
          throw new Error(`Unexpected block element "${value}" at ${pos}.`);
        }
      }
    }

    return examples;
  }

  private addText(children: Node[], value: string): void {
    const lastChild = children.at(-1);

    if (lastChild && lastChild.kind === NodeKinds.Text) {
      lastChild.value += value;
      return;
    }

    children.push({ kind: NodeKinds.Text, value });
  }

  private assertToken<TK extends TokenKind>(token: Token, expectedKind: TK): TokenMap[TK] {
    if (token.kind !== expectedKind)
      throw new Error(`Expected token kind ${expectedKind} as ${token.pos}.`);

    return token as TokenMap[TK];
  }

  private assertTextTokenValue(token: Token, expectedValue: string) {
    if (token.kind !== TokenKind.Text || token.value !== expectedValue)
      throw new Error(`Expected "${expectedValue}" at ${token.pos}`);
  }
}