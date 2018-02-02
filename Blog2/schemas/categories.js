var mongoose = require('mongoose');

//分类的表结构
module.exports = new mongoose.Schema({
    //分类名称
    name:String,
});

/*
var mysql  = require('mysql');

create table `users` (
    `username` varchar(255) not null,
    `password` varchar(255) not null
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
*/

