export function toItemType(tipo: number): "med" | "mat" {
  return tipo === 1 ? "med" : "mat"
}