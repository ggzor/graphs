import { VisualBase } from "../VisualBase"
import { TweenLite, Back } from "gsap"
import { computePosition } from "../../animation/GSAPUtils";

import { Observable, Subscription } from "rxjs"
import { groupSubscriptions } from "../../../rx/SubscriptionUtils";

import { Defaults } from "../../Defaults"
import { nextId } from "./VertexNaming";

import { addDragging } from "./VertexDragging";
import { VertexMovement } from "./VertexPositioning";

export interface VertexVisualCreationOptions {
    base: VisualBase,
    container: HTMLElement,
    colors: Observable<string>,
    weights: Observable<number>,
    positions: Observable<VertexMovement>
    canDrag: Observable<boolean>
}

export default function addVertexVisual(options: VertexVisualCreationOptions): Subscription {
    const { base, container, colors, weights, positions, canDrag } = options

    const vertexName = `v${nextId()}`
    const svg = base.group.circle(0).fill(Defaults.vertexFill).id(vertexName)
    const vertex = document.getElementById(vertexName)

    const controlVisual = {
        element: vertex,
        getPosition() { return computePosition(base.element); }
    }

    const subscriptions = [
        colors.subscribe(color =>
            TweenLite.to(vertex, 0.5, { fill: color })
        ),
        weights.subscribe(weight =>
            TweenLite.to(vertex, 0.4, { attr: { r: weight * 5 }, ease: Back.easeOut })
        ),
        addDragging({ base, controlVisual, container, weights, positions, canDrag }),
        () => base.group.removeElement(svg)
    ]

    return groupSubscriptions(...subscriptions)
}