var d3 = require('d3');
var Sankey = require('./lib/d3.chart.sankey');

// sankey graph ----------------------------------------------------------------

var colors = {

      'richmonddistrict': '#6C85A5',
      'downtown': '#D13D59',
      'innersunset': '#D04B61',
      'nobhill': '#889C6B',
      'marina': '#61988E',
      'soma': '#6E7B8E',
      'hayesvalley': '#80A9D0',

      'privateroom': '#996B7D',
      'entirehome/apt': '#A89170',


      '<$50k': '#493843',
      '$50-100k': '#80A9D0',
      '$100-150k': '#DE8067',
      '>$150k': '#FFE599',

      'test1': 'red',
      'test2': 'blue',
      'test3': 'green',

      'fallback': '#D13D59'

    };

//set up graph in same style as original example but empty
var graph = {"nodes" : [], "links" : []};

AirbnbData.forEach(function (d) {
  graph.nodes.push({ "name": d.neighborhood });
  graph.nodes.push({ "name": d.room_type });
  graph.nodes.push({ "name": d.count_bin });
  graph.nodes.push({ "name": d.price_range});

  graph.links.push({ "source": d.neighborhood,
                     "target": d.room_type,
                     "value": +1 });
  graph.links.push({ "source": d.room_type,
                      "target": d.count_bin,
                      "value": +1 });
  graph.links.push({ "source": d.count_bin,
                      "target": d.price_range,
                      "value":+1 });
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
    return color(link.source, 1) || colors.fallback;//|| color(link.target, 1)
  })
  .nodeWidth(20)
  .nodePadding(5)
  .spread(true)
  .iterations(0)
  .draw(graph);

function label(node) {
  // if (node.name == "San Francisco") {
  //   return node.name + " (11K)";
  // } else if (node.name == "Santa Clara") {
  //   return node.name + " (46K)"
  // } else if (node.name == "San Mateo") {
  //   return node.name + " (6K)"
  // } else {
    return node.name;
  // }
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
