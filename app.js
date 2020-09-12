var express=				require("express"),
 	app=					express(),
	mongoose=				require("mongoose"),
	bodyparser=				require("body-parser"),
 	methodOverride=			require("method-override"),
 	sanitize=				require("sanitize-html"),
 	passport=				require("passport"),
 	LocalStrategy=			require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	blog=					require("./models/blog"),
	user=					require("./models/user"),
	comments=				require("./models/comments");
app.use(methodOverride('_method'));
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(require("express-session")({
	secret:"hi may name is adarsh",
	resave: false,
	saveUninitialized:false
	
}));
app.use(passport.initialize());


app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate())); passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(function(req,res,next){
	res.locals.activeuser=req.user;
	next();
})
			 

//mongoose connect 
mongoose.connect('mongodb://localhost:27017/blogapp',{
	useNewUrlParser: true,
	useUnifiedTopology: true,
 	useFindAndModify: false 
	
}
);


app.get("/",function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	blog.find({},function(err,allblogs){
		if(err)
		{
			console.log("error");
		}
		else
		{res.render("index.ejs",{blogs : allblogs});}
	})
});

app.get("/blogs/new",isLoggedIn,function(req,res){
	res.render("form");
});

app.post("/blogs",function(req,res){
	var newblog=req.body.blog ;
	newblog.author=req.user.username;
	newblog.data=sanitize(newblog.data);
		blog.create(newblog,function(err,newb){
			if(err)
			{
				console.log("sorry");
			}
		else{
			console.log("created");
			res.redirect("/blogs");
		}

	})
});
// app.get("/blogs/:id", async(req, res) => {
// 	const id =  req.params.id;
// 	const oneBlog = await blog.findOne({_id : id}).populate("comments");
// 	console.log(oneBlog);
// 	res.send("ÖK");
// })
app.get("/blogs/:id",function(req,res){
	var id=req.params.id;
	blog.findOne({ _id: id },function(err,oneblog){
		
		
		if(err)
			{
				console.log("error");
				console.log(err);
			}
		else{
			res.render("show",{blog:oneblog});
		}
	}).populate("comments");
});

app.get("/blogs/:id/edit",isLoggedIn,function(req,res){
	var id=req.params.id;
	
	blog.findById(id,function(err,oneblog){
		if(err)
			{
				console.log("error");
			}
		else{
			
			res.render("update",{blog:oneblog});
		}
	})
});
app.put("/blogs/:id",function(req,res){
	var id=req.params.id;
	var newblog=req.body.blog 
	newblog.data=sanitize(newblog.data);
	blog.findByIdAndUpdate(id,newblog,function(err,bl){
		if(err){
			console.log("ërror");
		}
		else{
			res.redirect("/blogs");
		}
	})
});

app.delete("/blogs/:id",function(req,res){
	var id=req.params.id;
	
	blog.findByIdAndRemove(id,function(err,bl){
		if(err){
			console.log("ërror");
		}
		else{
			res.redirect("/blogs");
		}
	})
});

app.get("/register", function(req, res){
   res.render("register"); 
});
//handling user sign up
app.post("/register", function(req, res){
    user.register(new user({username: req.body.username,email:req.body.email,firstname:req.body.firstname,lastname:req.body.lastname}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
        
			res.redirect("/");
        });
    });
});
// LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
   res.render("login"); 
});
//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});
//////////////trying to insert comments
app.post("/blogs/:id/comments",function(req,res){
	
comments.create({comment:req.body.comment,author:req.user.firstname},function(err,comment){
		blog.findById(req.params.id,function(err,foundUser){
			if(err){console.log(err)}
			else{
				foundUser.comments.push(comment);
				foundUser.save();
			res.redirect("/blogs/"+req.params.id);
			}
		})
	})
	
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000,function(){
	console.log("started!!");
});