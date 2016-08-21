/*
* ========================================
*	BUDGET REPORT APP
* ========================================
*/
var finance_container = document.getElementById('finance-container');
var report_container = document.getElementById('report-container');
var negative_cashflow_container = document.getElementById('negative-cashflow-container');

var month = document.getElementById('month');
var currency = document.getElementById('currency');

var income_form = document.getElementById('add-income-form');
var income_output = document.getElementById('income-output');
var income_name_input = document.getElementById('income-name');
var income_value_input = document.getElementById('income-value');
var income_name_output = document.getElementById('income-name-output');
var income_value_output = document.getElementById('income-value-output');
var new_income_button = document.getElementById('add-new-income');
var total_income_output = document.getElementById('total-income-value-output');
var total_income = [];
var total_income_label = [];

var expense_form = document.getElementById('add-expense-form');
var expense_output = document.getElementById('expense-output');
var expense_name_input = document.getElementById('expense-name');
var expense_name_output = document.getElementById('expense-name-output');
var expense_value_input = document.getElementById('expense-value');
var expense_value_output = document.getElementById('expense-value-output');
var new_expense_button = document.getElementById('add-new-expense');
var total_expense_output = document.getElementById('total-expense-value-output');
var total_expense = [];
var total_expense_label = [];

var cashflow = 0;
var cashflow_output = document.getElementById('cashflow-output');

var loan = false;

var total_income_color = [];
var total_expense_color = [];

var new_total_income = 0;
var new_total_expense = 0;

var income_analysis_output = document.getElementById('income-analysis');
var cashflow_analysis_output = document.getElementById('cashflow-analysis');

var income_name_input_valid = false;
var income_value_input_valid = false;
var expense_name_input_valid = false;
var expense_value_input_valid = false;

var month_saved	= false;
var currency_saved = false;
var total_income_saved = false;
var total_income_label_saved = false;
var total_expense_saved	= false;
var total_expense_label_saved = false;
var cashflow_saved = false;

var month_retrieved;
var currency_retrieved;
var cashflow_retrieved;
var total_income_label_retrieved; 	
var total_income_retrieved; 			
var total_expense_label_retrieved; 	
var total_expense_retrieved;

var create_new_report_btn = document.getElementById('create_new_report_btn');

// Check to see if there is a saved version
if(sessionStorage.getItem('cashflow') != null) {
	month_saved	= true;
	currency_saved = true;
	total_income_saved = true;
	total_income_label_saved = true;
	total_expense_saved	= true;
	total_expense_label_saved = true;
	cashflow_saved = true;
} else {
	month_saved = false;
	currency_saved = false;
	total_income_saved = false;
	total_income_label_saved = false;
	total_expense_saved = false;
	total_expense_label_saved = false;
	cashflow_saved = false;
}

/*
* ========================================
*	APP LOGIC
* ========================================
*/

create_new_report_btn.addEventListener('click', function() {
	sessionStorage.clear();
});

function new_income() {

	var income_name = document.getElementById('income-name').value.toUpperCase();		
		
	var income_value = parseInt(document.getElementById('income-value').value, 10);
	

	if(income_name == "LOAN" || income_name == "BORROW") {
		loan = true;
	}

	if(income_name_input.value == "") {
		alert("Please type the name of your income.");
		income_name_input.focus();
	} else if (income_value_input.value == "") {
		alert("Please type the value of your income.");
		income_value_input.focus();
	} else {

		total_income_label.push(income_name);
		total_income.push(income_value);

		//show output
		income_output.style.display = "block";

		//output the input with new line each time
		var new_income_item1 = document.createElement('p');
		var new_income_item2 = document.createElement('p');

		var new_income_name = document.createTextNode(income_name);
		var new_income_value = document.createTextNode(income_value);	

		new_income_item1.appendChild(new_income_name);
		new_income_item2.appendChild(new_income_value);

		income_name_output.appendChild(new_income_item1);
		income_value_output.appendChild(new_income_item2);
		
		get_total_income();
		get_cashflow();
		income_form.reset();
		income_name_input.focus();

		//remove an element
		removeIncome(new_income_item1, new_income_item2);
	}//endif

}


