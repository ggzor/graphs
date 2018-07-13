import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { tagFirst } from "../../rx/AdditionalOperators";

import { TweenLite } from "gsap";

import { Vector } from "../geometry/Vector";

import { IVisual } from "../IVisual";

export function position(
    visual: IVisual,
    positions: Observable<[Vector, number]>
): Subscription {
    return positions.pipe(
        tagFirst()
    ).subscribe(t => {
        const [[position, duration], isFirst] = t
        const targets = { x: position.x, y: position.y };

        const moveImmediately = () => TweenLite.set(visual.element, targets);
        const moveFastly = () => TweenLite.to(visual.element, duration * 0.4, targets)
        const moveSlowly = () => TweenLite.to(visual.element, duration, targets)

        if (isFirst)
            moveImmediately()
        else {
            const diff = visual.getPosition().minus(position);
            const tolerance = 10 * 10

            if (diff.squaredLength() < tolerance)
                moveFastly()
            else
                moveSlowly()
        }
    })
}

export function positionWithConstantDuration(
    visual: IVisual,
    positions: Observable<Vector>,
    duration: number = 0.5
): Subscription {
    return position(visual, positions.pipe(
        map<Vector, [Vector, number]>(v => [v, duration])
    ))
}