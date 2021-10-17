
### Step run

```
yarn install
```

```
yarn start
```

Visit http://127.0.0.1:8080/

Open Dev tools and see error: 

```
Uncaught DOMException: Failed to construct 'Worker': Script at 'http://localhost:4000/src_worker_ts.js' cannot be accessed from origin 'http://127.0.0.1:8080'.
    at createWorker (http://localhost:4000/main.js:32:3)
    at App (http://localhost:4000/main.js:36:3)
    at renderWithHooks (http://localhost:4000/main.js:21389:18)
    at mountIndeterminateComponent (http://localhost:4000/main.js:24215:13)
    at beginWork (http://localhost:4000/main.js:25453:16)
    at HTMLUnknownElement.callCallback (http://localhost:4000/main.js:10349:14)
    at Object.invokeGuardedCallbackDev (http://localhost:4000/main.js:10398:16)
    at invokeGuardedCallback (http://localhost:4000/main.js:10460:31)
    at beginWork$1 (http://localhost:4000/main.js:30363:7)
    at performUnitOfWork (http://localhost:4000/main.js:29175:12)
```


In webpack 4 we used below workaround for local dev but this no longer work in webpack5.

```
/**
 * Provide workaround for cross origin workers
 * When running locally worker code is on webpack-dev-server
 * @see https://stackoverflow.com/questions/21913673/execute-web-worker-from-different-origin
 */
if (process.env.NODE_ENV === 'development') {
    const OriginalWorker = window.Worker;

    const PathWorker = (url: string | URL, opts?: WorkerOptions) => {
        const blob = new Blob(
            ['importScripts(' + JSON.stringify(url) + ')'],
            { type: 'text/javascript' },
        );
        return new OriginalWorker(URL.createObjectURL(blob), opts);
    };

    window.Worker = PathWorker as unknown as typeof Worker;
}
```