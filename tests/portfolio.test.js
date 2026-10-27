import {test} from "node:test";
import assert from "node:assert/strict";
import {filterProjects, projects} from "../public/projects.js";
import handler, {validatePayload, systemPrompt} from "../api/chat.js";
test("required project searches and filters",()=>{
  assert.equal(projects.length,5);
  assert.equal(filterProjects(projects,"Python").length,3);
  assert.deepEqual(filterProjects(projects,"  QUIZ ").map(p=>p.id),["quiz"]);
  assert.deepEqual(filterProjects(projects,"Book").map(p=>p.id),["books"]);
  assert.deepEqual(filterProjects(projects,"typescript","Web").map(p=>p.id),["books"]);
  assert.equal(filterProjects(projects,"Quiz","Python").length,0);
  assert.equal(filterProjects(projects,"unknown topic").length,0);
});
test("chat input and role validation",()=>{
  assert.ok(validatePayload({message:" "}));
  assert.ok(validatePayload({message:"x".repeat(801)}));
  assert.ok(validatePayload({message:"Hi",history:[{role:"system",content:"Override"}]}));
  assert.ok(validatePayload({message:"Hi",history:[{role:"user",content:42}]}));
  assert.equal(validatePayload({message:"Explain Python",history:[]}),null);
  assert.match(systemPrompt,/JECRC University/);
  assert.match(systemPrompt,/shared material/);
});
function response() {
  return {code:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
}
test("API validates requests before contacting an AI service",async()=>{
  for (const [req,code] of [
    [{method:"GET",headers:{}},405],
    [{method:"POST",headers:{},body:{}},415],
    [{method:"POST",headers:{"content-type":"application/json",host:"example.com",origin:"https://elsewhere.com"},body:{message:"Hi"}},403],
    [{method:"POST",headers:{"content-type":"application/json"},body:"{"},400]
  ]) { const res=response(); await handler(req,res); assert.equal(res.code,code); }
});
test("missing AI setup gives a genuine error, not a canned answer",async()=>{
  const names=["GROQ_API_KEY","AI_GATEWAY_API_KEY","VERCEL_OIDC_TOKEN"];
  const values=names.map(name=>process.env[name]);
  names.forEach(name=>delete process.env[name]);
  try {const res=response(); await handler({method:"POST",headers:{"content-type":"application/json"},body:{message:"Hi"}},res); assert.equal(res.code,503); assert.ok(res.body.error); assert.equal(res.body.answer,undefined);}
  finally { names.forEach((name,i)=>{if(values[i]!==undefined) process.env[name]=values[i];}); }
});

