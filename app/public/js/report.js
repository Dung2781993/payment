$(function(){
	//$.getJSON('api');
	$('#payslip-form').submit(function(e){
		e.preventDefault();

		console.log($('#firstname').val());
	
		$.post('api', {
			firstname: $('#firstname').val(),
			lastname: $('#lastname').val(),
			salary : $('#salary').val(),
			transaction : $('#transactionumber').val(),
			rate : $('#rate').val()
		},updateReport);
	});
	

	function updateReport(data) {
		//Get Date Submission
		var dateObj = new Date();
		var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
		var month = monthNames[dateObj.getMonth()];
		var day = dateObj.getDate();
		var year = dateObj.getFullYear();
		var date = day + " " + month + " " + year;
		var salary_form  =  $('#salary').val();
		var rate_form = $('#rate').val();
		var firstname = $('#firstname').val();
		var lastname = $('#lastname').val();
		var transaction = $('#transactionumber').val();
		var output = '';

		var payment  = calculation(salary_form,rate_form);

		
		$.each(data,function(key, item) {

			output += '<h1 style="margin-bottom: 10px;">Payslip</h1>';
			output += '<form method="POST" action="/transaction" id="payment">';
			output += '		<h2 class="col-md-6 col-md-offset-3">';
			output += '			<input type="text" for="customer"  value="'+ firstname+' '+ lastname +'" name="customer" class="control-label report" style="text-align: center;"  readonly="readonly">';
			output += '		</h2>';
			output += '		<div class="form-group">';
			output += '			<div class="col-md-6 col-md-offset-3" style="border-style: solid; border-width: 1px;">';
			output += '			   <div class="col-md-7">';
			output += '					<label for="transaction" class="col-sm-6 control-label">Transaction Number</label>';
			output += '			   </div>';
			output += '            <div class="col-md-5"> ';
			output += '               	<input type="text" for="transaction"  value="'+ transaction +'" name="transaction" class="col-sm-12 control-label report"  readonly="readonly">';
			output += '            </div>'; 
			output += '            <div class="col-md-7">';
			output += '            		<label for="paydate" class="col-sm-6 control-label">Pay Date</label>';
			output += '            </div>';
			output += '            <div class="col-md-5"> ';
			output += '               	<input type="text" for="pay-date" value="'+ date +'" name="date" class="col-sm-12 control-label report" readonly="readonly">';
			output += '            </div>'; 
			output += '            <div class="col-md-7">';
			output += '            		<label for="payfrequency" class="col-sm-6 control-label">Pay Frequency</label>';
			output += '            </div>';
			output += '            <div class="col-md-5"> ';
			output += '               	<input type="text" for="pay-frequency" value="Monthly" name="frequency" class="col-sm-12 control-label report" readonly="readonly">';
			output += '            </div>';
			output += '            <div class="col-md-7">';
			output += '            		<label for="annualincome" class="col-sm-6 control-label">Annual Income</label>';
			output += '            </div>';
			output += '            <div class="col-md-5"> ';
			output += '               	<input type="text" for="annual-income" value="'+ payment[0] +'" name="annual" class="col-sm-12 control-label report" readonly="readonly">';
			output += '            </div>';
			output += '            <div class="col-md-7">';
			output += '            		<label for="grossincome" class="col-sm-6 control-label">Gross Income</label>';
			output += '            </div>';
			output += '            <div class="col-md-5"> ';
			output += '               	<input type="text" for="gross-income" value="'+ payment[1] +'" name="gross" class="col-sm-12 control-label report" readonly="readonly">';
			output += '            </div>'; 
			output += '            <div class="col-md-7">';
			output += '            		<label for="incometax" class="col-sm-6 control-label">Income Tax</label>';
			output += '            </div>';
			output += '            <div class="col-md-5"> ';
			output += '               	<input type="text" for="income-tax" value="'+ payment[2] +'" name="tax" class="col-sm-12 control-label report" readonly="readonly">';
			output += '            </div>';
			output += '            <div class="col-md-7">';
			output += '            		<label for="netincome" class="col-sm-6 control-label">Net Income</label>';
			output += '            </div>';
			output += '            <div class="col-md-5"> ';
			output += '               	<input type="text" for="net-income" value="'+ payment[3] +'" name="net" class="col-sm-12 control-label report" readonly="readonly">';
			output += '            </div>';
			output += '            <div class="col-md-7">';
			output += '            		<label for="super" class="col-sm-6 control-label">Super</label>';
			output += '            </div>';
			output += '            <div class="col-md-5"> ';
			output += '               	<input type="text" for="super" value="'+ payment[4] +'" name="super" class="col-sm-12 control-label report" readonly="readonly">';
			output += '            </div>';
			output += '            <div class="col-md-7">';
			output += '            		<label for="pay" class="col-sm-6 control-label">Pay</label>';
			output += '            </div>';
			output += '            <div class="col-md-5"> ';
			output += '               	<input type="text" for="pay" value="'+ payment[5] +'" name="pay" class="col-sm-12 control-label report" readonly="readonly">';
			output += '            </div>';
			output += '        </div>';
			output += '		   <div class="col-md-5 col-md-offset-6 ">';
			output += '			  	<button id="pay-submit" class="btn btn-info" type="submit" style="width: 120px; margin-top: 10px;">Pay</button>';
			output += '		   </div>';
			output += '    </div>';
			output += '</form>';

		});
		

		//Calculate Payslip
		function calculation(salary,rate){
			var tax_income;
			var tax_number;
			var annual = '$ '+ salary + '.00';
			var gross_number = salary/12;
			var gross_income = '$ '+ Math.round(salary/12) + '.00';
			var super_number = (gross_number * rate)/100 ;
			var super_income = '$ '+ Math.round(super_number) + '.00';

			if(0 < salary && salary < 18200){
				tax_number = 0;
				tax_income = '$ '+ tax_number + '.00';
			}
			else if(18201 < salary && salary < 37000)
			{
				tax_number = ((salary - 18200)* 0.19)/12;
				tax_income = '$ '+ Math.round( tax_number ) + '.00';	
			}
			else if(37001 < salary && salary < 80000)
			{
				tax_number = (3572 + (salary - 37000)* 0.325)/12;
				tax_income = '$ '+ Math.round(tax_number) + '.00';	
			}
			else if(80001 < salary  && salary < 180000)
			{
				tax_number = (17547 + (salary - 80000)* 0.37)/12;
				tax_income = '$ '+ Math.round(tax_number) + '.00';	
			}
			else if ( salary  > 180001)
			{
				tax_number = (54547 + (salary - 180000)* 0.45)/12;
				tax_income = '$ '+ Math.round( tax_number ) + '.00';
			}
			
			var net_number = gross_number - tax_number;
			var net_income =  '$ '+ Math.round(gross_number - tax_number) + '.00';
			var pay_number =  '$ '+ Math.round(net_number - super_number ) + '.00';



			var payslip = [annual,gross_income, tax_income,net_income,super_income,pay_number];
			return payslip;
		}
	
		$('.report-messages').html(output);	
	}
});	