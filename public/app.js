import {profile, projects, filterProjects} from "./projects.js";
const $ = selector => document.querySelector(selector);
const themeButton = $("#theme-toggle");
function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === "dark";
  themeButton.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  $("#theme-label").textContent = dark ? "Light mode" : "Dark mode";
  $("#theme-symbol").textContent = dark ? "☀" : "◐";
}
themeButton.addEventListener("click", () => {
  const value = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = value;
  try { localStorage.setItem("manan-portfolio-theme", value); } catch {}
  updateThemeButton();
});
updateThemeButton();
const visuals = {
  python: '<div class="code-preview"><b>def</b> factorial(n):<br>&nbsp; result = 1<br>&nbsp; <b>for</b> i in range(1, n + 1):<br>&nbsp;&nbsp; result *= i</div>',
  refactor: '<div class="code-preview"><b>sum_scores</b>(student)<br><b>average_score</b>(student)<br><b>count_above_avg</b>(records)</div>',
  debug: '<div class="debug-check"><b>✓</b> Average calculation<br><b>✓</b> Passing boundary<br><b>✓</b> Grade ordering</div>',
  quiz: '<div class="quiz-preview"><span>Which language runs in a browser?</span><span class="quiz-answer">✓ JavaScript</span></div>',
  books: '<div class="book-preview"><span>WANT TO READ</span><span>READING</span><span>FINISHED</span></div>'
};
let category = "All";
function makeLink(label, url, className = "") {
  const link = document.createElement("a");
  link.href = url; link.textContent = label + " ↗"; link.target = "_blank"; link.rel = "noopener noreferrer"; link.className = className;
  return link;
}
function renderProjects() {
  const found = filterProjects(projects, $("#project-search").value, category);
  $("#project-grid").replaceChildren();
  for (const project of found) {
    const card = document.createElement("article"); card.className = "project-card";
    const visual = document.createElement("div"); visual.className = "project-visual visual-" + project.id;
    visual.setAttribute("aria-hidden", "true");
    // Only fixed, developer-authored illustrations use HTML. Project/user text uses textContent.
    visual.innerHTML = '<span class="visual-caption">PROJECT / ' + project.number + '</span>' + visuals[project.id];
    const body = document.createElement("div"); body.className = "project-body";
    const meta = document.createElement("div"); meta.className = "project-meta"; meta.textContent = project.kind.toUpperCase() + " / " + project.number;
    const title = document.createElement("h3"); title.textContent = project.title;
    const description = document.createElement("p"); description.textContent = project.description;
    const tags = document.createElement("div"); tags.className = "tags";
    for (const technology of project.technologies) { const tag = document.createElement("span"); tag.textContent = technology; tags.append(tag); }
    const links = document.createElement("div"); links.className = "project-links";
    for (const link of project.links) links.append(makeLink(link.label, link.url));
    if (project.live) links.append(makeLink("Open live app", project.live, "live-link"));
    body.append(meta, title, description, tags, links); card.append(visual, body); $("#project-grid").append(card);
  }
  $("#project-status").textContent = found.length + " of " + projects.length + " projects" + (category === "All" ? "" : " · " + category);
  $("#no-results").hidden = found.length !== 0;
  $("#clear-search").hidden = !$("#project-search").value;
}
function reset() {
  $("#project-search").value = ""; category = "All";
  document.querySelectorAll("[data-filter]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.filter === category)));
  renderProjects();
}
$("#project-search").addEventListener("input", renderProjects);
$("#clear-search").addEventListener("click", () => { $("#project-search").value = ""; renderProjects(); $("#project-search").focus(); });
$("#reset-filters").addEventListener("click", reset);
document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
  category = button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  renderProjects();
}));
renderProjects();
$("#copy-email").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(profile.email); $("#copy-status").textContent = "Email copied."; }
  catch { $("#copy-status").textContent = "Select and copy the email address above."; }
});
const dialog = $("#chat-dialog"), messages = $("#chat-messages"), input = $("#chat-input");
let conversation = [], busy = false, opener;
function openChat() { if (!dialog.open) { opener = document.activeElement; dialog.showModal(); } input.focus(); }
function appendMessage(role, text, error = false) {
  const item = document.createElement("div"); item.className = "message " + (role === "user" ? "user-message" : "assistant-message") + (error ? " error-message" : "");
  const content = document.createElement("p"); content.textContent = text; item.append(content); messages.append(item); messages.scrollTop = messages.scrollHeight;
}
$("#chat-launcher").addEventListener("click", openChat);
document.querySelectorAll("[data-open-chat]").forEach(button => button.addEventListener("click", openChat));
$("#close-chat").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => opener?.focus());
dialog.addEventListener("click", event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
async function ask(question) {
  question = question.trim();
  if (!question || busy) return;
  if (question.length > 800) { $("#chat-status").textContent = "Please keep your question under 800 characters."; return; }
  busy = true; input.value = ""; appendMessage("user", question);
  $("#send-chat").disabled = true; $("#clear-chat").disabled = true; $("#chat-status").textContent = "Thinking…";
  try {
    const response = await fetch("/api/chat", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:question,history:conversation.slice(-6)}),signal:AbortSignal.timeout(28000)});
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "The assistant is unavailable. Please try again shortly.");
    if (typeof result.answer !== "string" || !result.answer.trim()) throw new Error("The assistant returned an empty reply. Please try again.");
    appendMessage("assistant", result.answer);
    conversation.push({role:"user",content:question},{role:"assistant",content:result.answer});
    conversation = conversation.slice(-6);
    $("#chat-status").textContent = "AI can make mistakes. Check the linked project sources.";
  } catch (error) {
    const text = error.name === "TimeoutError" ? "The request took too long. Please try again." : !navigator.onLine ? "You're offline. Reconnect and try again." : error.message;
    appendMessage("assistant", text, true); $("#chat-status").textContent = "No AI answer received. You can retry your question.";
    input.value = question;
  } finally { busy = false; $("#send-chat").disabled = false; $("#clear-chat").disabled = false; if (dialog.open) input.focus(); }
}
$("#chat-form").addEventListener("submit", event => { event.preventDefault(); ask(input.value); });
document.querySelectorAll("[data-question]").forEach(button => button.addEventListener("click", () => { openChat(); ask(button.dataset.question); }));
$("#clear-chat").addEventListener("click", () => { if (busy) return; conversation = []; messages.replaceChildren(); appendMessage("assistant", "A fresh conversation. What would you like to know about Manan's portfolio?"); input.value = ""; input.focus(); });

