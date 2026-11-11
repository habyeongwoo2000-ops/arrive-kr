/* 원주 지도 바탕 — 국내 지도 서비스처럼 밝은 회백색 바탕 · 흰 도로 · 주황 고속도로 · 연두 공원 · 하늘색 물
   · 데이터: OpenStreetMap (OpenMapTiles 벡터 타일, OpenFreeMap 무료 서버 — API 키 없음)
   · 한글 글자는 브라우저 글꼴로 그립니다(localIdeographFontFamily). */

const NAME = ['coalesce', ['get', 'name:ko'], ['get', 'name']];
const R = 'Noto Sans Regular', B = 'Noto Sans Bold';
const z = (...stops) => ['interpolate', ['exponential', 1.5], ['zoom'], ...stops];
const cls = (...c) => ['match', ['get', 'class'], c, true, false];
/* 네이버 지도처럼 조용하게: 가게·시설 이름은 16단계부터, 그것도 중요한 것부터 조금씩 */
const RANK = ['<=', ['get', 'rank'], ['step', ['zoom'], 2, 16, 6, 17, 16, 18, 40]];
const line = ['match', ['geometry-type'], ['LineString', 'MultiLineString'], true, false];

/* 장소 분류 → 색 */
const POI_COLOR = ['match', ['get', 'class'],
  ['school', 'college', 'university', 'kindergarten', 'library'], '#4f7fe0',
  ['hospital', 'doctors', 'pharmacy', 'dentist', 'clinic'], '#e5534b',
  ['town_hall', 'office', 'government', 'police', 'fire_station', 'post', 'community_centre', 'courthouse'], '#5b6bd8',
  ['bank', 'atm'], '#3d8be8',
  ['park', 'garden', 'playground', 'pitch', 'stadium', 'sports_centre'], '#37a14a',
  ['cafe', 'restaurant', 'fast_food', 'bakery', 'bar', 'ice_cream', 'food_court'], '#ec7d32',
  ['shop', 'grocery', 'supermarket', 'convenience', 'clothing_store', 'department_store', 'mall'], '#e8930f',
  ['lodging', 'hotel', 'motel', 'hostel', 'guest_house'], '#b05ad6',
  ['place_of_worship', 'church', 'temple'], '#8b6f5c',
  ['bus', 'railway', 'subway', 'bus_station', 'parking', 'fuel'], '#53627a',
  '#8f8f8f'];

