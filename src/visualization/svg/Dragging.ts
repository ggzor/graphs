import { Observable } from "rxjs"
import { map, windowToggle, withLatestFrom, flatMap } from "rxjs/operators"

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