<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';
  import { fmtDate, toLocalInput, fromLocalInput } from '../lib/labels.js';

  let rows = [];
  let lots = [];
  let error = '';
  let form = {
    dyeLotId: '',
    testedAt: toLocalInput(),
    washRating: 3,
    rubRating: 3,
    lightRating: 3,
    pass: 'true',
    notes: '',
  };
  let editingId = null;

  async function load() {
    error = '';
    try {
      [rows, lots] = await Promise.all([
        api('/fastness-tests'),
        api('/dye-lots'),
      ]);
      if (!form.dyeLotId && lots[0]) form.dyeLotId = String(lots[0].id);
    } catch (e) {
      error = e.message;
    }
  }

  onMount(load);

  function reset() {
    form = {
      dyeLotId: lots[0] ? String(lots[0].id) : '',
      testedAt: toLocalInput(),
      washRating: 3,
      rubRating: 3,
      lightRating: 3,
      pass: 'true',
      notes: '',
    };
    editingId = null;
  }

  function edit(row) {
    editingId = row.id;
    form = {
      dyeLotId: String(row.dyeLotId),
      testedAt: toLocalInput(row.testedAt),
      washRating: row.washRating,
      rubRating: row.rubRating,
      lightRating: row.lightRating,
      pass: row.pass ? 'true' : 'false',
      notes: row.notes || '',
    };
  }

  async function save() {
    error = '';
    const payload = {
      dyeLotId: Number(form.dyeLotId),
      testedAt: fromLocalInput(form.testedAt),
      washRating: Number(form.washRating),
      rubRating: Number(form.rubRating),
      lightRating: Number(form.lightRating),
      pass: form.pass === 'true' || form.pass === true,
      notes: form.notes || undefined,
    };
    try {
      if (editingId) {
        await api(`/fastness-tests/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await api('/fastness-tests', {
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
    if (!confirm('确认删除该检测记录？')) return;
    try {
      await api(`/fastness-tests/${id}`, { method: 'DELETE' });
      await load();
    } catch (e) {
      error = e.message;
    }
  }
</script>

<header class="head">
  <h1>色牢度抽检</h1>
  <p>耐洗 / 耐摩擦 / 耐光评分（1–5）与合格判定</p>
</header>

{#if error}
  <div class="err">{error}</div>
{/if}

<section class="panel form">
  <h2>{editingId ? '编辑检测' : '新增检测'}</h2>
  <div class="fields">
    <label>
      染批
      <select bind:value={form.dyeLotId}>
        {#each lots as lot}
          <option value={lot.id}>{lot.lotCode} · {lot.colorName}</option>
        {/each}
      </select>
    </label>
    <label>检测时间<input type="datetime-local" bind:value={form.testedAt} /></label>
    <label>耐洗<input type="number" min="1" max="5" bind:value={form.washRating} /></label>
    <label>耐摩擦<input type="number" min="1" max="5" bind:value={form.rubRating} /></label>
    <label>耐光<input type="number" min="1" max="5" bind:value={form.lightRating} /></label>
    <label>
      合格
      <select bind:value={form.pass}>
        <option value="true">合格</option>
        <option value="false">不合格</option>
      </select>
    </label>
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
        <th>染批</th>
        <th>检测时间</th>
        <th>耐洗</th>
        <th>耐摩擦</th>
        <th>耐光</th>
        <th>结果</th>
        <th>备注</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          <td>{row.dyeLot?.lotCode || row.dyeLotId}</td>
          <td>{fmtDate(row.testedAt)}</td>
          <td>{row.washRating}</td>
          <td>{row.rubRating}</td>
          <td>{row.lightRating}</td>
          <td>
            <span class="badge" class:fail={!row.pass} class:ok={row.pass}>
              {row.pass ? '合格' : '不合格'}
            </span>
          </td>
          <td>{row.notes || '—'}</td>
          <td class="ops">
            <button class="link" on:click={() => edit(row)}>编辑</button>
            <button class="link danger" on:click={() => remove(row.id)}>删除</button>
          </td>
        </tr>
      {:else}
        <tr><td colspan="8">暂无数据</td></tr>
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
  select,
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
  .badge {
    display: inline-block;
    padding: 0.15rem 0.45rem;
    font-size: 0.78rem;
    border: 1px solid var(--line);
  }
  .ok {
    color: #7dcea0;
  }
  .fail {
    color: var(--crimson-400);
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
