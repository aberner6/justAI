var svg;
var eachEntry;
var xScale;
var xAxis;
var years = [];
var alongWidth;
var uniqueYears;
var uniqueAuthors;
var uniqueKeywords;
var uniqueMostKeyed;
var uniqueTotalsKeyed;

var kLabels = false;
var allLabels = true;

var journalTypes = [];
var authors = [];
var keywords = [];
var uniqueTypes;
var goSecond = false;
var totals = [];
var totalAuthors = [];
var totalKeywords = [];
var huh = [];
var total1 = 0;
var total2 = 0;
var total3 = 0;
var total4 = 0;
var total5 = 0;
var total6 = 0;
var totalss = {};
var opacityMap;
var firstLoadVar;
var firstLoad = -1;
var secLoad = -1;
var secondLoadVar;
var secondLoad = -1;
var padding = 35;
var padX = 100;

var minYear;
var maxYear;
var maxAuthor;
var maxCited;
var thisTotal;
var totalsCircles;
var textsAre;
var heightScale;
var singleScale;
var thisData = [];
var theseAuthors = [];
var theseKeywords = [];
var focusKeywords = [];
var totalK = [];
var uniqueKDone = false;


var theX = [];
var maxEntries;
var citeNums = [];
var radius = 3;
//Width and height
var w = window.outerWidth;
var h = window.innerHeight - 50;
var newCircle;

var color; //=  d3.scale.category20c();

var colorSpectrum;
var initialZoom = 1,
    maxZoom = 10;
var filterNum;

var exitK;
var returnK;
var minK;
var otherTransform;
var doOther;

var animateZoom = false;
var showReset = false;
var overallView = false;
var loadIt;
var itsDone = false;

svg = d3.select("#container")
    .append("svg")
    // .attr("width", w)
    // .attr("height", h)
    .attr({
        "width": "100%",
        "height": "100%",
    })
var vis = svg //for the visualization
    .append('svg:g')
    .attr("transform",
        "translate(" + 0 + "," + 0 + ")");


$("#key").click(function() {
    // d3.select("#key").classed("selected", true);

    $(".keyCirc, .newlabel, .paperCirc, .journoCirc, .descriplabel").toggle();
})
var startingX = 20;
var startingY = 349; //523;

var startingXLabel = 34;
var startingYLabel = 351; //525;

var t = [1];
var keyCircle = vis.selectAll("keyCirc")
    .data(t)
    .enter()
    .append("circle").attr("class", "keyCirc")
    .attr("cx", 20)
    .attr("cy", startingY)
    .attr("fill", "white")
    .attr("stroke", "gray")
    .attr("r", 8)
// var t = [1];
var keyLabel = vis.selectAll("keylabel")
    .data(t)
    .enter()
    .append("text").attr("class", "newlabel")
    .attr("x", 34)
    .attr("y", startingYLabel)
    .text("White Dot: Major Keyword")
var paperKeyCircle = vis.selectAll("paperCirc")
    .data(t)
    .enter()
    .append("circle").attr("class", "paperCirc")
    .attr("cx", 20)
    .attr("cy", startingY - 20)
    .attr("fill", 'rgb(251,180,174)')
    .attr("r", radius)
var paperLabel = vis.selectAll("keylabel")
    .data(t)
    .enter()
    .append("text").attr("class", "newlabel")
    .attr("x", 34)
    .attr("y", startingYLabel - 18)
    .text("Colored Dot: Paper")

loadData("../subsetGS2.csv", .1) //localllll

