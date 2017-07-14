// let express = require("express");
// let app = express();
// app.listen(300);

// app.get("/", function(req, res) {
// 	// body...
// 	res.send("trang chu");
// });
let http = require('http');
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/mydb";


let start;


let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let server = http.createServer(app);

app.use(bodyParser.json());

app.get('/', function(req,res) {

	res.send("show data");
});
app.post('/data', function(req, res) {
    	let t = req.body.t,
        h = req.body.h, 
        time_sensor_read = start;
    let currentTime = (new Date().getTime());
    let time_server = new Date(currentTime);
    // res.send("temperature: "+ t+". Humidity: "+ h);
		    MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  let myobj = { temperature: t, Humidity: h, time_server: time_server, time_sensor: time_sensor_read};
		  db.collection("info").insertOne(myobj, function(err, res) {
		    if (err) throw err;
		    console.log("1 record inserted");
		    db.close();
		  });
		});
	res.send("ok");
});
app.get('/data', function(req, res) {
	// body...
	MongoClient.connect(url, function(err, db) {
  		// assert.equal(null, err);
  		db.collection('info').find().sort({time_server : -1}).limit(5).toArray(
  			function(err, items){
  				// assert.equal(null, err);
    			if(items.length == 0)
    				res.send("<h1>no data!</h1>");
    			else {
            let str = "";
            for (var i = 0; i < 5; i++) {
            
            let t_server ="";
            t_server += items[i].time_server.getHours() + ":";
            t_server += items[i].time_server.getMinutes() +":";
            t_server += items[i].time_server.getSeconds();


            let h = items[i].Humidity;
            let t = items[i].temperature;
           
            let t_sensor ="";
            t_sensor += items[i].time_sensor.getHours() + ":";
            t_sensor += items[i].time_sensor.getMinutes() +":";
            t_sensor += items[i].time_sensor.getSeconds();


            str+="Humidity: "+ h + " Temperature: " + t + " ***** " + "time_server: " + t_server + " ***** " + "time_sensor: " + t_sensor + "<br>";
            }
            // let scr = "<script type='text/javascript'>alert('abc');</script>";
    				res.send(str);
    			}
    			db.close();
  			}
  		);
  
	});	
});

app.get('/time', function(req, res) {
  // body...
  let currentTime = (new Date().getTime());
  start = new Date(currentTime);
    // let hours = currentTime.getHours();
    // let minutes = currentTime.getMinutes();
    // let seconds = currentTime.getSeconds();
    // let str = "";
    // str+= hours + ":";
    // str+= minutes + ":";
    // str+= seconds;
  //   console.log(str);
  // res.send(str);
});
server = app.listen(3333, function () {
   let host = server.address().address
   let port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})


