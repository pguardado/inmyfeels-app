import React from "react";
import Plot from "react-plotly.js";

const GraphComponent = ({ sections, bars, beats }) => {
  const barRange = bars.reduce((range, bar) => ({
    min: Math.min(range.min, bar.start),
    max: Math.max(range.max, bar.start + bar.duration),
  }));

  const beatRange = beats.reduce(
    (range, beat) => ({
      min: Math.min(range.min, beat.start),
      max: Math.max(range.max, beat.start),
    }),
    { min: Infinity, max: -Infinity }
  );

  const barData = {
    x: sections.map((section) => section.start),
    y: bars.map(
      (bar) =>
        (bar.start + bar.duration - barRange.min) /
        (barRange.max - barRange.min)
    ),
    mode: "lines+markers",
    type: "scatter",
    name: "Bars",
  };

  const beatData = {
    x: sections.map((section) => section.start),
    y: beats.map(
      (beat) => (beat.start - beatRange.min) / (beatRange.max - beatRange.min)
    ),
    mode: "lines+markers",
    type: "scatter",
    name: "Beats",
  };

  const data = [barData, beatData];

  const layout = {
    title: "Bars and Beats Across Sections",
    xaxis: { title: "Sections Time (s)" },
    yaxis: { title: "Relative Position" },
  };

  return (
    <Plot
      data={data}
      layout={layout}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler={true}
    />
  );
};

export default GraphComponent;
