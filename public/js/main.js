(function() {
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
       width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.time.scale()
            .range([0, width]);
 
  var y = d3.scale.linear()
            .range([height, 0]);
 
  var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");
 
  var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");
 
  var line = d3.svg.line()
               .x(function(d) { return x(d.measured_at); })
               .y(function(d) { return y(d.temp); });
 
  var svg = d3.select("#indicator").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
       
  d3.json("temps.json", function(data) {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var date = today.getDate();
    data.forEach(function(d) {
      var times = d.measured_at.split(":");
      d.measured_at = new Date(year, month, date, times[0], times[1]);
      d.temp = d.temp / 1000; // 元データは1000倍された値になっている
    });
    
    x.domain(d3.extent(data, function(d) { return d.measured_at; }));
    y.domain(d3.extent(data, function(d) { return d.temp; }));

    svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);

    svg.append("g")
       .attr("class", "y axis")
       .call(yAxis)
       .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 6)
       .attr("dy", ".71em")
       .style("text-anchor", "end")
       .text("Temp (℃)");

    svg.append("path")
       .datum(data)
       .attr("class", "line")
       .attr("d", line); 
  });
})();
