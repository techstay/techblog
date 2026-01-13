---
category:
  - tutorials
tag:
  - AI
date: 2026-01-14
---

# A Tutorial on Using Some AI Agents

Recently, the topic of AI agents has been very hot. I've been learning about it too and made a summary of several agents I've used.

## Models

The most popular models across the internet are still those from Anthropic, Google, and OpenAI. However, since their servers are overseas, it's a bit troublesome to use them in China. Additionally, overseas models are quite expensive. So I've been using the GLM Coding Plan, which is much more affordable.

## Claude Code

First, let me introduce the currently most popular Claude Code, hereinafter referred to as CC. Although CC is a tool specifically designed for Claude models, it can also be configured to use third-party models, and the effect is pretty good.

### Installation

```sh
irm https://claude.ai/install.ps1 | iex
```

After installation, you can open CC with the `claude` command. If you have a Claude Pro account, you can start using Claude now. Of course, here I want to use third-party models, so additional configuration is needed.

### Configuration

The simplest way to configure is to use Zhipu Qingyan's automated configuration assistant. Run the following command and follow the prompts.

```sh
npx @z_ai/coding-helper
```

Alternatively, if you want to configure manually, edit the `$HOME/.claude/settings.json` configuration file, copy the following configuration, and fill in your own API KEY. If this file doesn't exist, you need to create it manually.

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-api-key",
    "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

After successful configuration, switch to your project in the command line, open CC, and there should be no login prompt, which means the configuration is successful. It's worth noting that after enabling Zhipu Qingyan's model, although the model displayed in the CC interface is still the claude model, it has actually been replaced with the GLM model. This point needs attention.

### Configuring Skills

Recently, Claude also launched a powerful feature - Agent Skills. Essentially, it's still a prompt, telling the large model what to do now. But this is where it's interesting. Previously, to make large models implement complex functions, we needed to configure agents one by one, then design flowcharts to connect them. This was not only troublesome but also not universal, and it consumed quite a lot of tokens.

Claude Skills are different. They are actually some Markdown format files and code, which contain the skills and instructions that large models need to use. Large models will load these files when needed. The benefit of this approach is not only saving tokens, but more importantly, it separates the skills needed by large models individually, achieving universalization. In fact, there is now a Claude Skills Market with a large number of community skills. You can install them like plugins to enhance the capabilities of large models.

It's very simple to configure skills in CC, because this concept was proposed by them, so you can directly use the built-in functions to install skills. Taking the `planning-with-files` skill as an example, open CC and enter the following two commands in order to install this skill.

```sh
/plugin marketplace add OthmanAdi/planning-with-files
/plugin install planning-with-files@planning-with-files
```

To query more skills, you can visit the following websites. It should be noted that skills may have security risks, so it's best to check them yourself before using.

- [skillsmp](https://skillsmp.com/zh)
- [mcpservers](https://mcpservers.org/claude-skills)

## opencode

Recently there's also a fairly hot open-source code agent called opencode.

### Installation

```sh
npm i -g opencode-ai
```

opencode's usage is similar to Claude Code. It's worth mentioning that opencode can use the free GLM-4.7 model by default, so if you just want to try it out, opencode is a good choice.

## Factory Droid

This is also a very popular agent.

### Installation

```sh
irm https://app.factory.ai/cli/windows | iex
```

### Configuration

Automatic configuration.

```sh
npx @z_ai/coding-helper
```

The configuration file path is `$HOME/.factory/config.json`, and the file content is as follows.

```json
{
  "custom_models": [
    {
      "model_display_name": "GLM-4.7 [GLM Coding Plan China]",
      "model": "glm-4.7",
      "base_url": "https://open.bigmodel.cn/api/coding/paas/v4",
      "api_key": "your_api_key",
      "provider": "generic-chat-completion-api",
      "max_tokens": 131072
    }
  ]
}
```

## crush

### Installation

```sh
npm install -g @charmland/crush
```

### Configuration

Automatic configuration.

```sh
npx @z_ai/coding-helper
```

The configuration file path is `$HOME/.config/crush/crush.json`, and the content is as follows.

```json
{
  "providers": {
    "zai": {
      "id": "zai",
      "name": "ZAI Provider",
      "base_url": "https://open.bigmodel.cn/api/coding/paas/v4",
      "api_key": "your-key"
    }
  }
}
```
