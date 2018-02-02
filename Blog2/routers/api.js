var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');
//统一返回格式
//初始化处理
var responseData;
router.use(function(req,res,next){
    responseData={
        code:0,  //无错误状态
        message:''
    }
    next();
});
/*
* 用户注册
* */
router.post('/user/register',function(req,res,next){
    //res.send('Api-User');
    //console.log(req.body);//结果显示：{ username: 'test', password: '123', repassword: '123' }
    //console.log('register');
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    //用户名是否为空
    if(username==''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData); //将上述信息用json形式返回给前端
        return;//作为后续代码的执行
    }
    //密码不能为空
    if(password==''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    // 两次输入的密码必须一致
    if(password != repassword){
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }
    //用户名是否已经被注册了，如果数据库中已经存在和我们要注册的用户名同名的数据，表示该用户名已经被注册了
      User.findOne({
        username:username
    }).then(function(userInfo){
        //console.log(userInfo);
        if(userInfo){
            //表示数据库中有该记录
            responseData.code = 4;
            responseData.message = "用户名已经被注册了";
            res.json(responseData);
            return;
        }
        //构造函数下面：
        var user = new User({
            username : username,
            password : password
        });
        return user.save();
    }).then(function(newUserInfo){
        //console.log(newUserInfo);
         responseData.message='注册成功';
        res.json(responseData);
    });
});
/*
* 登录
* */
router.post('/user/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    if(username==''|| password==''){
        responseData.code = 1;
        responseData.message = '用户名和密码不能为空';
        res.json(responseData);
        return;
    }
    //查询数据库中相同用户名和密码的记录是否存在,如果存在则登录成功
    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code=2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        responseData.message = "登录成功";
        responseData.userInfo = {
            _id:userInfo._id,
            username:userInfo.username
        }
        //cookies保存信息
        req.cookies.set('userInfo',JSON.stringify({
            _id:userInfo._id,
            username:userInfo.username
        }));
        res.json(responseData);
        return;
    })
});
/*
* 退出
* */
router.get('/user/logout',function(req,res){
        req.cookies.set('userInfo',null);
        res.json(responseData);
});
/*
* 评论提交
* */
router.post('/comment/post',function(req,res){
    // 内容的id
    var contentId = req.body.contentid || '';
    //从cookies中获取
    var postData = {
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content
    }
    //查询当前这篇内容的信息
    Content.findOne({
        _id:contentId
    }).then(function(content){
        content.comments.push(postData);
        return content.save();  //返回的就是下面的newContent
    }).then(function(newContent){
        responseData.message = '评论成功';
       // responseData.data = newContent;
        res.json(responseData);
    })
});
module.exports = router;