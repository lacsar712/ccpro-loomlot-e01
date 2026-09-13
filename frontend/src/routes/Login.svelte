<script>
  import { api } from '../lib/api.js';
  import { setSession } from '../lib/auth.js';

  let username = 'admin';
  let password = '123456';
  let loading = false;
  let error = '';

  async function submit() {
    error = '';
    loading = true;
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      setSession(data.accessToken, data.user);
    } catch (e) {
      error = e.message || '登录失败';
    } finally {
      loading = false;
    }
  }
</script>

<div class="login">
  <div class="panel">
    <div class="eyebrow">染坊工控台</div>
    <h1>LoomLot</h1>
    <p>缸染批次调度与色牢度抽检标注种子</p>
    <form on:submit|preventDefault={submit}>
      <label>
        账号
        <input bind:value={username} autocomplete="username" />
      </label>
      <label>
        密码
        <input type="password" bind:value={password} autocomplete="current-password" />
      </label>
      {#if error}
        <div class="err">{error}</div>
      {/if}
      <button type="submit" disabled={loading}>
        {loading ? '登录中…' : '进入车间'}
      </button>
    </form>
    <div class="hint">演示账号 admin / dyer，密码均为 123456</div>
  </div>
</div>

<style>
  .login {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 2rem;
    background:
      linear-gradient(120deg, rgba(11, 28, 44, 0.55), rgba(139, 26, 43, 0.28)),
      repeating-linear-gradient(
        -18deg,
        transparent,
        transparent 12px,
        rgba(255, 255, 255, 0.015) 12px,
        rgba(255, 255, 255, 0.015) 13px
      );
  }

  .panel {
    width: min(420px, 100%);
    padding: 2.2rem 2rem 1.8rem;
    background: var(--panel);
    border: 1px solid var(--line);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  }

  .eyebrow {
    color: var(--crimson-400);
    letter-spacing: 0.28em;
    text-transform: uppercase;
    font-size: 0.72rem;
    font-weight: 500;
  }

  h1 {
    margin: 0.45rem 0 0.35rem;
    font-family: var(--font-display);
    font-size: 2.6rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  p {
    margin: 0 0 1.5rem;
    color: var(--indigo-400);
    font-size: 0.92rem;
  }

  form {
    display: grid;
    gap: 0.9rem;
  }

  label {
    display: grid;
    gap: 0.35rem;
    font-size: 0.82rem;
    color: var(--steel);
  }

  input {
    border: 1px solid var(--line);
    background: rgba(0, 0, 0, 0.28);
    color: white;
    padding: 0.7rem 0.8rem;
    outline: none;
  }

  input:focus {
    border-color: var(--indigo-600);
  }

  button {
    margin-top: 0.4rem;
    border: none;
    background: linear-gradient(90deg, var(--crimson-800), var(--indigo-600));
    color: white;
    padding: 0.85rem;
    cursor: pointer;
    font-weight: 600;
    letter-spacing: 0.08em;
  }

  button:disabled {
    opacity: 0.6;
    cursor: wait;
  }

  .err {
    color: var(--crimson-400);
    font-size: 0.85rem;
  }

  .hint {
    margin-top: 1.1rem;
    font-size: 0.78rem;
    color: rgba(197, 206, 216, 0.7);
  }
</style>
