import { Observable, pipe, UnaryFunction, zip } from "rxjs";
import { map, filter, withLatestFrom } from "rxjs/operators";

export function when<T>(condition: Observable<boolean>): UnaryFunction<Observable<T>, Observable<T>> {
    return pipe(
        withLatestFrom(condition),
        filter(t => t[1]),
        map(t => t[0])
    )
}

export function zipWithIndex<T>(): UnaryFunction<Observable<T>, Observable<[T, number]>> {
    return pipe(
        map<T, [T, number]>((v, i) => [v, i])
    )
}

export function tagFirst<T>(): UnaryFunction<Observable<T>, Observable<[T, boolean]>> {
    return pipe(
        map<T, [T, boolean]>((v, i) => [v, i == 0])
    )
}