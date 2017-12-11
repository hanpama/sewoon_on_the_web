// kmz 처리에 대해: https://developers.google.com/kml/documentation/kmzarchives?hl=ko
import { parseString } from 'xml2js';


const isObjectType = (key: string) => Boolean(/^[A-Z]/.exec(key));

function parseNodeRecursively(nodeObject: any) {
  /*
    nodeObject = {
      "$": {
        "xmlns": "http://www.opengis.net/kml/2.2",
        "xmlns:gx": "http://www.google.com/kml/ext/2.2"
      },
      "#name": "kml",
      "$$": [
        {
          "#name": "Folder",
          "$$": [
            {
              "_": "SewoonModel",
              "#name": "name"
            },
  */
  const node: any = { type: nodeObject['#name'] };
  if (nodeObject.$$) {
    node.children = [];
    nodeObject.$$.map((child: any) => {
      if (isObjectType(child['#name'])) {
        const childNode = parseNodeRecursively(child);
        node.children.push(childNode);
      } else {
        node[child['#name']] = child._;
      }
    })
  }

  return node;
}

export function parseKml(kmlString: string) {
  return new Promise((resolve, reject) => {
    parseString(
      kmlString,
      { explicitChildren: true, preserveChildrenOrder: true },
      (err, res) => {
        if (err) { reject(err); }
        const { kml } = res;
        resolve(parseNodeRecursively(kml));
      },
    );
  });
}
