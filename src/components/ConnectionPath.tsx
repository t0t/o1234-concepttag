import React, { useEffect, useState } from "react";

interface Connection {
  sourceId: string;
  targetId: string;
}

interface ConnectionPathProps {
  connections?: Connection[];
  tagPositions?: Record<string, { x: number; y: number }>;
}

// Añadir propiedad para throttling
interface ThrottledFunction extends Function {
  timeoutId?: number;
}

const ConnectionPath: React.FC<ConnectionPathProps> = ({
  connections = [],
  tagPositions = {},
}) => {
  const [paths, setPaths] = useState<JSX.Element[]>([]);

  // Función para obtener las coordenadas del centro de cada grupo según la nueva disposición
  const getGroupCenter = (groupId: number) => {
    const centerPoints = {
      3: { x: 500, y: 150 }, // top
      0: { x: 200, y: 400 }, // left
      1: { x: 500, y: 400 }, // center
      4: { x: 800, y: 400 }, // right
      2: { x: 500, y: 650 }, // bottom
    };
    return centerPoints[groupId as keyof typeof centerPoints] || { x: 0, y: 0 };
  };

  // Función para calcular las conexiones con throttling para mejor rendimiento
  const calculateConnections = (() => {
    const fn = (() => {
      if (connections.length === 0) {
        setPaths([]);
        return;
      }

      // Usar requestAnimationFrame con throttling para mejor rendimiento
      if (!calculateConnections.timeoutId) {
        calculateConnections.timeoutId = window.requestAnimationFrame(() => {
          calculateConnections.timeoutId = null;

          const newPaths = connections.map((connection, index) => {
            // Obtener los IDs de los tags
            const sourceTag = connection.sourceId;
            const targetTag = connection.targetId;

            // Obtener los elementos DOM reales para calcular posiciones exactas
            const sourceElement = document.querySelector(
              `[data-tag-id="${sourceTag}"]`,
            );
            const targetElement = document.querySelector(
              `[data-tag-id="${targetTag}"]`,
            );

            let sourcePos, targetPos;

            if (sourceElement && targetElement) {
              // Obtener los rectángulos de los elementos
              const sourceRect = sourceElement.getBoundingClientRect();
              const targetRect = targetElement.getBoundingClientRect();

              // Calcular el centro de cada elemento
              const sourceCenter = {
                x: sourceRect.left + sourceRect.width / 2,
                y: sourceRect.top + sourceRect.height / 2,
              };

              const targetCenter = {
                x: targetRect.left + targetRect.width / 2,
                y: targetRect.top + targetRect.height / 2,
              };

              // Calcular el ángulo entre los dos centros
              const angle = Math.atan2(
                targetCenter.y - sourceCenter.y,
                targetCenter.x - sourceCenter.x,
              );

              // Calcular los puntos en los bordes de los elementos
              // Para el elemento de origen
              sourcePos = {
                x: sourceCenter.x + Math.cos(angle) * (sourceRect.width / 2),
                y: sourceCenter.y + Math.sin(angle) * (sourceRect.height / 2),
              };

              // Para el elemento de destino (ángulo opuesto)
              targetPos = {
                x: targetCenter.x - Math.cos(angle) * (targetRect.width / 2),
                y: targetCenter.y - Math.sin(angle) * (targetRect.height / 2),
              };
            } else {
              // Fallback si no se encuentran los elementos
              if (tagPositions[sourceTag]) {
                const tagWidth = 120;
                const tagHeight = 40;
                sourcePos = {
                  x: tagPositions[sourceTag].x + tagWidth / 2,
                  y: tagPositions[sourceTag].y + tagHeight / 2,
                };
              } else {
                const sourceGroup = parseInt(sourceTag.replace(/\D/g, ""));
                sourcePos = getGroupCenter(sourceGroup % 5 || 5);
              }

              if (tagPositions[targetTag]) {
                const tagWidth = 120;
                const tagHeight = 40;
                targetPos = {
                  x: tagPositions[targetTag].x + tagWidth / 2,
                  y: tagPositions[targetTag].y + tagHeight / 2,
                };
              } else {
                const targetGroup = parseInt(targetTag.replace(/\D/g, ""));
                targetPos = getGroupCenter(targetGroup % 5 || 5);
              }
            }

            // Crear una línea curva entre los nodos para mejor visualización
            // Calculamos un punto de control para la curva
            const dx = targetPos.x - sourcePos.x;
            const dy = targetPos.y - sourcePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Punto de control para la curva (perpendicular a la línea recta)
            const controlPoint = {
              x: (sourcePos.x + targetPos.x) / 2 - dy * 0.2,
              y: (sourcePos.y + targetPos.y) / 2 + dx * 0.2,
            };

            // Crear una curva cuadrática
            const path = `M ${sourcePos.x} ${sourcePos.y} Q ${controlPoint.x} ${controlPoint.y}, ${targetPos.x} ${targetPos.y}`;

            return (
              <g key={`connection-${index}`}>
                <path
                  d={path}
                  stroke="#3b82f6" // Color azul para las conexiones
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="none"
                  strokeOpacity="0.8"
                />
                {/* Flecha en el destino */}
                <circle
                  cx={targetPos.x}
                  cy={targetPos.y}
                  r="4"
                  fill="#3b82f6"
                />
                {/* Punto en el origen */}
                <circle
                  cx={sourcePos.x}
                  cy={sourcePos.y}
                  r="2"
                  fill="#3b82f6"
                  fillOpacity="0.6"
                />
              </g>
            );
          });

          setPaths(newPaths);
        });
      }
    }) as ThrottledFunction;
    return fn;
  })();

  useEffect(() => {
    calculateConnections();

    // Agregar un listener para recalcular cuando cambie el tamaño de la ventana
    window.addEventListener("resize", calculateConnections);

    return () => {
      window.removeEventListener("resize", calculateConnections);
    };
  }, [connections, tagPositions]);

  // Este efecto se ejecuta cuando cambian las posiciones de los tags
  useEffect(() => {
    calculateConnections();

    // Escuchar el evento personalizado para cuando se mueve un tag
    const handleTagMoved = () => {
      calculateConnections();
    };

    document.addEventListener("tag-moved", handleTagMoved);

    return () => {
      document.removeEventListener("tag-moved", handleTagMoved);
    };
  }, [connections, tagPositions]);

  return (
    <div className="absolute inset-0 pointer-events-none bg-transparent z-10">
      <svg className="w-full h-full">{paths}</svg>
    </div>
  );
};

export default ConnectionPath;
