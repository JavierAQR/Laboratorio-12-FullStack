document.addEventListener('DOMContentLoaded', () => {
    const f = document.getElementById('f');
    const tok = document.getElementById('tok');
    const dbg = document.getElementById('debug');
  
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      tok.value = '';
      dbg.textContent = 'Enviando...';
  
      try {
        const form = new FormData(f);
        const payload = Object.fromEntries(form.entries());
  
        const res = await fetch('/auth/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload)
        });
  
        const text = await res.text();
        dbg.textContent = `HTTP ${res.status}\n` + text;
  
        let data;
        try { data = JSON.parse(text); } catch { data = null; }
  
        if (!res.ok) {
          tok.value = '';
          return;
        }
  
        if (data && data.token) {
          localStorage.setItem('token', data.token);
          tok.value = data.token;
          alert('Login OK. Rol: ' + (data.role || 'user'));
        } else {
          tok.value = '';
        }
      } catch (err) {
        dbg.textContent = 'Error de red o JS: ' + (err?.message || err);
      }
    });
  });
  