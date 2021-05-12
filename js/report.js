/*** Variables ***/


//Datavis
//number of keywords 0-1, 0 will give a lot of keywords
var filterNum = 0;
var totalKeysDone = false;

var thisCount = 0;
var personCount=0;
var fundingCount = 0;
// SVG
var svg;
var w = window.outerWidth;
var h = window.innerHeight;

// for Key
var startingX = 20;
var startingY = 349; //523;
var startingXLabel = 34;
var startingYLabel = 351; //525;
var t = [1];
var keyTypes;
//= ["Video","Article","Book","Exhibit","Installation","Paper","List", "Essay"];

// Keywords
var keywords = [];
var keywordSorted;
var totalKeywords = [];
var theseKeywords = [];
var focusKeywords = [];
var uniqueKeywords;
var mostKeyed;
var uniqueMostKeyed;
var uniqueTotalsKeyed;

//Authors
var authors = [];
var authorsSorted;
var totalAuthors = [];
var theseAuthors = [];
var uniqueAuthors;
var uniqueADone;
var uniqueMostAuthors;
var uniqueTotalsAuthors;
var maxAuthor;
var totalA = [];

//Years
var years = [];
var uniqueYears;
var minYear;
var maxYear;

//Medium/ journal type
var journalTypes = [];
var uniqueTypes;


var eachEntry;
var xScale;
var xAxis;

var alongWidth;



var kLabels = false;
var allLabels = true;


var goSecond = false;
var totals = [];

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


var maxCited;
var thisTotal;
var totalsCircles;
var textsAre;
var heightScale;
var singleScale;
var thisData = [];


var uniqueKDone = false;

var theX = [];
var maxEntries;
var citeNums = [];
var radius = 4;
//Width and height

var newCircle;
var colorScalez;
var color =  

[
    "#fc5988"
    ,"#b14a41"
    ,"#6ab054"
    ,"#8675ee"
    ,"#fcb752"
    ,"#89e2fe"];

var initialZoom = 1,
    maxZoom = 10;


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

var fishEyeGo = false;

var whatis = [];

var saveOne = [];
var thisY = [];
var thisX = [];

var links = [];
var nodeCited = [];
var nodes = {};
var drag;
var n;
var maxNodeCited;

var rMap;
var circle, path, text, images;
var force;
var scaleRadius = 5;
var howLong = [];
var nodes = {};
var thisPaperName;



svg = d3.select("#container")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

var vis = svg //for the visualization
    .append('svg:g')
    .attr("transform", "translate(" + 0 + "," + 0 + ")");

var key = svg //for the visualization
    .append('svg:g')
    .attr("transform", "translate(" + 0 + "," + 0 + ")");


/***** KEY *****/

$("#key").click(function() {
    $(".keyCirc, .newlabel, .paperCirc, .journoCirc, .descriplabel").toggle();
})

// var paperKeyCircle = vis.selectAll("paperCirc")
//     .data(t)
//     .enter()
//     .append("circle").attr("class", "paperCirc")
//     .attr("cx", 20)
//     .attr("cy", startingY - 20)
//     .attr("fill", 'rgb(251,180,174)')
//     .attr("r", radius)

// var paperLabel = vis.selectAll("keylabel")
//     .data(t)
//     .enter()
//     .append("text").attr("class", "newlabel")
//     .attr("x", 34)
//     .attr("y", startingYLabel + 18)
//     .text("Colored Dot   Paper")

var keyCircle = key.selectAll("keyCirc")
    .data(t)
    .enter()
    .append("circle").attr("class", "keyCirc")
    .attr("cx", 20)
    .attr("cy", 120)
    .attr("fill", "white")
    .attr("stroke", "gray")
    .attr("r", 8)

var keyLabel = key.selectAll("keylabel")
    .data(t)
    .enter()
    .append("text").attr("class", "newlabel")
    .attr("x", 34)
    .attr("y", 120)
    .text("White Dot is a major keyword")

var journoTitle = key.selectAll("keylabel")
    .data(t)
    .enter()
    .append("text").attr("class", "newlabel")
    .attr("x", 17)
    .attr("y", 100)
    .text("Each color represents a type of input:")

