import { useEffect, useState } from "react";

function useWindowWidth(size) {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      return window.removeEventListener("resize", handleResize);
    };
  }, []);
  return windowWidth < size;
}

export default useWindowWidth;
