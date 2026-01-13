---
category:
  - 教程
tag:
  - AI
date: 2026-01-14
---

# 一些 AI 智能体的使用教程

最近 AI 智能体的话题非常火，我也跟着学习了一下，将我用过的几个智能体做一个总结。

## 模型

现在全网最流行的自然还是 Anthropic、Google 以及 OpenAI 的模型，不过由于他们的服务区都在国外，所以国内要用起来稍微有点麻烦，而且另一方面国外模型的价格也挺贵的。所以我就用了最近质谱清言推出的 GLM Coding Plan，价格实惠的多。

## Claude Code

首先介绍的自然是现在最火的 Claude Code 了，以下简称 CC。虽然 CC 是专门为 Claude 模型设计的工具，但是也可以通过配置来使用第三方模型，效果也还可以。

### 安装

```sh
irm https://claude.ai/install.ps1 | iex
```

安装完成后用`claude`命令就可以打开 CC 了。如果你有 Claude Pro 账号的话，现在就可以开始打开 Claude 开始使用了。当然这里我要用第三方模型，所以还需要额外的配置。

### 配置

最简单的配置办法就是用质谱清言的自动化配置助手，运行下面的命令，然后按照提示操作即可。

```sh
npx @z_ai/coding-helper
```

或者，如果你想手动配置，就编辑`$HOME/.claude/settings.json`配置文件，复制下面的配置，并填入你自己的 API KEY。如果没有这个文件的话需要手动创建。

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

配置成功之后，在命令行中切换到你要进行的项目，打开 CC，这时候应该不会弹出登录提示，这样就配置成功了。值得一提的是，启用了质谱清言的模型之后，虽然 CC 界面里显示的模型还是 claude 模型，但是实际上已经替换为了 GLM 模型，这一点需要注意。

### 配置技能

最近 Claude 还推出一个强大的功能 ──Agent Skills，本质上他还是一段提示词，告诉大模型现在你应该怎么做。但是这就是他有趣的地方了。以前我们要让大模型实现复杂的功能，需要自己配置一个个 agent，然后设计流程图将他们串联起来，这样做起来不仅费事，而且不通用，消耗的 token 还比较多。

而 Claude Skills 就不一样了，他其实就是一些 Markdown 格式的文件和代码，里面编写了大模型需要使用的技能和说明。大模型会在需要的时候去加载这些文件。这样做的好处一方面节约了 token，更重要的是，它把大模型需要的技能单独剥离出来，实现了通用化。实际上现在已经有了 Claude Skills Market，在里面有大量社区技能，你可以像安装插件一样去安装他们，强化大模型的能力。

要在 CC 中配置技能很简单，因为这个概念就是他家提出来的，可以直接使用内置的功能来安装技能。以`planning-with-files`技能为例，打开 CC，依次输入下面两行命令即可安装这个技能。

```sh
/plugin marketplace add OthmanAdi/planning-with-files
/plugin install planning-with-files@planning-with-files
```

要查询更多技能，可以访问下面几个网站。需要注意的是，skills 有可能存在安全风险，在使用之前最好自己检查一下。

- [skillsmp](https://skillsmp.com/zh)
- [mcpservers](https://mcpservers.org/claude-skills)

## opencode

最近还有一个比较火的开源代码智能体 opencode。

### 安装

```sh
npm i -g opencode-ai
```

opencode 的使用方法和 Claude Code 类似。值得一提的是，opencode 默认就可以使用免费的 GLM-4.7 模型，如果只是想试用一下的话，opencode 是一个不错的选择。

## Factory Droid

这也是一个很流行的智能体。

### 安装

```sh
irm https://app.factory.ai/cli/windows | iex
```

### 配置

自动配置。

```sh
npx @z_ai/coding-helper
```

配置文件路径为`$HOME/.factory/config.json`，文件内容如下。

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

### 安装

```sh
npm install -g @charmland/crush
```

### 配置

自动配置。

```sh
npx @z_ai/coding-helper
```

配置文件路径为`$HOME/.config/crush/crush.json`，内容如下。

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
