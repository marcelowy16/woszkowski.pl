import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const ORANGE = '#FF8E2C';
const CANVAS_WIDTH = 3840;
const CANVAS_HEIGHT = 2160;
const CENTER_X = CANVAS_WIDTH / 2;
const CENTER_Y = CANVAS_HEIGHT / 2;
const FULL_CIRCLE = Math.PI * 2;
const BLOB_COUNT = 24;
const DROPLET_COUNT = 72;
const RIBBON_COUNT = 14;

const rightWordPath =
  'M110.645 1.26361C115.503 0.732106 118.198 4.38757 117.799 8.91583C117.524 12.0299 116.223 15.1226 114.728 17.8313C111.296 24.0501 106.085 28.8883 100.594 33.3031C99.7712 33.9647 99.6411 34.4547 99.5913 35.4808C99.2056 43.5436 102.094 42.0581 106.69 37.8923C106.695 37.8664 106.701 37.8407 106.707 37.8151C108.156 31.6945 116.825 24.46 123.448 26.4443C125.12 26.9452 126.192 27.6574 127.1 29.1289C127.357 29.2003 127.79 29.3264 128.017 29.4412C132.819 31.7748 127.563 36.2455 128.796 39.7651C129.22 40.9741 130.501 41.0141 131.52 40.6302C133.604 39.8459 135.213 38.421 136.798 36.9186C137.606 36.1938 138.567 34.9228 139.798 34.9878C142.335 35.1214 142.26 37.4997 141.187 39.0776C137.439 44.5851 127.762 50.7508 122.22 44.0475C121.805 43.5463 121.459 42.7104 121.218 42.0982C120.51 42.7891 119.776 43.4364 119.034 44.089C115.61 47.1009 110.942 48.5376 107.521 44.5212C104.141 47.2201 100.198 49.2344 95.7983 47.1852C93.3449 46.0423 92.2059 44.035 91.3402 41.5964C87.8395 44.5264 83.8439 47.0445 79.0864 46.9581C76.3581 46.9085 74.3717 46.0787 72.394 44.2492C70.1833 46.3137 67.2717 48.851 64.1044 48.9912C59.36 49.2011 56.6537 46.2082 56.3621 41.7473C53.1796 44.5073 48.0043 48.3321 44.2368 43.4548C43.8703 42.9804 43.638 42.34 43.4156 41.7791C40.2092 45.0819 36.1071 48.8268 31.2844 45.9728C26.7438 43.2858 28.2816 37.7285 29.9937 33.8904C31.1391 31.4584 32.9145 28.0581 35.0722 26.3502C36.679 25.0783 39.8523 25.4308 41.0289 27.1813C42.1093 28.7886 40.7516 30.4712 39.9739 31.8779C39.4628 32.7745 36.3489 38.3161 36.9422 39.1745C38.0941 39.2121 42.901 33.0918 43.8682 31.9041C45.1798 30.3854 46.1233 28.3313 48.3263 28.0035C50.3113 27.708 52.9957 28.9838 52.8346 31.2804C52.745 32.5578 49.8176 37.305 51.1672 38.3105C51.4143 38.3923 51.6802 38.3909 51.9164 38.269C54.9474 36.7051 57.5243 33.7449 58.8429 30.6419C59.5018 29.0911 60.1875 27.5921 60.8617 26.0711C59.7304 26.3392 58.5865 26.6495 57.4367 26.824C55.8487 27.0651 54.0922 26.9 52.7673 25.9256C52.0432 25.393 51.495 24.6034 51.3641 23.7094C51.2419 22.8752 51.502 22.0494 52.0129 21.3844C53.9788 18.8252 61.9571 18.0113 65.1814 17.5742C66.0368 16.1807 67.1609 14.1565 68.6411 13.396C71.2612 12.0496 76.4558 13.3446 75.1781 17.123C77.8453 17.1422 81.7798 17.217 83.9975 18.838C85.9874 20.2923 85.0797 23.1732 82.7416 23.7013C81.1845 24.0528 79.5036 23.8441 77.9082 23.9045C75.8222 23.9954 73.7406 24.1519 71.6652 24.374C70.3962 26.5149 64.2022 39.2477 66.0245 41.1673C67.057 41.7341 69.608 39.1449 70.3342 38.4136C70.8553 33.1703 74.4642 28.9312 79.2889 26.9052C82.2537 25.66 87.0164 26.0103 88.3491 29.3321C90.1645 33.8552 84.5857 37.9229 80.8538 39.2403C80.2768 39.4554 78.7277 39.6936 78.5331 40.1472C78.9834 41.5722 81.0685 41.3158 82.1812 40.9754C85.5065 39.9577 88.2445 37.5921 90.7319 35.2718C91.3585 25.3416 99.4124 3.23346 110.645 1.26361ZM122.084 32.977C121.806 32.7497 121.666 32.7663 121.275 32.8032C121.234 32.8073 121.191 32.8116 121.148 32.8165C118.842 33.3407 117.137 35.0041 115.883 36.9206C115.474 37.5454 114.61 38.9966 115.181 39.6767C115.535 39.7576 115.613 39.7205 115.991 39.5792C117.42 38.831 122.606 34.5208 122.084 32.977ZM83.294 31.8523C83.0584 31.7195 82.9833 31.7391 82.7076 31.7668C81.2326 32.3615 80.1058 33.4559 79.2095 34.7677C79.0567 34.9912 78.9564 35.1752 79.0655 35.4289C79.2994 35.4464 79.4007 35.3906 79.618 35.3058C80.4821 34.9155 83.8805 33.014 83.294 31.8523ZM110.991 8.7332C107.561 10.8319 103.38 20.6947 102.148 24.7823C102.13 24.8422 102.132 24.9401 102.136 25.0037C102.327 24.9613 102.298 24.9401 102.458 24.7783C105.857 21.3843 111.327 14.7233 111.736 9.48103C111.754 9.24829 111.665 9.05132 111.516 8.87184C111.293 8.73117 111.257 8.73156 110.991 8.7332Z';

