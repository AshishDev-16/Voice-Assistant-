/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.aion.ai https://*.clerk.accounts.dev https://checkout.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://img.clerk.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' http://localhost:5000 https://clerk.aion.ai https://*.clerk.accounts.dev https://api.razorpay.com; frame-src 'self' https://clerk.aion.ai https://*.clerk.accounts.dev https://api.razorpay.com https://checkout.razorpay.com; worker-src 'self' blob:; object-src 'none';"
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },
};

export default nextConfig;
