// Set up
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');

//Configuration
var mongoDB = 'mongodb://localhost/tailor'; //here tailor is database name to connect to
mongoose.connect(mongoDB); 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
 
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

var schema = mongoose.Schema;
 var tailorschema = new schema({
     customerName: {type: String, required:true, trim:true},
     // userName:{type:String, index:true, unique:true, required: true, trim:true},
     phone:Number,
     //email:String,
     createdDate:{ type: Date, default: Date.now },
     modifiedDate: { type: Date, default: Date.now },
     isDeleted: { type: Number, default: 0 },
     measurement:{
         neck: Number,
         wrist: Number,
         bicep: Number,
         waist: Number,
         armLength: Number,
         shoulderSeam:Number,
         shoulderToWaist:Number
     }
 })

 var tailors = mongoose.model('tailorConsumer', tailorschema);
 /*tailorschema.virtual('url').get(function(){
     return '/tailor/details/' + this._id;
 })*/


 //get all data
 //remember here tailors is the model

 app.get('/api/tailor', function(req, res){
     console.log("fetching details");

     tailors.find(function(err, detail){
         if(err)
         {
             res.send(err);
         }
         //res.send("working");
         res.json(detail);
     })
 });

 app.post('/api/tailor', function(req, res){
     console.log("creating review");
     tailors.create({
        customerName: req.body.customerName,
        phone: req.body.phone,
        measurement: {
            neck: req.body.neck,
            wrist: req.body.wrist,
            bicep: req.body.bicep,
            waist: req.body.waist,
            armLength: req.body.armLength,
            shoulderSeam:req.body.shoulderSeam,
            shoulderToWaist:req.body.shoulderToWaist,
        },
        done:false

     }, function(err, detail){
         if(err)
         {
             res.send(err);
         }
         //get all the customer values
         tailors.find(function(err, details){
             if(err)
                res.send(err)
            res.json(details);
         });
     });
 });

 app.listen(8080);
console.log("App listening on port 8080");