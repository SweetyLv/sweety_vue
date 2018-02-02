var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');

/*
* 处理通用的数据,利用中间键的方法处理通用数据
* */
router.use(function(req,res,next){
    data = {
        userInfo:req.userInfo,
        categories:[]
    }
    //获取栏目信息
    Category.find().then(function(categories){
        data.categories = categories;
        next();
    });
});

/*
* 首页
* */
router.get('/',function(req,res,next){
        data.category = req.query.category || ''; //前端index.html(Rows:24)的分类栏category
        data.count = 0;   //初始化页面的总页数
        data.page = Number(req.query.page || 1);
        data.limit = 3;
        data.pages = 0;

    //前端index.html(Rows:24)的分类栏category
    var where = {};
    if(data.category){
        where.category = data.category
    }

     Content.where(where).count().then(function(count){  //获取分类的总页数
        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count/data.limit);
        //取值不能超过pages
        data.page = Math.min(data.page,data.pages);
        //取值不能小于1
        data.page = Math.max(data.page,1);
        var skip = (data.page-1)*data.limit;
        //上面（Rows:20）定义了where,关联判断的是前端index.html(Rows:24)的分类栏category
        return Content.find().where(where).limit(data.limit).skip(skip).populate(['category','user']).sort({addTime:-1});
    }).then(function(contents){
        data.contents = contents;
        //console.log(data);
        res.render('main/index',data);
    })
});
router.get('/view',function(req,res){
    var contentId = req.query.contentid;
    Content.findOne({
        _id:contentId
    }).then(function(content){
        data.content = content;
        content.views++;
        content.save();
        res.render('main/view',data);
    });
});
module.exports = router;