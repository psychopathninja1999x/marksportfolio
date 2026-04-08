"use client";

import { FaFileExcel, FaJava } from "react-icons/fa";
import {
  SiCplusplus,
  SiDart,
  SiDotnet,
  SiFlutter,
  SiKotlin,
  SiLaravel,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiYii,
} from "react-icons/si";
import { TbBrandReactNative, TbWind } from "react-icons/tb";

const TECH = [
  { label: "Yii2", Icon: SiYii },
  { label: "React", Icon: SiReact },
  { label: "React Native", Icon: TbBrandReactNative },
  { label: "Laravel", Icon: SiLaravel },
  { label: "TypeScript", Icon: SiTypescript },
  { label: "Next.js", Icon: SiNextdotjs },
  { label: "Tailwind CSS", Icon: SiTailwindcss },
  { label: "NativeWind", Icon: TbWind },
  { label: "Flutter", Icon: SiFlutter },
  { label: "Dart", Icon: SiDart },
  { label: "Kotlin", Icon: SiKotlin },
  { label: "Java", Icon: FaJava },
  { label: "C++", Icon: SiCplusplus },
  { label: "VBA", Icon: FaFileExcel },
  { label: "VB.NET", Icon: SiDotnet },
] as const;

export function AboutTechStack() {
  return (
    <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
      {TECH.map(({ label, Icon }) => (
        <div
          key={label}
          className="flex items-center gap-2.5 rounded-xl border border-cyan-400/15 bg-gradient-to-br from-white/[0.05] to-white/[0.02] px-3 py-2.5 shadow-[0_0_0_1px_rgba(103,232,249,0.06)]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
            <Icon
              className="h-6 w-6 text-cyan-200/95"
              aria-hidden
            />
          </span>
          <span className="min-w-0 truncate text-[0.8rem] font-medium tracking-tight text-[#cbd5e1] sm:text-sm">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
