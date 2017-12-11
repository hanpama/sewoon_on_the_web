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
        const imageryProvider = new BingMapsImageryProvider({
            url : BING_MAPS_URL,
            key : BING_MAPS_KEY,
        });

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

        const czml = [{
            "id" : "document",
            "name" : "Basic CZML billboard and label",
            "version" : "1.0"
        },
        {
            "id" : "some-unique-id",
            "name" : "Label Example",
            "description" : "<p><a href='http://www.agi.com' target='_blank'>Analytical Graphics, Inc.</a> (AGI) founded Cesium.</p>",
            "billboard" : {
                // "image" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACvSURBVDhPrZDRDcMgDAU9GqN0lIzijw6SUbJJygUeNQgSqepJTyHG91LVVpwDdfxM3T9TSl1EXZvDwii471fivK73cBFFQNTT/d2KoGpfGOpSIkhUpgUMxq9DFEsWv4IXhlyCnhBFnZcFEEuYqbiUlNwWgMTdrZ3JbQFoEVG53rd8ztG9aPJMnBUQf/VFraBJeWnLS0RfjbKyLJA8FkT5seDYS1Qwyv8t0B/5C2ZmH2/eTGNNBgMmAAAAAElFTkSuQmCC",
                "scale" : 1.5
            },
            "label" : {
                // "fillColor" : {
                //     "rgba" : [255, 255, 255, 255]
                // },
                "font" : "12pt Courier",
                "horizontalOrigin" : "CENTER",
                "pixelOffset" : {
                    "cartesian2" : [8, 0]
                },
                "style" : "FILL",
                "text" : "세운상가",
                "showBackground" : true,
                "backgroundColor" : {
                    "rgba" : [0, 0, 0, 0.8]
                }
            },
            "position" : {
                "cartographicDegrees": [
                    126.9957624,
                    37.5698943,
                    0,
                ]
            },

        },
        // {
        //     "id" : "point 1",
        //     "name": "point",
        //     "position" : {
        //         "cartographicDegrees": [
        //             126.9957624,
        //             37.5698943,
        //             0,
        //         ]
        //     },
        //     "point": {
        //         "color": {
        //             "rgba": [255, 255, 255, 255]
        //         },
        //         // "outlineColor": {
        //         //     "rgba": [255, 0, 0, 255]
        //         // },
        //         // "outlineWidth" : 4,
        //         "pixelSize": 20
        //     }
        // },
        // {
        //     "id" : "point 1",
        //     "name": "point",
        //     "position" : {
        //         "cartographicDegrees": [
        //             126.9957624,
        //             36.5698943,
        //             0,
        //         ]
        //     },
        //     "point": {
        //         "color": {
        //             "rgba": [255, 255, 255, 255]
        //         },
        //         "outlineColor": {
        //             "rgba": [255, 0, 0, 255]
        //         },
        //         "outlineWidth" : 4,
        //         "pixelSize": 20
        //     }
        // }
    ];

        this.viewer.dataSources.add(window.Cesium.CzmlDataSource.load(czml));
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