import { Vector } from "./Vector";

export function mouseEventAsVector(m: MouseEvent) {
    return new Vector(m.x, m.y)
}