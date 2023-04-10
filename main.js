
let width = 1000, height = 600;

let svg = d3.select("svg")
    .attr("viewBox", "0 0 " + width + " " + height)

// Load external data and boot
Promise.all([d3.json("https://raw.githubusercontent.com/ysbllh/HASS-assignment4/main/sgmap.json"), d3.csv("https://raw.githubusercontent.com/ysbllh/HASS-assignment4/main/population2022v2.csv")]).then(data => {

let mapData = data[0].features;
let popData = data[1];
let min = 0;
let max = 23000;


// Merge pop data with map data
mapData.forEach(d => {  
  let subzone = popData.find(e => e.Subzone.toUpperCase() == d.properties['Subzone Name']);
  d.popdata = (subzone != undefined) ? parseInt(subzone.Population) : 0;
  
})


console.log(mapData);

// Map and projection
let projection = d3.geoMercator()
    .center([103.851959, 1.290270])
    .fitExtent([[20, 20], [980, 580]], data[0]);

let geopath = d3.geoPath().projection(projection);

var colorScale = d3.scaleLinear()
    .domain([min, max])
    .range([0.1,1]);

svg.append("g")
    .attr("id", "districts")
    .selectAll("path")
    .data(mapData)
    .enter()
    .append("path")
    .attr("d", geopath)
    .attr("stroke", "purple")
    .attr("stroke-width", 0.7)
    .attr("fill", d=> {
        if (d.popdata === 0) {
            return "#ccc";
        } else {
            return d3.interpolateYlGnBu(colorScale(d.popdata))
        }
    })
    //.attr("fill", d => d3.interpolateYlGnBu(colorScale(d.popdata)))
    .on("mouseover", (event, d) => {
        d3.select(".tooltip")
        .text(`Subzone: ${d.properties["Subzone Name"]}, Senior Citizen Population: ${parseInt(d.popdata).toLocaleString('en-US')}`)
        .style("position", "absolute")
        .style("background", "aliceblue")
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY) + "px")
        d3.select(event.currentTarget)       
        .style("stroke", "purple")
        .attr("stroke-width",2)
        .attr("fill-opacity","1.0")
      })
    .on("mouseout", (event, d) => {
        d3.select(event.currentTarget)
        .style("stroke", "")
        .attr("stroke-width",1)
        .attr("fill-opacity","1")
        d3.select(".tooltip")
        .text("")
      })    

})
