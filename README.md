# sl-mysql-query-builder

[![](https://img.shields.io/npm/v/sl-mysql-query-builder)](https://www.npmjs.com/package/sl-mysql-query-builder)

simple javascirpt query maker for mysql.

sponsored by [theklab](https://theklab.co)

# Installation

```
npm install sl-mysql-query-builder
```

# Quick Example
```
const MySQLQueryBuilder = require('sl-mysql-query-builder');

const builder = new MySQLQueryBuilder();

const condition = {
  'user_id': '123'	
}
let build = builder.table('MyTable').read().where(condition).order('meeting_date', 'DESC').paginate(3, 4).build();
console.log(build);
/*
 Equal to
 SELECT * FROM MyTable WHERE user_id = '123' ORDER BY meeting_date DESC LIMIT 3, 4;
*/
```

# Available Query

1. INSERT
2. SELECT
3. DELETE
4. UPDATE
2. WHERE 
3. JOIN
4. ORDER
5. PROCEDURE
6. BULK INSERT
7. GROUP BY

and will update more...

# CONDITION EXAMPLE

## 1. Expression Replace
```
const condition = {
      'user_id': ['123', '456'],
      'account_id': ['abc', 'def'],
      'meeting_date': {
        expression: '(:from_date <= meeting_date AND meeting_date <= :to_date)',
        value: {
          ":from_date": 8,
          ":to_date": 9
        } 
      }
    };
```


## 2. Raw Condition Input

```
const obj = {
  'creation_date': new Date().getTime(),
  'user_id': '1234'
};
let history = {
  expression: `\`history\` = JSON_ARRAY_APPEND(history, "$", '${JSON.stringify(obj)}')`,
  value: {}
}

obj.history = history;
let build = builder9.table('SalesLogs').update(obj).where({'log_id': '6dc314af38c9be471f98a6044d6dc073'}).build();
```


# TESTING

run command

```
mocah test/query_builder.test.js
```