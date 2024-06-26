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
import { pointerMove, click } from 'ol/events/condition';

// 팝업창을 위해
import { Overlay} from 'ol';

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


// 마우스가 점을 클릭하면 초록색으로 보여주고 굵게 표시한다.
const mouseClickSelect = new Select
(
  {
    condition: click,
    style: new Style
    (
      {
        image: new Circle
        (
          {
            stroke: new Stroke
            (
              {
                color: 'rgba(0, 255, 0, 1.0)',
                width: 8
              }
            ),
            radius: 10, 
            fill: new Fill
            (
              {
                color: 'rgba(255, 0, 0, 1.0)'
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

// WFS 점을 클릭하면 보여줄 오버레이를 만든다.
const popup = document.getElementById('popup');
const overlayLayer  = new Overlay
(
  {element: popup}
);

const map = new Map({
  target: 'map',
  layers: [osmLayer, wfsLayer],
  view: new View({
    center: [14100008.61632484, 4496815.790027254],
    zoom: 14
  }),  
  interactions: defaults().extend([mouseHoverSelect, mouseClickSelect]),
  overlays: [overlayLayer]
});

// 지도 클릭 이벤트 처리. 만약 WFS에서 어느 한 점을 클릭했으면 오버레이(popup) 처리한다.
map.on('click', (e) =>
{
  //console.log(e);

  // 일단 창을 닫는다. 이렇게 하면 자료가 없는 곳을 찍으면 창이 닫히는 효과가 나온다.
  overlayLayer.setPosition(undefined);

  // 점찍은 곳의 자료를 찾아낸다. geoserver에서는 WFS를 위해 위치 정보 뿐 아니라 메타데이터도 같이 보내고 있다.
  map.forEachFeatureAtPixel(e.pixel, (feature, layer) =>
  {
    // 이 point와 같이 넘어온 메타데이터 값을 찾는다.
    
    let parkID = feature.get('id');
    let park_name = feature.get('name');
    let park_address = feature.get('address');

    // 메티데이터를 오버레이를 위한 div에 적는다.
    document.getElementById("link").href = "detail.jsp?id=" + parkID;
    document.getElementById("park_name").innerHTML = parkID + ". " + park_name;
    document.getElementById("park_address").innerHTML = park_address;

    // 오버레이 창을 띄운다.
    overlayLayer.setPosition(e.coordinate);
  })
}
);