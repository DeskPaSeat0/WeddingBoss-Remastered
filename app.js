require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const passport = require("passport");
const session = require("express-session");
const MongoDBStore = require("express-mongodb-session")(session);
const passportLocal = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const port = process.env.PORT || 3000;
const { venuedata } = require("./public/testdata/venuedata.js");
const { photographydata } = require("./public/testdata/photographydata.js");
const { tailordata } = require("./public/testdata/tailordata.js");
const { hmuadata } = require("./public/testdata/hmuadata.js");
const { bridalcardata } = require("./public/testdata/bridalcardata.js");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const store = new MongoDBStore({
    uri: `${process.env.MONGO_URI}`,
    collection: 'sessions'
});

app.use(require('express-session')({
    secret: process.env.secret,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      },
    store: store,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.set("strictQuery", true);
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
}
// mongoose.connect("mongodb://127.0.0.1:27017/wbDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

const venueSchema = {
    key: Number,
    name: String,
    description: String,
    serviceImage: String
};

const photographSchema = {
    key: Number,
    name: String,
    description: String,
    serviceImage: String
};

const tailorSchema = {
    key: Number,
    name: String,
    description: String,
    serviceImage: String
};

const hmuaSchema = {
    key: Number,
    name: String,
    description: String,
    serviceImage: String
};

const bridalcarSchema = {
    key: Number,
    name: String,
    description: String,
    serviceImage: String
};

const userPackageSchema = {
    id: String,
    chosenVenue: {
        type: Number
    },
    chosenPhoto: {
        type: Number
    },
    chosenTailor: {
        type: Number
    },
    chosenHmua: {
        type: Number
    },
    chosenBridalcar: {
        type: Number
    },
    chosenPackType: String,
    weddingDate: Date,
    appointDate: Date,
    addInfo: String,
}

const tempUserPackageSchema = {
    id: String,
    chosenVenue: {
        type: Number
    },
    chosenPhoto: {
        type: Number
    },
    chosenTailor: {
        type: Number
    },
    chosenHmua: {
        type: Number
    },
    chosenBridalcar: {
        type: Number
    },
    chosenPackType: String
}

const Venue = mongoose.model("Venue", venueSchema);
const Photograph = mongoose.model("Photograph", photographSchema);
const Tailor = mongoose.model("Tailor", tailorSchema);
const Hmua = mongoose.model("Hmua", hmuaSchema);
const Bridalcar = mongoose.model("Bridalcar", bridalcarSchema);
const Userpackage = mongoose.model("Userpackage", userPackageSchema);
const Tempuserpackage = mongoose.model("Tempuserpackage", tempUserPackageSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
    const isLoggedIn = req.isAuthenticated();
    res.render("home", {loginStatus: isLoggedIn});
});

app.get("/home", function(req, res){
    const isLoggedIn = req.isAuthenticated();
    res.render("home", {loginStatus: isLoggedIn});
});


/* Wedding Services Endpoints */

app.get("/venue", function(req, res){
    const isLoggedIn = req.isAuthenticated();

    Venue.find({}, function(err, foundVenues){

        if(err)
        {
            res.render("venue", {
                venues: venuedata, loginStatus: isLoggedIn
            });
        }
        else
        {
            res.render("venue", {
                venues: foundVenues, loginStatus: isLoggedIn
            });
        }
    });
})

app.get("/photography", function(req, res){
    const isLoggedIn = req.isAuthenticated();
    Photograph.find({}, function(err, foundPhotographs){

        if(err)
        {
            res.render("photography", {
                photographers: photographydata, loginStatus: isLoggedIn
            });
        }
        else
        {
            res.render("photography", {
                photographers: foundPhotographs, loginStatus: isLoggedIn
            });
        }
    });
})

app.get("/tailor", function(req, res){
    const isLoggedIn = req.isAuthenticated();
    Tailor.find({}, function(err, foundTailors){

        if(err)
        {
            res.render("tailor", {
                tailors: tailordata, loginStatus: isLoggedIn
            });
        }
        else
        {
            res.render("tailor", {
                tailors: foundTailors, loginStatus: isLoggedIn
            });
        }
    });
})

