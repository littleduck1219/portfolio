"use client";

import "./page.scss";
import { useEffect } from "react";
import {
  DefaultError,
  InfiniteData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import Loader from "@/app/(beforelogin)/_components/Loader";

interface Pokemon {
  id: number;
  name: string;
  sprites: any;
}

const Home = () => {
  const {
    data: pokedex,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
  } = useInfiniteQuery<
    Pokemon[],
    DefaultError,
    InfiniteData<Pokemon[]>,
    [string],
    number
  >({
    queryKey: ["pokedex"],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `https://us-central1-duckfolio-e57d0.cloudfunctions.net/fetchPokedex/pokedex?limit=20&offset=${pageParam}`,
      );
      return res.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.length === 20) {
        return allPages.length * 20;
      } else {
        return undefined;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
  });

  console.log(pokedex && pokedex);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  return (
    <main className="podex">
      {pokedex?.pages?.map((page: any) =>
        page.map((monster: any) => (
          <div className="podex__list" key={monster.id}>
            <div className="podex__item">
              <p className="podex__number">No.{monster.id}</p>
              <div className="podex__image">
                <Image
                  src={monster.sprites}
                  alt={"monster"}
                  width={100}
                  height={100}
                />
              </div>
              <div className="podex__info">
                <p>{monster.name}</p>
              </div>
            </div>
          </div>
        )),
      )}
      {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
      <div style={{ height: "5px" }} ref={ref} />
    </main>
  );
};

export default Home;
