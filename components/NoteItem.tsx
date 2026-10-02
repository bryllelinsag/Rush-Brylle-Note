import { Pencil, Trash2, FileText } from 'lucide-react';
export type Note = { id: string; title: string; description: string; color: string; createdAt: string; updatedAt: string };
export default function NoteItem({ note, onEdit, onDelete }: { note: Note; onEdit: (note: Note) => void; onDelete: (note: Note) => void }) {
  return <article className={`note-card ${note.color}`}><div className="card-top"><span className="note-symbol"><FileText size={19}/></span><div className="card-actions"><button aria-label={`Edit ${note.title}`} onClick={() => onEdit(note)}><Pencil size={17}/></button><button aria-label={`Delete ${note.title}`} onClick={() => onDelete(note)}><Trash2 size={17}/></button></div></div><h3>{note.title}</h3><p className="note-description">{note.description}</p><footer><span>{new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span><span>{note.updatedAt !== note.createdAt ? 'Edited' : 'Note'}</span></footer></article>;
}