app.get("/hmua", function(req, res){
    const isLoggedIn = req.isAuthenticated();
    Hmua.find({}, function(err, foundHmuas){

        if(err)
        {
            res.render("hmua", {
                hmuas: hmuadata, loginStatus: isLoggedIn
            });
        }
        else
        {
            res.render("hmua", {
                hmuas: foundHmuas, loginStatus: isLoggedIn
            });
        }
    });
})

app.get("/bridalcar", function(req, res){
    const isLoggedIn = req.isAuthenticated();
    Bridalcar.find({}, function(err, foundBridalcars){

        if(err)
        {
            res.render("bridalcar", {
                bridalcars: bridalcardata, loginStatus: isLoggedIn
            });
        }
        else
        {
            res.render("bridalcar", {
                bridalcars: foundBridalcars, loginStatus: isLoggedIn
            });
        }
    });
})

/* Login/Signup Endpoints */

app.get("/register", function(req, res){
    const isLoggedIn = req.isAuthenticated();
    res.render("register", {loginStatus: isLoggedIn});
});

app.get("/login", function (req, res){
    const isLoggedIn = req.isAuthenticated();
    res.render("login", {loginStatus: isLoggedIn});
});

app.post("/login", function(req, res){
    User.findOne({username: req.body.username}, function(err, foundUser){
        if(foundUser){
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });

        passport.authenticate("local", function(err, user){
            if(err){
                console.log(err);
            } 
            else 
            {
                if(user){
                    req.login(user, function(err){
                    res.redirect("/");
                });
                } 
                else 
                {
                    console.log("Login failed");
                    res.redirect("/login");
                }
            }
        })(req, res);
      } 
      else 
      {
        console.log("Login failed");
        res.redirect("/login")
      }
    });
  });



app.post("/register", function(req, res){

    User.register({username: req.body.username}, req.body.password, function(err, user){
        if(err)
        {
            console.log(err);
            res.redirect("/register");
        }
        else
        {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            });
        }
    });

});

app.get("/account", function(req, res){
    const isLoggedIn = req.isAuthenticated();
    const userId = req.user._id;

    if(isLoggedIn)
    {
        User.findOne({key: userId}, function(err, foundUser){
            if(!err)
            {
                Userpackage.findOne({id: userId}, function(error, foundPackInfo){
                    if(foundPackInfo)
                    {
                        if(!error)
                        {
                            const venueKey = foundPackInfo.chosenVenue;
                            const photoKey = foundPackInfo.chosenPhoto;
                            const tailorKey = foundPackInfo.chosenTailor;
                            const hmuaKey = foundPackInfo.chosenHmua;
                            const bridalcarKey = foundPackInfo.chosenBridalcar;
                            const packKey = foundPackInfo.chosenPackType;

                            Venue.findOne({key: venueKey}, function(err, foundVenues){
                    
                                Photograph.findOne({key: photoKey}, function(err, foundPhotographs){
                    
                                    Tailor.findOne({key: tailorKey}, function(err, foundTailors){
                    
                                        Hmua.findOne({key: hmuaKey}, function(err, foundHmuas){
                    
                                            Bridalcar.findOne({key: bridalcarKey}, function(err, foundBridalcars){

                                                const savedDetails = {
                                                    chosenVenue: foundVenues.name,
                                                    chosenPhoto: foundPhotographs.name,
                                                    chosenTailor: foundTailors.name,
                                                    chosenHmua: foundHmuas.name,
                                                    chosenBridalcar: foundBridalcars.name,
                                                    chosenPackType: packKey,
                                                    weddingDate: foundPackInfo.weddingDate,
                                                    appointDate: foundPackInfo.appointDate,
                                                    addInfo: foundPackInfo.addInfo
                                                };
                    
                                                console.log("Account Details retrieved.");
                                                res.render("account", {loginStatus: isLoggedIn, userDetails: foundUser, userPackDetails: savedDetails});
                                            });
                                        });
                                    });
                                });
                            });
                        }
                        else
                        {
                            console.log("There was an error with your saved package.");
                            res.render("home", {loginStatus: isLoggedIn});
                        }
                    }
                    else
                    {
                        const savedDetails2 = {
                            chosenVenue: "None",
                            chosenPhoto: "None",
                            chosenTailor: "None",
                            chosenHmua: "None",
                            chosenBridalcar: "None",
                            chosenPackType: "None",
                            weddingDate: "None",
                            appointDate: "None",
                            addInfo: ""
                        };

                        console.log("User has no package selected yet.");
                        res.render("account", {loginStatus: isLoggedIn, userDetails: foundUser, userPackDetails: savedDetails2});
                    }
                });
                // res.render("account", {loginStatus: isLoggedIn, userDetails: foundUser});
            }
            else
            {
                console.log("There was an error with the account.");
                res.render("home", {loginStatus: isLoggedIn});
            }
        });
    }
    else
    {
        res.render("register", {loginStatus: isLoggedIn});
    }
})

