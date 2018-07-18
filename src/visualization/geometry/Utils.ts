import { Size } from "./Size";
import { Rect } from "./Rect";
import { Vector } from "./Vector";

export function asRect(size: Size) {
    return new Rect(0, 0, size.width, size.height)
}

export const mouseEventAsVectorInContainer = (container: HTMLElement) => (event: MouseEvent) => {
    const vector = new Vector(event.clientX, event.clientY)
    const bounds = container.getBoundingClientRect()
    return vector.minus(new Vector(bounds.left, bounds.top))
}