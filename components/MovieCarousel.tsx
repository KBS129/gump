"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";

const Carousel = () => {
  const movieImages = [
    "https://image.tmdb.org/t/p/original/8RQLfagTgOpMo3AR2l0cozyhheO.jpg",
    "https://image.tmdb.org/t/p/original/2QhEpt9gicd3fuT2w3yRO2j9cx7.jpg",
    "https://image.tmdb.org/t/p/original/jlLNdnMkcw1Dym0ebjS9jpx9F0M.jpg",
    "https://image.tmdb.org/t/p/original/1bduANW38wAw14KHLB0DdLl5l5b.jpg"
  ];

  return (
    <div className="relative max-w-screen-lg mx-auto my-8 p-4">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        navigation={true}
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="rounded-lg overflow-hidden"
      >
        {movieImages.map((image, index) => (
          <SwiperSlide key={index}>
            <Image
              src={image}
              alt={`Movie Poster ${index}`}
              width={500} // 적절한 너비 값 설정
              height={300} // 적절한 높이 값 설정
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
