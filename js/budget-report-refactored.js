/*
* ========================================
*	BUDGET REPORT APP
* ========================================
*/

var budgetReportApp = {};

budgetReportApp.financeContainer = document.getElementById('finance-container');
budgetReportApp.reportContainer = document.getElementById('report-container');
budgetReportApp.negativeCashflowContainer = document.getElementById('negative-cashflow-container');

budgetReportApp.month = document.getElementById('month');
budgetReportApp.currency = document.getElementById('currency');

budgetReportApp.incomeForm = document.getElementById('add-income-form');
budgetReportApp.incomeOutput = document.getElementById('income-output');
budgetReportApp.incomeNameInput = document.getElementById('income-name');
budgetReportApp.incomeValueInput = document.getElementById('income-value');
budgetReportApp.incomeNameOutput = document.getElementById('income-name-output');
budgetReportApp.incomeValueOutput = document.getElementById('income-value-output');
budgetReportApp.newIncomeButton = document.getElementById('add-new-income');
budgetReportApp.totalIncomeOutput = document.getElementById('total-income-value-output');
budgetReportApp.totalIncome = [];
budgetReportApp.totalIncomeLabel = [];

budgetReportApp.expenseForm = document.getElementById('add-expense-form');
budgetReportApp.expenseOutput = document.getElementById('expense-output');
budgetReportApp.expenseNameInput = document.getElementById('expense-name');
budgetReportApp.expenseNameOutput = document.getElementById('expense-name-output');
budgetReportApp.expenseValueInput = document.getElementById('expense-value');
budgetReportApp.expenseValueOutput = document.getElementById('expense-value-output');
budgetReportApp.newExpenseButton = document.getElementById('add-new-expense');
budgetReportApp.totalExpenseOutput = document.getElementById('total-expense-value-output');
budgetReportApp.totalExpense = [];
budgetReportApp.totalExpenseLabel = [];

budgetReportApp.cashflow = 0;
budgetReportApp.cashflowOutput = document.getElementById('cashflow-output');

budgetReportApp.loan = false;

budgetReportApp.totalIncomeColor = [];
budgetReportApp.totalExpenseColor = [];

budgetReportApp.newTotalIncome = 0;
budgetReportApp.newTotalExpense = 0;

budgetReportApp.incomeAnalysisOutput = document.getElementById('income-analysis');
budgetReportApp.cashflowAnalysisOutput = document.getElementById('cashflow-analysis');

budgetReportApp.incomeNameInputValid = false;
budgetReportApp.incomeValueInputValid = false;
budgetReportApp.expenseNameInputValid = false;
budgetReportApp.expenseValueInputValid = false;

budgetReportApp.monthSaved	= false;
budgetReportApp.currencySaved = false;
budgetReportApp.totalIncomeSaved = false;
budgetReportApp.totalIncomeLabelSaved = false;
budgetReportApp.totalExpenseSaved = false;
budgetReportApp.totalExpenseLabelSaved = false;
budgetReportApp.cashflowSaved = false;

budgetReportApp.monthRetrieved;
budgetReportApp.currencyRetrieved;
budgetReportApp.cashflowRetrieved;
budgetReportApp.totalIncomeLabelRetrieved; 	
budgetReportApp.totalIncomeRetrieved; 			
budgetReportApp.totalExpenseLabelRetrieved; 	
budgetReportApp.totalExpenseRetrieved;

budgetReportApp.createNewReportBtn = document.getElementById('create_new_report_btn');

// Check to see if there is a saved version
if(sessionStorage.getItem('budgetReportApp.cashflow') != null) {
	budgetReportApp.monthSaved	= true;
	budgetReportApp.currencySaved = true;
	budgetReportApp.totalIncomeSaved = true;
	budgetReportApp.totalIncomeLabelSaved = true;
	budgetReportApp.totalExpenseSaved	= true;
	budgetReportApp.totalExpenseLabelSaved= true;
	budgetReportApp.cashflowSaved = true;
} else {
	budgetReportApp.monthSaved = false;
	budgetReportApp.currencySaved = false;
	budgetReportApp.totalIncomeSaved = false;
	budgetReportApp.totalIncomeLabelSaved = false;
	budgetReportApp.totalExpenseSaved = false;
	budgetReportApp.totalExpenseLabelSaved= false;
	budgetReportApp.cashflowSaved = false;
}

/*
* ========================================
*	APP LOGIC
* ========================================
*/

budgetReportApp.createNewReportBtn.addEventListener('click', function() {
	sessionStorage.clear();
});

