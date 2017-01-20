

// READ FILENAME FROM BROWSE FILE show (will be deprecated)
function retrieveData(){
	var nomefile = "json/"+$("#dataset").val(); 	// retrieve filename
	Draw(nomefile);											// call Draw function
}


// RESET BROWSE FILE show (will be deprecated)
function clearData(){
	var control = $("#dataset"),
	clearBn = $("#clear");
	clearBn.on("click", function(){
		control.replaceWith( control.val('').clone( true ) );
	});
	control.on({
		change: function(){ console.log("Changed") },
		focus: function(){ console.log("Focus") }
	});
}


// CREATE GRAPH show
function Draw(nomefile){

	$.ajax({														// load json file
		dataType: "json",
		url: nomefile,
		success: function(result){							// return file content



			var data2 = [											// data2 contains data for graph2; data2[0] is the line AUC = 1
			{
				"x": [0.0, 3500],
				"y": [1.0, 1.0],
				"mode": "lines",
				"name": "AUC = 1",
				"line": {
					"dash": "dot",
					"color": "rgb(168, 168, 168)"
				}
			}
		];

		var colorpalette = [
			[0, 166, 160], //verde acqua
			[138, 196, 62], //verde pisello
			[52, 59, 67], //grigio scuro
			[196, 43, 19], //rosso scarlatto
			[40, 71, 166], //blu scuro
			[255, 186, 58], //arancione chiaro
			[169, 52, 255], //lilla
			[59, 175, 255], //azzurro
			[79, 217, 21], //verde brillante
			[217, 145, 196] //rosa
		];

		//DISEGNO DELLE ROC CURVES
		var ROCcurves = [];
		var count = 0;
		for(var i in result.tests){
			var obj = result.tests[i];
			var x = [];
			var y = [];
			for(var j in obj.fpr) x.push(obj.fpr[j]);
			for(var j in obj.tpr) y.push(obj.tpr[j]);
			ROCcurves.push(
				{
					"x": x,
					"y": y,
					"mode": "lines",
					"name": obj.ID,
					"line": {
						"shape": "spline",
						"color": "rgb("+colorpalette[count][0]+","+colorpalette[count][1]+","+colorpalette[count][2]+")"
					}
				}
			);
			count++;
		}

		ROCcurves.push({
			"x": [0.0, 1.0],
			"y": [0.0, 1.0],
			"mode": "lines",
			"name": "tpf = fpr",
			"line": {
				"dash": "dot",
				"color": "rgb(168, 168, 168)"
			}
		});


		var AUCcurves = [];

		var listAUC = [];
		for(var i in result.tests) {
			var obj = result.tests[i];
			var singleObj = {}
			singleObj['x'] = obj.trainingSize;
			singleObj['y'] = obj.AUC;
			listAUC.push(singleObj);
		};

		listAUC.sort(function(a, b) {						// sort to better interpolate AUC curve
			return ((a.x < b.x) ? -1 : ((a.x == b.x) ? 0 : 1));
		});

		var xAUC = [];
		var yAUC = [];
		for(var i in listAUC)
		{
			xAUC.push(listAUC[i].x);
			yAUC.push(listAUC[i].y);
		}
		AUCcurves.push({
			"x": xAUC,
			"y": yAUC,
			"mode": "splines",
			"name": "AUC curve",
			"line": {
				"dash": "dot",
				"color": "rgb("+colorpalette[count][4]+","+colorpalette[count][4]+","+colorpalette[count][4]+")"
			}
		});


		// graphic layout and print
		var layout1 = {
			legend: {
				y: 0.5,
				traceorder: 'reversed',
				font: {size: 16},
				yref: 'paper',
			},
			title: 'ROC Curve',
			xaxis: {
				title: 'fpr',
				range: [0, 1],
				autorange: false
			},
			yaxis: {
				title: 'tpr',
				range: [0, 1],
				autorange: false
			}
		};

		var layout2 = {
			legend: {
				y: 0.5,
				traceorder: 'reversed',
				font: {size: 16},
				yref: 'paper',
			},
			title: 'AUC Curve',
			xaxis: {
				title: 'N',
				range: [0, 350],
				autorange: false
			},
			yaxis: {
				title: 'AUC',
				range: [0, 1],
				autorange: false
			}
		};

		Plotly.newPlot('graph1', ROCcurves, layout1);
		Plotly.newPlot('graph2', AUCcurves, layout2);
	}
});
}

