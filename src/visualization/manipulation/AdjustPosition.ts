import { Observable, combineLatest } from "rxjs"
import { map } from "rxjs/operators"

import { Rect } from "../geometry/Rect"
import { Vector } from "../geometry/Vector"
import { Size } from "../geometry/Size"
import { Movement } from "./Movement"

export function adjustToBounds(
    positions: Observable<Movement>,
    sizes: Observable<Size>,
    bounds: Observable<Rect>,
    positionIsFromCenter: boolean = false): Observable<Movement> {
    return combineLatest(positions, sizes, bounds).pipe(
        map(t => {
            const [movement, size, bounds] = t
            const position = movement instanceof Vector ? movement : movement[0]
            const adjusted = adjustPosition(position, size, bounds, positionIsFromCenter)

            if (movement instanceof Vector)
                return adjusted
            else
                return <Movement>[adjusted, movement[1]]
        })
    )
}

function adjustPosition(position: Vector, size: Size, bounds: Rect, positionIsFromCenter: boolean) {
    const leftCorrection = positionIsFromCenter ? size.width / 2 : 0
    const rightCorrection = positionIsFromCenter ? size.width / 2 : size.width

    const topCorrection = positionIsFromCenter ? size.height / 2 : 0
    const bottomCorrection = positionIsFromCenter ? size.height / 2 : size.height

    const x = position.x - leftCorrection < bounds.left()
        ? bounds.left() + leftCorrection
        : position.x + rightCorrection > bounds.right()
            ? bounds.right() - rightCorrection
            : position.x
    const y = position.y - topCorrection < bounds.top()
        ? bounds.top() + topCorrection
        : position.y + bottomCorrection > bounds.bottom()
            ? bounds.bottom() - bottomCorrection
            : position.y

    return new Vector(x, y)
}
