let svg_width = 650
let svg_height = 650
let margin_new =200

var radius = (Math.min(svg_width, svg_height) / 2) - margin_new

function renderGraph3(genre){
    d3.csv("../data/video_games.csv").then(function(d) {
        clearSvg()
        let svg3 = d3.select("#graph3")
            .append("svg")
            .attr("class","pieElement")
            .attr("width", svg_width)
            .attr("height", svg_height)
            .append("g")
            .attr("transform", "translate(" + (svg_width) / 2 + "," + (svg_height) / 2 + ")");
        
        svg3.append("text")
            .attr("transform", `translate(${0}, ${-200})`)       
            .style("text-anchor", "middle")
            .style("font-size", 15)
            .text(`Distribution Sales for top 5 Publishers for ${genre} Games`);

        let tooltip = d3.select('#graph3')
            .append('span')                                             
            .attr('class', 'pieElement')
            .attr('id', 'tooltip')
            .attr("tranform", `translate(600,600)`)
          
        tooltip.append('div')                                           
            .attr('class', 'label');                                      
               
        tooltip.append('div')                                           
            .attr('class', 'count');                                      
  
        tooltip.append('div')                                           
            .attr('class', 'percent');                                   
  

        let data = getPublisherData(d, genre, 6)
    
        var color = d3.scaleOrdinal()
            .domain(data)
            .range(getColors(6));

        var pie = d3.pie()
            .sort(null)
            .value(d => {
                return d.value
            })
        
        let arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)
        
        var data_ready = pie(d3.entries(data))
        
        let outerArc = d3.arc()
            .innerRadius(radius * 1.1)
            .outerRadius(radius * 1.1)
    
        let slices = svg3
            .selectAll('allSlices')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d){ return(color(d.data.key)) })
            .attr("stroke", "white")
            .on('mouseover', function(d) {      
                var total = Object.values(data).reduce((a, b) => a + b);    
                var percent = Math.round(1000 * d.data.value / total) / 10;
                tooltip.select('.label').html(d.data.key);                
                tooltip.select('.count').html(d.data.value.toFixed(2));               
                tooltip.select('.percent').html(percent + '%');            
                tooltip.style('display', 'block');
            })
            .on('mouseout', function() {                            
                tooltip.style('display', 'none');                      
            })
            .style("stroke-width", "2px")
            .style("opacity", 1)

        let lines = svg3
            .selectAll('allPolylines')
            .data(data_ready)
            .enter()
            .append('polyline')
              .attr("stroke", "black")
              .style("fill", "none")
              .attr("stroke-width", 1)
              .attr('points', function(d) {
                var posA = arc.centroid(d) 
                var posB = outerArc.centroid(d) 
                var posC = outerArc.centroid(d); 
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 
                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
                return [posA, posB, posC]
              })

        let labels = svg3
            .selectAll('allLabels')
            .data(data_ready)
            .enter()
            .append('text')
            .text( function(d) {return d.data.key } )
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
    });
}

function getPublisherData(data, genre, num_examples){
    if(genre !== "All"){
        data = data.filter(d => d.Genre === genre)
    }
    let companies = new Map()
    for(let i = 0; i < data.length; i++){
        d = data[i]
        if(companies.has(d.Publisher)){
            companies.set(d.Publisher, companies.get(d.Publisher) + parseFloat(d.Global_Sales))
        } 
        else {
            companies.set(d.Publisher, parseFloat(d.Global_Sales))
        }
    }
    let new_data = Array.from(companies, ([Publisher,Count]) => ({Publisher, Count})).sort((a,b) => b.Count - a.Count)
    let obj = {}
    for(let i =0; i < num_examples; i++){
        obj[new_data[i].Publisher] = new_data[i].Count
    }
    return obj
}

function clearSvg(){
    let old = document.getElementById("graph3").getElementsByClassName("pieElement")
        
    while(old.length > 0){
        old[0].remove()
    }
}

renderGraph3("All")