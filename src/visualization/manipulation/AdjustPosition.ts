import { Observable, combineLatest } from "rxjs"
import { map } from "rxjs/operators"

import { Rect } from "../geometry/Rect"
import { Vector } from "../geometry/Vector"
import { Size } from "../geometry/Size"

export function adjustToBounds(
    positions: Observable<Vector>,
    sizes: Observable<Size>,
    bounds: Observable<Rect>,
    positionIsFromCenter: boolean = false): Observable<Vector> {
    return combineLatest(positions, sizes, bounds).pipe(
        map(t => {
            const [position, size, bounds] = t

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
        })
    )
}