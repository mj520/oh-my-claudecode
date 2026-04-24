import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { cleanupTransientState } from '../../hooks/session-end/index.js';

describe('cleanupTransientState — session-scoped hud-stdin-cache', () => {
  let tmpRoot: string;

  beforeEach(() => {
    tmpRoot = mkdtempSync(join(tmpdir(), 'omc-session-end-cleanup-'));
  });

  afterEach(() => {
    rmSync(tmpRoot, { recursive: true, force: true });
  });

  it('removes a per-session hud-stdin-cache.json and prunes the empty session directory', () => {
    // Simulate the tree that `writeStdinCache` leaves behind after a session.
    const sessionDir = join(tmpRoot, '.omc', 'state', 'sessions', 'session-aaa');
    mkdirSync(sessionDir, { recursive: true });
    const cacheFile = join(sessionDir, 'hud-stdin-cache.json');
    writeFileSync(cacheFile, '{}');

    const removed = cleanupTransientState(tmpRoot);

    expect(existsSync(cacheFile)).toBe(false);
    expect(existsSync(sessionDir)).toBe(false);
    // Sanity: at least one unlink + one rmdir happened.
    expect(removed).toBeGreaterThanOrEqual(2);
  });

  it('preserves session directories that still have non-transient state', () => {
    const sessionDir = join(tmpRoot, '.omc', 'state', 'sessions', 'session-bbb');
    mkdirSync(sessionDir, { recursive: true });
    writeFileSync(join(sessionDir, 'hud-stdin-cache.json'), '{}');
    // A state file that should NOT be cleaned (only transient files are targeted).
    const keep = join(sessionDir, 'ralph-state.json');
    writeFileSync(keep, '{"active":true}');

    cleanupTransientState(tmpRoot);

    expect(existsSync(join(sessionDir, 'hud-stdin-cache.json'))).toBe(false);
    expect(existsSync(keep)).toBe(true);
    // Directory must remain because `ralph-state.json` is still there.
    expect(existsSync(sessionDir)).toBe(true);
  });

  it('still removes the legacy top-level hud-stdin-cache.json', () => {
    // Regression: don't drop the old flat-path cleanup path used by session-less callers.
    const stateDir = join(tmpRoot, '.omc', 'state');
    mkdirSync(stateDir, { recursive: true });
    const legacy = join(stateDir, 'hud-stdin-cache.json');
    writeFileSync(legacy, '{}');

    cleanupTransientState(tmpRoot);

    expect(existsSync(legacy)).toBe(false);
  });
});
