"use client";
import React, { useEffect } from "react";

export default function Error({ error, resets }) {
  useEffect(() => {
    // Attempt to log error to server
    console.log(error);
  }, [error]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl text-red-500">somethink went worng</h1>
        <p className="text-2xl text-red-500">{error.message}</p>
      <button
        onClick={resets}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Try again
      </button>
    </div>
  );
}
