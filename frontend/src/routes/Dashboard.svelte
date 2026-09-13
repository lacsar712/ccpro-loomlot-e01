<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';

  let data = null;
  let error = '';
  let loading = true;

  onMount(async () => {
    try {
      data = await api('/dashboard');
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });
</script>

<header class="head">
  <h1>仪表盘</h1>
  <p>染缸产能与近 7 日色牢度抽检概览</p>
</header>

{#if loading}
  <div class="muted">加载中…</div>
{:else if error}
  <div class="err">{error}</div>
{:else if data}
  <div class="grid">
    <article>
      <div class="k">染缸数</div>
      <div class="v">{data.vatCount}</div>
    </article>
    <article>
      <div class="k">染程中批次</div>
      <div class="v accent">{data.runningLots}</div>
    </article>
    <article>
      <div class="k">近 7 日检测</div>
      <div class="v">{data.recentTests7d}</div>
    </article>
    <article>
      <div class="k">不合格总数</div>
      <div class="v fail">{data.failCount}</div>
    </article>
  </div>
{/if}

<style>
  .head h1 {
    margin: 0;
    font-family: var(--font-display);
    letter-spacing: 0.06em;
    font-size: 1.9rem;
  }

  .head p {
    margin: 0.4rem 0 1.4rem;
    color: var(--indigo-400);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }

  article {
    padding: 1.2rem 1.1rem;
    background: rgba(19, 42, 64, 0.7);
    border: 1px solid var(--line);
    border-top: 3px solid var(--indigo-600);
  }

  article:nth-child(2) {
    border-top-color: var(--crimson-600);
  }

  article:nth-child(4) {
    border-top-color: var(--fail);
  }

  .k {
    color: var(--steel);
    font-size: 0.85rem;
  }

  .v {
    margin-top: 0.55rem;
    font-family: var(--font-display);
    font-size: 2.4rem;
    letter-spacing: 0.04em;
  }

  .accent {
    color: #ff8a98;
  }

  .fail {
    color: var(--crimson-400);
  }

  .muted,
  .err {
    color: var(--steel);
  }

  .err {
    color: var(--crimson-400);
  }

  @media (max-width: 900px) {
    .grid {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
