declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      PORT?: string
      IWASHER_USERNAME: string
      IWASHER_PASSWORD: string
    }
  }
}

export {}
