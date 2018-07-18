import { VisualBase } from "../VisualBase"
import * as SVG from 'svg.js'
import addVertexVisual from "./VertexVisual"
import addPositioning, { VertexMovement } from "./VertexPositioning"

import { Observable, merge, fromEvent } from "rxjs"
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

export interface VertexCreationOptions {
    colors: Observable<string>
    vertices: Observable<Vertex>
    positions: Observable<VertexMovement>
}

export function createVertex(parent: SVG.Container, container: HTMLElement, options: VertexCreationOptions) {
    const base = new VisualBase(parent)

    const weights = options.vertices.pipe(map(vertex => vertex.weight))

    const vertexName = `v${nextId()}`
    const subscriptions = [
        addVertexVisual(base, vertexName, options.colors, weights),
    ]

    const vertexElement = document.getElementById(vertexName)
    const textElement = document.getElementById('text')

    const dragging = fromVisualWithMouseAndTouch(container, {
        element: vertexElement,
        getPosition() {
            return computePosition(base.element);
        }
    })

    dragging.start.subscribe(v => console.log(`Start: ${v}`))    
    dragging.move.subscribe(v => console.log(`Move: ${v}`))

    const draggingPositions = positionsFrom(dragging).pipe(
        map<Vector, VertexMovement>(p => [p, 0.3])
    )

    const positions = adjustToBounds(merge(
        options.positions,
        draggingPositions
    ), options.vertices.pipe(map(v => v.weight * 10), map(w => new Size(w, w))), sizesOf(container).pipe(map(asRect)), true)

    const additionalSubscriptions = [
        addPositioning(base, positions),
        () => base.remove()
    ]

    subscriptions.concat()

    return groupSubscriptions(...subscriptions, ...additionalSubscriptions)
}