<h1 align="center">📞 SPAM Tester</h1>

<p align="center">
Internal web application to initiate controlled outbound test calls and evaluate which numbers are flagged as spam on recipient devices.
</p>

<p align="center">
Built as a rapid prototype using Lovable to validate outbound call workflows before full Plivo integration.
</p>

<hr/>

<h2>🎯 Purpose</h2>

<p>The <strong>Weekday SPAM Tester</strong> is designed to:</p>

<ul>
  <li>Trigger outbound test calls from selected numbers</li>
  <li>Evaluate which numbers are marked as spam on target phones</li>
  <li>Track call initiation status</li>
  <li>Validate backend call API integration</li>
  <li>Serve as a proof-of-concept before production rollout</li>
</ul>

<p><strong>Note:</strong> This tool is strictly intended for internal testing using verified numbers.</p>

<hr/>

<h2>🛠 Tech Stack</h2>

<p>This project is built with:</p>

<ul>
  <li><strong>Vite</strong></li>
  <li><strong>TypeScript</strong></li>
  <li><strong>React</strong></li>
  <li><strong>shadcn-ui</strong></li>
  <li><strong>Tailwind CSS</strong></li>
</ul>

<p>
Backend call initiation is handled via a server function 
(currently integrated with Twilio for testing; designed to switch to Plivo in production).
</p>

<hr/>

<h2>🧩 Architecture Overview</h2>

<h3>Frontend (React + Vite)</h3>

<ul>
  <li>Accepts list of outbound numbers</li>
  <li>Accepts target recipient number</li>
  <li>Displays initiation status per number</li>
  <li>Provides success/failure feedback</li>
</ul>

<h3>Backend (Server / Edge Function)</h3>

<ul>
  <li>Receives list of numbers and target number</li>
  <li>Initiates outbound calls via Voice API</li>
  <li>Returns call status metadata</li>
  <li>Designed to be provider-agnostic (Twilio → Plivo swap ready)</li>
</ul>

<hr/>

<h2>🔁 Call Flow (Prototype Phase)</h2>

<ol>
  <li>User enters:
    <ul>
      <li>Source numbers (test list)</li>
      <li>Target number (recipient device)</li>
    </ul>
  </li>
  <li>User clicks <strong>Initiate Calls</strong></li>
  <li>Backend triggers outbound calls</li>
  <li>Recipient device displays incoming call</li>
  <li>Tester manually observes:
    <ul>
      <li>Whether number appears normal</li>
      <li>Whether number is flagged as spam</li>
    </ul>
  </li>
</ol>

<hr/>

<p align="center">
Built as an internal operational testing prototype.
</p>
