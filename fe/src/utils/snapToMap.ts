export function snapToMap<T>(snap: Record<string, T>) {
  return Object.entries(snap).map(([id, content]) => ({ id, ...content }));
}