function new_expense() {
	var expense_name = document.getElementById('expense-name').value.toUpperCase();
	var expense_value = parseInt(document.getElementById('expense-value').value, 10);
	
	if(expense_name_input.value == "") {
		alert("Please type the name of your expense.");
		expense_name_input.focus();
	} else if (expense_value_input.value == "") {
		alert("Please type the value of your expense.");
		expense_value_input.focus();
	} else {


		total_expense_label.push(expense_name);
		total_expense.push(expense_value);
		

		//show output
		expense_output.style.display = "block";

		//output the input with new line each time
		var new_expense_item1 = document.createElement('p');
		var new_expense_item2 = document.createElement('p');

		var new_expense_name = document.createTextNode(expense_name);
		var new_expense_value = document.createTextNode(expense_value);

		new_expense_item1.appendChild(new_expense_name);
		new_expense_item2.appendChild(new_expense_value);

		expense_name_output.appendChild(new_expense_item1);
		expense_value_output.appendChild(new_expense_item2);
		
		get_total_expense();
		get_cashflow();
		expense_form.reset();
		expense_name_input.focus();

		//remove an element
		removeExpense(new_expense_item1, new_expense_item2);
	}//endif
		
}

function get_total_income() {
	var total = 0;

	for(i in total_income) {
		total = total + total_income[i];
	}

	total_income_output.innerHTML = total;

	if(isNaN(total_income[0])) {
		console.log('failed to save total_income');	
	} else if(total_income[0] == "") {
		save('total_income', 0);
		console.log('total_income was saved as ZERO');
	} else {
		save('total_income', JSON.stringify(total_income));
		console.log('total_income was saved');
		total_income_saved = true;
	}

	if(total_income_label < 1) {
		console.log('failed to save total_income_label');
	} else {
		save('total_income_label', JSON.stringify(total_income_label));
		console.log('total_income_label was saved');
		total_income_label_saved = true;
	}
	
	return total;	

}

function get_total_expense() {
	var total = 0;

	for(i in total_expense) {
		total = total + total_expense[i];
	}

	total_expense_output.innerHTML = total;	

	if(isNaN(total_expense[0])) {
		console.log('failed to save total_expense');	
	} else if(total_expense[0] == "") {
		save('total_expense', 0);
		console.log('total_expense was saved as ZERO');
	} else {
		save('total_expense', JSON.stringify(total_expense));
		console.log('total_expense was saved');
		total_expense_saved = true;
	}

	if(total_expense_label < 1) {
		console.log('failed to save total_expense_label');
	} else {
		save('total_expense_label', JSON.stringify(total_expense_label));
		console.log('total_expense_label was saved');
		total_expense_label_saved = true;
	}

	return total;	

}


function get_cashflow() {

	new_total_income = get_total_income();
	new_total_expense = get_total_expense();

	cashflow = new_total_income - new_total_expense;

	// Save the cashflow value
	if(cashflow != null) {
		save('cashflow', cashflow);
		console.log('cashflow was saved');
		cashflow_saved = true;
	} else {
		console.log('failed to save cashflow');
		cashflow_saved = false;
	}

	// Output the cashflow
		if(cashflow > 0) {
			cashflow_output.innerHTML = "+ " + cashflow;
			cashflow_output.style.color = "green";
		} else if (cashflow === 0) {
			cashflow_output.innerHTML = cashflow;
		} else {
			cashflow_output.innerHTML = cashflow;
			cashflow_output.style.color = "red";
		}	
	

	return cashflow;

}; 


