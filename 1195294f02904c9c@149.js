export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Assignment 4: Tree Explorer`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@6")
)});
  main.variable(observer("trees")).define("trees", ["d3"], function(d3){return(
d3.csv("https://gis-cityofchampaign.opendata.arcgis.com/datasets/979bbeefffea408e8f1cb7a397196c64_22.csv?outSR=%7B%22latestWkid%22%3A3857%2C%22wkid%22%3A102100%7D", d3.autoType)
)});
  main.variable(observer("makeTrees")).define("makeTrees", ["d3","trees"], function(d3,trees){return(
function makeTrees() {
  const width = 450;
  const height = 450;
  const infoPanel = d3.select("#mytreeinfo");
  const svg = d3
  .create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, 20, 20])
  .style("border", "solid 1px black");
  // Note: aspect ratios!
  const xScale = d3.scaleLinear().domain(d3.extent(trees, d => d.X)).range([0.0, 20.0]);
  const yScale = d3.scaleLinear().domain(d3.extent(trees, d => d.Y)).range([20.0, 0.0]);
  svg.append("g")
    .attr("id", "trees")
    .selectAll("circle")
    .data(trees)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.X))
    .attr("cy", d => yScale(d.Y))
    .attr("r", 0.02);
  return {svg: svg, xScale: xScale, yScale: yScale};
}
)});
  main.variable(observer()).define(["makeTrees","Promises"], async function*(makeTrees,Promises)
{
  const {svg, xScale, yScale} = makeTrees();
  yield svg.node();
  await Promises.delay(2000);
  svg.select("g#trees").attr("transform", "rotate(10)").style("fill", "blue");
  await Promises.delay(2000);
  svg.selectAll("circle").attr("transform", "rotate(10)");
  yield svg.node();
}
);
  main.variable(observer()).define(["makeTrees","Promises"], async function*(makeTrees,Promises)
{
  const {svg, xScale, yScale} = makeTrees();
  yield svg.node();
  await Promises.delay(2000);
  svg.selectAll("g#trees").transition().duration(1000).attr("transform", "rotate(10)").style("fill", "blue");
  await Promises.delay(2000);
  svg.selectAll("circle").transition().duration(1000).attr("transform", "rotate(10)");
  yield svg.node();
}
);
  main.variable(observer("treesByCOND")).define("treesByCOND", ["d3","trees"], function(d3,trees){return(
d3.group(trees, d => d.COND)
)});
  main.variable(observer()).define(["makeTrees","d3"], function*(makeTrees,d3)
{
  const {svg, xScale, yScale} = makeTrees();
  yield svg.node();
  const zoom = d3.zoom();
  const trees = svg.select("g#trees");
  function zoomCalled(event) {
        console.log(event.transform);
    const zx = event.transform.rescaleX(xScale);
    const zy = event.transform.rescaleY(yScale);
    trees.attr("transform",event.transform);
    svg.select("g#trees").attr("transform", event.transform);
  }
  svg.call(zoom.on("zoom", zoomCalled));
}
);
  main.variable(observer()).define(["makeTrees","d3","trees"], function*(makeTrees,d3,trees)
{
  const {svg, xScale, yScale} = makeTrees();
  yield svg.node();
  const treeGroup = svg.select("g#trees");
  const text = svg.append("text").attr("x", 15).attr("y", 15);
  const brush = d3.brush().extent([[0, 0], [20, 20]]).handleSize(0.1);
  const dataPoints = [];
  function brushCalled(event) {
    treeGroup.selectAll("circle")
    .data(trees)
    .classed("selected", d => xScale(d.X) > event.selection[0][0]
                && xScale(d.X) < event.selection[1][0]
                && yScale(d.Y) > event.selection[0][1]
                && yScale(d.Y) < event.selection[1][1] );
    dataPoints.length = 0;
    treeGroup.selectAll("circle")
    .data(trees)
    .filter(".selected")
    .each(d => dataPoints.push(d));
    text.text('' + dataPoints.length);
  }
  svg.append("g")
    .attr("class", "mybrush")
    .style("stroke-width", 0.01)
    .call(
      brush.on("brush", brushCalled)
    );
}
);
  main.variable(observer("meter")).define("meter", ["d3"], function(d3){return(
d3.csv("https://opendata.arcgis.com/datasets/63cddb4fcb4842be9b10b9396482bd1d_30.csv", d3.autoType)
)});
  main.variable(observer("makeMeters")).define("makeMeters", ["d3","meter"], function(d3,meter){return(
function makeMeters() {
  const width = 450;
  const height = 450;
  const infoPanel = d3.select("#mymeterinfo");
  const svg = d3
  .create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, 20, 20])
  .style("border", "solid 1px black");
  // Note: aspect ratios!
  const xScale = d3.scaleLinear().domain(d3.extent(meter, d => d.X)).range([0.0, 20.0]);
  const yScale = d3.scaleLinear().domain(d3.extent(meter, d => d.Y)).range([20.0, 0.0]);
  svg.append("g")
    .attr("id", "meters")
    .selectAll("circle")
    .data(meter)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.X))
    .attr("cy", d => yScale(d.Y))
    .attr("r", 0.04);
  return {svg: svg, xScale: xScale, yScale: yScale};
}
)});
  main.variable(observer()).define(["makeMeters","Promises"], async function*(makeMeters,Promises)
{
  const {svg, xScale, yScale} = makeMeters();
  yield svg.node();
  await Promises.delay(2000);
  svg.selectAll("g#meters").transition().duration(1000).attr("transform", "rotate(10)").style("fill", "blue");
  await Promises.delay(2000);
  svg.selectAll("circle").transition().duration(1000).attr("transform", "rotate(10)").style("fill", "blue");
  yield svg.node();
}
);
  main.variable(observer()).define(["makeMeters","d3"], function*(makeMeters,d3)
{
  const {svg, xScale, yScale} = makeMeters();
  yield svg.node();
  const zoom = d3.zoom();
  const trees = svg.select("g#meters");
  function zoomCalled(event) {
        console.log(event.transform);
    const zx = event.transform.rescaleX(xScale);
    const zy = event.transform.rescaleY(yScale);
    trees.attr("transform",event.transform);
    svg.select("g#trees").attr("transform", event.transform);
  }
  svg.call(zoom.on("zoom", zoomCalled));
}
);
  main.variable(observer()).define(["html"], function(html){return(
html`<div id="mymeterinfo"></div>`
)});
  main.variable(observer()).define(["d3","meter"], function*(d3,meter)
{
  const width = 450;
  const height = 450;
  const infoPanel = d3.select("#mymeterinfo");
  const svg = d3
  .create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, 1, 1])
  .style("border", "solid 1px black");
  yield svg.node();
  // Note: aspect ratios!
  const xScale = d3.scaleLinear().domain(d3.extent(meter, d => d.X)).range([0.0, 1.0]);
  const yScale = d3.scaleLinear().domain(d3.extent(meter, d => d.Y)).range([1.0, 0.0]);
  svg.selectAll("circle")
  .data(meter)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.X))
  .attr("cy", d => yScale(d.Y))
  .attr("r", 0.001)
  .style("fill", "blue")
  .on("mouseover", (e, d) => {
    infoPanel.text(`${d.BlockStreet} ${d.RATE}`);
  });
}
);
  main.variable(observer()).define(["makeMeters","d3","meter"], function*(makeMeters,d3,meter)
{
  const {svg, xScale, yScale} = makeMeters();
  yield svg.node();
  const meterGroup = svg.select("g#meters");
  const text = svg.append("text").attr("x", 15).attr("y", 15);
  const brush = d3.brush().extent([[0, 0], [20, 20]]).handleSize(0.1);
  const dataPoints = [];
  function brushCalled(event) {
    meterGroup.selectAll("circle")
    .data(meter)
    .classed("selected", d => xScale(d.X) > event.selection[0][0]
                && xScale(d.X) < event.selection[1][0]
                && yScale(d.Y) > event.selection[0][1]
                && yScale(d.Y) < event.selection[1][1] );
    dataPoints.length = 0;
    meterGroup.selectAll("circle")
    .data(meter)
    .filter(".selected")
    .each(d => dataPoints.push(d));
    text.text('' + dataPoints.length);
  }
  svg.append("g")
    .attr("class", "mybrush")
    .style("stroke-width", 0.01)
    .call(
      brush.on("brush", brushCalled)
    );
}
);
  return main;
}
