import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

function normalise(value){return typeof value==="boolean"?(value?1:0):value;}

class Statement{
  constructor(database,sql,params=[]){this.database=database;this.sql=sql;this.params=params.map(normalise);}
  bind(...params){return new Statement(this.database,this.sql,params);}
  async run(){const result=this.database.prepare(this.sql).run(...this.params);return{success:true,meta:{changes:Number(result.changes),last_row_id:Number(result.lastInsertRowid)}};}
  async all(){return{success:true,results:this.database.prepare(this.sql).all(...this.params)};}
  async raw(){return this.database.prepare(this.sql).all(...this.params).map(row=>Object.values(row));}
  async first(column){const row=this.database.prepare(this.sql).get(...this.params);return column?row?.[column]:row??null;}
}

export function createTestDatabase(projectRoot){
  const sqlite=new DatabaseSync(":memory:");
  const migrationRoot=resolve(projectRoot,"drizzle");
  for(const filename of readdirSync(migrationRoot).filter(name=>/^\d+.*\.sql$/.test(name)).sort()){
    const sql=readFileSync(resolve(migrationRoot,filename),"utf8");
    for(const statement of sql.split("--> statement-breakpoint").map(value=>value.trim()).filter(Boolean))sqlite.exec(statement);
  }
  return{
    sqlite,
    binding:{
      prepare(sql){return new Statement(sqlite,sql);},
      async batch(statements){return Promise.all(statements.map(statement=>statement.all()));},
      async exec(sql){sqlite.exec(sql);return{count:1,duration:0};},
      dump(){return new ArrayBuffer(0);},
    },
  };
}

export function createTestBucket(){
  const objects=new Map();
  return{
    objects,
    binding:{
      async put(key,value,options={}){objects.set(key,{bytes:new Uint8Array(value),metadata:options.httpMetadata??{}});return{};},
      async get(key){const item=objects.get(key);if(!item)return null;return{body:item.bytes.buffer,httpEtag:`test-${item.bytes.byteLength}`,writeHttpMetadata(headers){if(item.metadata.contentType)headers.set("content-type",item.metadata.contentType);if(item.metadata.cacheControl)headers.set("cache-control",item.metadata.cacheControl);}};},
      async delete(key){objects.delete(key);},
    },
  };
}
