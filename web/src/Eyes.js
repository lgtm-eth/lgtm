import { useCenter, useDebounce } from "./hooks";
import { animated, easings, useSpring } from "react-spring";
import { Box } from "@mui/material";

const blinkSequence = async (next, cancel) => {
  await next({ eyelid: 1 });
  await next({ eyelid: 0 });
};
// The pupil can scale 20% (from 80% to 100%)
const PUPIL_SCALABILITY = 0.4;
export function Eye({
  color = "#003300",
  clientX = window.innerWidth * 0.75,
  clientY = window.innerHeight * 0.75,
  size = 1.0,
}) {
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
    },
  });
  let maxDepth = Math.sqrt(
    Math.max(center.x, window.innerWidth - center.x) ** 2 +
      Math.max(center.y, window.innerHeight - center.y) ** 2
  );
  let x = center.x - clientX;
  let y = center.y - clientY;
  let angle = Math.atan2(y, x);
  let depth = Math.sqrt(x * x + y * y) / maxDepth;

  // these are the 3 ovals "centered"
  let svgCenter = { cx: 20 * size, cy: 48 * size };
  let background = { ...svgCenter, rx: 20 * size, ry: 29 * size };
  let white = { ...svgCenter, rx: 17 * size, ry: 25 * size };
  let pupil = { ...svgCenter, rx: 15 * size, ry: 21.5 * size };

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
    <svg
      ref={ref}
      width={40 * size}
      height={96 * size}
      viewBox={`0 0 ${40 * size} ${96 * size}`}
      fill="none"
    >
      <mask id="eyelid">
        <animated.rect
          fill="white"
          width="100%"
          y={white.cy - white.ry - 1}
          style={{
            height: eyelid.to((h) => 2 * h * white.ry - 20 * size),
          }}
        />
        <animated.ellipse
          fill="white"
          rx={1.5 * white.rx}
          ry={20 * size}
          style={{
            cx: white.cx,
            cy: eyelid.to(
              (h) =>
                white.cy - (white.ry + 1) + 2 * h * (white.ry + 1) - 20 * size
            ),
          }}
        />
      </mask>
      <g>
        <ellipse fill="white" fillOpacity="0.3" {...background} />
        <ellipse fill="white" {...white} />
        <ellipse fill="black" {...pupil} />
        <ellipse fill={color} fillOpacity="1" {...white} mask="url(#eyelid)" />
        {/*<rect fill="#a0a0a0" fillOpacity="1" width="100%" height="100%" mask="url(#eyelid)"/>*/}
      </g>
    </svg>
  );
}

export default function Eyes({
  color = "#003300",
  clientX,
  clientY,
  size = 1.0,
  sx,
}) {
  return (
    <Box
      sx={sx}
      style={{
        background: color,
        lineHeight: 0,
        padding: `${16 * size}px ${24 * size}px`,
        width: 128 * size,
        height: 128 * size,
        borderRadius: 96 * size,
      }}
    >
      <Eye {...{ color, clientX, clientY, size }} />
      <Eye {...{ color, clientX, clientY, size }} />
    </Box>
  );
}
