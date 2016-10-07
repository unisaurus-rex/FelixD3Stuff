function drawSmoothLine(){
   //set margins for axes
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 400- margin.left - margin.right,
      height = 175 - margin.top - margin.bottom;

    //parses time into correct format
    var parseDate = d3.time.format("%d-%b-%y").parse;
    var formatTime = d3.time.format("%e %B");
    var parseMonthYear = d3.time.format("%b-%y").parse;

    //setup axes
    var x = d3.time.scale()
      .range([0, width]);

    var y = d3.scale.linear()
      .range([height, 0]);

    //return data
    var area = d3.svg.area()
      .x(function(d) { return x(d.date); })
      .y0(height)
      .y1(function(d) { return y(d.close); })
      .interpolate("basis") //smooth lines 
      ;

    var areatwo = d3.svg.area()
      .x(function(d) { return x(d.date); })
      .y0(height)
      .y1(function(d) { return y(d.pin); })
      .interpolate("basis") //smooth lines 
      ;

    //draw the svg and classes into the selected div
    var svgtwo = d3.select("div#chartsmoothlineid")
      .append("div")
      .classed("svg-container", true)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .classed("svg-container padding", true)
      .attr("viewBox","0 0 " + width + " " + height)
      //class to make it responsive
      .classed("svg-content-responsive", true)
      ;

    //generate initial chart from data.tsv
    updateChart("yearly.tsv");

    // handle data selection change
    d3.select('#opts')
      .on('change', function() {
        updateChart(d3.select(this).property('value'));
    });

    //update data used
    function updateChart(newData) {
      //remove the current data
      svgtwo.selectAll("*").remove();

      // Define the div for the tooltip
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>Spend:</strong> <span>" + d.close + "k" + "</span>";
        })
      svgtwo.call(tip);

      var secondtip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>Spend:</strong> <span>" + d.pin + "k" + "</span>";
        })
      svgtwo.call(secondtip);

      //if daily is chosen
      if (newData == "daily.tsv"){
        console.log('daily');

        d3.tsv("allcharts/linedaily.tsv", function(error, data) {
          if (error) throw error;

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .ticks(8)
          .ticks(d3.time.days, 3)
          .innerTickSize(-height)
          .outerTickSize(0)
          .tickPadding(10)
          ;

        var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(5)
          .innerTickSize(-width)
          .outerTickSize(0)
          .tickPadding(10)
          .tickFormat(function(d) { return d + "k"; })
          ;

          //get the data
          data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.close = +d.close;
            d.pin = +d.pin;
          });

          //set the domain
          x.domain(d3.extent(data, function(d) { return d.date; }));
          y.domain([0, d3.max(data, function(d) { return Math.max(d.close, d.pin); })]);

          //draw the paths
          svgtwo.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area)
            //.style("stroke", "#00a9e0")
            .style("fill", "#00a9e0")
            ;
          svgtwo.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", areatwo)
            //.style("stroke", "#ff0000")
            .style("fill", "#8b8c8d")
            ;

          //set x axis
          svgtwo.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

          //y axis
          svgtwo.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Spending in thousands");

          //Add the scatterplot points
          var dots = svgtwo.selectAll("dot")  
            .data(data);
          
          //add the circles and hover events
          /*
          dots.enter().append("circle")               
            .attr("r", 3)   
            .attr("cx", function(d) { return x(d.date); })     
            .attr("cy", function(d) { return y(d.close); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            ; 

          dots.enter().append("circle")               
            .attr("r", 3)   
            .attr("cx", function(d) { return x(d.date); })     
            .attr("cy", function(d) { return y(d.pin); })
            .on('mouseover', secondtip.show)
            .on('mouseout', secondtip.hide)
            ;               
          */
        })
      }

      if (newData == "yearly.tsv"){
        
        console.log('yearly');
        
        //plot yearly
        d3.tsv("allcharts/lineyearly.tsv", function(error, data) {
          if (error) throw error;

        //get the data
        data.forEach(function(d) {
          d.date = parseMonthYear(d.date);
          d.close = +d.close;
          d.pin = +d.pin;
        });

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(8)
      .innerTickSize(-height)
      .outerTickSize(0)
      .tickPadding(10)
      .tickFormat(d3.time.format("%b"))
      ;

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5)
      .innerTickSize(-width)
      .outerTickSize(0)
      .tickPadding(10)
      .tickFormat(function(d) { return d + "k"; })
      ;

        //set domains
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.close; })]);

          svgtwo.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area)
            //.style("stroke", "#00a9e0")
            .style("fill", "#8b8c8d")
            ;

          svgtwo.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", areatwo)
            //.style("stroke", "#ff0000")
            .style("fill", "#00a9e0")
            ;
        //x axis
        svgtwo.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          ;

        //y axis
        svgtwo.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          //.text("Spending in thousands")
          ;

        // Add the scatterplot
        var dots = svgtwo.selectAll("dot")  
          .data(data);
        
        //add the circles and hover events
          /*         
          dots.enter().append("circle")               
            .attr("r", 5)   
            .attr("cx", function(d) { return x(d.date); })     
            .attr("cy", function(d) { return y(d.close); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            ; 

          dots.enter().append("circle")               
            .attr("r", 5)   
            .attr("cx", function(d) { return x(d.date); })     
            .attr("cy", function(d) { return y(d.pin); })
            .on('mouseover', secondtip.show)
            .on('mouseout', secondtip.hide)
            ; 
          */

        }) //end yearly plot
      } //end if for year
    } // end update legend function






}