import {Component} from "react";

import {shallowEqual} from "../utils";

const { Cartesian3, HorizontalOrigin, VerticalOrigin } = window.Cesium;


export default class CesiumBillboard extends Component {
    componentDidMount() {
        const {billboards} = this.props;

        if(billboards) {
            this.billboard = billboards.add({
                eyeOffset : new Cartesian3(0.0, 0.0, 0.0),
                horizontalOrigin : HorizontalOrigin.CENTER,
                verticalOrigin : VerticalOrigin.CENTER,
            });

        }
        
        this.updateIcon();
    }

    componentDidUpdate(prevProps) {
        if(!shallowEqual(this.props, prevProps)) {
            this.updateIcon();
        }
    }

    updateIcon() {
        const {image, scale = 1.0, lat, lon, alt, show = true, width} = this.props;

        if(this.billboard) {
            const newLocation = Cartesian3.fromDegrees(lon, lat, alt);

            this.billboard.position = newLocation;
            if(image) {
                this.billboard.image = image;
            }
            this.billboard.show = show;
            this.billboard.scale = scale;

            if(width) {
                this.billboard.width = width;
            }
        }
    }

    componentWillUnmount() {
        const {billboards} = this.props;

        if(billboards && !billboards.isDestroyed() && this.billboard) {
            billboards.remove(this.billboard);
        }
    }

    render() {
        return null;
    }
}
