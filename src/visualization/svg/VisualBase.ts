import * as SVG from 'svg.js'

export class VisualBase {
    element: HTMLElement
    group: SVG.G

    constructor(readonly parent: SVG.Container) {
        this.group = parent.group()
        this.element = document.getElementById(this.group.id())
    }

    remove(): void {
        this.parent.removeElement(this.group)
    }
}