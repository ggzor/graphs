import { Size } from "./Size";
import { Rect } from "./Rect";

export function asRect(size: Size) {
    return new Rect(0, 0, size.width, size.height)
}