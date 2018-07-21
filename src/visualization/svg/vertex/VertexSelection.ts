import * as SVG from "svg.js"
import { VisualBase } from "../VisualBase"
import { TweenLite, Back } from "gsap"
import { Defaults } from "../../Defaults"

import { Observable, Unsubscribable } from "rxjs"
import { groupSubscriptions } from "../../../rx/SubscriptionUtils"

import { Size } from "../../geometry/Size"

export interface VertexSelectionOptions {
    base: VisualBase
    vertex: SVG.Circle
    sizes: Observable<Size>
    isSelected: Observable<boolean>
}

export interface VertexSelectionOutProperties extends Unsubscribable {
    isSelected: Observable<boolean>
}

export default function addSelection(options: VertexSelectionOptions): VertexSelectionOutProperties {
    const { base, vertex, sizes, isSelected } = options

    const svg = base.group.circle(0)
        .fill("#00000000")
        .stroke({
            color: Defaults.selectedVertexFill,
            dasharray: "10 10",
            width: 2.5

        }).cx(0).cy(0)
    svg.after(vertex)
    const element = document.getElementById(svg.id())

    TweenLite.set(element, { scale: 1.2, opacity: 0, transformOrigin: "50% 50%" })

    const subscriptions = [
        isSelected.subscribe(isSelected => {
            if (isSelected)
                TweenLite.to(element, 0.3, { scale: 1, opacity: 1 })
            else
                TweenLite.to(element, 0.3, { scale: 1.2, opacity: 0 })

        }),
        sizes.subscribe(size => {
            TweenLite.to(element, 1, {
                attr: { r: (size.width / 2) + 7 },
                ease: Back.easeOut.config(1.2)
            })
        })
    ]

    return {
        isSelected,
        unsubscribe: () => groupSubscriptions(...subscriptions).unsubscribe()
    }
}