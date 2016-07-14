var d3 = require('d3');
var Sankey = require('./lib/d3.chart.sankey');

// sankey graph ----------------------------------------------------------------

var colors = {

      'entirehome/apt': '#6C85A5',
      'privateroom': '#D13D59',
      'sharedroom': '#FFE599',

      'marina': '#889C6B',
      'richmonddistrict': '#9FA7B3',
      'downtown': '#A89170',
      'innersunset': '#61988E',
      'soma': '#6E7B8E',
      'outersunset': '#80A9D0',
      'westernaddition/nopa': '#996B7D',
      'hayesvalley': '#FFE599',
      'pacificheights': '#FFCC32',
      'thecastro': '#99B4CF',
      'haight-ashbury': '#99B4CF',
      'potrerohill': '#E89EAC',
      'missiondistrict': '#D04B61',
      'bernalheights': '#E59FA6',
      'noevalley': '#61988E',
      'nobhill': '#846A6A',

      '>$500': '#6F7D8C',
      // '$500-$999': '#EB8F6A',
      '$401-$500': '#DE8067',
      '$301-$400': '#667A96',
      '$201-$300': '#FFE599',
      '$101-$200': '#9C8B9E',
      '$100andless': '#80A9D0',
      //
      'over100': '#996B7D',
      'upto100': '#DE8067',
      'upto10': '#D13D59',//#493843',
      'singlereview': '#6E7B8E',//'#80A9D0',
      //
      // '$100-150k': '#DE8067',

      //#D04B61

      'fallback': 'red'

    };

//set up graph in same style as original example but empty
var graph = {"nodes" : [], "links" : []};

AirbnbData.forEach(function (d) {
  // console.log(d);
  graph.nodes.push({ "name": d.neighborhood });
  // graph.nodes.push({ "name": d.room_type });
  graph.nodes.push({ "name": String(d.review_bin) });
  graph.nodes.push({ "name": d.price_bin});
  // if (d.neighborhood == null) {
  //   console.log("problem with neighborhood");
  // }
  // if (d.review_bin == null) {
  //   console.log("problem with review bin");
  // }
  // if (d.price_bin == null) {
  //   console.log("problem with price bin");
  // }
  // if (d.count == null) {
  //   console.log("problem with count");
  // }

  graph.links.push({ "source": d.price_bin,
                      "target": d.neighborhood,
                      "value": +d.count });
  graph.links.push({ "source": d.neighborhood,
                      "target": d.review_bin,
                      "value":+d.count });
 });

 // return only the distinct / unique nodes
 graph.nodes = d3.keys(d3.nest()
   .key(function (d) { return d.name; })
   .map(graph.nodes));

 // loop through each link replacing the text with its index from node
 graph.links.forEach(function (d, i) {
   graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
   graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
 });

 //now loop through each nodes to make nodes an array of objects
 // rather than an array of strings
 graph.nodes.forEach(function (d, i) {
   graph.nodes[i] = { "name": d };
 });

var chart = d3.select("#sankeygraph").append("svg").chart("Sankey.Path");
chart
  .name(label)
  .colorNodes(function(name, node) {
    // console.log(color(node,1));
    return color(node, 1) || colors.fallback;
  })
  .colorLinks(function(link) {
    if (link.source.name.indexOf("$") > -1) {
      return color(link.target, 1) || color(link.source, 4) || colors.fallback;
    } else {
      return color(link.source, 4) || color(link.target, 1) || colors.fallback;
    }
  })
  .nodeWidth(20)
  .nodePadding(5)
  .spread(true)
  .iterations(0)
  .draw(graph);

function label(node) {
  if (node.name == "very high") {
    return node.name + " (>300)";
  } else if (node.name == "high") {
    return node.name + " (201-300)"
  } else if (node.name == "mid") {
    return node.name + " (100-200)"
  } else if (node.name == "low") {
    return node.name + " (<100)"
  } else {
    return node.name;
  }
}

function color(node, depth) {
  var id = node.name.toLowerCase().split(" ").join("");
  if (colors[id]) {
    return colors[id];
  } else if (depth > 0 && node.targetLinks && node.targetLinks.length == 1) {
    return color(node.targetLinks[0].source, depth-1);
  } else {
    return null;
  }
}
