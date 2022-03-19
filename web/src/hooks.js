import { useEffect, useRef, useState } from "react";

// Utility hooks used throughout.
// Some custom, some lifted from https://usehooks.com/

// This hooks into the bounding rect for a dom element.
// It updates upon resize and scroll.
export function useRect(initialRect = null) {
  const ref = useRef();
  const [rect, setRect] = useState(initialRect);

  const set = () =>
    setRect(ref && ref.current ? ref.current.getBoundingClientRect() : {});

  const useEffectInEvent = (event, useCapture) => {
    useEffect(() => {
      set();
      window.addEventListener(event, set, useCapture);
      return () => window.removeEventListener(event, set, useCapture);
    }, [event, useCapture]);
  };

  useEffectInEvent("resize");
  useEffectInEvent("scroll", true);

  return [rect, ref];
}

// This hooks into the computed center of a dom element.
export function useCenter(
  initialCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
) {
  let [rect, ref] = useRect();
  let center =
    rect === null
      ? initialCenter
      : { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  return [center, ref];
}

export function useAnimation(easingName = "linear", duration = 500, delay = 0) {
  // The useAnimationTimer hook calls useState every animation frame ...
  // ... giving us elapsed time and causing a rerender as frequently ...
  // ... as possible for a smooth animation.
  const elapsed = useAnimationTimer(duration, delay);
  // Amount of specified duration elapsed on a scale from 0 - 1
  const n = Math.min(1, elapsed / duration);
  // Return altered value based on our specified easing function
  return easing[easingName](n);
}
// Some easing functions copied from:
// https://github.com/streamich/ts-easing/blob/master/src/index.ts
// Hardcode here or pull in a dependency
const easing = {
  linear: (n) => n,
  elastic: (n) =>
    n * (33 * n * n * n * n - 106 * n * n * n + 126 * n * n - 67 * n + 15),
  inExpo: (n) => Math.pow(2, 10 * (n - 1)),
};
export function useAnimationTimer(duration = 1000, delay = 0) {
  const [elapsed, setTime] = useState(0);
  useEffect(
    () => {
      let animationFrame, timerStop, start;
      // Function to be executed on each animation frame
      function onFrame() {
        setTime(Date.now() - start);
        loop();
      }
      // Call onFrame() on next animation frame
      function loop() {
        animationFrame = requestAnimationFrame(onFrame);
      }
      function onStart() {
        // Set a timeout to stop things when duration time elapses
        timerStop = setTimeout(() => {
          cancelAnimationFrame(animationFrame);
          setTime(Date.now() - start);
        }, duration);
        // Start the loop
        start = Date.now();
        loop();
      }
      // Start after specified delay (defaults to 0)
      const timerDelay = setTimeout(onStart, delay);
      // Clean things up
      return () => {
        clearTimeout(timerStop);
        clearTimeout(timerDelay);
        cancelAnimationFrame(animationFrame);
      };
    },
    [duration, delay] // Only re-run effect if duration or delay changes
  );
  return elapsed;
}

export function useDebounce(value, delay, initialValue = null) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}
