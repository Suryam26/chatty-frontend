import { useEffect } from "react";

// Custom hook to detect clicks outside a given DOM element
function useOutsideClick(ref: any, callback: any) {
  // Check if click was outside the DOM element
  // and the element is not menu button
  const handleClickOutside = (event: any) => {
    if (
      ref.current &&
      event.target.id !== "search" &&
      !ref.current.contains(event.target)
    ) {
      callback();
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export default useOutsideClick;
