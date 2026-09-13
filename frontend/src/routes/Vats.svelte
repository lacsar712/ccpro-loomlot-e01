<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';
  import { VAT_STATUS } from '../lib/labels.js';

  let rows = [];
  let houses = [];
  let error = '';
  let form = {
    dyeHouseId: '',
    vatCode: '',
    capacityKg: 500,
    status: 'ready',
  };
  let editingId = null;

  async function load() {
    error = '';
    try {
      [rows, houses] = await Promise.all([api('/vats'), api('/dye-houses')]);
      if (!form.dyeHouseId && houses[0]) form.dyeHouseId = String(houses[0].id);
    } catch (e) {
      error = e.message;
    }
  }

  onMount(load);

  function reset() {
    form = {
      dyeHouseId: houses[0] ? String(houses[0].id) : '',
      vatCode: '',
      capacityKg: 500,
      status: 'ready',
    };
    editingId = null;
  }

  function edit(row) {
    editingId = row.id;
    form = {
      dyeHouseId: String(row.dyeHouseId),
      vatCode: row.vatCode,
      capacityKg: Number(row.capacityKg),
      status: row.status,
    };
  }

  async function save() {
    error = '';
    const payload = {
      dyeHouseId: Number(form.dyeHouseId),
      vatCode: form.vatCode,
      capacityKg: Number(form.capacityKg),
      status: form.status,
    };
    try {
      if (editingId) {
        await api(`/vats/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await api('/vats', { method: 'POST', body: JSON.stringify(payload) });
      }
      reset();
      await load();
    } catch (e) {
      error = e.message;
    }
  }

  async function remove(id) {
    if (!confirm('确认删除该染缸？')) return;
    try {
      await api(`/vats/${id}`, { method: 'DELETE' });
      await load();
    } catch (e) {
      error = e.message;
    }
  }
</script>

<header class="head">
  <h1>染缸</h1>
  <p>同厂缸号唯一 · 状态：就绪 / 占用 / 维护</p>
</header>

{#if error}
  <div class="err">{error}</div>
{/if}

<section class="panel form">
  <h2>{editingId ? '编辑染缸' : '新增染缸'}</h2>
  <div class="fields">
    <label>
      所属染坊
      <select bind:value={form.dyeHouseId}>
        {#each houses as h}
          <option value={h.id}>{h.name}</option>
        {/each}
      </select>
    </label>
    <label>缸号<input bind:value={form.vatCode} /></label>
    <label>容量 (kg)<input type="number" bind:value={form.capacityKg} /></label>
    <label>
      状态
      <select bind:value={form.status}>
        {#each Object.entries(VAT_STATUS) as [k, v]}
          <option value={k}>{v}</option>
        {/each}
      </select>
    </label>
  </div>
  <div class="actions">
    <button on:click={save}>{editingId ? '保存' : '创建'}</button>
    {#if editingId}
      <button class="ghost" on:click={reset}>取消</button>
    {/if}
  </div>
</section>

<section class="panel">
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>染坊</th>
        <th>缸号</th>
        <th>容量kg</th>
        <th>状态</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          <td>{row.id}</td>
          <td>{row.dyeHouse?.name || row.dyeHouseId}</td>
          <td>{row.vatCode}</td>
          <td>{row.capacityKg}</td>
          <td><span class="badge {row.status}">{VAT_STATUS[row.status] || row.status}</span></td>
          <td class="ops">
            <button class="link" on:click={() => edit(row)}>编辑</button>
            <button class="link danger" on:click={() => remove(row.id)}>删除</button>
          </td>
        </tr>
      {:else}
        <tr><td colspan="6">暂无数据</td></tr>
      {/each}
    </tbody>
  </table>
</section>

<style>
  .head h1 {
    margin: 0;
    font-family: var(--font-display);
    letter-spacing: 0.06em;
  }
  .head p {
    margin: 0.35rem 0 1.2rem;
    color: var(--indigo-400);
  }
  .panel {
    background: rgba(19, 42, 64, 0.72);
    border: 1px solid var(--line);
    padding: 1rem 1.1rem 1.15rem;
    margin-bottom: 1rem;
  }
  .form h2 {
    margin: 0 0 0.8rem;
    font-size: 1rem;
  }
  .fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  label {
    display: grid;
    gap: 0.3rem;
    font-size: 0.8rem;
    color: var(--steel);
  }
  input,
  select {
    border: 1px solid var(--line);
    background: rgba(0, 0, 0, 0.25);
    color: white;
    padding: 0.55rem 0.65rem;
  }
  .actions {
    margin-top: 0.9rem;
    display: flex;
    gap: 0.5rem;
  }
  button {
    border: none;
    background: linear-gradient(90deg, var(--crimson-800), var(--indigo-600));
    color: white;
    padding: 0.55rem 1rem;
    cursor: pointer;
  }
  .ghost {
    background: transparent;
    border: 1px solid var(--line);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }
  th,
  td {
    text-align: left;
    padding: 0.65rem 0.4rem;
    border-bottom: 1px solid var(--line);
  }
  th {
    color: var(--indigo-400);
    font-weight: 500;
  }
  .badge {
    display: inline-block;
    padding: 0.15rem 0.45rem;
    font-size: 0.78rem;
    border: 1px solid var(--line);
  }
  .badge.ready {
    color: #7dcea0;
  }
  .badge.busy {
    color: #ff8a98;
  }
  .badge.maintenance {
    color: #e0c36a;
  }
  .link {
    background: none;
    border: none;
    color: var(--indigo-400);
    padding: 0 0.35rem;
    cursor: pointer;
  }
  .danger {
    color: var(--crimson-400);
  }
  .err {
    color: var(--crimson-400);
    margin-bottom: 0.8rem;
  }
</style>
