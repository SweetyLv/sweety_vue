//提交评论
$('#messageBtn').on('click', function() {
    $.ajax({
        type: 'post',
        url: '/api/comment/post',
        data: {
            contentid: $('#contentId').val(),
            content: $('#messageContent').val()
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // 状态码
            console.log(XMLHttpRequest.status);  //结果：0
            // 状态
            console.log(XMLHttpRequest.readyState);  //结果：0
            // 错误信息
            console.log(textStatus);    //结果：error
        },
        //dataType:'json',
        success:function(){
            console.log(1);
        }
      /* success: function(responseData) {
            console.log(responseData);
           // $('#messageContent').val('');
            //comments = responseData.data.comments.reverse();
            //renderComment();
        },*/

    });
});
