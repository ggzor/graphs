import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";

import { mouseEventAsVector } from "../geometry/VectorUtils";

import { IVisual } from "../IVisual";
import { IDraggable } from "./IDraggable";

export function fromVisual(container: HTMLElement, visual: IVisual): IDraggable {
    return {
        start: fromEvent<MouseEvent>(visual.element, 'mousedown').pipe(
            map(mouseEventAsVector),
            map(v => v.minus(visual.getPosition()))
        ),
        move: fromEvent<MouseEvent>(container, 'mousemove').pipe(
            map(mouseEventAsVector)
        ),
        end: fromEvent<MouseEvent>(window, 'mouseup').pipe(
            map(mouseEventAsVector)
        )
    };
}