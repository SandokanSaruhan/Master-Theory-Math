"use strict";


var recurrenceMath = new MathElem("recurrence");
var solutionMath = new MathElem("solution");


function calculate() {
	MathJax.Hub.Config({showProcessingMessages: false});
	
	// Get input
	var stringA = document.getElementById("var_a").value;
	var stringB = document.getElementById("var_b").value;
	var stringK = document.getElementById("var_k").value;
	var stringI = document.getElementById("var_i").value;
	if (stringA == "" || stringB == "" || stringK == "" || stringI == "")
		return;
	
	// Check input and render the recurrence equation
	var a = parseFloat(stringA);
	var b = parseFloat(stringB);
	var k = parseFloat(stringK);
	var i = parseFloat(stringI);
	var recurrenceText = "Error: ";
	if (isNaN(a))
		recurrenceText += "Invalid value for \\(a\\)";
	else if (isNaN(b))
		recurrenceText += "Invalid value for \\(b\\)";
	else if (isNaN(k))
		recurrenceText += "Invalid value for \\(k\\)";
	else if (isNaN(i))
		recurrenceText += "Invalid value for \\(i\\)";
	else if (a < 0)
		recurrenceText += "\\(a\\) must be non-negative";
	else if (b <= 1)
		recurrenceText += "\\(b\\) must be greater than 1";
	else if (k < 0)
		recurrenceText += "\\(k\\) must be at least 0";
	else if (i < 0)
		recurrenceText += "\\(i\\) must be at least 0";
	else
		recurrenceText = "\\(T(n) \\: = \\: " + (a != 1 ? a : "") + " \\: T(n" + (b != 1 ? " / " + b : "") + ") \\, + \\, \u0398(" + formatPolyLog(k, i) + ").\\)";
	recurrenceMath.render(recurrenceText);
	if (recurrenceText.substring(0, 6) == "Error:") {
		solutionMath.render("");
		return;
	}
	
	var p = Math.log(a) / Math.log(b);
	var result = "\\(T \\: \u2208 \\: \u0398(";
	if (floatEquals(p, k))
		result += formatPolyLog(k, i + 1);
	else if (p < k)
		result += formatPolyLog(k, i);
	else if (p > k) {
		if (floatEquals(Math.round(p), p))
			result += formatPolyLog(Math.round(p), 0);
		else
			result += formatPolyLog("\\log_{" + b + "} " + a, 0) + ") \\approx \u0398(" + formatPolyLog(p.toFixed(3), 0);
	} else
		result = null;
	if (result != null)
		result += ").\\)";
	else
		result = "Arithmetic Error";
	solutionMath.render(result);
}


function MathElem(id) {  // A container class
	var containerElem = document.getElementById(id);
	var nextText = null;
	
	this.render = function(text) {
		var start = nextText === null;
		nextText = text;
		if (start)
			update();
	};
	
	function update() {
		var text = nextText;
		var oldSpanElem = containerElem.querySelector("span");
		oldSpanElem.style.color = "#E0E0E0";
		var newSpanElem = document.createElement("span");
		newSpanElem.textContent = text;
		newSpanElem.style.display = "none";
		containerElem.appendChild(newSpanElem);
		MathJax.Hub.Queue(["Typeset", MathJax.Hub, newSpanElem]);
		MathJax.Hub.Queue(function() {
			containerElem.removeChild(oldSpanElem);
			newSpanElem.style.removeProperty("display");
			if (nextText !== text)
				update();
			else
				nextText = null;
		});
	};
}


function example(a, b, k, i) {
	document.getElementById("var_a").value = a + "";
	document.getElementById("var_b").value = b + "";
	document.getElementById("var_k").value = k + "";
	document.getElementById("var_i").value = i + "";
	calculate();
	return false;
}


// Returns a natural TeX string for the polylogarithmic expression (n^k log^i n).
function formatPolyLog(k, i) {
	// Process n^k
	var result = null;
	if (typeof k == "number") {
		if (k == 0 && i != 0)
			result = "";
		else if (k == 0 && i == 0)
			result = "1";
		else if (k == 0.5)
			result = "\\sqrt{n}";
		else if (k == 1)
			result = "n";
		else
			k = k.toString();
	}
	if (result != null);
	else if (typeof k == "string")
		result = "n^{" + k + "}";
	else
		throw "Invalid Argument";
	
	// Process log^i n
	if (i != 0) {
		if (result != "")
			result += " ";
		result += "\\log";
		if (i != 1)
			result += "^{" + i + "}";
		result += " n";
	}
	
	return result;
}


function floatEquals(x, y) {
	return Math.abs(x - y) < 1e-9;
}
