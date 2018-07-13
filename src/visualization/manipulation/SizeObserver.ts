import { fromEventPattern, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Size } from '../geometry/Size';

import { ResizeSensor } from 'css-element-queries'
import { Rect } from '../geometry/Rect';

export function sizes(element: HTMLElement): Observable<Size> {
    function getElementSize(): Size {
        return new Size(element.clientWidth, element.clientHeight);
    }

    let observer;

    return fromEventPattern(
        h => observer = new ResizeSensor(element, h),
        h => observer.detach(h)).pipe(
            map(_ => getElementSize()),
            startWith(getElementSize())
        )
}

export function bounds(element: HTMLElement): Observable<Rect> {
    return sizes(element).pipe(
        map(_ => {
            const { left, top, width, height } = element.getBoundingClientRect()
            return new Rect(left, top, width, height)
        })
    )
}