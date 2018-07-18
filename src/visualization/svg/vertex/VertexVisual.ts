import { VisualBase } from "../VisualBase"
import { TweenLite, Back } from "gsap"

import { Observable, Subscription } from "rxjs"
import { groupSubscriptions } from "../../../rx/SubscriptionUtils";

import { Defaults } from "../../Defaults"

export default function addVertexVisual(
    visual: VisualBase,
    vertexVisualId: string,
    colors: Observable<string>,
    weights: Observable<number>): Subscription {
    const svg = visual.group.circle(0).fill(Defaults.vertexFill).id(vertexVisualId)
    const vertex = document.getElementById(vertexVisualId)

    const subscriptions = [
        colors.subscribe(color =>
            TweenLite.to(vertex, 0.5, { fill: color })
        ),
        weights.subscribe(weight =>
            TweenLite.to(vertex, 0.4, { attr: { r: weight * 5 }, ease: Back.easeOut })
        ),
        () => visual.group.removeElement(svg)
    ]

    return groupSubscriptions(...subscriptions)
}