budgetReportApp.newIncome = function() {

	var income_name = document.getElementById('income-name').value.toUpperCase();		
		
	var income_value = parseInt(document.getElementById('income-value').value, 10);
	

	if(income_name == "LOAN" || income_name == "BORROW") {
		budgetReportApp.loan = true;
	}

	if(budgetReportApp.incomeNameInput.value == "") {
		alert("Please type the name of your income.");
		budgetReportApp.incomeNameInput.focus();
	} else if (budgetReportApp.incomeValueInput.value == "") {
		alert("Please type the value of your income.");
		budgetReportApp.incomeValueInput.focus();
	} else {

		budgetReportApp.totalIncomeLabel.push(income_name);
		budgetReportApp.totalIncome.push(income_value);

		//show output
		budgetReportApp.incomeOutput.style.display = "block";

		//output the input with new line each time
		var new_income_item1 = document.createElement('p');
		var new_income_item2 = document.createElement('p');

		var new_income_name = document.createTextNode(income_name);
		var new_income_value = document.createTextNode(income_value);	

		new_income_item1.appendChild(new_income_name);
		new_income_item2.appendChild(new_income_value);

		budgetReportApp.incomeNameOutput.appendChild(new_income_item1);
		budgetReportApp.incomeValueOutput.appendChild(new_income_item2);
		
		budgetReportApp.getTotalIncome();
		budgetReportApp.getCashflow();
		budgetReportApp.incomeForm.reset();
		budgetReportApp.incomeNameInput.focus();

		//remove an element
		budgetReportApp.removeIncome(new_income_item1, new_income_item2);
	}//endif

}


budgetReportApp.newExpense = function() {
	var expense_name = document.getElementById('expense-name').value.toUpperCase();
	var expense_value = parseInt(document.getElementById('expense-value').value, 10);
	
	if(budgetReportApp.expenseNameInput.value == "") {
		alert("Please type the name of your expense.");
		budgetReportApp.expenseNameInput.focus();
	} else if (budgetReportApp.expenseValueInput.value == "") {
		alert("Please type the value of your expense.");
		budgetReportApp.expenseValueInput.focus();
	} else {


		budgetReportApp.totalExpenseLabel.push(expense_name);
		budgetReportApp.totalExpense.push(expense_value);
		

		//show output
		budgetReportApp.expenseOutput.style.display = "block";

		//output the input with new line each time
		var new_expense_item1 = document.createElement('p');
		var new_expense_item2 = document.createElement('p');

		var new_expense_name = document.createTextNode(expense_name);
		var new_expense_value = document.createTextNode(expense_value);

		new_expense_item1.appendChild(new_expense_name);
		new_expense_item2.appendChild(new_expense_value);

		budgetReportApp.expenseNameOutput.appendChild(new_expense_item1);
		budgetReportApp.expenseValueOutput.appendChild(new_expense_item2);
		
		budgetReportApp.getTotalExpense();
		budgetReportApp.getCashflow();
		budgetReportApp.expenseForm.reset();
		budgetReportApp.expenseNameInput.focus();

		//remove an element
		budgetReportApp.removeExpense(new_expense_item1, new_expense_item2);
	}//endif
		
}

budgetReportApp.getTotalIncome = function() {
	var total = 0;

	for(i in budgetReportApp.totalIncome) {
		total = total + budgetReportApp.totalIncome[i];
	}

	budgetReportApp.totalIncomeOutput.innerHTML = total;

	if(isNaN(budgetReportApp.totalIncome[0])) {
		console.log('failed to save budgetReportApp.totalIncome');	
	} else if(budgetReportApp.totalIncome[0] == "") {
		budgetReportApp.save('budgetReportApp.totalIncome', 0);
		console.log('budgetReportApp.totalIncome was saved as ZERO');
	} else {
		budgetReportApp.save('budgetReportApp.totalIncome', JSON.stringify(budgetReportApp.totalIncome));
		console.log('budgetReportApp.totalIncome was saved');
		budgetReportApp.totalIncomeSaved = true;
	}

	if(budgetReportApp.totalIncomeLabel < 1) {
		console.log('failed to save budgetReportApp.totalIncomeLabel');
	} else {
		budgetReportApp.save('budgetReportApp.totalIncomeLabel', JSON.stringify(budgetReportApp.totalIncomeLabel));
		console.log('budgetReportApp.totalIncomeLabel was saved');
		budgetReportApp.totalIncomeLabelSaved = true;
	}
	
	return total;	

}

budgetReportApp.getTotalExpense = function() {
	var total = 0;

	for(i in budgetReportApp.totalExpense) {
		total = total + budgetReportApp.totalExpense[i];
	}

	budgetReportApp.totalExpenseOutput.innerHTML = total;	

	if(isNaN(budgetReportApp.totalExpense[0])) {
		console.log('failed to save budgetReportApp.totalExpense');	
	} else if(budgetReportApp.totalExpense[0] == "") {
		budgetReportApp.save('budgetReportApp.totalExpense', 0);
		console.log('budgetReportApp.totalExpense was saved as ZERO');
	} else {
		budgetReportApp.save('budgetReportApp.totalExpense', JSON.stringify(budgetReportApp.totalExpense));
		console.log('budgetReportApp.totalExpense was saved');
		budgetReportApp.totalExpenseSaved = true;
	}

	if(budgetReportApp.totalExpenseLabel < 1) {
		console.log('failed to save budgetReportApp.totalExpenseLabel');
	} else {
		budgetReportApp.save('budgetReportApp.totalExpenseLabel', JSON.stringify(budgetReportApp.totalExpenseLabel));
		console.log('budgetReportApp.totalExpenseLabel was saved');
		budgetReportApp.totalExpenseLabelSaved= true;
	}

	return total;	

}


