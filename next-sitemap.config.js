module.exports = {
  siteUrl: 'https://www.aiassethub.pro',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: [
          '/api/',
          '/dashboard',
          '/account',
          '/purchases',
          '/creator-dashboard',
        ],
      },
      { userAgent: '*', allow: '/' },
    ],
  },
}
