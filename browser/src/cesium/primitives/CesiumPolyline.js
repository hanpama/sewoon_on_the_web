import {Component} from "react";

import {shallowEqual} from "../utils";

const {
    Cartographic,
    Color,
    Ellipsoid,
    Material,
} = window.Cesium;

export default class CesiumPolyline extends Component {
    componentDidMount() {
        const {polylines} = this.props;

        if(polylines) {
            this.polyline = polylines.add({
                positions : [],
                width : 2,
                material : Material.fromType('Color', {
                    color: Color.BLUE
                }),
            });


            this.updatePolyline();
        }
    }

    componentWillUnmount() {
        const {polylines} = this.props;

        if(polylines && !polylines.isDestroyed() && this.polyline) {
            polylines.remove(this.polyline);
        }
    }

    componentDidUpdate(prevProps) {
        if(!shallowEqual(prevProps, this.props)) {
            this.updatePolyline();
        }
    }

    updatePolyline() {
        const {coords, loop, color = "blue" } = this.props;

        if(this.polyline) {
            const cartographics = coords.map(coord =>
                Cartographic.fromDegrees(coord.lon, coord.lat, coord.alt)
            );

            const cartesians = Ellipsoid.WGS84.cartographicArrayToCartesianArray(cartographics);

            const colorValue = Color.fromCssColorString(color);

            this.polyline.positions = cartesians;
            this.polyline.loop = !!loop;
            this.polyline.material.uniforms.color = colorValue;
        }
    }

    render() {
        return null;
    }
}