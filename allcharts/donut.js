function drawDonut(){
   //set size
  console.log ();
  var width =  500,
      height =  500,
      radius = Math.min(width, height) / 2;

      var innerrad = radius/3;

  //set the colors
  var color = d3.scale.ordinal()
      .range(["#40c1ac", "#fd0000", "#ffa300", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  //set the tooltip
  var tiptwo = d3.tip()
    .attr('class', 'd3-tip')
    .offset([35, 0])
    .html(function(d) {
      return "<strong>" + d.data.age +":</strong> <span>" + d.data.population  + "</span>";
    })
    

  //set size of outer arc
  var arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(radius - innerrad);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.population; })
      .padAngle(.03)
      ;

  //draw the pie 
  var svg = d3.select("div#donutid")
    .classed("svg-container", true)
    .append("svg")
    //.attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox","0 0 " + width + " " + height)
    //class to make it responsive
    .classed("svg-content-responsive-pie", true)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  //Draw the inner Circle
  svg.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 500)
    .attr("fill", "white");

  //initialize tool tip
  svg.call(tiptwo);

  //plot data
  d3.csv("allcharts/donutdata.csv", type, function(error, data) {
    if (error) throw error;

  //sum for center text
  var sum =0;
    data.forEach(function(d) {
      sum += +d.population;
  });

  //add hover tooltip
  var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc")
    .on('mouseover', tiptwo.show)
    .on('mouseout', tiptwo.hide)
    ;

  //hover circle
  var arcOver = d3.svg.arc()
    .innerRadius(radius-innerrad)
    .outerRadius(radius + 15);

  //plot the data and create the hover transitions
  g.append("path")
    .attr("d", arc)
    .style("fill", function(d) { return color(d.data.age); })
    .on("mouseover", function(d) {
      d3.select(this).transition()
        .duration(1000)
        .attr("d", arcOver);
    })

    .on("mouseout", function(d) {
      d3.select(this).transition()
        .duration(1000)
        .attr("d", arc);
    })
  ;

  //set text for inner circle
  svg.append("text")
    .attr("dy", "-0.5em")
    .style("text-anchor", "middle")
    .attr("class", "inside")
    .text(function() { return 'TOTAL TRANS'; });
  svg.append("text")
    .attr("dy", ".95em")
    .style("text-anchor", "middle")
    .attr("class", "data")
    .text(function() { return sum;  });
  
  }); //end d3 read

  //return data as number
  function type(d) {
    d.population = +d.population;
    return d;
  }

}
