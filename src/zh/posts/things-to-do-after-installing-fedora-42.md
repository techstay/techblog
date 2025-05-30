---
category:
  - linux
tag:
  - linux
  - fedora
date: 2025-05-31
---

# 安装 Fedora 42 之后要做的几件事

在实机或者虚拟机中安装 Fedora 42 工作站系统，安装过程中需要启用第三方软件源。安装完毕之后，就可以跟着本文继续配置了。如果你安装的是其他版本的 Fedora，那么本文中的某些配置可能不适用。

## 系统配置

### sudo 免密码

默认情况下执行 sudo 命令需要输入密码，如果你不想在每次执行 sudo 命令的时候都输入密码，可以执行以下命令。

```sh
echo "$(whoami) ALL=(ALL) NOPASSWD: ALL" | sudo tee "/etc/sudoers.d/$(whoami)"
```

### 系统更新

默认安装完系统并不是最新的，在执行其他操作之前，最好先更新一下系统保持最新状态。

```sh
sudo dnf -y update
```

更新完毕之后最好重启一下系统。

### nvidia 驱动

如果你使用 NVIDIA 显卡，那么安装下面的驱动。

```sh
sudo dnf install -y akmod-nvidia
```

稍等片刻，执行下面的命令查看 NVIDIA 内核模块是否已经构建。之后重启系统。

```sh
modinfo -F version nvidia
```

### 设置主机名

```sh
sudo hostnamectl set-hostname myfedora
```

### 优化开机速度

```sh
sudo systemctl disable NetworkManager-wait-online.service
sudo rm /etc/xdg/autostart/org.gnome.Software.desktop
```

## 系统美化

### 安装 gnome shell 扩展

先安装扩展和优化工具。

```sh
sudo dnf install -y gnome-tweaks gnome-extensions-app
```

下面是一些 gnome shell 扩展，按需安装。

```sh
sudo dnf install -y gnome-shell-extension-pop-shell xprop
sudo dnf install -y gnome-shell-extension-user-theme
sudo dnf install -y gnome-shell-extension-just-perfection
sudo dnf install -y gnome-shell-extension-dash-to-dock
sudo dnf install -y gnome-shell-extension-blur-my-shell
sudo dnf install -y gnome-shell-extension-caffeine
sudo dnf install -y gnome-shell-extension-drive-menu
```

还有一些 gnome shell 扩展只能在线安装。

- [vitals](https://extensions.gnome.org/extension/1460/vitals/)，在顶栏显示系统信息的扩展

安装完成之后可以在扩展程序中开启和调整各个扩展的设置。

### 窗口特效

下面的扩展同样需要在扩展程序中启用。

- [Burn My Windows - GNOME Shell Extensions](https://extensions.gnome.org/extension/4679/burn-my-windows/)，窗口打开关闭特效
- [compiz-windows-effect](https://extensions.gnome.org/extension/3210/compiz-windows-effect/)，窗口移动特效
- [compiz-alike-magic-lamp-effect](https://extensions.gnome.org/extension/3740/compiz-alike-magic-lamp-effect/)，窗口最大化最小化特效

### 安装图标

```sh
git clone https://github.com/vinceliuice/Tela-icon-theme --depth=1
cd Tela-icon-theme
./install.sh -a
```

### WhiteSur 主题

克隆主题并安装。

```sh
git clone https://github.com/vinceliuice/WhiteSur-gtk-theme --depth=1
cd WhiteSur-gtk-theme
./install.sh
```

### grub2 主题

```sh
git clone https://github.com/vinceliuice/grub2-themes --depth=1
cd grub2-themes
sudo ./install.sh -t whitesur -i whitesur
```

### 终端配置

使用 zsh。

```sh
sudo dnf install -y zsh
curl -fsSL https://raw.githubusercontent.com/zimfw/install/master/install.zsh | zsh
```

使用 fish。

```sh
sudo dnf install -y zsh
```

## 参考

- <https://github.com/devangshekhawat/Fedora-42-Post-Install-Guide?tab=readme-ov-file>
