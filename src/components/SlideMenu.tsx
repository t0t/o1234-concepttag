import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface SlideMenuProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onAddTag?: (tag: {
    label: string;
    type: "normal" | "red";
    group: 0 | 1 | 2 | 3 | 4;
    content: string;
  }) => void;
}

const SlideMenu: React.FC<SlideMenuProps> = ({
  isOpen = true,
  onToggle = () => {},
  onAddTag = () => {},
}) => {
  const [tagLabel, setTagLabel] = useState("");
  const [tagType, setTagType] = useState<"normal" | "red">("normal");
  const [tagGroup, setTagGroup] = useState<0 | 1 | 2 | 3 | 4>(1);
  const [tagContent, setTagContent] = useState("");

  const handleAddTag = () => {
    if (tagLabel.trim()) {
      onAddTag({
        label: tagLabel,
        type: tagType,
        group: tagGroup,
        content: tagContent,
      });
      setTagLabel(""); // Reset the input after adding
      setTagContent(""); // Reset the content after adding
    }
  };

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-full bg-white shadow-lg transition-all duration-300 z-20 flex",
        isOpen ? "translate-x-0" : "translate-x-[300px]",
      )}
    >
      {/* Toggle button */}
      <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className="h-10 w-10 rounded-l-md rounded-r-none border-r-0 shadow-md"
        >
          {isOpen ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Menu content */}
      <div className="w-[300px] h-full bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Añadir Nueva Etiqueta
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tag-label">Texto de Etiqueta</Label>
              <Input
                id="tag-label"
                placeholder="Ingrese nombre del concepto"
                value={tagLabel}
                onChange={(e) => setTagLabel(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag-content">Contenido de Información</Label>
              <Textarea
                id="tag-content"
                placeholder="Ingrese información detallada sobre el concepto"
                value={tagContent}
                onChange={(e) => setTagContent(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Etiqueta</Label>
              <RadioGroup
                value={tagType}
                onValueChange={(value) => setTagType(value as "normal" | "red")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal" className="cursor-pointer">
                    <span className="inline-block w-4 h-4 bg-white border border-gray-200 mr-1"></span>
                    Normal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="red" id="red" />
                  <Label htmlFor="red" className="cursor-pointer">
                    <span className="inline-block w-4 h-4 bg-red-100 border border-red-200 mr-1"></span>
                    Roja
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag-group">Grupo</Label>
              <Select
                value={tagGroup.toString()}
                onValueChange={(value) =>
                  setTagGroup(parseInt(value) as 0 | 1 | 2 | 3 | 4)
                }
              >
                <SelectTrigger id="tag-group">
                  <SelectValue placeholder="Seleccionar grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Grupo 0 (Izquierda)</SelectItem>
                  <SelectItem value="1">Grupo 1 (Centro)</SelectItem>
                  <SelectItem value="2">Grupo 2 (Abajo)</SelectItem>
                  <SelectItem value="3">Grupo 3 (Arriba)</SelectItem>
                  <SelectItem value="4">Grupo 4 (Derecha)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full mt-4"
              onClick={handleAddTag}
              disabled={!tagLabel.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir Etiqueta
            </Button>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Instrucciones
            </h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Haga clic una vez en una etiqueta para activarla (azul)</li>
              <li>• Haga doble clic para ver información detallada</li>
              <li>
                • Cuando los 5 grupos tengan una etiqueta activa, se mostrarán
                todas las conexiones
              </li>
              <li>
                • Para eliminar una etiqueta, haga clic derecho sobre ella
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideMenu;