const leftInitialPath =
  'M51.5789 0.0602923C56.1164 -0.0601898 60.8759 -0.0890503 65.3367 0.855785C66.6206 1.15678 67.7892 1.53652 68.8898 2.2747C71.8625 4.26931 71.1433 8.23782 67.4087 8.57726C65.9267 8.71188 64.5207 8.50637 63.03 8.44334C61.0129 8.37443 58.994 8.36371 56.976 8.41117C49.1356 8.62655 41.7688 9.52201 34.0589 10.7955C34.5834 11.5236 35.0372 12.4978 34.7521 13.3844C34.0036 15.7123 32.6551 18.1713 31.6827 20.4577C28.8949 27.0122 26.2452 34.0793 25.3846 41.167C25.3183 42.6975 25.0765 45.3064 25.7433 46.7149C26.4898 48.2917 27.5157 49.5573 26.0862 51.2439C23.9892 53.7182 19.366 53.1164 17.0647 51.2054C15.0433 49.5269 14.3586 47.2401 14.1042 44.7308C13.5339 35.3558 19.6196 21.6729 23.8772 13.326C21.0762 14.0244 17.9554 15.0581 15.266 16.0681C14.1697 16.4756 13.0828 16.9078 12.0064 17.3639C10.1048 18.1774 8.1783 19.2306 6.07571 19.3597C4.47906 19.4577 2.76912 19.0587 1.55379 17.9844C0.622366 17.1611 0.0783666 15.9508 0.0078466 14.7229C-0.0731466 13.3118 0.478097 11.9965 1.41947 10.9529C6.17075 5.68595 30.4434 2.10859 37.817 1.22152C42.389 0.67338 46.9792 0.286057 51.5789 0.0602923Z';

const COLORS = [
  {
    base: '#FF2EA6',
    dark: '#A70070',
    light: '#FF91DA',
  },
  {
    base: '#00CFFF',
    dark: '#0076B8',
    light: '#A5F3FF',
  },
  {
    base: '#7A3CFF',
    dark: '#3D14B8',
    light: '#C6A8FF',
  },
  {
    base: '#FFD339',
    dark: '#D48300',
    light: '#FFF0A6',
  },
] as const;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);

const randomValue = (seed: number) => {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return value - Math.floor(value);
};

const randomRange = (seed: number, min: number, max: number) =>
  min + (max - min) * randomValue(seed);

