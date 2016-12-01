var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();


app.set('port',process.env.port || 3000);
app.set('view engine', 'ejs');
app.set('views','app/views');


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 



//Set title
app.locals.siteTitle = 'Payroll System';
app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/api'));

/********************* Using MongoDB to store Data **************************/

mongoose.connect('mongodb://localhost/payroll');

var Schema = mongoose.Schema;
// Creates a User Schema. This will be the basis of how user data is stored in the db

var PayrollSchema = new Schema({
	transactionID :{type: String, required: true},
	name: {type: String, required: true},
	date: {type: String, required: true},
	frequency : {type: String, required: true},
	annual : {type: String, required: true},
	gross: {type: String, required: true},
	tax : {type: String, required: true},
	net : {type: String, required: true},
	super: {type: String, required: true},
	pay : {type: String, required: true},
	created_at: Date
});

var Payroll = mongoose.model('Payroll', PayrollSchema); 


// make this available to our users in our Node applications
module.exports = Payroll;

/********************* Process Payment **************************/

app.post('/transaction',function(req,res){
	//res.setHeader('Content-Type', 'application/json');
	var transactionNumber = req.body.transaction;
	var paydate = req.body.date;
	var frequency = req.body.frequency;
	var annual = req.body.annual;
	var gross = req.body.gross;
	var tax = req.body.tax;
	var net_income = req.body.net;
	var super_income = req.body.super;
	var pay = req.body.pay;
	var customer = req.body.customer;

	var transaction  = new Payroll({
		transactionID : transactionNumber,
		name : customer,
		date : paydate,
		frequency: frequency,
		annual : annual,
		gross : gross,
		tax : tax,
		net : net_income,
		super : super_income,
		pay: pay
	});	


	Payroll.find({transactionID : transactionNumber},function(err,user){
		if (err){
			throw err;	
		}
		if(!user.length){
			transaction.save(function(error) {
				if(error){
					throw error;
					//Redirect to the report page with message
				}
				else{
					
					res.render('successful');
				}
			});
		}
		else{
			var date_submit = paydate.split(" ");
			var month_submit = date_submit[1];
			var year_submit = date_submit[2];
			var date_record = user[0].date.split(" ");
			var month_record = date_record[1];
			var year_record = date_record[2];
			var months = [];
			
			//Get all the month in the database
			for(var i =0; i< user.length;i++){
				var date_test = user[i].date.split(" ")
				var month_test = date_test[1];
				var year_test = date_test[2];
				months.push(month_test);
			}
			
			if(year_submit.localeCompare(year_record) ==0 ){
				if(months.indexOf(month_submit) != -1 ){
					res.render('error');
				}
				else{
					//Make the payment transaction and save to database
					
					transaction.save(function(error) {
						if(error){
							throw error;
							//Redirect to the report page with message
						}
						else{
							res.render('successful');
						}
					});
				}
			}
			else{

				transaction.save(function(error) {
					if(error){
						throw error;
					}
					else{
						res.render('successful');
					}
				});
				
			}
		}
	});
});


/***********************************************/
//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.render('404');
});


app.listen(app.get('port'),function(){
	console.log('Listening on port '+app.get('port'));
});


