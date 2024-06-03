import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

// geoserver에서 WMS 방식으로 가져오기 위해
import TileWMS from 'ol/source/TileWMS';

// geoserver에서 WFS 방식으로 가져오기 위해
import {Vector as VectorLayer} from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import { Style } from 'ol/style';
import { Circle } from 'ol/style';
import { Stroke } from 'ol/style';
import { Fill } from 'ol/style';

// 테스트 환경과 실제 tomcat 서버에 올렸을 때의 url이 다르니 g_url 변수를 이용한다.
const g_url = "http://localhost:42888";

// geoserver에서 WMS 방식으로 받아온다.
const wmsLayer = new TileLayer
(
  {
    visible: true,
    source: new TileWMS
    (
      {
        url: g_url + '/geoserver/incpark/wms',
        params: 
        {
          'FORMAT': 'image/png',
          'VERSION': '1.1.0',
          tiled: true,
          "STYLES": '',
          "LAYERS": 'incpark:parks'  // geoserver에서 postgreSQL의 orak 테이블과 연결하도록 정의한 레이어.
        }
      }
    )
  }
);

// geoserver에서 WFS 방식으로 자료를 받아와 openLayers에서 소스로 사용하도록 한다.
const wfsSource = new VectorSource
(
  {
    format: new GeoJSON(),
    url: encodeURI(g_url + "/geoserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=incpark:parks&outputFormat=application/json")
  }
);


// 위에서 wfs로 받아온 벡터 소스를 openLayers의 vector layer에 올린다.
const wfsLayer = new VectorLayer
(
  {
     source: wfsSource
  }
);


// osm 레이어를 만든다.
const osmLayer = new TileLayer
(
  {
    source: new OSM()
  }
);

const map = new Map({
  target: 'map',
  layers: [osmLayer, wfsLayer],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});
