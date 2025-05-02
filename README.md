# 🧾 Easy Copy

A Visual Studio Code extension that makes it effortless to copy the contents or structure of selected files and folders right from the Explorer context menu.

## 🚀 Features

- 📋 Copy content of selected files (with filenames prepended)
- 🗂️ Copy the file/folder structure as a tree
- 🔍 **Advanced filtered copy** with smart selectors:
  - `intext:` → filter by file content
  - `inname:` / `-inname:` → partial name match / exclude
  - `name:` → exact filename match

## 🎯 Usage

Right-click on any file or folder in the Explorer sidebar and choose:

- `Easy Copy`
- `Easy Copy: Paths Tree`
- `Easy Copy: Filtered`

You can also run these from the **Command Palette**.

## 🔎 Filter Syntax (for "Easy Copy: Filtered")

```
intext:user intext:model -inname:.g.dart inname:.dart name:models.py
```

Explanation:
- `intext:user` → file must contain "user"
- `intext:model` → file must contain "model"
- `inname:.dart` → filename must contain ".dart"
- `-inname:.g.dart` → filename must NOT contain ".g.dart"
- `name:models.py` → filename must exactly be "models.py"

✅ Supports multiple filters at once. Case-insensitive.

## 👤 Author

Sedrakyan Gnel
[github.com/SedrakyanGnel](https://github.com/SedrakyanGnel)

## Source Code
[github.com/SedrakyanGnel/easy-copy](https://github.com/SedrakyanGnel/easy-copy)