export const VAT_STATUS = {
  ready: '就绪',
  busy: '占用',
  maintenance: '维护',
};

export const LOT_STATUS = {
  queued: '排队',
  running: '染程中',
  rinsing: '漂洗',
  done: '完成',
  rework: '返工',
};

export function fmtDate(v) {
  if (!v) return '—';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function toLocalInput(v) {
  if (!v) {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }
  const d = new Date(v);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function fromLocalInput(v) {
  return new Date(v).toISOString();
}