//append images from json files
function addimages(filename){
	$.ajax({														// load json file
		dataType: "json",
		url: filename,
		success: function(result){

			$("#modalcontent").empty();
			$("#falsepositive").empty();
			$("#falsenegative").empty();
			$("#accuracy").empty();
			$("#threshold").empty();
			$("#captionFP").empty();
			$("#captionFN").empty();

			var testname = $(".show_test").val();
			//aggiungo tutte le immagini

			for(var j in result.tests)
			{
				if(result.tests[j].ID == testname)
				{
					$("#captionFP").html("<p class='right'>False<br>positives</p>");
					$("#captionFN").html("<p class='right'>False<br>negatives</p>");

					var objtest = result.tests[j];
					$("#accuracy").append("<p class='result'>"+ objtest.accuracy + "</p><p>accuracy</p>");
					$("#threshold").append("<p class='result'>"+ objtest.threshold + "</p><p>threshold</p>");

					var slidenumber = 1
					for(var i in objtest.falsepositive)
					{
						var x = document.createElement("IMG");
						var obj = objtest.falsepositive[i];
						x.setAttribute("src", obj);
						x.setAttribute("onclick","openModal();currentSlide("+ slidenumber +")");
						x.setAttribute("class","hover-shadow cursor");
						document.getElementById("falsepositive").appendChild(x);
						$('#modalcontent').append("<div class='mySlides'><div class='numbertext'>"+ slidenumber +" / 4</div><img src="+obj+" style='width:100%'></div>");
						slidenumber++;
					}
					for(var i in objtest.falsenegative)
					{
						var x = document.createElement("IMG");
						var obj = objtest.falsenegative[i];
						x.setAttribute("src", obj);
						x.setAttribute("onclick","openModal();currentSlide("+ slidenumber +")");
						x.setAttribute("class","hover-shadow cursor");
						document.getElementById("falsenegative").appendChild(x);
						$('#modalcontent').append("<div class='mySlides'><div class='numbertext'>"+ slidenumber +" / 4</div><img src="+obj+" style='width:100%'></div>");
						slidenumber++;
					}
				}

			}

			$('#modalcontent').append("<a class='prev' onclick='plusSlides(-1)'>&#10094;</a>");
			$('#modalcontent').append("<a class='next' onclick='plusSlides(1)'>&#10095;</a>");
			$('#modalcontent').append("<div class='caption-container'><p id='caption'></p></div>");

			//aggiungo tutte le caption
			slidenumber=1;
			for(var i in objtest.falsepositive)
			{
				var obj = objtest.falsepositive[i];
				$('#modalcontent').append("<div class='column-captions'><img class='demo cursor' src="+obj+" onclick='currentSlide("+ slidenumber +")'></div>");
				slidenumber++;
			}
			for(var i in objtest.falsenegative)
			{
				var obj = objtest.falsenegative[i];
				$('#modalcontent').append("<div class='column-captions'><img class='demo cursor' src="+obj+" onclick='currentSlide("+ slidenumber +")'></div>");
				slidenumber++;
			}


		}
	});
}//end of function

// GALLERY LIGHTBOX show (sistemare z-index)
function openModal() {
	document.getElementById('myModal').style.display = "block";
}

function closeModal() {
	document.getElementById('myModal').style.display = "none";
}

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
	showSlides(slideIndex += n);
}

function currentSlide(n) {
	showSlides(slideIndex = n);
}

function showSlides(n) {
	var i;
	var slides = document.getElementsByClassName("mySlides");
	var dots = document.getElementsByClassName("demo");
	var captionText = document.getElementById("caption");
	if (n > slides.length) {slideIndex = 1}
	if (n < 1) {slideIndex = slides.length}
	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";
	}
	for (i = 0; i < dots.length; i++) {
		dots[i].className = dots[i].className.replace(" active", "");
	}
	slides[slideIndex-1].style.display = "block";
	dots[slideIndex-1].className += " active";
	captionText.innerHTML = dots[slideIndex-1].alt;
}

