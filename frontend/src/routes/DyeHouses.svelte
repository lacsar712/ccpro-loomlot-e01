<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';

  let rows = [];
  let error = '';
  let form = { name: '', address: '', notes: '' };
  let editingId = null;

  async function load() {
    error = '';
    try {
      rows = await api('/dye-houses');
    } catch (e) {
      error = e.message;
    }
  }

  onMount(load);

  function reset() {
    form = { name: '', address: '', notes: '' };
    editingId = null;
  }

  function edit(row) {
    editingId = row.id;
    form = {
      name: row.name || '',
      address: row.address || '',
      notes: row.notes || '',
    };
  }

  async function save() {
    error = '';
    try {
      if (editingId) {
        await api(`/dye-houses/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
      } else {
        await api('/dye-houses', {
          method: 'POST',
          body: JSON.stringify(form),
        });
      }
      reset();
      await load();
    } catch (e) {
      error = e.message;
    }
  }

  async function remove(id) {
    if (!confirm('确认删除该染坊？')) return;
    try {
      await api(`/dye-houses/${id}`, { method: 'DELETE' });
      await load();
    } catch (e) {
      error = e.message;
    }
  }
</script>

<header class="head">
  <h1>染坊</h1>
  <p>管理染厂基础信息（非库存仓）</p>
</header>

{#if error}
  <div class="err">{error}</div>
{/if}

<section class="panel form">
  <h2>{editingId ? '编辑染坊' : '新增染坊'}</h2>
  <div class="fields">
    <label>名称<input bind:value={form.name} /></label>
    <label>地址<input bind:value={form.address} /></label>
    <label class="full">备注<textarea rows="2" bind:value={form.notes} /></label>
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
        <th>名称</th>
        <th>地址</th>
        <th>备注</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          <td>{row.id}</td>
          <td>{row.name}</td>
          <td>{row.address || '—'}</td>
          <td>{row.notes || '—'}</td>
          <td class="ops">
            <button class="link" on:click={() => edit(row)}>编辑</button>
            <button class="link danger" on:click={() => remove(row.id)}>删除</button>
          </td>
        </tr>
      {:else}
        <tr><td colspan="5">暂无数据</td></tr>
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
  .full {
    grid-column: 1 / -1;
  }
  label {
    display: grid;
    gap: 0.3rem;
    font-size: 0.8rem;
    color: var(--steel);
  }
  input,
  textarea {
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
    vertical-align: top;
  }
  th {
    color: var(--indigo-400);
    font-weight: 500;
  }
  .ops {
    white-space: nowrap;
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
