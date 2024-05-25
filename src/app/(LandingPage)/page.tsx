"use client";
import { Heading } from "./_components/Heading";

const LandingPage = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className=" flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <Heading />
      </div>
    </div>
  );
};
export default LandingPage;
