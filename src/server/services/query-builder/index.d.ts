type Placeholder = `:${string}`;
type SqlScalar = string | number | boolean | null;
type ParamRecord = Record<Placeholder, SqlScalar>;
type RecursiveStringRecord = {
    [key: string]: string | RecursiveStringRecord;
};

declare class StringBuilder {
    private static _format;
    private _output;
    constructor(start: string, ...params: string[]);
    add(text: string, ...params: string[]): this;
    addLine(line: string, ...params: string[]): this;
    getOutput(): string;
}

declare abstract class StatementBuilder {
    protected readonly _table: string;
    constructor(_table: string);
    abstract getSql(params?: ParamRecord): string;
    protected _createStringBuilder(start: string, ...params: string[]): StringBuilder;
    protected _addParams(input: string, params: ParamRecord): string;
}

declare class CreateTableStatementBuilder extends StatementBuilder {
    private _temporary;
    private _ifNotExists;
    private _primaryKey;
    private readonly _columns;
    private readonly _constraints;
    temporary(): this;
    ifNotExists(): this;
    primaryKey(name: string, type: string, autoIncrement?: boolean): this;
    column(name: string, params: {
        type: string;
        nullable?: boolean;
        defaultValue?: string;
    }): this;
    unique(name: string, column: string): this;
    foreignKey(name: string, column: string, foreignTable: string, foreignColumn: string): this;
    getSql(): string;
}

declare class InsertStatementBuilder extends StatementBuilder {
    private readonly _columns;
    private readonly _values;
    private _alias;
    private _onDuplicateKeyUpdate;
    columns(columns: string[]): this;
    value(value: SqlScalar[]): this;
    values(values: SqlScalar[][]): this;
    valueDictionary(valueDict: ValueDictionary): this;
    valueDictionaries(valueDicts: ValueDictionary[]): this;
    private _convertValueDictionary;
    as(alias: string): this;
    onDuplicateKeyUpdate(assignmentList: string): this;
    getSql(): string;
    private _joinValues;
}
type ValueDictionary = Record<string, SqlScalar>;

declare abstract class LimitableStatementBuilder extends StatementBuilder {
    protected readonly _orderBy: string[];
    protected _limit: number;
    orderBy(...columns: string[]): this;
    limit(limit: number): this;
}

declare const joinSymbol: unique symbol;

declare class DeleteStatementBuilder extends LimitableStatementBuilder {
    private _using;
    private _where;
    readonly [joinSymbol]: string[];
    readonly join: {
        (table: string, onCondition?: string): DeleteStatementBuilder;
        inner(table: string, onCondition?: string): DeleteStatementBuilder;
        left(table: string, onCondition?: string): DeleteStatementBuilder;
        right(table: string, onCondition?: string): DeleteStatementBuilder;
    };
    using(using: string): this;
    where(condition: string): this;
    private _isMultiTable;
    getSql(params?: ParamRecord): string;
}

declare class SelectStatementBuilder extends LimitableStatementBuilder {
    private readonly _columns;
    private readonly _groupBy;
    private _where;
    readonly [joinSymbol]: string[];
    readonly join: {
        (table: string, onCondition?: string): SelectStatementBuilder;
        inner(table: string, onCondition?: string): SelectStatementBuilder;
        left(table: string, onCondition?: string): SelectStatementBuilder;
        right(table: string, onCondition?: string): SelectStatementBuilder;
    };
    column(column: string): this;
    columnIf(condition: string, valueIfTrue: string, valueIfFalse: string, alias: string): this;
    columnIfNull(expression: string, altValue: string, alias: string): this;
    where(condition: string): this;
    groupBy(...columns: string[]): this;
    getSql(params?: ParamRecord): string;
}

declare class UpdateStatementBuilder extends LimitableStatementBuilder {
    private readonly _updates;
    private _where;
    /**
     * @param column The table column to update.
     * @param value Either a placeholder like `:id` or raw SQL code like `col1 + 1`.
     */
    set(column: string, value: string): this;
    where(condition: string): this;
    getSql(params?: ParamRecord): string;
}

declare function selectFrom(table: string): SelectStatementBuilder;
declare function insertInto(table: string): InsertStatementBuilder;
declare function update(table: string): UpdateStatementBuilder;
declare function deleteFrom(table: string): DeleteStatementBuilder;
declare function createTable(table: string): CreateTableStatementBuilder;
declare function jsonObject(entries: RecursiveStringRecord): string;

export { createTable, deleteFrom, insertInto, jsonObject, selectFrom, update };
