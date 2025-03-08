import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import Draggable from "react-draggable";

interface ConceptTagProps {
  id?: string;
  label?: string;
  type?: "normal" | "red";
  group?: 0 | 1 | 2 | 3 | 4;
  position?: { x: number; y: number };
  onTagClick?: (id: string) => void;
  onTagDoubleClick?: (id: string) => void;
  isHighlighted?: boolean;
  onPositionChange?: (id: string, position: { x: number; y: number }) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

const ConceptTag: React.FC<ConceptTagProps> = ({
  id = "tag-1",
  label = "Etiqueta",
  type = "normal",
  group = 1,
  position = { x: 0, y: 0 },
  onTagClick = () => {},
  onTagDoubleClick = () => {},
  isHighlighted = false,
  onPositionChange = () => {},
  onContextMenu = () => {},
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [lastClick, setLastClick] = useState(0);
  const nodeRef = useRef(null);

  // Notificar movimiento de etiqueta
  const notifyTagMoved = () => {
    document.dispatchEvent(new CustomEvent("tag-moved", { detail: { id } }));
  };

  // Manejadores de eventos de arrastre
  const handleDragStart = () => setIsDragging(true);

  const handleDrag = (_e: any, data: any) => {
    onPositionChange(id, { x: data.x, y: data.y });
    notifyTagMoved();
  };

  const handleDragStop = (_e: any, data: any) => {
    setIsDragging(false);
    onPositionChange(id, { x: data.x, y: data.y });
    notifyTagMoved();

    // Determinar si fue clic o arrastre
    const wasDragged = Math.abs(data.deltaX) > 5 || Math.abs(data.deltaY) > 5;

    if (!wasDragged) {
      const now = new Date().getTime();
      const timeSinceLastClick = now - lastClick;

      if (timeSinceLastClick < 300) {
        onTagDoubleClick(id);
      } else {
        onTagClick(id);
      }

      setLastClick(now);
    }
  };

  // Clases CSS
  const tagClassNames = cn(
    "cursor-move select-none px-4 py-2 text-sm font-medium transition-all duration-200 mb-2",
    "border border-gray-200 bg-white",
    {
      "bg-red-100 text-red-800 border-red-200": type === "red",
      "bg-blue-100 text-blue-800 border-blue-200": isHighlighted,
      "z-20 scale-105": isHighlighted,
      "z-50": isDragging,
      "cursor-grabbing": isDragging,
    },
  );

  return (
    <Draggable
      position={position}
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDragStop}
      bounds="parent"
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        className={tagClassNames}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          transition: isDragging ? "none" : "transform 0.2s ease",
          touchAction: "none",
          userSelect: "none",
          width: "fit-content",
          minWidth: "120px",
          zIndex: isDragging ? 50 : isHighlighted ? 20 : 10,
        }}
        data-group={group}
        data-tag-id={id}
        id={`tag-${id}`}
        onContextMenu={onContextMenu}
      >
        {label}
      </div>
    </Draggable>
  );
};

export default ConceptTag;
