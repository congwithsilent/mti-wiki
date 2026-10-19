// 构建时把 Google Fonts 请求重定向到国内可达镜像（fonts.loli.net / gstatic.loli.net），
// 用法：NODE_OPTIONS="--import ./scripts/font-mirror.mjs" npx quartz build

const CSS_HOST_MAP = new Map([
  ["fonts.googleapis.com", "fonts.loli.net"],
  ["fonts.gstatic.com", "gstatic.loli.net"],
])

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

const originalFetch = globalThis.fetch

globalThis.fetch = async (input, init = {}) => {
  const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url)
  const mappedHost = CSS_HOST_MAP.get(url.host)

  if (!mappedHost) {
    return originalFetch(input, init)
  }

  const headers = new Headers(init.headers ?? (input instanceof Request ? input.headers : undefined))
  if (!headers.has("user-agent")) headers.set("user-agent", BROWSER_UA)

  url.host = mappedHost
  const response = await originalFetch(url, { ...init, headers })

  // 让上游仍按 google 域返回文本，便于下游插件按原逻辑处理
  if (url.host === "fonts.loli.net" && response.ok) {
    const text = await response.text()
    return new Response(text.replaceAll("gstatic.loli.net", "fonts.gstatic.com"), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
  }

  return response
}
