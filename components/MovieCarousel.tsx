"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";
import { getMoviesOnCategory, Movie } from "../api/tmdb.api";
import { Navigation, Pagination, Autoplay } from "swiper/modules"; // 모듈을 개별적으로 불러오기

const Carousel = () => {
  const [movieImages, setMovieImages] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await getMoviesOnCategory("popular");
        const shuffledMovies = movies.sort(() => 0.5 - Math.random());
        setMovieImages(shuffledMovies.slice(0, 4));
      } catch (error) {
        console.error("영화 데이터를 가져오는 중 오류가 발생했습니다.", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="relative max-w-screen-lg mx-auto my-8 p-4 bg-black text-white">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]} // 모듈 배열로 등록
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
        {movieImages.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="relative w-full h-96">
              {" "}
              {/* 부모 요소의 높이를 조정 */}
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute top-4 left-4 z-10 text-white">
                {" "}
                {/* 제목과 부제목의 위치 조정 */}
                <h1 className="text-2xl md:text-4xl font-bold">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <h2 className="text-lg md:text-2xl mt-1">{movie.tagline}</h2>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
