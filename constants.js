// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 200};

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
const graph_1_width = 710, graph_1_height = 250;
const  graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
const graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

const width = graph_1_width
const height = graph_1_height

const getColors = function(numExamples) {
    return d3.quantize(d3.interpolateHcl("#6A0DAD", "#3e64ff"), numExamples)
}