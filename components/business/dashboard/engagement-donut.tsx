"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { Eye, QrCode, Utensils, Navigation } from "lucide-react";

type Props = {
  data: {
    name: string;
    value: number;
  }[];
};

const icons = {
  Views: Eye,

  QR: QrCode,

  Menu: Utensils,

  Directions: Navigation,
};

export function EngagementDonut({ data }: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      className="
rounded-[28px]

border
border-black/[0.06]

bg-white

p-6

"
    >
      <div>
        <p
          className="
text-xs
font-black
uppercase
tracking-[0.15em]
text-[#006241]
"
        >
          Customer Engagement
        </p>

        <h2
          className="
mt-1

text-xl

font-black

tracking-[-0.04em]

text-[#17211c]

"
        >
          How customers interact
        </h2>
      </div>

      <div
        className="
mt-6

grid

gap-6

md:grid-cols-[220px_1fr]

items-center

"
      >
        <div
          className="
relative

h-[220px]

"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
              >
                {data.map((item, index) => (
                  <Cell
                    key={item.name}
                    fill={["#006241", "#1f8f68", "#8fc7b0", "#d8e9df"][index]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div
            className="
absolute

inset-0

flex

flex-col

items-center

justify-center

"
          >
            <p
              className="
text-3xl

font-black

text-[#17211c]

"
            >
              {total.toLocaleString()}
            </p>

            <p
              className="
text-xs

text-black/40

"
            >
              Actions
            </p>
          </div>
        </div>

        <div
          className="
space-y-4

"
        >
          {data.map((item) => {
            const Icon = icons[item.name as keyof typeof icons];

            const percentage = total
              ? Math.round((item.value / total) * 100)
              : 0;

            return (
              <div
                key={item.name}
                className="
flex

items-center

justify-between

rounded-2xl

bg-[#f6f8f6]

p-3

"
              >
                <div
                  className="
flex

items-center

gap-3

"
                >
                  <div
                    className="
flex

size-9

items-center

justify-center

rounded-xl

bg-[#006241]/10

"
                  >
                    <Icon
                      className="
size-4

text-[#006241]

"
                    />
                  </div>

                  <div>
                    <p
                      className="
text-sm

font-bold

text-[#17211c]

"
                    >
                      {item.name}
                    </p>

                    <p
                      className="
text-xs

text-black/40

"
                    >
                      {percentage}%
                    </p>
                  </div>
                </div>

                <p
                  className="
font-black

text-[#17211c]

"
                >
                  {item.value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
