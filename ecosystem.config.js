module.exports = {
  apps: [
    {
      name: 'poky',
      exec_mode: 'cluster',
      instances: 1,
      script: './.output/server/index.mjs',
    },
  ],
}
