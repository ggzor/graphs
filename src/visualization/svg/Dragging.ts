import { Observable, combineLatest } from "rxjs"
import { map, windowToggle, withLatestFrom, flatMap, startWith, timestamp } from "rxjs/operators"

import { Vector } from "../geometry/Vector"

import { IDraggable } from "../manipulation/IDraggable"

export function positionsFrom(draggable: IDraggable): Observable<Vector> {
    return draggable.move.pipe(
        withLatestFrom(draggable.start),
        windowToggle(draggable.start, _ => draggable.end),
        flatMap(w => w),
        map(m => m[0].minus(m[1]))
    )
}

export function isDragging({ start, end }: IDraggable) {
    return combineLatest([start, end].map(o => o.pipe(timestamp())))
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
}