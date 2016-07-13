var d3 = require('d3');
var Sankey = require('./lib/d3.chart.sankey');

// sankey graph ----------------------------------------------------------------

var colors = {

      'entirehome/apt': '#6C85A5',
      'privateroom': '#D13D59',
      'sharedroom': '#D04B61',

      'marina': '#889C6B',
      'richmonddistrict': '#9FA7B3',
      'downtown': '#A89170',
      'innersunset': '#61988E',
      'soma': '#6E7B8E',
      'westernaddition/nopa': '#80A9D0',
      'hayesvalley': '#FFE599',
      'pacificheights': '#FFCC32',
      'thecastro': '#99B4CF',
      'haight-ashbury': '#99B4CF',
      'potrerohill': '#E89EAC',
      'missiondistrict': '#996B7D',
      'bernalheights': '#E59FA6',
      'noevalley': '#61988E',
      'nobhill': '#846A6A',

      '>$1000': '#EB8F6A',
      '$500-$999': '#6F7D8C',
      '$400-$499': '#DE8067',
      '$300-$399': '#667A96',
      '$200-$299': '#FFE599',
      '$100-$199': '#9C8B9E',
      '<$100': '#D04B61',
      //
      // 'veryhigh': '#996B7D',
      // 'high': '#DE8067',
      // 'mid': '#493843',
      // 'low': '#80A9D0',
      //
      // '$100-150k': '#DE8067',
      // '>$150k': '#FFE599',

      'fallback': '#D13D59'

    };

//set up graph in same style as original example but empty
var graph = {"nodes" : [], "links" : []};

AirbnbData.forEach(function (d) {
  graph.nodes.push({ "name": d.neighborhood });
  graph.nodes.push({ "name": d.room_type });
  graph.nodes.push({ "name": d.count_bin });
  graph.nodes.push({ "name": d.price_range});

  graph.links.push({ "source": d.room_type,
                     "target": d.neighborhood,
                     "value": +1 });
  graph.links.push({ "source": d.neighborhood,
                      "target": d.price_range,
                      "value": +1 });
  graph.links.push({ "source": d.price_range,
                      "target": d.count_bin,
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

 console.log(graph);

var chart = d3.select("#sankeygraph").append("svg").chart("Sankey.Path");
chart
  .name(label)
  .colorNodes(function(name, node) {
    // console.log(color(node,1));
    return color(node, 1) || colors.fallback;
  })
  .colorLinks(function(link) {
    return color(link.source, 4) || color(link.target, 1) || colors.fallback;
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