const rounded = (value: number) => Number(value.toFixed(2));

const makeBlobPath = (radius: number, seed: number, points: number) => {
  const anchors = Array.from({length: points}, (_, index) => {
    const angle = (index / points) * FULL_CIRCLE;
    const pulse = randomRange(seed + index * 17, 0.62, 1.18);
    return {
      x: Math.cos(angle) * radius * pulse,
      y: Math.sin(angle) * radius * pulse,
    };
  });

  const midpoints = anchors.map((point, index) => {
    const next = anchors[(index + 1) % anchors.length];
    return {
      x: (point.x + next.x) / 2,
      y: (point.y + next.y) / 2,
    };
  });

  const [first] = midpoints;
  const curves = anchors
    .map((point, index) => {
      const nextMid = midpoints[index];
      return `Q ${rounded(point.x)} ${rounded(point.y)} ${rounded(
        nextMid.x,
      )} ${rounded(nextMid.y)}`;
    })
    .join(' ');

  return `M ${rounded(first.x)} ${rounded(first.y)} ${curves} Z`;
};

const BLOBS = Array.from({length: BLOB_COUNT}, (_, index) => {
  const lane = index / BLOB_COUNT;
  const angle =
    lane * FULL_CIRCLE +
    randomRange(200 + index, -0.2, 0.2) -
    Math.PI * 0.08;
  const distance = randomRange(400 + index, 430, 1290);
  const radius = randomRange(600 + index, 76, 230);
  const colorIndex = index % COLORS.length;

  return {
    angle,
    colorIndex,
    distance,
    layer: index % 4 === 0 ? 'front' : 'back',
    path: makeBlobPath(radius, 800 + index * 13, 8 + (index % 5)),
    rotation: randomRange(1000 + index, -70, 70),
    scaleX: randomRange(1200 + index, 0.72, 1.5),
    scaleY: randomRange(1400 + index, 0.68, 1.32),
    start: randomRange(1600 + index, 8, 18),
  };
});

const DROPLETS = Array.from({length: DROPLET_COUNT}, (_, index) => {
  const angle =
    (index / DROPLET_COUNT) * FULL_CIRCLE +
    randomRange(2000 + index, -0.28, 0.28);

  return {
    angle,
    colorIndex: Math.floor(randomRange(2200 + index, 0, COLORS.length - 0.01)),
    distance: randomRange(2400 + index, 600, 1740),
    gravity: randomRange(2600 + index, 20, 190),
    layer: index % 3 === 0 ? 'front' : 'back',
    rotation: randomRange(2800 + index, -60, 60),
    size: randomRange(3000 + index, 12, 48),
    start: randomRange(3200 + index, 9, 24),
    stretch: randomRange(3400 + index, 1.15, 2.75),
  };
});

const RIBBONS = Array.from({length: RIBBON_COUNT}, (_, index) => {
  const angle =
    (index / RIBBON_COUNT) * FULL_CIRCLE +
    randomRange(3600 + index, -0.18, 0.18);

  return {
    angle,
    colorIndex: (index + 1) % COLORS.length,
    distance: randomRange(3800 + index, 690, 1540),
    layer: index % 5 === 0 ? 'front' : 'back',
    lift: randomRange(4000 + index, -260, 260),
    start: randomRange(4200 + index, 8, 17),
    width: randomRange(4400 + index, 28, 76),
  };
});

const paintProgress = (frame: number, fps: number, start: number) =>
  clamp(
    spring({
      frame: Math.max(0, frame - start),
      fps,
      config: {
        damping: 11,
        mass: 0.8,
        stiffness: 118,
      },
    }),
    0,
    1.08,
  );

