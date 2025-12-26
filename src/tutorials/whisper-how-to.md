---
category:
  - tutorials
tag:
  - AI
date: 2025-12-26
---

# Whisper speech-to-text tutorial

Whisper is OpenAI's open-source speech-to-text model and is one of the most accurate speech transcription models available today. Let's learn how to get started now.

## Installation

### Create a virtual environment

Here I use the now-popular `uv` tool to create a virtual environment.

```sh
mkdir whisper
cd whisper
uv venv -p 3.11
```

### Install PyTorch

Next, install PyTorch. The PyTorch website provides an [online selector](https://pytorch.org/get-started/locally/) to help you choose the right build. Copy the command it suggests and adapt it to use `uv` so it installs into your virtual environment. My GPU is an Nvidia 4070 Ti Super, which corresponds to CUDA 13.1, so I chose the nearest supported 13.0 build. If you're unsure which CUDA version matches your GPU, ask ChatGPT. If you can't determine it, you can skip GPU support and use CPU-only inference (much slower).

```sh
uv pip install torch torchvision --index-url https://download.pytorch.org/whl/cu130
```

### Install Whisper

Finally, install Whisper itself.

```sh
uv pip install --upgrade --no-deps --force-reinstall git+https://github.com/openai/whisper.git
```

After installation, run the Whisper help command and check the `--device` option description. If it shows `cuda`, GPU inference is available; if it shows `cpu`, you will be limited to CPU inference.

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
# Note the following line — check whether it says "cuda" or "cpu"
  --device DEVICE       device to use for PyTorch inference (default: cuda)
```

### Install ffmpeg

You also need to install `ffmpeg`.

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

## Usage

Once installed, you can start using Whisper. Whisper provides several models for different scenarios. See the Whisper [official page](https://github.com/openai/whisper?tab=readme-ov-file#available-models-and-languages) for details. My recommendation: if you can enable CUDA inference and you're transcribing English audio to English subtitles, use the `turbo` model; otherwise, use the `large` model.

Some common options:

- `--task {transcribe,translate}`: choose the task. `transcribe` converts audio into text, while `translate` transcribes and translates to English.
- `--language`: specify the audio language. If omitted, Whisper will attempt to detect the language from the first 30 seconds.
- `--output_format {txt,vtt,srt,tsv,json,all}`: choose output formats; default is `all`.

A simple example:

```sh
uv run whisper --model large --language zh --task transcribe record.m4a
```

After a short wait, several output files will appear in the directory in various formats — the transcription is complete.