app.get("/selectcustompack", function(req, res){
    const isLoggedIn = req.isAuthenticated();

    var venueList = [];
    var photoList = [];
    var tailorList = [];
    var hmuaList = [];
    var bridalcarList = [];

    if(isLoggedIn)
    {
        Venue.find({}, function(err, foundVenues){
            foundVenues.forEach(function(venueitem){
                venueList.push(venueitem);
            });

            Photograph.find({}, function(err, foundPhotographs){
                foundPhotographs.forEach(function(photoitem){
                    photoList.push(photoitem);
                });

                Tailor.find({}, function(err, foundTailors){
                    foundTailors.forEach(function(tailoritem){
                        tailorList.push(tailoritem);
                    });

                    Hmua.find({}, function(err, foundHmuas){
                        foundHmuas.forEach(function(hmuaitem){
                            hmuaList.push(hmuaitem);
                        });

                        Bridalcar.find({}, function(err, foundBridalcars){
                            foundBridalcars.forEach(function(bridalcaritem){
                                bridalcarList.push(bridalcaritem);
                            });

                            res.render("selectcustompack", {loginStatus: isLoggedIn, venues: 
                                venueList, photos: photoList, tailors: tailorList, 
                                hmuas: hmuaList, bridalcars: bridalcarList});
                        });
                    });
                });
            });
        });
    }
    else
    {
        res.render("login", {loginStatus: isLoggedIn});
    }
});

