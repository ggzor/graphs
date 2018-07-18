import { VisualBase } from "../VisualBase"
import { IVisual } from "../../IVisual"

import { Observable, Subscription, merge } from "rxjs"
import { map } from "rxjs/operators"
import { when } from "../../../rx/AdditionalOperators"

import { fromVisualWithMouseAndTouch } from "../../manipulation/Draggable"
import { adjustToBounds } from "../../manipulation/AdjustPosition"
import { sizesOf } from "../../manipulation/SizeObserver"
import { positionsFrom } from "../Dragging"

import { Vector } from "../../geometry/Vector"
import { Size } from "../../geometry/Size"
import { asRect } from "../../geometry/RectUtils"

import addPositioning, { VertexMovement } from "./VertexPositioning"

export interface VertexDraggingCreationOptions {
    base: VisualBase
    controlVisual: IVisual
    container: HTMLElement
    positions: Observable<VertexMovement>
    weights: Observable<number>
    canDrag: Observable<boolean>
}

export function addDragging(options: VertexDraggingCreationOptions): Subscription {
    const { base, controlVisual, container, positions, weights, canDrag } = options

    const draggingPositions = positionsFrom(fromVisualWithMouseAndTouch(container, controlVisual)).pipe(
        map<Vector, VertexMovement>(p => [p, 0.3]),
        when(canDrag)
    )

    const finalPositions = adjustToBounds(
        merge(
            positions,
            draggingPositions
        ),
        weights.pipe(
            map(w => w * 10),
            map(w => new Size(w, w))
        ),
        sizesOf(container).pipe(
            map(asRect)
        ),
        true
    )

    return addPositioning(base, finalPositions)
}