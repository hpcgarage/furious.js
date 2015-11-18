"use strict"; //why do we need this
class graph {
	constructor(svg) {
		this.svg = svg;
		this.dataset = null;
	}

	setStatic(usd_eur_3m_spread, usd_eur_rate, x, y_hat) {
		var w = 1000;
		var h = 400;
		  var data = {"Values":[]};
		  var padding = 50;
	      for (var i = 0; i < usd_eur_3m_spread.length; i++) {
	      		var test=[];
	      		test.push(usd_eur_3m_spread[i]);
	      		test.push(usd_eur_rate[i]);
	      		test.push(0);
	      		test.push(0);
	      		data["Values"].push(test);
	      		test=[];
	      };	
	      var dataset = [];
	      var parsed = (data['Values']);  
	      for (var i = 0; i < parsed.length; i++) {
	        for(var j = 0; j < 4; j++) {
	          if (j == 0 || j === 1) {
	            parsed[i][j] = (parseFloat(parsed[i][j])); 
	          }     
	        }
	        dataset.push(parsed[i]);  
	      };
	      console.log(dataset);
	      this.dataset = dataset;
	      var xScale = d3.scale.linear()
	                 .domain([d3.min(dataset, function(d) { return d[0]; }), d3.max(dataset, function(d) { return d[0]; })])
	                 .range([padding, w - padding * 2]);

	      var yScale = d3.scale.linear()
	                 .domain([0, d3.max(dataset, function(d) { return d[1]; })])
	                 .range([h - padding, padding]);

	      var rScale = d3.scale.linear()
	                 .domain([0, d3.max(dataset, function(d) { return d[1]; })])
	                 .range([2, 5]);

	      var xAxis = d3.svg.axis()
	                .scale(xScale)
	                .orient("bottom")
	                .ticks(5)

	      //Define Y axis
	      var yAxis = d3.svg.axis()
	                .scale(yScale)
	                .orient("left")
	                .ticks(5)

	     var xAxisAppend = svg.append("g")
	        .attr("class", "axis")
	        .attr("transform", "translate(0," + (h - padding) + ")")
	        .attr("stroke-width",1.2)
	        .call(xAxis);
	      
	      //Create Y axis
	     var yAxisAppend = svg.append("g")
	        .attr("class", "axis")
	        .attr("transform", "translate(" + padding*8.475 + ",0)")
	        .attr("stroke-width",1.2)
	        .call(yAxis);


		var ylabel = svg.append("g")
		   .append("text")
		   .attr("class", "label")
		   .attr("transform", "rotate(-90)")
		   .attr("y", 12)
		   .attr("dy", ".71em")
		    .attr("dx", "-15em")
		   .style("text-anchor", "end")
		   .attr("id","my-axis-name")
		   .text("USD Europe Rate");


		var xlabel = svg.append("g")
		   .append("text")
		   .attr("class", "label")
		      .attr("x", w/2 - 45)
		      .attr("y", h-15)
		      .style("text-anchor", "end")
		      .text("USD EUR Spread");

		var Circlessvg = svg.append("g");
		      //Create circles
		      Circlessvg.selectAll("circle")
		         .data(dataset)
		         .enter()
		         .append("circle")
		         .attr("cx", function(d) {
		            return xScale(d[0]);
		         })
		         .attr("cy", function(d) {
		            return yScale(d[1]);
		         })
		         .attr("r", function(d) {
		              return rScale(0.25);
		         })
		        .style("fill", function (d) {
		              return '#FF6666';
		        })
		        .style("stroke", function(d) {
		            return 'black';
		        }); 
		  var data1 = [];
		  //Line is being drawn here
		  for (var i = 0; i < x.length; i++) {
		  		var test = [];
		  		test.push(x[i]);
		  		test.push(y_hat[i]);
		  		data1.push(test);
		  		test=[];
		  };
		  var line = d3.svg.line()
		    .x(function(d, i) { return xScale(d[0]); })	
		    .y(function(d) { return yScale(d[1]); })

		  svg.append("svg:path")
		    .transition()
		    .attr("d", line(data1))
		    .attr("id", "rl")
		    .style("stroke", "black")
		    .style("stroke-width", 2)
		    .style("fill", "none");    

	}
			  
	updateLine(usd_eur_3m_spread, usd_eur_rate, x, y_hat) {
		  var padding = 50;
		  var w = 1000;
		  var h = 400;
	   	  var dataset = this.dataset;
	      var xScale = d3.scale.linear()
	                 .domain([d3.min(dataset, function(d) { return d[0]; }), d3.max(dataset, function(d) { return d[0]; })])
	                 .range([padding, w - padding * 2]);

	      var yScale = d3.scale.linear()
	                 .domain([0, d3.max(dataset, function(d) { return d[1]; })])
	                 .range([h - padding, padding]);

		  var data1 = [];
		  for (var i = 0; i < x.length; i++) {
		  		var test = [];
		  		test.push(x[i]);
		  		test.push(y_hat[i]);
		  		data1.push(test);
		  		test=[];
		  };
		var line = d3.svg.line()
		    .x(function(d, i) { return xScale(d[0]); })	
		    .y(function(d) { return yScale(d[1]); })
		svg.selectAll("#rl").attr("d", line(data1)); // apply the new data values
	}
}