app.post("/selectcustompack", function(req, res){
    const isLoggedIn = req.isAuthenticated();

    const userId = req.user._id;
    const selectVenue = req.body.tVenues;
    const selectPhoto = req.body.tPhotos;
    const selectTailor = req.body.tTailors;
    const selectHmua = req.body.tHmuas;
    const selectBridalcar = req.body.tBridalcars;
    const selectPackType = req.body.tpackType;

    const tempuserpack = new Tempuserpackage({
        id: userId,
        chosenVenue: selectVenue,
        chosenPhoto: selectPhoto,
        chosenTailor: selectTailor,
        chosenHmua: selectHmua,
        chosenBridalcar: selectBridalcar,
        chosenPackType: selectPackType
    });

    const temp2Details = {
        id: userId,
        chosenVenue: selectVenue,
        chosenPhoto: selectPhoto,
        chosenTailor: selectTailor,
        chosenHmua: selectHmua,
        chosenBridalcar: selectBridalcar,
        chosenPackType: selectPackType
    };

    Tempuserpackage.findOne({id: userId}, function(err, foundPack){
        if(!err)
        {
            if(!foundPack)
            {
                tempuserpack.save(function(error){
                    if(!error)
                    {
                        const venueKey = temp2Details.chosenVenue;
                        const photoKey = temp2Details.chosenPhoto;
                        const tailorKey = temp2Details.chosenTailor;
                        const hmuaKey = temp2Details.chosenHmua;
                        const bridalcarKey = temp2Details.chosenBridalcar;
                        const packKey = temp2Details.chosenPackType;

                        Venue.findOne({key: venueKey}, function(err, foundVenues){
                
                            Photograph.findOne({key: photoKey}, function(err, foundPhotographs){
                
                                Tailor.findOne({key: tailorKey}, function(err, foundTailors){
                
                                    Hmua.findOne({key: hmuaKey}, function(err, foundHmuas){
                
                                        Bridalcar.findOne({key: bridalcarKey}, function(err, foundBridalcars){

                                            const savedDetails = {
                                                chosenVenue: foundVenues.name,
                                                chosenPhoto: foundPhotographs.name,
                                                chosenTailor: foundTailors.name,
                                                chosenHmua: foundHmuas.name,
                                                chosenBridalcar: foundBridalcars.name,
                                                chosenPackType: packKey
                                            };
                
                                            res.render("finalizepack", {loginStatus: isLoggedIn, packDetails: savedDetails});
                                        });
                                    });
                                });
                            });
                        });
                    }
                    else
                    {
                        console.log(error);
                        res.render("selectcustompack", {loginStatus: isLoggedIn});
                    }
                });
            }
            else
            {
                const venueKey = foundPack.chosenVenue;
                const photoKey = foundPack.chosenPhoto;
                const tailorKey = foundPack.chosenTailor;
                const hmuaKey = foundPack.chosenHmua;
                const bridalcarKey = foundPack.chosenBridalcar;
                const packKey = foundPack.chosenPackType;

                Venue.findOne({key: venueKey}, function(err, foundVenues){
        
                    Photograph.findOne({key: photoKey}, function(err, foundPhotographs){
        
                        Tailor.findOne({key: tailorKey}, function(err, foundTailors){
        
                            Hmua.findOne({key: hmuaKey}, function(err, foundHmuas){
        
                                Bridalcar.findOne({key: bridalcarKey}, function(err, foundBridalcars){

                                    const savedDetails = {
                                        chosenVenue: foundVenues.name,
                                        chosenPhoto: foundPhotographs.name,
                                        chosenTailor: foundTailors.name,
                                        chosenHmua: foundHmuas.name,
                                        chosenBridalcar: foundBridalcars.name,
                                        chosenPackType: packKey
                                    };
        
                                    res.render("finalizepack", {loginStatus: isLoggedIn, packDetails: savedDetails});
                                });
                            });
                        });
                    });
                });
            }
        }
        else
        {
            console.log(err);
        }
    });
});

app.get("/finalizepack", function(req, res){
    const isLoggedIn = req.isAuthenticated();
    const userId = req.user._id;

    if(isLoggedIn)
    {
        Tempuserpackage.findOne({id: userId}, function(err, foundUser){
            if(foundUser)
            {
                if(!err)
                {
                    const venueKey = foundUser.chosenVenue;
                    const photoKey = foundUser.chosenPhoto;
                    const tailorKey = foundUser.chosenTailor;
                    const hmuaKey = foundUser.chosenHmua;
                    const bridalcarKey = foundUser.chosenBridalcar;
                    const packKey = foundUser.chosenPackType;

                    Venue.findOne({key: venueKey}, function(err, foundVenues){
            
                        Photograph.findOne({key: photoKey}, function(err, foundPhotographs){
            
                            Tailor.findOne({key: tailorKey}, function(err, foundTailors){
            
                                Hmua.findOne({key: hmuaKey}, function(err, foundHmuas){
            
                                    Bridalcar.findOne({key: bridalcarKey}, function(err, foundBridalcars){

                                        const savedDetails = {
                                            chosenVenue: foundVenues.name,
                                            chosenPhoto: foundPhotographs.name,
                                            chosenTailor: foundTailors.name,
                                            chosenHmua: foundHmuas.name,
                                            chosenBridalcar: foundBridalcars.name,
                                            chosenPackType: packKey
                                        };
            
                                        res.render("finalizepack", {loginStatus: isLoggedIn, packDetails: savedDetails});
                                    });
                                });
                            });
                        });
                    });
                }
                else
                {
                    console.log("There was an error with your selected package.");
                    res.render("selectpack");
                }
            }
            else
            {
                console.log("User has no package selected yet.");
                res.render("selectpack");
            }
        })

        res.render("finalizepack", {loginStatus: isLoggedIn})
    }
    else
    {
        res.render("login", {loginStatus: isLoggedIn});
    }
    
})

