class MySQLQueryBuilder {
  constructor() {
  }

  table(table) {
    this.table = table;
    return this;
  }

  read(readItem) {
    this.commands = "read";
    this.readItem = readItem;
    return this;
  }

  update(updateItem) {
    this.commands = "update";
    this.updateItem = updateItem;
    return this;
  }

  insert(insertItem, bulk) {
    this.commands = "insert";
    this.insertItem = insertItem;
    this.bulkInsert = bulk;
    return this;
  }

  where(condition) {
    this.whereItem = true;
    this.condition = condition;
    return this;
  }

  paginate(limit, page) {
    this.limit = limit;
    if(page)
      this.page = page;
    return this;
  }

  order(item, sec) {
    this.orderItem = item;
    if (sec)
      this.sec = sec;
    return this;
  }

  join(table, condition, joinType) {
    this.joinType = joinType ? joinType : 'JOIN';
    this.joinTable = table;
    this.joinCondition = condition;
    return this;
  }

  group(item) {
    this.groupBy = item;
    return this;
  }

  procedure(name, ...params) {
    this.procedureCall = true;
    this.procedureName = name;
    this.procedureParams = params;
    return this;
  }

  isArray(value) {
    return Array.isArray(value);
  }

  isObject(value) {
    return typeof(value) === 'object' && !value.hasOwnProperty('length');
  }

  _conditionParser(condition, includeWhere=false, comma=' AND', pth=true) {
    if (typeof(condition) === 'object') {
      let clause = '';
      let conditionKeys = Object.keys(condition);

      conditionKeys.map((key, ci) => {
        let _undefined = false;
        if (this.isArray(condition[key])) {
          // if condition[key] is array
          clause +=  pth ? ' (' : '';
          condition[key].map((value, vi) => {
            clause += ` ${key} = '${value}'`;
            if (condition[key].length !== vi + 1)
              clause += ' OR';
          });
          clause += pth ? ')' : '';
        } else if (this.isObject(condition[key])) {
          // if condition[key] is obejct
          let expression = condition[key].expression;
          let values = condition[key].value;
          Object.keys(values).map((v, i) => {
            expression = expression.replace(v, values[v]);
          });
          clause += ` ${expression}`;
        } else if (typeof(condition[key]) === 'string' || typeof(condition[key]) === 'number') {
          // if condition[key] is string or number
          if (pth)
            clause += ` (${key} = '${condition[key]}')`;           
          else
            clause += ` ${key} = '${condition[key]}'`;
        } else {
          _undefined = true;
        }

        if (!_undefined && conditionKeys.length !== ci + 1)
          clause += comma;
      });

      return ` ${includeWhere ? 'WHERE' : ''} ${clause}`;
    } else if (typeof(condition) === 'string'){
      return ` ${condition}`;
    } else {
      throw new Error("Wrong condition type");
    }
  }

  listToString(list, quote) {
    let ret = "";
    for (const v of list)
      if (!quote)
        ret += `${v},`;
      else
        ret += `'${v}',`;
    return ret.slice(0, ret.length - 1);
  }

  build() {
    let query = '';
    if (this.procedureCall) {
      let params = '';
      this.procedureParams.map((param) => {
        if (typeof(param) === 'string')
          params += `'${param}'`;
        else
          params += `${param}`;
        params += ','
      });
      if (this.procedureParams.length > 0)
        params = params.slice(0, params.length-1);
      query = `CALL ${this.procedureName}(${params});`;
      return query;
    }

    if (this.commands === "read") {
      query = `SELECT ${this.readItem ? this.readItem : '*'} FROM ${this.table}`;
      if (this.joinTable) {
        query += ` ${this.joinType}  ${this.joinTable} ON ${this._conditionParser(this.joinCondition, false)}`;
      }
      
      if (this.whereItem) {
        query += this._conditionParser(this.condition, true);
      }

      if (this.groupBy) {
        query += ` GROUP BY ${this.groupBy}`;
      }

      if (this.orderItem) {
        query += ` ORDER BY ${this.orderItem}`;
        if (this.sec)
          query += ` ${this.sec}`;
      }

      if (this.limit) {
        if (this.page) {
          query += ` LIMIT ${this.page*this.limit}, ${this.limit}`;
        } else {
          query += ` LIMIT ${this.limit}`;
        }
      }
    } else if (this.commands === "update") {
      query = `UPDATE ${this.table} SET ${this._conditionParser(this.updateItem, false, ' ,', false)}`;

      if (this.whereItem) {
        query += this._conditionParser(this.condition, true);
      }
    } else if (this.commands === "insert") {
      const columns = Object.keys(this.insertItem);
      const values = columns.map((v) => this.insertItem[v]);
      if (this.bulkInsert) {
        let total = '';
        const length = values[0].length;
        for (let i = 0; i < length; ++i) {
          const obj = [];
          for (const value of values)
            obj.push(value[i]);
          total += `(${this.listToString(obj, true)}), `;
        }
        query = `INSERT INTO ${this.table} (${this.listToString(columns)}) VALUES ${total.slice(0, total.length-2)}`;                
      } else {
        query = `INSERT INTO ${this.table} (${this.listToString(columns)}) VALUES (${this.listToString(values, true)})`;        
      }
    }

    query += ';';
    return query;
  }
}

module.exports = MySQLQueryBuilder;