const StudioBackground = ({frame}: {frame: number}) => {
  const flash = interpolate(frame, [7, 12, 34, 92], [0, 1, 0.34, 0.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 50% 46%, #ffffff 0%, #ffffff 34%, #fbfdff 58%, #eef7ff 100%)',
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${
            0.96 * flash
          }) 0%, rgba(0,207,255,${0.11 * flash}) 22%, rgba(255,46,166,${
            0.09 * flash
          }) 36%, rgba(255,211,57,${0.08 * flash}) 52%, transparent 72%)`,
          mixBlendMode: 'multiply',
        }}
      />
      <div
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(10, 28, 54, 0.14) 0%, rgba(10, 28, 54, 0.055) 24%, transparent 64%)',
          bottom: 212,
          filter: 'blur(24px)',
          height: 220,
          left: '50%',
          opacity: 0.38,
          position: 'absolute',
          transform: 'translateX(-50%)',
          width: 1720,
        }}
      />
    </AbsoluteFill>
  );
};

const PaintDefs = () => (
  <defs>
    <filter id="liquid-depth" x="-60%" y="-60%" width="220%" height="220%">
      <feDropShadow dx="0" dy="14" floodColor="#06142D" floodOpacity="0.13" stdDeviation="12" />
      <feDropShadow dx="0" dy="4" floodColor="#FFFFFF" floodOpacity="0.36" stdDeviation="3" />
    </filter>
    <filter id="mist-blur" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="18" />
    </filter>
    <linearGradient id="shockwave-stroke" x1="0%" x2="100%" y1="0%" y2="0%">
      <stop offset="0%" stopColor="#FF2EA6" stopOpacity="0" />
      <stop offset="26%" stopColor="#FF2EA6" stopOpacity="0.62" />
      <stop offset="52%" stopColor="#00CFFF" stopOpacity="0.72" />
      <stop offset="78%" stopColor="#FFD339" stopOpacity="0.58" />
      <stop offset="100%" stopColor="#7A3CFF" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="front-clear-gradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#000000" />
      <stop offset="68%" stopColor="#000000" />
      <stop offset="100%" stopColor="#FFFFFF" />
    </radialGradient>
    <mask id="front-clear-mask" maskUnits="userSpaceOnUse">
      <rect fill="#FFFFFF" height={CANVAS_HEIGHT} width={CANVAS_WIDTH} x="0" y="0" />
      <ellipse
        cx={CENTER_X}
        cy={CENTER_Y}
        fill="url(#front-clear-gradient)"
        rx="900"
        ry="315"
      />
    </mask>
    {COLORS.map((color, index) => (
      <radialGradient
        key={color.base}
        id={`paint-${index}`}
        cx="34%"
        cy="24%"
        r="78%"
      >
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="12%" stopColor={color.light} />
        <stop offset="52%" stopColor={color.base} />
        <stop offset="100%" stopColor={color.dark} />
      </radialGradient>
    ))}
    {COLORS.map((color, index) => (
      <linearGradient
        key={`${color.base}-ribbon`}
        id={`ribbon-${index}`}
        x1="0%"
        x2="100%"
        y1="0%"
        y2="0%"
      >
        <stop offset="0%" stopColor={color.light} stopOpacity="0" />
        <stop offset="16%" stopColor={color.light} stopOpacity="0.96" />
        <stop offset="56%" stopColor={color.base} stopOpacity="0.98" />
        <stop offset="100%" stopColor={color.dark} stopOpacity="0.18" />
      </linearGradient>
    ))}
  </defs>
);

const Shockwaves = ({frame, fps}: {frame: number; fps: number}) => (
  <g>
    {[0, 1, 2].map((index) => {
      const start = 8 + index * 5;
      const progress = interpolate(
        frame,
        [start, start + 0.9 * fps],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.12, 0.96, 0.18, 1),
        },
      );
      const radius = interpolate(progress, [0, 1], [40, 1180 + index * 230]);
      const opacity = interpolate(
        frame,
        [start, start + 8, start + 0.8 * fps],
        [0, 0.9 - index * 0.22, 0],
        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
      );

      return (
        <circle
          key={index}
          cx={CENTER_X}
          cy={CENTER_Y}
          fill="none"
          opacity={opacity}
          r={radius}
          stroke="url(#shockwave-stroke)"
          strokeWidth={24 - index * 5}
        />
      );
    })}
  </g>
);

const CentralBurst = ({frame, fps}: {frame: number; fps: number}) => {
  const impact = spring({
    frame: Math.max(0, frame - 7),
    fps,
    config: {
      damping: 9,
      mass: 0.65,
      stiffness: 170,
    },
  });

  const opacity = interpolate(frame, [6, 11, 30, 46], [0, 1, 0.96, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const scale = interpolate(clamp(impact, 0, 1.2), [0, 1.2], [0.12, 1.22]);
  const clearPull = interpolate(frame, [22, 46], [1, 0.22], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.52, 0, 0.2, 1),
  });

  return (
    <g opacity={opacity} filter="url(#liquid-depth)">
      {COLORS.map((color, index) => {
        const angle = (index / COLORS.length) * FULL_CIRCLE + 0.48;
        const x = Math.cos(angle) * 126 * scale * clearPull;
        const y = Math.sin(angle) * 68 * scale * clearPull;

        return (
          <ellipse
            key={color.base}
            cx={CENTER_X + x}
            cy={CENTER_Y + y}
            fill={`url(#paint-${index})`}
            rx={(470 + index * 56) * scale * clearPull}
            ry={(230 + index * 34) * scale * clearPull}
            transform={`rotate(${index * 28 - 12} ${CENTER_X + x} ${
              CENTER_Y + y
            })`}
          />
        );
      })}
      <ellipse
        cx={CENTER_X - 130 * scale}
        cy={CENTER_Y - 96 * scale}
        fill="#FFFFFF"
        opacity={0.2}
        rx={210 * scale * clearPull}
        ry={52 * scale * clearPull}
        transform={`rotate(-14 ${CENTER_X - 130 * scale} ${
          CENTER_Y - 96 * scale
        })`}
      />
    </g>
  );
};

