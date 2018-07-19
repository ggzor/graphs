import { VisualBase } from "../VisualBase"
import { IVisual } from "../../IVisual";
import { TweenLite, Back } from "gsap"
import { computePosition } from "../../animation/GSAPUtils";

import { Observable, Unsubscribable } from "rxjs"
import { map } from "rxjs/operators";
import { groupSubscriptions } from "../../../rx/SubscriptionUtils";

import { Size } from "../../geometry/Size";

import { Defaults } from "../../Defaults"

export interface VertexVisualOptions {
    base: VisualBase,
    colors: Observable<string>,
    weights: Observable<number>
}

export interface VertexVisualOutProperties extends Unsubscribable {
    visual: IVisual,
    sizes: Observable<Size>
}

export default function addVertexVisual(options: VertexVisualOptions): VertexVisualOutProperties {
    const { base, colors, weights } = options

    const svg = base.group.circle(0).fill(Defaults.vertexFill)
    const vertex = document.getElementById(svg.id())

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
        () => base.group.removeElement(svg)
    ]

    return {
        visual: controlVisual,
        sizes: weights.pipe(map(w => w * 10), map(w => new Size(w, w))),
        unsubscribe: () => groupSubscriptions(...subscriptions)
    }
}