function removeIncome(e, f) {
    var removeItem = document.createElement('span');
    var removeItemText = document.createTextNode('-');  
    var x = (Math.floor(Math.random() * 256));
    removeItem.setAttribute("id", "remove-button" + x);
    removeItem.setAttribute("class", "remove-button");
    removeItem.addEventListener('click', function() {

    	var a = prompt('Type DELETE to confirm').toUpperCase();

    	if (a === "DELETE") {
    		e.parentNode.removeChild(e);
        	f.parentNode.removeChild(f);
    	 
        
    	// remove the income from the total_income array
        var income_value_removed = parseInt(f.innerText, 10);
        var index = total_income.indexOf(income_value_removed);
        total_income.splice(index, 1);

        // remove the income label from the total_income_label array
        var income_label_removed = e.innerText;
        var index_income_label = total_income_label.indexOf(income_label_removed);
        total_income_label.splice(index_income_label, 1);

        get_total_income();
        get_cashflow();

        }

    }, false);

    f.appendChild(removeItem);
    removeItem.appendChild(removeItemText);
}

function removeExpense(e, f) {
    var removeItem = document.createElement('p');
    var removeItemText = document.createTextNode('-');
    var x = (Math.floor(Math.random() * 256));
    removeItem.setAttribute("id", "remove-button" + x);
    removeItem.setAttribute("class", "remove-button");
    removeItem.addEventListener('click', function() {

    	var a = prompt('Type DELETE to confirm').toUpperCase();

    	if (a === "DELETE") {
    		e.parentNode.removeChild(e);
        	f.parentNode.removeChild(f);
    	 

        // remove the expense value from the total_expense array
        var expense_value_removed = parseInt(f.innerText, 10);
        var index_expense = total_expense.indexOf(expense_value_removed);
        total_expense.splice(index_expense, 1);

        // remove the expense label from the total_expense_label array
        var expense_label_removed = e.innerText;
        var index_expense_label = total_expense_label.indexOf(expense_label_removed);
        total_expense_label.splice(index_expense_label, 1);

        get_total_expense();

        get_cashflow();

        }

    }, false);
    f.appendChild(removeItem);
    removeItem.appendChild(removeItemText);
}

function get_random_color() { 		
	var random_color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
	
	return random_color;
}

