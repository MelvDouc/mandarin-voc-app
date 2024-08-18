// src/constraints/Constraint.ts
var Constraint = class {
};

// src/constraints/ForeignKeyConstraint.ts
var ForeignKeyConstraint = class extends Constraint {
  _name;
  _column;
  _foreignTable;
  _foreignColumn;
  constructor(name, column, foreignTable, foreignColumn) {
    super();
    this._name = name;
    this._column = column;
    this._foreignTable = foreignTable;
    this._foreignColumn = foreignColumn;
  }
  toString() {
    return `CONSTRAINT ${this._name} FOREIGN KEY (${this._column}) REFERENCES ${this._foreignTable} (${this._foreignColumn})`;
  }
};

// src/constraints/UniqueContraint.ts
var UniqueContraint = class extends Constraint {
  _name;
  _column;
  constructor(name, column) {
    super();
    this._name = name;
    this._column = column;
  }
  toString() {
    return `CONSTRAINT ${this._name} UNIQUE (${this._column})`;
  }
};

// src/statements/create-table/Column.ts
var Column = class {
  constructor(name, type, nullable, defaultValue) {
    this.name = name;
    this.type = type;
    this.nullable = nullable;
    this.defaultValue = defaultValue;
  }
  toString() {
    let output = `${this.name} ${this.type}`;
    this.nullable || (output += " NOT NULL");
    this.defaultValue === void 0 || (output += ` DEFAULT ${this.defaultValue}`);
    return output;
  }
};

// src/statements/create-table/PrimaryKey.ts
var PrimaryKey = class {
  constructor(name, type, autoIncrement) {
    this.name = name;
    this.type = type;
    this.autoIncrement = autoIncrement;
  }
  toString() {
    let output = `${this.name} ${this.type} PRIMARY KEY`;
    this.autoIncrement && (output += " AUTO_INCREMENT");
    return output;
  }
};

// src/utils/string-utils.ts
var DOUBLE_QUOTE = '"';
var formatString = (input) => {
  return DOUBLE_QUOTE + input.replaceAll(DOUBLE_QUOTE, '\\"') + DOUBLE_QUOTE;
};
var formatValue = (value) => {
  return typeof value === "string" ? formatString(value) : String(value);
};
var addParams = /* @__PURE__ */ (() => {
  const paramRegex = /:\w*/g;
  return (input, params) => {
    return input.replace(paramRegex, (key) => {
      return key in params ? formatValue(params[key]) : key;
    });
  };
})();

// src/utils/StringBuilder.ts
var StringBuilder = class _StringBuilder {
  static _format(text, params) {
    return text.replace(/\$(\d+)/g, (_, index) => params[index]);
  }
  _output;
  constructor(start, ...params) {
    this._output = _StringBuilder._format(start, params);
  }
  add(text, ...params) {
    this._output += _StringBuilder._format(text, params);
    return this;
  }
  addLine(line, ...params) {
    this._output += "\n" + _StringBuilder._format(line, params);
    return this;
  }
  getOutput() {
    return this._output;
  }
};

// src/statements/StatementBuilder.ts
var StatementBuilder = class {
  constructor(_table) {
    this._table = _table;
  }
  _createStringBuilder(start, ...params) {
    return new StringBuilder(start, ...params);
  }
  _addParams(input, params) {
    return addParams(input, params);
  }
};

