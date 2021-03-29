let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width) 
    .attr("height", graph_1_height)    
    .append("g")
    .attr("transform", `translate(${margin.left + 50},${margin.top})`); 

let countRef = svg.append("g");

let y_axis_label = svg.append("g");

let x = d3.scaleLinear()
            .range([0, width - margin.left - margin.right]);

let y = d3.scaleBand()
    .range([0, height - margin.top - margin.bottom])
    .padding(0.1);  

svg.append("text")
    .attr("transform", `translate(${217.5}, ${185})`)       
    .style("text-anchor", "middle")
    .style("font-size", 10)
    .text("Global Sales (millions)");
    
svg.append("text")
    .attr("transform", `translate(${-195}, ${85})`)       
    .style("text-anchor", "middle")
    .style("font-size", 10)
    .text("Game");
    
svg.append("text")
    .attr("transform", `translate(${217.5}, ${-20})`)       
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .text("Highest Sale Games Globally");

function renderGraph1(startYear, endYear){
    d3.csv("../data/video_games.csv").then(function(d) {
        
        let data = getVideoGameRankings(d, startYear, endYear)

        x.domain([0, Math.max(.0000001, data[0].Global_Sales)])
        y.domain(data.map(x => x.Name))

        y_axis_label
            .call(d3.axisLeft(y).tickSize(0).tickPadding(10))
            .call(g => g.select(".domain").remove())

        let bars = svg.selectAll("rect").data(data);

        let color = d3.scaleOrdinal()
            .domain(data.map(function(d) { return d["Genre"] }))
            .range(getColors(10));

        bars.enter()
                .append("rect")
                .merge(bars)
                .transition()
                .attr("fill", function(d) { return color(d['Name']) }) 
                .attr("x", x(0))
                .attr("y", function(d){return y(d.Name)})               
                .attr("width",  function(d){return x(d.Global_Sales)})
                .attr("height",  y.bandwidth());   

        let counts = countRef.selectAll("text").data(data);

        counts.enter()
            .append("text")
            .merge(counts)
            .transition()
            .attr("x", d => x(d.Global_Sales) + 10)       
            .attr("y", d => y(d.Name) + 13)
            .style("font-size", 10)       
            .style("text-anchor", "start")
            .text( d => d.Global_Sales);
        
    });
}


function getVideoGameRankings(data, startYear, endYear){
    const f = d => (parseInt(d.Year) >= startYear && parseInt(d.Year) <= endYear)
    const c = (a,b) => parseInt(b.Global_Sales) - parseInt(a.Global_Sales)
    return cleanData(data, f, c, 10)
}

function cleanData(data, filterer, comparator, numResults){
    named_data = data.map(d => {
        d.Name = `${d.Name}(${d.Platform})`
    })
    let filtered_data = data.filter(filterer).sort(comparator)

    if(filtered_data.length < numResults) {
        let num_added = 0
        while(filtered_data.length < numResults){
            let a = ""
            for(let i = 0; i < num_added; i++){
                a += " "
            }
            filtered_data.push({Name: a, Global_Sales: ""})
            num_added++
        }
    }
    return filtered_data.slice(0,numResults)
}
