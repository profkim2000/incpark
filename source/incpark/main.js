import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';

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

// osm 레이어를 만든다.
const osmLayer = new TileLayer
(
  {
    source: new OSM()
  }
);

const map = new Map({
  target: 'map',
  layers: [osmLayer, wmsLayer],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});
