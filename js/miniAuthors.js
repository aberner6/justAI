//global variables
//"var" could also be "let" - can be redefined locally
var keywords = [];
var keywordSorted;
var mostKeyedDone;
var totalKeywords = [];
var theseKeywords = [];
var focusKeywords = [];
var uniqueKeywords;
var mostKeyed;
var uniqueMostKeyed;
var uniqueTotalsKeyed;

var journalTypes = [];
var uniqueTypes;

var colorScalez;
var thisCount = 0;

var links = [];
var moreLinks = [];
var itsDone=false;
var filterNum = .1;
var nodes = {};
var svg;
var vis;
var circle;
var path;

var howLong = [];
var rMap;
var radius = 5;
var simulation;
var margin;
var drag;

var dataset;
async function drawData() {
/*step 1: get the data and see one piece of it*/	
	dataset = await d3.csv("./data/justiceKeyword.csv");
	const accessOnePiece = dataset[0];
	// console.log(dataset);

/*step 2: basic dimensions, setting up canvas*/  
    var margin = radius*5;  

    var width = window.outerWidth;
    var height = window.innerHeight-margin;

    svg = d3.select("#wrapper")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    vis = svg
        .append('svg:g')
        .attr("transform","translate("+ 0 + "," + 0 + ")");  

/*step 3: data processing, parsing, counting, creating relationships among the data pieces*/    
/*probably don't need these*/
    keywords.length = 0;  
    theseKeywords.length = 0;
    totalKeywords.length = 0;
    focusKeywords.length = 0;
/*probably don't need these above*/


/*grab each name from the name column and split it based on the comma which denotes the last name
*/    
    for (i = 0;i<dataset.length; i++){ //this is a for loop and goes through the whole dataset
        //if keywords exist add to array
        if (dataset[i].author!="undefined"){
            keywords[i] = dataset[i].author.split("; ");
        }
        // 1 array with all the keywords
/*try cleaning this up*/
        for (j=0; j<keywords[i].length; j++){
            theseKeywords.push(keywords[i][j]);
        }
        if (dataset[i].journal != "undefined" && dataset[i].journal.length != 0) {
            journalTypes[i] = dataset[i].journal.toLowerCase();
        }
    };


    // //COLOR AND JOURNALS
    uniqueTypes = journalTypes.filter(onlyUnique); //finds unique names onlyUnique is a function defined later
    // // uniqueTypes = uniqueTypes.sort();
    colorScalez = d3.scaleOrdinal()
        .domain(uniqueTypes)
        .range(["#007dd2",
"#bc2c00",
"#7157df",
"#00b44c",
"#d40495",
"#00bb8c",
"#ff85af",
"#3e6e00",
"#eab1ff",
"#bb7600",
"#833570",
"#f7bc5a",
"#007357",
"#ff876f",
"#91341c"])

    keywordSorted = false;
    mostKeyedDone = false;
    for (i=0; i<theseKeywords.length; i++){
        if(theseKeywords[i].length==0){
          theseKeywords.splice(i,1)
          i--;
        }
        // console.log(keywordSorted)
        keywordSorted = true;
    }
    uniqueKeywords = theseKeywords.filter(onlyUnique); //find unique keywords

    //create a new array with the sums of all the different Keywords and also creates list of focus Keywords
    if(keywordSorted==true){
        for (i = 0; i<theseKeywords.length; i++){
            totalKeywords[i]= keyConsolidation(theseKeywords[i])
            mostKeyed = d3.max(totalKeywords);
            mostKeyedDone = true;
        }
    }
    if(mostKeyedDone==true){

        rMap = d3.scaleLinear()
            .domain([0, mostKeyed])
            .range([radius, radius * 5]);

        for (i = 0; i<theseKeywords.length; i++){
            // console.log(totalKeywords[i]+theseKeywords[i]); 
            if(totalKeywords[i]>=mostKeyed*filterNum){ //if you have been mentioned more than once
                focusKeywords.push(theseKeywords[i]);
            }
        } 
    }
    uniqueMostKeyed = focusKeywords.filter( onlyUnique ); //filter for duplicates

    //magic function to return only unique values
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    //return number of times a keyword was used
    function keyConsolidation(givenKey,i) {
        var total = 0;
        for (i = 0;i<theseKeywords.length; i++){
            if(theseKeywords[i] == givenKey){
                total++;
            }
        }
         return total;
    }

    createLinks();
	function createLinks(){
	    links = [];
	    if(itsDone==false){ //probably delete this check
	        for (i=0; i<dataset.length; i++){ //for the whole dataset
	            for (j=0; j<uniqueMostKeyed.length; j++){ //and the unique keywords
	                if (keywords[i].indexOf(uniqueMostKeyed[j])!=-1){ //if a keyword in the dataset is the same as one of the unique keywords
                        for (k=0; k<theseKeywords.length; k++){
                            if (theseKeywords[k].indexOf(uniqueMostKeyed[j])!=-1){  
                                // if(keywords[i].length==1){
                                //     console.log(keywords[i][0]+" "+totalKeywords[k])
                                //     links.push({"source":keywords[i][0],"target":uniqueMostKeyed[j],"title":dataset[i].title, "weight":totalKeywords[k], "journal":dataset[i].journal})  
                                // }
                                if(keywords[i].length>1){
                                    links.push({"source":keywords[i],"target":uniqueMostKeyed[j],"title":dataset[i].title, "weight":totalKeywords[k], "journal":dataset[i].journal})  
                                }
                            }
                        }
	                }
	            }
	        }

	        makeLinks();
	    }
	}


    function makeLinks(){
        // console.log(links);
        links.forEach(function(link) {
          // link.source = (nodes[link.source] = {name: link.source, title:link.title, journal:link.journal});
          // link.target = (nodes[link.target] = {name: link.target, weight:link.weight, journal:link.journal});

          link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, title:link.title, journal:link.journal});
          link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, weight:link.weight, journal:link.journal});
        });
        makeNodes();
    }
    function makeNodes(){
        var thisWeight = [];
        var maxWeight;

        simulation = d3.forceSimulation()
            .nodes(d3.values(nodes))
            .force("link", d3.forceLink(links))
    .force("charge", d3.forceManyBody())
    // .force("center", d3.forceCenter(width / 2, height / 2))
            // .force("charge", d3.forceManyBody().strength(-10))
            // .force("collide", d3.forceCollide().radius(radius))
            // .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", ticked)    
        // restart();


        path = vis.selectAll("path")
            .data(links)
            .enter().append("path")
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-width",.2)

        circle = vis.selectAll("node")
            .data(simulation.nodes())
            .enter().append("circle")
            .attr("class", function(d){
                howLong.push(d.name);
                if(d.name[0].length==1){
                    return d.name;
                }  
            });
        circle
            .attr("r", function(d,i){
                if(howLong[i][0].length==1){
                    return rMap(d.weight);
                }
                if(howLong[i].length==1){
                    return radius; //SHOULD BE WITH WEIGHT
                }
                if(howLong[i][0].length>1){
                  return radius;  
                }
                    // return radius;
            })
            .attr("fill", function(d,i){
                if(howLong.length>0){
                    if(howLong[i][0].length==1){
                        thisCount += 1;
                        return "white";
                    }                       
                    if(howLong[i].length>1){ //&&howLong[i][0].length>1
                        return colorScalez(d.journal)
                    } 
                }
            })
            .attr("opacity", .8)
            .attr("stroke", function(d,i){
                if(howLong.length>0){    
                    if (howLong[i][0].length == 1) {
                        return "grey";
                    }else{
                        return "none";  
                    }
                }
            })
            .attr("stroke-width",1)
            .on("mouseover", function(d,i) {
                //get this circle's x/y values, then augment for the tooltip
                var xPosition = d3.select(this).node().transform.baseVal[0].matrix.e + radius/2;
                var yPosition = d3.select(this).node().transform.baseVal[0].matrix.f + radius/2;;

                d3.select("#tooltip")
                    .style("left", xPosition + "px")
                    .style("top", yPosition + "px")                     
                    .select("#value")
                    .text(function(){
                        if(howLong[i][0].length>1){
                            return d.title+" "+d.journal;
                        }
                        if(howLong[i][0].length==1){
                            return d.name+d.weight;
                        }
                    });
                //show the tooltip
                d3.select("#tooltip").classed("hidden", false);
            })
            .on("mouseout", function() {
                //hide the tooltip
                d3.select("#tooltip").classed("hidden", true); 
            })      
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
    .on('dblclick',releasenode)

        function dblclick(d) {
            d3.select(this).classed("fixed", d.fixed = false);
        }
        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        } 
     
        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          //d.fx = null;
          //d.fy = null;
        }

        function releasenode(d) {
            d.fx = null;
            d.fy = null;
        }
        // function dragstart(d) {
        //     d3.select(this).classed("fixed", d.fixed = true);
        // }

        function ticked() {
          path.attr("d", linkArc);
          circle.attr("transform", transform)
        }

        var blah = 0;
        var angle = 0; 

        function transform(d) {
            var thisOne = d;
            //NEED TO GET RADIUSES ACCORDING TO MAPPED RADIUS
            if (thisOne.name[0].length == 1) {
                // console.log(thisOne);
                blah++;
                angle = (blah / (thisCount/2)) * Math.PI; // Calculate the angle at which the element will be placed.
                d.x = (280 * Math.cos(angle)) + (width/2); // Calculate the x position of the element.
                d.y = (240 * Math.sin(angle)) + (width/3.5);
                return "translate(" + d.x + "," + d.y + ")";    
                
            }
            else{
                d.x = Math.max(radius, Math.min(width - radius, d.x));
                d.y = Math.max(radius, Math.min(height - radius, d.y));
                return "translate(" + d.x + "," + d.y + ")";            
            }
        }
        function linkArc(d) {
          var dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y,
              dr = Math.sqrt(dx * dx + dy * dy);
          return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        }
    }
}
drawData();


