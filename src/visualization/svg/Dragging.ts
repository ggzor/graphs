import { Observable, Timestamp, combineLatest } from "rxjs"
import { timestamp, startWith, map } from "rxjs/operators"
import { when } from "../../rx/AdditionalOperators";

import { Vector } from "../geometry/Vector"

import { IDraggable } from "../manipulation/IDraggable"

export function positionsFrom(draggable: IDraggable): Observable<Vector> {
    const startTimestamped = draggable.start.pipe(timestamp())
    const endTimestamped = draggable.end.pipe(timestamp(), startWith<Timestamp<Vector>>(null))

    const shouldMove = combineLatest(startTimestamped, endTimestamped)
        .pipe(
            map(l => {
                const [press, release] = l

                if (release != null)
                    return press.timestamp > release.timestamp
                else
                    return press != null
            }),
            startWith(false)
        )

    return combineLatest(draggable.start, draggable.move).pipe(
        when(shouldMove),
        map(m => m[1].minus(m[0]))
    )
}