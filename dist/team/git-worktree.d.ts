export interface WorktreeInfo {
    path: string;
    branch: string;
    workerName: string;
    teamName: string;
    createdAt: string;
    repoRoot?: string;
    created?: boolean;
    reused?: boolean;
    detached?: boolean;
}
export interface CleanupWorktreeResult {
    removed: WorktreeInfo[];
    preserved: Array<{
        info: WorktreeInfo;
        reason: string;
    }>;
}
/** Get canonical native team worktree path for a worker. */
export declare function getWorkerWorktreePath(repoRoot: string, teamName: string, workerName: string): string;
/**
 * Create or reuse a git worktree for a team worker.
 *
 * Existing clean compatible worktrees are reused. Dirty registered worktrees are
 * preserved and rejected with `worktree_dirty` instead of being force-removed.
 */
export declare function createWorkerWorktree(teamName: string, workerName: string, repoRoot: string, baseBranch?: string): WorktreeInfo;
/** Remove a worker's clean worktree and branch; preserve dirty worktrees. */
export declare function removeWorkerWorktree(teamName: string, workerName: string, repoRoot: string): void;
/** List all worktrees for a team. */
export declare function listTeamWorktrees(teamName: string, repoRoot: string): WorktreeInfo[];
/** Remove all clean worktrees for a team; preserve dirty worktrees. */
export declare function cleanupTeamWorktrees(teamName: string, repoRoot: string): CleanupWorktreeResult;
//# sourceMappingURL=git-worktree.d.ts.map