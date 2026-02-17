"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";

const easeOrganic = [0.22, 1, 0.36, 1] as const;

const items = [
  { type: "rock", icon: "🪨" },
  { type: "flower", icon: "🌸" },
  { type: "tree", icon: "🌲" },
  { type: "bamboo", icon: "🎋" },
];

export function CalmryZenGarden() {
  const [placedItems, setPlacedItems] = useState<
    Array<{
      type: string;
      icon: string;
      x: number;
      y: number;
    }>
  >([]);

  const [selectedItem, setSelectedItem] =
    useState(items[0]);

  const handleCanvasClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect =
      e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPlacedItems([
      ...placedItems,
      { ...selectedItem, x, y },
    ]);
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Flower2 className="w-5 h-5 text-(--accent-warm)" />
          <h3 className="font-accent tracking-tight">
            Zen Garden
          </h3>
        </div>
        <p className="text-sm text-muted">
          Place elements intentionally. Create calm.
        </p>
      </div>

      {/* Item Selector */}
      <div className="flex justify-center gap-5">

        {items.map((item) => {
          const isActive =
            selectedItem.type === item.type;

          return (
            <motion.button
              key={item.type}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                duration: 0.3,
                ease: easeOrganic,
              }}
              onClick={() =>
                setSelectedItem(item)
              }
              className={`
                relative
                w-14 h-14
                rounded-2xl
                flex items-center justify-center
                transition-all duration-500
                border border-border
                ${
                  isActive
                    ? "bg-(--accent-warm)/20 shadow-[0_0_30px_rgba(122,75,34,0.2)]"
                    : "bg-surface-soft hover:bg-(--accent-warm)/10"
                }
              `}
            >
              <span className="text-2xl">
                {item.icon}
              </span>
            </motion.button>
          );
        })}

      </div>

      {/* Garden Canvas */}
      <div
        onClick={handleCanvasClick}
        className="
          relative
          w-full
          h-105
          rounded-3xl
          bg-surface-soft
          border border-border
          cursor-crosshair
          overflow-hidden
        "
      >

        {/* Subtle Warm Glow */}
        <div
          className="
            pointer-events-none absolute inset-0
            opacity-40
          "
          style={{
            background:
              "radial-gradient(600px 300px at 30% 20%, rgba(122,75,34,0.15), transparent 70%)",
          }}
        />

        {placedItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.4,
              ease: easeOrganic,
            }}
            style={{
              position: "absolute",
              left: item.x - 16,
              top: item.y - 16,
            }}
            className="text-3xl select-none"
          >
            {item.icon}
          </motion.div>
        ))}

        {/* Empty State */}
        {placedItems.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-sm">
            Click anywhere to place your first element.
          </div>
        )}

      </div>

    </div>
  );
}