function show_report() {

		document.getElementById('finance-container').style.display = 'none';
		document.getElementById('report-container').style.display = 'block';
		document.getElementById('negative-cashflow-container').style.display = 'none';

		document.getElementById('report-button').style.display = 'none';
		document.getElementById('back-button').style.display = 'block';


		var report_month; 
		var report_currency;
		var report_total_income;
		var report_total_income_output;
		var report_total_income_label;
		var report_total_income_sum;
		var report_total_expense;
		var report_total_expense_output;
		var report_total_expense_label;
		var report_total_expense_sum;
		var report_cashflow;
		
		//check to see if there is a saved version
			if(month_retrieved != undefined) {
				report_month = month_retrieved;
			} else {
				report_month = month.value;
			}

			if(currency_retrieved != undefined) {
				report_currency = currency_retrieved;
			} else {
				report_currency = currency.value;
			}

			if(total_income_retrieved != undefined) {
				report_total_income_label = JSON.parse(sessionStorage.getItem('total_income_label'));
				report_total_income_array = JSON.parse(sessionStorage.getItem('total_income'));				
				report_total_income_sum = 0;
				for(j in report_total_income_array) {
					report_total_income_sum = report_total_income_sum + report_total_income_array[j];
				}
				report_total_income_output = report_total_income_sum.toLocaleString('ro-RO'); 
			} else {
				report_total_income_label = total_income_label;
				report_total_income_array = total_income;
				report_total_income_output = Number(new_total_income).toLocaleString('ro-RO'); 
				report_total_income_sum = get_total_income();
			}

			if(total_expense_retrieved != undefined) {
				report_total_expense_label = JSON.parse(sessionStorage.getItem('total_expense_label'));
				report_total_expense_array = JSON.parse(sessionStorage.getItem('total_expense'));				
				report_total_expense_sum = 0;
				for(k in report_total_expense_array) {
					report_total_expense_sum = report_total_expense_sum + report_total_expense_array[k];
				}
				report_total_expense_output = report_total_expense_sum.toLocaleString('ro-RO'); 
			} else {
				report_total_expense_label = total_expense_label;
				report_total_expense_array = total_expense;
				report_total_expense_output = Number(new_total_expense).toLocaleString('ro-RO'); 
				report_total_expense_sum = get_total_expense();
			}

			if(cashflow_retrieved != undefined) {
				report_cashflow = Number(cashflow_retrieved).toLocaleString('ro-RO');
			} else {
				report_cashflow = Number(cashflow).toLocaleString('ro-RO');
			}

		document.getElementById('month-field').innerHTML = 'My Budget for: ' + report_month;
		document.getElementById('income-field').innerHTML = report_total_income_output + " " + report_currency;		
		document.getElementById('expenses-field').innerHTML = report_total_expense_output + " " + report_currency;
		document.getElementById('cashflow-field').innerHTML = report_cashflow + " " + report_currency;
		
		var cashflow_analyse;

		if(cashflow_retrieved != undefined) {
			cashflow_analyse = Number(cashflow_retrieved);
		} else {
			cashflow_analyse = Number(cashflow);
		}

		show_negative_cashflow();

		if(cashflow_analyse > 0) {		
			document.getElementById('cashflow-field').style.color = 'green';
		} else {
			document.getElementById('cashflow-field').style.color = 'red';
		}

		// income analysis

		if (total_income.length > 1 && loan == false || total_income_retrieved != undefined && loan == false) {
			income_analysis_output.innerHTML = '<p><strong>Good job! You have more then one source of income!</strong></p>';		 
		} else if (total_income.length > 2 && loan == true || total_income_retrieved != undefined && loan == true) {
			income_analysis_output.innerHTML = '<p><strong>Good job! You have more then one source of income, but you should pay back that loan!</strong></p>';
		}

		// Cashflow analysis

		if (cashflow_analyse > 0) {
			cashflow_analysis_output.innerHTML = 

			'<p><strong> Great! You have a positive cashflow!</strong></p>';		

		} else if (cashflow_analyse == 0) {
			cashflow_analysis_output.innerHTML = '';
		}

		/* GRAPHS
		================================================================ */

		//random income colors

		for(i=0; i<total_income.length; i++) {
			var count_i = i;
			var icolor = get_random_color();
			total_income_color.push(icolor);		
		}

		//random expense color

		for(j=0; j<total_expense.length; j++) {
			var count_j = j;
			var ecolor = get_random_color();
			total_expense_color.push(ecolor);		
		}

		if(total_income.length > 0) {
			save('total_income_color', JSON.stringify(total_income_color));
			save('total_expense_color', JSON.stringify(total_expense_color));
			console.log('color was saved');
		}
		
		var report_total_income_color;
		var report_total_expense_color;
		
		if(total_income_retrieved != undefined) {
			report_total_income_color = JSON.parse(sessionStorage.getItem('total_income_color'));
		} else {
			report_total_income_color = total_income_color;
		}

		if(total_expense_retrieved != undefined) {
			report_total_expense_color = JSON.parse(sessionStorage.getItem('total_expense_color'));
		} else {
			report_total_expense_color = total_expense_color;
		}


		//income Graph
			var ctx = document.getElementById("incomeChart");
			var myChart = new Chart(ctx, {
			    type: 'doughnut',
			    data: {
			        labels: JSON.parse(sessionStorage.getItem('total_income_label')),
			        datasets: [{
			            label: '# of Votes',
			            data: JSON.parse(sessionStorage.getItem('total_income')),
			            backgroundColor: report_total_income_color,
			            borderColor: report_total_income_color,
			            borderWidth: 1
			        }]
			    },
			    options: {
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
			                }
			            }]
			        }
			    }
			}); // income graph

		//expenses graph
			var ctx = document.getElementById("expenseChart");
			var myChart = new Chart(ctx, {
			    type: 'doughnut',
			    data: {
			        labels: JSON.parse(sessionStorage.getItem('total_expense_label')),
			        datasets: [{
			            label: '# of Votes',
			            data: JSON.parse(sessionStorage.getItem('total_expense')),
			            backgroundColor: report_total_expense_color,
			            borderColor:  report_total_expense_color,
			            borderWidth: 1
			        }]
			    },
			    options: {
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
			                }
			            }]
			        }
			    }
			}); // expense graph
		

	//income source analysis

	//max of total income

	function getMaxOfArray(numArray) {
  		return Math.max.apply(null, numArray);
	}

	var max_income;
	var max_income_index;

	//Check to see if there is a saved version
	if(total_income_retrieved != undefined) {
		max_income = getMaxOfArray(total_income_retrieved);
		max_income_index = total_income_retrieved.indexOf(max_income);

	} else {
		max_income = getMaxOfArray(total_income);
		max_income_index = total_income.indexOf(max_income);
	}

	if(cashflow_analyse > 0) {
	document.getElementById('income-source-analysis').innerHTML = 
		'<p>Your biggest source of income is: ' + '<strong>' + report_total_income_label[max_income_index] + ':' + ' ' + max_income.toLocaleString('ro-RO') + ' ' + report_currency + '</strong>' + ' and it represents <strong>' + parseFloat(Number(max_income) / Number(report_total_income_sum) * 100).toFixed(2) + '% </strong> of your <strong>total income</strong>. </p>' + 
		'<p>Have you ever thought what will happen if you would loose this source of income? With your cashflow level, it will take ' + parseFloat(max_income / cashflow).toFixed(2) + ' months to save ' + max_income.toLocaleString('ro-RO') + ' ' + report_currency + '</p>' + 
		'<p>On the other hand, if you want to <strong>survive for 6 months</strong> and keep <strong>the same life style</strong>, you will need to have in <strong>savings arround: ' + (parseInt(Number(report_total_income_sum) * 6)).toLocaleString('ro-RO') + ' ' + report_currency + '</strong></p>';
	} else if (cashflow_analyse == 0) {
		document.getElementById('income-source-analysis').innerHTML = 
		'<p>Your biggest source of income is: ' + '<strong>' + report_total_income_label[max_income_index] + ':' + ' ' + max_income.toLocaleString('ro-RO') + ' ' + report_currency + '</strong>' + ' and it represents <strong>' + parseFloat(Number(max_income) / Number(report_total_income_sum) * 100).toFixed(2) + '% </strong> of your <strong>total income</strong>. <br>' + 
		'Have you ever thought what will happen if you would loose this source of income? With your cashflow level, you are doomed! </p>' + 
		'<p>On the other hand, if you want to <strong>survive for 6 months</strong> and keep <strong>the same life style</strong>, you will need to have in <strong>savings arround: ' + (parseInt(report_total_income_sum * 6)).toLocaleString('ro-RO') + ' ' + report_currency + '</strong></p>';
	}
	//expense source analysis

	//max of total expenses

	var max_expense;
	var max_expense_index;

	if(total_expense_retrieved != undefined) {
		max_expense = getMaxOfArray(total_expense_retrieved);
		max_expense_index = total_expense_retrieved.indexOf(max_expense);
	} else {
		max_expense = getMaxOfArray(total_expense);
		max_expense_index = total_expense.indexOf(max_expense);
	}

	document.getElementById('expense-source-analysis').innerHTML = 
		'<p>Your biggest expense is: ' + '<strong>' + total_expense_label[max_expense_index] + ':' + ' ' + max_expense.toLocaleString('ro-RO') + ' ' + report_currency + '</strong>' + ' and it represents <strong>' + parseFloat(max_expense / report_total_expense_sum * 100).toFixed(2) + '% </strong> of your <strong>total expenses</strong>.' + 
		' Is there any way to reduce it? </p>' + '<br>';


}//show_report();

