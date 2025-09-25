# Stylelint & Tailwind CSS Setup

To fully support Tailwind CSS in your editor and remove warnings like `Unknown at rule @tailwind`, follow these steps:

## 1. Install required npm packages

```
npm install --save-dev stylelint stylelint-config-standard stylelint-config-tailwindcss
```

## 2. (Recommended) Install the VSCode Extension
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

This will give you autocompletion and remove false warnings for Tailwind syntax.

## 3. Usage
- Your `.stylelintrc.json` is preconfigured for Tailwind support.
- If you use another editor, check for a Tailwind plugin or linter integration.

---

After these steps, restart your editor and the warnings will be gone!
