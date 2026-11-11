/* 선 아이콘 모음 — 이모지 대신 쓰는 단색 아이콘 (지도 서비스 화면처럼 1.7px 선, currentColor) */

const P = {
  route: <><circle cx="6" cy="18" r="2.2" /><circle cx="18" cy="6" r="2.2" /><path d="M8 18h6.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16" /></>,
  plane: <path d="M21 15.5v-1.8l-7.5-4.6V4.2a1.5 1.5 0 0 0-3 0v4.9L3 13.7v1.8l7.5-2.3v4.6l-2 1.5V21l3.5-1 3.5 1v-1.7l-2-1.5v-4.6z" />,
  todo: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8.5 12.2l2.4 2.4 4.6-5" /></>,
  pin: <><path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>,
  calendar: <><rect x="4" y="5.5" width="16" height="14.5" rx="2.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4M8 13.5h2M14 13.5h2M8 16.5h2" /></>,
  ko: <text x="12" y="16.6" textAnchor="middle" fontSize="13" fontWeight="700" stroke="none" fill="currentColor" fontFamily="'Apple SD Gothic Neo','Malgun Gothic',sans-serif">가</text>,
  ticket: <><path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V14a2 2 0 0 0 0-4z" /><path d="M14.5 6v12" strokeDasharray="1.6 1.8" /></>,
  user: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.6 2.4 2.6 14.6 0 17M12 3.5c-2.6 2.4-2.6 14.6 0 17" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /></>,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  back: <path d="M15 5l-7 7 7 7" />,
  next: <path d="M9 5l7 7-7 7" />,
  down: <path d="M6 9l6 6 6-6" />,
  layers: <><path d="M12 4l8.5 4.5L12 13 3.5 8.5z" /><path d="M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5" /></>,
  mobile: <><rect x="7" y="3" width="10" height="18" rx="2.2" /><path d="M11 17.5h2" /></>,
  desktop: <><rect x="3.5" y="4.5" width="17" height="11.5" rx="1.5" /><path d="M9 20h6M12 16v4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  call: <path d="M6.6 3.8l2.6-.6 1.6 4-1.9 1.4a11 11 0 0 0 4.9 4.9l1.4-1.9 4 1.6-.6 2.6a2 2 0 0 1-2 1.5A14.5 14.5 0 0 1 5.1 5.8a2 2 0 0 1 1.5-2z" />,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  cart: <><path d="M3.5 4.5h2.3l2 10.5h10l1.8-7.5H7" /><circle cx="9" cy="19" r="1.4" /><circle cx="17" cy="19" r="1.4" /></>,
  bowl: <><path d="M4 11h16a8 8 0 0 1-16 0z" /><path d="M9 4.5c0 2 1.5 2 1.5 4M13.5 4.5c0 2 1.5 2 1.5 4M8 21h8" /></>,
  bus: <><rect x="5" y="3.5" width="14" height="14" rx="2.5" /><path d="M5 11h14M8.5 20.5v-3M15.5 20.5v-3" /><circle cx="8.5" cy="14.2" r=".9" fill="currentColor" /><circle cx="15.5" cy="14.2" r=".9" fill="currentColor" /></>,
  alert: <><path d="M12 4l9 15.5H3z" /><path d="M12 10v4.5M12 17h.01" /></>,
  land: <><path d="M3 20h18" /><path d="M4.5 9.5l1.6-.4 2.7 2.2 3.6-1-3.9-5.5 2-.5 5.8 4.6 3.4-.9a1.5 1.5 0 0 1 .8 2.9L6.9 14.5 3.6 11z" /></>,
  fuel: <><path d="M5 20V5.5A1.5 1.5 0 0 1 6.5 4h6A1.5 1.5 0 0 1 14 5.5V20M4 20h11M5 10h9" /><path d="M14 8.5h1.5a1.5 1.5 0 0 1 1.5 1.5v5.5a1.5 1.5 0 0 0 3 0V8l-2.5-2.5" /></>,
  sparkle: <path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9zM18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5.5M12 7.8h.01" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  play: <path d="M8 5.5v13l10.5-6.5z" />,
  pause: <path d="M8.5 5.5v13M15.5 5.5v13" />,
  stay: <><rect x="5" y="3.5" width="14" height="17" rx="2" /><circle cx="12" cy="10" r="2.6" /><path d="M8.5 16.5h7" /></>,
  work: <><rect x="3.5" y="7.5" width="17" height="12" rx="2" /><path d="M9 7.5V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2M3.5 12.5h17" /></>,
  health: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8v8M8 12h8" /></>,
  family: <><circle cx="8.5" cy="8" r="2.6" /><circle cx="16" cy="9" r="2.1" /><path d="M3.5 19a5 5 0 0 1 10 0M13 19a3.5 3.5 0 0 1 7 0" /></>,
  child: <><circle cx="12" cy="8" r="3.2" /><path d="M7 20a5 5 0 0 1 10 0M10.8 8h.01M13.2 8h.01" /></>,
  life: <><path d="M4 11l8-6.5 8 6.5" /><path d="M6 9.5V20h12V9.5M10 20v-5h4v5" /></>,
  safety: <><path d="M12 3.5l7 2.8v5.2c0 4.3-3 7.6-7 9-4-1.4-7-4.7-7-9V6.3z" /><path d="M9 12l2.2 2.2L15.5 10" /></>,
  culture: <><path d="M5 20V9l7-5 7 5v11" /><path d="M9 20v-6h6v6M3.5 20h17" /></>,
  study: <><path d="M3 9l9-4.5L21 9l-9 4.5z" /><path d="M7 11v4.5c1.5 1.5 3 2 5 2s3.5-.5 5-2V11M21 9v5" /></>,
  camera: <><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.2l1.5-2.2h5.6L16.3 7h2.2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z" /><circle cx="12" cy="13" r="3.4" /></>,
  mic: <><rect x="9" y="3.5" width="6" height="11" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5" /></>,
  send: <path d="M4.5 12L20 4.5 16 20l-3.5-6.5zM12.5 13.5L20 4.5" />,
  doc: <><path d="M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20z" /><path d="M14 3.5V8h4M9 12h6M9 15.5h6" /></>,
  moved: <path d="M5 12h12M13 7l5 5-5 5" />
};

export default function Icon({ n, size = 20, className = '', ...rest }) {
  return (
    <svg className={'ic ' + className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...rest}>
      {P[n] || P.info}
    </svg>
  );
}
