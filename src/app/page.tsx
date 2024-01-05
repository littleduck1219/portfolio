"use client";

import "./page.scss";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const email = "user@user.com";
  const password = "testuser";

  const { data: session, status } = useSession();

  useEffect(() => {
    console.log(status);
  }, [status]);

  return (
    <main className="">
      <div className="text-white">{session?.data?.user?.email}</div>
      <button className="text-white" onClick={() => signOut()}>
        Logout
      </button>
      <button
        onClick={() =>
          signIn("credentials", {
            email,
            password,
            redirect: true,
            callbackUrl: "/",
          })
        }
        // disabled={!email || !password}
        className=""
      >
        Sign in
      </button>
    </main>
  );
}
