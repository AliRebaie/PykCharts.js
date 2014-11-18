// get positions for each set
sets = venn.venn(sets, overlaps);

// draw the diagram in the 'venn' div
var diagram = venn.drawD3Diagram(d3.select(".venn"), sets, 500, 500);

// add a tooltip showing the size of each set/intersection
var tooltip = d3.select("body").append("div")
    .attr("class", "venntooltip");

d3.selection.prototype.moveParentToFront = function() {
  return this.each(function(){
    this.parentNode.parentNode.appendChild(this.parentNode);
  });
};

// hover on all the circles
diagram.circles
    .style("stroke-opacity", 0)
    .style("stroke", "white")
    .style("stroke-width", "2");

diagram.nodes
    .on("mousemove", function() {
        tooltip.style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseover", function(d, i) {
        var selection = d3.select(this).select("circle");
        selection.moveParentToFront()
            .transition()
            .style("fill-opacity", .5)
            .style("stroke-opacity", 1);

        tooltip.transition().style("opacity", .9);
        tooltip.text(d.size + " users");
    })
    .on("mouseout", function(d, i) {
        d3.select(this).select("circle").transition()
            .style("fill-opacity", .3)
            .style("stroke-opacity", 0);
        tooltip.transition().style("opacity", 0);
    });

// draw a path around each intersection area, add hover there as well
diagram.svg.selectAll("path")
    .data(overlaps)
    .enter()
    .append("path")
    .attr("d", function(d) {
        return venn.intersectionAreaPath(d.sets.map(function(j) { return sets[j]; }));
    })
    .style("fill-opacity","0")
    .style("fill", "black")
    .style("stroke-opacity", 0)
    .style("stroke", "white")
    .style("stroke-width", "2")
    .on("mouseover", function(d, i) {
        d3.select(this).transition()
            .style("fill-opacity", .1)
            .style("stroke-opacity", 1);
        tooltip.transition().style("opacity", .9);
        tooltip.text(d.size + " users");
    })
    .on("mouseout", function(d, i) {
        d3.select(this).transition()
            .style("fill-opacity", 0)
            .style("stroke-opacity", 0);
        tooltip.transition().style("opacity", 0);
    })
    .on("mousemove", function() {
        tooltip.style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
    })
