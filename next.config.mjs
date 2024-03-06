/** @type {import('next').NextConfig} */

const nextConfig = {
  //experimental: { serverActions: true },
  reactStrictMode: true,
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback.fs = false
  //     config.resolve.fallback.tls = false
  //     config.resolve.fallback.net = false
  //     config.resolve.fallback.child_process = false

  //     //   config.plugins.push(
  //     //     new CopyPlugin({
  //     //       patterns: [
  //     //         { from: 'src/lib/text-to-speech.py', to: 'lib/text-to-speech.py' },
  //     //       ],
  //     //     }),
  //     //   );
  //   }

  //   return config
  // },
}

export default nextConfig;
