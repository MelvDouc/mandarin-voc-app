export default class Position {
  public constructor(
    private readonly row: number,
    private readonly col: number
  ) { }

  public toString(): string {
    return `${this.row}:${this.col}`;
  }
}