// src/statements/create-table/CreateTableStatementBuilder.ts
var CreateTableStatementBuilder = class extends StatementBuilder {
  _temporary = false;
  _ifNotExists = false;
  _primaryKey = null;
  _columns = [];
  _constraints = [];
  temporary() {
    this._temporary = true;
    return this;
  }
  ifNotExists() {
    this._ifNotExists = true;
    return this;
  }
  primaryKey(name, type, autoIncrement) {
    this._primaryKey = new PrimaryKey(name, type, !!autoIncrement);
    return this;
  }
  column(name, params) {
    this._columns.push(new Column(name, params.type, !!params.nullable, params.defaultValue));
    return this;
  }
  unique(name, column) {
    this._constraints.push(new UniqueContraint(name, column));
    return this;
  }
  foreignKey(name, column, foreignTable, foreignColumn) {
    this._constraints.push(
      new ForeignKeyConstraint(name, column, foreignTable, foreignColumn)
    );
    return this;
  }
  getSql() {
    const stringBuilder = this._createStringBuilder("CREATE $0", this._temporary ? "TEMPORARY TABLE" : "TABLE");
    if (this._ifNotExists)
      stringBuilder.add(" IF NOT EXISTS");
    stringBuilder.add(" $0 (", this._table);
    const columns = [];
    if (this._primaryKey)
      columns.push(this._primaryKey.toString());
    this._columns.forEach((column) => columns.push(column.toString()));
    this._constraints.forEach((constraint) => columns.push(constraint.toString()));
    stringBuilder.addLine(columns.map((c) => "  " + c).join(",\n"));
    stringBuilder.addLine(")");
    return stringBuilder.getOutput();
  }
};

// src/statements/InsertStatementBuilder.ts
var InsertStatementBuilder = class extends StatementBuilder {
  _columns = [];
  _values = [];
  _alias = "";
  _onDuplicateKeyUpdate = "";
  columns(columns) {
    this._columns.push(...columns);
    return this;
  }
  value(value) {
    this._values.push(value.map(formatValue));
    return this;
  }
  values(values) {
    values.forEach((item) => this.value(item));
    return this;
  }
  valueDictionary(valueDict) {
    this._values.push(this._convertValueDictionary(valueDict));
    return this;
  }
  valueDictionaries(valueDicts) {
    valueDicts.forEach((item) => this.valueDictionary(item));
    return this;
  }
  _convertValueDictionary(valueDict) {
    return this._columns.map((column) => formatValue(valueDict[column]));
  }
  as(alias) {
    this._alias = alias;
    return this;
  }
  onDuplicateKeyUpdate(assignmentList) {
    this._onDuplicateKeyUpdate = assignmentList;
    return this;
  }
  getSql() {
    const stringBuilder = this._createStringBuilder("INSERT INTO $0 ($1)", this._table, this._columns.join(", "));
    stringBuilder.addLine("VALUES");
    stringBuilder.addLine("$0", this._joinValues());
    if (this._alias)
      stringBuilder.addLine("AS $0", this._alias);
    if (this._onDuplicateKeyUpdate)
      stringBuilder.addLine("ON DUPLICATE KEY UPDATE $0", this._onDuplicateKeyUpdate);
    return stringBuilder.getOutput();
  }
  _joinValues() {
    return this._values.map((item) => `(${item.join(", ")})`).join(",\n");
  }
};

// src/statements/limitable/LimitableStatementBuilder.ts
var LimitableStatementBuilder = class extends StatementBuilder {
  _orderBy = [];
  _limit = 0;
  orderBy(...columns) {
    this._orderBy.push(...columns);
    return this;
  }
  limit(limit) {
    this._limit = limit;
    return this;
  }
};

// src/utils/symbols.ts
var joinSymbol = Symbol();

// src/utils/join.ts
function createJoinFn(source) {
  const main = (table, onCondition = "", direction = "") => {
    let output = `JOIN ${table}`;
    if (direction)
      output = `${direction} ${output}`;
    if (onCondition)
      output += ` ON ${onCondition}`;
    source[joinSymbol].push(output);
    return source;
  };
  const join = (table, onCondition) => main(table, onCondition);
  join.inner = (table, onCondition) => main(table, onCondition, "INNER");
  join.left = (table, onCondition) => main(table, onCondition, "LEFT");
  join.right = (table, onCondition) => main(table, onCondition, "RIGHT");
  return join;
}

