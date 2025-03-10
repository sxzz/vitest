import type { V8CoverageProvider } from './provider'
import inspector, { type Profiler } from 'node:inspector'
import { provider } from 'std-env'
import { loadProvider } from './load-provider'

const session = new inspector.Session()

export default {
  startCoverage(): void {
    session.connect()
    session.post('Profiler.enable')
    session.post('Profiler.startPreciseCoverage', {
      callCount: true,
      detailed: true,
    })
  },

  takeCoverage(): Promise<{ result: Profiler.ScriptCoverage[] }> {
    return new Promise((resolve, reject) => {
      session.post('Profiler.takePreciseCoverage', async (error, coverage) => {
        if (error) {
          return reject(error)
        }

        // Reduce amount of data sent over rpc by doing some early result filtering
        const result = coverage.result.filter(filterResult)

        resolve({ result })
      })

      if (provider === 'stackblitz') {
        resolve({ result: [] })
      }
    })
  },

  stopCoverage(): void {
    session.post('Profiler.stopPreciseCoverage')
    session.post('Profiler.disable')
    session.disconnect()
  },

  async getProvider(): Promise<V8CoverageProvider> {
    return loadProvider()
  },
}

function filterResult(coverage: Profiler.ScriptCoverage): boolean {
  if (!coverage.url.startsWith('file://')) {
    return false
  }

  if (coverage.url.includes('/node_modules/')) {
    return false
  }

  return true
}
