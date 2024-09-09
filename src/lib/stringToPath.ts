import Path from "path-js";

export const stringToPath = (path: string | Path): Path => {
  if (path instanceof Path) return path
  else return new Path(path)
}