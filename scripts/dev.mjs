import http from "node:http";
import {readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import handler from "../api/chat.js";
try { process.loadEnvFile(".env.local"); } catch (error) { if (error.code !== "ENOENT") throw error; }
const root = path.resolve(fileURLToPath(new URL("../public/",import.meta.url)));
const types = {".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml"};
const server = http.createServer(async (req,res) => {
  const url = new URL(req.url,"http://localhost");
  res.status = code => { res.statusCode = code; return res; };
  res.json = value => { res.setHeader("Content-Type","application/json"); res.end(JSON.stringify(value)); };
  if (url.pathname === "/api/chat") {
    let body = "", tooLarge = false;
    for await (const chunk of req) { body += chunk; if (body.length > 40000) { tooLarge = true; break; } }
    if (tooLarge) return res.status(413).json({error:"Request too large."});
    req.body = body; return handler(req,res);
  }
  let filename;
  try { filename = path.resolve(root,"." + decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname)); }
  catch { res.statusCode = 400; return res.end("Bad path"); }
  if (!filename.startsWith(root + path.sep)) { res.statusCode = 403; return res.end("Forbidden"); }
  try { const content = await readFile(filename); res.setHeader("Content-Type",types[path.extname(filename)] || "application/octet-stream"); res.end(content); }
  catch { res.statusCode = 404; res.end("Not found"); }
});
server.listen(Number(process.env.PORT || 4173),"127.0.0.1",() => console.log("Portfolio: http://127.0.0.1:" + server.address().port));

