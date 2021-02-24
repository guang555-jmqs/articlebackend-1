let express = require('express');

let app = express();
let apiRouter = require('./apiRouter.js')

app.use('/api',apiRouter)
// app.use('/user',apiRouter)
// app.use('/article',apiRouter)
//启动服务
app.listen(5000,()=>{
    console.log('server running at port 5000')
})
