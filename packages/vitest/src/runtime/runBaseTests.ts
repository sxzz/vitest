import type { ResolvedTestEnvironment } from '../types/environment'
import type { SerializedConfig } from './config'
import type { VitestExecutor } from './execute'
import { performance } from 'node:perf_hooks'
import { collectTests, startTests } from '@vitest/runner'
import { setupChaiConfig } from '../integrations/chai/config'
import {
  startCoverageInsideWorker,
  stopCoverageInsideWorker,
} from '../integrations/coverage'
import { vi } from '../integrations/vi'
import { closeInspector } from './inspector'
import { resolveTestRunner } from './runners'
import { setupGlobalEnv, withEnv } from './setup-node'
import { getWorkerState, resetModules } from './utils'

// browser shouldn't call this!
export async function run(
  method: 'run' | 'collect',
  files: string[],
  config: SerializedConfig,
  environment: ResolvedTestEnvironment,
  executor: VitestExecutor,
): Promise<void> {
  const workerState = getWorkerState()

  await setupGlobalEnv(config, environment, executor)
  await startCoverageInsideWorker(config.coverage, executor)

  if (config.chaiConfig) {
    setupChaiConfig(config.chaiConfig)
  }

  const runner = await resolveTestRunner(config, executor)

  workerState.onCancel.then((reason) => {
    closeInspector(config)
    runner.onCancel?.(reason)
  })

  workerState.durations.prepare = performance.now() - workerState.durations.prepare
  workerState.durations.environment = performance.now()

  await withEnv(
    environment,
    environment.options || config.environmentOptions || {},
    async () => {
      workerState.durations.environment
        = performance.now() - workerState.durations.environment

      for (const file of files) {
        const isIsolatedThreads
          = config.pool === 'threads'
          && (config.poolOptions?.threads?.isolate ?? true)
        const isIsolatedForks
          = config.pool === 'forks'
          && (config.poolOptions?.forks?.isolate ?? true)

        if (isIsolatedThreads || isIsolatedForks) {
          executor.mocker.reset()
          resetModules(workerState.moduleCache, true)
        }

        workerState.filepath = file

        if (method === 'run') {
          await startTests([file], runner)
        }
        else {
          await collectTests([file], runner)
        }

        // reset after tests, because user might call `vi.setConfig` in setupFile
        vi.resetConfig()
        // mocks should not affect different files
        vi.restoreAllMocks()
      }

      await stopCoverageInsideWorker(config.coverage, executor)
    },
  )

  workerState.environmentTeardownRun = true
}
