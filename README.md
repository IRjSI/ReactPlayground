# Tools Used

### Code Editor
**monaco-editor**

### Transpiler
**Babel standalone**

---

### What does the following code mean?

```html
<script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
```

#### React and ReactDOM
- **React**: The core library that handles components, hooks, state, etc.
- **ReactDOM**: Enables React to render components into the browser's DOM (i.e., the actual HTML page).

#### UMD Format
**UMD** stands for Universal Module Definition. It’s a JavaScript format that works universally, for example, in a browser using a `<script>` tag.

#### unpkg CDN
**unpkg** is a free **CDN** for any npm package. It allows you to load React or other packages directly in your browser.

Thus, the above code loads React directly into the browser.

---

### How it Works

#### Injecting Compiled Code
```html
<script>
    try {
        ${compiledCode}
```
- Here, *compiledCode* is plain JavaScript after JSX is transpiled. It is injected into the `<script>` tag.

#### Rendering the App
```ts
ReactDOM.render(React.createElement(App), document.getElementById('root'));
```
- **Step 1**: Creates an element using the compiled `App` component.
- **Step 2**: Renders it into the `<div>` with the `id="root"`.

#### Handling Runtime Errors
```jsx
} catch (err) {
    document.body.innerHTML = '<pre>' + err + '</pre>';
}
</script>
```
- If there’s a runtime error (e.g., referencing an undefined variable), it catches the error and displays it inside the iframe.

#### Handling Compile-Time Errors
```js
} catch (err: any) {
```
- Catches compile-time errors (e.g., syntax errors during Babel transpilation).

---

### Workflow Summary
1. **Input**: User types JSX into Monaco Editor.
2. **Compile**: Babel transforms JSX → JavaScript.
3. **Embed**: Wraps compiled JS in full HTML + React CDN.
4. **Inject**: Sets the HTML into an iframe (`srcDoc`).
5. **Render**: ReactDOM renders the component in the iframe.

---

### What is an iframe?
An **iframe** is a small browser window embedded within your current webpage. It can load another entire webpage — with its own HTML, CSS, and JS — in complete isolation.

#### <u>property</u>
**srcDoc ->** Instead of a URL, lets you inject raw HTML directly


# Logic

**After user submits the solution, how do we validate it?**

We get the document from iframe as:
``` jsx
const iframe = document.querySelector("iframe") as HTMLIFrameElement;
const iframeDoc = iframe?.contentDocument;
```

Then we perform the logic

But we have to make some changes:
``` jsx
<iframe
    sandbox="allow-scripts allow-same-origin"
```

add allow-same-origin

Also if we try to access iframe.contentDocument before it's ready, we might get *null*
so to avoid this:
``` jsx
const iframeDoc = iframe?.contentDocument;

if (!doc) return console.log("Iframe not ready");
...
```

