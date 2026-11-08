/* 이 브라우저에만 남기는 값. 개인정보 보호 모드 등에서 막히면 조용히 넘어갑니다. */
const P = 'arrive.';
export function get(k, d = null) { try { const v = localStorage.getItem(P + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
export function set(k, v) { try { localStorage.setItem(P + k, JSON.stringify(v)); } catch (e) { /* 막힌 저장소 */ } }
export function del(k) { try { localStorage.removeItem(P + k); } catch (e) { /* 막힌 저장소 */ } }
