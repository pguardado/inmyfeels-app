import React from "react";
import Slider from "react-slick";
import Card from "./Card";

const SliderComponent = ({ data }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {data.map((track) => (
        <div key={track.id}>
          <Card track={track} />
        </div>
      ))}
    </Slider>
  );
};

export default SliderComponent;
