# Tools Used

### Code Editor
**monaco-editor**

### Transpiler
**Babel standalone**

---

### What does the following code mean?

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
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
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
```
- **Step 1**: Creates a root using the `<div>` with the `id="root"`.
- **Step 2**: Renders an element using the compiled `App` component into the root.

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

We get the document from the iframe safely after it loads:
``` jsx
const iframe = iframeRef.current;
iframe.srcdoc = html;

// wait for load safely
await new Promise<void>((resolve) => {
    const handler = () => {
        iframe.onload = null; // cleanup
        resolve();
    };
    iframe.onload = handler;
});

const iframeDoc = iframe.contentDocument?.documentElement.outerHTML;
```

**Then we perform the logic:**

Previously, we validated the document logic directly on the client. Now, we send `iframeDoc` to an actual backend service for secure and reliable evaluation.

``` jsx
const res = await submitCodeAPI(iframeDoc, challengeId!);
const { solutionId } = res;
```

**Real-time Results via WebSockets**
Since validation is handled by a backend service, we use **Socket.io** to register for the result and listen for our specific `solutionId`:
``` jsx
// Register for result
socket.emit("register", solutionId);

socket.on("solutionResult", async (data) => {
    if (data.solutionId !== solutionId) return;
    
    setOutput(data.result === "valid" ? "Correct Solution" : "Incorrect Solution");
});
```

**Important considerations:**
We have to make some changes to the iframe to read its content without issues:
``` jsx
<iframe
    sandbox="allow-scripts allow-same-origin"
```
add `allow-same-origin`.

Also if we try to access `iframe.contentDocument` before it's ready, we might get *null*. That is why we now use the `onload` handler shown above instead of accessing it immediately.

# Adding Challenges and their solutions

