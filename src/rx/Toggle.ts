import { Unsubscribable, Observable, Subject, Subscription, identity, merge } from "rxjs";
import { filter, mapTo, withLatestFrom } from "rxjs/operators";
import { Register } from "./Register";

export class Toggle implements Unsubscribable, Register<Observable<boolean>, Observable<boolean>> {
    private readonly observables: Observable<boolean>[] = []
    private readonly subjects: Subject<boolean>[] = []
    private subscription = new Subscription()

    constructor(readonly isWorking: Observable<boolean>) { }

    register(switchRequester: Observable<boolean>): Observable<boolean> {
        const sink = new Subject<boolean>()

        this.resetting(() => {
            this.observables.push(switchRequester)
            this.subjects.push(sink)
        })

        return sink
    }

    unregister(switchRequester: Observable<boolean>): void {
        this.resetting(() => {
            const index = this.observables.indexOf(switchRequester)
            this.observables.splice(index, 1)
            this.subjects.splice(index, 1)
        })
    }

    private resetting(action: () => void): void {
        this.unsubscribe()
        action()
        this.rebuildSubscription()
    }

    unsubscribe(): void {
        this.subscription.unsubscribe()
    }

    private rebuildSubscription(): void {
        const indexed = this.observables.map((o, i) => o.pipe(filter(identity), mapTo(i)))

        this.subscription = merge(...indexed).pipe(withLatestFrom(this.isWorking)).subscribe(t => {
            const [i, applyLogic] = t
            if (applyLogic)
                this.subjects.forEach((sub, j) => sub.next(i == j))
            else
                this.subjects[i].next(true)
        })
    }
}