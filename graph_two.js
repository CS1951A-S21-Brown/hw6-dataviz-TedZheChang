let svg2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_1_width) 
    .attr("height", graph_1_height)    
    .append("g")
    .attr("transform", `translate(${margin.left + 50},${margin.top})`); 

let countRef2 = svg2.append("g");

let y_axis_label_2 = svg2.append("g");

let x_2 = d3.scaleLinear()
            .range([0, width - margin.left - margin.right])

let y_2 = d3.scaleBand()
    .range([0, height - margin.top - margin.bottom])
    .padding(0.1);  

svg2.append("text")
    .attr("transform", `translate(${217.5}, ${185})`)       
    .style("text-anchor", "middle")
    .style("font-size", 10)
    .text("Number of sales (millions)");
    
svg2.append("text")
    .attr("transform", `translate(${-100}, ${85})`)       
    .style("text-anchor", "middle")
    .style("font-size", 10)
    .text("Genre");
    
svg2.append("text")
    .attr("transform", `translate(${217.5}, ${-20})`)       
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .text("Distribution of Game Sales by Genre");

function renderGraph2(country){
    d3.csv("../data/video_games.csv").then(function(d) {
        
        let data = getGenreCount(d, country)

        x_2.domain([0, Math.max.apply(Math,data.map(d => parseFloat(d.Count)))])
        y.domain(data.map(d => d.Genre))

        y_axis_label_2
            .call(d3.axisLeft(y).tickSize(0).tickPadding(10))
            .call(g => g.select(".domain").remove())

        let bars = svg2.selectAll("rect").data(data);

        let color = d3.scaleOrdinal()
            .domain(data.map(function(d) { return d["Genre"] }))
            .range(getColors(12));

        bars.enter()
                .append("rect")
                .merge(bars)
                .transition()
                .attr("fill", function(d) { return color(d['Genre']) }) 
                .attr("x", x_2(0))
                .attr("y", function(d){return y(d.Genre)})               
                .attr("width",  function(d){return x_2(d.Count)})
                .attr("height",  y.bandwidth());   

        let counts = countRef2.selectAll("text").data(data);

        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .attr("x", d => x_2(d.Count) + 7)       
            .attr("y", d => y(d.Genre) + 10)
            .style("font-size", 8)       
            .style("text-anchor", "start")
            .text(d => d.Count.toFixed(2));

        bars.exit().remove();
        counts.exit().remove();
    });
}


function getGenreCount(data, country){
    let country_tag = `${country}_Sales`
    let genres = new Map()
    for(let i = 0; i < data.length; i++){
        d = data[i]
        if(genres.has(d.Genre)){
            genres.set(d.Genre, genres.get(d.Genre) + parseFloat(d[country_tag]))
        } 
        else {
            genres.set(d.Genre, parseFloat(d[country_tag]))
        }
    }
    let new_data = Array.from(genres, ([Genre,Count]) => ({Genre, Count}))
    new_data = new_data.sort((a,b) => b.Genre - a.Genre)
    return new_data
}

renderGraph2("Global")

