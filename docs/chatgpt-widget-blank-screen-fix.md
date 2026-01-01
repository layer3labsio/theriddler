# ChatGPT Widget Blank Screen Issue - Problem & Solution

## Problem Description

When building a ChatGPT MCP (Model Context Protocol) widget that uses React, the widget would load but display a **blank white screen** in the ChatGPT interface, even though:
- The server was returning proper `structuredContent` with default data
- The React app worked perfectly when served locally via HTTP
- All hydration logic was in place to read `window.openai` globals
- The MCP server schema was correctly configured with optional inputs
- CSP (Content Security Policy) was properly configured

## Root Cause

The issue was with **how the external React JavaScript bundle was being loaded** in the HTML template that gets served inline to ChatGPT.

### What Didn't Work

1. **Relative Script Paths**
   ```html
   <script type="module" src="/assets/the-riddler.js"></script>
   ```
   - Failed because ChatGPT inlines the HTML without a base URL context
   - Relative paths don't resolve correctly

2. **Absolute Script URLs with Regular src Attribute**
   ```html
   <script type="module" src="https://your-app-url.onrender.com/assets/the-riddler.js"></script>
   ```
   - Failed even with proper CSP `script_src_domains` configured
   - ChatGPT's HTML inlining process may interfere with external script loading via `src` attribute

3. **Inline Script Bundle**
   - Attempted to inline the entire React bundle directly into the HTML
   - Failed due to HTML parsing conflicts (React bundle contains characters that break HTML parsing, e.g., `</script>` strings, `<select>` tags within JSX)

## Solution

Use **dynamic `import()` within an inline `<script>` tag** to load the external React bundle (encoded or direct):

```html
<div id="the-riddler-root"></div>
<!-- 
  Load script via import() to avoid HTML parser issues with inline code
-->
<script type="module">
  import('https://your-app-url.onrender.com/assets/the-riddler.js')
    .catch(err => {
      console.error('[The Riddler] Failed to load script:', err);
      document.getElementById('the-riddler-root').innerHTML = 
        '<div style="padding:20px;text-align:center;font-family:sans-serif;color:#DC2626"><h3>Failed to load game</h3><p>Please refresh the page or try again later.</p></div>';
    });
</script>
```

### Why This Works

1. **Dynamic import()** is executed at runtime, after the HTML is fully parsed
2. The inline `<script type="module">` is minimal and doesn't contain any problematic characters
3. Error handling provides user feedback if the external script fails to load
4. Works within ChatGPT's inline HTML context without relying on `src` attribute resolution

## Required Server Configuration

Ensure your MCP server's CSP includes:

```typescript
"openai/widgetCSP": {
  connect_domains: [
    "https://your-app.onrender.com"
  ],
  script_src_domains: [
    "https://your-app.onrender.com"
  ],
  resource_domains: [],
}
```

## Testing Checklist

When debugging blank screen issues with ChatGPT MCP widgets:

1. ✅ Verify the widget works locally via direct HTTP access
2. ✅ Check browser console for script loading errors
3. ✅ Ensure `structuredContent` includes default/fallback values
4. ✅ Verify `toolInputSchema` has `$schema` property and no `required` fields if inputs are optional
5. ✅ Confirm hydration logic reads `window.openai.toolOutput` / `window.openai.structuredContent`
6. ✅ Test script loading method (dynamic `import()` is most reliable)
7. ✅ Validate CSP `script_src_domains` and `connect_domains` include your deployment URL
8. ✅ Check that absolute URLs use HTTPS (not HTTP)

## Key Takeaway

**For ChatGPT MCP widgets, prefer vanilla JavaScript inline in HTML, or use dynamic `import()` for external React bundles.** Traditional `<script src="...">` tags may not work reliably in ChatGPT's inline HTML context.

