import Dexie, { type EntityTable } from 'dexie';


interface TODO{
  id:number;
  task:string;
  status:'pending'|'completed';
  deadline: string;
  createdAt:string
}


const db = new Dexie('TodoDatabase') as Dexie & {
  todos: EntityTable<TODO, 'id'>
}

// schema declaration
db.version(1).stores({
  todos: '++id, task, status, deadline, createdAt'
})

export { db };
export type { TODO };