function show_negative_cashflow() {		
	if(Number(sessionStorage.getItem('cashflow')) < 0) {	
		document.getElementById('negative-cashflow-container').style.display = 'block';
		document.getElementById('income-cashflow-analyse').style.display = 'none';
	} else {
		document.getElementById('negative-cashflow-container').style.display = 'none';
		document.getElementById('income-cashflow-analyse').style.display = 'block';
	}

}// show_negative_cashflow();

function show_finance() {
	document.getElementById('finance-container').style.display = 'block';
	document.getElementById('report-container').style.display = 'none';
	document.getElementById('negative-cashflow-container').style.display = 'none';
	document.getElementById('report-button').style.display = 'block';
	
}//show_finance();

function borrow_money() {
	loan = true;
	show_finance();
	document.getElementById('cut-expenses').style.display = 'none';
	document.getElementById('borrow-money').style.display = 'block';
}

function cut_expenses() {
	show_finance();	
	document.getElementById('borrow-money').style.display = 'none';
	document.getElementById('cut-expenses').style.display = 'block';
}


/*
* ========================================
*	DATA VALIDATION
* ========================================
*/

month.addEventListener('input', function() {
	var month_valid = false;
	if(month.value == ""){
		document.getElementById('month-validation').innerHTML = "Error: This field is required";
		month.style.borderBottom = '3px solid red';
	} else {
		month_valid = true;
		month.style.borderBottom = '3px solid green';
		document.getElementById('month-validation').innerHTML = "";
	}

	if(!/^[A-Za-z ]+$/.test(month.value)) {
		document.getElementById('month-validation').innerHTML = "Error: Please use only letters";
		month.style.borderBottom = '3px solid red';
	} else {
		month_valid = true;
		month.style.borderBottom = '3px solid green';
		document.getElementById('month-validation').innerHTML = "";
	}
});


