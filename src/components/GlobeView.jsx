/* 지구본 (globe.gl / three.js)
   · 위성 모드: NASA Blue Marble 사진 + 지형 굴곡 + 별 배경 (구글 어스 느낌)
   · 지도 모드: 바다는 하늘색, 땅은 밝은 회색 (구글 지도 느낌)
   · 나라를 누르면 onPick, 경로는 pathsData(고도 포함)로 그려 비행기가 경로 위를 정확히 지나갑니다. */

import { useEffect, useRef } from 'react';
import Globe from 'globe.gl';

const SAT = '/textures/earth-blue-marble.jpg';
const BUMP = '/textures/earth-topology.png';
const SKY = '/textures/night-sky.png';
/* 지도 모드 바다색 — 한 색으로 칠한 작은 그림을 지구본 표면으로 씁니다. */
let OCEAN = null;
function ocean() {
  if (OCEAN) return OCEAN;
  const c = document.createElement('canvas'); c.width = 4; c.height = 2;
  const x = c.getContext('2d'); x.fillStyle = '#aadaff'; x.fillRect(0, 0, 4, 2);
  OCEAN = c.toDataURL('image/png');
  return OCEAN;
}

function markEl(d, onMark) {
  const el = document.createElement('div');
  if (d.kind === 'plane') {
    el.className = 'g-plane-o';
    el.innerHTML = '<div class="g-plane"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>';
    return el;
  }
  el.className = 'g-mark g-' + d.kind + (d.active ? ' is-on' : '') + (d.done ? ' is-done' : '');
  if (d.kind === 'leg') el.innerHTML = `<span class="g-dot">${d.n}</span><span class="g-lbl">${d.label}</span>`;
  else if (d.kind === 'turb') el.innerHTML = '<span class="g-turb" title="' + d.label.replace(/"/g, '&quot;') + '">!</span>';
  else if (d.kind === 'wonju') el.innerHTML = `<span class="g-wj"><svg viewBox="0 0 28 40"><path d="M14 0C6.3 0 0 6.2 0 13.9 0 24.3 14 40 14 40s14-15.7 14-26.1C28 6.2 21.7 0 14 0z"/><circle cx="14" cy="14" r="5.2" fill="#fff"/></svg></span><span class="g-lbl">${d.label}</span>`;
  else el.innerHTML = `<span class="g-pin"></span><span class="g-lbl">${d.label}</span>`;
  el.style.pointerEvents = 'auto';
  el.style.cursor = 'pointer';
  el.addEventListener('click', (e) => { e.stopPropagation(); onMark && onMark(d); });
  return el;
}

export default function GlobeView({ features, selected, hoverable, mode, paths, marks, focus, onPick, onMark, onEmpty, apiRef }) {
  const host = useRef(null);
  const g = useRef(null);
  const cb = useRef({});
  cb.current = { onPick, onMark, onEmpty, selected, hoverable, mode };
  const hover = useRef(null);
  const planeRef = useRef(null);
  const planeOn = useRef(false);
  const marksRef = useRef([]);
  const hit = useRef(false);       // 이번 클릭이 나라·지구본에 맞았는지
  const downAt = useRef(null);

  /* 한 번만 만들기 */
  useEffect(() => {
    const el = host.current;
    const globe = Globe({ animateIn: true })(el)
      .backgroundImageUrl(SKY)
      .showAtmosphere(true).atmosphereColor('#8ab4f8').atmosphereAltitude(0.17)
      .polygonsTransitionDuration(250)
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonLabel((f) => `<div class="g-tip">${f.properties.label || f.properties.name}</div>`)
      /* 나라를 누르면 고르기 · 이미 고른 나라를 다시 누르면 선택 해제 */
      .onPolygonClick((f) => { hit.current = true; if (f.id === cb.current.selected) cb.current.onEmpty && cb.current.onEmpty(); else cb.current.onPick && cb.current.onPick(f); })
      /* 바다(나라가 아닌 지구본)를 누르면 선택 해제 */
      .onGlobeClick(() => { hit.current = true; cb.current.onEmpty && cb.current.onEmpty(); })
      .onPolygonHover((f) => { hover.current = f; paint(); el.style.cursor = f ? 'pointer' : 'grab'; })
      .pathPoints((d) => d.pts).pathPointLat((p) => p[0]).pathPointLng((p) => p[1]).pathPointAlt((p) => p[2])
      .pathColor((d) => (d.kind === 'ground' ? ['rgba(251,188,4,1)', 'rgba(234,67,53,1)'] : ['rgba(255,255,255,0.95)', 'rgba(138,180,248,1)']))
      .pathStroke((d) => (d.kind === 'ground' ? 3 : 2.2)).pathDashLength(0.06).pathDashGap(0.02).pathDashAnimateTime(9000).pathTransitionDuration(0)
      .htmlElement((d) => markEl(d, (m) => cb.current.onMark && cb.current.onMark(m)))
      .htmlLat((d) => d.lat).htmlLng((d) => d.lng).htmlAltitude((d) => d.alt || 0)
      .htmlTransitionDuration(0);
    /* 우주(지구본 바깥)를 눌러도 선택 해제 — 끌어서 돌린 경우는 제외 */
    const down = (e) => { hit.current = false; downAt.current = [e.clientX, e.clientY]; };
    const click = (e) => {
      const d = downAt.current; if (!d || Math.hypot(e.clientX - d[0], e.clientY - d[1]) > 6) return;
      setTimeout(() => { if (!hit.current) cb.current.onEmpty && cb.current.onEmpty(); }, 0);
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('click', click);
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.35;
    globe.controls().enableDamping = true;
    globe.pointOfView({ lat: 22, lng: 110, altitude: 2.4 }, 0);
    g.current = globe;
    /* 비행기·카메라는 매 프레임 바뀌므로 React 상태 대신 직접 움직입니다. */
    if (apiRef) apiRef.current = {
      setPlane(p) {
        if (!planeRef.current) planeRef.current = { kind: 'plane', lat: 0, lng: 0, alt: 0 };
        if (!p) { planeOn.current = false; globe.htmlElementsData([...(marksRef.current || [])]); return; }
        Object.assign(planeRef.current, p);
        if (!planeOn.current) { planeOn.current = true; globe.htmlElementsData([...(marksRef.current || []), planeRef.current]); }
        else globe.htmlElementsData([...globe.htmlElementsData()]);
        const pe = el.querySelector('.g-plane'); if (pe) pe.style.setProperty('--hd', (p.heading || 0) + 'deg');
      },
      look(pov, ms = 0) { globe.controls().autoRotate = false; globe.pointOfView(pov, ms); },
      pause() { globe.pauseAnimation(); },
      resume() { globe.resumeAnimation(); },
      zoom(f) { const v = globe.pointOfView(); globe.controls().autoRotate = false; globe.pointOfView({ ...v, altitude: Math.min(4, Math.max(0.35, v.altitude * f)) }, 400); }
    };

    const fit = () => globe.width(el.clientWidth).height(el.clientHeight);
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    return () => { el.removeEventListener('pointerdown', down); el.removeEventListener('click', click); ro.disconnect(); globe._destructor && globe._destructor(); el.innerHTML = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 나라 색칠 — 고른 나라 · 마우스가 올라간 나라 · 송출국 */
  function paint() {
    const globe = g.current; if (!globe) return;
    const { selected: sel, hoverable: hv, mode: md } = cb.current;
    const map = md === 'map';
    globe.polygonCapColor((f) => {
      if (f.id === sel) return map ? 'rgba(26,115,232,0.55)' : 'rgba(138,180,248,0.45)';
      if (f === hover.current) return map ? 'rgba(26,115,232,0.25)' : 'rgba(255,255,255,0.22)';
      if (f.id === '410') return map ? 'rgba(234,67,53,0.35)' : 'rgba(234,67,53,0.30)';
      if (map) return hv && hv.has(f.id) ? '#e6efe1' : '#f1f3f4';
      return 'rgba(0,0,0,0)';
    })
      .polygonStrokeColor((f) => (f.id === sel ? '#ffffff' : map ? '#c6cacf' : 'rgba(255,255,255,0.28)'))
      .polygonAltitude((f) => (f.id === sel ? 0.014 : f === hover.current ? 0.009 : 0.005));
  }

  useEffect(() => { if (g.current && features) { g.current.polygonsData(features); paint(); } }, [features]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { paint(); }, [selected, mode, hoverable]); // eslint-disable-line react-hooks/exhaustive-deps

  /* 위성 ↔ 지도 */
  useEffect(() => {
    const globe = g.current; if (!globe) return;
    if (mode === 'map') {
      globe.globeImageUrl(ocean()).bumpImageUrl(null);
      globe.atmosphereColor('#cfe3ff');
      globe.backgroundColor('#e8eef5').backgroundImageUrl(null);
    } else {
      globe.globeImageUrl(SAT).bumpImageUrl(BUMP);
      globe.atmosphereColor('#8ab4f8');
      globe.backgroundColor('#000005').backgroundImageUrl(SKY);
    }
    paint();
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  /* 경로 · 표시 */
  useEffect(() => { if (g.current) g.current.pathsData(paths || []); }, [paths]);
  useEffect(() => {
    if (!g.current) return;
    marksRef.current = marks || [];
    const list = [...marksRef.current];
    if (planeOn.current && planeRef.current) list.push(planeRef.current);
    g.current.htmlElementsData(list);
  }, [marks]);

  /* 카메라 */
  useEffect(() => {
    const globe = g.current; if (!globe || !focus) return;
    globe.controls().autoRotate = false;
    globe.pointOfView(focus, focus.ms === undefined ? 1600 : focus.ms);
  }, [focus]);

  return <div className="globe" ref={host} />;
}
