const format = require('pg-format');
const db = require('../db/connection.js');

/**
 * Checks whether a specified value in the database exists.
 * @param {String} table The database table name.
 * @param {String} column The column name in the table.
 * @param {*} value The column value to check.
 * @returns Resolves a Promise if true, rejects a Promise if false with an 
 *    error object.
 */
const checkValueExists = async (table, column, value) => {
  console.log("In doesDBValueExist() in misc.service.js!");

  let queryStr = format('SELECT * FROM %I WHERE %I = $1', table, column);

  return db.query(queryStr, [value])
      .then(({rows}) => {
        if (!rows.length)
          return Promise.reject({status: 404, msg:'Resource not found!'});
      });
};

module.exports = {checkValueExists};