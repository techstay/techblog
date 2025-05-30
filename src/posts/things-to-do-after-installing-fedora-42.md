---
category:
  - linux
tag:
  - linux
  - fedora
date: 2025-05-31
---

# Things to Do After Installing Fedora 42

When installing Fedora 42 Workstation on a physical machine or virtual machine, you need to enable third-party repositories during the installation process. After installation, you can follow this guide to further configure your system. If you are using a different version of Fedora, some configurations in this article may not apply.

## System Configuration

### No Password sudo

By default, running sudo commands requires entering a password. If you don't want to enter your password every time you use sudo, you can run the following command:

```sh
echo "$(whoami) ALL=(ALL) NOPASSWD: ALL" | sudo tee "/etc/sudoers.d/$(whoami)"
```

### System Update

The system is not up to date by default after installation. It's best to update your system before performing other operations to keep it current.

```sh
sudo dnf -y update
```

After the update, it's recommended to reboot your system.

### NVIDIA Driver

If you use an NVIDIA graphics card, install the following driver:

```sh
sudo dnf install -y akmod-nvidia
```

Wait a moment, then run the following command to check if the NVIDIA kernel module has been built. After that, reboot your system.

```sh
modinfo -F version nvidia
```

### Set Hostname

```sh
sudo hostnamectl set-hostname myfedora
```

### Optimize Boot Speed

```sh
sudo systemctl disable NetworkManager-wait-online.service
sudo rm /etc/xdg/autostart/org.gnome.Software.desktop
```

## System Beautification

### Install GNOME Shell Extensions

First, install the extension and tweak tools:

```sh
sudo dnf install -y gnome-tweaks gnome-extensions-app
```

Here are some GNOME Shell extensions you can install as needed:

```sh
sudo dnf install -y gnome-shell-extension-pop-shell xprop
sudo dnf install -y gnome-shell-extension-user-theme
sudo dnf install -y gnome-shell-extension-just-perfection
sudo dnf install -y gnome-shell-extension-dash-to-dock
sudo dnf install -y gnome-shell-extension-blur-my-shell
sudo dnf install -y gnome-shell-extension-caffeine
sudo dnf install -y gnome-shell-extension-drive-menu
```

Some GNOME Shell extensions can only be installed online:

- [vitals](https://extensions.gnome.org/extension/1460/vitals/): An extension that displays system information in the top bar

After installation, you can enable and adjust the settings of each extension in the Extensions app.

### Window Effects

The following extensions also need to be enabled in the Extensions app:

- [Burn My Windows - GNOME Shell Extensions](https://extensions.gnome.org/extension/4679/burn-my-windows/): Window open/close effects
- [compiz-windows-effect](https://extensions.gnome.org/extension/3210/compiz-windows-effect/): Window movement effects
- [compiz-alike-magic-lamp-effect](https://extensions.gnome.org/extension/3740/compiz-alike-magic-lamp-effect/): Window maximize/minimize effects

### Install Icon Theme

```sh
git clone https://github.com/vinceliuice/Tela-icon-theme --depth=1
cd Tela-icon-theme
./install.sh -a
```

### WhiteSur Theme

Clone the theme and install it:

```sh
git clone https://github.com/vinceliuice/WhiteSur-gtk-theme --depth=1
cd WhiteSur-gtk-theme
./install.sh
```

### grub2 Theme

```sh
git clone https://github.com/vinceliuice/grub2-themes --depth=1
cd grub2-themes
sudo ./install.sh -t whitesur -i whitesur
```

### Terminal Configuration

Use zsh:

```sh
sudo dnf install -y zsh
curl -fsSL https://raw.githubusercontent.com/zimfw/install/master/install.zsh | zsh
```

Use fish:

```sh
sudo dnf install -y zsh
```

## Reference

- <https://github.com/devangshekhawat/Fedora-42-Post-Install-Guide?tab=readme-ov-file>
