const assert = require('assert');
const MySQLQueryBuilder = require('../../repository/mysql/builder');

describe('mysql query builder test', () => {
  let builder = new MySQLQueryBuilder();

  it('test 01', () => {
    const condition = {
      'user_id': '123'
    };

    let build = builder.table('SalesLogs').read().where(condition).order('meeting_date', 'DESC').paginate(3, 4).build();
    console.log(build);
  });

  let builder2 = new MySQLQueryBuilder();
  it('test 02', () => {
    const condition = {
      'user_id': ['123', '456']
    };

    let build = builder2.table('SalesLogs').read().where(condition).order('meeting_date', 'DESC').paginate(3, 4).build();
    console.log(build);
  });

  let builder3 = new MySQLQueryBuilder();
  it('test 03', () => {
    const condition = {
      'meeting_date': {
        expression: '(:from_date <= meeting_date AND meeting_date <= :to_date)',
        value: {
          ":from_date": 8,
          ":to_date": 9
        } 
      }
    };

    let build = builder3.table('SalesLogs').read().where(condition).order('meeting_date', 'DESC').paginate(3, 4).build();
    console.log(build);
  });

  let builder4 = new MySQLQueryBuilder();
  it('test 04', () => {
    const condition = {
      'user_id': ['123', '456'],
      'meeting_date': {
        expression: '(:from_date <= meeting_date AND meeting_date <= :to_date)',
        value: {
          ":from_date": 8,
          ":to_date": 9
        } 
      }
    };

    let build = builder4.table('SalesLogs').read().where(condition).order('meeting_date', 'DESC').paginate(3, 4).build();
    console.log(build);
  });

  let builder5 = new MySQLQueryBuilder();
  it('test 05', () => {
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

    let build = builder5.table('SalesLogs').read().where(condition).order('meeting_date', 'DESC').paginate(3, 4).build();
    console.log(build);
  });

  let builder6 = new MySQLQueryBuilder();
  it('test 06', () => {
    const condition = {
      'user_id': [],
      'account_id': ['abc', 'def'],
      'meeting_date': {
        expression: '(:from_date <= meeting_date AND meeting_date <= :to_date)',
        value: {
          ":from_date": 8,
          ":to_date": 9
        } 
      }
    };

    let build = builder6.table('SalesLogs').read().where(condition).order('meeting_date', 'DESC').paginate(3, 4).build();
    console.log(build);
  });

  let builder7 = new MySQLQueryBuilder();
  it('test 07', () => {
    let userId ='123';

    let build = builder7.table('UsersTree').read().where({'UsersTree.user_id': userId}).join('Users', {'Users.user_id': userId}).build();
    console.log(build);
  });

  let builder8 = new MySQLQueryBuilder();
  it('test 08: call procedure', () => {
    let [fromDate, toDate] =['123', '345'];

    let build = builder8.procedure('SalesLogs', fromDate, toDate).build();
    console.log(build);
  });

  let builder9 = new MySQLQueryBuilder();
  it('test 09: update 01', () => {
    let obj = {
      'creation_date': new Date().getTime(),
      'user_id': '1234'
    };
    let history = {
      expression: `\`history\` = JSON_ARRAY_APPEND(history, "$", '${JSON.stringify(obj)}')`,
      value: {}
    }
    obj.history = history;
    let build = builder9.table('SalesLogs').update(obj).where({'log_id': '6dc314af38c9be471f98a6044d6dc073'}).build();
    console.log(build);
  });

  let builder10 = new MySQLQueryBuilder();
  it('test 10: update 02', () => {
    let obj = {
      'creation_date': new Date().getTime(),
      'user_id': '1234'
    };
    let build = builder10.procedure('UpdateLogHistory', '123', JSON.stringify(obj)).build();
    console.log(build);
  });

  let builder11 = new MySQLQueryBuilder();
  it('test 11: update 03', () => {
    let obj = {
      'show_count': {
        'expression': 'show_count = show_count + 1',
        'value': {}
      }
    };
    let build = builder11.table('Board').update(obj).where({}).build();
    console.log(build);
  });
  let builder12 = new MySQLQueryBuilder();
  it('test 12: insert 01', () => {
    let obj = {'log_id': '1', 'user_id': '2', creation_date: new Date().getTime() };
    let build = builder12.table('Board').insert(obj).build();
    console.log(build);
  });

  let builder13 = new MySQLQueryBuilder();
  it('test 13: insert 02 bulk', () => {
    const dateTime = new Date().getTime();
    let obj = {
      'log_id': ['a'],
      'user_id': ['1'],
      'creation_date': [dateTime]
    };
    let build = builder13.table('SalesLogCoUsers').insert(obj, true).build();
    console.log(build);
  });
});