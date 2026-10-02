'use client';
import { useState, useEffect, useRef } from 'react';
import { Plus, NotebookPen, X, Check, FileText, PanelLeft, ArrowUpRight } from 'lucide-react';
import NoteItem, { type Note } from '../components/NoteItem';
const STORAGE_KEY = 'notefolio-notes-v1';
const colors = ['cream', 'blue', 'pink', 'green', 'violet'];
const normalize = (text: string) => text.trim().toLowerCase().replace(/\s+/g, ' ');
function duplicate(notes: Note[], title: string, id: string | null) { return Boolean(title.trim()) && notes.some(n => n.id !== id && normalize(n.title) === normalize(title)); }
export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('cream');
  const [exists, setExists] = useState(false);
  const [message, setMessage] = useState('');
  const [deleting, setDeleting] = useState<Note | null>(null);
  const editor = useRef<HTMLDialogElement>(null);
  const confirmation = useRef<HTMLDialogElement>(null);
  const newButton = useRef<HTMLButtonElement>(null);

  // Load once, then save only after loading so an empty initial state cannot overwrite saved notes.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: unknown = JSON.parse(raw);
        if (!Array.isArray(saved) || !saved.every(n => n && typeof n.id === 'string' && typeof n.title === 'string' && typeof n.description === 'string' && colors.includes(n.color) && !Number.isNaN(Date.parse(n.createdAt)) && !Number.isNaN(Date.parse(n.updatedAt)))) throw new Error('Invalid saved notes');
        setNotes(saved);
      }
      setLoaded(true);
    } catch { setStorageError('Saved notes could not be loaded. Storage has been left unchanged.'); }
  }, []);
  useEffect(() => { if (loaded) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); setStorageError(''); } catch { setStorageError('Changes are available this session, but browser storage is full or unavailable.'); } } }, [notes, loaded]);
  // Bonus requirement: check for an existing title as the user types (case/whitespace insensitive).
  useEffect(() => { setExists(duplicate(notes, title, editingId)); }, [notes, title, editingId]);
  useEffect(() => { if (!message) return; const timer = setTimeout(() => setMessage(''), 3500); return () => clearTimeout(timer); }, [message]);
  useEffect(() => { if (open && !editor.current?.open) editor.current?.showModal(); else if (!open && editor.current?.open) editor.current.close(); }, [open]);
  useEffect(() => { if (deleting && !confirmation.current?.open) confirmation.current?.showModal(); else if (!deleting && confirmation.current?.open) confirmation.current.close(); }, [deleting]);
  function start(note?: Note) { setEditingId(note?.id ?? null); setTitle(note?.title ?? ''); setDescription(note?.description ?? ''); setColor(note?.color ?? 'cream'); setOpen(true); }
  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim() || !description.trim() || duplicate(notes, title, editingId)) return;
    const now = new Date().toISOString();
    setNotes(current => editingId ? current.map(n => n.id === editingId ? { ...n, title: title.trim(), description: description.trim(), color, updatedAt: now } : n) : [{ id: crypto.randomUUID(), title: title.trim(), description: description.trim(), color, createdAt: now, updatedAt: now }, ...current]);
    setOpen(false); setMessage(editingId ? 'Note updated' : 'Note added');
  }
  return <div className="app-shell">
    <aside className="sidebar"><a className="brand" href="/" aria-label="Notefolio home"><span className="brand-icon"><NotebookPen size={23}/></span>notefolio<span className="brand-dot">.</span></a><div className="workspace-label">YOUR WORKSPACE</div><div className="nav-active"><FileText size={19}/><span>All notes</span><span className="nav-count">{notes.length}</span></div><div className="sidebar-bottom"><span className="small-mark"><NotebookPen size={21}/></span><p>A little space.<br/><strong>For big ideas.</strong></p><div className="local-label">Stored on this device</div></div></aside>
    <main><header className="topbar"><span><PanelLeft size={18}/> Personal workspace</span><span className="topbar-right">YOUR EVERYDAY NOTEBOOK <ArrowUpRight size={15}/></span></header><section className="content"><div className="heading-row"><div><div className="eyebrow">MAKE ROOM FOR YOUR THOUGHTS</div><h1>All notes<span>.</span></h1><p className="subtitle">Ideas, reminders, and everything in between.</p></div><button ref={newButton} className="primary new-note" onClick={() => start()} disabled={!loaded}><Plus size={19}/> New note</button></div><div className="collection-bar"><span><span className="collection-dot"/> Your collection <span className="collection-count">{notes.length}</span></span><span className="collection-meta">{loaded ? 'Saved on this device' : storageError ? 'Storage unavailable' : 'Loading notes…'}</span></div>
    {storageError && <p className="error-banner" role="alert">{storageError}</p>}
    {!notes.length ? <div className="empty"><div className="empty-icon"><NotebookPen size={36} strokeWidth={1.5}/></div><span className="empty-kicker">A FRESH PAGE</span><h2>Your next idea starts here.</h2><p>Capture a thought, make a list, or keep something<br className="desktop-break"/> worth remembering. This space is yours.</p><button className="primary" onClick={() => start()} disabled={!loaded}><Plus size={18}/> Create your first note</button><span className="empty-foot">Small thoughts. Endless possibilities.</span></div> : <div className="notes-grid">{notes.map(note => <NoteItem key={note.id} note={note} onEdit={start} onDelete={setDeleting}/>)}</div>}
    <div className="page-foot"><span>ONE NOTE AT A TIME.</span><span>{notes.length} {notes.length === 1 ? 'note' : 'notes'} in your notebook</span></div></section></main>
    <dialog ref={editor} className="editor-dialog" onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}><form onSubmit={save}><div className="dialog-heading"><div><span className="eyebrow">YOUR NOTEBOOK</span><h2>{editingId ? 'Edit your note' : 'A new thought'}</h2></div><button type="button" className="icon-button" aria-label="Close editor" onClick={() => setOpen(false)}><X size={21}/></button></div><label htmlFor="title">Title</label><input id="title" autoFocus required maxLength={100} placeholder="Give your note a title" value={title} onChange={e => setTitle(e.target.value)} aria-invalid={exists} aria-describedby={exists ? 'duplicate-error' : undefined}/>{exists && <p id="duplicate-error" className="field-error" role="alert">This title already exists. Choose another title.</p>}<div className="description-label"><label htmlFor="description">Description</label><span>{description.length}/5000</span></div><textarea id="description" required maxLength={5000} rows={7} placeholder="What's on your mind?" value={description} onChange={e => setDescription(e.target.value)}/><fieldset><legend>Note color</legend><div className="color-options">{colors.map(c => <label key={c} className={`swatch ${c} ${color === c ? 'selected' : ''}`}><input type="radio" name="color" value={c} checked={color === c} onChange={() => setColor(c)} aria-label={`${c} note color`}/>{color === c && <Check size={16}/>}</label>)}</div></fieldset><div className="dialog-footer"><button type="button" className="secondary" onClick={() => setOpen(false)}>Cancel</button><button className="primary" disabled={exists || !title.trim() || !description.trim()}><Check size={18}/>{editingId ? 'Save changes' : 'Add note'}</button></div></form></dialog>
    <dialog ref={confirmation} className="delete-dialog" onCancel={() => setDeleting(null)} onClose={() => setDeleting(null)}><h2>Delete this note?</h2><p>“{deleting?.title}” will be permanently removed from this device.</p><div className="dialog-footer"><button className="secondary" autoFocus onClick={() => setDeleting(null)}>Keep note</button><button className="danger" onClick={() => { setNotes(current => current.filter(n => n.id !== deleting?.id)); setDeleting(null); setMessage('Note deleted'); }}>Delete note</button></div></dialog>
    <div className={`toast ${message ? 'visible' : ''}`} role="status" aria-live="polite">{message && <><Check size={17}/>{message}</>}</div>
  </div>;
}
