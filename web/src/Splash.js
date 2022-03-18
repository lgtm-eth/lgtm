import { useEffect, useRef, useState } from "react";
import WordmarkLGTM from "./WordmarkLGTM.svg";
import _ from "lodash";

// This hooks into the bounding rect for a dom element.
// It updates upon resize and scroll.
function useRect(initialRect = null) {
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
function useCenter(
  initialCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
) {
  let [rect, ref] = useRect();
  let center =
    rect === null
      ? initialCenter
      : { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  return [center, ref];
}

// The pupil can scale 20% (from 80% to 100%)
const PUPIL_SCALABILITY = 0.4;
function Eye({ clientX = 0, clientY = 0 }) {
  let [center, ref] = useCenter();
  let maxDepth = Math.sqrt(center.x * center.x + center.y * center.y);
  let x = center.x - clientX;
  let y = center.y - clientY;
  let angle = Math.atan2(y, x);
  let depth = Math.sqrt(x * x + y * y) / maxDepth;
  // TODO: have the "depth" decay slightly as the eyes settle
  // TODO: to have them appear to narrow in consternation

  // these are the 3 ovals "centered"
  let background = { cx: 20, cy: 48, rx: 20, ry: 29 };
  let white = { cx: 20, cy: 48, rx: 17, ry: 25 };
  let pupil = { cx: 20, cy: 48, rx: 15, ry: 21.5 };

  // direct the white of the eye
  white.cx -= Math.cos(angle) * (background.rx - white.rx);
  white.cy -= Math.sin(angle) * (background.ry - white.ry);
  // scale the pupil
  let pupilScale = 1 - PUPIL_SCALABILITY + PUPIL_SCALABILITY * depth;
  pupil.rx *= pupilScale;
  pupil.ry *= pupilScale;
  // direct the pupil
  pupil.cx -= Math.cos(angle) * (background.rx - pupil.rx);
  pupil.cy -= Math.sin(angle) * (background.ry - pupil.ry);
  return (
    <svg ref={ref} width="40" height="96" viewBox="0 0 40 96" fill="none">
      <g>
        <ellipse fill="white" fillOpacity="0.3" {...background} />
        <ellipse fill="white" {...white} />
        <ellipse fill="black" {...pupil} />
      </g>
    </svg>
  );
}

function BurnThrough({ clientX = 0, clientY = 0 }) {
  return (
    <svg
      style={{ position: "absolute" }}
      preserveAspectRatio="none"
      width="100vw"
      height="100vh"
      fill="none"
    >
      <radialGradient id="viewHoleGradient">
        <stop offset="0%" stopColor="black" />
        <stop offset="30%" stopColor="black" />
        <stop offset="100%" stopColor="white" />
      </radialGradient>
      <mask id="viewHole">
        <rect fill="white" width="100%" height="100%" mask="url(#viewHole)" />
        <circle
          cx={clientX}
          cy={clientY}
          r={100}
          fill="url('#viewHoleGradient')"
        />
      </mask>
      <rect fill="#1B5E20" width="100%" height="100%" mask="url(#viewHole)" />
    </svg>
  );
}

const BYTE = "­01";
const BYTES = _.times(10000)
  .map(() => BYTE)
  .join("");
export default function Splash() {
  let [eyes, setEyes] = useState({ clientX: 0, clientY: 0 });
  return (
    <div
      style={{
        // background: "#1B5E20",
        width: "100vw",
        height: "100vh",
        position: "relative",
        touchAction: "none",
      }}
      // onTouchStart={(e) => e.preventDefault()}
      onTouchMove={(e) => {
        setEyes({
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
        });
      }}
      onMouseMove={(e) =>
        setEyes({
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
        <img
          src={WordmarkLGTM}
          alt="LGTM wordmark"
          style={{ width: 294, height: 120 }}
        />
        <div
          style={{
            background: "#003300",
            lineHeight: 0,
            padding: "16px 24px",
            width: 128,
            height: 128,
            borderRadius: 96,
          }}
        >
          <Eye {...eyes} />
          <Eye {...eyes} />
        </div>
      </div>
    </div>
  );
}
