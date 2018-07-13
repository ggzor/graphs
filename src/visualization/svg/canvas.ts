import * as SVG from 'svg.js'

export function createSVGCanvas(document: Document): SVG.Doc {
    const rootName = 'root';

    const main = document.createElement('div');

    main.id = rootName;
    main.style.minHeight = '100%'

    document.body.appendChild(main);
    const svg = SVG(rootName)
    svg.style('height: 100%; position: absolute;')

    return svg;
}