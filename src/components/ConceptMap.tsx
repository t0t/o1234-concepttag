import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import GroupSection from "./GroupSection";
import ConceptTag from "./ConceptTag";
import ConnectionPath from "./ConnectionPath";
import Logo from "./Logo";

interface ConceptMapProps {
  tags?: Array<{
    id: string;
    label: string;
    type: "normal" | "red";
    group: 0 | 1 | 2 | 3 | 4;
    position: { x: number; y: number };
    content?: string;
  }>;
  connections?: Array<{
    sourceId: string;
    targetId: string;
  }>;
  onTagClick?: (id: string) => void;
  onTagDoubleClick?: (id: string) => void;
  onTagDelete?: (id: string) => void;
  activeTagIds?: string[];
  onTagPositionChange?: (
    id: string,
    position: { x: number; y: number },
  ) => void;
}

const ConceptMap: React.FC<ConceptMapProps> = ({
  tags = [
    {
      id: "tag1",
      label: "Etiqueta 1",
      type: "normal",
      group: 0, // Left
      position: { x: 50, y: 50 },
    },
    {
      id: "tag2",
      label: "Etiqueta 2",
      type: "red",
      group: 0, // Left
      position: { x: 50, y: 120 },
    },
    {
      id: "tag3",
      label: "Etiqueta 3",
      type: "normal",
      group: 1, // Center
      position: { x: 50, y: 50 },
    },
    {
      id: "tag4",
      label: "Etiqueta 4",
      type: "normal",
      group: 2, // Bottom
      position: { x: 50, y: 50 },
    },
    {
      id: "tag5",
      label: "Etiqueta 5",
      type: "red",
      group: 3, // Top
      position: { x: 50, y: 50 },
    },
    {
      id: "tag6",
      label: "Etiqueta 6",
      type: "normal",
      group: 4, // Right
      position: { x: 50, y: 50 },
    },
  ],
  connections = [],
  onTagClick = () => {},
  onTagDoubleClick = () => {},
  onTagDelete = () => {},
  activeTagIds = [],
  onTagPositionChange = () => {},
}) => {
  const [tagPositions, setTagPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  // Initialize tag positions and update when tags change
  useEffect(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    tags.forEach((tag) => {
      positions[tag.id] = tag.position;
    });
    setTagPositions(positions);
  }, [tags]);

  // Update tag positions when activeTagIds change to ensure connections are accurate
  useEffect(() => {
    if (activeTagIds.length > 0) {
      const updatedPositions = { ...tagPositions };
      let hasUpdates = false;

      activeTagIds.forEach((id) => {
        const tag = tags.find((t) => t.id === id);
        if (
          tag &&
          JSON.stringify(updatedPositions[id]) !== JSON.stringify(tag.position)
        ) {
          updatedPositions[id] = tag.position;
          hasUpdates = true;
        }
      });

      if (hasUpdates) {
        setTagPositions(updatedPositions);
      }
    }
  }, [activeTagIds, tags]);

  // Group tags by their group number
  const groupedTags: Record<number, typeof tags> = {};
  tags.forEach((tag) => {
    if (!groupedTags[tag.group]) {
      groupedTags[tag.group] = [];
    }
    groupedTags[tag.group].push(tag);
  });

  // Layout for cross-shaped arrangement based on the image reference
  const getGroupPosition = (groupId: number) => {
    switch (groupId) {
      case 3: // Top position
        return { gridArea: "top", justifySelf: "center" };
      case 0: // Left position
        return { gridArea: "left", justifySelf: "center", width: "100%" };
      case 1: // Center position
        return { gridArea: "center", justifySelf: "center" };
      case 4: // Right position
        return { gridArea: "right", justifySelf: "center", width: "100%" };
      case 2: // Bottom position
        return { gridArea: "bottom", justifySelf: "center" };
      default:
        return {};
    }
  };

  // Manejar el clic derecho para eliminar etiquetas
  const handleContextMenu = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm("¿Está seguro que desea eliminar esta etiqueta?")) {
      onTagDelete(id);
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-auto">
      {/* Logo */}
      <div className="absolute top-4 left-4 z-20">
        <Logo />
      </div>
      {/* Connection paths overlay */}
      <ConnectionPath connections={connections} tagPositions={tagPositions} />

      {/* Group sections in cross layout */}
      <div
        className="grid h-full w-full p-4"
        style={{
          gridTemplateAreas: `
               ".     top    ."
               "left  center right"
               ".     bottom  ."
             `,
          gridTemplateColumns: "1fr 1.2fr 1fr",
          gridTemplateRows: "0.9fr 1.2fr 0.9fr",
          gap: "1rem",
          minHeight: "calc(100vh - 2rem)",
        }}
      >
        {[0, 1, 2, 3, 4].map((groupId) => (
          <GroupSection
            key={`group-${groupId}`}
            groupId={groupId}
            title={`Grupo ${groupId}`}
            className="relative"
            style={getGroupPosition(groupId)}
          >
            {groupedTags[groupId]?.map((tag) => (
              <ConceptTag
                key={tag.id}
                id={tag.id}
                label={tag.label}
                type={tag.type}
                group={tag.group}
                position={tag.position}
                onTagClick={onTagClick}
                onTagDoubleClick={onTagDoubleClick}
                isHighlighted={activeTagIds.includes(tag.id)}
                onPositionChange={(id, pos) => {
                  const newPositions = { ...tagPositions };
                  newPositions[id] = pos;
                  setTagPositions(newPositions);
                  onTagPositionChange(id, pos);
                }}
                onContextMenu={(e) => handleContextMenu(tag.id, e)}
              />
            ))}
          </GroupSection>
        ))}
      </div>
    </div>
  );
};

export default ConceptMap;
