# Vercel Bug Reproduction

This repo will fail to deploy with Vercel. Relevant error logs:

```
18:11:22	Uploading build outputs...
18:11:22	Uploading build outputs...
18:11:25	Done with "api/query-client.ts"
18:11:25	Done with "api/firebase-admin.ts"
18:11:26	info  - Using external babel configuration from /vercel/workpath1/.babelrc
18:11:32	info  - Compiled successfully
18:11:32	info  - Collecting page data...
18:11:33	info  - Generating static pages (0/2)
18:11:33	info  - Generating static pages (2/2)
18:11:33	info  - Finalizing page optimization...
18:11:33	Page                                                           Size     First Load JS
18:11:33	┌ ○ /                                                          276 B          61.3 kB
18:11:33	├ ○ /404                                                       3.44 kB        64.4 kB
18:11:33	└ λ /topic/[topicId]                                           305 B          61.3 kB
18:11:33	+ First Load JS shared by all                                  61 kB
18:11:33	  ├ chunks/f6078781a05fe1bcb0902d23dbbb2662c8d200b3.203178.js  13 kB
18:11:33	  ├ chunks/framework.2df7a7.js                                 40 kB
18:11:33	  ├ chunks/main.cedf12.js                                      6.28 kB
18:11:33	  ├ chunks/pages/_app.d29abb.js                                1.01 kB
18:11:33	  └ chunks/webpack.e06743.js                                   751 B
18:11:33	λ  (Lambda)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
18:11:33	○  (Static)  automatically rendered as static HTML (uses no initial props)
18:11:33	●  (SSG)     automatically generated as static HTML + JSON (uses getStaticProps)
18:11:33	   (ISR)     incremental static regeneration (uses revalidate in getStaticProps)
18:11:33	Done in 15.09s.
18:11:38	Traced Next.js serverless functions for external files in: 5001.761ms
18:11:39	Compressed shared serverless function files: 1101.553ms
18:11:39	All serverless functions created in: 116.618ms
18:11:48	ReferenceError: NowBuildError is not defined
18:11:48	    at retry.retries (/var/task/sandbox-worker.js:116373:9)
18:11:48	    at processTicksAndRejections (internal/process/task_queues.js:97:5)
18:11:48	    at async patchBuild (/var/task/sandbox-worker.js:116310:10)
18:11:48	    at async patchBuildToUploading (/var/task/sandbox-worker.js:117471:47)
18:11:48	    at async /var/task/sandbox-worker.js:116998:39
18:11:53	Build completed. Populating build cache...
18:12:17	Uploading build cache [57.31 MB]...
18:12:21	Build cache uploaded: 3592.917ms
18:12:21	Done with "api/analytics.ts"
18:12:21	Done with "package.json"
```