const PaintRibbons = ({
  frame,
  fps,
  layer,
}: {
  frame: number;
  fps: number;
  layer: 'back' | 'front';
}) => (
  <g>
    {RIBBONS.filter((ribbon) => ribbon.layer === layer).map((ribbon, index) => {
      const progress = paintProgress(frame, fps, ribbon.start);
      const draw = interpolate(
        frame,
        [ribbon.start, ribbon.start + 12, ribbon.start + 45],
        [0, 0.96, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.13, 0.92, 0.16, 1),
        },
      );
      const fade = interpolate(frame, [94, 145], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const reach = ribbon.distance * progress;
      const endX = CENTER_X + Math.cos(ribbon.angle) * reach;
      const endY =
        CENTER_Y + Math.sin(ribbon.angle) * reach + ribbon.lift * progress;
      const controlOneX =
        CENTER_X + Math.cos(ribbon.angle - 0.28) * reach * 0.34;
      const controlOneY =
        CENTER_Y + Math.sin(ribbon.angle - 0.28) * reach * 0.34;
      const controlTwoX =
        CENTER_X + Math.cos(ribbon.angle + 0.18) * reach * 0.72;
      const controlTwoY =
        CENTER_Y +
        Math.sin(ribbon.angle + 0.18) * reach * 0.72 +
        ribbon.lift * progress * 0.78;

      return (
        <g key={`${layer}-${index}`} opacity={fade}>
          <path
            d={`M ${CENTER_X} ${CENTER_Y} C ${controlOneX} ${controlOneY} ${controlTwoX} ${controlTwoY} ${endX} ${endY}`}
            fill="none"
            opacity={0.88}
            pathLength={1}
            stroke={`url(#ribbon-${ribbon.colorIndex})`}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
            strokeLinecap="round"
            strokeWidth={ribbon.width}
          />
          <path
            d={`M ${CENTER_X} ${CENTER_Y} C ${controlOneX} ${controlOneY} ${controlTwoX} ${controlTwoY} ${endX} ${endY}`}
            fill="none"
            opacity={0.36 * fade}
            pathLength={1}
            stroke="#FFFFFF"
            strokeDasharray={0.36}
            strokeDashoffset={1 - draw}
            strokeLinecap="round"
            strokeWidth={Math.max(8, ribbon.width * 0.18)}
          />
        </g>
      );
    })}
  </g>
);

