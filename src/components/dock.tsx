// Dependencies: npm i framer-motion tailwindcss @radix-ui/react-tooltip

"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import {
  MotionValue,
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ReactNode, useRef } from "react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { Button } from "./ui/button";
import { UploadButton } from "./upload-thing";
import { useRouter } from "next/navigation";
import { PlusIcon, Upload } from "lucide-react";

const SCALE = 1.75; // max scale factor of an icon
const DISTANCE = 110; // pixels before mouse affects an icon
const NUDGE = 40; // pixels icons are moved away from mouse
const SPRING = {
  mass: 0.1,
  stiffness: 170,
  damping: 12,
};

const icons = [
  {
    name: "Twitter",
    color: "#08a0e9",
    icon: <FaTwitter size={18} />,
    link: "",
  },
  {
    name: "Github",
    color: "#24292e",
    icon: <FaGithub size={18} />,
    link: "https://github.com/melihio",
  },
  {
    name: "LinkedIn",
    color: "#0072b1",
    icon: <FaLinkedin size={18} />,
    link: "https://linkedin.com/in/melihcokan",
  },
];

export default function Dock({ currentFolder }: { currentFolder: number }) {
  const mouseLeft = useMotionValue(-Infinity);
  const mouseRight = useMotionValue(-Infinity);
  const left = useTransform(mouseLeft, [0, 30], [0, -30]);
  const right = useTransform(mouseRight, [0, 40], [0, -40]);
  const leftSpring = useSpring(left, SPRING);
  const rightSpring = useSpring(right, SPRING);

  const navigate = useRouter();

  return (
    <>
      <motion.div
        onMouseMove={(e) => {
          const { left, right } = e.currentTarget.getBoundingClientRect();
          const offsetLeft = e.clientX - left;
          const offsetRight = right - e.clientX;
          mouseLeft.set(offsetLeft);
          mouseRight.set(offsetRight);
        }}
        onMouseLeave={() => {
          mouseLeft.set(-Infinity);
          mouseRight.set(-Infinity);
        }}
        className="relative flex hidden h-12 w-32 items-end items-center justify-center gap-3 px-3 sm:flex"
      >
        <motion.div
          className="absolute inset-y-0 -z-10 rounded-2xl border border-gray-600"
          style={{ left: leftSpring, right: rightSpring }}
        />

        <></>
      </motion.div>

      <div className="sm:hidden">
        <div className="mx-auto flex h-16 max-w-full items-end gap-4 overflow-x-scroll rounded-2xl bg-gray-700 px-4 pb-3 sm:hidden">
          {Array.from(Array(8).keys()).map((i) => (
            <div
              key={i}
              className="aspect-square w-32 flex-shrink-0 rounded-full bg-gray-100"
            />
          ))}
        </div>
      </div>
    </>
  );
}

function AppIcon({
  mouseLeft,
  children,
  bgColor,
  icon,
  href,
}: {
  mouseLeft: MotionValue;
  children: ReactNode;
  bgColor: string;
  icon: ReactNode;
  href: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(() => {
    const bounds = ref.current
      ? { x: ref.current.offsetLeft, width: ref.current.offsetWidth }
      : { x: 0, width: 0 };

    return mouseLeft.get() - bounds.x - bounds.width / 2;
  });

  const scale = useTransform(distance, [-DISTANCE, 0, DISTANCE], [1, SCALE, 1]);
  const x = useTransform(() => {
    const d = distance.get();
    if (d === -Infinity) {
      return 0;
    } else if (d < -DISTANCE || d > DISTANCE) {
      return Math.sign(d) * -1 * NUDGE;
    } else {
      return (-d / DISTANCE) * NUDGE * scale.get();
    }
  });

  const scaleSpring = useSpring(scale, SPRING);
  const xSpring = useSpring(x, SPRING);
  const y = useMotionValue(0);

  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <motion.button
            ref={ref}
            style={{
              x: xSpring,
              scale: scaleSpring,
              y,
              backgroundColor: bgColor,
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevents animation issues when clicking
              animate(y, [0, -40, 0], {
                repeat: 2,
                ease: [
                  [0, 0, 0.2, 1],
                  [0.8, 0, 1, 1],
                ],
                duration: 0.7,
              });
            }}
            className="block flex aspect-square w-10 origin-bottom items-center justify-center rounded-full bg-[#0072b1] bg-black text-white shadow"
          >
            <motion.a
              href={href}
              target="_blank"
              style={{ padding: 0, margin: 0 }}
            >
              {icon}
            </motion.a>
          </motion.button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={10}
            className="rounded border border-gray-600 bg-black px-2 py-1.5 text-sm font-medium text-white shadow shadow-black"
          >
            {children}
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
