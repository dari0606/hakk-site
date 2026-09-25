// Читалка PDF: страницы рисуются в браузере, поэтому листаются на любом
// телефоне — в отличие от встроенного просмотра, который мобильные
// браузеры часто не показывают.
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Loader } from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

export default function PdfReader({ file, title, download, of, fallback }) {
  const [doc, setDoc] = useState(null);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState(false);
  const box = useRef(null);
  const canvas = useRef(null);
  const task = useRef(null);
  const touch = useRef(0);

  useEffect(() => {
    let dead = false;
    setBusy(true); setErr(false);
    const load = () => pdfjs.getDocument({ url: file, disableAutoFetch: false }).promise;
    load()
      .catch((e) => {
        // на части телефонов не запускается фоновый поток — пробуем без него
        console.warn('PDF: повтор без воркера', e);
        pdfjs.GlobalWorkerOptions.workerSrc = '';
        return load();
      })
      .then((d) => { if (!dead) { setDoc(d); setPage(1); } })
      .catch((e) => { console.error('PDF:', e); if (!dead) { setErr(true); setBusy(false); } });
    return () => { dead = true; };
  }, [file]);

  const draw = useCallback(async () => {
    if (!doc || !canvas.current || !box.current) return;
    setBusy(true);
    try {
      task.current?.cancel();
      const p = await doc.getPage(page);
      const width = box.current.clientWidth;
      const base = p.getViewport({ scale: 1 });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = p.getViewport({ scale: (width / base.width) * dpr });
      const cv = canvas.current;
      cv.width = viewport.width;
      cv.height = viewport.height;
      cv.style.width = '100%';
      cv.style.height = 'auto';
      task.current = p.render({ canvasContext: cv.getContext('2d'), viewport });
      await task.current.promise;
    } catch { /* отменённый рендер — не ошибка */ } finally { setBusy(false); }
  }, [doc, page]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const r = () => draw();
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, [draw]);

  const total = doc?.numPages || 0;
  const go = (d) => setPage((p) => Math.min(Math.max(p + d, 1), total || 1));

  useEffect(() => {
    const key = (e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [total]);

  if (err) {
    return (
      <div className="pdf pdf-err">
        <p>{fallback}</p>
        <a className="btn btn-primary" href={file} target="_blank" rel="noreferrer"><Download /> {download}</a>
      </div>
    );
  }

  return (
    <div className="pdf">
      <div className="pdf-bar">
        <span className="pdf-title">{title}</span>
        <a className="btn btn-primary" href={file} download><Download /> {download}</a>
      </div>

      <div
        className="pdf-stage"
        ref={box}
        onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
        }}
      >
        <canvas ref={canvas} />
        {busy && <span className="pdf-busy"><Loader /></span>}
        <button className="pdf-arrow left" onClick={() => go(-1)} disabled={page <= 1} aria-label="←"><ChevronLeft /></button>
        <button className="pdf-arrow right" onClick={() => go(1)} disabled={page >= total} aria-label="→"><ChevronRight /></button>
      </div>

      <div className="pdf-foot">
        <button onClick={() => go(-1)} disabled={page <= 1}><ChevronLeft /></button>
        <span>{page} / {total || '…'} {of}</span>
        <button onClick={() => go(1)} disabled={page >= total}><ChevronRight /></button>
      </div>
    </div>
  );
}
