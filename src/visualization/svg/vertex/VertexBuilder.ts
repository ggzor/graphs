import { VisualBase } from "../VisualBase"
import * as SVG from 'svg.js'
import addVertexVisual from "./VertexVisual"
import addPositioning, { VertexMovement } from "./VertexPositioning"

import { Observable, merge, fromEvent, Subscription } from "rxjs"
import { map } from "rxjs/operators"
import { groupSubscriptions } from "../../../rx/SubscriptionUtils"

import { Vertex } from "../../../core/Vertex"
import { nextId } from "./VertexNaming"
import { fromVisualWithMouse, fromVisualWithMouseAndTouch } from "../../manipulation/Draggable"
import { positionsFrom } from "../Dragging"
import { computePosition } from "../../animation/GSAPUtils"
import { Vector } from "../../geometry/Vector"
import { adjustToBounds } from "../../manipulation/AdjustPosition"
import { sizesOf } from "../../manipulation/SizeObserver"
import { asRect } from "../../geometry/RectUtils"
import { Size } from "../../geometry/Size"
import { when } from "../../../rx/AdditionalOperators"
import { IVisual } from "../../IVisual"

export interface VertexCreationOptions {
    colors: Observable<string>
    vertices: Observable<Vertex>
    positions: Observable<VertexMovement>,
    canDrag: Observable<boolean>
}

function createVisual(vertexName: string, base: VisualBase) {
    return {
        element: document.getElementById(vertexName),
        getPosition() {
            return computePosition(base.element);
        }
    }
}

export function createVertex(parent: SVG.Container, container: HTMLElement, options: VertexCreationOptions) {
    const base = new VisualBase(parent)

    const weights = options.vertices.pipe(map(vertex => vertex.weight))
    const vertexName = `v${nextId()}`

    const subscriptions = [
        addVertexVisual(base, vertexName, options.colors, weights),
        () => base.remove()
    ]

    const visual = createVisual(vertexName, base)

    const additionalSubscriptions = [
        addDragging(container, base, visual, options)
    ]

    return groupSubscriptions(...subscriptions, ...additionalSubscriptions)
}

function addDragging(container: HTMLElement, base: VisualBase, visual: IVisual, options: VertexCreationOptions): Subscription {
    const draggingPositions = positionsFrom(fromVisualWithMouseAndTouch(container, visual)).pipe(
        map<Vector, VertexMovement>(p => [p, 0.3]),
        when(options.canDrag)
    )

    const positions = adjustToBounds(
        merge(
            options.positions,
            draggingPositions
        ),
        options.vertices.pipe(
            map(v => v.weight * 10),
            map(w => new Size(w, w))
        ),
        sizesOf(container).pipe(
            map(asRect)
        ),
        true
    )

    return addPositioning(base, positions)
}