currency.addEventListener('input', function() {
	var currency_valid = false;
	if(currency.value == ""){
		document.getElementById('currency-validation').innerHTML = "Error: This field is required";
		currency.style.borderBottom = '3px solid red';
	} else {
		currency_valid = true;
		currency.style.borderBottom = '3px solid green';
		document.getElementById('currency-validation').innerHTML = "";
	}

	if(!/^[A-Za-z ]+$/.test(currency.value)) {
		document.getElementById('currency-validation').innerHTML = "Error: Please use only letters";
		currency.style.borderBottom = '3px solid red';
	} else {
		currency_valid = true;
		currency.style.borderBottom = '3px solid green';
		document.getElementById('currency-validation').innerHTML = "";
	}
});

income_name_input.addEventListener('input', function() {	
	if(income_name_input.value == ""){
		document.getElementById('income-name-validation').innerHTML = "Error: Income name is required";
		income_name_input.style.borderBottom = '3px solid red';
		income_name_input_valid = false;
	} else {
		income_name_input_valid = true;
		income_name_input.style.borderBottom = '3px solid green';
		document.getElementById('income-name-validation').innerHTML = "";
	}

	if(!/^[A-Za-z ]+$/.test(income_name_input.value)) {
		document.getElementById('income-name-validation').innerHTML = "Error: Please use only letters.";
		income_name_input.style.borderBottom = '3px solid red';
		income_name_input_valid = false;
	} else {
		income_name_input_valid = true;
		income_name_input.style.borderBottom = '3px solid green';
		document.getElementById('income-name-validation').innerHTML = "";
	}
});

