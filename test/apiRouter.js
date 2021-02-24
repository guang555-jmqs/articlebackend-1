let express = require('express');


var router = express.Router()
//挂载路由
router.get('/article',(req,res)=>{
    res.json({data:'文章列表11'})
})

router.get('/cate',(req,res)=>{
    res.json({data:'cate列表2222'})
})

module.exports = router;
