class NewsController{
    index(req,res){
        res.render('news')
    }

    show(req,res){
        res.send('news_detail')
    }
}

module.exports = new NewsController;