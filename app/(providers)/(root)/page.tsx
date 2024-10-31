import Header from "@/components/Header";
import Carousel from "@/components/MovieCarousel";
import MoviesList from "@/components/MovieList";
import Page from "@/components/Page";
import React from "react";

function HomePage() {
  return (
    <div className="bg-black text-white">
      <Header />
      <Carousel />
      <Page>
        <MoviesList title="상영중이에요" category="now_playing" />
        <MoviesList title="요즘 가장 인기 있어요" category="popular" />
        <MoviesList title="평점이 높아요" category="top_rated" />
      </Page>
    </div>
  );
}

export default HomePage;
