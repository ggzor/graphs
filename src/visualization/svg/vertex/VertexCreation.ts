import { VisualBase } from "../VisualBase"
import * as SVG from 'svg.js'
import addDragging from "./VertexDragging"
import addPositioning from "./VertexPositioning"
import addSelection from "./VertexSelection";
import addVertexVisual from "./VertexVisual"

import { Observable, Unsubscribable, merge } from "rxjs"
import { map, startWith, tap } from "rxjs/operators"
import { groupSubscriptions } from "../../../rx/SubscriptionUtils"

import { sizesOf } from "../../manipulation/SizeObserver"
import { Vertex } from "../../../core/Vertex"
import { asRect } from "../../geometry/Utils"
import { Movement } from "../../manipulation/Movement";
import { IVisual } from "../../IVisual";
import { tappingOf } from "../../manipulation/Tapping";
import { Register } from "../../../rx/Register";

export interface VertexCreationOptions {
    parent: SVG.Container
    container: HTMLElement

    colors: Observable<string>
    vertices: Observable<Vertex>
    positions: Observable<Movement>

    canDrag: Observable<boolean>

    selected: Observable<boolean>

    registerSelection: Register<Observable<boolean>, Observable<boolean>>
}

export interface VertexCreationOutProperties extends Unsubscribable {
    controlVisual: IVisual
    isDragging: Observable<boolean>
    isSelected: Observable<boolean>
    finalPositions: Observable<Movement>
}

export default function createVertex(options: VertexCreationOptions): VertexCreationOutProperties {
    const { parent, container, colors,
        vertices, positions, canDrag, selected, registerSelection } = options

    const base = new VisualBase(parent)

    const weights = vertices.pipe(map(vertex => vertex.weight))
    const bounds = sizesOf(container).pipe(map(asRect))

    const { visual: controlVisual, svg: vertex, sizes, unsubscribe: u1 } = addVertexVisual({ base, colors, weights })
    const { isDragging, finalPositions } = addDragging({ base, controlVisual, container, positions, sizes, bounds, canDrag })
    const u2 = addPositioning(base, finalPositions)

    const tapping = tappingOf(controlVisual.element).pipe(map(_ => true))
    const finalSelected = registerSelection.register(merge(selected, tapping).pipe(startWith(false)))
    const { isSelected, unsubscribe: u3 } = addSelection({ base, sizes, vertex, isSelected: finalSelected })

    const subscriptions = [
        u1, u2, u3,
        () => base.remove(),
        () => registerSelection.unregister(tapping)
    ]

    return {
        controlVisual, isDragging, finalPositions, isSelected,
        unsubscribe: () => groupSubscriptions(...subscriptions)
    }
}