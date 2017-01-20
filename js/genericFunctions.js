// GENERATE HEAD
function createHead(){
	var utilities = ["<meta charset='utf-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'>"];
	var css1 = ["<link rel='stylesheet' type='text/css' href='css/default.css'/>"];
	var css2 = ["<link rel='stylesheet' type='text/css' href='css/navbar.css'/>"];
	var css3 = ["<link rel='stylesheet' type='text/css' href='css/utilities.css'/>"];
	var title = ["<title>Watson VR Test</title>"];
	var desc = ["<meta name='description' class='head-description' content=''>"];
	var keys = ["<meta name='keywords' class='head-keywords' content=''>"];

	var headfull = utilities.concat(utilities, css1, css2, css3, title, desc, keys);
	$('head').append(headfull);
}


// GENERATE MENU
var path = ""; // website location relative to root folder
function createHeader(){
	var logo_mobile = ["<div id='logo' class='menuUp'><h1><a href='/'><img src='' height=''></a> &ensp;</h1><div id='navToggle'><a href='#'><span></span></a></div></div>"]; // mobile logo
	var logo_desktop = ["<div id='logoDesk'><a href='/'><img src='' class='logo' width=''>Watson VR ROC Tester</a></div>"]; // desktop logo
	var menu = ["<nav class='navlarger'><ul><li><a href='home.html'>Dashboard</li><li><a href='simulate.html'>Simulate</li><li><a href='#'>Train</li><li><a href='#'>Docs</li><li><a href='#'>About us</li><li><a href='#'><img src='ico/power_32.png' width='20px' style='filter:invert(100%);'></li><li><a href='#'><img src='ico/manage_32.png' width='20px' style='filter:invert(100%);'></li></ul></nav>"]; // menu elements
	var search = ["&ensp;&ensp;<input name='search' placeholder='' onfocus='this.placeholder = 'Cerca'' onblur='this.placeholder = '' class='searchlarger'>"]; // search button

	var headerfull = logo_mobile.concat(logo_desktop, menu, search);
	$('header').append(headerfull);
}


// REFRESH PAGE
function refreshPage(){
    window.location.reload(); // refresh entire page onclick
}
