import { Subscription, TeardownLogic } from "rxjs";

export function groupSubscriptions(...subscriptions: TeardownLogic[]) {
    const subscription = new Subscription()

    subscriptions.forEach(s => subscription.add(s))

    return subscription
}