d3.select("#titlename").classed("selected", true);
d3.select("#subtitlename").classed("selected", true);
$("#titlename").slideDown("slow")
$("#subtitlename").slideDown("slow")



/*** Import Data, sort and create nodes  ***/

// loadData("deskResearch.csv", filterNum)   // choose threshhold 0.001 to 1 to choose number of keywords to show
//old day

//new way
var dataG = [];
$(document).ready(function() {
    console.log("ready")
    d3.csv("../data/references.csv", function(entry) {

        console.log("in here get json")
        console.log(entry.length);
        for (i = 0; i < entry.length; i++) {
            dataG.push({
                "author": entry[i]['Author'],
                "keywords": entry[i]['Keywords'],
                "medium": entry[i]['Medium'],
                "title": entry[i]['Name'],
                "url": entry[i]['Link']
            })
        }
        console.log(dataG);

        loadData(dataG, filterNum);

    }); // end get
}); // end document.ready


/*** Setting up Zoom Ability  ***/
svg.call(d3.behavior.zoom()
    .scale(1.0)
    .scaleExtent([initialZoom, maxZoom])
    .on("zoom", function() {
        var t = d3.event.translate;
        var s = d3.event.scale;
        zoomInOut(t, s);
    })
);

//don't let people zoom in all of these ways - will mess up clicks etcs
svg.on("mousedown.zoom", null)
    .on("touchstart.zoom", null)
    .on("touchmove.zoom", null)
    .on("dblclick.zoom", null)
    .on("touchend.zoom", null);

d3.select("#reset").on("click", resetZoom);



/***********
  FUNCTIONS
************/


/***loadData()***/
console.log("helloooo")

