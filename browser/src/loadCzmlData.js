const { Cesium } = window;

export function loadCzmlData(id) {
  return Cesium.CzmlDataSource.load(`${process.env.PUBLIC_URL}/data/czml/${id}.czml`);
}

