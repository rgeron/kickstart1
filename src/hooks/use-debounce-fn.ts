import { useCallback, useEffect, useRef } from "react";

export const useDebounceFn = <T extends unknown[]>(
  callback: (...args: T) => void,
  time = 300
) => {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Use useCallback to memoize the debounced function
  const debouncedCallback = useCallback(
    (...args: T) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        callback(...args);
      }, time);
    },
    [callback, time]
  );

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};
