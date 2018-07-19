import { VisualBase } from "../VisualBase"
import { IVisual } from "../../IVisual"

import { Observable, merge } from "rxjs"
import { map } from "rxjs/operators"
import { when } from "../../../rx/AdditionalOperators"

import { fromVisualWithMouseAndTouch } from "../../manipulation/Draggable"
import { adjustToBounds } from "../../manipulation/AdjustPosition"
import { positionsFrom, isDragging } from "../Dragging"

import { Size } from "../../geometry/Size"
import { Rect } from "../../geometry/Rect"
import { Vector } from "../../geometry/Vector"
import { Movement } from "../../manipulation/Movement"


export interface VertexDraggingOptions {
    base: VisualBase
    controlVisual: IVisual
    container: HTMLElement

    positions: Observable<Movement>
    sizes: Observable<Size>
    bounds: Observable<Rect>

    canDrag: Observable<boolean>
}

export interface VertexDraggingOutProperties {
    isDragging: Observable<boolean>
    finalPositions: Observable<Movement>
}

export function addDragging(options: VertexDraggingOptions): VertexDraggingOutProperties {
    const { controlVisual, container, positions, sizes, bounds, canDrag } = options

    const dragging = fromVisualWithMouseAndTouch(container, controlVisual);
    const draggingPositions = positionsFrom(dragging).pipe(
        map<Vector, Movement>(p => [p, 0.3]),
        when(canDrag)
    )

    const finalPositions = adjustToBounds(
        merge(positions, draggingPositions),
        sizes, bounds, true
    )

    return { isDragging: isDragging(dragging), finalPositions }
}