// src/statements/limitable/DeleteStatementBuilder.ts
var DeleteStatementBuilder = class extends LimitableStatementBuilder {
  _using = "";
  _where = "";
  [joinSymbol] = [];
  join = createJoinFn(this);
  using(using) {
    this._using = using;
    return this;
  }
  where(condition) {
    this._where = condition;
    return this;
  }
  _isMultiTable() {
    return this._using !== "";
  }
  getSql(params = {}) {
    const stringBuilder = this._createStringBuilder("DELETE FROM $0", this._table);
    if (this._isMultiTable()) {
      stringBuilder.addLine("USING $0", this._using);
      this[joinSymbol].forEach((join) => stringBuilder.addLine(join));
    }
    if (this._where)
      stringBuilder.addLine("WHERE $0", this._addParams(this._where, params));
    if (this._orderBy.length > 0)
      stringBuilder.addLine("ORDER BY $0", this._orderBy.join(", "));
    if (this._limit > 0)
      stringBuilder.addLine("LIMIT $0", this._limit.toString());
    return stringBuilder.getOutput();
  }
};

// src/statements/limitable/SelectStatementBuilder.ts
var SelectStatementBuilder = class extends LimitableStatementBuilder {
  _columns = [];
  _groupBy = [];
  _where = "";
  [joinSymbol] = [];
  join = createJoinFn(this);
  column(column) {
    this._columns.push(column);
    return this;
  }
  columnIf(condition, valueIfTrue, valueIfFalse, alias) {
    this._columns.push(`IF(${condition}, ${valueIfTrue}, ${valueIfFalse}) ${alias}`);
    return this;
  }
  columnIfNull(expression, altValue, alias) {
    this._columns.push(`IFNULL(${expression}, ${altValue}) ${alias}`);
    return this;
  }
  where(condition) {
    this._where = condition;
    return this;
  }
  groupBy(...columns) {
    this._groupBy.push(...columns);
    return this;
  }
  getSql(params = {}) {
    const stringBuilder = this._createStringBuilder("SELECT $0", this._columns.join(", "));
    stringBuilder.addLine("FROM $0", this._table);
    this[joinSymbol].forEach((join) => stringBuilder.addLine(join));
    if (this._where)
      stringBuilder.addLine("WHERE $0", this._addParams(this._where, params));
    if (this._groupBy.length > 0)
      stringBuilder.addLine("GROUP BY $0", this._groupBy.join(", "));
    if (this._orderBy.length > 0)
      stringBuilder.addLine("ORDER BY $0", this._orderBy.join(", "));
    if (this._limit > 0)
      stringBuilder.addLine("LIMIT $0", this._limit.toString());
    return stringBuilder.getOutput();
  }
};

// src/statements/limitable/UpdateStatementBuilder.ts
var UpdateStatementBuilder = class extends LimitableStatementBuilder {
  _updates = {};
  /**
   * @param column The table column to update.
   * @param value Either a placeholder like `:id` or raw SQL code like `col1 + 1`.
   */
  set(column, value) {
    this._updates[column] = value;
    return this;
  }
  where(condition) {
    this._where = condition;
    return this;
  }
  getSql(params = {}) {
    const stringBuilder = this._createStringBuilder("UPDATE $0", this._table);
    stringBuilder.addLine("SET");
    Object.entries(this._updates).forEach(([column, value]) => {
      stringBuilder.addLine("$0 = $1", column, this._addParams(value, params));
    });
    if (this._where)
      stringBuilder.addLine("WHERE $0", this._addParams(this._where, params));
    if (this._orderBy.length > 0)
      stringBuilder.addLine("ORDER BY $0", this._orderBy.join(", "));
    if (this._limit > 0)
      stringBuilder.addLine("LIMIT $0", this._limit.toString());
    return stringBuilder.getOutput();
  }
};

// src/functions.ts
function selectFrom(table) {
  return new SelectStatementBuilder(table);
}
function insertInto(table) {
  return new InsertStatementBuilder(table);
}
function update(table) {
  return new UpdateStatementBuilder(table);
}
function deleteFrom(table) {
  return new DeleteStatementBuilder(table);
}
function createTable(table) {
  return new CreateTableStatementBuilder(table);
}
function jsonObject(entries) {
  const sqlArgs = Object.entries(entries).map(([key, column]) => {
    return `"${key}", ${typeof column === "string" ? column : jsonObject(column)}`;
  }).join(", ");
  return `JSON_OBJECT(${sqlArgs})`;
}

export { createTable, deleteFrom, insertInto, jsonObject, selectFrom, update };