function loadData(csvName, filterNum) {
    citeNums.length = 0;
    keywords.length = 0;
    authors.length = 0;
    theseKeywords.length = 0;
    theseAuthors.length = 0;
    journalTypes.length = 0;
    totals.length = 0;
    totalAuthors.length = 0;
    totalKeywords.length = 0;
    focusKeywords.length = 0;
    totalK.length = 0;

    d3.csv(csvName, function(data) {
        console.log(data);
        thisData = (data);
        for (i = 0; i < data.length; i++) {
            // if(isNaN(data[i].Year)==false){
            //     years[i] = data[i].Year;
            // }
            // if (isNaN(parseInt(thisData[i].Cited))) {
            //     citeNums[i] = (0);
            // } else {
            //     citeNums[i] = (parseInt(thisData[i].Cited))
            // }

            if (data[i].DE != "undefined") {
                keywords[i] = data[i].DE.split("; ");
            }
            if (data[i].AU != "undefined") {
                authors[i] = data[i].AU.split("; ");
            }
            for (j = 0; j < authors[i].length; j++) {
                theseAuthors.push(authors[i][j]);
            }
            for (j = 0; j < keywords[i].length; j++) {
                theseKeywords.push(keywords[i][j]);
            }
            // authors[i] = data[i].Authors.split(";");
            // journalTypes[i] = data[i].Authors;
            if (data[i].SO != "undefined" && data[i].SO.length != 0) {
                journalTypes[i] = data[i].SO.toLowerCase();
            }
        } //generates an array of all Names
        var keywordSorted = false;
        for (i = 0; i < theseKeywords.length; i++) {
            // theseKeywords
            if (theseKeywords[i].length == 0) {
                theseKeywords.splice(i, 1)
            }
            keywordSorted = true;
        }

        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        uniqueTypes = journalTypes.filter(onlyUnique); //finds unique names
        uniqueTypes = uniqueTypes.sort();
        // for(i=0; i<uniqueTypes.length; i++){
        //     if(uniqueTypes[i].length==0){
        //           uniqueTypes.splice(i,1)            
        //     }
        // }
        // uniqueTypes.split(".,")
        //split on names
        // uniqueYears = years.filter( onlyUnique ); //finds unique names

        // uniqueAuthors = theseAuthors.filter( onlyUnique ); //finds unique authors
        uniqueKeywords = theseKeywords.filter(onlyUnique); //finds unique authors

        // console.log("Unique Years: " + uniqueYears);

        function valueConsolidation(givenYear, i) {
            var total = 0;
            for (i = 0; i < data.length; i++) {
                if (data[i].Year != "undefined" && data[i].Year == givenYear) {
                    total++;
                } else {}
            }
            return total;
        }

        function authorConsolidation(givenAuthor, i) {
            var total = 0;
            for (i = 0; i < theseAuthors.length; i++) {
                if (theseAuthors[i] == givenAuthor) {
                    total++;
                } else {}
            }
            return total;
        }

        function keyConsolidation(givenKey, i) {
            var total = 0;
            for (i = 0; i < theseKeywords.length; i++) {
                if (theseKeywords[i] == givenKey) {
                    total++;
                } else {}
            }
            return total;
        }
        // for (i = 0; i<uniqueYears.length; i++){
        //     totals[i]= valueConsolidation(uniqueYears[i])
        // } //creates a new aray with the sums of all the different Names

        // for (i = 0; i<theseAuthors.length; i++){
        //     totalAuthors[i]= authorConsolidation(theseAuthors[i])
        // } //creates a new aray with the sums of all the different Names


        if (keywordSorted == true) {
            for (i = 0; i < theseKeywords.length; i++) {
                if (theseKeywords[i].length > 0) {
                    totalKeywords[i] = keyConsolidation(theseKeywords[i])
                    var mostKeyed = d3.max(totalKeywords);
                    if (totalKeywords[i] > mostKeyed * filterNum) {
                        focusKeywords.push(theseKeywords[i]);
                        // focusKeywords.push([totalKeywords[i], theseKeywords[i]]);
                    }

                }
            } //creates a new aray with the sums of all the different Names
        }
        uniqueMostKeyed = focusKeywords.filter(onlyUnique); //finds unique authors
        for (i = 0; i < uniqueMostKeyed.length; i++) {
            totalK[i] = keyConsolidation(uniqueMostKeyed[i])
            uniqueKDone = true;
        }


        // maxAuthor = d3.max(totalAuthors, function(d) { return d; });
        // singleScale = d3.scale.linear()
        //     .domain([1, maxAuthor*5])
        //     .range([1, h/6-100]);

        maxEntries = d3.max(totals, function(d) {
            return d;
        });

        // minYear = d3.min(years, function(d) { return d; });
        // maxYear = d3.max(years, function(d) { return d; });

        // xScale = d3.scale.linear()
        //     .domain([minYear, maxYear]) //not min year to max year
        //     .range([padX, w-padX]);

        maxCited = d3.max(citeNums, function(d) {
            return d;
        });

        // opacityMap = d3.scale.linear()
        //     .domain([0, maxCited])
        //     .range([.1, 1])        

        heightScale = d3.scale.linear()
            .domain([0, maxEntries])
            .range([padding, h / 1.1 + padding]);

        // var xTime = d3.time.scale()
        //     .domain([new Date(minYear-1,7,1), new Date(maxYear,7,1)])
        //     .range([padX-10, w-padX+15]);

        // .range([padX, w-padX+40]);
        // .range([padX-10, w-padX+10]);

        // xAxis = d3.svg.axis()
        //     .scale(xTime)
        //     .ticks(d3.time.years)
        //     .tickSize(6,0)
        //     .orient("bottom");

        opacityMap = d3.scale.linear()
            .domain([0, maxNodeCited])
            .range([.2, 1])

        colorSpectrum = [
            "#fc5988", "#b14a41", "#6ab054", "#8675ee", "#fcb752", "#89e2fe"
        ]

        color = d3.scale.ordinal()
            .domain([0, uniqueTypes.length])
            .range(colorSpectrum);


        console.log(uniqueTypes.length)
        var journoTitle = vis.selectAll("keylabel")
            .data(t)
            .enter()
            .append("text").attr("class", "newlabel")
            .attr("x", 17)
            .attr("y", 391)
            .text("Each color represents a scientific journal:")

        var keyTypes = ["Neuron", "Nature Reviews Neuroscience", "Nature Neuroscience", "Trends in Cognitive Sciences", "Pain", "Plos Biology", "Annual Review of Neuroscience"]
        keyTypes = keyTypes.sort();
        if (uniqueTypes.length > 4) {
            var journoCircle = vis.selectAll("journoCirc")
                .data(keyTypes)
                .enter()
                .append("circle").attr("class", "journoCirc")
                .attr("cy", function(d, i) {
                    return i * 18 + 407;
                })
                .attr("cx", 20)
                .attr("fill", function(d) {
                    return color(d)
                })
                .attr("r", radius)

            var journoLabel = vis.selectAll("keylabel")
                .data(keyTypes)
                .enter()
                .append("text").attr("class", "newlabel")
                .attr("y", function(d, i) {
                    return i * 18 + 411;
                })
                .attr("x", 34)
                .text(function(d) {
                    return toTitleCase(d);
                });

            callOthers();
        }

        function toTitleCase(str) {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    })
}



//also should do node scale?       

var fishEyeGo = false;
var b = 0;
var whatis = [];

$(document).ready(function() {

    $("#titlename").toggle(); //show   
    $("body").keypress(function() {
        (b += 1);
        if (b == 1) {
            if (uniqueKDone == true) {
                // console.log("uniqueKDone"+uniqueKDone) 
                // arrangeClusters(); 
            }
        }
        if (b == 2) {
            // callOthers();
        }
        if (b == 3) {
            // simpleNodes();
            // b=0;
            // $("#titlename").toggle();  //show    

        }
        if (b == 4) {
            // $(".labels").show();
        }
        if (b == 5) {
            $("#titlename").hide(); //show    
            makeNewNodes();
        }
        if (b == 6) {
            doOther();
        }
        if (b == 7) {
            whatis[0] = whatis[0] - radius * 4;
            whatis[1] = whatis[1] - radius * 4;
            minK(whatis)
        }
    });
})
var saveOne = [];
var thisY = [];
var thisX = [];

var links = [];
var nodeCited = [];
var nodes = {};
var drag;
var n;
var maxNodeCited;

function callOthers() {
    links = [];
    console.log(links.length)

    if (itsDone == false) {
        for (i = 0; i < thisData.length; i++) {
            for (j = 0; j < uniqueMostKeyed.length; j++) {
                if (keywords[i].indexOf(uniqueMostKeyed[j]) != -1) {
                    links.push({
                        "source": keywords[i],
                        "target": uniqueMostKeyed[j],
                        "sourceTitle": thisData[i].SO.toLowerCase(),
                        "cites": parseInt(thisData[i].NR),
                        "headline": thisData[i].TI,
                        "authors": thisData[i].AU
                    })
                }
            }
        }
        simpleNodes();
    }
    if (itsDone == true) {
        makeNewNodes();
    }
    console.log(links.length)

    d3.select("#titlename").classed("selected", true);
    if (kLabels) {

        d3.selectAll(".paperTitle")
            .transition()
            .attr("x", 40)

        d3.selectAll(".otherClass")
            .transition()
            .attr("transform", "translate(36,80)")

        $("#titlename").hide("fast")
    }
    if (allLabels) {
        $("#titlename").slideDown("slow")
    }


}

var rMap;

var circle, path, text;
var force;
var scaleRadius = 5;
var howLong = [];
var nodes = {};

var thisPaperName;
getTextWidth = function(text, font) {
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
};

function simpleNodes() {

    console.log(links.length);
    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
        link.source = nodes[link.source] || (nodes[link.source] = {
            name: link.source,
            cites: link.cites,
            sTitle: link.sourceTitle,
            headline: link.headline,
            authors: link.authors
        });
        link.target = nodes[link.target] || (nodes[link.target] = {
            name: link.target
        });
    });

    force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([w, h])
        .linkDistance(20)
        .charge(-200)
        .on("tick", tick)
        .start();

    drag = force.drag()
        .on("dragstart", dragstart);

    var thisMap;

    var thisWeight = [];
    var maxWeight;
    path = vis.selectAll("path")
        .data(force.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("stroke", function(d, i) {
            // console.log(d);
            for (k = 0; k < uniqueTypes.length; k++) {
                if (d.sourceTitle == uniqueTypes[k]) {
                    return color(k);
                }
            }
            if (howLong.length > 0) {
                if (howLong[i][0].length == 1) {
                    return "white";
                }
            }
        })


    circle = vis.selectAll("node")
        .data(force.nodes())
        .enter().append("circle")
        .attr("class", function(d) {
            howLong.push(d.name);
            thisWeight.push(d.weight);
            maxWeight = d3.max(thisWeight, function(d) {
                return d;
            })
            rMap = d3.scale.linear()
                .domain([0, maxWeight])
                .range([radius, radius * 9])

            return "node";
        })
    circle
        .attr("r", function(d, i) {
            return radius / 10;
        })
        .attr("fill", function(d, i) {

            if (isNaN(parseInt(d.cites))) {
                nodeCited.push(0);
            } else {
                nodeCited.push(parseInt(d.cites))
            }
            maxNodeCited = d3.max(nodeCited, function(d) {
                return d;
            })

            for (k = 0; k < uniqueTypes.length; k++) {
                if (d.sTitle == uniqueTypes[k]) {
                    return color(k);
                }
            }
            if (howLong.length > 0) {
                if (howLong[i][0].length == 1) {
                    return "white";
                }
            }
        })
        .attr("stroke", function(d, i) {
            if (howLong.length > 0) {
                if (howLong[i][0].length == 1) {
                    return "black";
                }
                if (howLong[i][0].length > 1) {
                    return "none";
                }
            }
        })
        .attr("stroke-width", .3)
        .attr("opacity", function(d, i) {
            thisMap = d3.scale.linear()
                .domain([0, maxNodeCited])
                .range([.9, 1])
            return thisMap(nodeCited[i]);
        })

        .on("dblclick", dblclick)
        .call(drag);

    circle
        .transition()
        .duration(2000)
        .attr("r", function(d, i) {
            if (howLong[i][0].length == 1) {
                return rMap(d.weight);
            }
            return radius;
        });

    function dblclick(d) {
        d3.select(this).classed("fixed", d.fixed = false);
    }

    function dragstart(d) {
        d3.select(this).classed("fixed", d.fixed = true);
    }

    console.log("simple nodes")
    $("#titlename").fadeOut("slow")

    text = vis.selectAll("labels")
        .data(force.nodes())
        .enter().append("text")
        .attr("class", "labels")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(function(d, i) {
            if (howLong.length > 1) {
                if (howLong[i][0].length == 1) {
                    return d.name;
                }
            }
        });
    $(".labels").show();
    $(".kandellabels").hide();
    function tick() {
        path.attr("d", linkArc);
        circle
            .attr("transform", transform);
        text.attr("transform", transform);
    }

    function linkArc(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    function transform(d) {
        d.x = Math.max(radius, Math.min(w - radius, d.x));
        d.y = Math.max(radius, Math.min(h - radius, d.y));
        return "translate(" + d.x + "," + d.y + ")";
    }
    $('circle').tipsy({
        gravity: 'w',
        html: true,
        delayIn: 500,
        title: function() {

            var d = this.__data__;
            console.log(d);
            if (d.name[0].length == 1) {
                return "Major Keyword: " + d.name;
            }
            return "Paper Keywords:" + '<br>' + d.name + '<br>' + '<br>' + "Title:" + '<br>' + d.headline;
        }
    });
    $('#clickZoom').fadeIn();

    var c = false;
    $('#citeRate').slideDown();
    d3.select("#citeRate").classed("selected", true);

    $('#focusKandel').slideDown();

    $('#citeRate').click(function() {
        d3.select("#citeRate").classed("selected", true);
        d3.select("#labelsOn").classed("selected", false);
        d3.select("#focusKandel").classed("selected", false);

        allLabels = true;
        kLabels = false;

        nodesBack();
        $(".labels").show();
        $("#titlename").show();
        $(".paperTitle").hide();
        $(".kandellabels").hide();
        exitK();

    })

    var k = false;
    var otherDone = false;
    $('#focusKandel').click(function() {
        d3.select("#focusKandel").classed("selected", true);
        d3.select("#citeRate").classed("selected", false);
        d3.select("#labelsOn").classed("selected", false);
        $(".labels").hide();
        $("#titlename").hide();

        allLabels = false;
        kLabels = true;
        if (itsDone == false) {
            focusKandel();
            $(".kandellabels").show();
        } else {
            stopBigNet();
        }

        $(".paperTitle").show();
        $("#titlename").hide();
        // }
    })


    citeYScale = d3.scale.linear()
        .domain([0, maxNodeCited])
        .range([h - padding, h / 10]);

    function nodesToOther() {
        //HERE MAYBE WORDS SHOULD COME BACK BUT ONLY IF THEY ARE THE MAJOR ONES?
        force.stop();
        circle.transition()
            .attr("transform", newTransform);
        path
            .transition()
            .attr("d", linkArc);

        function textTransform(d, i) {
            if (i % 2 == 1) {
                var thisy = citeYScale(nodeCited[i]) - padding * 2 + Math.random() * i;
                return "translate(" + d.x + "," + thisy + ")";
            } else {
                var thisy = citeYScale(0) + padding * 1.8 - Math.random() * i;
                return "translate(" + d.x + "," + thisy + ")";
            }
        }

        function newTransform(d, i) {
            if (isNaN(parseInt(d.cites)) == false) {
                d.y = citeYScale(nodeCited[i]); //not links[i].cites
                return "translate(" + d.x + "," + d.y + ")";
            } else {
                d.y = citeYScale(0); //not links[i].cites
                return "translate(" + d.x + "," + d.y + ")";
            }
        }
    }

    var p0 = [w / 2, h / 2, 1000];
    var p1;
    var p2;

    function focusKandel() {
        force.stop()
        circle.transition()
            .duration(4000)
            .attr("stroke", function(d) {
                if (d.headline == "Cognitive neuroscience and the study of memory") {
                    newCircle = d3.select(this).transition().attr("class", "newClass")
                        .attr("stroke", "yellow");
                    console.log(newCircle.attr("x"))
                    // p7 = [calcX[specialCirc], calcY[specialCirc], 100];

                    return "yellow";
                }
            })
            .each("end", transitionKandel());
    }


    var loadK;
    var didLoad = false;

    loadK = setInterval(function() {
        if (itsDone == true) {
            loadIt("theseCiteKandel.csv");
            didLoad = true;
        }
        if (didLoad == true) {
            console.log("done")
            clearInterval(loadK);
        }
    }, 500);




    function transitionKandel() {
        circle.transition()
            .duration(4000)
            .attr("transform", newTransform)
            .each("end", function() {
                itsDone = true;
            })

        path
            .transition()
            .duration(4000)
            .attr("d", linkArc);
        var t = [1];
        var selectedPaper = "Selected Paper: Cognitive neuroscience and the study of memory";
        thisPaperName = getTextWidth(selectedPaper, "18px Helvetica Neue"); // reports 84

        var newLabel = vis.selectAll("newlabel")
            .data(t)
            .enter()
            .append("text").attr("class", "paperTitle")
            .attr("x", w / 2 - thisPaperName / 2)
            .attr("y", h / 8)
            .attr("fill", "gray")
            .text("Selected Paper: Cognitive neuroscience and the study of memory")

        var newLabel = vis.selectAll("newlabel")
            .data(t)
            .enter()
            .append("text").attr("class", "paperTitle")
            .attr("x", w / 2 - thisPaperName / 2)
            .attr("y", h / 6)
            .attr("fill", "gray")
            .text("Principal Investigator: Eric Kandel")

        newCircle
            .transition()
            .duration(500)
            .attr("r", function(d) {
                p1 = [d.x, d.y, 1000];
                console.log(d.x + "x" + d.y + "y")
                return rMap(d.cites) / 8;
            })
            .each("end", function() {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("r", radius)
                    .each("end", function() {
                        d3.select(this)
                            .transition()
                            .duration(500)
                            .attr("r", function(d) {
                                p2 = [d.x, d.y, 1000];
                                return rMap(d.cites) / 8;
                            })
                            .each("end", function() {
                                d3.select(this)
                                    .transition()
                                    .duration(1000)
                                    .attr("class", "otherClass")
                                    .attr("transform", otherTransform)
                            })
                    })
            })

        function newTransform(d, i) {
            d.y = h; //not links[i].cites
            return "translate(" + d.x + "," + d.y + ")";
        }

        otherTransform = function(d, i) {
            d.y = h / 10; //not links[i].cites
            d.x = w / 2 - thisPaperName / 2;
            return "translate(" + d.x + "," + d.y + ")";
        }

    }


    loadIt = function(whichcsv) {
        force.stop();
        console.log("loading")
        loadData(whichcsv, .3);
        if (uniqueTypes.length > 15) {}
    }

    function nodesBack() {
        force.start();
        overallView = true;
        console.log(newCircle)
        console.log(d3.select(newCircle));
        doOther();
    }
    doOther = function() {
        d3.select(".otherClass")
            .transition()
            .duration(500)
            .attr("opacity", function(d) {
                d3.select(this).classed("fixed", d.fixed = true)
                whatis[0] = d.x;
                whatis[1] = d.y;
            });
    }

}


var kforce;
var kcircle, kpath, ktext;

function makeNewNodes() {
    console.log("make new nodes")
    var links = [];

    for (i = 0; i < thisData.length; i++) {
        for (j = 0; j < uniqueMostKeyed.length; j++) {
            if (keywords[i].indexOf(uniqueMostKeyed[j]) != -1) {
                links.push({
                    "source": keywords[i],
                    "target": uniqueMostKeyed[j],
                    "sourceTitle": thisData[i].SO.toLowerCase(),
                    "cites": parseInt(thisData[i].NR),
                    "headline": thisData[i].TI,
                    "authors": thisData[i].AU
                })
            }
        }
    }
    console.log(links.length);
    populateNewNodes()

    function populateNewNodes() {
        if (showReset == true) {
            resetZoom();
        }
        var t = [1];

        var newLabel = vis.selectAll("newlabel")
            .data(t)
            .enter()
            .append("text").attr("class", "paperTitle")
            .attr("x", w / 2 - thisPaperName / 2)
            .attr("y", h / 5)
            .attr("fill", "gray")
            .text("All papers that cite Kandel's, grouped by major keywords")

        console.log("populateNewNodes")
        var nodes = {};
        var drag;
        var kmaxNodeCited;
        var knodeCited = [];

        // Compute the distinct nodes from the links.
        links.forEach(function(link) {
            link.source = nodes[link.source] || (nodes[link.source] = {
                name: link.source,
                cites: link.cites,
                sTitle: link.sourceTitle,
                headline: link.headline,
                authors: link.authors
            });
            link.target = nodes[link.target] || (nodes[link.target] = {
                name: link.target
            });
        });
        var kTicked = false;
        kforce = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([w, h])
            .linkDistance(20)
            .charge(-200)
            .on("tick", ktick)
            .start();
        console.log(nodes)
        drag = kforce.drag()
            .on("dragstart", dragstart);

        var thisMap;
        var thisWeight = [];
        var maxWeight;
        var rMap;
        var khowLong = [];

        kpath = vis.selectAll("kpath")
            .data(kforce.links())
            .enter().append("path")
            .attr("class", "klink")
            .attr("opacity", .1)
            .attr("stroke", function(d, i) {
                for (k = 0; k < uniqueTypes.length; k++) {
                    if (d.sourceTitle == uniqueTypes[k]) {
                        return color(k);
                    }
                }
                if (howLong.length > 0) {
                    if (howLong[i][0].length == 1) {
                        return "white";
                    }
                }
            })

        kcircle = vis.selectAll("kcircle")
            .data(kforce.nodes())
            .enter().append("circle")
            .attr("class", "knode")
            .attr("r", function(d, i) {
                khowLong.push(d.name);
                thisWeight.push(d.weight);
                maxWeight = d3.max(thisWeight, function(d) {
                    return d;
                })
                rMap = d3.scale.linear()
                    .domain([0, maxWeight])
                    .range([radius, radius * 9])

                return radius / 10;
            })
            .attr("fill", function(d, i) {

                if (isNaN(parseInt(d.cites))) {
                    knodeCited.push(0);
                } else {
                    knodeCited.push(parseInt(d.cites))
                }
                kmaxNodeCited = d3.max(knodeCited, function(d) {
                    return d;
                })

                for (k = 0; k < uniqueTypes.length; k++) {
                    if (d.sTitle == uniqueTypes[k]) {
                        return color(k);
                    }
                }
                if (khowLong.length > 0) {
                    if (khowLong[i][0].length == 1) {
                        return "white";
                    }
                }
            })
            .attr("stroke", function(d, i) {
                if (khowLong[i][0].length == 1) {
                    return "black";
                }
                if (khowLong[i][0].length > 1) {
                    return "none";
                }
            })
            .attr("stroke-width", .3)
            .attr("opacity", function(d, i) {
                thisMap = d3.scale.linear()
                    .domain([0, kmaxNodeCited])
                    .range([.9, 1])
                return thisMap(knodeCited[i]);
            })

            .on("dblclick", dblclick)
            .call(drag);

        kcircle
            .transition()
            .duration(2000)
            .attr("r", function(d, i) {
                if (khowLong[i][0].length == 1) {
                    return rMap(d.weight);
                }
                return radius;
            });

        function dblclick(d) {
            d3.select(this).classed("fixed", d.fixed = false);
        }

        function dragstart(d) {
            d3.select(this).classed("fixed", d.fixed = true);
        }

        // text = svg.append("g").selectAll("text")
        ktext = vis.selectAll("ktext")
            .data(kforce.nodes())
            .enter().append("text")
            .attr("class", "kandellabels")
            .attr("x", 8)
            .attr("y", ".31em")
            .text(function(d, i) {
                if (khowLong.length > 1) {
                    if (khowLong[i][0].length == 1) {
                        return d.name;
                    }
                }
            });
        $(".labels").hide();
        $(".kandellabels").show();

        $('circle').tipsy({
            gravity: 'w',
            html: true,
            delayIn: 500,
            title: function() {

                var d = this.__data__;
                console.log(d)
                if (d.name[0].length == 1) {
                    return "Major Keyword: " + d.name;
                }
                return "Paper Keywords:" + '<br>' + d.name + '<br>' + '<br>' + "Title:" + '<br>' + d.headline;
            }
        });
    }
    exitK = function exitKandel() {
        kforce.stop()
        transitionKOut();
    }

    function transitionKOut() {
        console.log("k out")

        kcircle.transition()
            .duration(3000)
            .attr("opacity", 0)

        kcircle.transition()
            .duration(4100)
            .attr("transform", newTransform);

        kpath
            .transition()
            .duration(4000)
            .attr("d", linkArc)

        function newTransform(d, i) {
            d.y = h; //not links[i].cites
            return "translate(" + d.x + "," + d.y + ")";
        }
    }

    minK = function minimizeK(whatis) {

        console.log("minK")
        if (overallView == true) { //if big network is shown
            kforce
                .size([radius / 2, radius / 2]) //same parameters as kandel circle
                .linkDistance(radius / 4)
                .charge(-1)
                .on("tick", ktick)
                .start();

            kcircle
                .transition()
                .duration(4000)
                .attr("r", radius / 8)
                .attr("cx", whatis[0])
                .attr("cy", whatis[1])
                .attr("transform", minTransform)


            kpath
                .transition()
                .duration(4000)
                .attr("transform", "translate(" + (whatis[0]) + "," + (whatis[1]) + ")")
                .attr("d", linkArc)

        }
        //endoffunction
    }

    function mintick() {
        kpath
            .attr("d", linkArc);
        kcircle
            .attr("transform", minTransform)

        // ktext
        // .attr("transform", minTransform);
    }
    // // Use elliptical arc path segments to doubly-encode directionality.
    function ktick() {
        kpath
            .attr("d", linkArc);
        kcircle
            .attr("transform", transform);
        ktext
            .attr("transform", transform);
    }

    function minTransform(d) {
        // d.x = w/4;
        // d.y = h/2;      
        return "translate(" + d.x + "," + d.y + ")";
    }

    function transform(d) {
        d.x = Math.max(radius, Math.min(w - radius, d.x));
        d.y = Math.max(radius, Math.min(h - radius, d.y));
        return "translate(" + d.x + "," + d.y + ")";
    }
}


function linkArc(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}




function stopBigNet() {
    force.stop()
    circle.transition()
        .duration(2000)
        .attr("transform", newTransform)
        .each("end", function() {
            otherDone = true;
            if (otherDone == true) {
                kforce.start();
                otherDone = false;
            }
        })

    path
        .transition()
        .duration(2000)
        .attr("d", linkArc);

    d3.selectAll(".otherClass")
        .transition()
        .duration(1000)
        .attr("transform", otherTransform)

    function newTransform(d, i) {
        d.y = h; //not links[i].cites
        return "translate(" + d.x + "," + d.y + ")";
    }

    otherTransform = function(d, i) {
        d.y = h / 10; //not links[i].cites
        d.x = w / 2 - thisPaperName / 2;
        return "translate(" + d.x + "," + d.y + ")";
    }
}




// $( document ).ready(function() {
svg.call(d3.behavior.zoom() //setting up zoom abilities
    .scale(1.0)
    .scaleExtent([initialZoom, maxZoom])
    .on("zoom", function() {
        var t = d3.event.translate;
        var s = d3.event.scale;
        zoomInOut(t, s);
    })
);
var zoomInOut = function(t, s) {
    // console.log(t)
    if (showReset == true) {
        $('#reset').slideDown("slow");
    }
    if (showReset == false) {
        $('#reset').slideUp("slow");
    }
    if (s >= initialZoom) {
        showReset = true;
    }
    if (s < initialZoom) {
        showReset = false;
    }

    vis.attr("transform",
        "translate(" + d3.event.translate + ")" +
        " scale(" + d3.event.scale + ")");
};

d3.select("#reset").on("click", resetZoom);

function resetZoom() {
    console.log("reset viz")
    vis.attr("transform",
        "translate(" + 0 + "," + 0 + ")" +
        " scale(" + initialZoom + ")");

    showReset = false;
    $('#reset').slideUp("slow");
};

//don't let people zoom in all of these ways - will mess up clicks etcs
svg.on("mousedown.zoom", null)
    .on("touchstart.zoom", null)
    .on("touchmove.zoom", null)
    .on("dblclick.zoom", null)
    .on("touchend.zoom", null);