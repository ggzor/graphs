import { Vector } from "../geometry/Vector";
import { TweenLite } from "gsap";

export type Movement = Vector | [Vector, number]

export const applyMovement = (targets: (position: Vector) => any) => <T>(element: T) =>
    (movement: Movement) => {
        if (movement instanceof Vector) {
            TweenLite.set(element, targets(movement))
        } else {
            const [position, duration] = movement
            TweenLite.to(element, duration, targets(position))
        }
    }