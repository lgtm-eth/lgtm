import { useState } from "react";
import { useSpring, animated, easings } from "react-spring";
import { useCenter, useDebounce } from "./hooks";
import WordmarkLGTM from "./WordmarkLGTM.svg";
import _ from "lodash";

// TODO / FUN list:
// - make eyes blink during reposition (not just after a delay)
// - color glide across the burn-through
// - introduce proper state machine + idle routine
// - have the "depth" decay slightly as the eyes settle
//   to have them appear to narrow in consternation

const blinkSequence = async (next, cancel) => {
  await next({ eyelid: 1 });
  await next({ eyelid: 0 });
};
// The pupil can scale 20% (from 80% to 100%)
const PUPIL_SCALABILITY = 0.4;
function Eye({ clientX = 0, clientY = 0, blinkController = (blinkApi) => {} }) {
  let [center, ref] = useCenter();
  let old = useDebounce(`${clientX},${clientY}`, 3000, null);
  let bored = old === `${clientX},${clientY}`;
  let { eyelid } = useSpring({
    from: { eyelid: 0 },
    loop: {
      delay: 5000,
    },
    to: !bored ? undefined : blinkSequence,
    config: {
      easing: easings.easeInOutElastic,
      clamp: true,
      tension: 300,
      // precision: 0.00001,
      // friction: 15,
    },
    // reset: true,
    // delay: 2000,
  });
  let maxDepth = Math.sqrt(center.x * center.x + center.y * center.y);
  let x = center.x - clientX;
  let y = center.y - clientY;
  let angle = Math.atan2(y, x);
  let depth = Math.sqrt(x * x + y * y) / maxDepth;

  // these are the 3 ovals "centered"
  let svgCenter = { cx: 20, cy: 48 };
  let background = { ...svgCenter, rx: 20, ry: 29 };
  let white = { ...svgCenter, rx: 17, ry: 25 };
  let pupil = { ...svgCenter, rx: 15, ry: 21.5 };

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
      <mask id="eyelid">
        <animated.rect
          fill="white"
          width="100%"
          y={white.cy - white.ry - 1}
          style={{
            height: eyelid.to((h) => 2 * h * white.ry - 20),
          }}
        />
        <animated.ellipse
          fill="white"
          rx={1.5 * white.rx}
          ry={20}
          style={{
            cx: white.cx,
            cy: eyelid.to(
              (h) => white.cy - (white.ry + 1) + 2 * h * (white.ry + 1) - 20
            ),
          }}
        />
      </mask>
      <g>
        <ellipse fill="white" fillOpacity="0.3" {...background} />
        <ellipse fill="white" {...white} />
        <ellipse fill="black" {...pupil} />
        <ellipse
          fill="#003300"
          fillOpacity="1"
          {...white}
          mask="url(#eyelid)"
        />
        {/*<rect fill="#a0a0a0" fillOpacity="1" width="100%" height="100%" mask="url(#eyelid)"/>*/}
      </g>
    </svg>
  );
}

//
// function EyelidEllipse(props) {
//   return (
//     <ellipse {...props} />
//   );
// }

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
        <rect fill="white" width="100%" height="100%" />
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
