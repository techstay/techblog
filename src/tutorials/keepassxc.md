---
category:
  - tutorials
tag:
  - security
date: 2022-12-26
---

# KeePassXC Password Manager

KeePassXC is a free and open-source password manager with a wealth of powerful features to strongly protect your passwords. If you have registered many accounts, can't remember your passwords, and often need to reset them, you should definitely try KeePassXC. It will ensure you never have to worry about forgetting your passwords again!

## Getting Started

### Download and Install

First, go to the [official website](https://keepassxc.org) to download and install KeePassXC.

### Create a Database

Open the KeePassXC software, and you should see a similar interface. Before using it for the first time, you need to create a database. All your passwords will be securely stored in the database in an encrypted form. Even if the database is leaked, your passwords will remain protected.

Click the "New Database" button in the interface to open the dialog. First, give your database a name — there are no strict requirements, just name it as you like.

![Create Database](https://s2.loli.net/2025/05/30/IqeiAsGWOv4mKYp.png)

Next, you need to set the database format and encryption settings. The default configuration is optimal, so you don't need to change anything here. Unless you have special requirements, the default decryption time of 1 second is sufficient. A longer decryption time uses more transformation rounds, making the database more secure, but it will also take longer to open and save.

![Encryption Settings](https://s2.loli.net/2025/05/30/Oy6MzDm2nkhBAPb.png)

If you're interested, you can click "Advanced Settings" to modify the encryption algorithm and transformation rounds yourself. Different configurations require different amounts of time. After configuring, don't forget to click the "Benchmark 1 Second Delay" button to calculate the number of rounds needed for a 1-second delay based on your pc specs and device performance.

![Advanced Settings](https://s2.loli.net/2025/05/30/a6Fvg32dyM5sCKG.png)

Finally, you need to set a password for the database. Every time you use KeePassXC, you must enter this password to open the database. **If you forget the password, you will permanently lose access to the database, so be sure to remember it!**

![Password Setup](https://s2.loli.net/2025/05/30/iDJ9KQB5YFUonLd.png)

If you are sure that no one else uses your computer and you don't want to enter a password every time you open KeePassXC, you can use a "lazy" method, but this will reduce security. This method is to use only a key file to encrypt the database. In the password setup dialog, select "Add Additional Protection," choose "Add Key File," then click "Generate" to create a key file with the `.keyx` extension. If you use only this file to encrypt the database, you won't need to enter a password next time — just click once. However, if someone else uses your computer, they can also access all your account information without a password.

![Key File](https://s2.loli.net/2025/05/30/D426BgN7tmZIUpk.png)

Of course, for greater security, you can use both a password and a key file to encrypt the database. In this case, losing either one will make your database permanently inaccessible. So, regardless of the method, I recommend making backups — never put all your eggs in one basket.

After setting the password or key file, click Finish button. A dialog will pop up to choose the save location for the database. It's recommended to save the database in a cloud sync folder like OneDrive. This way, after modifying and saving the database, it will automatically sync to the cloud. Even if the local database is lost, you can quickly restore it from the cloud.

::: info
If your device supports Windows Hello, just use a password to encrypt the database and enable Quick Unlock in the settings. You can then quickly unlock the database using fingerprint or facial recognition. This is currently the most convenient and secure method, as long as your device supports it.

![Quick Unlock](https://s2.loli.net/2025/05/30/x9t7HFgEeAVusvo.png)
:::

### Create Groups

To keep your passwords organized, it's best to group them by purpose. Right-click the root group and select "New Group," then assign a name, and add notes or an icon if needed. Once groups are set up, you can categorize your passwords for easier management and retrieval.

![Create Group](https://s2.loli.net/2025/05/30/UxikLYsguqStleP.png)

![Group Name](https://s2.loli.net/2025/05/30/5gjhN9SP63Lf7Mi.png)

![Created Group](https://s2.loli.net/2025/05/30/Mn4ABaicLNsu5QV.png)

### Save Passwords

The primary function of KeePassXC is to save passwords. Select a group, then click _Entry → New Entry_ in the menu bar or the _Add New Entry_ button in the toolbar to open the add entry dialog.

Fill in the password details as follows:

::: info
You can get a program's title by checking the window title or viewing it in Task Manager.
:::

- Title: The name of the password entry. For auto-type, the title must match the target program's window title.
- Username: The username to save. If the database already has the same username, it can auto-complete.
- Password: The password to save. Click the square button next to the password field to launch the password generator. The line below shows password strength with colors.
- URL: The website address for the account. Click the download button to fetch the site's favicon as the entry's icon.
- Tags: Add tags to the entry (English only).
- Expiry Date: Set a password expiry date if needed. Usually not required unless you have higher security needs.
- Notes: Add any additional notes if necessary.

![Add Account](https://s2.loli.net/2025/05/30/SICLOfzreaZg8cM.png)

### Using Passwords

After saving passwords, how do you use them? It's simple: open KeePassXC, find the entry you need, right-click it, and select _Copy Username_ or _Copy Password_ to paste them where needed. You can also use keyboard shortcuts or toolbar icons (the third group of icons in the toolbar). The default shortcuts are _Ctrl+B_ and _Ctrl+C_.

![Use Password](https://s2.loli.net/2025/05/30/vEotZQujkK69LGz.png)

Many programs can access the clipboard. To prevent accidental password leaks from copying and pasting, KeePassXC uses a timeout mechanism. By default, the clipboard is cleared after 10 seconds to protect your passwords. You can see the countdown in the status bar at the bottom right.

### Auto-Type

KeePassXC also has a powerful auto-type feature for automatically filling in usernames and passwords.

First, open the settings via _Tools → Settings_ or the gear icon in the toolbar. Go to _General → Auto-Type_, assign a global auto-type shortcut (e.g., _Ctrl+Alt+A_), and click Save. By default, a dialog will pop up before each auto-type. You can uncheck _Always ask before performing auto-type_ in settings so that if only one matching entry exists, auto-type will start immediately. If there are multiple matches, the dialog will appear.

![Auto Type Settings](https://s2.loli.net/2025/05/30/7yIxjMr3c1wCRb2.png)

You can also modify the auto-type sequence in two ways: in the entry editor for individual entries, or by right-clicking a group and selecting _Edit Group_ to apply a sequence to all entries in that group. To change the sequence for all entries, edit the root group's settings. My sequence is `{CLEARFIELD}{USERNAME}{TAB}{CLEARFIELD}{PASSWORD}`, which clears the username and password fields before auto-typing. You can also add `{ENTER}` at the end to submit the form after auto-type.

![Auto-Type Sequence](https://s2.loli.net/2025/05/30/z2i9DKojTkHFfGw.png)

If you don't want to change it, you can use the default sequence: `{USERNAME}{TAB}{PASSWORD}{ENTER}`. This means: enter the username, press TAB to switch to the password field, enter the password, and press Enter to confirm.

::: info
You can view all auto-type codes in the official [reference manual](https://keepassxc.org/docs/KeePassXC_UserGuide.html#_auto_type_actions).
:::

After everything is set up, it's time to witness the magic! In the target program, click the input field, then press the shortcut you set (e.g., `Ctrl+Alt+A`), and KeePassXC will elegantly auto-type your password!

![KeepassXC Auto Fill](https://s2.loli.net/2025/05/30/4oCPGfUikTuNKWm.gif)

::: warning
Auto-type does not work in all programs (such as QQ); only those that support clipboard pasting can use auto-type.
:::

## Advanced Tips

### Password Generator

Click _Tools → Password Generator_ in the menu or the fourth square icon in the toolbar to open the password generator. You can also open it from the password field when creating or editing an entry.

The password generator can create strong random passwords, which you can save in KeePassXC or copy elsewhere. The two buttons next to the password field are _Regenerate Password_ and _Copy to Clipboard_. If you're not satisfied with the generated password, use controls below to change the length and character types.

![Password Generator](https://s2.loli.net/2025/05/30/FOl3dQxn8UbWtuv.png)

::: warning
The password generator does not save history. Once you close the window and reopen it, the generated password will change. If you need to copy the same password multiple times, save it as an entry first to avoid losing it.
:::

### Browser Integration

Browsers are also desktop applications, so KeePassXC can auto-fill in browsers as well. In this case, set the entry's title to the web page's title. You still need to add the entry in KeePassXC first.

What if you want to automatically save passwords entered in the browser to KeePassXC? KeePassXC provides browser integration for this.

First, install the browser extension from the [Chrome Web Store](https://chrome.google.com/webstore/detail/keepassxc-browser/oboonakemofpalcgghocfoadofidjkkk) or [Edge Store](https://microsoftedge.microsoft.com/addons/detail/keepassxcbrowser/pdffhmdngciaglkoonimfcmckehcpafo).

Then, open the settings via the gear icon in the toolbar, enable _Browser Integration_, and check the browsers you want to integrate under _Enable integration for these browsers_.

![Browser Integration](https://s2.loli.net/2025/05/30/hL3REoexkPNOFv9.png)

Go back to your browser, click the newly installed KeePassXC extension, and click Connect. Enter a name for the browser. When KeePassXC turns green, the extension is successfully connected. Now, when you fill in passwords in the browser, you'll be prompted to save them to KeePassXC.

### Disable Screen Capture Protection

KeePassXC enables screen capture protection by default. When taking screenshots, recording, streaming, or remote controlling, the KeePassXC window will appear black. Sometimes you may want to temporarily disable this feature, such as when writing a tutorial.

To disable it, simply start KeePassXC with the `--allow-screencapture` parameter. Find the KeePassXC shortcut on your desktop, right-click and select _Properties_, and add the parameter at the end of the _Target_ field. If the path contains spaces, the path will be in quotes — make sure to add the parameter outside the quotes, after a space.

![Allow Screen Capture](https://s2.loli.net/2025/05/03/VuPHWZM3NyzgrG2.png)

### Reference Entries

Sometimes you need to use the same username or password in multiple URLs or programs. Maintaining multiple identical entries is cumbersome. KeePassXC provides a reference entry feature to solve this.

Right-click the entry you want to copy, then click _Clone Entry_. In the dialog, check _Replace username and password with references_ and click OK. Modify the cloned entry as needed; note that its username and password are references and don't need to be changed. Changing the original entry will automatically update all references.

![Clone Entry](https://s2.loli.net/2025/05/30/TvBxrlKMbc5U97o.png)

### TOTP

Some websites support TOTP-based two-factor authentication, and KeePassXC can also store TOTP secrets.

When enabling two-factor authentication, the website usually provides a QR code or secret. Right-click the entry, select _TOTP → Set up TOTP_, and paste the secret from the website into the _Secret_ field, then click OK. You can now get TOTP codes from KeePassXC. If the website only provides a QR code, you can install the `Authenticator: 2FA Client` extension in your browser, scan the QR code and then retrieve secret from it.

::: warning
TOTP codes are time-based. Make sure your system time is accurate, or the codes won't work.
:::

### Add More Attributes to Entries

Previously, we only filled in the basic fields for password entries. If your account needs to store more attributes, KeePassXC supports this as well.

When editing an entry, select the _Advanced_ tab on the left to access more detailed fields. Here you can add more account-related information. If you need to keep information confidential, check the _Protect_ box to hide it. To view hidden information, click the _Show/Hide_ button below the checkbox.

You can even add attachments, such as images of documents in the entry. KeePassXC can save them for you.

![Advanced Attributes](https://s2.loli.net/2025/05/30/LIwpTf8itGYnBNb.png)

### Other Settings

KeePassXC has many configuration options you can enable as needed.

To optimize startup behavior, select _Startup_ and enable _Automatically launch KeePassXC at system startup_ and _Minimize window after unlocking database_.

![Auto Start](https://s2.loli.net/2025/05/30/uP3XytiA1ckRlJH.png)

Clicking the close button will exit KeePassXC by default. To keep it in the system tray, enable _Minimize instead of app exit_, _Show system tray icon_, and _Hide windows to system tray when minimized_ under _User Interface_.

![Minimize](https://s2.loli.net/2025/05/30/I8RMhPu1n7C9zo5.png)

If your system supports Windows Hello or Touch ID, you can enable Quick Unlock. Next time you unlock the database, you can use fingerprint or facial recognition instead of entering a password.

![Quick Unlock](https://s2.loli.net/2025/05/30/x9t7HFgEeAVusvo.png)

### Run as Administrator at Startup

By default, KeePassXC starts with normal privileges and cannot perform auto-type in windows running as administrator. To use auto-type in such windows, KeePassXC itself must also run as administrator. However, KeePassXC's built-in auto-start only runs with normal privileges. To run KeePassXC as administrator at startup, use Task Scheduler.

First, disable KeePassXC's built-in auto-start. Then, open an administrator Command Prompt or PowerShell window and run the following command to create a scheduled task for KeePassXC. Replace `KeePassXC.exe` with the absolute path to KeePassXC. If the path contains spaces, enclose it in double quotes.

```sh
schtasks /create /tn keepassxc /tr "KeePassXC.exe" /sc ONLOGON /rl HIGHEST
```

After creating the task, run the following command to start KeePassXC. If it opens successfully, the scheduled task was created correctly, and KeePassXC will auto-start next time you log in.

```sh
schtasks /run /tn keepassxc
```

If nothing happens, the path to KeePassXC is incorrect. Delete the task and recreate it.

```sh
schtasks /delete /tn keepassxc
```

## Summary

Through the above introduction, I believe you should now be familiar with the various usage methods of KeePassXC. I believe it will bring you great convenience in password management in the future. I will also continue to share various tutorials in the future. See you next time!
