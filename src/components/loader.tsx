import React from "react";
import { Spinner } from "@/components/ui/spinner";

const Loader = () => {
  return (
    <div className="flex items-center gap-3 min-h-[85vh] justify-center">
      <div className="bg-white px-6 py-4 rounded shadow-sm">
        <Spinner className="text-[#55865f]">
          <span className="text-[#55865f] text-xs md:text-sm flex flex-shrink">
            Hang on...we are setting up this page
          </span>
        </Spinner>
      </div>
    </div>
  );
};

export default Loader;