"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Swiper 스타일 import (기본 스타일)
import "swiper/css/navigation"; // 네비게이션 스타일
import "swiper/css/pagination"; // 페이지네이션 스타일
import "swiper/css/effect-fade"; // 페이드 효과 스타일

const Carousel = () => {
  // 슬라이드에 사용할 이미지 (예시로 TMDB 이미지를 하드코딩)
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
            <img
              src={image}
              alt={`Movie Poster ${index}`}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
