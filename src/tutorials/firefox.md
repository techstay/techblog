---
category:
  - tutorials
tag:
  - software
date: 2025-11-19
---

# Firefox Browser Guide

I've tried many browsers over the years, but I keep coming back to Firefox. The deciding features for me were simple: opening bookmarks in a new tab and showing search results in a new tab. I was surprised that mainstream browsers like Chrome and Edge don't provide these small conveniences, so Firefox became the obvious choice. This article documents some of the Firefox settings and tweaks I use.

## Feature Customization

### Enable Vertical Tabs

Right-click on an empty area of the Firefox toolbar and choose "Customize Toolbar" — this lets you heavily customize the browser's UI to your taste. Arrange the toolbar and other UI elements however you prefer.

I also recommend right-clicking the tab bar and selecting "Enable vertical tabs" (or using an extension that provides vertical tabs). Modern monitors are wide, and many websites are not well-optimized for wide layouts, leaving large blank margins on both sides. Switching to vertical tabs makes better use of the horizontal space and frees up some vertical space. If you tend to keep many tabs open at once, vertical tabs also make it easier to find the tab you want.

### Open Bookmarks and Search Results in New Tabs

This is one of the features I find most useful. Surprisingly, most mainstream browsers don't provide it, but Firefox (and some Chromium forks) can. With these settings enabled, you don't have to create a blank tab first and then open a bookmark or start a search — the result opens directly in a new tab.

To enable these options, open `about:config` in Firefox and search for the following preferences. Set each one to `true` (or the recommended value) to enable the behavior:

- `browser.search.openintab`
- `browser.tabs.loadBookmarksInTabs`
- `browser.urlbar.openintab`

## Browser Appearance

### Firefox-WinUI Theme

The default Firefox look is fine, but you can customize appearance using user themes and extensions. I use the Firefox-WinUI user theme (<https://github.com/Lockframe/Firefox-WinUI>) to integrate Firefox with Windows 11 and enable acrylic (translucent) effects — the result looks great.

### Copy Profile Files

Open `about:support` in Firefox and locate the `Profile Folder`. Click the "Open Folder" button next to it to open the profile directory in your file explorer.

Download the theme package from the `Firefox-WinUI` repository, extract it, and copy the `chrome` folder and the `user.js` file into your Firefox profile folder.

### Theme Settings

Finally, open `about:config` and add or modify the following preferences. The Firefox-WinUI project contains additional configurable options — refer to its README if you want more customization.

Enable the browser's translucent/Mica effects:

- `widget.windows.mica`
- `widget.windows.mica.popups` (set to `1` or `2`)
- `browser.tabs.allow_transparent_browser`
- `uc.winui.more-acrylic` (adds acrylic effect to the navigation bar, bookmarks bar, and selected tab)
- `uc.winui.acrylic-animations` (experimental acrylic animation effects)

After applying these settings, your Firefox should get a visual refresh with beautiful translucent effects. Enjoy using Firefox!
