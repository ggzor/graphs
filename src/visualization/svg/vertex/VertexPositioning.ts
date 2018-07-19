import { VisualBase } from "../VisualBase"
import { TweenLite } from "gsap"
import { Observable, Subscription } from "rxjs"
import { Vector } from "../../geometry/Vector"

export type VertexMovement = Vector | [Vector, number]

export default function addPositioning(visual: VisualBase, positions: Observable<VertexMovement>): Subscription {
    return positions.subscribe(movement => {
        const targets = (positions: Vector) => ({ x: positions.x, y: positions.y })

        if (movement instanceof Vector) {
            TweenLite.set(visual.element, targets(movement))
        } else {
            const [position, duration] = movement
            TweenLite.to(visual.element, duration, targets(position))
        }
    })
}