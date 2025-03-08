import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface GroupSectionProps {
  groupId?: number;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const GroupSection = ({
  groupId = 1,
  title = `Grupo ${groupId}`,
  children,
  className,
  style = {},
}: GroupSectionProps) => {
  const [tags, setTags] = useState<React.ReactNode[]>([]);

  // This would be replaced with actual tag components in a real implementation
  const placeholderTags = [
    <div
      key="tag1"
      className="bg-white border border-gray-200 px-3 py-1 text-sm mb-2 cursor-move shadow-sm"
    >
      Etiqueta 1
    </div>,
    <div
      key="tag2"
      className="bg-red-50 border border-red-200 text-red-700 px-3 py-1 text-sm mb-2 cursor-move shadow-sm"
    >
      Etiqueta Roja
    </div>,
    <div
      key="tag3"
      className="bg-white border border-gray-200 px-3 py-1 text-sm cursor-move shadow-sm"
    >
      Etiqueta 3
    </div>,
  ];

  return (
    <div
      className={cn(
        "bg-gray-50 border border-dashed border-gray-300 p-3 flex flex-col relative",
        className,
      )}
      style={{
        ...style,
        height: "100%",
        width: "100%",
        maxHeight: "100%",
        overflow: "visible",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-medium text-gray-700">{title}</h3>
        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5">
          Grupo {groupId}
        </span>
      </div>

      <div
        className="flex-1 overflow-visible relative"
        style={{ minHeight: "250px" }}
      >
        {children || placeholderTags}
      </div>
    </div>
  );
};

export default GroupSection;
