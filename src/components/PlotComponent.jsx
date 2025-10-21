import Plot from "react-plotly.js";

const PlotComponent = ({ data, layout }) => {
  return (
    <Plot
      data={data}
      layout={layout}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler={true}
    />
  );
};

export default PlotComponent;