income_value_input.addEventListener('input', function() {	
	if(income_value_input.value == ""){
		document.getElementById('income-value-validation').innerHTML = "Error: Income value is required";
		income_value_input.style.borderBottom = '3px solid red';
		income_value_input_valid = false;
	} else {
		income_value_input_valid = true;
		income_value_input.style.borderBottom = '3px solid green';
		document.getElementById('income-value-validation').innerHTML = "";
	}

	if(!/^[0-9]*$/g.test(income_value_input.value)) {
		document.getElementById('income-value-validation').innerHTML = "Error: Please use only numbers";
		income_value_input.style.borderBottom = '3px solid red';
		income_value_input_valid = false;
	} else {
		income_value_input_valid = true;
		income_value_input.style.borderBottom = '3px solid green';
		document.getElementById('income-value-validation').innerHTML = "";
	}
});

expense_name_input.addEventListener('input', function() {	
	if(expense_name_input.value == ""){
		document.getElementById('expense-name-validation').innerHTML = "Error: Expense name is required";
		expense_name_input.style.borderBottom = '3px solid red';
		expense_name_input_valid = false;
	} else {
		expense_name_input_valid = true;
		expense_name_input.style.borderBottom = '3px solid green';
		document.getElementById('expense-name-validation').innerHTML = "";
	}

	if(!/^[A-Za-z ]+$/.test(expense_name_input.value)) {
		document.getElementById('expense-name-validation').innerHTML = "Error: Please use only letters.";
		expense_name_input.style.borderBottom = '3px solid red';
		expense_name_input_valid = false;
	} else {
		expense_name_input_valid = true;
		expense_name_input.style.borderBottom = '3px solid green';
		document.getElementById('expense-name-validation').innerHTML = "";
	}
});

expense_value_input.addEventListener('input', function() {	
	if(expense_value_input.value == ""){
		document.getElementById('expense-value-validation').innerHTML = "Error: Expense value is required";
		expense_value_input.style.borderBottom = '3px solid red';
		expense_value_input_valid = false;
	} else {
		expense_value_input_valid = true;
		expense_value_input.style.borderBottom = '3px solid green';
		document.getElementById('expense-value-validation').innerHTML = "";
	}

	if(!/^[0-9]*$/g.test(expense_value_input.value)) {
		document.getElementById('expense-value-validation').innerHTML = "Error: Please use only numbers.";
		expense_value_input.style.borderBottom = '3px solid red';
		expense_value_input_valid = false;
	} else {
		expense_value_input_valid = true;
		expense_value_input.style.borderBottom = '3px solid green';
		document.getElementById('expense-value-validation').innerHTML = "";
	}
});

income_value_input.addEventListener('keypress', function(e) {
	var keyCode = e.keyCode;
    if(keyCode == 13){
    	if(income_value_input_valid == true) {
    		new_income();	
    	}
        
    }
});

expense_value_input.addEventListener('keypress', function(e) {
	var keyCode = e.keyCode;
    if(keyCode == 13){
        if(expense_value_input_valid == true) {
    		new_expense();	
    	}
    }
});

/*
* ========================================
*	SAVE LOCALSESSION
* ========================================
*/
// General save function
if (typeof(Storage) !== "undefined") {

	function save(keyname, keyvalue) {
		sessionStorage.setItem(keyname, keyvalue);
	}

} else {
    console.log('Sorry, there is no Web Storage Support.')
}

// Save month
month.addEventListener('input', function() {

	if (month.value != null) {
	save('month', month.value);
	console.log('month was saved');
	month_saved = true;
	} else {
		console.log('failed to save month');
		month_saved = false;
	}

});


// Save currency
currency.addEventListener('input', function() {

	if (currency.value != null) {
	save('currency', currency.value);
	console.log('currency was saved');
	currency_saved = true;
	} else {
		console.log('failed to save currency');
		month_saved = false;
	}

});

/*
* ========================================
*	RETRIEVE SAVED DATA
* ========================================
*/

