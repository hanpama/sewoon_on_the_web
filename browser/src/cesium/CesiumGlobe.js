import React, {Component} from "react";

import CesiumProjectContents from "./CesiumProjectContents";
import CesiumClickHandler from "./CesiumClickHandler";
import CesiumCameraManager from "./CesiumCameraManager";

const BING_MAPS_URL = "//dev.virtualearth.net";
const BING_MAPS_KEY = "ApDPY15x9lCXO5Hw89M1G5Q84_BlKalPbjor8GvKGj2UAnVtzlT5UT-zrylU1e48";
const STK_TERRAIN_URL = "//assets.agi.com/stk-terrain/world";


const { Viewer, BingMapsImageryProvider, CesiumTerrainProvider } = window.Cesium;


export default class CesiumGlobe extends Component {
    state = {
        viewerLoaded : false,
    }

    componentDidMount() {
        const imageryProvider = this.props.imageryProvider;

        const terrainProvider = new CesiumTerrainProvider({
            url : STK_TERRAIN_URL
        });

        this.viewer = new Viewer(this.cesiumContainer, {
            animation : false,
            baseLayerPicker : false,
            fullscreenButton : false,
            geocoder : false,
            homeButton : false,
            infoBox : false,
            sceneModePicker : false,
            selectionIndicator : true,
            timeline : false,
            navigationHelpButton : false,
            scene3DOnly : true,
            imageryProvider,
            terrainProvider,
        });

        // Force immediate re-render now that the Cesium viewer is created
        this.setState({viewerLoaded : true}); // eslint-disable-line react/no-did-mount-set-state
        if (this.props.onload) {
          this.props.onload(this.viewer);
        }
    }

    componentWillUnmount() {
        if(this.viewer) {
            this.viewer.destroy();
        }
    }

    renderContents() {
        const {viewerLoaded} = this.state;
        let contents = null;

        if(viewerLoaded) {
            const {scene} = this.viewer;
            const {icons, labels, polylines, onLeftClick, flyToLocation} = this.props;

            contents = (
                <span>
                    <CesiumProjectContents
                        scene={scene}
                        icons={icons}
                        labels={labels}
                        polylines={polylines}
                    />
                    <CesiumClickHandler
                        scene={scene}
                        onLeftClick={onLeftClick}
                    />
                    <CesiumCameraManager
                        camera={scene.camera}
                        flyToLocation={flyToLocation}
                    />
                </span>
            );
        }

        return contents;
    }

    render() {
        const containerStyle = {
            width: '100%',
            height: '100%',
            display : "flex",
            alignItems : "stretch",
        };

        const widgetStyle = {
            flexGrow : 2
        }

        const contents = this.renderContents()

        return (
            <div className="cesiumGlobeWrapper" style={containerStyle}>
                <div
                    className="cesiumWidget"
                    ref={ element => this.cesiumContainer = element }
                    style={widgetStyle}
                >
                    {contents}
                </div>
            </div>
        );
    }
}