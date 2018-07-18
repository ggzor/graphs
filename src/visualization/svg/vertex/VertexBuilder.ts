import { VisualBase } from "../VisualBase"
import * as SVG from 'svg.js'
import addVertexVisual from "./VertexVisual"
import { VertexMovement } from "./VertexPositioning"

import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { groupSubscriptions } from "../../../rx/SubscriptionUtils"

import { Vertex } from "../../../core/Vertex"

export interface VertexCreationOptions {
    parent: SVG.Container
    container: HTMLElement
    colors: Observable<string>
    vertices: Observable<Vertex>
    positions: Observable<VertexMovement>,
    canDrag: Observable<boolean>
}

export function createVertex(options: VertexCreationOptions) {
    const { parent, container, colors, vertices, positions, canDrag } = options

    const base = new VisualBase(parent)

    const weights = vertices.pipe(map(vertex => vertex.weight))

    const subscriptions = [
        addVertexVisual({ base, container, colors, weights, positions, canDrag }),
        () => base.remove()
    ]

    return groupSubscriptions(...subscriptions)
}