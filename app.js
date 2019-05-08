var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    expressSanitizer = require('express-sanitizer'),
    methodOverride = require('method-override'),
    app = express();
    
    

    mongoose.connect("/mongodb://localhost:27017/football_blog", {
        useNewUrlParser:true
    })

    app.set("view engine", "ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressSanitizer());
    app.use(methodOverride("_method"));

    var footballSchema = new mongoose.Schema({
        title: String,
        image: String,
        body: String,
        date: {type: Date, default: Date.now}
    })

    var Blog = mongoose.model("Blog", footballSchema);

    app.get("/", function(req, res){
        res.redirect("/blogs");
    })

    //INDEX ROUTE

    app.get("/blogs", function(req, res){
        Blog.find({}, function(err, blogs){
            if(err){
                console.log("Error");
            } else {
                res.render("index", {blogs:blogs});
            }
        });
    });

    //NEW ROUTE

    app.get("/blogs/new", function(req, res){
        res.render("new");
    })

    //CREATE ROUTE

    app.post("/blogs", function(req, res){
        req.body.blog.body = req.sanitize(req.body.blog.body)
        Blog.create(req.body.blog, function(err, newBlog){
            if(err){
                res.render("new")
                console.log(err);
            } else {
                res.redirect("/blogs");
            }
        })
    })

    //SHOW ROUTE

    app.get("/blogs/:id", function(req, res){
        Blog.findById(req.params.id, function(err, showBlog){
            if(err){
                console.log("You have an error")
                res.redirect("/blogs")
            } else {
                res.render("show", {blog: showBlog})
            }
        })
    })

    //EDIT ROUTE

    app.get("/blogs/:id/edit", function(req, res){
        Blog.findById(req.params.id, function(err, editBlog){
            if(err){
                console.log("You have an error")
                res.redirect("/blogs/:id")
            } else {
                res.render("edit", {blog: editBlog})
            }
        })
    })

    //UPDATE ROUTE

    app.put("/blogs/:id", function(req, res){
        Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
            if(err){
                console.log("You have an error")

            } else {
                res.redirect("/blogs/" +req.params.id)
            }
        })
    })
    
    //DELETE ROUTE

    app.delete("/blogs/:id", function(req, res){
        Blog.findByIdAndRemove(req.params.id, function(err){
            if(err){
                console.log("You have an error")
            } else {
                res.redirect("/blogs")
            }
        })
    })



    app.listen(process.env.PORT || 3000, function(){
        console.log("Football blog server connected");
    })