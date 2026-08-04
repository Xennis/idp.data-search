import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  basePath: "/idp.data-search",
  output: "export",
  experimental: {
    useTypeScriptCli: true,
  },
}

export default nextConfig
