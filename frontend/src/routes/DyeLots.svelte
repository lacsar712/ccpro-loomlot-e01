<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';
  import { LOT_STATUS, fmtDate, toLocalInput, fromLocalInput } from '../lib/labels.js';

  let rows = [];
  let vats = [];
  let error = '';
  let form = {
    vatId: '',
    lotCode: '',
    fabricType: '',
    colorName: '',
    startAt: toLocalInput(),
    status: 'queued',
  };
  let editingId = null;

  async function load() {
    error = '';
    try {
      [rows, vats] = await Promise.all([api('/dye-lots'), api('/vats')]);
      if (!form.vatId && vats[0]) form.vatId = String(vats[0].id);
    } catch (e) {
      error = e.message;
    }
  }

  onMount(load);

  function reset() {
    form = {
      vatId: vats[0] ? String(vats[0].id) : '',
      lotCode: '',
      fabricType: '',
      colorName: '',
      startAt: toLocalInput(),
      status: 'queued',
    };
    editingId = null;
  }

  function edit(row) {
    editingId = row.id;
    form = {
      vatId: String(row.vatId),
      lotCode: row.lotCode,
      fabricType: row.fabricType,
      colorName: row.colorName,
      startAt: toLocalInput(row.startAt),
      status: row.status,
    };
  }

  async function save() {
    error = '';
    const payload = {
      vatId: Number(form.vatId),
      lotCode: form.lotCode,
      fabricType: form.fabricType,
      colorName: form.colorName,
      startAt: fromLocalInput(form.startAt),
      status: form.status,
    };
    try {
      if (editingId) {
        await api(`/dye-lots/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await api('/dye-lots', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      reset();
      await load();
    } catch (e) {
      error = e.message;
    }
  }

  async function remove(id) {
    if (!confirm('确认删除该染批？')) return;
    try {
      await api(`/dye-lots/${id}`, { method: 'DELETE' });
      await load();
    } catch (e) {
      error = e.message;
    }
  }

  function vatLabel(v) {
    const house = v.dyeHouse?.name ? `${v.dyeHouse.name} / ` : '';
    return `${house}${v.vatCode}`;
  }
</script>

<header class="head">
  <h1>染批</h1>
  <p>染程状态：排队 · 染程中 · 漂洗 · 完成 · 返工</p>
</header>

{#if error}
  <div class="err">{error}</div>
{/if}

<section class="panel form">
  <h2>{editingId ? '编辑染批' : '新增染批'}</h2>
  <div class="fields">
    <label>
      染缸
      <select bind:value={form.vatId}>
        {#each vats as v}
          <option value={v.id}>{vatLabel(v)}</option>
        {/each}
      </select>
    </label>
    <label>批号<input bind:value={form.lotCode} /></label>
    <label>面料<input bind:value={form.fabricType} /></label>
    <label>色名<input bind:value={form.colorName} /></label>
    <label>开始时间<input type="datetime-local" bind:value={form.startAt} /></label>
    <label>
      状态
      <select bind:value={form.status}>
        {#each Object.entries(LOT_STATUS) as [k, v]}
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
        <th>批号</th>
        <th>染缸</th>
        <th>面料</th>
        <th>色名</th>
        <th>开始</th>
        <th>状态</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          <td>{row.lotCode}</td>
          <td>{row.vat?.vatCode || row.vatId}</td>
          <td>{row.fabricType}</td>
          <td>{row.colorName}</td>
          <td>{fmtDate(row.startAt)}</td>
          <td><span class="badge {row.status}">{LOT_STATUS[row.status] || row.status}</span></td>
          <td class="ops">
            <button class="link" on:click={() => edit(row)}>编辑</button>
            <button class="link danger" on:click={() => remove(row.id)}>删除</button>
          </td>
        </tr>
      {:else}
        <tr><td colspan="7">暂无数据</td></tr>
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
    grid-template-columns: 1fr 1fr 1fr;
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
  .badge.running {
    color: #ff8a98;
  }
  .badge.done {
    color: #7dcea0;
  }
  .badge.rework {
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
  @media (max-width: 900px) {
    .fields {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
