/**
 * Created by ZeroSurface on 2017-03-24.
 */

fetchData();

function  fetchData() {
    $.ajax({
        type: "GET",
        url: 'ajax/get_data/', //the script to call to get data
        dataType: 'JSON',                //data format
        success: function(pokemons) {
            console.log(pokemons);
            drawPacking(pokemons);

        },
        failure: function(pokemons) {
            alert('Got an error dude');
        }
    });
}

function drawPacking(data) {

var shown = false;

var svg = d3.select("svg"),
    margin = 20,
    diameter = +svg.attr("width"),
    g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

var color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);


  root = d3.hierarchy(data)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });

  var focus = root,
      nodes = pack(root).descendants(),
      view;

  var circle = g.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
      //.style("fill", function(d) { return d.parent ? d.children ? d.data.color: 'url(#image' + d.data.pokeId + ')' : null; })
      .style("fill", function(d) { return d.children ? d.data.color : "#f0f0ff"; })
      .attr("text", function(d) { return d.parent ? d.children ? null : d.data.name : null})
      //.attr("xlink:href", function(d) { return d.parent ? d.children ? null : frontPath + d.data.pokeId +'.png' : null; })
      .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); })
      .on("mouseover", function(d) {
          if (d.parent) {
              if (d.children) {}
              else{
                  if (!shown) {
                      var x = d3.event.pageX;
                      var y = d3.event.pageY;
                      //Update the tooltip position and value
                      d3.select("#tooltipS")
                          .style("left", x - 125 + "px")
                          .style("top", y - 250 + "px")
                          .select("#value")
                          .text(d.data.name);

                      d3.select("#tooltipS")
                          .select("#header")
                          .text(d.info);
                  }
                  shown = false;

                  //Show the tooltip
                  d3.select("#tooltipS").classed("hidden", false);
              }
          }
       })
       .on("mouseout", function (d) {
           if (d.parent) {
              if (d.children) {}
              else{
                  //Show the tooltip
                  d3.select("#tooltipS").classed("hidden", true);
              }
          }
       });

   var image = g.selectAll("image")
    .data(nodes)
    .enter().append("image")
      .attr("xlink:href", function(d) { return frontPath + d.data.pokeId + '.png'})
      .style("fill-opacity", function(d) { return d.depth === 2 ? 1 : 0; })
      .style("display", function(d) { return d.depth === 3 ? null : "none"; })
      .on("mouseover", function(d) {
          if (d.parent) {
              if (d.children) {}
              else{
                  shown = true;
                  //Update the tooltip position and value
                  d3.select("#tooltipS")
                      .select("#value")
                      .text(d.data.name);

                  d3.select("#tooltipS")
                      .select("#header")
                      .text(d.info);

                  //Show the tooltip
                  d3.select("#tooltipS").classed("hidden", false);
              }
          }
       })
       .on("mouseout", function (d) {
           if (d.parent) {
              if (d.children) {}
              else{
                  //Show the tooltip
                  d3.select("#tooltipS").classed("hidden", true);
              }
          }
       });

  var text = g.selectAll("text")
    .data(nodes)
    .enter().append("text")
      .attr("class", "label")
      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
      .text(function(d) { return d.children ? d.data.name : null;});

  var node = g.selectAll("circle,text,image");

  svg
      .style("background", "#a4a4ff")
      .on("click", function() { zoom(root); });

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
    var focus0 = focus; focus = d;

    var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function(t) { zoomTo(i(t)); };
        });

    transition.selectAll("text")
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

    function zoomTo(v) {
		var k = diameter / v[2]; view = v;
		node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
		circle.attr("r", function(d) { return d.r * k; });
		image
			.attr("transform", function(d) { console.log(d.r); return "translate(" + (((d.x - v[0]) * (k)) - ((d.r / 2) * k)) + "," + (((d.y - v[1]) * (k)) - ((d.r / 2) * k)) + ")"; })
			.attr("width", function(d) { return d.r * k; })
			.attr("height", function(d) { return d.r * k; })
	}
}