// Retrieve Month
	month_retrieved = sessionStorage.getItem('month');
	
	// Retrieve Month as the input placeholder
	if(month_retrieved != undefined) {
		month.setAttribute('placeholder', month_retrieved);
		document.getElementById('error').innerText = "Ups! Something went wrong. Here is a saved version of your data!" +
		"But unfortunately at this moment you can't interact with it.";	
	} else {
		month.setAttribute('placeholder', 'Month');
	}	

// Retrieve Currency
	currency_retrieved = sessionStorage.getItem('currency');

	if(currency_retrieved != undefined) {
		currency.setAttribute('placeholder', currency_retrieved);
	} else {
		currency.setAttribute('placeholder', 'USD');
	}


// Retrieve the income_name (total_income_label array)

	total_income_label_retrieved = JSON.parse(sessionStorage.getItem('total_income_label'));

	if(total_income_label_retrieved.length > 0) {		
		income_output.style.display = "block";
		var total_label= "";
		for(x in total_income_label_retrieved) {		
			total_label = '<p>' + total_label + total_income_label_retrieved[x] + '</p>'; 
			income_name_output.innerHTML = total_label;
		}
		
	}

// Retrieve the income_value (total_income array)

	total_income_retrieved = JSON.parse(sessionStorage.getItem('total_income'));

		if(total_income_retrieved.length > 0) {
			income_output.style.display = "block";
			var total_value1= "";		
			for(x in total_income_retrieved) {		
				total_value1 = '<p>' + total_value1 + total_income_retrieved[x] + " " + "<span name='remove-button' class='remove-button'>-</span>" + '</p>'; 
				income_value_output.innerHTML = '<p>' + total_value1 + '</p>';			
			}
			var income_sum = 0;
			for(y in total_income_retrieved) {
				income_sum = income_sum + total_income_retrieved[y];
			}			
			total_income_output.innerHTML = '<p>' + income_sum + '</p>';
		}

// Retrieve the expense_name (total_expense_label array)

	total_expense_label_retrieved = JSON.parse(sessionStorage.getItem('total_expense_label'));

	if(total_expense_label_retrieved.length > 0) {		
		expense_output.style.display = "block";
		var total_label= "";
		for(x in total_expense_label_retrieved) {		
			total_label = '<p>' + total_label + total_expense_label_retrieved[x] + '</p>'; 
			expense_name_output.innerHTML = total_label;
		}
		
	}

// Retrieve the expense_value (total_expense array)

	total_expense_retrieved = JSON.parse(sessionStorage.getItem('total_expense'));

		if(total_expense_retrieved.length > 0) {
			expense_output.style.display = "block";
			var total_value2= "";		
			for(x in total_expense_retrieved) {		
				total_value2 = '<p>' + total_value2 + total_expense_retrieved[x] + " " + "<span name='remove-button' class='remove-button'>-</span>" + '</p>'; 
				expense_value_output.innerHTML = '<p>' + total_value2 + '</p>';			
			}
			var expense_sum = 0;
			for(z in total_expense_retrieved) {
				expense_sum = expense_sum + total_expense_retrieved[z];
			}			
			total_expense_output.innerHTML = '<p>' + expense_sum + '</p>';		
		}

// Retrieve the cashflow 

	if(cashflow_saved === true) {
		
			cashflow_retrieved = sessionStorage.getItem('cashflow');
			
			if(cashflow_retrieved > 0) {
				cashflow_output.innerText = "+ " + cashflow_retrieved;
				cashflow_output.style.color = "green";			
			} else if (cashflow_retrieved === 0) {
				cashflow_output.innerText = cashflow_retrieved;
			} else {
				cashflow_output.innerText = cashflow_retrieved;
				cashflow_output.style.color = "red";			
			}	

		} 


	var removeBtn = document.getElementsByName('remove-button');

	for(x in removeBtn) {
		removeBtn[x].addEventListener('click', function() {
			alert("Sorry, at this moment you can't delete saved values");
		});
	}

