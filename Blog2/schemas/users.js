var mongoose = require('mongoose');

//用户的表结构
module.exports = new mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{
        type:Boolean,
        default:false
    }
});

/*
var mysql  = require('mysql');

create table `users` (
    `username` varchar(255) not null,
    `password` varchar(255) not null
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
*/

