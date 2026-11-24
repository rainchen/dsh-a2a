/**
 * TaskRunner 的 DSH 实现：把一条 A2A 消息翻译成 DSH 侧的一轮执行。
 *
 * 三种模式（config.mode）：
 * - `echo`  回显文本（验证 A2A 链路）；
 * - `llm`   `ctx.llm` 直接生成回复（自包含轻量模式，不建 agent 会话）；
 * - `agent` 转交给 DSH agent 会话（默认）：每个 A2A contextId 对应一个
 *           持久 agent 会话（可跨任务续答、可落盘跨重启恢复），回复文本
 *           以 artifact 返回。
 *
 * agent 模式复用 dsh-feishu-bot 的会话管理经验：
 * - 配置 agentId > contextId 绑定的自动会话（resume 持久映射 > 新建）；
 * - 新建时挂 preset（agentPresets）与工作目录；
 * - 回复文本从会话日志按 seq 收集（snapshotEvents/events 双兼容）；
 * - running 中收到新消息走 steer（下一 step 边界消费）。
 *
 * @module dsh-a2a/bridge
 */
import type { Context } from '@deepseek-ai/cordis';
import type { A2aRunner } from './server.ts';
import type { ContextSessionStore } from './persistence.ts';
/** 桥接配置（index.ts Config 的子集）。 */
export interface BridgeConfig {
    mode: 'echo' | 'llm' | 'agent';
    provider?: string;
    model?: string;
    systemPrompt?: string;
    maxHistory?: number;
    agentId?: string;
    agentPreset?: string;
    workspace?: string;
    persistSessions?: boolean;
}
export declare function createRunner(ctx: Context, config: BridgeConfig, store?: ContextSessionStore): A2aRunner;
/**
 * 把 cwd 落在配置 `workspace` 目录下、但尚未记账的历史会话补登记进该分组。
 *
 * 建会话时的登记只覆盖新会话；插件启用前遗留的 A2A 会话仍留在「未分组」。
 * 宿主的 bootstrap 只在 Workspace 注册表首次初始化时按 cwd 归组一次、之后
 * 不再重跑，所以这些会话不会自愈。此函数在建会话登记之外补一次：只登记
 * 头 cwd 与配置目录一致的会话，已在记账中的跳过，失败只记日志。
 * @param ctx - 插件上下文。
 * @param cwd - 配置的工作目录（`config.workspace` 或进程 cwd）。
 */
export declare function adoptOrphanSessions(ctx: Context, cwd: string): Promise<void>;
//# sourceMappingURL=bridge.d.ts.map