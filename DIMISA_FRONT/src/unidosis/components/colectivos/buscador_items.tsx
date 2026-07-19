import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchClaves } from "../../../hooks/useSearchClavesHook";
import type { ClaveEntity } from "../../../entities/clave_entity";

interface BuscadorItemsProps {
  itemType: "med" | "mat" | "all";
  onSelect: (clave: ClaveEntity) => void;
  disabled?: boolean;
}

export default function BuscadorItems({ itemType, onSelect, disabled }: BuscadorItemsProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const { results, loading, error } = useSearchClaves(query, itemType);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const placeholder = itemType === "med" ? "Buscar medicamento..." : itemType === "mat" ? "Buscar material de curación..." : "Buscar clave...";

  // Limpiar resultados al cambiar tipo
  useEffect(() => {
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
  }, [itemType]);

  useEffect(() => {
    if (query.length >= 2) {
      setIsOpen(true);
      setActiveIndex(-1);
    } else {
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeItem = listRef.current.querySelector<HTMLDivElement>(
        `[data-index="${activeIndex}"]`
      );
      activeItem?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (item: ClaveEntity) => {
      onSelect(item);
      setQuery("");
      setIsOpen(false);
      setActiveIndex(-1);
      inputRef.current?.focus();
    },
    [onSelect]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          handleSelect(results[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const showNoResults =
    isOpen && !loading && !error && results.length === 0 && query.length >= 2;

  return (
    <div ref={containerRef} className="relative mb-4 w-full z-50">
      <input
        disabled={disabled}
        placeholder={disabled ? "Selecciona un tipo primero..." : placeholder}
        className={`w-full bg-white border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""
        }`}
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls="buscador-lista"
        aria-activedescendant={
          activeIndex >= 0 ? `buscador-item-${activeIndex}` : undefined
        }
      />

      {isOpen && (
        <div
          id="buscador-lista"
          ref={listRef}
          role="listbox"
          className="absolute w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg z-10"
        >
          {loading && (
            <p className="p-2 text-gray-500" aria-live="polite">
              Buscando...
            </p>
          )}

          {error && (
            <p className="p-2 text-red-500" role="alert">
              {error}
            </p>
          )}

          {showNoResults && (
            <p className="p-2 text-gray-400 italic" aria-live="polite">
              Sin resultados para "{query}"
            </p>
          )}

          {!loading &&
            results.map((clave, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={clave.id_medicamento}
                  id={`buscador-item-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSelect(clave)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`p-2 cursor-pointer transition-colors duration-100 ${
                    isActive
                      ? "bg-blue-100 border-l-2 border-blue-500"
                      : "hover:bg-blue-50"
                  }`}
                >
                  <strong className={isActive ? "text-blue-700" : ""}>
                    {clave.clave_med}
                  </strong>
                  <p className="text-sm text-gray-600">{clave.descripcion}</p>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}