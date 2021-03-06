function buildMetadata(sample) {
  // the function that builds the metadata panel
 // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(sample){
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sample).forEach(([key, value]) => {
      d3.select("#sample-metadata")
      .append("p")
      .text(`${key}: ${value}`);
    });
  });
}
function buildCharts(sample) {
  // Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
    // Build Bubble Chart using the sample data
    var x_values = data.otu_ids;
    var y_values = data.sample_values;
    var size_value = data.sample_values;
    var label = data.otu_labels;
    var trace1 = {
      x: x_values,
      y: y_values,
      text: label,
      mode: "markers",
      marker:{
        size: size_value,
        color: x_values,
        colorscale: "Rainbow",
        labels: label,
        type: 'scatter'
      }
    };
    var data =[trace1];
    // adding comment to test
    var layout = {
      margin: { t: 30, b: 100},
      xaxis: { title: "OTU ID"},
    };

      Plotly.newPlot('bubble', data, layout);

    // Build a Pie Chart

        var data = [{
          values: size_value.slice(0,10),
          labels: x_values.slice(0,10),
          text: y_values.slice(0,10),
          type: 'pie'
        }];
        
        Plotly.newPlot('pie', data);

      });
  };

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}
// Initialize the dashboard
init();
