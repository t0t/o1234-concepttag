import React, { useState, useEffect } from "react";
import ConceptMap from "./ConceptMap";
import SlideMenu from "./SlideMenu";
import InfoPanel from "./InfoPanel";

interface Tag {
  id: string;
  label: string;
  type: "normal" | "red";
  group: 0 | 1 | 2 | 3 | 4;
  position: { x: number; y: number };
  content?: string;
}

interface Connection {
  sourceId: string;
  targetId: string;
}

const Home: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([
    {
      id: "tag1",
      label: "Etiqueta 1",
      type: "normal",
      group: 0, // Left
      position: { x: 50, y: 50 },
      content: "Información detallada sobre Etiqueta 1.",
    },
    {
      id: "tag2",
      label: "Etiqueta 2",
      type: "red",
      group: 0, // Left
      position: { x: 50, y: 120 },
      content: "Información detallada sobre Etiqueta 2.",
    },
    {
      id: "tag3",
      label: "Etiqueta 3",
      type: "normal",
      group: 1, // Center
      position: { x: 50, y: 50 },
      content: "Información detallada sobre Etiqueta 3.",
    },
    {
      id: "tag4",
      label: "Etiqueta 4",
      type: "normal",
      group: 2, // Bottom
      position: { x: 50, y: 50 },
      content: "Información detallada sobre Etiqueta 4.",
    },
    {
      id: "tag5",
      label: "Etiqueta 5",
      type: "red",
      group: 3, // Top
      position: { x: 50, y: 50 },
      content: "Información detallada sobre Etiqueta 5.",
    },
    {
      id: "tag6",
      label: "Etiqueta 6",
      type: "normal",
      group: 4, // Right
      position: { x: 50, y: 50 },
      content: "Información detallada sobre Etiqueta 6.",
    },
  ]);

  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeTagsByGroup, setActiveTagsByGroup] = useState<
    Record<number, string>
  >({});
  const [menuOpen, setMenuOpen] = useState(true);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  // Update connections when active tags change
  useEffect(() => {
    const activeGroups = Object.keys(activeTagsByGroup).map(Number);

    // Mostrar conexiones entre los nodos activos
    if (activeGroups.length < 2) {
      setConnections([]);
      return;
    }

    const newConnections: Connection[] = [];

    // Conexiones permitidas según la imagen de referencia
    // Evitar conexiones entre grupos específicos
    const forbiddenConnections = [
      [0, 3],
      [3, 0], // No conectar grupo 0 con grupo 3
      [4, 2],
      [2, 4], // No conectar grupo 4 con grupo 2
      [1, 4],
      [4, 1], // No conectar grupo 1 con grupo 4
      [0, 2],
      [2, 0], // No conectar grupo 0 con grupo 2
      [1, 3],
      [3, 1], // No conectar grupo 1 con grupo 3
    ];

    // Crear conexiones solo entre grupos permitidos
    for (let i = 0; i < activeGroups.length; i++) {
      for (let j = i + 1; j < activeGroups.length; j++) {
        const sourceGroup = activeGroups[i];
        const targetGroup = activeGroups[j];

        // Verificar si esta conexión está prohibida
        const isConnectionForbidden = forbiddenConnections.some(
          ([source, target]) =>
            (source === sourceGroup && target === targetGroup) ||
            (source === targetGroup && target === sourceGroup),
        );

        if (!isConnectionForbidden) {
          newConnections.push({
            sourceId: activeTagsByGroup[sourceGroup],
            targetId: activeTagsByGroup[targetGroup],
          });
        }
      }
    }

    setConnections(newConnections);
  }, [activeTagsByGroup]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleAddTag = (newTag: {
    label: string;
    type: "normal" | "red";
    group: 0 | 1 | 2 | 3 | 4;
    content: string;
  }) => {
    const id = `tag${Date.now()}`; // Usar timestamp para evitar IDs duplicados
    const position = {
      x: 50,
      y: 50 + tags.filter((tag) => tag.group === newTag.group).length * 70,
    };

    setTags([...tags, { id, position, ...newTag }]);
  };

  const handleTagClick = (id: string) => {
    const clickedTag = tags.find((tag) => tag.id === id);
    if (!clickedTag) return;

    const group = clickedTag.group;

    // If this group already has an active tag
    if (activeTagsByGroup[group]) {
      // If clicking the same tag, deactivate it
      if (activeTagsByGroup[group] === id) {
        const newActiveTagsByGroup = { ...activeTagsByGroup };
        delete newActiveTagsByGroup[group];
        setActiveTagsByGroup(newActiveTagsByGroup);
      } else {
        // If clicking a different tag in the same group, update it
        setActiveTagsByGroup({
          ...activeTagsByGroup,
          [group]: id,
        });
      }
    } else {
      // Activate this tag for this group
      setActiveTagsByGroup({
        ...activeTagsByGroup,
        [group]: id,
      });
    }
  };

  const handleTagPositionChange = (
    id: string,
    newPosition: { x: number; y: number },
  ) => {
    setTags((prevTags) =>
      prevTags.map((tag) =>
        tag.id === id ? { ...tag, position: newPosition } : tag,
      ),
    );
  };

  const handleTagDoubleClick = (id: string) => {
    setSelectedTagId(id);
  };

  const handleCloseInfoPanel = () => {
    setSelectedTagId(null);
  };

  const handleTagDelete = (id: string) => {
    // Eliminar la etiqueta del array de tags
    setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));

    // Si la etiqueta estaba activa, eliminarla de activeTagsByGroup
    setActiveTagsByGroup((prev) => {
      const newActiveTagsByGroup = { ...prev };
      Object.entries(newActiveTagsByGroup).forEach(([group, tagId]) => {
        if (tagId === id) {
          delete newActiveTagsByGroup[Number(group)];
        }
      });
      return newActiveTagsByGroup;
    });

    // Si la etiqueta estaba seleccionada, cerrar el panel de información
    if (selectedTagId === id) {
      setSelectedTagId(null);
    }
  };

  // Find the selected tag to display in the info panel
  const selectedTag = tags.find((tag) => tag.id === selectedTagId);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Main content area */}
      <div className="relative flex-1 overflow-auto">
        <ConceptMap
          tags={tags}
          connections={connections}
          onTagClick={handleTagClick}
          onTagDoubleClick={handleTagDoubleClick}
          onTagDelete={handleTagDelete}
          activeTagIds={Object.values(activeTagsByGroup)}
          onTagPositionChange={handleTagPositionChange}
        />
      </div>

      {/* Slide menu */}
      <SlideMenu
        isOpen={menuOpen}
        onToggle={toggleMenu}
        onAddTag={handleAddTag}
      />

      {/* Info panel (conditionally rendered) */}
      {selectedTagId && selectedTag && (
        <InfoPanel
          isOpen={!!selectedTagId}
          onClose={handleCloseInfoPanel}
          onDelete={handleTagDelete}
          title={selectedTag.label}
          tagId={selectedTag.id}
          tagType={selectedTag.type}
          tagGroup={selectedTag.group}
          content={
            selectedTag.content ||
            `Información detallada sobre ${selectedTag.label}.`
          }
        />
      )}
    </div>
  );
};

export default Home;
