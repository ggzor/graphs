import { VisualBase } from "../VisualBase"
import { Observable, Subscription } from "rxjs"
import { Movement, applyMovement } from "../../manipulation/Movement";

export default function addPositioning(visual: VisualBase, positions: Observable<Movement>): Subscription {
    const movement = applyMovement(position => ({ x: position.x, y: position.y }))(visual.element)
    return positions.subscribe(movement)
}