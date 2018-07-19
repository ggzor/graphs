import { VisualBase } from "../VisualBase"
import * as SVG from 'svg.js'
import addVertexVisual from "./VertexVisual"
import addPositioning, { VertexMovement } from "./VertexPositioning"

import { Observable, Unsubscribable, of } from "rxjs"
import { map } from "rxjs/operators"
import { groupSubscriptions } from "../../../rx/SubscriptionUtils"

import { addDragging } from "./VertexDragging"
import { sizesOf } from "../../manipulation/SizeObserver"
import { Vertex } from "../../../core/Vertex"
import { asRect } from "../../geometry/Utils"

export interface VertexCreationOptions {
    parent: SVG.Container
    container: HTMLElement

    colors: Observable<string>
    vertices: Observable<Vertex>
    positions: Observable<VertexMovement>,

    canDrag: Observable<boolean>
}

export interface VertexCreationOutProperties extends Unsubscribable {
    isDragging: Observable<boolean>
}

export function createVertex(options: VertexCreationOptions): VertexCreationOutProperties {
    const { parent, container, colors, vertices, positions, canDrag } = options

    const base = new VisualBase(parent)

    const weights = vertices.pipe(map(vertex => vertex.weight))
    const bounds = sizesOf(container).pipe(map(asRect))

    const { visual: controlVisual, sizes, unsubscribe: u1 } = addVertexVisual({ base, colors, weights })
    const { isDragging, finalPositions } = addDragging({ base, controlVisual, container, positions, sizes, bounds, canDrag })
    const u2 = addPositioning(base, finalPositions)

    const subscriptions = [
        u1, u2,
        () => base.remove()
    ]

    return {
        isDragging,
        unsubscribe: () => groupSubscriptions(...subscriptions)
    }
}