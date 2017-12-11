import React, {Component} from "react";

import CesiumBillboard from "./primitives/CesiumBillboard";
import CesiumLabel from "./primitives/CesiumLabel";
import CesiumPolyline from "./primitives/CesiumPolyline";

const { BillboardCollection, LabelCollection, PolylineCollection } = window.Cesium;

export class CesiumProjectContents extends Component {
    constructor(props) {
        super(props);

        this.billboards = new BillboardCollection();
        this.labels = new LabelCollection();
        this.polylines = new PolylineCollection();

        this.primitiveCollections = [this.billboards, this.labels, this.polylines];

        const {scene} = props;

        if(scene) {
            this.primitiveCollections.forEach(primitiveCollection => scene.primitives.add(primitiveCollection));
        }
    }

    componentWillUnmount() {

        this.primitiveCollections.forEach(primitiveCollection => {
            if(!primitiveCollection.isDestroyed()) {
                primitiveCollection.destroy();
            }
        });

        const {scene} = this.props;

        if(scene && !scene.isDestroyed() && scene.primitives) {
            this.primitiveCollections.forEach(primitiveCollection => scene.primitives.remove(primitiveCollection));
        }
    }

    render() {
        const {icons = [], labels = [], polylines = []} = this.props;

        const renderedBillboards = icons.map( (icon, index) =>
            <CesiumBillboard
                {...icon}
                billboards={this.billboards}
                key={index}
            />
        );

        const renderedLabels = labels.map( (label, index) =>
            <CesiumLabel
                {...label}
                labels={this.labels}
                key={index}
            />
        );

        const renderedPolylines = polylines.map( (polyline, index) =>
            <CesiumPolyline
                coords={polyline}
                polylines={this.polylines}
                key={index}
            />
        );


        return (
            <span>
                {renderedBillboards}
                {renderedLabels}
                {renderedPolylines}
            </span>
        );
    }
}


export default CesiumProjectContents;
