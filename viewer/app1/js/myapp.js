var MERK = "Volvo";
var TYPE = "V50";

var autoArray;
var csv = d3.dsv(";");
csv("./data/autos.csv", function(data) {
    autoArray = data;
    draw(data);
    //draw2(data);
    //draw3(data);
   // draw4();
});




function draw(v) {
    d3.select("#jaarPlot")
        .selectAll("div")
        .data(v.sort(function(a, b) { return d3.descending(a.jaar, b.jaar)}))
            .enter()
                .append("div")
                .attr("title", function (d) {
                    return d.jaar + " " + d.km + " " + d.merk + " " + d.prijs + " " + d.type;
                })
                .attr("class", "bar")
                .style("height", function (d) {
                    //return (d.jaar-1990) * 10 + "px";
                    return (d.km / 1000) + "px";

                })
                .style("width", function(d) {
                    return (window.innerWidth * 0.9/v.length) + "px";
                })

    ;

    d3.select("body").append("p").text("hi");

}
function draw2(v) {

    d3.select("#prijsPlot")
        .selectAll("div")
        .data(v.sort(function(a, b) { return d3.descending(a.prijs/1000, b.prijs/1000)}))
        .enter()
        .append("div")
        .attr("title", function (d) {
            return d.jaar + " " + d.km + " " + d.merk + " " + d.prijs + " " + d.type;
        })
        .attr("class", "bor")
        .style("height", function (d) {
            return (d.prijs / 100) + "px";
        })
        .style("width", function(d) {
            return (window.innerWidth * 0.9/v.length) + "px";
        })
    ;
}




var update = function() {
    d3.selectAll("div.bor").remove();
    d3.selectAll("div.bar").remove();
    var typeFilter = d3.select("#autotype").node().value;
    var merkFilter = d3.select("#automerk").node().value;

    var filtered = autoArray;
    if (merkFilter != "") {
        filtered = filtered.filter(function (d) {
            return d.merk == merkFilter;
        });
    }
    if (typeFilter != "") {
        filtered = filtered.filter(function (d) {
            return d.type == typeFilter;
        });
    }
    draw(filtered);
    draw2(filtered);

};
d3.select("#automerk").on("input", update);
d3.select("#autotype").on("input", update);