function loadData(dataName, filterNum) {
    // console.log(dataName)
    citeNums.length = 0; // number of times cited
    keywords.length = 0; // number of unique keywords
    authors.length = 0; // number of author names

    theseKeywords.length = 0;
    theseAuthors.length = 0;

    journalTypes.length = 0;

    totalAuthors.length = 0;
    totalKeywords.length = 0;

    focusKeywords.length = 0;


    //load and organize data
    //old way
    // d3.csv(csvName, function(data) {
    thisData = (dataName);
    //old way

    data = dataName;
    for (i = 0; i < data.length; i++) {

        // if year data exists
        if (isNaN(data[i].year) == false) {
            years[i] = parseInt(data[i].year);
        }
        //if keywords exist add to array
        if (data[i].keywords != "undefined") {
            keywords[i] = data[i].keywords.split(", ");
        }

        // if originator exists add to array
        if (data[i].author != "undefined") {
            authors[i] = data[i].author.split(", ");
        }

        // 1 array with all the keywords
        for (j = 0; j < keywords[i].length; j++) {
            theseKeywords.push(keywords[i][j]);
        }

        // 1 array with all the authors
        for (j = 0; j < authors[i].length; j++) {
            theseAuthors.push(authors[i][j]);
        }



        // 1 array with corresponding Medium/ Journal Types
        if (data[i].medium != "undefined") {
            journalTypes[i] = data[i].medium;
        }
    };


    // remove empty keywords and authors entries

    keywordSorted = false;
    authorsSorted = false;
    for (i = 0; i < theseKeywords.length; i++) {
        if (theseKeywords[i].length == 0) {
            theseKeywords.splice(i, 1)
            i--;
        }
        keywordSorted = true;
    }


    for (i = 0; i < theseAuthors.length; i++) {
        if (theseAuthors[i].length == 0) {
            theseAuthors.splice(i, 1)
            i--;
        }
        authorsSorted = true;
    }

    uniqueTypes = journalTypes.filter(onlyUnique); //finds unique names onlyUnique is a function defined later
    uniqueTypes = uniqueTypes.sort();
    keyTypes = uniqueTypes;
    console.log(uniqueTypes)

    colorScalez = d3.scale.ordinal()
        .domain(uniqueTypes)
        // .range(["#78b4c6", "#67f9e1", "#d0f9f0", "#b2b2f9"]);
        // .range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5"])
        .range([
"#78b4c6", "#67f9e1"
    ,"#8675ee"
    ,"#fcb752"
    ,"#89e2fe"])
var paperLabel = key.selectAll("keylabel")
    .data(uniqueTypes)
    .enter()
    .append("text").attr("class", "newlabel")
    .attr("x", 34)
    .attr("y", function(d,i){
        return startingYLabel - 18*i;
    })
    .attr("fill", function(d){
        return colorScalez(d);
    })
    .text(function(d){
        return d;
    })
var circLabel = key.selectAll("keylabel")
    .data(uniqueTypes)
    .enter()
    .append("circle").attr("class", "newlabel")
    .attr("cx", 24)
    .attr("cy", function(d,i){
        return startingYLabel - (18*i) -5;
    })
    .attr("fill", function(d){
        return colorScalez(d);
    })
    .attr("r",radius/2)

uniqueKeywords = theseKeywords.filter(onlyUnique); //finds unique keywords
uniqueAuthors = theseAuthors.filter(onlyUnique); //finds unique keywords

    console.log(filterNum)
    //creates a new array with the sums of all the different Keywords and also creates list of focus Keywords
    if (keywordSorted == true) {
        console.log("keywordSorted")
        for (i = 0; i < theseKeywords.length; i++) {
            totalKeywords[i] = keyConsolidation(theseKeywords[i])
            totalKeysDone = true;
        }
        if(totalKeysDone==true){
            console.log(totalKeywords)
            mostKeyed = d3.max(totalKeywords);

        }
        if(totalKeywords.length==theseKeywords.length && mostKeyed>0){
            for (i = 0; i < theseKeywords.length; i++) {
                if (totalKeywords[i] > mostKeyed * filterNum) {
                    focusKeywords.push(theseKeywords[i]);
                    console.log(theseKeywords[i])
                } else {
                    console.log("nope")
                }
            }
        }
        
        }
    

    uniqueMostKeyed = focusKeywords.filter(onlyUnique); //finds unique keywords from focused
    keyTypes = keyTypes.sort(); // alphabetical order

    createNodes();


    /** Functions **/

    //some magic function to return uniquevalues
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    //return number of times a keyword was used
    function keyConsolidation(givenKey, i) {
        var total = 0;
        for (i = 0; i < theseKeywords.length; i++) {
            if (theseKeywords[i] == givenKey) {
                total++;
            }
        }
        return total;
    }

    //return number of times an author name was cited
    function authorConsolidation(givenAuthor, i) {
        var total = 0;
        for (i = 0; i < theseAuthors.length; i++) {
            if (theseAuthors[i] == givenAuthor) {
                total++;
            }
        }
        return total;
    }

    //return number of times an year was cited
    function valueConsolidation(givenYear, i) {
        var total = 0;
        for (i = 0; i < data.length; i++) {
            if (data[i].year != "undefined" && data[i].year == givenYear) {
                total++;
            }
        }
        return total;
    }

    //return title of the journal entry
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }


    // }) //end of d3.csv...

} //end of function loadData()



function createNodes() {
    links = [];
    if (itsDone == false) {

        for (i = 0; i < thisData.length; i++) {
            for (j = 0; j < uniqueMostKeyed.length; j++) {
                if (keywords[i].indexOf(uniqueMostKeyed[j]) != -1) {
                    links.push({
                        "source": keywords[i],
                        "target": uniqueMostKeyed[j],
                        "title": thisData[i].title,
                        "author": thisData[i].author,
                        "medium": thisData[i].medium,
                        "url":thisData[i].url
                    })
                }
            }
        }
        simpleNodes();
    }

}


var valColor = d3.scale.ordinal()
    .domain(["low", "mid", "high"])
    .range(["#66ccff", "#009933", "#ff5050"])
var greyColor = "#808080";

