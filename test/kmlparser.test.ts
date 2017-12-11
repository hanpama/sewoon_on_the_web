import { parseKml } from '../src/kmz/kmlparser';

const xml = `
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">
   <Folder>
      <name>SewoonModel</name>
      <description>Created with &lt;a href="http://sketchup.com"&gt;SketchUp&lt;/a&gt;</description>
      <visibility>1</visibility>
      <LookAt>
         <heading>212.1510610649</heading>
         <tilt>57.22516789313</tilt>
         <latitude>37.56876307141</latitude>
         <longitude>126.9954717612</longitude>
         <range>1275.248657154</range>
         <altitude>639.6017432598</altitude>
      </LookAt>
      <Folder>
         <name>Tour</name>
         <Placemark>
            <name>Scene 1</name>
            <visibility>1</visibility>
            <LookAt>
               <heading>212.1510610649</heading>
               <tilt>57.22516789313</tilt>
               <latitude>37.56876307141</latitude>
               <longitude>126.9954717612</longitude>
               <range>1275.248657154</range>
               <altitude>639.6017432598</altitude>
            </LookAt>
         </Placemark>
      </Folder>
      <Placemark>
         <name>Model</name>
         <description />
         <Style id="default" />
         <Model>
            <altitudeMode>relativeToGround</altitudeMode>
            <Location>
               <latitude>37.56835818648</latitude>
               <longitude>126.9952583313</longitude>
               <altitude>0</altitude>
            </Location>
            <Orientation>
               <heading>358.7771453958</heading>
               <tilt>0</tilt>
               <roll>0</roll>
            </Orientation>
            <Scale>
               <x>1</x>
               <y>1</y>
               <z>1</z>
            </Scale>
            <Link>
               <href>models/untitled.dae</href>
            </Link>
         </Model>
      </Placemark>
   </Folder>
</kml>
`;

const kmlAst = {
  "type": "kml",
  "children": [
    {
      "type": "Folder",
      "children": [
        {
          "type": "LookAt",
          "children": [],
          "heading": "212.1510610649",
          "tilt": "57.22516789313",
          "latitude": "37.56876307141",
          "longitude": "126.9954717612",
          "range": "1275.248657154",
          "altitude": "639.6017432598"
        },
        {
          "type": "Folder",
          "children": [
            {
              "type": "Placemark",
              "children": [
                {
                  "type": "LookAt",
                  "children": [],
                  "heading": "212.1510610649",
                  "tilt": "57.22516789313",
                  "latitude": "37.56876307141",
                  "longitude": "126.9954717612",
                  "range": "1275.248657154",
                  "altitude": "639.6017432598"
                }
              ],
              "name": "Scene 1",
              "visibility": "1"
            }
          ],
          "name": "Tour"
        },
        {
          "type": "Placemark",
          "children": [
            {
              "type": "Style"
            },
            {
              "type": "Model",
              "children": [
                {
                  "type": "Location",
                  "children": [],
                  "latitude": "37.56835818648",
                  "longitude": "126.9952583313",
                  "altitude": "0"
                },
                {
                  "type": "Orientation",
                  "children": [],
                  "heading": "358.7771453958",
                  "tilt": "0",
                  "roll": "0"
                },
                {
                  "type": "Scale",
                  "children": [],
                  "x": "1",
                  "y": "1",
                  "z": "1"
                },
                {
                  "type": "Link",
                  "children": [],
                  "href": "models/untitled.dae"
                }
              ],
              "altitudeMode": "relativeToGround"
            }
          ],
          "name": "Model"
        }
      ],
      "name": "SewoonModel",
      "description": "Created with <a href=\"http://sketchup.com\">SketchUp</a>",
      "visibility": "1"
    }
  ]
};


test('kml conversion', async () => {
  const result = await parseKml(xml);
  expect(result).toEqual(kmlAst);
});
