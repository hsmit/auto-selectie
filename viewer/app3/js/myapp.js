var width = 960,
    size = 230,
    padding = 20;

//  maak assenstelsel
var x = d3.scale.linear().range([padding / 2, size - padding / 2]);
var y = d3.scale.linear().range([size - padding / 2, padding / 2]);
var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(6);
var yAxis = d3.svg.axis().scale(y).orient("left").ticks(6);

// kleurenschema?
var color = d3.scale.category10();

var csv = d3.dsv(";");

csv("data/autos.csv", function(error, data) {
    if (error) throw error;


    data.forEach(function(d) {d.prijs = +d.prijs});
    data.forEach(function(d) {d.km = +d.km});
    data.forEach(function(d) {d.jaar = +d.jaar});
    data.forEach(function(d) {d.merk = d.merk.toLowerCase()});
    data.forEach(function(d) {d.type = d.type.toLowerCase()});

    var domainByTrait = {};

    // extract eigenschappen van eerste record
    var traits = d3.keys(data[0]).filter(function(d) { return d !== "merk" && d!=="type" && d!=="naam" && d!=="url"; });
    var n = traits.length;

    // merken lijst
    var alfabetischeMerken = d3
        .map(data, function(d){return d.merk;})
        .values()
        .sort(function(x, y){
            return d3.ascending(x.merk, y.merk);
        });

    // typen lijst
    var alfabetischeTypen = d3.map(data, function(d){return d.type;}).values().sort(function(x, y){
        return d3.ascending(x.type, y.type);
    });

    // toon alle merken (dropdown)
    d3.select("body")
        .append("div")
        .attr("id", "filter")
        .append("select")
        .attr("id", "merk")
        .on('change',onSelectMerk)
        .selectAll("option")
        .data(alfabetischeMerken)
        .enter()
        .append("option")
        .style("color", function(d){return color(d.merk);})
        .text(function(d) {return d.merk});

    d3.select("select#merk").append("option").attr("selected", "true").text("all");


    // toon alle typen
    d3.select("div#filter")
        .append("select")
        .attr("id", "type")
        .on('change', onSelectType)
        .selectAll("option")
        .data(alfabetischeTypen)
        .enter()
        .append("option")
        .text(function(d) {return d.type});

    d3.select("select#type").append("option").attr("selected", "true").text("all");

    // zoek ranges van de waarden per eigenschap
    traits.forEach(function(trait) {
        domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
    });

    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);

    // definieer selectie tool
    var brush = d3.svg.brush()
        .x(x)
        .y(y)
        .on("brushstart", brushstart)
        .on("brush", brushmove)
        .on("brushend", brushend);



    // maak svg op body element (met ruimte voor 'n' blokken van 230px) en verschuif iets
    var svg = d3.select("body").append("div")
        .append("svg")
        .attr("width", size * n + padding)
        .attr("height", size * (n + 1) + padding)
        .append("g")
        .attr("transform", "translate(" + (10+padding) + "," + padding / 2 + ")");

    // teken x assen
    svg.selectAll(".x.axis")
        .data(traits)
        .enter().append("g")
        .attr("class", "x axis")
        .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
        .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

    // teken y assen
    svg.selectAll(".y.axis")
        .data(traits)
        .enter().append("g")
        .attr("class", "y axis")
        .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
        .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

    // voor elke eigenschap-combinatie wordt een cell (svg group) aangemaakt.
    var cell = svg.selectAll(".cell")
        .data(cross(traits, traits))
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
        .each(plot);

    // Titles for the diagonal.
    cell.filter(function(d) { return d.i === d.j; }).append("text")
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(function(d) { return d.x; });


    // toon alle auto's
    var tableRow = d3.select("body").append("div").attr("id", "table").selectAll("p").data(data).enter().append("p");
    tableRow.append("span").text(function(d) {return "€" + d.prijs;});
    tableRow.append("a").attr("href", function(d){return d.url;}).text(function (d) {return d.naam;});

    // show bins
    var records = 780;
    var heightFactor = size/records;
    var bins = 8;
    var barwidth = size / bins;
    d3.select("svg").append("g").attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + 0 + "," + ((3 * size) + 40)  + ")"})
        .selectAll("rect")
        .data(d3.layout.histogram().bins(210/barwidth)(d3.entries(data).map(function(d){return d.value.km})))
        .enter()
        .append("rect")
        .attr("x", function(d, i){return padding + 20 + (barwidth * i)} )
        .attr("y", padding / 2)
        .attr("width", barwidth)
        .attr("height", function(d) { return d.length * heightFactor;})
        .style("fill", "rgb(255,0,0)");


    d3.select("svg").append("g").attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + 230 + "," + ((3 * size) + 40)  + ")"})
        .selectAll("rect")
        .data(d3.layout.histogram().bins(210/barwidth)(d3.entries(data).map(function(d){return d.value.jaar})))
        .enter()
        .append("rect")
        .attr("x", function(d, i){return padding + 20 + (barwidth * i)} )
        .attr("y", padding / 2)
        .attr("width", barwidth)
        .attr("height", function(d) { return d.length * heightFactor;})
        .style("fill", "rgb(255,0,0)");


    d3.select("svg").append("g").attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + 460 + "," + ((3 * size) + 40)  + ")"})
        .selectAll("rect")
        .data(d3.layout.histogram().bins(210/barwidth)(d3.entries(data).map(function(d){return d.value.prijs})))
        .enter()
        .append("rect")
        .attr("x", function(d, i){return padding + 20 + (barwidth * i)} )
        .attr("y", padding / 2)
        .attr("width", barwidth)
        .attr("height", function(d) { return d.length * heightFactor;})
        .style("fill", "rgb(255,0,0)");

    cell.call(brush);

    // teken 1 cell (p is een item uit de cross(a,b), 'this' is de svg group.cell )
    function plot(p) {

        var cell = d3.select(this);

        x.domain(domainByTrait[p.x]);
        y.domain(domainByTrait[p.y]);

        cell.append("rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        // teken een circle voor deze group cell
        cell.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", function(d) { return x(d[p.x]); })
            .attr("cy", function(d) { return y(d[p.y]); })
            .attr("r", 4)
            .style("fill", function(d) { return color(d.merk); });
    }

    var brushCell;

    // Clear the previously-active brush, if any.
    function brushstart(p) {
        if (brushCell !== this) {
            d3.select(brushCell).call(brush.clear());
            x.domain(domainByTrait[p.x]);
            y.domain(domainByTrait[p.y]);
            brushCell = this;
        }
    }

    // Highlight the selected circles.
    function brushmove(p) {
        var e = brush.extent();
        svg.selectAll("circle").classed("hidden", fz(p, e));
        d3.select("div#table").selectAll("p").classed("hidden", fz(p, e))
    }

    var fz = function(p, e) {
        return function(d) {
            var outsideBrush = e[0][0] > d[p.x] || d[p.x] > e[1][0] || e[0][1] > d[p.y] || d[p.y] > e[1][1];
            var m = d3.select('select#merk').property('value');
            var t = d3.select('select#type').property('value');
            var insideCriteria = (m == "all" || d.merk == m) && (t == "all" || d.type == t);
            return outsideBrush || !insideCriteria;
        }
    };

    // If the brush is empty, select all circles.
    function brushend() {
        if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
    }

    function onSelectMerk() {
        // hide andere merken
        var m = d3.select('select#merk').property('value');
        svg.selectAll("circle").classed("hidden", function(d) {
            return d.merk !== m;
        });
        // filter 2e drop-down
        var subset = d3.map(data.filter(function(d){return d.merk === m}), function(d){return d.type;}).values().sort(function(x, y){
            return d3.ascending(x.type, y.type);
        });

        // hide
        d3.select("select#type").selectAll("option").classed("hidden", function(d) {
            if(d){
                return d.merk !== m;
            }
        });

        // hide not matching tabel entries
        d3.select("div#table").selectAll("p").classed("hidden", function(d) {
            return d.merk !== m;
        });

    }

    function onSelectType() {
        var t = d3.select('select#type').property('value');
        svg.selectAll("circle").classed("hidden", function(d) {
            return d.type !== t;
        });

        // hide not matching tabel entries
        d3.select("div#table").selectAll("p").classed("hidden", function(d) {
            return d.type !== t;
        });
    }


});

function cross(a, b) {
    var c = [],
        n = a.length,
        m = b.length, i, j;
    for (i = -1; ++i < n;)
        for (j = -1; ++j < m;)
            c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
}
