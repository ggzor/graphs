import { VisualBase } from "../VisualBase"
import * as SVG from 'svg.js'
import addDragging from "./VertexDragging"
import addPositioning from "./VertexPositioning"
import addSelection from "./VertexSelection";
import addVertexVisual from "./VertexVisual"

import { Observable, Unsubscribable } from "rxjs"
import { map } from "rxjs/operators"
import { groupSubscriptions } from "../../../rx/SubscriptionUtils"

import { sizesOf } from "../../manipulation/SizeObserver"
import { Vertex } from "../../../core/Vertex"
import { asRect } from "../../geometry/Utils"
import { Movement } from "../../manipulation/Movement";

export interface VertexCreationOptions {
    parent: SVG.Container
    container: HTMLElement

    colors: Observable<string>
    vertices: Observable<Vertex>
    positions: Observable<Movement>,

    canDrag: Observable<boolean>

    canSelect: Observable<boolean>
    setSelected: Observable<boolean>
}

export interface VertexCreationOutProperties extends Unsubscribable {
    isDragging: Observable<boolean>
    finalPositions: Observable<Movement>
}

export default function createVertex(options: VertexCreationOptions): VertexCreationOutProperties {
    const { parent, container, colors,
        vertices, positions, canDrag, canSelect, setSelected } = options

    const base = new VisualBase(parent)

    const weights = vertices.pipe(map(vertex => vertex.weight))
    const bounds = sizesOf(container).pipe(map(asRect))

    const { visual: controlVisual, svg: vertex, sizes, unsubscribe: u1 } = addVertexVisual({ base, colors, weights })
    const { isDragging, finalPositions } = addDragging({ base, controlVisual, container, positions, sizes, bounds, canDrag })
    const u2 = addPositioning(base, finalPositions)
    const u3 = addSelection({ base, sizes, vertex, controlVisual, canSelect, setSelected })

    const subscriptions = [
        u1, u2, u3,
        () => base.remove()
    ]

    return {
        isDragging, finalPositions,
        unsubscribe: () => groupSubscriptions(...subscriptions)
    }
}