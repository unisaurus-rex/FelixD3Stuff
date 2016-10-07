

function drawBar(){

  // margins
  var margin = {top: 20, right: 20, bottom: 100, left: 50},
    width = 500 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  //create scales
  var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);
  var x1 = d3.scale.ordinal();
  var y = d3.scale.linear()
    .range([height, 0]);

  //colors
  var colorthree = d3.scale.ordinal()
    .range(["#00a9e0", "#40c1ac", "#ffa300", "#fd0000", "#e5e5e5", "#4d4f53"]);

  //x axis
  var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom")
    .innerTickSize(-height)
    .outerTickSize(0)
    .tickPadding(10)
    ;

  //formatting for output
  var formatPercent = d3.format(".1%");

  //y axis
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent)
    .ticks(5)
    .innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(10)
    ;

  //tool tips
  var tipthree = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function(d) {
      return "<strong>Percentage:</strong> <span>" + formatPercent(d.value ) + "</span>";
    })
    ;

  //add svg
  var svgthree = d3.select("div#chartbarid")
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")     
    .attr("viewBox","0 0 " + width + " " + height)
     //class to make it responsive
    .classed("svg-content-responsive padding", true)
    ;

  //initialize tooltip
  svgthree.call(tipthree);

  //plot data 
  d3.csv("allcharts/bardata.csv", function(error, data) {
    if (error) throw error;

    //return data component other than x axis key
    var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "Issuer"; });

    //return data
    data.forEach(function(d) {
      d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    //set domains
    x0.domain(data.map(function(d) { return d.Issuer; }));
    x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

    //x axis
    svgthree.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      ;

    //y axis
    svgthree.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      //.text("percentage")
      ;

    // x axis text
    var issuer = svgthree.selectAll(".issuer")
      .data(data)
      .enter().append("g")
      .attr("class", "issuer")
      .attr("transform", function(d) { return "translate(" + x0(d.Issuer) + ",0)"; })
      ;

    // drawing the bars
    issuer.selectAll("rect")
      .data(function(d) { return d.ages; })
      .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return colorthree(d.name); })
      .on('mouseover', tipthree.show)
      .on('mouseout', tipthree.hide)
      ;

    // legend stuff this will likely by css instead of d3
    var legend = svgthree.selectAll(".legend")
      .data(ageNames.slice().reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (-width+ width/20 + i* width/5.5) + "," + "150" + ")"; });

    //draw the legend bars
    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", colorthree)
      ;

    //draw the legend text
    legend.append("text")
      .attr("x", width - 20)
      .attr("y", 5)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; })
      ;
  
  }); //end d3 read
}
  