app.post("/finalizepack", function(req, res){
    const isLoggedIn = req.isAuthenticated();
    const userId = req.user._id;

    Tempuserpackage.findOne({id: userId}, function (err, foundUser){
        if(!err)
        {
            const pickedVenue = foundUser.chosenVenue;
            const pickedPhoto = foundUser.chosenPhoto;
            const pickedTailor = foundUser.chosenTailor;
            const pickedHmua = foundUser.chosenHmua;
            const pickedBridalcar = foundUser.chosenBridalcar;

            const userpack = new Userpackage({
                id: userId,
                chosenVenue: pickedVenue,
                chosenPhoto: pickedPhoto,
                chosenTailor: pickedTailor,
                chosenHmua: pickedHmua,
                chosenBridalcar: pickedBridalcar,
                chosenPackType: foundUser.chosenPackType,
                weddingDate: req.body.wedDate,
                appointDate: req.body.appDate,
                addInfo: req.body.finalAddInfo
            });

            console.log(foundUser);

            userpack.save(function(error){
                if(!error)
                {
                    Tempuserpackage.deleteOne({id: userId}, function(error2){
                        if(!error2)
                        {
                            console.log("Deleted...");
                        }
                        else
                        {
                            console.log(error2);
                            console.log("Not deleted fam...");
                        }
                    });
                    console.log("Package successfully placed.");
                    res.render("home", {loginStatus: isLoggedIn});
                }
                else
                {
                    console.log(error);
                    res.render("home", {loginStatus: isLoggedIn});
                }
            });
        }
        else
        {
            console.log(err);
            res.render("home", {loginStatus: isLoggedIn});
        }
    });
})

app.get("/selectpremadepack", function(req, res){
    const isLoggedIn = req.isAuthenticated();
    var venueList = [];
    var photoList = [];
    var tailorList = [];
    var hmuaList = [];
    var bridalcarList = [];

    if(isLoggedIn)
    {
        Venue.find({}, function(err, foundVenues){
            foundVenues.forEach(function(venueitem){
                venueList.push(venueitem);
            });

            Photograph.find({}, function(err, foundPhotographs){
                foundPhotographs.forEach(function(photoitem){
                    photoList.push(photoitem);
                });

                Tailor.find({}, function(err, foundTailors){
                    foundTailors.forEach(function(tailoritem){
                        tailorList.push(tailoritem);
                    });

                    Hmua.find({}, function(err, foundHmuas){
                        foundHmuas.forEach(function(hmuaitem){
                            hmuaList.push(hmuaitem);
                        });

                        Bridalcar.find({}, function(err, foundBridalcars){
                            foundBridalcars.forEach(function(bridalcaritem){
                                bridalcarList.push(bridalcaritem);
                            });

                            res.render("selectpremadepack", {loginStatus: isLoggedIn, venues: 
                                venueList, photos: photoList, tailors: tailorList, 
                                hmuas: hmuaList, bridalcars: bridalcarList});
                        });
                    });
                });
            });
        });
    }
    else
    {
        res.render("login", {loginStatus: isLoggedIn});
    }
});

