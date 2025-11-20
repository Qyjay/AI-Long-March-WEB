/**
 * 前端 LangChain 大模型封装
 * - 为 story/poem/qa 提供不同系统提示词（仅使用用户输入）
 * - 为每个 tab 维护独立会话记忆（MessageLike[]）
 * - 暴露统一 ask/askStream 方法用于调用
 */
import { ChatOpenAI } from '@langchain/openai';

// 尝试从不同入口获取 ChatOpenAI，兼容不同版本的 LangChain

export type TabType = 'story' | 'poem' | 'qa';

type MessageLike = { role: 'system' | 'user' | 'assistant'; content: string };

export interface LlmClientConfig {
  /** 模型名称，如 gpt-4o-mini 或 gpt-3.5-turbo 等 */
  model?: string;
  /** 模型服务的 Base URL */
  baseUrl?: string;
  /** API Key（仅在 mock/本地调试用，勿用于生产前端） */
  apiKey?: string;
}

/** 获取不同 tab 的系统提示词 */
function getSystemPrompt(tab: TabType): string {
  if (tab === 'story') return '你的名字叫长小征，你是一个历史剧情顾问。围绕长征相关的历史事件进行合乎史实、连贯的叙述与解释。';
  if (tab === 'poem') return '你的名字叫长小征，你是一位诗词赏析助手。针对长征相关诗词进行结构化、清晰的赏析与讲解。';
  return '你的名字叫长小征，你是一位历史问答助手，回答关于长征及相关历史的问题，要求准确、简洁。';
}

/** 构建各 tab 独立的会话记忆（包含系统提示） */
function buildHistories(): Record<TabType, MessageLike[]> {
  return {
    story: [{ role: 'system', content: getSystemPrompt('story') }],
    poem: [{ role: 'system', content: getSystemPrompt('poem') }],
    qa: [{ role: 'system', content: getSystemPrompt('qa') }]
  };
}

/** 提取模型返回内容中的文本 */
function extractText(content: any): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    const part = content.find((p: any) => typeof p?.text === 'string');
    return part?.text ?? '';
  }
  return '';
}

/**
 * 创建 LangChain 大模型客户端
 * - 读取配置构建 ChatOpenAI
 * - 初始化各 tab 的提示词与记忆
 * @param config 模型、Base URL 与 API Key 配置
 * @returns 包含 ask 方法的客户端对象
 */
export function createLlmClient(config?: LlmClientConfig) {
  const model = String(
    ((import.meta as any).env?.VITE_LLM_MODEL ?? config?.model ?? 'gpt-4o-mini')
  ).trim();
  const rawBase = (import.meta as any).env?.VITE_OPENAI_BASE_URL ?? '';
  const baseUrl = String(rawBase).trim();
  const rawKey = (import.meta as any).env?.VITE_OPENAI_API_KEY ?? '';
  const apiKey = String(rawKey).trim();

  if (!baseUrl) {
    throw new Error('VITE_OPENAI_BASE_URL 未配置或为空');
  }
  if (!apiKey) {
    throw new Error('VITE_OPENAI_API_KEY 未配置或为空');
  }

  const llm = new ChatOpenAI({
    model,
    temperature: 0.7,
    apiKey,
    // 强制仅使用 .env 提供的基础 URL，不回退默认域名
    configuration: { baseURL: baseUrl, dangerouslyAllowBrowser: true }
  });

  const histories = buildHistories();

  return {
    /**
     * 执行一次大模型调用（非流式）
     * @param tab 对话类别：story/poem/qa
     * @param input 用户输入文本
     * @param extra 额外上下文字段（用于填充模板占位符）
     * @returns 模型返回的字符串结果
     */
    async ask(tab: TabType, input: string, _extra?: Record<string, any>): Promise<string> {
      const messages: MessageLike[] = [...histories[tab], { role: 'user', content: input }];
      const aiMsg: any = await llm.invoke(messages as any);
      const content = extractText(aiMsg?.content);
      // 将本轮对话追加到历史
      histories[tab].push({ role: 'user', content: input });
      histories[tab].push({ role: 'assistant', content });
      return (content || '').toString();
    },
    /**
     * 执行一次大模型调用（流式输出）
     * @param tab 对话类别：story/poem/qa
     * @param input 用户输入文本
     * @returns 异步迭代器，逐段返回文本增量
     */
    async *askStream(tab: TabType, input: string): AsyncGenerator<string> {
      const messages: MessageLike[] = [...histories[tab], { role: 'user', content: input }];
      let fullText = '';
      try {
        const stream = await (llm as any).stream(messages as any);
        for await (const chunk of stream as AsyncIterable<any>) {
          const delta = extractText(chunk?.content);
          if (!delta) continue;
          fullText += delta;
          yield delta;
        }
      } catch (_) {
        const aiMsg: any = await llm.invoke(messages as any);
        const content = extractText(aiMsg?.content);
        fullText = (content || '').toString();
        if (fullText) yield fullText;
      }
      histories[tab].push({ role: 'user', content: input });
      histories[tab].push({ role: 'assistant', content: fullText });
    }
  };
}