budgetReportApp.getCashflow = function() {

	budgetReportApp.newTotalIncome = budgetReportApp.getTotalIncome();
	budgetReportApp.newTotalExpense = budgetReportApp.getTotalExpense();

	budgetReportApp.cashflow = budgetReportApp.newTotalIncome - budgetReportApp.newTotalExpense;

	// Save the budgetReportApp.cashflow value
	if(budgetReportApp.cashflow != null) {
		budgetReportApp.save('budgetReportApp.cashflow', budgetReportApp.cashflow);
		console.log('budgetReportApp.cashflow was saved');
		budgetReportApp.cashflowSaved = true;
	} else {
		console.log('failed to save budgetReportApp.cashflow');
		budgetReportApp.cashflowSaved = false;
	}

	// Output the budgetReportApp.cashflow
		if(budgetReportApp.cashflow > 0) {
			budgetReportApp.cashflowOutput.innerHTML = "+ " + budgetReportApp.cashflow;
			budgetReportApp.cashflowOutput.style.color = "green";
		} else if (budgetReportApp.cashflow === 0) {
			budgetReportApp.cashflowOutput.innerHTML = budgetReportApp.cashflow;
		} else {
			budgetReportApp.cashflowOutput.innerHTML = budgetReportApp.cashflow;
			budgetReportApp.cashflowOutput.style.color = "red";
		}	
	

	return budgetReportApp.cashflow;

}; 


budgetReportApp.removeIncome = function(e, f) {
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
    	 
        
    	// remove the income from the budgetReportApp.totalIncome array
        var income_value_removed = parseInt(f.innerText, 10);
        var index = budgetReportApp.totalIncome.indexOf(income_value_removed);
        budgetReportApp.totalIncome.splice(index, 1);

        // remove the income label from the budgetReportApp.totalIncomeLabel array
        var income_label_removed = e.innerText;
        var index_income_label = budgetReportApp.totalIncomeLabel.indexOf(income_label_removed);
        budgetReportApp.totalIncomeLabel.splice(index_income_label, 1);

        budgetReportApp.getTotalIncome();
        budgetReportApp.getCashflow();

        }

    }, false);

    f.appendChild(removeItem);
    removeItem.appendChild(removeItemText);
}

budgetReportApp.removeExpense = function(e, f) {
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
    	 

        // remove the expense value from the budgetReportApp.totalExpense array
        var expense_value_removed = parseInt(f.innerText, 10);
        var index_expense = budgetReportApp.totalExpense.indexOf(expense_value_removed);
        budgetReportApp.totalExpense.splice(index_expense, 1);

        // remove the expense label from the budgetReportApp.totalExpenseLabel array
        var expense_label_removed = e.innerText;
        var index_expense_label = budgetReportApp.totalExpenseLabel.indexOf(expense_label_removed);
        budgetReportApp.totalExpenseLabel.splice(index_expense_label, 1);

        budgetReportApp.getTotalExpense();

        budgetReportApp.getCashflow();

        }

    }, false);
    f.appendChild(removeItem);
    removeItem.appendChild(removeItemText);
}

budgetReportApp.getRandomColor = function() { 		
	var random_color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
	
	return random_color;
}

