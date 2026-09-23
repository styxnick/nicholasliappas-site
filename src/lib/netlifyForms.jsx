// Shared Netlify Forms submission.
// Field names sent here MUST match the hidden mirror forms in index.html —
// Netlify only stores fields it discovered there at deploy time.
export const HONEYPOT_FIELD = 'bot-field';

export async function submitNetlifyForm(formName, fields) {
  // Honeypot tripped: a bot filled the hidden field. Pretend success, send nothing.
  if (fields[HONEYPOT_FIELD]) return;

  const body = new URLSearchParams({ 'form-name': formName, ...fields }).toString();
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  if (!res.ok) throw new Error(`Form POST failed: ${res.status}`);
}

// Visually-hidden honeypot input. Must be rendered inside the <form>.
export function HoneypotField({ value, onChange }) {
  return (
    <p hidden aria-hidden="true">
      <label>
        Don't fill this out if you're human:{' '}
        <input name={HONEYPOT_FIELD} value={value} onChange={onChange} tabIndex={-1} autoComplete="off" />
      </label>
    </p>
  );
}
