"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  GrowthPoint,
} from "@/lib/admin/get-admin-analytics";

type MetricKey =
  | "users"
  | "businesses"
  | "memories"
  | "reviews";

const metrics: {
  key: MetricKey;
  label: string;
  stroke: string;
}[] = [
  {
    key: "users",
    label: "Users",
    stroke: "#006241",
  },
  {
    key: "businesses",
    label: "Businesses",
    stroke: "#2563EB",
  },
  {
    key: "memories",
    label: "Memories",
    stroke: "#9333EA",
  },
  {
    key: "reviews",
    label: "Reviews",
    stroke: "#D97706",
  },
];

type Props = {
  data: GrowthPoint[];
};

export function GrowthChart({
  data,
}: Props) {
  const [activeMetric, setActiveMetric] =
    useState<MetricKey>("users");

  const [hoveredIndex, setHoveredIndex] =
    useState<number | null>(null);

  const width = 900;
  const height = 280;
  const paddingX = 18;
  const paddingTop = 20;
  const paddingBottom = 28;

  const metric = metrics.find(
    (item) =>
      item.key === activeMetric,
  )!;

  const values = data.map(
    (point) =>
      point[activeMetric],
  );

  const max = Math.max(
    ...values,
    1,
  );

  const coordinates = useMemo(() => {
    return data.map(
      (point, index) => {
        const x =
          data.length === 1
            ? width / 2
            : paddingX +
              (index /
                (data.length - 1)) *
                (width -
                  paddingX * 2);

        const y =
          paddingTop +
          (1 -
            point[activeMetric] /
              max) *
            (height -
              paddingTop -
              paddingBottom);

        return {
          x,
          y,
        };
      },
    );
  }, [
    data,
    activeMetric,
    max,
  ]);

  const path = coordinates
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
    )
    .join(" ");

  const areaPath =
    coordinates.length > 0
      ? `${path} L ${
          coordinates[
            coordinates.length - 1
          ].x
        } ${
          height - paddingBottom
        } L ${coordinates[0].x} ${
          height - paddingBottom
        } Z`
      : "";

  const hovered =
    hoveredIndex !== null
      ? data[hoveredIndex]
      : null;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {metrics.map((item) => {
          const active =
            activeMetric === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setActiveMetric(
                  item.key,
                );

                setHoveredIndex(null);
              }}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition duration-200 ${
                active
                  ? "bg-[#122019] text-white shadow-sm"
                  : "bg-black/[0.035] text-black/40 hover:bg-black/[0.06] hover:text-black/60"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="relative mt-7">
        {hovered &&
        hoveredIndex !== null ? (
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-xl border border-black/[0.06] bg-[#122019] px-3 py-2 text-white shadow-xl transition"
            style={{
              left: `${
                (coordinates[
                  hoveredIndex
                ].x /
                  width) *
                100
              }%`,
              top: `${
                (coordinates[
                  hoveredIndex
                ].y /
                  height) *
                100
              }%`,
            }}
          >
            <p className="text-[9px] font-medium text-white/50">
              {hovered.label}
            </p>

            <p className="mt-0.5 whitespace-nowrap text-xs font-bold">
              {
                hovered[
                  activeMetric
                ]
              }{" "}
              {metric.label.toLowerCase()}
            </p>
          </div>
        ) : null}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-[250px] w-full overflow-visible sm:h-[280px]"
          preserveAspectRatio="none"
          onMouseLeave={() =>
            setHoveredIndex(null)
          }
        >
          <defs>
            <linearGradient
              id="cafeta-chart-fill"
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={
                  metric.stroke
                }
                stopOpacity="0.14"
              />

              <stop
                offset="100%"
                stopColor={
                  metric.stroke
                }
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3].map(
            (line) => {
              const y =
                paddingTop +
                (line / 3) *
                  (height -
                    paddingTop -
                    paddingBottom);

              return (
                <line
                  key={line}
                  x1={paddingX}
                  x2={
                    width -
                    paddingX
                  }
                  y1={y}
                  y2={y}
                  stroke="rgba(0,0,0,0.055)"
                  strokeWidth="1"
                />
              );
            },
          )}

          {areaPath ? (
            <path
              key={`area-${activeMetric}`}
              d={areaPath}
              fill="url(#cafeta-chart-fill)"
              className="animate-[fadeIn_500ms_ease-out]"
            />
          ) : null}

          {path ? (
            <path
              key={`line-${activeMetric}`}
              d={path}
              fill="none"
              stroke={metric.stroke}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              pathLength="1"
              className="animate-[drawChart_700ms_ease-out_forwards]"
              style={{
                strokeDasharray: 1,
                strokeDashoffset: 1,
              }}
            />
          ) : null}

          {coordinates.map(
            (point, index) => (
              <g
                key={`${activeMetric}-${data[index].date}`}
                onMouseEnter={() =>
                  setHoveredIndex(
                    index,
                  )
                }
                className="cursor-pointer"
              >
                <rect
                  x={
                    point.x -
                    Math.max(
                      width /
                        data.length /
                        2,
                      8,
                    )
                  }
                  y="0"
                  width={Math.max(
                    width /
                      data.length,
                    16,
                  )}
                  height={height}
                  fill="transparent"
                />

                <circle
                  cx={point.x}
                  cy={point.y}
                  r={
                    hoveredIndex ===
                    index
                      ? 5
                      : 3
                  }
                  fill="white"
                  stroke={
                    metric.stroke
                  }
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  className="transition-all duration-150"
                />
              </g>
            ),
          )}
        </svg>

        <div className="mt-1 flex justify-between px-1 text-[9px] font-medium text-black/25">
          <span>
            {data[0]?.label}
          </span>

          {data.length > 2 ? (
            <span>
              {
                data[
                  Math.floor(
                    data.length / 2,
                  )
                ]?.label
              }
            </span>
          ) : null}

          <span>
            {
              data[
                data.length - 1
              ]?.label
            }
          </span>
        </div>
      </div>
    </div>
  );
}