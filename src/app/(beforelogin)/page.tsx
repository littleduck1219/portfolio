"use client";

import "./page.scss";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function Home() {
  const { data: podex } = useQuery({
    queryKey: ["rating"],
    queryFn: () =>
      fetch(
        "https://us-central1-duckfolio-e57d0.cloudfunctions.net/fetchPokdex/pokdex",
      ).then((res) => res.json()),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    console.log(podex);
  }, [podex]);

  return (
    <main className="podex">
      {podex &&
        podex.map((monster: any) => (
          <div className="podex__list" key={monster.id}>
            <div className="podex__item">
              <p>No.{monster.id}</p>
              <div className="podex__image">
                <Image
                  src={monster.sprites.front_default}
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
        ))}
    </main>
  );
}
