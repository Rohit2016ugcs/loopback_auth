module.exports = {
  apps: [
    {
      name: 'LoopbackAuth',
      script: 'npm start',
      instances: 1,
      watch: ['src'],
      watch_delay: 1000,
      ignore_watch: ['node_modules', 'dist/**'],
      max_memory_restart: '150M',
      autorestart: true,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
      log_date_format: "YYYY-MM-DD HH:mm Z",
      error_file: './error.log',
      out_file: './out.log',
      time: true
    },
  ],
};
