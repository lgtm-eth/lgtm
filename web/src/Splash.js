import { useCallback, useState } from "react";
import Eyes from "./Eyes";
import _ from "lodash";
import Wordmark from "./Wordmark";

// TODO / FUN list:
// - make eyes blink during reposition (not just after a delay)
// - color glide across the burn-through
// - introduce proper state machine + idle routine
// - have the "depth" decay slightly as the eyes settle
//   to have them appear to narrow in consternation

function BurnThrough({ clientX = 0, clientY = 0 }) {
  return (
    <svg
      style={{ position: "absolute" }}
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      fill="none"
    >
      <radialGradient id="viewHoleGradient">
        <stop offset="0%" stopColor="black" />
        <stop offset="30%" stopColor="black" />
        <stop offset="100%" stopColor="white" />
      </radialGradient>
      <linearGradient id="scanGradient" x2="0" y2="100%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="50%" stopColor="skyblue" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
      <linearGradient id="brownColumnGradient">
        <stop offset="0%" stopColor="black" />
        {/*<stop offset="25%" stopColor="brown"/>*/}
        <stop offset="50%" stopColor="#6D4C41" />
        {/*<stop offset="75%" stopColor="brown"/>*/}
        <stop offset="100%" stopColor="black" />
      </linearGradient>
      <mask id="viewHole">
        <rect fill="white" width="100%" height="100%" />
        <circle
          cx={clientX}
          cy={clientY}
          r={100}
          fill="url('#viewHoleGradient')"
        />
      </mask>
      <mask id="negativeViewHole">
        <rect fill="white" width="100%" height="100%" />
        <rect fill="black" width="100%" height="100%" mask="url(#viewHole)" />
      </mask>
      <rect fill="#1B5E20" width="100%" height="100%" mask="url(#viewHole)" />
      <rect
        fill="url(#brownColumnGradient)"
        fillOpacity="0.4"
        width={200}
        height={200}
        x={clientX - 100}
        y={clientY - 100}
        mask="url(#negativeViewHole)"
      />
      <rect
        fill="url(#scanGradient)"
        fillOpacity="0.9"
        y={clientY - 100 - 30}
        x={clientX - 100}
        width={200}
        height={60}
        mask="url(#negativeViewHole)"
      >
        <animate
          attributeName="y"
          dur="3s"
          values={`${clientY - 100 - 30};${clientY - 100 + 200 - 30};${
            clientY - 100 - 30
          }`}
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
}

const BYTE = "­01";
const BYTES = _.times(10000)
  .map(() => BYTE)
  .join("");
export default function Splash() {
  let [eyes, setEyes] = useState({ clientX: 0, clientY: 0 });
  // eslint-disable-next-line
  let updateEyes = useCallback(
    _.throttle(setEyes, 5, { leading: true, trailing: true }),
    [setEyes]
  );
  return (
    <div
      style={{
        // background: "#1B5E20",
        width: "100vw",
        height: "100vh",
        position: "relative",
        touchAction: "none",
        cursor: "none",
      }}
      // onTouchStart={(e) => e.preventDefault()}
      onTouchMove={(e) =>
        updateEyes({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
        })
      }
      onMouseMove={(e) =>
        updateEyes({
          clientX: e.clientX,
          clientY: e.clientY,
        })
      }
    >
      <div
        style={{
          position: "absolute",
          textAlign: "center",
          width: "100vw",
          height: "100vh",
          top: 1,
          left: 0,
          bottom: 1,
          right: 0,

          overflow: "hidden",
          textOverflow: "none",
          // whiteSpace: "nowrap",
        }}
      >
        {BYTES}
      </div>
      <BurnThrough {...eyes} />
      {/*<div*/}
      {/*  style={{*/}
      {/*    position: "absolute",*/}
      {/*    width: 200,*/}
      {/*    height: 200,*/}
      {/*    borderRadius: 100,*/}
      {/*    // background: "white",*/}
      {/*    background:*/}
      {/*      "radial-gradient(farthest-side, #00000033, #40241A 95%, #29B6F6)",*/}
      {/*    transform: "translate(-50%, -50%)",*/}
      {/*    left: eyes.clientX,*/}
      {/*    top: eyes.clientY,*/}
      {/*  }}*/}
      {/*/>*/}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          alignItems: "center",
        }}
      >
        <Wordmark height={120} />
        <Eyes {...eyes} />
      </div>
    </div>
  );
}