const PaintBlobs = ({
  frame,
  fps,
  layer,
}: {
  frame: number;
  fps: number;
  layer: 'back' | 'front';
}) => (
  <g filter="url(#liquid-depth)">
    {BLOBS.filter((blob) => blob.layer === layer).map((blob, index) => {
      const progress = paintProgress(frame, fps, blob.start);
      const fade = interpolate(frame, [108, 150], [1, 0.1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const x =
        CENTER_X +
        Math.cos(blob.angle) * blob.distance * progress +
        Math.sin(progress * Math.PI) * 54 * Math.sin(blob.angle * 2);
      const y =
        CENTER_Y +
        Math.sin(blob.angle) * blob.distance * progress +
        Math.sin(progress * Math.PI) * 42 * Math.cos(blob.angle * 1.7);
      const scale = interpolate(progress, [0, 0.45, 1], [0.08, 1.08, 0.92], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      const opacity = interpolate(
        frame,
        [blob.start, blob.start + 5, 130, 150],
        [0, layer === 'front' ? 0.88 : 0.98, 0.86, 0],
        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
      );

      return (
        <g
          key={`${layer}-${index}`}
          opacity={opacity * fade}
          transform={`translate(${x} ${y}) rotate(${
            blob.rotation + progress * 32
          }) scale(${scale * blob.scaleX} ${scale * blob.scaleY})`}
        >
          <path d={blob.path} fill={`url(#paint-${blob.colorIndex})`} />
          <ellipse
            cx="-30"
            cy="-42"
            fill="#FFFFFF"
            opacity={0.22}
            rx="42"
            ry="14"
            transform="rotate(-18)"
          />
        </g>
      );
    })}
  </g>
);

const PaintDroplets = ({
  frame,
  fps,
  layer,
}: {
  frame: number;
  fps: number;
  layer: 'back' | 'front';
}) => (
  <g>
    {DROPLETS.filter((droplet) => droplet.layer === layer).map(
      (droplet, index) => {
        const localFrame = frame - droplet.start;
        const progress = clamp(
          interpolate(localFrame, [0, 48], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.1, 0.72, 0.16, 1),
          }),
        );
        const fade = interpolate(frame, [112, 150], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const x =
          CENTER_X +
          Math.cos(droplet.angle) * droplet.distance * progress +
          Math.sin(progress * Math.PI * 2) * 18;
        const y =
          CENTER_Y +
          Math.sin(droplet.angle) * droplet.distance * progress +
          droplet.gravity * progress * progress;
        const scale = interpolate(progress, [0, 0.18, 1], [0, 1.12, 0.86], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const opacity = interpolate(
          frame,
          [droplet.start, droplet.start + 5, 126, 150],
          [0, 1, 0.78, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
        );

        return (
          <g
            key={`${layer}-${index}`}
            opacity={opacity * fade}
            transform={`rotate(${droplet.rotation + progress * 90} ${x} ${y})`}
          >
            <ellipse
              cx={x}
              cy={y}
              fill={`url(#paint-${droplet.colorIndex})`}
              rx={droplet.size * scale * 0.74}
              ry={droplet.size * droplet.stretch * scale}
            />
            <ellipse
              cx={x - droplet.size * 0.2}
              cy={y - droplet.size * 0.52}
              fill="#FFFFFF"
              opacity={0.34}
              rx={droplet.size * scale * 0.18}
              ry={droplet.size * scale * 0.38}
            />
          </g>
        );
      },
    )}
  </g>
);

const PaintLayer = ({
  frame,
  fps,
  layer,
}: {
  frame: number;
  fps: number;
  layer: 'back' | 'front';
}) => (
  <svg
    height="100%"
    style={{
      inset: 0,
      overflow: 'visible',
      position: 'absolute',
      width: '100%',
    }}
    viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
    width="100%"
  >
    <PaintDefs />
    {layer === 'back' ? <Shockwaves frame={frame} fps={fps} /> : null}
    {layer === 'back' ? <CentralBurst frame={frame} fps={fps} /> : null}
    <g mask={layer === 'front' ? 'url(#front-clear-mask)' : undefined}>
      <PaintRibbons frame={frame} fps={fps} layer={layer} />
      <PaintBlobs frame={frame} fps={fps} layer={layer} />
      <PaintDroplets frame={frame} fps={fps} layer={layer} />
    </g>
  </svg>
);

const CleanReveal = ({frame, fps}: {frame: number; fps: number}) => {
  const scale = interpolate(frame, [20, 42, 92], [0, 1, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const opacity = interpolate(frame, [18, 32, 112, 150], [0, 1, 0.98, 0.72], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glow = interpolate(frame, [22, 38, 70], [0, 1, 0.18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const flash = spring({
    frame: Math.max(0, frame - 26),
    fps,
    config: {
      damping: 16,
      mass: 0.6,
      stiffness: 120,
    },
  });

  return (
    <AbsoluteFill style={{zIndex: 24}}>
      <div
        style={{
          background:
            'radial-gradient(ellipse at center, #ffffff 0%, #ffffff 54%, rgba(255,255,255,0.92) 69%, rgba(255,255,255,0) 100%)',
          borderRadius: '50%',
          boxShadow: `0 0 ${120 + glow * 220}px rgba(255,255,255,${
            0.68 + glow * 0.25
          }), 0 26px 100px rgba(13,42,66,${0.06 * clamp(flash)})`,
          filter: 'blur(0.2px)',
          height: 700,
          left: '50%',
          opacity,
          position: 'absolute',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${scale})`,
          width: 1650,
        }}
      />
    </AbsoluteFill>
  );
};

const LogoMark = ({frame, fps}: {frame: number; fps: number}) => {
  const reveal = interpolate(frame, [28, 48], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const logoSpring = spring({
    frame: Math.max(0, frame - 33),
    fps,
    config: {
      damping: 18,
      mass: 0.66,
      stiffness: 140,
    },
  });
  const logoScale = interpolate(clamp(logoSpring, 0, 1.08), [0, 1.08], [0.9, 1]);
  const sheen = interpolate(frame, [54, 76, 94], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.44, 0, 0.18, 1),
  });
  const sheenX = interpolate(frame, [54, 94], [-22, 170], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 36,
      }}
    >
      <svg
        aria-label="Tutela logo"
        role="img"
        style={{
          clipPath: `circle(${reveal * 86}% at 50% 50%)`,
          filter:
            'drop-shadow(0 25px 38px rgba(255, 142, 44, 0.18)) drop-shadow(0 2px 0 rgba(255,255,255,0.8))',
          opacity: reveal,
          overflow: 'visible',
          transform: `scale(${logoScale})`,
          width: 1260,
        }}
        viewBox="-6 -8 154 69"
      >
        <defs>
          <mask id="logo-mask">
            <rect fill="black" height="69" width="154" x="-6" y="-8" />
            <path d={leftInitialPath} fill="white" />
            <path d={rightWordPath} fill="white" />
          </mask>
          <linearGradient id="logo-sheen" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="42%" stopColor="#FFFFFF" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={leftInitialPath} fill={ORANGE} />
        <path d={rightWordPath} fill={ORANGE} />
        <rect
          fill="url(#logo-sheen)"
          height="86"
          mask="url(#logo-mask)"
          opacity={0.58 * sheen}
          transform={`translate(${sheenX} -16) rotate(12 10 34)`}
          width="24"
          x="0"
          y="0"
        />
      </svg>
    </AbsoluteFill>
  );
};

const LensFinish = ({frame}: {frame: number}) => {
  const flash = interpolate(frame, [8, 12, 22], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const finishGlow = interpolate(frame, [44, 72, 140], [0, 0.62, 0.16], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${
          0.94 * flash
        }) 0%, rgba(255,255,255,0) 34%), radial-gradient(ellipse at 50% 50%, rgba(255,142,44,${
          0.16 * finishGlow
        }) 0%, rgba(255,46,166,${
          0.07 * finishGlow
        }) 28%, rgba(0,207,255,${0.06 * finishGlow}) 48%, rgba(255,255,255,0) 72%)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        zIndex: 60,
      }}
    />
  );
};

export const LogoReveal = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <StudioBackground frame={frame} />
      <div style={{inset: 0, position: 'absolute', zIndex: 12}}>
        <PaintLayer frame={frame} fps={fps} layer="back" />
      </div>
      <CleanReveal frame={frame} fps={fps} />
      <LogoMark frame={frame} fps={fps} />
      <div style={{inset: 0, position: 'absolute', zIndex: 48}}>
        <PaintLayer frame={frame} fps={fps} layer="front" />
      </div>
      <LensFinish frame={frame} />
    </AbsoluteFill>
  );
};
