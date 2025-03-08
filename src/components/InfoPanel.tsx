import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  content?: string;
  tagId?: string;
  tagType?: "normal" | "red";
  tagGroup?: 0 | 1 | 2 | 3 | 4;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  isOpen = true,
  onClose = () => {},
  title = "Información del Concepto",
  content = "Esta es información detallada sobre el concepto seleccionado. Incluye una explicación completa del concepto y sus relaciones con otros conceptos en el mapa. El contenido puede ser bastante extenso y se desplazará si excede el espacio disponible en el panel.",
  tagId = "tag-1",
  tagType = "normal",
  tagGroup = 1,
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div
        ref={panelRef}
        className="bg-white shadow-lg w-full max-w-md h-auto max-h-[500px] overflow-hidden flex flex-col"
        style={{ minHeight: "400px" }}
      >
        {/* Header */}
        <div
          className={cn(
            "px-6 py-4 border-b flex justify-between items-center",
            tagType === "red" ? "bg-red-50" : "bg-gray-50",
          )}
        >
          <h3
            className={cn(
              "font-medium text-lg",
              tagType === "red" ? "text-red-800" : "text-gray-800",
            )}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Cerrar panel"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Tag metadata */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1">
                ID: {tagId}
              </span>
              <span
                className={cn(
                  "text-xs px-2 py-1",
                  tagType === "red"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800",
                )}
              >
                Tipo: {tagType === "red" ? "Roja" : "Normal"}
              </span>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1">
                Grupo: {tagGroup}
              </span>
            </div>

            {/* Main content */}
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{content}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm font-medium transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
