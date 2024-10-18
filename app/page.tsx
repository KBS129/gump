import Header from "@/components/Header";
import MoviesList from "@/components/MovieList";
import Page from "@/components/Page";
import React from "react";

function HomePage() {
  return <>
  <Header />
      <Page>
        <MoviesList title="현재 상영작" category="now_playing" />
        <MoviesList title="평점이 높은 영화" category="top_rated" />
        <MoviesList title="인기 있는 영화" category="popular" />
        <MoviesList title="곧 개봉하는 영화" category="upcoming" />
      </Page>
      </>
}

export default HomePage;
