import { VisualBase } from "../VisualBase"
import { IVisual } from "../../IVisual"
import { Observable, Subscription, merge } from "rxjs"
import { groupSubscriptions } from "../../../rx/SubscriptionUtils"
import { Size } from "../../geometry/Size"
import { TweenLite, Back } from "gsap"
import { Defaults } from "../../Defaults"
import * as SVG from "svg.js"
import { map, distinctUntilChanged, startWith, tap } from "../../../../node_modules/rxjs/operators"
import { when } from "../../../rx/AdditionalOperators"
import { tappingOf } from "../../manipulation/Tapping";

export interface VertexSelectionOptions {
    base: VisualBase
    controlVisual: IVisual
    vertex: SVG.Circle
    sizes: Observable<Size>

    canSelect: Observable<boolean>
    setSelected: Observable<boolean>
}

export default function addSelection(options: VertexSelectionOptions): Subscription {
    const { base, controlVisual, vertex, sizes, canSelect, setSelected } = options

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

    const clicks = tappingOf(controlVisual.element).pipe(
        map(_ => true),
        when(canSelect)
    )
    const selecting = merge(clicks, setSelected).pipe(
        distinctUntilChanged(),
        startWith(false)
    )

    const subscriptions = [
        selecting.subscribe(isSelected => {
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

    return groupSubscriptions(...subscriptions)
}