budgetReportApp.showReport = function() {

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
			if(budgetReportApp.monthRetrieved != undefined) {
				report_month = budgetReportApp.monthRetrieved;
			} else {
				report_month = budgetReportApp.month.value;
			}

			if(budgetReportApp.currencyRetrieved != undefined) {
				report_currency = budgetReportApp.currencyRetrieved;
			} else {
				report_currency = budgetReportApp.currency.value;
			}

			if(budgetReportApp.totalIncomeRetrieved != undefined) {
				report_total_income_label = JSON.parse(sessionStorage.getItem('budgetReportApp.totalIncomeLabel'));
				report_total_income_array = JSON.parse(sessionStorage.getItem('budgetReportApp.totalIncome'));				
				report_total_income_sum = 0;
				for(j in report_total_income_array) {
					report_total_income_sum = report_total_income_sum + report_total_income_array[j];
				}
				report_total_income_output = report_total_income_sum.toLocaleString('ro-RO'); 
			} else {
				report_total_income_label = budgetReportApp.totalIncomeLabel;
				report_total_income_array = budgetReportApp.totalIncome;
				report_total_income_output = Number(budgetReportApp.newTotalIncome).toLocaleString('ro-RO'); 
				report_total_income_sum = budgetReportApp.getTotalIncome();
			}

			if(budgetReportApp.totalExpenseRetrieved != undefined) {
				report_total_expense_label = JSON.parse(sessionStorage.getItem('budgetReportApp.totalExpenseLabel'));
				report_total_expense_array = JSON.parse(sessionStorage.getItem('budgetReportApp.totalExpense'));				
				report_total_expense_sum = 0;
				for(k in report_total_expense_array) {
					report_total_expense_sum = report_total_expense_sum + report_total_expense_array[k];
				}
				report_total_expense_output = report_total_expense_sum.toLocaleString('ro-RO'); 
			} else {
				report_total_expense_label = budgetReportApp.totalExpenseLabel;
				report_total_expense_array = budgetReportApp.totalExpense;
				report_total_expense_output = Number(budgetReportApp.newTotalExpense).toLocaleString('ro-RO'); 
				report_total_expense_sum = budgetReportApp.getTotalExpense();
			}

			if(budgetReportApp.cashflowRetrieved != undefined) {
				report_cashflow = Number(budgetReportApp.cashflowRetrieved).toLocaleString('ro-RO');
			} else {
				report_cashflow = Number(budgetReportApp.cashflow).toLocaleString('ro-RO');
			}

		document.getElementById('month-field').innerHTML = 'My Budget for: ' + report_month;
		document.getElementById('income-field').innerHTML = report_total_income_output + " " + report_currency;		
		document.getElementById('expenses-field').innerHTML = report_total_expense_output + " " + report_currency;
		document.getElementById('cashflow-field').innerHTML = report_cashflow + " " + report_currency;
		
		var cashflow_analyse;

		if(budgetReportApp.cashflowRetrieved != undefined) {
			cashflow_analyse = Number(budgetReportApp.cashflowRetrieved);
		} else {
			cashflow_analyse = Number(budgetReportApp.cashflow);
		}

		budgetReportApp.showNegativeCashflow();

		if(cashflow_analyse > 0) {		
			document.getElementById('cashflow-field').style.color = 'green';
		} else {
			document.getElementById('cashflow-field').style.color = 'red';
		}

		// income analysis

		if (budgetReportApp.totalIncome.length > 1 && budgetReportApp.loan == false || budgetReportApp.totalIncomeRetrieved != undefined && budgetReportApp.loan == false) {
			budgetReportApp.incomeAnalysisOutput.innerHTML = '<p><strong>Good job! You have more then one source of income!</strong></p>';		 
		} else if (budgetReportApp.totalIncome.length > 2 && budgetReportApp.loan == true || budgetReportApp.totalIncomeRetrieved != undefined && budgetReportApp.loan == true) {
			budgetReportApp.incomeAnalysisOutput.innerHTML = '<p><strong>Good job! You have more then one source of income, but you should pay back that loan!</strong></p>';
		}

		// budgetReportApp.cashflow analysis

		if (cashflow_analyse > 0) {
			budgetReportApp.cashflowAnalysisOutput.innerHTML = 

			'<p><strong> Great! You have a positive cashflow!</strong></p>';		

		} else if (cashflow_analyse == 0) {
			budgetReportApp.cashflowAnalysisOutput.innerHTML = '';
		}

		/* GRAPHS
		================================================================ */

		//random income colors

		for(i=0; i<budgetReportApp.totalIncome.length; i++) {
			var count_i = i;
			var icolor = budgetReportApp.getRandomColor();
			budgetReportApp.totalIncomeColor.push(icolor);		
		}

		//random expense color

		for(j=0; j<budgetReportApp.totalExpense.length; j++) {
			var count_j = j;
			var ecolor = budgetReportApp.getRandomColor();
			budgetReportApp.totalExpenseColor.push(ecolor);		
		}

		if(budgetReportApp.totalIncome.length > 0) {
			budgetReportApp.save('budgetReportApp.totalIncomeColor', JSON.stringify(budgetReportApp.totalIncomeColor));
			budgetReportApp.save('budgetReportApp.totalExpenseColor', JSON.stringify(budgetReportApp.totalExpenseColor));
			console.log('color was saved');
		}
		
		var report_total_incomeColor;
		var report_total_expenseColor;
		
		if(budgetReportApp.totalIncomeRetrieved != undefined) {
			report_total_incomeColor = JSON.parse(sessionStorage.getItem('budgetReportApp.totalIncomeColor'));
		} else {
			report_total_incomeColor = budgetReportApp.totalIncomeColor;
		}

		if(budgetReportApp.totalExpenseRetrieved != undefined) {
			report_total_expenseColor = JSON.parse(sessionStorage.getItem('budgetReportApp.totalExpenseColor'));
		} else {
			report_total_expenseColor = budgetReportApp.totalExpenseColor;
		}


		//income Graph
			var ctx = document.getElementById("incomeChart");
			var myChart = new Chart(ctx, {
			    type: 'doughnut',
			    data: {
			        labels: JSON.parse(sessionStorage.getItem('budgetReportApp.totalIncomeLabel')),
			        datasets: [{
			            label: '# of Votes',
			            data: JSON.parse(sessionStorage.getItem('budgetReportApp.totalIncome')),
			            backgroundColor: report_total_incomeColor,
			            borderColor: report_total_incomeColor,
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
			        labels: JSON.parse(sessionStorage.getItem('budgetReportApp.totalExpenseLabel')),
			        datasets: [{
			            label: '# of Votes',
			            data: JSON.parse(sessionStorage.getItem('budgetReportApp.totalExpense')),
			            backgroundColor: report_total_expenseColor,
			            borderColor:  report_total_expenseColor,
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
	if(budgetReportApp.totalIncomeRetrieved != undefined) {
		max_income = getMaxOfArray(budgetReportApp.totalIncomeRetrieved);
		max_income_index = budgetReportApp.totalIncomeRetrieved.indexOf(max_income);

	} else {
		max_income = getMaxOfArray(budgetReportApp.totalIncome);
		max_income_index = budgetReportApp.totalIncome.indexOf(max_income);
	}

	if(cashflow_analyse > 0) {
	document.getElementById('income-source-analysis').innerHTML = 
		'<p>Your biggest source of income is: ' + '<strong>' + report_total_income_label[max_income_index] + ':' + ' ' + max_income.toLocaleString('ro-RO') + ' ' + report_currency + '</strong>' + ' and it represents <strong>' + parseFloat(Number(max_income) / Number(report_total_income_sum) * 100).toFixed(2) + '% </strong> of your <strong>total income</strong>. </p>' + 
		'<p>Have you ever thought what will happen if you would loose this source of income? With your cash-flow level, it will take ' + parseFloat(max_income / budgetReportApp.cashflow).toFixed(2) + ' months to save ' + max_income.toLocaleString('ro-RO') + ' ' + report_currency + '</p>' + 
		'<p>On the other hand, if you want to <strong>survive for 6 months</strong> and keep <strong>the same life style</strong>, you will need to have in <strong>savings arround: ' + (parseInt(Number(report_total_income_sum) * 6)).toLocaleString('ro-RO') + ' ' + report_currency + '</strong></p>';
	} else if (cashflow_analyse == 0) {
		document.getElementById('income-source-analysis').innerHTML = 
		'<p>Your biggest source of income is: ' + '<strong>' + report_total_income_label[max_income_index] + ':' + ' ' + max_income.toLocaleString('ro-RO') + ' ' + report_currency + '</strong>' + ' and it represents <strong>' + parseFloat(Number(max_income) / Number(report_total_income_sum) * 100).toFixed(2) + '% </strong> of your <strong>total income</strong>. <br>' + 
		'Have you ever thought what will happen if you would loose this source of income? With your cash-flow level, you are doomed! </p>' + 
		'<p>On the other hand, if you want to <strong>survive for 6 months</strong> and keep <strong>the same life style</strong>, you will need to have in <strong>savings arround: ' + (parseInt(report_total_income_sum * 6)).toLocaleString('ro-RO') + ' ' + report_currency + '</strong></p>';
	}
	//expense source analysis

	//max of total expenses

	var max_expense;
	var max_expense_index;

	if(budgetReportApp.totalExpenseRetrieved != undefined) {
		max_expense = getMaxOfArray(budgetReportApp.totalExpenseRetrieved);
		max_expense_index = budgetReportApp.totalExpenseRetrieved.indexOf(max_expense);
	} else {
		max_expense = getMaxOfArray(budgetReportApp.totalExpense);
		max_expense_index = budgetReportApp.totalExpense.indexOf(max_expense);
	}

	document.getElementById('expense-source-analysis').innerHTML = 
		'<p>Your biggest expense is: ' + '<strong>' + budgetReportApp.totalExpenseLabel[max_expense_index] + ':' + ' ' + max_expense.toLocaleString('ro-RO') + ' ' + report_currency + '</strong>' + ' and it represents <strong>' + parseFloat(max_expense / report_total_expense_sum * 100).toFixed(2) + '% </strong> of your <strong>total expenses</strong>.' + 
		' Is there any way to reduce it? </p>' + '<br>';


}//budgetReportApp.showReport();

budgetReportApp.showNegativeCashflow = function() {		
	if(Number(sessionStorage.getItem('budgetReportApp.cashflow')) < 0) {	
		document.getElementById('negative-cashflow-container').style.display = 'block';
		document.getElementById('income-cashflow-analyse').style.display = 'none';
	} else {
		document.getElementById('negative-cashflow-container').style.display = 'none';
		document.getElementById('income-cashflow-analyse').style.display = 'block';
	}

}// budgetReportApp.showNegativeCashflow();

budgetReportApp.showFinance = function() {
	document.getElementById('finance-container').style.display = 'block';
	document.getElementById('report-container').style.display = 'none';
	document.getElementById('negative-cashflow-container').style.display = 'none';
	document.getElementById('report-button').style.display = 'block';
	
}//show_finance();

budgetReportApp.borrowMoney = function() {
	budgetReportApp.loan = true;
	budgetReportApp.showFinance();
	document.getElementById('cut-expenses').style.display = 'none';
	document.getElementById('borrow-money').style.display = 'block';
}

budgetReportApp.cutExpenses = function() {
	budgeReportApp.showFinance();	
	document.getElementById('borrow-money').style.display = 'none';
	document.getElementById('cut-expenses').style.display = 'block';
}


/*
* ========================================
*	DATA VALIDATION
* ========================================
*/

budgetReportApp.month.addEventListener('input', function() {
	var month_valid = false;
	if(budgetReportApp.month.value == ""){
		document.getElementById('month-validation').innerHTML = "Error: This field is required";
		budgetReportApp.month.style.borderBottom = '3px solid red';
	} else {
		month_valid = true;
		budgetReportApp.month.style.borderBottom = '3px solid green';
		document.getElementById('month-validation').innerHTML = "";
	}

	if(!/^[A-Za-z ]+$/.test(budgetReportApp.month.value)) {
		document.getElementById('month-validation').innerHTML = "Error: Please use only letters";
		budgetReportApp.month.style.borderBottom = '3px solid red';
	} else {
		month_valid = true;
		budgetReportApp.month.style.borderBottom = '3px solid green';
		document.getElementById('month-validation').innerHTML = "";
	}
});


budgetReportApp.currency.addEventListener('input', function() {
	var currency_valid = false;
	if(budgetReportApp.currency.value == ""){
		document.getElementById('currency-validation').innerHTML = "Error: This field is required";
		budgetReportApp.currency.style.borderBottom = '3px solid red';
	} else {
		currency_valid = true;
		budgetReportApp.currency.style.borderBottom = '3px solid green';
		document.getElementById('currency-validation').innerHTML = "";
	}

	if(!/^[A-Za-z ]+$/.test(budgetReportApp.currency.value)) {
		document.getElementById('currency-validation').innerHTML = "Error: Please use only letters";
		budgetReportApp.currency.style.borderBottom = '3px solid red';
	} else {
		currency_valid = true;
		budgetReportApp.currency.style.borderBottom = '3px solid green';
		document.getElementById('currency-validation').innerHTML = "";
	}
});

budgetReportApp.incomeNameInput.addEventListener('input', function() {	
	if(budgetReportApp.incomeNameInput.value == ""){
		document.getElementById('income-name-validation').innerHTML = "Error: Income name is required";
		budgetReportApp.incomeNameInput.style.borderBottom = '3px solid red';
		budgetReportApp.incomeNameInputValid = false;
	} else {
		budgetReportApp.incomeNameInputValid = true;
		budgetReportApp.incomeNameInput.style.borderBottom = '3px solid green';
		document.getElementById('income-name-validation').innerHTML = "";
	}

	if(!/^[A-Za-z ]+$/.test(budgetReportApp.incomeNameInput.value)) {
		document.getElementById('income-name-validation').innerHTML = "Error: Please use only letters.";
		budgetReportApp.incomeNameInput.style.borderBottom = '3px solid red';
		budgetReportApp.incomeNameInputValid = false;
	} else {
		budgetReportApp.incomeNameInputValid = true;
		budgetReportApp.incomeNameInput.style.borderBottom = '3px solid green';
		document.getElementById('income-name-validation').innerHTML = "";
	}
});

budgetReportApp.incomeValueInput.addEventListener('input', function() {	
	if(budgetReportApp.incomeValueInput.value == ""){
		document.getElementById('income-value-validation').innerHTML = "Error: Income value is required";
		budgetReportApp.incomeValueInput.style.borderBottom = '3px solid red';
		budgetReportApp.incomeValueInputValid = false;
	} else {
		budgetReportApp.incomeValueInputValid = true;
		budgetReportApp.incomeValueInput.style.borderBottom = '3px solid green';
		document.getElementById('income-value-validation').innerHTML = "";
	}

	if(!/^[0-9]*$/g.test(budgetReportApp.incomeValueInput.value)) {
		document.getElementById('income-value-validation').innerHTML = "Error: Please use only numbers";
		budgetReportApp.incomeValueInput.style.borderBottom = '3px solid red';
		budgetReportApp.incomeValueInputValid = false;
	} else {
		budgetReportApp.incomeValueInputValid = true;
		budgetReportApp.incomeValueInput.style.borderBottom = '3px solid green';
		document.getElementById('income-value-validation').innerHTML = "";
	}
});

budgetReportApp.expenseNameInput.addEventListener('input', function() {	
	if(budgetReportApp.expenseNameInput.value == ""){
		document.getElementById('expense-name-validation').innerHTML = "Error: Expense name is required";
		budgetReportApp.expenseNameInput.style.borderBottom = '3px solid red';
		budgetReportApp.expenseNameInputValid = false;
	} else {
		budgetReportApp.expenseNameInputValid = true;
		budgetReportApp.expenseNameInput.style.borderBottom = '3px solid green';
		document.getElementById('expense-name-validation').innerHTML = "";
	}

	if(!/^[A-Za-z ]+$/.test(budgetReportApp.expenseNameInput.value)) {
		document.getElementById('expense-name-validation').innerHTML = "Error: Please use only letters.";
		budgetReportApp.expenseNameInput.style.borderBottom = '3px solid red';
		budgetReportApp.expenseNameInputValid = false;
	} else {
		budgetReportApp.expenseNameInputValid = true;
		budgetReportApp.expenseNameInput.style.borderBottom = '3px solid green';
		document.getElementById('expense-name-validation').innerHTML = "";
	}
});

budgetReportApp.expenseValueInput.addEventListener('input', function() {	
	if(budgetReportApp.expenseValueInput.value == ""){
		document.getElementById('expense-value-validation').innerHTML = "Error: Expense value is required";
		budgetReportApp.expenseValueInput.style.borderBottom = '3px solid red';
		budgetReportApp.expenseValueInputValid = false;
	} else {
		budgetReportApp.expenseValueInputValid = true;
		budgetReportApp.expenseValueInput.style.borderBottom = '3px solid green';
		document.getElementById('expense-value-validation').innerHTML = "";
	}

	if(!/^[0-9]*$/g.test(budgetReportApp.expenseValueInput.value)) {
		document.getElementById('expense-value-validation').innerHTML = "Error: Please use only numbers.";
		budgetReportApp.expenseValueInput.style.borderBottom = '3px solid red';
		budgetReportApp.expenseValueInputValid = false;
	} else {
		budgetReportApp.expenseValueInputValid = true;
		budgetReportApp.expenseValueInput.style.borderBottom = '3px solid green';
		document.getElementById('expense-value-validation').innerHTML = "";
	}
});

budgetReportApp.incomeValueInput.addEventListener('keypress', function(e) {
	var keyCode = e.keyCode;
    if(keyCode == 13){
    	if(budgetReportApp.incomeValueInputValid == true) {
    		budgetReportApp.newIncome();	
    	}
        
    }
});

budgetReportApp.expenseValueInput.addEventListener('keypress', function(e) {
	var keyCode = e.keyCode;
    if(keyCode == 13){
        if(budgetReportApp.expenseValueInputValid == true) {
    		budgetReportApp.newExpense();	
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

	budgetReportApp.save = function(keyname, keyvalue) {
		sessionStorage.setItem(keyname, keyvalue);
	}

} else {
    console.log('Sorry, there is no Web Storage Support.')
}

// Save budgetReportApp.month
budgetReportApp.month.addEventListener('input', function() {

	if (budgetReportApp.month.value != null) {
	budgetReportApp.budgetReportApp.save('budgetReportApp.month', budgetReportApp.month.value);
	console.log('budgetReportApp.month was saved');
	budgetReportApp.monthSaved = true;
	} else {
		console.log('failed to save budgetReportApp.month');
		budgetReportApp.monthSaved = false;
	}

});


// Save budgetReportApp.currency
budgetReportApp.currency.addEventListener('input', function() {

	if (budgetReportApp.currency.value != null) {
	budgetReportApp.budgetReportApp.save('budgetReportApp.currency', budgetReportApp.currency.value);
	console.log('budgetReportApp.currency was saved');
	budgetReportApp.currencySaved = true;
	} else {
		console.log('failed to save budgetReportApp.currency');
		budgetReportApp.monthSaved = false;
	}

});

/*
* ========================================
*	RETRIEVE SAVED DATA
* ========================================
*/

// Retrieve budgetReportApp.month
	budgetReportApp.monthRetrieved = sessionStorage.getItem('budgetReportApp.month');
	
	// Retrieve budgetReportApp.month as the input placeholder
	if(budgetReportApp.monthRetrieved != undefined) {
		budgetReportApp.month.setAttribute('placeholder', budgetReportApp.monthRetrieved);
		document.getElementById('error').innerText = "Ups! Something went wrong. Here is a saved version of your data!" +
		"But unfortunately at this moment you can't interact with it.";	
	} else {
		budgetReportApp.month.setAttribute('placeholder', 'month');
	}	

// Retrieve budgetReportApp.currency
	budgetReportApp.currencyRetrieved = sessionStorage.getItem('budgetReportApp.currency');

	if(budgetReportApp.currencyRetrieved != undefined) {
		budgetReportApp.currency.setAttribute('placeholder', budgetReportApp.currencyRetrieved);
	} else {
		budgetReportApp.currency.setAttribute('placeholder', 'USD');
	}


// Retrieve the income_name (budgetReportApp.totalIncomeLabel array)

	budgetReportApp.totalIncomeLabelRetrieved = JSON.parse(sessionStorage.getItem('budgetReportApp.totalIncomeLabel'));

	if(budgetReportApp.totalIncomeLabelRetrieved.length > 0) {		
		budgetReportApp.incomeOutput.style.display = "block";
		budgetReportApp.totaLabel= "";
		for(x in budgetReportApp.totalIncomeLabelRetrieved) {		
			budgetReportApp.totalLabel = '<p>' + budgetReportApp.totalLabel + budgetReportApp.totalIncomeLabelRetrieved[x] + '</p>'; 
			budgetReportApp.incomeNameOutput.innerHTML = budgetReportApp.totalLabel;
		}
		
	}

// Retrieve the income_value (budgetReportApp.totalIncome array)

	budgetReportApp.totalIncomeRetrieved = JSON.parse(sessionStorage.getItem('budgetReportApp.totalIncome'));

		if(budgetReportApp.totalIncomeRetrieved.length > 0) {
			budgetReportApp.incomeOutput.style.display = "block";
			budgetReportApp.totalValue1= "";		
			for(x in budgetReportApp.totalIncomeRetrieved) {		
				budgetReportApp.totalValue1 = '<p>' + budgetReportApp.totalValue1 + budgetReportApp.totalIncomeRetrieved[x] + " " + "<span name='remove-button' class='remove-button'>-</span>" + '</p>'; 
				budgetReportApp.incomeValueOutput.innerHTML = '<p>' + budgetReportApp.totalValue1 + '</p>';			
			}
			budgetReportApp.incomeSum = 0;
			for(y in budgetReportApp.totalIncomeRetrieved) {
				budgetReportApp.incomeSum = budgetReportApp.incomeSum + budgetReportApp.totalIncomeRetrieved[y];
			}			
			budgetReportApp.totalIncomeOutput.innerHTML = '<p>' + budgetReportApp.incomeSum + '</p>';
		}

// Retrieve the expense_name (budgetReportApp.totalExpenseLabel array)

	budgetReportApp.totalExpenseLabelRetrieved = JSON.parse(sessionStorage.getItem('budgetReportApp.totalExpenseLabel'));

	if(budgetReportApp.totalExpenseLabelRetrieved.length > 0) {		
		budgetReportApp.expenseOutput.style.display = "block";
		budgetReportApp.totalLabel = "";
		for(x in budgetReportApp.totalExpenseLabelRetrieved) {		
			budgetReportApp.totalLabel = '<p>' + budgetReportApp.totalLabel + budgetReportApp.totalExpenseLabelRetrieved[x] + '</p>'; 
			budgetReportApp.expenseNameOutput.innerHTML = budgetReportApp.totalLabel;
		}
		
	}

// Retrieve the expense_value (budgetReportApp.totalExpense array)

	budgetReportApp.totalExpenseRetrieved = JSON.parse(sessionStorage.getItem('budgetReportApp.totalExpense'));

		if(budgetReportApp.totalExpenseRetrieved.length > 0) {
			budgetReportApp.expenseOutput.style.display = "block";
			budgetReportApp.totalValue2= "";		
			for(x in budgetReportApp.totalExpenseRetrieved) {		
				budgetReportApp.totalValue2 = '<p>' + budgetReportApp.totalValue2 + budgetReportApp.totalExpenseRetrieved[x] + " " + "<span name='remove-button' class='remove-button'>-</span>" + '</p>'; 
				budgetReportApp.expenseValueOutput.innerHTML = '<p>' + budgetReportApp.totalValue2 + '</p>';			
			}
			budgetReportApp.expenseSum = 0;
			for(z in budgetReportApp.totalExpenseRetrieved) {
				budgetReportApp.expenseSum = budgetReportApp.expenseSum + budgetReportApp.totalExpenseRetrieved[z];
			}			
			budgetReportApp.totalExpenseOutput.innerHTML = '<p>' + budgetReportApp.expenseSum + '</p>';		
		}

// Retrieve the budgetReportApp.cashflow 

	if(budgetReportApp.cashflowSaved === true) {
		
			budgetReportApp.cashflowRetrieved = sessionStorage.getItem('budgetReportApp.cashflow');
			
			if(budgetReportApp.cashflowRetrieved > 0) {
				budgetReportApp.cashflowOutput.innerText = "+ " + budgetReportApp.cashflowRetrieved;
				budgetReportApp.cashflowOutput.style.color = "green";			
			} else if (budgetReportApp.cashflowRetrieved === 0) {
				budgetReportApp.cashflowOutput.innerText = budgetReportApp.cashflowRetrieved;
			} else {
				budgetReportApp.cashflowOutput.innerText = budgetReportApp.cashflowRetrieved;
				budgetReportApp.cashflowOutput.style.color = "red";			
			}	

		} 


	budgetReportApp.removeBtn = document.getElementsByName('remove-button');

	for(x in budgetReportApp.removeBtn) {
		budgetReportApp.removeBtn[x].addEventListener('click', function() {
			alert("Sorry, at this moment you can't delete saved values");
		});
	}

