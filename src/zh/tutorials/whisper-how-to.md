---
category:
  - 教程
tag:
  - AI
date: 2025-12-26
---

# 语音转文字模型 whisper 使用教程

Whisper 是 OpenAI 开源的端到端自动语音识别（ASR）模型，能够将语音直接转写为文本或在转录时同时输出翻译结果。whisper 是目前市面上效果最好的开源模型之一。今天让我们学习一下如何使用 whisper 吧。

## 安装

### 创建虚拟环境

这里我使用现在非常流行的 uv 来安装。首先需要创建一个虚拟环境。

```sh
mkdir whisper
cd whisper
uv venv -p 3.11
```

### 安装 pytorch

然后安装 pytorch，pytorch 官方提供了一个[在线表单](https://pytorch.org/get-started/locally/)，可以帮助你选择合适的版本。然后复制下面的命令，并改为 uv 的命令行，这样就可以在虚拟环境中安装 pytorch 了。我的显卡是 Nvidia 4070 Ti Super，所以对应的 Cuda 版本 13.1,那么就选择最近的 13.0,如果不清楚自己显卡对应的 Cuda 版本，可以问问 ChatGPT。如果实在不清楚或者这里没有你的显卡型号的话，不做这一步也可以，但是这样的话就会使用 CPU 推理，速度要慢很多。

```sh
uv pip install torch torchvision --index-url https://download.pytorch.org/whl/cu130
```

### 安装 whisper

最后一步就是安装 whisper 了。

```sh
uv pip install --upgrade --no-deps --force-reinstall git+https://github.com/openai/whisper.git
```

安装完成后，运行一下 whisper 的帮助命令，观察`--device`参数后面的说明，如果是 `cuda` 说明成功开启了显卡推理功能，如果是 `cpu`，那么就只能使用 CPU 推理了。

```sh
$ uv run whisper --help
usage: whisper [-h] [--model MODEL] [--model_dir MODEL_DIR] [--device DEVICE] [--output_dir OUTPUT_DIR]
               ...
               audio [audio ...]

positional arguments:
  audio                 audio file(s) to transcribe

options:
  -h, --help            show this help message and exit
  --model MODEL         name of the Whisper model to use (default: turbo)
  --model_dir MODEL_DIR
                        the path to save model files; uses ~/.cache/whisper by default (default: None)
# 注意看下面这一行的说明，是cuda还是cpu
  --device DEVICE       device to use for PyTorch inference (default: cuda)
```

### 安装 ffmpeg

最后还要安装 ffmpeg。

```sh
# on Ubuntu or Debian
sudo apt update && sudo apt install ffmpeg

# on Arch Linux
sudo pacman -S ffmpeg

# on MacOS using Homebrew (https://brew.sh/)
brew install ffmpeg

# on Windows using Chocolatey (https://chocolatey.org/)
choco install ffmpeg

# on Windows using Scoop (https://scoop.sh/)
scoop install ffmpeg
```

## 使用

成功安装之后，就可以开始使用 whisper 了。whisper 内置了多个模型，分别对应不同的情况。详细的模型说明可以参考 whisper 的[官方页面](https://github.com/openai/whisper?tab=readme-ov-file#available-models-and-languages)。我的建议是，如果你可以开启 cuda 推理，那么如果要转录英文语音的英文字幕，就使用`turbo`模型，否则的话就用`large`模型。

然后是其他几个常用参数：

- `--task {transcribe,translate}`，设置任务类型，`transcribe`会将音频转录为对应的文字，而`translate`会将字幕翻译为英文
- `--language`指定音频所使用的语言，如果不指定的话会默认从前 30 秒判断语言类型
- `--output_format {txt,vtt,srt,tsv,json,all}`指定输出类型，默认为全部

下面是一个简单的示例：

```sh
uv run whisper --model large --language zh --task transcribe record.m4a
```

稍等一段时间，目录下就会出现几个输出文件，各种类型的都有，这样我们就成功配置好了 whisper 语音转文字的功能了。
