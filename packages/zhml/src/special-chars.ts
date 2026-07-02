export const DOLLAR_SIGN = "$";
export const TILDE = "~";
export const HASHTAG = "#";
export const ASTERISK = "*";
export const OPENING_SQUARE_BRACKET = "[";
export const CLOSING_SQUARE_BRACKET = "]";
export const DOUBLE_QUOTE = "\"";
export const SPACE = " ";
export const LINE_FEED = "\n";
export const EOF = "\0";

export function isNumeric(ch: string): boolean {
  return ch === "0"
    || ch === "1"
    || ch === "2"
    || ch === "3"
    || ch === "4"
    || ch === "5"
    || ch === "6"
    || ch === "7"
    || ch === "8"
    || ch === "9";
}

export function isNotSpecialCharacter(ch: string): boolean {
  return ch !== DOLLAR_SIGN
    && ch !== HASHTAG
    && ch !== ASTERISK
    && ch !== OPENING_SQUARE_BRACKET
    && ch !== CLOSING_SQUARE_BRACKET
    && ch !== DOUBLE_QUOTE
    && ch !== SPACE
    && ch !== LINE_FEED;
}