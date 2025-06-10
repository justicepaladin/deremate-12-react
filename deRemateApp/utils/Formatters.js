export function formatDate(fecha) {
    if (!fecha) return "";
    const date = new Date(fecha);
    if (isNaN(date)) return fecha;
    return date.toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

export function formatEstado(estado) {
  if (!estado) return "";
  return estado
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}