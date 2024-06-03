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

// view와의 상호작용을 위해 
import { Select, defaults } from 'ol/interaction';
import { pointerMove } from 'ol/events/condition';

// 테스트 환경과 실제 tomcat 서버에 올렸을 때의 url이 다르니 g_url 변수를 이용한다.
const g_url = "http://localhost:42888";

/**
 * CQL 필터 만들기. 모든 CQL은 이 함수를 통한다.
 */
function makeFilter()
{
  let filter = "";

  //filter = "name='용담공원'"  // 용담공원을 찾는다.

  return filter;
}


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
          "LAYERS": 'incpark:parks',
          "CQL_FILTER": makeFilter()
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
    url: encodeURI(g_url + "/geoserver/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=incpark:parks&outputFormat=application/json&CQL_FILTER=" + makeFilter() )
  }
);


// 위에서 wfs로 받아온 벡터 소스를 openLayers의 vector layer에 올린다.
// 더 잘 보이게 스타일도 고친다.
const wfsLayer = new VectorLayer
(
  {
    source: wfsSource, 
    style: new Style
    (
       {
         image: new Circle
         (
           {
             stroke: new Stroke
             (
               {
                 color: 'rgba(0, 0, 255, 1.0)',
                 width: 3
               }
             ),
             radius: 5, 
             fill: new Fill
             (
               {
                 color: 'rgba(255, 0, 255, 0.5)'
               }
             )

           }
         ), 

         stroke: new Stroke
         (
           {
             color: 'rgba(0, 0, 255, 1.0)',
             width: 5
           }
         ),

         fill: new Fill
         (
           {
             color: 'rgba(0, 0, 255, 0.5)'
           }
         )
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


// 마우스가 WFS 점 위로 올라갈 때(hover) 처리
const mouseHoverSelect = new Select
(
  {
    condition: pointerMove,
    style: new Style
    (
      {
        image: new Circle
        (
          {
            stroke: new Stroke
            (
              {
                color: 'rgba(255, 0, 0, 1.0)',
                width: 5
              }
            ),
            radius: 8, 
            fill: new Fill
            (
              {
                color: 'rgba(255, 0, 255, 0.5)'
              }
            )

          }
        ), 

        stroke: new Stroke
        (
          {
            color: 'rgba(0, 0, 255, 1.0)',
            width: 5
          }
        ),

        fill: new Fill
        (
          {
            color: 'rgba(0, 0, 255, 0.5)'
          }
        )
      }
   )
  }
);

const map = new Map({
  target: 'map',
  layers: [osmLayer, wfsLayer],
  view: new View({
    center: [14100008.61632484, 4496815.790027254],
    zoom: 14
  }),  
  interactions: defaults().extend([mouseHoverSelect])
});