app.post("/selectpremadepack", function(req, res){
    const isLoggedIn = req.isAuthenticated();
    const userId = req.user._id;

    const packValue = req.body.premade;
    const selectPackType = req.body.tpackType;

    const tempuserpack = new Tempuserpackage({
        id: userId,
        chosenVenue: packValue,
        chosenPhoto: packValue,
        chosenTailor: packValue,
        chosenHmua: packValue,
        chosenBridalcar: packValue,
        chosenPackType: selectPackType
    });

    const temp2Details = {
        id: userId,
        chosenVenue: packValue,
        chosenPhoto: packValue,
        chosenTailor: packValue,
        chosenHmua: packValue,
        chosenBridalcar: packValue,
        chosenPackType: selectPackType
    };

    Tempuserpackage.findOne({id: userId}, function(err, foundPack){
        if(!err)
        {
            if(!foundPack)
            {
                tempuserpack.save(function(error){
                    if(!error)
                    {
                        const venueKey = temp2Details.chosenVenue;
                        const photoKey = temp2Details.chosenPhoto;
                        const tailorKey = temp2Details.chosenTailor;
                        const hmuaKey = temp2Details.chosenHmua;
                        const bridalcarKey = temp2Details.chosenBridalcar;
                        const packKey = temp2Details.chosenPackType;

                        Venue.findOne({key: venueKey}, function(err, foundVenues){
                
                            Photograph.findOne({key: photoKey}, function(err, foundPhotographs){
                
                                Tailor.findOne({key: tailorKey}, function(err, foundTailors){
                
                                    Hmua.findOne({key: hmuaKey}, function(err, foundHmuas){
                
                                        Bridalcar.findOne({key: bridalcarKey}, function(err, foundBridalcars){

                                            const savedDetails = {
                                                chosenVenue: foundVenues.name,
                                                chosenPhoto: foundPhotographs.name,
                                                chosenTailor: foundTailors.name,
                                                chosenHmua: foundHmuas.name,
                                                chosenBridalcar: foundBridalcars.name,
                                                chosenPackType: packKey
                                            };
                
                                            res.render("finalizepack", {loginStatus: isLoggedIn, packDetails: savedDetails});
                                        });
                                    });
                                });
                            });
                        });
                    }
                    else
                    {
                        console.log(error);
                        res.render("selectpremadepack", {loginStatus: isLoggedIn});
                    }
                });
            }
            else
            {
                const venueKey = foundPack.chosenVenue;
                const photoKey = foundPack.chosenPhoto;
                const tailorKey = foundPack.chosenTailor;
                const hmuaKey = foundPack.chosenHmua;
                const bridalcarKey = foundPack.chosenBridalcar;
                const packKey = foundPack.chosenPackType;

                Venue.findOne({key: venueKey}, function(err, foundVenues){
        
                    Photograph.findOne({key: photoKey}, function(err, foundPhotographs){
        
                        Tailor.findOne({key: tailorKey}, function(err, foundTailors){
        
                            Hmua.findOne({key: hmuaKey}, function(err, foundHmuas){
        
                                Bridalcar.findOne({key: bridalcarKey}, function(err, foundBridalcars){

                                    const savedDetails = {
                                        chosenVenue: foundVenues.name,
                                        chosenPhoto: foundPhotographs.name,
                                        chosenTailor: foundTailors.name,
                                        chosenHmua: foundHmuas.name,
                                        chosenBridalcar: foundBridalcars.name,
                                        chosenPackType: packKey
                                    };
        
                                    res.render("finalizepack", {loginStatus: isLoggedIn, packDetails: savedDetails});
                                });
                            });
                        });
                    });
                });
            }
        }
        else
        {
            console.log(err);
        }
    });
});

app.get("/selectpack", function(req, res){
    const isLoggedIn = req.isAuthenticated();

    if(isLoggedIn)
    {
        res.render("selectpack", {loginStatus: isLoggedIn})
    }
    else
    {
        res.render("login", {loginStatus: isLoggedIn});
    }
});

app.get("/logout", function(req, res){
    req.logout(function(err){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/");
        }
    })
});

connectDB().then(() => {
    app.listen(port, function(){
        console.log("Server successfully started on Port" + port);
    });
});