function simpleNodes() {

    var thisMap;
    var thisWeight = [];
    var maxWeight;

    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
        link.source = nodes[link.source] || (nodes[link.source] = {
            name: link.source,
            headline: link.title,
            authors: link.author,
            medium: link.medium,
            url: link.url
        });
        link.target = nodes[link.target] || (nodes[link.target] = {
            name: link.target
        });
    });
    // links.forEach(function(link) {
    //     console.log(link);


    //     link.source = (nodes[link.source] = {
    //         name: link.source,
    //         medium: link.medium,
    //         headline: link.title,
    //         author: link.author
    //     });


    //     link.target =  (nodes[link.target] = {
    //         name: link.target,
    //         medium: link.medium,
    //         headline: link.title,
    //         author: link.author
    //     });
    // });

    force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([w, h-100])
        // .linkDistance(80)
        .charge(-200)
        .on("tick", tick)
        .start();

    drag = force.drag()
        .on("dragstart", dragstart);

    path = vis.selectAll("path")
        .data(force.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("stroke", function(d, i) {
            // console.log(d.medium)
            return colorScalez(d.medium);
        })
        .attr("fill", function(d, i) {
            // console.log(d.medium)
            return colorScalez(d.medium);
        })
        .attr("stroke-opacity",1)
        .attr("opacity",.3)
        .attr("stroke-width",.3)
        .on("mouseover", function(d){
            // console.log(d);
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
            if (howLong[i][0].length == 1) {
                thisCount +=1;
                return "white";
            }
            return colorScalez(d.medium)
        })
        .attr("stroke", function(d, i) {
            if (howLong[i][0].length == 1) {
                return "white";
            }
            return "none";
        })
        .attr("opacity", function(d, i) {
            if (howLong[i][0].length == 1) {
                return .2;
            }
            return .8;
        })
        .on("click", function(d,i){
            console.log(d.url);
            if (howLong[i][0].length==1){
                //do nothing
                console.log("nada")
            }else{
                var thisLink = d.url;
                var win = window.open(thisLink, '_blank');
            }
        })
        .on("dblclick", dblclick)
        .call(drag);

    circle
        .transition()
        .duration(2000)
        .attr("r", function(d, i) {
            // console.log(d)
            if (howLong[i][0].length == 1) {
                return rMap(d.weight);
            }
            return radius;
        })
    circle.on("mouseover",function(d){ 
         var b = d.name; 
            for(i=0; i<b.length; i++){ 
            for(j=0; j<path[0].length; j++){ if(b[i] == path[0][j].__data__.target.name){ 
                // console.log(b[i] + " " + path[0][j].__data__.target.name); 
                d3.select(path[0][j]).transition().attr("stroke-width",3) 
            } } } 
        })
    circle.on("mouseout",function(d){ 
        var b = d.name; for(i=0; i<b.length; i++){ for(j=0; j<path[0].length; j++){ if(b[i] == path[0][j].__data__.target.name){ 
            // console.log(b[i] + " " + path[0][j].__data__.target.name); 
            d3.select(path[0][j]).transition().attr("stroke-width",.3) } } } })


    function dblclick(d) {
        d3.select(this).classed("fixed", d.fixed = false);
    }

    function dragstart(d) {
        d3.select(this).classed("fixed", d.fixed = true);
    }



    text = vis.selectAll("labels")
        .data(force.nodes())
        .enter().append("text")
        .attr("class", "labels")
        .attr("x", ".5em")
        .attr("y", ".31em")
        .attr("text-anchor", "start")
        .attr("fill","white")
        .text(function(d, i) {
            if (howLong.length > 1) { //only major keywords
                // console.log(d.name);
                if (d.medium=="author") {
                    return d.title;
                }                
                if (howLong[i][0].length == 1) {
                    return d.name;
                }
            }
        });

    $(".labels").show();
    $('circle').tipsy({
        gravity: 'w',
        html: true,
        delayIn: 500,
        title: function() {

            var d = this.__data__;
            console.log(d);
            if (d.name[0].length == 1) {
                return "Keyword: " + d.name;
            } else {
                return "Title:" + '<br>' + d.headline + '<br>' + '<br>' + "Keywords:" + '<br>' + d.name;
            }
        }
    });
    $('#clickZoom').fadeIn();

    var c = false;
    $('#citeRate').slideDown();
    d3.select("#citeRate").classed("selected", true);
}

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



var zoomInOut = function(t, s) {
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

function resetZoom() {
    console.log("reset viz")
    vis.attr("transform",
        "translate(" + 0 + "," + 0 + ")" +
        " scale(" + initialZoom + ")");

    showReset = false;
    $('#reset').slideUp("slow");
};