export default function mapStyle() {
  return {
    version: 8,
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    sources: { omt: { type: 'vector', url: 'https://tiles.openfreemap.org/planet', attribution: '© OpenStreetMap contributors · OpenMapTiles · OpenFreeMap' } },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': '#f4f3f0' } },
      { id: 'landuse-res', type: 'fill', source: 'omt', 'source-layer': 'landuse', filter: cls('residential', 'suburb', 'neighbourhood'), paint: { 'fill-color': '#f0eee9' } },
      { id: 'landuse-com', type: 'fill', source: 'omt', 'source-layer': 'landuse', filter: cls('commercial', 'retail', 'industrial'), paint: { 'fill-color': '#f1ebe4' } },
      { id: 'landuse-school', type: 'fill', source: 'omt', 'source-layer': 'landuse', filter: cls('school', 'university', 'college', 'kindergarten'), paint: { 'fill-color': '#e6edfa' } },
      { id: 'landuse-hosp', type: 'fill', source: 'omt', 'source-layer': 'landuse', filter: cls('hospital'), paint: { 'fill-color': '#fbe9e8' } },
      { id: 'wood', type: 'fill', source: 'omt', 'source-layer': 'landcover', filter: cls('wood', 'forest'), paint: { 'fill-color': '#dcebce', 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 8, .9, 15, .55] } },
      { id: 'grass', type: 'fill', source: 'omt', 'source-layer': 'landcover', filter: cls('grass', 'farmland', 'scrub', 'meadow'), paint: { 'fill-color': '#e4efd8', 'fill-opacity': .7 } },
      { id: 'park', type: 'fill', source: 'omt', 'source-layer': 'park', paint: { 'fill-color': '#d3ebc3', 'fill-opacity': .85 } },
      { id: 'water', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': '#aed4f3' } },
      { id: 'waterway', type: 'line', source: 'omt', 'source-layer': 'waterway', paint: { 'line-color': '#aed4f3', 'line-width': z(10, .6, 16, 3) } },
      { id: 'building', type: 'fill', source: 'omt', 'source-layer': 'building', minzoom: 14,
        paint: { 'fill-color': '#ebe6df', 'fill-outline-color': '#ddd5ca', 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 15, 1] } },

      /* 도로: 테두리 → 속 순서 */
      { id: 'path', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 15, filter: ['all', line, cls('path', 'track')],
        paint: { 'line-color': '#e2e2e2', 'line-width': z(15, .8, 18, 2), 'line-dasharray': [2, 1.5] } },
      { id: 'minor-case', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 12, filter: ['all', line, cls('minor', 'service')],
        layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#dedede', 'line-width': z(12, .5, 14, 3, 18, 15) } },
      { id: 'major-case', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 8, filter: ['all', line, cls('tertiary', 'secondary', 'primary', 'trunk')],
        layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': ['match', ['get', 'class'], 'trunk', '#e7c37d', '#d4d4d4'], 'line-width': z(8, .6, 12, 3, 14, 6.5, 18, 26) } },
      { id: 'motor-case', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 6, filter: ['all', line, cls('motorway')],
        layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#dba65a', 'line-width': z(6, .8, 12, 4.5, 14, 8, 18, 30) } },
      { id: 'minor', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 12, filter: ['all', line, cls('minor', 'service')],
        layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#ffffff', 'line-width': z(12, .3, 14, 2, 18, 13) } },
      { id: 'major', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 8, filter: ['all', line, cls('tertiary', 'secondary', 'primary', 'trunk')],
        layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': ['match', ['get', 'class'], 'trunk', '#fbe1a6', '#ffffff'], 'line-width': z(8, .4, 12, 2, 14, 5, 18, 23) } },
      { id: 'motor', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 6, filter: ['all', line, cls('motorway')],
        layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#f3c57f', 'line-width': z(6, .5, 12, 3.2, 14, 6.5, 18, 27) } },
      { id: 'rail', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 9, filter: ['all', line, cls('rail', 'transit')],
        paint: { 'line-color': '#a9a9a9', 'line-width': z(9, .6, 16, 2.4) } },
      { id: 'rail-dash', type: 'line', source: 'omt', 'source-layer': 'transportation', minzoom: 13, filter: ['all', line, cls('rail', 'transit')],
        paint: { 'line-color': '#ffffff', 'line-width': z(13, .6, 16, 1.2), 'line-dasharray': [3, 3] } },
      { id: 'boundary', type: 'line', source: 'omt', 'source-layer': 'boundary', filter: ['all', ['>=', ['get', 'admin_level'], 4], ['<=', ['get', 'admin_level'], 8], ['!=', ['get', 'maritime'], 1]],
        paint: { 'line-color': '#c9c5d8', 'line-width': z(8, .6, 14, 1.4), 'line-dasharray': [3, 2] } },

      /* 글자 */
      /* 물 이름: 강(선)은 선을 따라, 호수(점)는 그 자리에 — 배치 방식은 데이터 식을 못 쓰므로 두 층으로 나눔 */
      { id: 'water-name-line', type: 'symbol', source: 'omt', 'source-layer': 'water_name', minzoom: 11, filter: line,
        layout: { 'text-field': NAME, 'text-font': [R], 'text-size': 12, 'symbol-placement': 'line' },
        paint: { 'text-color': '#4d8fc9', 'text-halo-color': 'rgba(255,255,255,.9)', 'text-halo-width': 1.4 } },
      { id: 'water-name-point', type: 'symbol', source: 'omt', 'source-layer': 'water_name', minzoom: 11, filter: ['!', line],
        layout: { 'text-field': NAME, 'text-font': [R], 'text-size': 12 },
        paint: { 'text-color': '#4d8fc9', 'text-halo-color': 'rgba(255,255,255,.9)', 'text-halo-width': 1.4 } },
      { id: 'road-name', type: 'symbol', source: 'omt', 'source-layer': 'transportation_name', minzoom: 13,
        layout: { 'symbol-placement': 'line', 'text-field': NAME, 'text-font': [R], 'text-size': z(13, 10.5, 18, 13), 'symbol-spacing': 320, 'text-max-angle': 30 },
        paint: { 'text-color': '#7a7a7a', 'text-halo-color': '#ffffff', 'text-halo-width': 1.6 } },
      { id: 'poi-dot', type: 'circle', source: 'omt', 'source-layer': 'poi', minzoom: 16, filter: RANK,
        paint: { 'circle-color': POI_COLOR, 'circle-radius': z(14, 4.5, 17, 8), 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 1.6 } },
      { id: 'poi-name', type: 'symbol', source: 'omt', 'source-layer': 'poi', minzoom: 16, filter: RANK,
        layout: { 'text-field': NAME, 'text-font': [B], 'text-size': z(14, 11, 17, 12.5), 'text-anchor': 'top', 'text-offset': [0, .85], 'text-max-width': 7, 'text-optional': true },
        paint: { 'text-color': POI_COLOR, 'text-halo-color': '#ffffff', 'text-halo-width': 1.6 } },
      { id: 'place-small', type: 'symbol', source: 'omt', 'source-layer': 'place', minzoom: 13, filter: cls('suburb', 'quarter', 'neighbourhood', 'village', 'hamlet'),
        layout: { 'text-field': NAME, 'text-font': [B], 'text-size': z(12, 13, 16, 17), 'text-max-width': 8 },
        paint: { 'text-color': '#8c8c8c', 'text-halo-color': 'rgba(255,255,255,.9)', 'text-halo-width': 1.6 } },
      { id: 'place-town', type: 'symbol', source: 'omt', 'source-layer': 'place', filter: cls('town', 'city'),
        layout: { 'text-field': NAME, 'text-font': [B], 'text-size': z(6, 12, 12, 17) },
        paint: { 'text-color': '#3a3a3a', 'text-halo-color': '#ffffff', 'text-halo-width': 1.8 } }
    ]
  };
}

export const KO_FONT = "'Apple SD Gothic Neo', 'Malgun Gothic', '맑은 고딕', 'Noto Sans KR', sans-serif";