// generate table of classifier available (home)
function generateTable(filename) {
	$.ajax(
		{
			//	url: "/RetrieveClassifiers",  //path al servizio di Marco
			//type: 'POST',
			url: filename,
			//data:{classificator: img_class, false_pos: img_positive, false_neg: img_negative},
			dataType: 'json',
			success: function(result)
			{
				var label = [];
				var n_img = [];
				for(var i in result.classifiers)
				{
					var obj = result.classifiers[i];
					if(label.indexOf(obj.label) == -1) label.push(obj.label);
					if(n_img.indexOf(obj.trainingSize) == -1) n_img.push(obj.trainingSize);
				}
				n_img.sort(function(a, b){return a - b;});
				//Inizializzazione matrice dei classificatori
				var matrix = new Array(n_img.length);
				for (var i = 0; i < n_img.length; i++) {
					matrix[i] = new Array(label.length);
					for(var j = 0; j < label.length; j++){
						matrix[i][j] = "";
					}
				}
				//Inizializzazione matrice da stampare (classificatori + label + cardinality)
				var print_table = new Array(n_img.length+1);
				for (var i = 0; i < (n_img.length+1); i++) {
					print_table[i] = new Array(label.length+1);
				}
				//Riempimento della matrice più interna
				for(var i in result.classifiers)
				{
					var obj = result.classifiers[i];
					var n = label.indexOf(obj.label);
					var m = n_img.indexOf(obj.trainingSize);
					if(obj.status == "training")
					{
						if(matrix[n][m] !=  "")
						matrix[n][m] = matrix[n][m].concat("<div class='block'><a href><mark>"+ obj.label + "-" + obj.trainingSize +"</mark></a></div>");
						else matrix[n][m] = "<div class='block'><a href><mark>"+ obj.label + "-" + obj.trainingSize +"</mark></a></div>";
					}
					else {
						if(matrix[n][m] !=  "")
						matrix[n][m] = matrix[n][m].concat("<div class='block'><a href>"+ obj.label + "-" + obj.trainingSize + "</a></div>");
						else matrix[n][m] = "<div class='block'><a href>" + obj.label + "-" + obj.trainingSize + "</a></div>";
					}
				}
				//inizializza header delle label
				print_table[0][0] = "<b>Cardinality</b>";
				for(var j = 0; j < label.length; j++)	print_table[j+1][0] = label[j];
				for(var i = 0; i < n_img.length; i++) print_table[0][i+1] = n_img[i];
				//imposta la matrice dei contenuti da stampare
				for(var i = 0; i < n_img.length; i++)
				for(var j = 0; j < label.length; j++)
				print_table[i+1][j+1] = matrix[i][j];
				//add a table (idelement and table to print)
				addTable("dvTable",print_table);
			} //end of function
		}); //end of ajax call
	} //end of generateTable



	// UTILITY - add a table to a div element (home)
	function addTable(IDelement,table){
		//Create a HTML Table element.
		var tableElement = document.createElement("TABLE");
		var columnCount = table[0].length;
		var rowCount = table.length;
		//Add the data rows.
		for (var i = 0; i < rowCount; i++) {
			row = tableElement.insertRow(-1);
			for (var j = 0; j < columnCount; j++) {
				var cell = row.insertCell(-1);
				cell.innerHTML = table[i][j];
			}
		}
		var dvTable = document.getElementById(IDelement);
		dvTable.innerHTML = "";
		dvTable.appendChild(tableElement);
	}



	// generate list of training datasets (home)
	function generateList(filename) {
		$.ajax(
			{
				//url: '',  //path al servizio di Marco
				//type: 'POST',
				url: filename,
				//data:{classificator: img_class, false_pos: img_positive, false_neg: img_negative},
				dataType: 'json',
				success: function(result)
				{
					//Build matrix for training datasets
					var training_sets = new Array();
					training_sets.push(["Label", "Max number of images available"]);
					for(var i in result.trainingDatasets){
						var obj = result.trainingDatasets[i];
						training_sets.push([obj.label,obj.size]);
					}
					addTable("dvList",training_sets);


				}

			}
		);
	}

	// (home)
	function generateNumbers(filename){
		$.ajax({														// load json file
			dataType: "json",
			url: filename,
			async: false,
			success: function(result){							// return file content
				var ready = 0;
				var training = 0;
				var free = 0;

				for(var i in result.classifiers)
				{
					var obj = result.classifiers[i];
					if(obj.status == "ready") ready++;
					else training++
				}
				$('.ready').html(ready);
				$('.training').html(training);

				for(var i in result.VRinstances)
				{
					var obj = result.VRinstances[i];
					if(obj.customclassifier == 0) free++;
				}
				$('.free').html(free);
			}
		});
	}




	// READ SIMULATION CONFIGURATION simulation
	function retrieveSimConfig(){

		selectArray = Array.prototype.map.call($(".moltiplicandum select"),(function(el){
			return el.value;
		}));

		//console.log(selectArray);
		document.getElementById("sim-buttons").style.display = "none"; // after clicking, hide buttons
		document.getElementById("start").style.display = "block"; // after clicking, display watson logo
		$('#start').html("<img src='ico/loading-indicator.gif' id='loading'>");

		// Send a http request with AJAX to retrieve contents from backend
		/*$.ajax(
		{
		url: '',
		type: 'POST',
		data:{ array: selectArray },
		dataType: 'json',
		success: function(result)
		{
		// faccio cose, vedo gente, schiaccio cinque
	}
});*/


}


// simulation
function populateSelectSim(filename){

	$.ajax({														// load json file
		dataType: "json",
		url: filename,
		async: false,
		success: function(result)
		{

			// fill test set and cathegory drop down menu (only if status: ready)
			for(var i in result.testSets){
				var obj = result.testSets[i];
				if(obj.status == "ready"){
					$('.test_set').append($('<option>', {
						value: obj.ID,
						text: obj.label+" "+obj.size
					}));
					$('.avail_cat').append($('<option>', {
						value: obj.label,
						text: obj.label
					}));
				}
			}

			// fill classifier drop down menu (only if status: ready)
			for(var j in result.classifiers){
				var obj = result.classifiers[j];
				if(obj.status == "ready"){
					$('.avail_class').append($('<option>', {
						value: obj.ID,
						text: obj.label+" "+obj.trainingSize
					}));
				}
			}

			//update show page test set
			for(var j in result.tests){
				var obj = result.tests[j];
				$('.show_test').append($('<option>', {
					value: obj.ID,
					text: obj.ID
				}));
			}

		}
	});
}
