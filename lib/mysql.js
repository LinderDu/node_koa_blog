const mysql = require('mysql');
const config = require('../config/default.config.js');

const pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE
});

// mysql query
const query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                resolve(err);
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release();
                })
            }
        })
    })
};
let users = `create table if not exists users(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     pass VARCHAR(40) NOT NULL,
     PRIMARY KEY ( id )
    );`;

let posts = `create table if not exists posts(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     title VARCHAR(40) NOT NULL,
     content  VARCHAR(40) NOT NULL,
     uid  VARCHAR(40) NOT NULL,
     moment  VARCHAR(40) NOT NULL,
     comments  VARCHAR(40) NOT NULL DEFAULT '0',
     pv  VARCHAR(40) NOT NULL DEFAULT '0',
     PRIMARY KEY ( id )
    );`;

let comment = `create table if not exists comment(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     content VARCHAR(40) NOT NULL,
     postid VARCHAR(40) NOT NULL,
     PRIMARY KEY ( id )
    );`;


const createTable = (sql) => {
    return query(sql, [])
};

// createTable
createTable(users);
createTable(posts);
createTable(comment);

// sign
const userSign = (value) => {
    const _sql = "insert into users(name,pass) values(?,?);";
    return query(_sql, value);
};

// push content
const addContent = (value) => {
    const _sql = "insert into posts(name,title,content,uid,moment) values(?,?,?,?,?);";
    return query(_sql, value);
};

// updatePostPv
const updatePv = value => {
    const _sql = "update posts set pv=? where id =?";
    query(_sql, value)
};

// insertComment
const insertComment = value => {
    const _sql = "insert into comment(name,content,postid) value(?,?,?);";
    return query(_sql, value);
};

// updatePostComment
const updatePostComment = value => {
    const _sql = "update posts set comments=? where id=?";
    return query(_sql, value);
};

// findUserByName
const findUserByName = value => {
    const _sql = `select * from posts where name=${value}`;
    return query(_sql)
};

// findDataById
const findDataById = value => {
    const _sql = `select * from posts where id = ${value}`;
    return query(_sql)
};

// findCommentById
const findCommentById = value => {
    const _sql = `select * from comment where postid = ${value}`;
    return query(_sql);
};

// findAllPost
const findAllPost = values => {
    const _sql = "select * from posts";
    return query(_sql);
};

// updatePost
let updatePost = values => {
    let _sql = `update posts set  title=?,content=? where id=?`;
    return query(_sql, values)
};

// deletePost
const deletePost = id => {
    let _sql = `delete from posts where id = ${id}`;
    return query(_sql)
};

// deleteComment
let deleteComment = id => {
    let _sql = `delete from comment where id = ${id}`;
    return query(_sql)
};

// deleteAllPostComment
let deleteAllPostComment = id => {
    let _sql = `delete from comment where postid = ${id}`;
    return query(_sql)
};

// findCommentLength
const findCommentLength = id => {
    let _sql = `select content from comment where postid in (select id from posts where id=${id})`
    return query(_sql)
};

module.exports = {
    query,
    createTable,
    userSign,
    addContent,
    updatePv,
    insertComment,
    updatePostComment,
    findUserByName,
    findDataById,
    findCommentById,
    findAllPost,
    updatePost,
    deletePost,
    deleteComment,
    deleteAllPostComment,
    findCommentLength
};



