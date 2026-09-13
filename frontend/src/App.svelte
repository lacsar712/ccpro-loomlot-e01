<script>
  import { token, user, clearSession } from './lib/auth.js';
  import Login from './routes/Login.svelte';
  import Dashboard from './routes/Dashboard.svelte';
  import DyeHouses from './routes/DyeHouses.svelte';
  import Vats from './routes/Vats.svelte';
  import DyeLots from './routes/DyeLots.svelte';
  import FastnessTests from './routes/FastnessTests.svelte';

  let page = 'dashboard';

  const nav = [
    { id: 'dashboard', label: '仪表盘' },
    { id: 'houses', label: '染坊' },
    { id: 'vats', label: '染缸' },
    { id: 'lots', label: '染批' },
    { id: 'tests', label: '色牢度' },
  ];

  function logout() {
    clearSession();
    page = 'dashboard';
  }
</script>

{#if !$token}
  <Login />
{:else}
  <div class="shell">
    <aside class="side">
      <div class="brand">
        <div class="mark">LL</div>
        <div>
          <div class="name">LoomLot</div>
          <div class="tag">缸染 · 色牢度抽检</div>
        </div>
      </div>
      <nav>
        {#each nav as item}
          <button
            class:active={page === item.id}
            on:click={() => (page = item.id)}
          >
            {item.label}
          </button>
        {/each}
      </nav>
      <div class="side-foot">
        <div class="who">{$user?.displayName || $user?.username}</div>
        <div class="role">{$user?.role}</div>
        <button class="ghost" on:click={logout}>退出</button>
      </div>
    </aside>
    <main class="main">
      {#if page === 'dashboard'}
        <Dashboard />
      {:else if page === 'houses'}
        <DyeHouses />
      {:else if page === 'vats'}
        <Vats />
      {:else if page === 'lots'}
        <DyeLots />
      {:else}
        <FastnessTests />
      {/if}
    </main>
  </div>
{/if}

<style>
  .shell {
    display: grid;
    grid-template-columns: 240px 1fr;
    min-height: 100vh;
  }

  .side {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem 1.1rem;
    border-right: 1px solid var(--line);
    background: linear-gradient(180deg, rgba(11, 28, 44, 0.95), rgba(19, 20, 28, 0.88));
    backdrop-filter: blur(8px);
  }

  .brand {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    padding: 0.25rem 0.4rem 1rem;
    border-bottom: 1px solid var(--line);
  }

  .mark {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    font-family: var(--font-display);
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--mist);
    background: linear-gradient(135deg, var(--crimson-800), var(--indigo-600));
    clip-path: polygon(8% 0, 100% 0, 92% 100%, 0 100%);
  }

  .name {
    font-family: var(--font-display);
    font-size: 1.35rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .tag {
    font-size: 0.75rem;
    color: var(--indigo-400);
    margin-top: 0.15rem;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex: 1;
  }

  nav button {
    text-align: left;
    border: 1px solid transparent;
    background: transparent;
    color: var(--steel);
    padding: 0.7rem 0.85rem;
    cursor: pointer;
    border-radius: 2px;
    transition: 0.15s ease;
  }

  nav button:hover {
    background: rgba(44, 90, 160, 0.18);
    color: white;
  }

  nav button.active {
    background: linear-gradient(90deg, rgba(196, 30, 58, 0.28), rgba(44, 90, 160, 0.2));
    border-color: rgba(196, 30, 58, 0.45);
    color: white;
  }

  .side-foot {
    padding-top: 1rem;
    border-top: 1px solid var(--line);
    font-size: 0.85rem;
  }

  .who {
    font-weight: 500;
  }

  .role {
    color: var(--indigo-400);
    margin: 0.2rem 0 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-size: 0.72rem;
  }

  .ghost {
    width: 100%;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--steel);
    padding: 0.55rem;
    cursor: pointer;
  }

  .ghost:hover {
    border-color: var(--crimson-600);
    color: white;
  }

  .main {
    padding: 1.75rem 2rem 2.5rem;
    overflow: auto;
  }

  @media (max-width: 860px) {
    .shell {
      grid-template-columns: 1fr;
    }
    .side {
      border-right: none;
      border-bottom: 1px solid var(--line);
    }
    nav {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
</style>
