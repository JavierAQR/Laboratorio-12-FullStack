document.addEventListener('DOMContentLoaded', () => {
    const out = document.getElementById('out');
    const out2 = document.getElementById('out2');
    const btn = document.getElementById('btn');
    const admin = document.getElementById('admin');
    const token = localStorage.getItem('token') || '';
  
    function renderList(data) {
      if (!data) return '<p>No hay datos.</p>';
  
      if (Array.isArray(data)) {
        if (data.length === 0) return '<p>No hay usuarios registrados.</p>';
        return `
          <ul>
            ${data.map(u => `
              <li>
                <strong>ID:</strong> ${u.id}<br>
                <strong>Email:</strong> ${u.email}<br>
                <strong>Rol:</strong> ${u.role}<br>
                <strong>Creado:</strong> ${new Date(u.created_at).toLocaleString()}
              </li>
            `).join('')}
          </ul>
        `;
      }
  
      return `
        <ul>
          <li><strong>ID:</strong> ${data.id}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Rol:</strong> ${data.role}</li>
          <li><strong>Creado:</strong> ${new Date(data.created_at).toLocaleString()}</li>
        </ul>
      `;
    }

    btn.addEventListener('click', async () => {
      out.textContent = 'Cargando...';
      try {
        const res = await fetch('/api/me', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch { data = null; }
        if (res.ok && data) {
          out.innerHTML = renderList(data);
        } else {
          out.textContent = `Error ${res.status}: ${text}`;
        }
      } catch (err) {
        out.textContent = 'Error: ' + (err?.message || err);
      }
    });

    admin.addEventListener('click', async () => {
      out2.textContent = 'Cargando...';
      try {
        const res = await fetch('/api/admin/usuarios', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch { data = null; }
        if (res.ok && data) {
          out2.innerHTML = renderList(data);
        } else {
          out2.textContent = `Error ${res.status}: ${text}`;
        }
      } catch (err) {
        out2.textContent = 'Error: ' + (err?.message || err);
      }
    });
  });
  