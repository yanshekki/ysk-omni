const Ga="gog_admin_lang",Vt={en:{brand:"YSK Omni",brandSub:"Admin Panel",loginTitle:"Admin",loginLabel:"API Key",loginOtpLabel:"One-time login code",loginBtn:"Sign in",loginCmdHint:"Get a key from the terminal:",loginOtpHint:"Generate a code in terminal (required every login):",loginOtpExpiry:"Code expires in 5 minutes and can be used only once.",loginOtpFail:"Invalid or expired code",loginLostKey:"Lost old key? Create a new admin key (plaintext is not stored).",loginCopy:"Copy",loginCopied:"Copied",needKey:"Enter API key",needOtp:"Enter the one-time code from the terminal",logout:"Log out",shell:{menu:"Open menu",closeMenu:"Close menu"},nav:{dashboard:"Dashboard",chat:"Chat",chats:"Chat logs",keys:"API Keys",documents:"Documents",media:"Media",catalog:"Catalog",audit:"Audit Logs",settings:"Safety",apiFeatures:"API features",usage:"Usage & Limits",ddos:"DDoS Center",queue:"Queue",pm2:"PM2",system:"System",support:"Support"},queue:{title:"Chat queue",subtitle:"Pause, drain, requeue, and tune concurrency.",paused:"Paused",running:"Consuming",drain:"Drain mode",mode:"Mode",modeOff:"Disabled",depth:"Depth",queued:"Queued",leased:"Leased",activeJobs:"Running",dead:"Dead letter",oldest:"Oldest wait",concurrency:"Per-key / global",worker:"In-process workers",workerInstance:"Worker instance",workerInstanceHint:"This process’s consumer ID (lease owner). Changes on restart.",kpiActiveSub:"{n} active in this process",consumer:"Consumer",admission:"Admission",accepting:"Accepting jobs",pause:"Pause",resume:"Resume",drainBtn:"Drain",undrain:"Stop drain",savePolicy:"Save policy",refresh:"Refresh",jobs:"Jobs",tabOverview:"Overview",tabJobs:"Jobs",tabPolicy:"Policy",jobsMeta:"{n} matching",cancel:"Cancel",requeue:"Requeue",purgeDead:"Purge DLQ & old jobs",purgeTitle:"Purge finished jobs?",purgeConfirm:"Deletes all dead-letter (DLQ) jobs now, plus succeeded / failed / cancelled jobs finished more than 24 hours ago.",purgeConfirmBtn:"Delete",purgeDoneTitle:"Purge complete",purgeDoneMsg:"Deleted {n} job(s).",cancelConfirm:"Cancel this job? If it is running, cancellation is cooperative.",empty:"No jobs match this filter",enabled:"Queue enabled",masterOn:"Queue on",masterOff:"Queue off",masterHint:"Master switch for the durable chat queue. Applies immediately.",disabledBanner:"Queue is disabled — new chat requests bypass the queue and run immediately (subject to concurrency limits).",globalConcurrency:"Global concurrency",perKeyConcurrency:"Per-key concurrency",maxDepth:"Max queue depth",maxDepthKey:"Max per key",fairness:"Fairness",fifo:"Global FIFO",wrr:"Weighted round-robin",playgroundPriority:"Playground priority (lower first)",defaultPriority:"Default priority",leaseMs:"Lease (ms)",maxWaitMs:"Max wait (ms)",filterTitle:"Filter jobs",filterHint:"Filter by status. Auto-refreshes.",filterStatus:"Status",allStatuses:"All statuses",filterDead:"Dead letter (DLQ)",filterQueued:"Queued",filterRunning:"Running / leased",filterFailed:"Failed",filterSucceeded:"Succeeded",filterCancelled:"Cancelled",errorCol:"Error",priorityBtn:"Priority",priorityPh:"Priority (0–1000, lower first)",dlqTitle:"Dead letter queue",dlqHint:"Jobs that exhausted retries — requeue or purge when ready.",viewDlq:"View DLQ",statusPanel:"Runtime status",statusPanelHint:"Live consumer, admission, and worker identity. Auto-refreshes every few seconds.",policyTitle:"Queue policy",policyHint:"Pick a scheme or fine-tune values. Save to apply. Editing pauses auto-refresh.",presetTitle:"Policy schemes",presetHint:"One-click presets. Active = matches form · Saved = currently stored.",presetRelaxed:"Relaxed",presetBalanced:"Balanced",presetStrict:"Strict",presetCustom:"Custom",presetRelaxedHint:"Higher concurrency and deeper queues — better for multi-key playgrounds and burst traffic.",presetBalancedHint:"Default production balance: fair round-robin, moderate depth, one job per key.",presetStrictHint:"Tight limits + global FIFO — protects the host when traffic is untrusted or resource is scarce.",presetCustomHint:"Values do not match a built-in scheme. Adjust fields or pick a scheme above.",presetActiveLabel:"Active: {name}",presetFormLabel:"Draft: {name}",presetTagActive:"Active",presetTagDraft:"Draft",presetTagSaved:"Saved",hintGlobalConc:"Max jobs running at once across all keys",hintPerKeyConc:"Max concurrent jobs for a single API key",hintMaxDepth:"Reject new jobs when total queue is full",hintMaxDepthKey:"Reject when this key has too many waiting/running jobs",hintFairness:"WRR shares capacity across keys; FIFO is global order by priority/time",hintLease:"How long a worker holds a job before reclaim",hintMaxWait:"Client wait timeout while queued",colJob:"Job / request",colSource:"Source",colStatus:"Status",colModel:"Model",colPri:"Pri",colKey:"API key",colTry:"Try",colTime:"Queued",stQueued:"queued",stLeased:"leased",stRunning:"running",stSucceeded:"succeeded",stFailed:"failed",stDead:"dead",stCancelled:"cancelled",srcV1:"API",srcPlayground:"Playground",kpiDepthSub:"{q} queued · {l} leased",kpiQueuedSub:"Waiting for a worker",kpiDeadSub:"Exhausted attempts",kpiOldestSub:"Head of queue wait",wait:"Wait",started:"Started",cancelReq:"Cancel requested"},chat:{title:"Chat",new:"New chat",send:"Send",stop:"Stop",stopped:"stopped",placeholder:"Message… (Enter to send, Shift+Enter newline)",keyMode:"API key",keySelect:"API key",useSessionKey:"Signed-in admin key",useCustomKey:"Custom key",customKey:"Key",includeReasoning:"Show reasoning",resume:"Resume",resumePh:"Grok session UUID",resumeHint:"Continue a Grok CLI session (--resume)",fork:"Fork",memory:"Memory",noPlan:"No plan",permission:"Permission",effort:"Effort",effortDefault:"Default",effort_none:"None",effort_minimal:"Minimal",effort_low:"Low",effort_medium:"Medium",effort_high:"High",effort_xhigh:"X high",effort_max:"Max",tokens:"Tokens",cacheTokens:"cache",cost:"Cost",reasoning:"Thinking",needKey:"Enter or select an API key",attach:"Upload",attachLibrary:"From library",attachHint:"Drop files anywhere on this page, upload, or pick from library",dropTitle:"Drop files to attach",dropHint:"Release to upload — same formats as the attach button",formatsLabel:"Formats",formatsHint:"txt, md, csv, json, xml, html, pdf, images (png/jpg/webp/gif), code (js/ts/py/go/rs/java/c/cpp/css/yml/sql/sh…)",formatsReject:"Unsupported type: {name}. Allowed: {formats}",libraryTitle:"Previously uploaded files",librarySubtitle:"Select files owned by the current API key (same formats as upload).",librarySearch:"Search by name…",libraryEmpty:"No matching files for this key",libraryAdd:"Add selected",librarySelected:"{n} selected",libraryAlready:"Already attached",libraryLoadFail:"Could not load documents",uploading:"Uploading…",uploadFail:"Upload failed",uploadProgress:"Uploading {name}",uploadProgressMulti:"Uploading {name} ({i}/{n})",emptyTitle:"Start a conversation",emptyHint:"Send a message or attach files. Open a previous chat from the history panel to continue.",needContent:"Type a message or attach at least one file",tooManyFiles:"Too many files (max 10 per message)",fileOnlyPrompt:"Please review the attached files.",removeFile:"Remove",docs:"Attachments",you:"You",assistant:"Assistant",streaming:"Streaming…",emptyReply:"(empty reply)",systemPrompt:"System prompt",systemPlaceholder:"Optional system instructions for the model…",systemHint:"Sent as a system message on every turn. Not shown in the chat bubbles.",history:"History",historyEmpty:"No saved conversations yet",historySearch:"Search topics…",historyOpen:"Show history",historyClose:"Close history",rename:"Rename",renamePh:"Conversation topic",untitled:"Untitled chat",deleteConversation:"Delete",deleteConfirm:"Delete this conversation? This cannot be undone.",saveFail:"Could not save conversation",loadFail:"Could not load conversation",historyPrev:"Previous",historyNext:"Next",historyPage:"Page {n} / {total}",msgs:"{n} messages",settings:"Settings",settingsHide:"Hide settings",compress:"Summarize for context",compressConfirm:"Generate a conversation summary for later turns? Your full chat history stays on screen. Only the model context is shortened. This uses one model call.",compressing:"Summarizing…",compressNeedMore:"Need at least 3 messages (or 2 long ones) to summarize. Continue chatting, then try again.",compressFail:"Could not create summary",compressNeedSummary:"Create a summary first (Summarize for context).",compressedBadge:"Summary",compressOk:"Summary ready — full history kept. Context mode set to summary.",compressBusy:"Wait for the current reply to finish",compressResultTitle:"Conversation summary",compressView:"View summary",summaryMeta:"Created: {when} · Based on {n} messages",ctxPolicyTitle:"Model context",ctxRemark:"Full messages stay visible. This only controls what is sent to the model next.",ctxMode:"Context",ctxModeFull:"Full history",ctxModeSummary:"Summary + recent",ctxModeRecent:"Recent only",ctxModeFullLabel:"Sending full history to the model",ctxModeSummaryLabel:"Sending summary + last {n} messages",ctxModeRecentLabel:"Sending last {n} messages only",ctxRecentN:"Recent N",ctxLongHint:"Long thread detected — consider Summary or Recent to reduce tokens and lag.",loadOlder:"Load {n} earlier messages",showMore:"Show more",showLess:"Show less",copy:"Copy",copied:"Copied",copyFail:"Copy failed"},status:{success:"success",error:"error",timeout:"timeout",pending:"pending",active:"active",finished:"finished",online:"online",stopped:"stopped"},dash:{title:"Dashboard",subtitle:"Traffic, queue, safety, and protection at a glance.",last24:"Requests (24h)",totalChat:"Total chats",success:"Success",errors:"Errors / timeout",docs:"Documents",keys:"Active keys",concurrent:"Grok concurrency",recent:"Recent API chats",empty:"No data yet",emptyModels:"No model traffic in the last 24h",updated:"Updated",refresh:"Refresh",viewAll:"View all",openDdos:"DDoS center",openSettings:"Safety",openQueue:"Open queue",kpi24h:"Requests (24h)",kpi24hSub:"{ok} ok · {err} errors",kpiSuccessRate:"Success rate (24h)",kpiSuccessRateSub:"All-time {all}%",kpiErrors:"Errors (24h)",kpiErrorsSub:"All-time {all}",kpiKeys:"API keys",kpiKeysSub:"Active / total",kpiDocs:"Documents",kpiMedia:"Media assets",kpiMediaSub:"{n} in 24h",kpiDocsSub:"Stored files",kpiConv:"Playground threads",kpiConvSub:"{n} updated in 24h",kpiSessions:"OTP sessions",kpiSessionsSub:"Active admin logins",kpiConcurrent:"Grok concurrency",kpiConcurrentSub:"Active / max slots",kpiQueue:"Chat queue",kpiQueueSub:"Depth · running / max · dead",kpiQueueSubLive:"{run}/{max} run · {dead} dead{wait}",kpiQueuePaused:"Paused",kpiQueueDrain:"Drain",kpiQueueOff:"Disabled",kpiSafe:"Global safe",kpiSafeOn:"On",kpiSafeOff:"Off",kpiSafeSub:"{tools} · turns {turns} · {model}",kpiSafeSubEmpty:"Settings unavailable",queuePanel:"Chat queue",queueState:"State",queueLive:"Live",qQueued:"Queued",qRunning:"Running",qDead:"Dead",qSucceeded:"Succeeded",qWorker:"Worker",qWorkerActive:"active slots",qOldest:"oldest wait",qUnavailable:"Queue stats unavailable",safety:"Safety settings",globalSafe:"Global safe mode",safeTools:"Tools",safeTurns:"Max turns",safeTimeout:"Timeout",defaultModel:"Default model",safetyHint:"Affects safe-mode keys and forced-safe traffic. Playground OTP sessions use agent mode unless global safe is on.",protection:"Protection",autoBan:"Auto-ban",on:"On",off:"Off",ruleAuth:"Auth",ruleRate:"429",ruleConn:"Conn",ruleVelocity:"Velocity",bans:"Blacklist",blocked:"Blocked hits",rateHits:"Rate-limit hits",liveConn:"Live connections",proxy:"Proxy IP",hops:"hops",limits:"Key/IP limits",models24h:"Models (24h)",runtime:"Runtime",port:"Listen port",defaultPort:"default",env:"Environment",authMode:"Admin auth",authOtp:"OTP session",encryption:"Encryption",ready:"Ready",notReady:"Not ready"},chats:{title:"Chat history",total:"Total",decrypt:"Open a row to view decrypted content.",search:"Search",searchPh:"Request ID, key name, model…",filterTitle:"Search & filters",filterHint:"Filter, then open a row for full detail.",status:"Status",allStatus:"All statuses",model:"Model",allModels:"All models",apiKey:"API key",allKeys:"All keys",from:"From",to:"To",mode:"Mode",allModes:"All modes",hasDocs:"Has attachments",filter:"Apply filters",reset:"Reset",request:"Request",prompt:"Prompt",response:"Response",time:"Time",attachments:"Attachments",page:"Page",prev:"Previous",next:"Next",perPage:"Per page",detail:"Chat detail",noAttach:"No attachments",openFile:"Open / preview",close:"Close",copyPrompt:"Copy prompt",copyContent:"Copy content",copySystem:"Copy system prompt",copyRawPrompt:"Copy raw prompt",duration:"Duration",stream:"Stream",reasoning:"Reasoning / thought",content:"Content (output)",raw:"Raw stored response",rawPrompt:"Raw stored prompt",userPrompt:"User / conversation prompt",systemPrompt:"System prompt",systemHint:"Extracted from the stored prompt (system role messages).",noSystem:"No system prompt in this request.",hasSystem:"Has system",none:"(none)",file:"file",img:"img",previewFailed:"Preview failed"},keys:{title:"API Keys",new:"New key",searchPh:"Name or key prefix…",name:"Name",role:"Role",mode:"Mode",rate:"Rate / min",status:"Status",created:"Created",edit:"Edit",revoke:"Revoke",confirmRevoke:"Revoke this key?",empty:"No keys",usage24:"24h use",maxTurns:"Max turns",timeoutMs:"Timeout (ms)",ipWhitelist:"IP whitelist",ipWhitelistHint:"One IP or CIDR per line. Empty = allow all IPs.",ipWhitelistCol:"IP allow",ipAll:"All IPs",keyOnce:"Store this key securely — shown once:",roleClient:"client",roleAdmin:"admin",roleClientBadge:"client",roleAdminBadge:"admin",modeSafe:"safe (external)",modeAgent:"agent (full tools)",modeSafeBadge:"safe",modeAgentBadge:"agent",ipCount:"{n} IPs",ipPlaceholder:`127.0.0.1
203.0.113.0/24`},docs:{title:"Documents",total:"Total",file:"File",mime:"MIME",size:"Size",time:"Time",storage:"Storage",storageDb:"Database (encrypted)",storageFs:"Filesystem (encrypted)",storageHint:"Encrypted storage · DB under {dbMax}, files in {dir} · max {upMax}.",download:"Download",downloadFail:"Download failed",binaryPreview:"This is a binary file (e.g. PDF). Preview is not available — please use Download.",delete:"Delete",confirmDel:"Delete this document?",detail:"Document detail",preview:"Preview",copy:"Copy content",empty:"No documents",searchPh:"File name or MIME…",page:"Page",prev:"Previous",next:"Next"},audit:{title:"Audit logs",searchPh:"Action, resource, IP, key…",time:"Time",action:"Action",resource:"Resource",key:"Key",meta:"Meta",empty:"No logs",id:"ID",actions:{chat_create:"Chat create",document_upload:"Document upload",document_delete:"Document delete",document_list:"Document list",document_read:"Document read",document_download:"Document download",api_key_create:"API key create",api_key_update:"API key update",api_key_delete:"API key revoke",api_key_list:"API key list",settings_update:"Settings update",chat_admin_view:"Chat admin view",system_update:"System update",system_update_check:"Update check",ip_ban:"IP ban",ip_unban:"IP unban",ddos_policy_update:"DDoS policy update",pm2_start:"PM2 start",pm2_stop:"PM2 stop",pm2_restart:"PM2 restart",pm2_reload:"PM2 reload",pm2_config:"PM2 config",pm2_switch:"PM2 switch runner",playground_chat:"Playground chat",playground_upload:"Playground upload"},resources:{document:"Document",chat:"Chat",api_key:"API key",settings:"Settings",system:"System",pm2:"PM2",playground:"Playground",ip:"IP"},metaStorage:"Storage",metaAsKey:"As key id",metaAsKeyName:"As key name"},settings:{title:"Safety settings",hint:"Global safe mode for all keys.",globalSafe:"Global safe mode",globalSafeHint:"On = all keys safe. Off = each key’s own mode.",masterOn:"Safe mode on",masterOff:"Safe mode off",disabledBanner:"Global safe is off — keys use their own safe/agent mode.",tools:"Tools mode",toolsHint:"none: no shell/web/write. readonly: read/search only.",toolsNone:"none",toolsReadonly:"readonly",maxTurns:"Max turns",maxTurnsHint:"Safe-mode steps. Chat 3–6 · API 8–12 · multi-step 15–40.",timeout:"Timeout (ms)",timeoutHint:"Safe-mode deadline. 60s–120s normal · 300s–600s long jobs.",defaultModel:"Default model",defaultModelHint:"When client omits model.",modelSource:"Grok CLI",refreshModels:"Refresh models",panel:"Admin Panel",save:"Save",saved:"Saved",guideTitle:"Presets",guideIntro:"Apply, then tweak if needed.",guideApply:"Apply",guideActive:"Applied",guideApplyConfirm:"Apply “{name}” and save? Current values will be replaced.",guideApplied:"Preset saved",chipGlobalOn:"Safe: On",chipGlobalOff:"Safe: Off",scLocalTitle:"Local playground",scLocalDesc:"Full tools on your machine.",scLocalDetail:"Safe OFF · agent keys.",scProdTitle:"Public API",scProdDesc:"Least privilege for apps/customers.",scProdDetail:"Safe ON · tools none · turns 8–12 · 60–120s.",scCodeTitle:"Coding agent",scCodeDesc:"Trusted host only — edit & run.",scCodeDetail:"Safe OFF · agent keys.",scReadTitle:"Read-only",scReadDesc:"Explain/search code, no writes.",scReadDetail:"Safe ON · tools readonly · turns 8–15 · 120–180s.",scChatTitle:"Q&A only",scChatDesc:"Text answers, no tools.",scChatDetail:"Safe ON · tools none · turns 3–6 · 60s.",scLongTitle:"Long safe tasks",scLongDesc:"Many steps without max-turns fail.",scLongDetail:"Safe ON · none/readonly · turns 20–40 · 300–600s.",dangerTitle:"Danger zone",disablePanel:"Disable Admin Panel",disablePanelConfirm:"Disable panel and sign out? Re-enable: ysk-omni admin on",disablePanelDone:"Panel disabled. Re-enable: ysk-omni admin on",panelOffHint:"Turn off here. Re-enable on server: ysk-omni admin on",panelStatus:"Status",panelOn:"On",panelOff:"Off"},apiFeatures:{title:"API features",intro:"Toggle protocols & capabilities · applies in ~2s · no restart.",tabProtocols:"Protocols",tabMedia:"Media",tabCaps:"Capabilities",tabEmu:"Emulation",kpiEnabled:"Enabled",kpiEnabledSub:"Flags currently on",groupMeta:"{on} / {n} enabled",groupProtocols:"Protocol surfaces",groupMedia:"Media APIs (OpenAI-compatible)",groupCaps:"Grok CLI capabilities",groupEmu:"Emulation & safety",presetOpen:"Preset: Open",presetLocked:"Preset: Locked",presetDev:"Preset: Dev",presetConfirm:"Apply feature preset “{name}”? This overwrites all API feature flags.",flag:{openaiChat:"OpenAI Chat Completions",openaiResponses:"OpenAI Responses",anthropicMessages:"Anthropic Messages",imagesApi:"Images API",filesOpenAiAlias:"Files API alias",videoApi:"Videos API (async jobs)",audioApi:"Audio API (speech / STT)",tools:"Tools / function calling",structuredOutput:"Structured output (--json-schema)",vision:"Vision / image parts (--prompt-json)",reasoningEffort:"Reasoning effort",webSearch:"Web search tools",subagents:"Subagents",planMode:"Plan mode",memory:"Cross-session memory",sessionResume:"Session resume / continue",bestOfN:"best-of-n (removed in Grok 1.0+)",checkLoop:"Self-check loop (removed in Grok 1.0+)",systemOverride:"System prompt override",rules:"Extra rules",permissionMode:"Permission mode",sandbox:"Sandbox profile",usageEstimate:"Estimate token usage",assistantsEmulation:"Assistants-lite (local)",strictSampling:"Strict sampling (reject temperature…)",forceDisableToolsInSafe:"Force tool limits in safe mode"},hint:{openaiChat:"POST /v1/chat/completions",openaiResponses:"POST /v1/responses",anthropicMessages:"POST /v1/messages",imagesApi:"POST /v1/images/generations + /edits (agent key)",filesOpenAiAlias:"POST/GET /v1/files → documents + media store",videoApi:"POST /v1/videos + poll GET /v1/videos/:id",audioApi:"POST /v1/audio/speech + /transcriptions (needs provider)",tools:"Maps tools → Grok --tools + system tool list",structuredOutput:"response_format / json_schema",vision:"image_url content parts",reasoningEffort:"--reasoning-effort",webSearch:"When off: --disable-web-search",subagents:"--no-subagents when off",planMode:"--no-plan when off",memory:"--experimental-memory",sessionResume:"--resume / --continue",bestOfN:"Deprecated — Grok Build 1.0+ rejects this flag",checkLoop:"Deprecated — Grok Build 1.0+ rejects this flag",systemOverride:"--system-prompt-override",rules:"--rules",permissionMode:"--permission-mode",sandbox:"--sandbox",usageEstimate:"Fill usage with char/4 estimates",assistantsEmulation:"Local /v1/assistants + /v1/threads",strictSampling:"400 if temperature/top_p/stop sent",forceDisableToolsInSafe:"Keep safe-mode tool policy"}},catalog:{title:"Catalog",intro:"Search and pull models from Hugging Face, then load a local GGUF into llama-server.",tabPacks:"Curated packs",tabLocal:"Local models",tabHub:"Hugging Face",kpiLoaded:"Loaded",kpiLoadedSub:"Engines in VRAM",kpiLoadedNone:"None loaded",kpiVram:"VRAM",kpiVramSub:"{used} / {budget} MB estimated",kpiLocal:"On disk",kpiLocalSub:"Registry entries",kpiPacks:"Packs",kpiPacksSub:"Curated catalog",filterModality:"Modality",filterAll:"All",colName:"Model",colModality:"Modality",colRuntime:"Runtime",colQuant:"Quant",colVram:"VRAM",colSize:"Size",sizeEst:"est.",colStatus:"Status",colPath:"Path",pull:"Pull",pulling:"Pulling…",pullingBanner:"Downloading {id}",pullAgain:"Pull again",onDisk:"On disk",load:"Load",unload:"Unload",delete:"Delete",deleteConfirm:"Delete {id} from disk and the local registry?",pullSpec:"Pull a specific model",pullSpecPh:"org/repo or org/repo:Q4_K_M",pullSpecBtn:"Pull",pullSpecHint:"Paste a Hub id. This downloads weights into the local registry.",hubBrowse:"Browse Hub",hubBrowseHint:"Search models this gateway can run (llama.cpp, vLLM, diffusion, whisper).",hubSearchBtn:"Search",loaded:"Loaded",idle:"Idle",emptyPacks:"No packs in this filter",emptyLocal:"The local registry is empty — pull a model from Hugging Face",emptyLocalHint:"Open Hugging Face, search or paste org/repo, then Pull.",hubHint:"Live Hugging Face Hub REST API (/api/models). Paginated with Link cursors. There is no RSS/Atom feed for the model index.",hubSearch:"Search Hub",hubSearchPh:"Qwen, llama, flux, whisper…",hubEmpty:"No Hub results",hubMore:"Load more",downloads:"Downloads",unsupported:"No local runtime",hubFail:"Hub search failed",sync:"Sync popular",syncing:"Syncing…",syncOk:"Synced {n} popular GGUF models",syncAt:"Last sync {when}",syncHint:"Adds the 50 most-downloaded GGUF ids to the list. This does not download files; Pull a row to fetch weights.",noQuant:"—",pullFail:"Pull failed",pullNoGguf:"No GGUF file in this repository. It was not added to local models.",loadFail:"Load failed",unloadFail:"Unload failed",mod:{text:"Text",image:"Image",video:"Video",tts:"Speech",stt:"Transcribe"}},media:{title:"Media library",intro:"Studio, assets, and video jobs. Needs imagesApi / tools (videoApi for video).",tabStudio:"Studio",tabAssets:"Assets",tabJobs:"Jobs",kpiAssetsSub:"Stored media files",kpiJobsSub:"Video generation jobs",kpiStudioSub:"Generate, edit, or image-to-video",assets:"Assets",jobs:"Video jobs",empty:"No media assets yet",jobsEmpty:"No video jobs yet",kind:"Kind",bytes:"Size",provider:"Provider",providerPh:"Provider name…",prompt:"Prompt",created:"Created",status:"Status",preview:"Preview",previewUnsupported:"This format cannot be previewed in the browser. Please download the file.",previewFail:"Failed to load preview",previewTruncated:"preview truncated",download:"Download",delete:"Delete",deleteConfirm:"Soft-delete this media asset?",allKinds:"All kinds",searchPh:"Prompt, filename, MIME, provider, or ID…",from:"From",to:"To",generate:"Generate image",generateTitle:"Generate image",studioTitle:"Media studio",studioHint:"Create images, edit existing images, or start image-to-video jobs. Execution limits follow Safety settings. Requires imagesApi and tools (videoApi for video).",generateHint:"Uses Grok Imagine tools (image_gen, image_edit, image_to_video).",generatePrompt:"Prompt",generatePromptPh:"Describe the image you want to create…",generateSize:"Size",aspectRatio:"Aspect ratio",aspectHint:"Grok Imagine aspect_ratio values (not OpenAI pixel sizes)",generateN:"Count",nHint:"Grok does not batch n; the gateway runs sequential generations (1–4)",generateKey:"API key",generateKeySession:"Signed-in admin session",generateSubmit:"Generate",generateBusy:"Generating… this may take a minute",generateOk:"Image generated. See the assets list below.",generateFail:"Image generation failed",generateNeedPrompt:"Please enter a prompt",modeGenerate:"Generate",modeEdit:"Edit",modeVideo:"Video",modelDefault:"system default",modelEmpty:"No models reported by Grok CLI",modelHint:"All models from the local Grok CLI; system default is pre-selected",editSubmit:"Edit image",editBusy:"Editing…",editOk:"Image edited. See the assets list below.",editNeedImage:"Select or drop a source image to edit",editImage:"Source image",editImageHint:"Required for image_edit",editPromptPh:"Describe the changes to apply…",videoSubmit:"Create video job",videoBusy:"Queuing video job…",videoOk:"Video job queued. See the Jobs tab.",videoVoice:"Voice",videoVoiceNone:"No speech",videoVoiceHint:"Optional preset voice — uses reference_to_video",videoDuration:"Duration",videoDurationHint:"Grok image_to_video / reference_to_video: 1–15 seconds",videoSource:"Source frame (optional)",videoSourceHint:"Optional. If omitted, a frame is generated from the prompt first, then animated.",videoNoSource:"Auto-generate frame from prompt",videoPromptPh:"Describe camera motion and the shot…",sourceTitle:"Source image",sourceHint:"Drag and drop an image, choose a local file, or pick any image from Documents or Media assets.",dropzoneAria:"Drop zone for source image",dropTitle:"Drop an image here",dropHint:"Or choose a local file / pick from the system library",dropTitleVideo:"Drop a source frame (optional)",dropHintVideo:"Optional for video. Empty source generates a frame from the prompt first.",pickFile:"Choose file",pickLibrary:"System library",clearSource:"Clear",sourceNeedImage:"Please provide an image file (PNG, JPEG, WebP, GIF…)",sourceKindUpload:"Upload",sourceKindAsset:"Media asset",sourceKindDocument:"Document",libraryTitle:"Select source file",librarySubtitle:"Any image stored in Documents or Media assets on this gateway.",libraryTabDocs:"Documents",libraryTabAssets:"Media assets",librarySearch:"Search by name, MIME, or ID…",libraryFormats:"Images only (PNG, JPEG, WebP, GIF, …)",libraryEmpty:"No matching files",librarySelect:"Use selected",libraryLoadFail:"Failed to load library"},usage:{title:"Usage & anti-abuse",window:"Window",requests:"Requests",success:"Success",errors:"Errors",errorRate:"Error rate",byModel:"By model",byKey:"Per API key",rateLimit:"Limit / min",util:"Est. utilization",lastUsed:"Last used",limits:"Gateway limits",global:"Global max / window",ipMax:"Unauth IP max",burst:"Chat burst (10s)",block:"Auth fail block threshold",concurrent:"Grok max concurrent",refresh:"Refresh"},ddos:{title:"DDoS control center",tabPolicy:"Policy",tabLive:"Traffic",tabBlacklist:"Blacklist",tabEvents:"Events",live:"Live connections",recent:"Recent requests",blacklist:"IP blacklist",stats:"Abuse stats",refresh:"Refresh",pause:"Pause auto-refresh",resume:"Resume auto-refresh",ban:"Ban IP",unban:"Unban",banConfirm:"Ban this IP?",banWhitelistWarn:"This IP is on the auto-ban whitelist. Ban anyway?",unbanConfirm:"Remove this IP from blacklist?",ip:"IP",method:"Method",path:"Path",key:"API key",duration:"Duration",state:"State",ua:"User-Agent",reason:"Reason",source:"Source",expires:"Expires",permanent:"Permanent",addBan:"Add ban",ttl:"TTL",ttlPerm:"Permanent",ttl1h:"1 hour",ttl24h:"24 hours",ttl7d:"7 days",activeConn:"Active",rateHits:"Rate-limit hits",blockedHits:"Blocked hits",autoBans:"Auto bans",topIps:"Top IPs (recent)",emptyLive:"No active connections",emptyBan:"Blacklist is empty",emptyEvents:"No auto-ban events yet",reasonPh:"Optional reason",banReasonDefault:"manual from admin",ipPlaceholder:"1.2.3.4",policyTitle:"Protection policy",policyHint:"All thresholds are live — no restart. Env values are only the initial defaults.",autoOn:"Auto-judgment ON",autoOff:"Auto-judgment OFF",autoBanMaster:"Enable automatic IP bans",autoBanMasterHint:"When off, rate limits still apply but IPs are never auto-banned.",masterOn:"Auto-ban on",masterOff:"Auto-ban off",disabledBanner:"Automatic IP bans are off — rate limits still apply, but IPs will not be auto-blacklisted.",presetTitle:"Policy profile",presetHint:"Pick a profile or edit fields — custom is detected automatically.",presetRelaxed:"Relaxed",presetBalanced:"Balanced",presetStrict:"Strict",presetCustom:"Custom",presetActiveLabel:"Active: {name}",presetFormLabel:"Form: {name} (unsaved)",presetTagActive:"Active",presetTagDraft:"Draft",presetTagSaved:"Saved",presetActiveHint:"Current profile: {name}. Click Save if you changed other fields.",presetCustomHint:"Values do not match Relaxed / Balanced / Strict — treated as Custom.",presetUnsavedHint:"Form shows {form}; server still has {saved}. Click Save policy to apply.",savePolicy:"Save policy",resetPolicy:"Reset to env defaults",policySaved:"Protection policy saved. Rate limiters reloaded.",policyReset:"Policy reset to environment defaults.",confirmReset:"Reset all DDoS policy fields to .env defaults?",sectionProxy:"Reverse proxy / CDN",proxyHint:"When traffic passes through nginx or Cloudflare, enable trust hops so bans, rate limits, and audit logs use the real client IP — not the proxy IP.",proxyTrustHops:"Trusted proxy hops",proxyTrustHopsHint:"0 = direct only (ignore headers). 1 = nginx or Cloudflare→app. 2 = Cloudflare→nginx→app.",proxyIpSource:"Client IP source",proxyIpSourceHint:"auto tries CF-Connecting-IP, then X-Real-IP, then X-Forwarded-For. Use “socket” only for direct connections.",proxySrcAuto:"Auto (recommended)",proxySrcCf:"Cloudflare (CF-Connecting-IP)",proxySrcNginx:"nginx (X-Real-IP)",proxySrcXff:"X-Forwarded-For only",proxySrcSocket:"TCP socket only (no proxy)",trustedProxies:"Trusted proxy IPs / CIDRs",trustedProxiesHint:"Only these peers may set CF-Connecting-IP / X-Real-IP / XFF. Default 127.0.0.1 — add your nginx/LB host if remote. Direct clients cannot spoof headers.",sectionLimits:"Rate limits",sectionAuth:"Failed authentication",sectionRate:"Rate-limit abuse (429)",sectionConn:"Connection flood",sectionVelocity:"Request velocity",sectionEscalate:"Repeat offender escalation",sectionWhitelist:"Auto-ban whitelist",whitelistHint:"One IP or CIDR per line. These IPs are never auto-banned.",rateWindow:"Window (sec)",rateMaxKey:"Max / key",rateMaxIp:"Max / IP (no key)",burstWindow:"Burst window (sec)",burstMax:"Burst max",enableRule:"Enabled",threshold:"Threshold",windowSec:"Window (sec)",banMin:"Ban duration (min)",escalateAfter:"Escalate after N auto-bans",escalateMin:"Escalated ban (min)",maxConcurrent:"Max concurrent / IP",velocityMax:"Max requests",eventsTitle:"Recent auto-ban events",eventTime:"When",eventSource:"Rule",eventDuration:"Ban for",sources:{manual:"Manual","auto-auth":"Auto · auth","auto-rate":"Auto · 429","auto-conn":"Auto · concurrent","auto-velocity":"Auto · velocity","auto-escalate":"Auto · escalated"}},pm2:{title:"PM2 control",tabRunner:"Runner",tabPort:"Port",tabConfig:"Config",tabLogs:"Logs",status:"Process status",start:"Start with PM2",stop:"Stop PM2",restart:"Restart",reload:"Reload",logs:"Logs",logsHint:"Error log first",clearLogs:"Clear logs",confirmClearLogs:"Clear PM2 and ysk-omni log files? This cannot be undone (files are truncated).",logsCleared:"Cleared {n} log file(s).",logsAutoTrim:"Auto-trim over {maxMb} MB → keep last ~{keepKb} KB (on each log read).",refresh:"Refresh",confirmStop:"Stop the PM2 process?",confirmRestart:"Restart under PM2? Port will be handed over cleanly.",unavailable:"PM2 not available",disabled:"PM2 admin is disabled",app:"App name",pid:"PID",uptime:"Uptime",memory:"Memory",cpu:"CPU",restarts:"Restarts",portBusy:"Port in use",port:"Port",portTitle:"Listen port",portHint:"HTTP port for the gateway Admin UI and API. Changing the port updates .env and restarts the runner so the new port takes effect.",fieldPort:"Port",portDefaultNote:"Default is 3850. Valid range: 1–65535.",savePort:"Save port & restart",useDefaultPort:"Use default (3850)",portInvalid:"Enter a valid port number (1–65535).",confirmPortChange:"Change listen port to {port} and restart the gateway? You will need to open Admin on the new port (e.g. http://localhost:{port}/admin).",portChangedMsg:"Port updated: {from} → {to}.",portSavedNeedRestart:"Port {port} saved to .env. Restart the gateway for it to take effect.",portAfterRestart:"After restart, open Admin at http://localhost:{port}/admin",hint:"Run with PM2 or detached ysk-omni. Switch anytime here or via CLI.",switchTitle:"Runner",switchHint:"Only one runner should bind the port.",currentRunner:"Current runner",runnerPm2:"PM2",runnerGctoac:"ysk-omni (detached)",runnerNone:"Not running",runnerUnknown:"Unknown / mixed",switchToPm2:"Switch to PM2",switchToGctoac:"Switch to ysk-omni",confirmSwitchPm2:"Switch to PM2? Gateway restarts under PM2 in a few seconds.",confirmSwitchGctoac:"Switch to ysk-omni? Gateway restarts as a detached process in a few seconds.",switchScheduled:"Switch scheduled. Admin will refresh automatically in about 10 seconds.",autoRefreshIn:"This page will reload automatically in {n} seconds…",autoRefreshNow:"Reloading…",omniPid:"ysk-omni PID",configTitle:"PM2 config",configHint:"Saved to pm2.runtime.json and applied via ecosystem.config.cjs. Save & apply restarts PM2 if it is the active runner.",saveConfig:"Save & apply",saveOnly:"Save only",resetConfig:"Reset defaults",confirmReset:"Reset PM2 config to defaults?",configSaved:"Config saved",fieldName:"App name",fieldScript:"Script",fieldCwd:"Working directory (cwd)",fieldInstances:"Instances",fieldExecMode:"Exec mode",fieldAutorestart:"Autorestart",fieldWatch:"Watch",fieldMaxMem:"Max memory restart",fieldMaxRestarts:"Max restarts",fieldMinUptime:"Min uptime",fieldRestartDelay:"Restart delay (ms)",fieldBackoff:"Exp backoff restart delay (ms)",fieldMergeLogs:"Merge logs",fieldTime:"Log timestamps",fieldErrorFile:"Error log file",fieldOutFile:"Out log file",fieldEnvExtra:"Extra env (KEY=value per line)",fieldPreferred:"Preferred runner",empty:"App not in pm2 list",modeFork:"fork",modeCluster:"cluster",phCwd:"(package root)",phInstances:"1 or max",phEnv:"NODE_ENV=production",statusOnline:"online",statusErrored:"errored",statusStopped:"stopped",msgOk:"OK",msgDisabled:"PM2 admin is disabled (PM2_ADMIN_ENABLED=false).",msgBinaryMissing:"pm2 not found on PATH. Install: npm install -g pm2",msgNotInList:'App "{app}" is not in the PM2 list — use Start with PM2 or Switch to PM2.',msgPortGctoac:"Port {port} is held by ysk-omni (pid {pid}). Use “Switch to PM2” to hand over.",msgPortBusy:"Port {port} is in use (pid {pids}).",msgErrored:"PM2 process errored — check logs / config, then Restart or fix port conflicts.",msgBothRunners:"Both runners detected; ysk-omni pid {pid} also holds resources. Prefer one via Switch.",msgError:"PM2 error: {error}",msgSwitchPm2:"Switching to PM2… The gateway will restart under PM2 in a few seconds.",msgSwitchGctoac:"Switching to ysk-omni… The gateway will restart as a detached process in a few seconds."},system:{title:"System",tabSoftware:"Software",tabSessions:"Grok sessions",sessionsHint:"Local Grok Build sessions on this machine (not gateway chat logs).",sessionsSearch:"Search title, summary, or id…",sessionDelete:"Delete",sessionDeleteConfirm:"Permanently delete Grok session {id}? This cannot be undone.",sessionId:"Session",sessionTitle:"Title",sessionCwd:"cwd",sessionUpdated:"Updated",tabPackage:"Package",tabEnv:"Environment",envHint:"Runtime env & version snapshot.",checkUpdate:"Check for updates",oneClick:"Update package & restart",selfUpdate:"Package version",selfHint:"Compare versions · update package restarts the gateway.",current:"This install",npm:"npm latest",github:"GitHub latest",install:"Install channel",confirmUpdate:"Update the package and restart the gateway? API will be briefly unavailable.",scheduled:"Update scheduled. Refresh this page in ~30s.",database:"Database",grokCli:"Grok CLI (removed)",grokInspect:"Grok leftover",grokInspectHint:"GCTOAC leftover. Grok CLI is not spawned; local engines are llama-server / vLLM.",grokVersion:"Grok version",inspectChannel:"Channel",inspectDefaultModel:"Default model",inspectModels:"Models",inspectSkills:"Skills",inspectMcp:"MCP servers",inspectPlugins:"Plugins",inspectHooks:"Hooks",concurrency:"Concurrency",runtime:"Runtime health",software:"Required software",softwareHint:"Required tools and installed versions.",softName:"Software",softLevel:"Need",softInstalled:"Installed",softVersion:"Version",softStatus:"Status",softDetail:"Note",levelRequired:"Required",levelRecommended:"Recommended",levelOptional:"Optional",levelBundled:"Bundled",softOk:"OK",softMissing:"Missing",softWarn:"Warning",envTitle:"Environment",up:"Up",down:"Down",yes:"Yes",no:"No",badgeUpdate:"Update available",badgeOk:"Up to date",badgeAhead:"Newer than npm",badgeUnknown:"Unknown",statusHintUpdate:"A newer published version is available. Use “Update package & restart”.",statusHintOk:"This install matches the latest known release.",statusHintAhead:"Local version is newer than npm (typical for git / dev). “Update package” still pulls latest git commits if on the git channel.",statusHintUnknown:"Could not reach npm/GitHub to compare versions.",checkResult:"Version check",channelGit:"git (dev tree)",channelNpmGlobal:"npm global",channelNpmLocal:"npm local",channelUnknown:"unknown",encryption:"Encryption",ready:"Ready",notReady:"Not ready",allRequiredOk:"All required software present",requiredMissing:"Some required software is missing"},support:{title:"Support",subtitle:"Creator, sponsors, and YSK Limited — free product, real help",pillSupport:"Support",pillSponsor:"Sponsor · Linktree",pillHelp:"Questions? email@ysk.hk",creatorTitle:"Creator",creatorBody:"This OpenAI-compatible gateway is a free open-source product for running local models as an API. The project is maintained in the open; your feedback and bug reports matter.",sponsorTitle:"Support / sponsor",sponsorBody:"If this gateway saves you time, consider sponsoring development. Every bit helps keep it free for everyone.",githubSponsors:"GitHub Sponsors",linktree:"Linktree",walletsTitle:"Crypto / Web3 addresses",walletsHint:"Send only on the matching network. Double-check the address before you transfer.",net:"Network",addr:"Address",copy:"Copy",netEvm:"EVM (ETH/BSC/AVAX)",netNear:"NEAR",netAda:"ADA (Cardano)",yskTitle:"YSK Limited",yskBody:"Need hands-on help beyond the free Admin panel? YSK Limited can provide:",yskLi1:"Server install, hardening, and day-to-day ops",yskLi2:"Hosting stack (web, email, DNS, databases)",yskLi3:"Migration, automation, and custom integration",yskLi4:"Incident response and go-live checks",yskPrice:"No public price list — email us and we will scope it to your setup.",site:"ysk.hk",helpTitle:"Have a problem?",helpBody:"Email with OS, install / log path, and expected vs actual result. Every message is read.",docs:"Full docs are in the repo README"},common:{empty:"No data",active:"active",revoked:"revoked",save:"Save",cancel:"Close",loading:"Loading…",powered:"Powered by",actions:"Actions",yes:"Yes",no:"No",ok:"OK",confirm:"Confirm",notice:"Notice",confirmTitle:"Please confirm",dangerTitle:"Confirm action",apply:"Apply",reset:"Reset",search:"Search",prev:"Previous",next:"Next",perPage:"Per page",pagerTotal:"Total {n}",pagerPage:"Page {n} / {total}",filterTitle:"Search & filters",filterHint:"Narrow results, then apply",sortHint:"Click to sort (API). Default: newest first",all:"All",requestFailed:"Request failed",featureOff:"Off",ms:"{n} ms",perMin:"{n}/min",minutes:"{n} min",mb:"{n} MB",percent:"{n}%",ipLabel:"IP",uaLabel:"UA",httpStatus:"HTTP"},errors:{unauthorized:"Invalid or missing credentials. Please sign in again.",forbidden:"You do not have permission for this action.",not_found:"The requested resource was not found.",validation_error:"Invalid request. Please check your input.",rate_limit_exceeded:"Rate limit exceeded. Please try again later.",concurrency_limit_exceeded:"Too many concurrent Grok jobs. Please wait and retry.",internal_error:"An internal server error occurred.",grok_error:"Grok CLI returned an error.",grok_timeout:"Grok CLI timed out.",grok_not_available:"Grok CLI is not available on this server.",document_too_large:"The document exceeds the maximum allowed size.",document_type_not_allowed:"This document type is not allowed.",invalid_cwd:"The working directory is not allowed.",service_unavailable:"The service is temporarily unavailable.",queue_full:"The chat queue is full. Please try again later.",queue_draining:"The chat queue is paused or draining.",queue_wait_timeout:"Timed out while waiting in the chat queue.",queue_cancelled:"The chat job was cancelled.",media_not_supported:"This media feature is not available or is disabled.",media_provider_unavailable:"The media provider is not available.",media_generation_failed:"Media generation failed.",media_forbidden:"Media generation is not allowed for this API key. Use an agent-mode key or an admin session.",feature_disabled:"This API feature is disabled.",feature:{imagesApi:"Images API is disabled. Enable it under Admin → API features → Images API.",videoApi:"Video API is disabled. Enable it under Admin → API features → Videos API.",audioApi:"Audio API is disabled. Enable it under Admin → API features → Audio API.",tools:"Tools are disabled. Enable Tools under Admin → API features (required for image generation).",filesOpenAiAlias:"OpenAI Files API alias is disabled. Enable it under Admin → API features → Files API alias."},media:{agent_or_admin_required:"Image generation requires an agent-mode API key or an admin session. Safe-mode keys cannot use image tools.",source_required:"Provide an image file, a media asset, or a document as the source.",source_must_be_image:"The selected source must be an image for edit or video generation.",no_image_in_sandbox:"Grok finished but no image file was found in the sandbox or this run's session images/. This is not an imagesApi or API-key problem.",no_video_in_sandbox:"Grok finished but no video file was found in the sandbox or this run's session.",provider_no_edit:"The current media provider does not support image edits."}}},"zh-Hant":{brand:"YSK Omni",brandSub:"管理面板",loginTitle:"管理員登入",loginLabel:"API 金鑰",loginOtpLabel:"一次性登入碼",loginBtn:"登入",loginCmdHint:"請於終端機取得金鑰：",loginOtpHint:"每次登入請在終端機產生新碼：",loginOtpExpiry:"登入碼 5 分鐘內有效，且只能使用一次。",loginOtpFail:"登入碼無效或已過期",loginLostKey:"舊金鑰無法找回（系統只儲存雜湊），請建立新的管理員金鑰。",loginCopy:"複製",loginCopied:"已複製",needKey:"請輸入 API 金鑰",needOtp:"請輸入終端機產生的一次性登入碼",logout:"登出",shell:{menu:"開啟選單",closeMenu:"關閉選單"},nav:{dashboard:"儀表板",chat:"對話",chats:"對話記錄",keys:"API 金鑰",documents:"文件",media:"媒體庫",catalog:"目錄",audit:"稽核日誌",settings:"安全設定",apiFeatures:"API 能力",usage:"用量與防護",ddos:"DDoS 中心",queue:"佇列",pm2:"PM2",system:"系統狀態",support:"支援"},queue:{title:"對話佇列",subtitle:"暫停、排空、重新入隊，並調整併發。",paused:"已暫停",running:"消費中",drain:"排空模式",mode:"模式",modeOff:"已停用",depth:"佇列深度",queued:"排隊中",leased:"已認領",activeJobs:"執行中",dead:"死信",oldest:"最長等待",concurrency:"每 Key / 全域",worker:"進程內 worker",workerInstance:"Worker 實例",workerInstanceHint:"本進程消費者 ID（租約持有者）。重啟後會變更。",kpiActiveSub:"本進程進行中 {n} 個",consumer:"消費者",admission:"接單",accepting:"接受新單",pause:"暫停消費",resume:"恢復消費",drainBtn:"排空",undrain:"停止排空",savePolicy:"儲存政策",refresh:"重新整理",jobs:"工作列表",tabOverview:"總覽",tabJobs:"工作列表",tabPolicy:"政策",jobsMeta:"共 {n} 筆",cancel:"取消",requeue:"重新入隊",purgeDead:"清理死信與舊工作",purgeTitle:"確認清理工作？",purgeConfirm:"會立即刪除全部死信（DLQ），以及完成已超過 24 小時的成功／失敗／取消工作。",purgeConfirmBtn:"確認刪除",purgeDoneTitle:"清理完成",purgeDoneMsg:"已刪除 {n} 筆工作。",cancelConfirm:"取消此工作？若正在執行，取消為協作式（cooperative）。",empty:"沒有符合篩選的工作",enabled:"啟用佇列",masterOn:"佇列已開",masterOff:"佇列已關",masterHint:"對話佇列總開關，即時生效。",disabledBanner:"佇列已關閉 — 新對話會跳過排隊、即時執行（仍受併發上限約束）。",globalConcurrency:"全域併發",perKeyConcurrency:"每 Key 併發",maxDepth:"全域佇列上限",maxDepthKey:"每 Key 上限",fairness:"公平策略",fifo:"全域 FIFO",wrr:"加權輪詢",playgroundPriority:"Playground 優先級（越小越先）",defaultPriority:"預設優先級",leaseMs:"租約（ms）",maxWaitMs:"最長等待（ms）",filterTitle:"篩選工作",filterHint:"依狀態篩選。會自動重新整理。",filterStatus:"狀態",allStatuses:"全部狀態",filterDead:"死信（DLQ）",filterQueued:"排隊中",filterRunning:"執行中 / 已認領",filterFailed:"失敗",filterSucceeded:"成功",filterCancelled:"已取消",errorCol:"錯誤",priorityBtn:"優先級",priorityPh:"優先級（0–1000，越小越先）",dlqTitle:"死信佇列",dlqHint:"已用盡重試次數 — 可重新入隊或清理。",viewDlq:"查看死信",statusPanel:"運行狀態",statusPanelHint:"消費者、接單與 worker 實例即時狀態；每隔數秒自動重新整理。",policyTitle:"佇列政策",policyHint:"可先選方案再微調數值；儲存後生效。編輯時會暫停自動重新整理。",presetTitle:"政策方案",presetHint:"一鍵套用。Active＝表單目前值 · Saved＝已儲存。",presetRelaxed:"寬鬆",presetBalanced:"均衡",presetStrict:"嚴格",presetCustom:"自訂",presetRelaxedHint:"較高併發、較深佇列 — 適合多 key／Playground 與突發流量。",presetBalancedHint:"預設生產平衡：公平輪詢、中等深度、每 key 同時只跑 1 個。",presetStrictHint:"較低上限 + 全域 FIFO — 流量不可信或主機資源緊張時使用。",presetCustomHint:"數值不符合內建方案。可繼續微調，或於上方選取一個方案。",presetActiveLabel:"目前：{name}",presetFormLabel:"草稿：{name}",presetTagActive:"目前",presetTagDraft:"草稿",presetTagSaved:"已套用",hintGlobalConc:"全域同時執行的工作上限",hintPerKeyConc:"單一 API key 同時執行上限",hintMaxDepth:"佇列總深度滿時拒收新單",hintMaxDepthKey:"該 key 排隊／執行過多時拒收",hintFairness:"WRR 按 key 輪流；FIFO 按全域優先級與時間",hintLease:"Worker 持有工作多久未完成會被回收",hintMaxWait:"客戶端排隊最長等待時間",colJob:"工作 / 請求",colSource:"來源",colStatus:"狀態",colModel:"模型",colPri:"優先",colKey:"API 金鑰",colTry:"嘗試",colTime:"入隊時間",stQueued:"排隊",stLeased:"已認領",stRunning:"執行中",stSucceeded:"成功",stFailed:"失敗",stDead:"死信",stCancelled:"已取消",srcV1:"API",srcPlayground:"Playground",kpiDepthSub:"{q} 排隊 · {l} 認領",kpiQueuedSub:"等待 worker",kpiDeadSub:"重試已盡",kpiOldestSub:"隊頭等待時間",wait:"等待",started:"開始",cancelReq:"已請求取消"},chat:{title:"對話",new:"新對話",send:"傳送",stop:"停止",stopped:"已停止",placeholder:"輸入訊息…（Enter 傳送，Shift+Enter 換行）",keyMode:"API 金鑰",keySelect:"API 金鑰",useSessionKey:"目前登入的 admin 金鑰",useCustomKey:"自訂金鑰",customKey:"金鑰",includeReasoning:"顯示思考",resume:"繼續 session",resumePh:"Grok session UUID",resumeHint:"用 --resume 接續 Grok CLI session",fork:"Fork",memory:"記憶",noPlan:"關 plan",permission:"權限",effort:"推理力度",effortDefault:"預設",effort_none:"無",effort_minimal:"最低",effort_low:"低",effort_medium:"中",effort_high:"高",effort_xhigh:"極高",effort_max:"最大",tokens:"Tokens",cacheTokens:"快取",cost:"費用",reasoning:"思考過程",needKey:"請輸入或選擇 API 金鑰",attach:"上傳",attachLibrary:"從已上傳選擇",attachHint:"可於本頁任意位置拖放檔案、上傳，或從已上傳庫挑選",dropTitle:"放開以附加檔案",dropHint:"放開即上傳 — 格式與「上傳」按鈕相同",formatsLabel:"格式",formatsHint:"txt、md、csv、json、xml、html、pdf、圖片（png/jpg/webp/gif）、程式碼（js/ts/py/go/rs/java/c/cpp/css/yml/sql/sh…）",formatsReject:"不支援的格式：{name}。允許：{formats}",libraryTitle:"已上傳的檔案",librarySubtitle:"選擇目前 API 金鑰名下的檔案（格式與上傳相同）。",librarySearch:"依檔名搜尋…",libraryEmpty:"此金鑰沒有符合的檔案",libraryAdd:"加入所選",librarySelected:"已選 {n} 個",libraryAlready:"已附加",libraryLoadFail:"無法載入檔案列表",uploading:"上傳中…",uploadFail:"上傳失敗",uploadProgress:"正在上傳 {name}",uploadProgressMulti:"正在上傳 {name}（{i}/{n}）",emptyTitle:"開始對話",emptyHint:"輸入訊息或附加檔案。可從右側歷史開啟舊對話繼續。",needContent:"請輸入訊息或至少附加一個檔案",tooManyFiles:"檔案太多（每則訊息最多 10 個）",fileOnlyPrompt:"請查看附加的檔案。",removeFile:"移除",docs:"附件",you:"你",assistant:"助理",streaming:"串流中…",emptyReply:"（無回覆內容）",systemPrompt:"系統提示",systemPlaceholder:"可選：模型系統指示（system 訊息）…",systemHint:"每次傳送會以 system 角色附帶，不會顯示於對話氣泡。",history:"歷史對話",historyEmpty:"尚未有已儲存的對話",historySearch:"搜尋主題…",historyOpen:"顯示歷史",historyClose:"關閉歷史",rename:"重新命名",renamePh:"對話主題",untitled:"未命名對話",deleteConversation:"刪除",deleteConfirm:"確定刪除此對話？此操作無法還原。",saveFail:"無法儲存對話",loadFail:"無法載入對話",historyPrev:"上一頁",historyNext:"下一頁",historyPage:"第 {n} / {total} 頁",msgs:"{n} 則訊息",settings:"設定",settingsHide:"收起設定",compress:"產生語境摘要",compressConfirm:"為之後回合產生對話摘要以節省 token？畫面上的完整對話記錄不會被刪除或改寫，只影響傳送給模型的內容。此操作會呼叫模型一次。",compressing:"正在產生摘要…",compressNeedMore:"至少需要 3 則訊息（或 2 則較長內容）才可產生摘要。請先繼續對話再試。",compressFail:"無法產生摘要",compressNeedSummary:"請先按「產生語境摘要」建立摘要。",compressedBadge:"摘要",compressOk:"摘要已就緒（完整記錄仍保留）。已切換為「摘要 + 最近訊息」模式。",compressBusy:"請等待目前回覆完成",compressResultTitle:"對話摘要",compressView:"查看摘要",summaryMeta:"產生時間：{when} · 依據 {n} 則訊息",ctxPolicyTitle:"模型上下文",ctxRemark:"完整訊息仍顯示於對話區。此設定只控制下一次傳送給模型的內容。",ctxMode:"上下文",ctxModeFull:"完整記錄",ctxModeSummary:"摘要 + 最近",ctxModeRecent:"僅最近",ctxModeFullLabel:"目前送出完整對話記錄",ctxModeSummaryLabel:"目前送出摘要 + 最近 {n} 則",ctxModeRecentLabel:"目前只送出最近 {n} 則",ctxRecentN:"最近則數",ctxLongHint:"對話較長 — 建議改用「摘要 + 最近」或「僅最近」，以減少 token 並避免介面卡頓。",loadOlder:"載入較早的 {n} 則訊息",showMore:"顯示更多",showLess:"收合",copy:"複製",copied:"已複製",copyFail:"複製失敗"},status:{success:"成功",error:"錯誤",timeout:"逾時",pending:"處理中",active:"進行中",finished:"已完成",online:"運行中",stopped:"已停止"},dash:{title:"儀表板",subtitle:"流量、佇列、安全與防護一覽。",last24:"最近 24h 請求",totalChat:"總對話",success:"成功",errors:"錯誤/逾時",docs:"文件",keys:"活躍金鑰",concurrent:"Grok 併發",recent:"最近 API 請求",empty:"暫無資料",emptyModels:"最近 24h 尚無模型用量",updated:"更新於",refresh:"重新整理",viewAll:"查看全部",openDdos:"DDoS 中心",openSettings:"安全設定",openQueue:"開啟佇列",kpi24h:"請求（24h）",kpi24hSub:"{ok} 成功 · {err} 錯誤",kpiSuccessRate:"成功率（24h）",kpiSuccessRateSub:"全部時間 {all}%",kpiErrors:"錯誤（24h）",kpiErrorsSub:"全部時間 {all}",kpiKeys:"API 金鑰",kpiKeysSub:"活躍 / 總數",kpiDocs:"文件",kpiMedia:"媒體資產",kpiMediaSub:"24 小時 {n} 個",kpiDocsSub:"已儲存檔案",kpiConv:"Playground 對話",kpiConvSub:"24h 內更新 {n} 則",kpiSessions:"OTP 工作階段",kpiSessionsSub:"目前有效的管理員登入",kpiConcurrent:"Grok 併發",kpiConcurrentSub:"進行中 / 上限",kpiQueue:"對話佇列",kpiQueueSub:"深度 · 執行 / 上限 · 死信",kpiQueueSubLive:"{run}/{max} 執行 · {dead} 死信{wait}",kpiQueuePaused:"已暫停",kpiQueueDrain:"排空",kpiQueueOff:"已停用",kpiSafe:"全域安全",kpiSafeOn:"開",kpiSafeOff:"關",kpiSafeSub:"{tools} · turns {turns} · {model}",kpiSafeSubEmpty:"無法讀取設定",queuePanel:"對話佇列",queueState:"狀態",queueLive:"運作中",qQueued:"排隊中",qRunning:"執行中",qDead:"死信",qSucceeded:"已成功",qWorker:"Worker",qWorkerActive:"活躍槽",qOldest:"最舊等待",qUnavailable:"無法取得佇列統計",safety:"安全設定",globalSafe:"全域安全模式",safeTools:"工具",safeTurns:"最大 turns",safeTimeout:"逾時",defaultModel:"預設模型",safetyHint:"影響 safe 模式金鑰與強制 safe 的流量。Playground OTP 預設 agent；開啟全域安全後會套用 safe 限制。",protection:"防護狀態",autoBan:"自動封鎖",on:"開",off:"關",ruleAuth:"認證",ruleRate:"429",ruleConn:"並發",ruleVelocity:"速率",bans:"黑名單",blocked:"已攔截",rateHits:"限流次數",liveConn:"即時連線",proxy:"代理 IP",hops:"層數",limits:"金鑰/IP 上限",models24h:"模型用量（24h）",runtime:"運行環境",port:"監聽連接埠",defaultPort:"預設",env:"環境",authMode:"管理登入",authOtp:"OTP 工作階段",encryption:"加密",ready:"就緒",notReady:"未就緒"},chats:{title:"對話記錄",total:"共",decrypt:"點選列項可查看解密後內容。",search:"搜尋",searchPh:"請求 ID、金鑰名稱、模型…",filterTitle:"搜尋與篩選",filterHint:"篩選後點列項查看詳情。",status:"狀態",allStatus:"全部狀態",model:"模型",allModels:"全部模型",apiKey:"API 金鑰",allKeys:"全部金鑰",from:"由",to:"至",mode:"模式",allModes:"全部模式",hasDocs:"有附件",filter:"套用篩選",reset:"重設",request:"請求",prompt:"提示",response:"回覆",time:"時間",attachments:"附件",page:"頁",prev:"上一頁",next:"下一頁",perPage:"每頁",detail:"對話詳情",noAttach:"無附件",openFile:"開啟 / 預覽",close:"關閉",copyPrompt:"複製提示",copyContent:"複製內容",copySystem:"複製 system prompt",copyRawPrompt:"複製原始 prompt",duration:"耗時",stream:"串流",reasoning:"思考過程",content:"輸出內容",raw:"原始儲存回覆",rawPrompt:"原始儲存 prompt",userPrompt:"用戶／對話 prompt",systemPrompt:"System prompt",systemHint:"從已儲存 prompt 中抽出 system 角色內容。",noSystem:"此請求沒有 system prompt。",hasSystem:"有 system",none:"（無）",file:"檔案",img:"圖片",previewFailed:"預覽失敗"},keys:{title:"API 金鑰",new:"新增金鑰",searchPh:"名稱或 key 前綴…",name:"名稱",role:"角色",mode:"模式",rate:"速率 / 分",status:"狀態",created:"建立",edit:"編輯",revoke:"撤銷",confirmRevoke:"確定撤銷此金鑰？",empty:"暫無",usage24:"24h 用量",maxTurns:"最大 turns",timeoutMs:"逾時 (ms)",ipWhitelist:"IP 白名單",ipWhitelistHint:"每行一個 IP 或 CIDR。留空 = 不限制 IP。",ipWhitelistCol:"IP 允許",ipAll:"全部 IP",keyOnce:"請妥善保存（明文只顯示一次）：",roleClient:"用戶 (client)",roleAdmin:"管理員 (admin)",roleClientBadge:"用戶",roleAdminBadge:"管理員",modeSafe:"safe（對外）",modeAgent:"agent（全能力）",modeSafeBadge:"安全",modeAgentBadge:"代理",ipCount:"{n} 個 IP",ipPlaceholder:`127.0.0.1
203.0.113.0/24`},docs:{title:"文件",total:"共",file:"檔名",mime:"類型",size:"大小",time:"時間",storage:"儲存位置",storageDb:"資料庫（加密）",storageFs:"檔案系統（加密）",storageHint:"加密儲存 · 小於 {dbMax} 入 DB，其餘於 {dir} · 上限 {upMax}。",download:"下載",downloadFail:"下載失敗",binaryPreview:"此為二進位檔（例如 PDF），無法在此預覽，請使用「下載」。",delete:"刪除",confirmDel:"確定刪除此文件？",detail:"文件詳情",preview:"預覽",copy:"複製內容",empty:"暫無",searchPh:"檔名或 MIME…",page:"頁",prev:"上一頁",next:"下一頁"},audit:{title:"稽核日誌",searchPh:"動作、資源、IP、金鑰…",time:"時間",action:"動作",resource:"資源",key:"金鑰",meta:"詳情",empty:"暫無日誌",id:"識別碼",actions:{chat_create:"建立對話",document_upload:"上傳文件",document_delete:"刪除文件",document_list:"列出文件",document_read:"讀取文件",document_download:"下載文件",api_key_create:"建立金鑰",api_key_update:"更新金鑰",api_key_delete:"撤銷金鑰",api_key_list:"列出金鑰",settings_update:"更新設定",chat_admin_view:"管理員查看對話",system_update:"系統更新",system_update_check:"檢查更新",ip_ban:"封鎖 IP",ip_unban:"解除 IP 封鎖",ddos_policy_update:"DDoS 策略更新",pm2_start:"PM2 啟動",pm2_stop:"PM2 停止",pm2_restart:"PM2 重啟",pm2_reload:"PM2 重載",pm2_config:"PM2 設定",pm2_switch:"PM2 切換 runner",playground_chat:"對話試玩",playground_upload:"試玩上傳"},resources:{document:"文件",chat:"對話",api_key:"API 金鑰",settings:"設定",system:"系統",pm2:"PM2",playground:"試玩",ip:"IP"},metaStorage:"儲存方式",metaAsKey:"代行金鑰 ID",metaAsKeyName:"代行金鑰名稱"},settings:{title:"安全設定",hint:"全域安全模式，套用至所有金鑰。",globalSafe:"全域安全模式",globalSafeHint:"開＝全部 safe。關＝跟各金鑰自身模式。",masterOn:"安全模式：開",masterOff:"安全模式：關",disabledBanner:"全域安全已關 — 各金鑰用自身 safe／agent 設定。",tools:"工具模式",toolsHint:"none：禁 shell／上網／寫入。readonly：只讀搜尋。",toolsNone:"none",toolsReadonly:"readonly",maxTurns:"最大 turns",maxTurnsHint:"safe 步數。問答 3–6 · API 8–12 · 多步驟 15–40。",timeout:"逾時（ms）",timeoutHint:"safe 時限。一般 60–120s · 長任務 300–600s。",defaultModel:"預設模型",defaultModelHint:"客戶端未指定 model 時使用。",modelSource:"Grok CLI",refreshModels:"重新整理模型",panel:"管理面板",save:"儲存",saved:"已儲存",guideTitle:"建議預設",guideIntro:"套用後可再微調。",guideApply:"套用",guideActive:"已應用",guideApplyConfirm:"套用「{name}」並儲存？會覆寫目前數值。",guideApplied:"已套用",chipGlobalOn:"安全：開",chipGlobalOff:"安全：關",scLocalTitle:"本機試用",scLocalDesc:"本機完整能力。",scLocalDetail:"安全關 · agent 金鑰。",scProdTitle:"對外 API",scProdDesc:"產品端點，最小權限。",scProdDetail:"安全開 · none · turns 8–12 · 60–120s。",scCodeTitle:"程式代理",scCodeDesc:"可信主機改檔／跑指令。",scCodeDetail:"安全關 · agent 金鑰。",scReadTitle:"只讀分析",scReadDesc:"解碼／搜尋，不寫入。",scReadDetail:"安全開 · readonly · turns 8–15 · 120–180s。",scChatTitle:"純問答",scChatDesc:"只回覆文字，不需使用工具。",scChatDetail:"安全開 · none · turns 3–6 · 60s。",scLongTitle:"長任務（safe）",scLongDesc:"多步驟，減少 max turns 失敗。",scLongDetail:"安全開 · none/readonly · turns 20–40 · 300–600s。",dangerTitle:"危險操作",disablePanel:"關閉管理面板",disablePanelConfirm:"關閉面板並登出？重開：ysk-omni admin on",disablePanelDone:"面板已關。重開：ysk-omni admin on",panelOffHint:"此處可關閉。重開請在伺服器執行 ysk-omni admin on。",panelStatus:"狀態",panelOn:"開",panelOff:"關"},apiFeatures:{title:"API 能力",intro:"開關協議與能力 · 約 2 秒生效 · 無需重啟。",tabProtocols:"協議",tabMedia:"媒體",tabCaps:"能力",tabEmu:"模擬",kpiEnabled:"已啟用",kpiEnabledSub:"目前開啟的開關",groupMeta:"已開 {on} / {n}",groupProtocols:"協議表面",groupMedia:"媒體 API（OpenAI 兼容）",groupCaps:"Grok CLI 能力",groupEmu:"模擬與安全",presetOpen:"預設：開放",presetLocked:"預設：鎖定",presetDev:"預設：開發",presetConfirm:"套用能力預設「{name}」？會覆寫全部 API 開關。",flag:{openaiChat:"OpenAI Chat Completions",openaiResponses:"OpenAI Responses",anthropicMessages:"Anthropic Messages",imagesApi:"Images API",filesOpenAiAlias:"Files API 別名",videoApi:"Videos API（異步 job）",audioApi:"Audio API（語音 / STT）",tools:"Tools / function calling",structuredOutput:"結構化輸出 (--json-schema)",vision:"視覺 / 圖片 (--prompt-json)",reasoningEffort:"推理力度",webSearch:"網絡搜尋工具",subagents:"子代理",planMode:"Plan 模式",memory:"跨 session 記憶",sessionResume:"恢復 session",bestOfN:"best-of-n（Grok 1.0+ 已移除）",checkLoop:"自我檢查迴圈（Grok 1.0+ 已移除）",systemOverride:"System prompt 覆寫",rules:"額外 rules",permissionMode:"權限模式",sandbox:"Sandbox profile",usageEstimate:"估算 token usage",assistantsEmulation:"Assistants-lite（本機）",strictSampling:"嚴格採樣（拒絕 temperature…）",forceDisableToolsInSafe:"Safe 模式強制工具限制"},hint:{openaiChat:"POST /v1/chat/completions",openaiResponses:"POST /v1/responses",anthropicMessages:"POST /v1/messages",imagesApi:"POST /v1/images/generations + /edits（要 agent key）",filesOpenAiAlias:"POST/GET /v1/files → documents + media",videoApi:"POST /v1/videos + poll GET /v1/videos/:id",audioApi:"POST /v1/audio/speech + /transcriptions（要 provider）",tools:"映射 tools → Grok --tools",structuredOutput:"response_format / json_schema",vision:"image_url content parts",reasoningEffort:"--reasoning-effort",webSearch:"關閉時加 --disable-web-search",subagents:"關閉時 --no-subagents",planMode:"關閉時 --no-plan",memory:"--experimental-memory",sessionResume:"--resume / --continue",bestOfN:"已棄用 — Grok Build 1.0+ 會拒絕此 flag",checkLoop:"已棄用 — Grok Build 1.0+ 會拒絕此 flag",systemOverride:"--system-prompt-override",rules:"--rules",permissionMode:"--permission-mode",sandbox:"--sandbox",usageEstimate:"usage 用字元/4 估算",assistantsEmulation:"本機 /v1/assistants + /v1/threads",strictSampling:"帶 temperature 等則 400",forceDisableToolsInSafe:"維持 safe 工具政策"}},catalog:{title:"目錄",intro:"從 Hugging Face 搜尋並拉取模型，再以 llama-server 載入本機 GGUF。",tabPacks:"精選包",tabLocal:"本機模型",tabHub:"Hugging Face",kpiLoaded:"已載入",kpiLoadedSub:"佔用 VRAM 的引擎",kpiLoadedNone:"尚未載入",kpiVram:"VRAM",kpiVramSub:"估計 {used} / {budget} MB",kpiLocal:"磁碟",kpiLocalSub:"本機登錄",kpiPacks:"精選",kpiPacksSub:"策展目錄",filterModality:"模態",filterAll:"全部",colName:"模型",colModality:"模態",colRuntime:"執行環境",colQuant:"量化",colVram:"VRAM",colSize:"大小",sizeEst:"估計",colStatus:"狀態",colPath:"路徑",pull:"Pull",pulling:"拉取中…",pullingBanner:"正在下載 {id}",pullAgain:"再拉一次",onDisk:"已下載",load:"Load",unload:"Unload",delete:"刪除",deleteConfirm:"確定從磁碟及本機登錄刪除 {id}？",pullSpec:"指定模型下載",pullSpecPh:"org/repo 或 org/repo:Q4_K_M",pullSpecBtn:"Pull",pullSpecHint:"貼上 Hub 識別碼。此操作會將權重下載至本機登錄。",hubBrowse:"瀏覽 Hub",hubBrowseHint:"搜尋本閘道可執行的模型（llama.cpp、vLLM、diffusion、whisper）。",hubSearchBtn:"搜尋",loaded:"已載入",idle:"待命",emptyPacks:"此篩選沒有精選包",emptyLocal:"本機登錄為空，請從 Hugging Face 拉取模型",emptyLocalHint:"開啟 Hugging Face，搜尋或貼上 org/repo，然後按 Pull。",hubHint:"即時查官方 Hub REST（/api/models），用 Link cursor 翻頁。模型索引沒有 RSS／Atom。",hubSearch:"搜尋 Hub",hubSearchPh:"Qwen、llama、flux、whisper…",hubEmpty:"沒有 Hub 結果",hubMore:"載入更多",downloads:"下載數",unsupported:"無本機 runtime",hubFail:"Hub 搜尋失敗",sync:"同步熱門",syncing:"同步中…",syncOk:"已同步 {n} 個熱門 GGUF",syncAt:"上次同步 {when}",syncHint:"將下載次數最高的 50 個 GGUF 識別碼加入清單。此步驟不會下載檔案，請自行按 Pull 取得權重。",noQuant:"—",pullFail:"拉取失敗",pullNoGguf:"此儲存庫沒有 GGUF 檔，因此未加入本機模型。",loadFail:"載入失敗",unloadFail:"卸載失敗",mod:{text:"文字",image:"圖像",video:"影片",tts:"語音",stt:"轉錄"}},media:{title:"媒體庫",intro:"工作室、資產與影片工作。需 imagesApi／tools（影片另需 videoApi）。",tabStudio:"工作室",tabAssets:"資產",tabJobs:"工作",kpiAssetsSub:"已儲存的媒體檔案",kpiJobsSub:"影片生成工作",kpiStudioSub:"生成、編輯或圖生影片",assets:"資產",jobs:"影片工作",empty:"尚無媒體資產",jobsEmpty:"尚無影片工作",kind:"類型",bytes:"大小",provider:"提供者",providerPh:"提供者名稱…",prompt:"提示詞",created:"建立時間",status:"狀態",preview:"預覽",previewUnsupported:"瀏覽器無法預覽此格式，請下載檔案後開啟。",previewFail:"無法載入預覽",previewTruncated:"預覽已截斷",download:"下載",delete:"刪除",deleteConfirm:"確定要軟刪除此媒體資產？",allKinds:"全部類型",searchPh:"提示詞、檔名、MIME、提供者或 ID…",from:"開始日期",to:"結束日期",generate:"生成圖片",generateTitle:"生成圖片",studioTitle:"媒體工作室",studioHint:"可生成圖片、編輯既有圖片，或建立圖生影片工作。執行限制依循安全設定。需啟用 imagesApi 與 tools（影片另需 videoApi）。",generateHint:"透過 Grok Imagine 工具（image_gen、image_edit、image_to_video）。",generatePrompt:"提示詞",generatePromptPh:"描述你想生成的圖像…",generateSize:"尺寸",aspectRatio:"長寬比",aspectHint:"採用 Grok Imagine 的 aspect_ratio（非 OpenAI 像素尺寸）",generateN:"數量",nHint:"Grok 不支援批量 n；閘道會依序執行 1–4 次",generateKey:"API 金鑰",generateKeySession:"目前登入的管理員工作階段",generateSubmit:"生成",generateBusy:"正在生成，可能需要一分鐘…",generateOk:"已生成圖像，請見下方資產列表。",generateFail:"圖像生成失敗",generateNeedPrompt:"請輸入提示詞",modeGenerate:"生成",modeEdit:"編輯",modeVideo:"影片",modelDefault:"系統預設",modelEmpty:"本機 Grok CLI 未回報模型",modelHint:"列出本機 Grok CLI 全部模型，並預選系統預設",editSubmit:"編輯圖像",editBusy:"正在編輯…",editOk:"已編輯圖像，請見下方資產列表。",editNeedImage:"請選擇或拖放來源圖像後再編輯",editImage:"來源圖像",editImageHint:"image_edit 必須提供來源圖像",editPromptPh:"描述要套用的變更…",videoSubmit:"建立影片工作",videoBusy:"正在將影片工作加入佇列…",videoOk:"影片工作已加入佇列，請見「影片工作」分頁。",videoVoice:"聲線",videoVoiceNone:"不加入對白",videoVoiceHint:"可選 preset voice — 會用 reference_to_video",videoDuration:"時長",videoDurationHint:"Grok image_to_video / reference_to_video：1–15 秒",videoSource:"來源幀（選填）",videoSourceHint:"選填。若未提供，會先依提示詞生成畫面，再進行動畫。",videoNoSource:"自動依提示詞生成畫面",videoPromptPh:"描述鏡頭運動與畫面內容…",sourceTitle:"來源圖像",sourceHint:"可拖放圖像、選擇本機檔案，或從文件庫／媒體資產中挑選任一圖像。",dropzoneAria:"來源圖像拖放區",dropTitle:"將圖像拖放至此",dropHint:"亦可選擇本機檔案，或從系統庫挑選",dropTitleVideo:"拖放來源幀（選填）",dropHintVideo:"影片可選填來源。未指定時，會先依提示詞生成畫面。",pickFile:"選擇檔案",pickLibrary:"系統庫",clearSource:"清除",sourceNeedImage:"請提供圖像檔（PNG、JPEG、WebP、GIF 等）",sourceKindUpload:"上傳",sourceKindAsset:"媒體資產",sourceKindDocument:"文件",libraryTitle:"選擇來源檔案",librarySubtitle:"可選取本閘道「文件」或「媒體資產」中的任一圖像。",libraryTabDocs:"文件",libraryTabAssets:"媒體資產",librarySearch:"依名稱、MIME 或 ID 搜尋…",libraryFormats:"僅圖像（PNG、JPEG、WebP、GIF 等）",libraryEmpty:"沒有符合的檔案",librarySelect:"使用所選",libraryLoadFail:"無法載入檔案庫"},usage:{title:"用量與防濫用",window:"統計區間",requests:"請求數",success:"成功",errors:"錯誤",errorRate:"錯誤率",byModel:"按模型",byKey:"按 API 金鑰",rateLimit:"上限 / 分",util:"估計使用率",lastUsed:"最近使用",limits:"Gateway 限流設定",global:"全域上限 / 視窗",ipMax:"未認證 IP 上限",burst:"對話短窗 burst（10s）",block:"認證失敗封鎖門檻",concurrent:"Grok 最大併發",refresh:"重新整理"},ddos:{title:"DDoS 控制中心",tabPolicy:"政策",tabLive:"流量",tabBlacklist:"黑名單",tabEvents:"事件",live:"即時連線",recent:"最近請求",blacklist:"IP 黑名單",stats:"濫用統計",refresh:"重新整理",pause:"暫停自動刷新",resume:"恢復自動刷新",ban:"封鎖 IP",unban:"解除封鎖",banConfirm:"確定封鎖此 IP？",banWhitelistWarn:"此 IP 在自動封鎖白名單內。仍要手動封鎖？",unbanConfirm:"確定從黑名單移除此 IP？",ip:"IP",method:"方法",path:"路徑",key:"API 金鑰",duration:"耗時",state:"狀態",ua:"瀏覽器識別 (UA)",reason:"原因",source:"來源",expires:"到期",permanent:"永久",addBan:"新增封鎖",ttl:"有效期",ttlPerm:"永久",ttl1h:"1 小時",ttl24h:"24 小時",ttl7d:"7 日",activeConn:"進行中",rateHits:"限流次數",blockedHits:"已封鎖攔截",autoBans:"自動封鎖",topIps:"熱門 IP（最近）",emptyLive:"目前無進行中連線",emptyBan:"黑名單為空",emptyEvents:"尚無自動封鎖事件",reasonPh:"可選原因",banReasonDefault:"管理員手動封鎖",ipPlaceholder:"1.2.3.4",policyTitle:"防護策略",policyHint:"所有門檻即時生效，無需重啟。環境變數僅作為初始預設值。",autoOn:"自動判斷：開",autoOff:"自動判斷：關",autoBanMaster:"啟用自動封鎖 IP",autoBanMasterHint:"關閉後仍會限流，但不會自動加入黑名單。",masterOn:"自動封鎖：開",masterOff:"自動封鎖：關",disabledBanner:"自動封鎖已關閉 — 仍會限流，但 IP 不會被自動加入黑名單。",presetTitle:"防護方案",presetHint:"點選預設方案，或自行改數值；系統會自動判斷是否為自訂。",presetRelaxed:"寬鬆",presetBalanced:"均衡",presetStrict:"嚴格",presetCustom:"自訂",presetActiveLabel:"目前：{name}",presetFormLabel:"表單：{name}（未儲存）",presetTagActive:"使用中",presetTagDraft:"草稿",presetTagSaved:"已儲存",presetActiveHint:"目前方案：{name}。若改動其他欄位請按「儲存策略」。",presetCustomHint:"目前數值不屬於寬鬆／均衡／嚴格，已判定為「自訂」。",presetUnsavedHint:"表單顯示「{form}」，伺服器仍為「{saved}」。請按「儲存策略」先套用。",savePolicy:"儲存策略",resetPolicy:"重設為環境預設",policySaved:"防護策略已儲存，限流器已重新載入。",policyReset:"已重設為環境變數預設值。",confirmReset:"確定將所有 DDoS 策略欄位重設為 .env 預設？",sectionProxy:"反向代理 / CDN",proxyHint:"流量經 nginx 或 Cloudflare 時，請設定信任層數，令封鎖、限流、稽核日誌使用真實用戶 IP，而非代理伺服器 IP。",proxyTrustHops:"信任代理層數",proxyTrustHopsHint:"0 = 直連（忽略 header）。1 = nginx 或 Cloudflare→應用。2 = Cloudflare→nginx→應用。",proxyIpSource:"客戶端 IP 來源",proxyIpSourceHint:"auto 會依序嘗試 CF-Connecting-IP、X-Real-IP、X-Forwarded-For。僅直連時先選「socket」。",proxySrcAuto:"自動（建議）",proxySrcCf:"Cloudflare（CF-Connecting-IP）",proxySrcNginx:"nginx（X-Real-IP）",proxySrcXff:"僅 X-Forwarded-For",proxySrcSocket:"僅 TCP socket（無代理）",trustedProxies:"可信代理 IP / CIDR",trustedProxiesHint:"只有這些 peer 才可設定 CF-Connecting-IP / X-Real-IP / XFF。預設 127.0.0.1（本機 nginx）。遠端代理請加入其 IP。直連客戶無法偽造 header。",sectionLimits:"限流",sectionAuth:"失敗認證",sectionRate:"限流濫用（429）",sectionConn:"連線洪水",sectionVelocity:"請求速率",sectionEscalate:"累犯升級",sectionWhitelist:"自動封鎖白名單",whitelistHint:"每行一個 IP 或 CIDR。白名單 IP 永不被自動封鎖。",rateWindow:"視窗（秒）",rateMaxKey:"金鑰上限",rateMaxIp:"未認證 IP 上限",burstWindow:"Burst 視窗（秒）",burstMax:"Burst 上限",enableRule:"啟用",threshold:"門檻",windowSec:"視窗（秒）",banMin:"封鎖時長（分）",escalateAfter:"累計自動封鎖 N 次後升級",escalateMin:"升級後封鎖（分）",maxConcurrent:"每 IP 最大並發",velocityMax:"最大請求數",eventsTitle:"最近自動封鎖事件",eventTime:"時間",eventSource:"規則",eventDuration:"封鎖時長",sources:{manual:"手動","auto-auth":"自動 · 認證","auto-rate":"自動 · 429","auto-conn":"自動 · 並發","auto-velocity":"自動 · 速率","auto-escalate":"自動 · 升級"}},pm2:{title:"PM2 控制",tabRunner:"運行方式",tabPort:"連接埠",tabConfig:"設定",tabLogs:"日誌",status:"進程狀態",start:"用 PM2 啟動",stop:"停止 PM2",restart:"重啟",reload:"重載",logs:"日誌",logsHint:"優先顯示錯誤日誌",clearLogs:"清除日誌",confirmClearLogs:"確定清除 PM2 與 ysk-omni 日誌檔？此操作無法復原（檔案會被清空）。",logsCleared:"已清除 {n} 個日誌檔。",logsAutoTrim:"超過 {maxMb} MB 會自動裁剪，只保留最後約 {keepKb} KB（每次讀取日誌時檢查）。",refresh:"重新整理",confirmStop:"確定停止 PM2 進程？",confirmRestart:"確定以 PM2 重啟？會妥善移交 port。",unavailable:"PM2 不可用",disabled:"已停用 PM2 管理",app:"應用名稱",pid:"進程 ID",uptime:"運行時間",memory:"記憶體",cpu:"CPU",restarts:"重啟次數",portBusy:"連接埠佔用中",port:"連接埠",portTitle:"監聽連接埠",portHint:"Gateway Admin 與 API 的 HTTP 連接埠。更改後會寫入 .env 並重啟進程，新連接埠才會生效。",fieldPort:"連接埠",portDefaultNote:"預設為 3850。有效範圍：1–65535。",savePort:"儲存連接埠並重啟",useDefaultPort:"使用預設（3850）",portInvalid:"請輸入有效連接埠（1–65535）。",confirmPortChange:"將監聽連接埠改為 {port} 並重啟 Gateway？之後請用新連接埠開啟 Admin（例如 http://localhost:{port}/admin）。",portChangedMsg:"連接埠已更新：{from} → {to}。",portSavedNeedRestart:"連接埠 {port} 已寫入 .env。請重啟後才會生效。",portAfterRestart:"重啟後請開啟 http://localhost:{port}/admin",hint:"可用 PM2 或 ysk-omni 運行，可在此或 CLI 切換。",switchTitle:"運行方式",switchHint:"同一時間只應有一個進程綁定連接埠。",currentRunner:"目前 runner",runnerPm2:"PM2",runnerGctoac:"ysk-omni（獨立進程）",runnerNone:"未運行",runnerUnknown:"未知／混合",switchToPm2:"切換到 PM2",switchToGctoac:"切換到 ysk-omni",confirmSwitchPm2:"確定切換到 PM2？gateway 會在數秒內以 PM2 重啟。",confirmSwitchGctoac:"確定切換到 ysk-omni？gateway 會在數秒內以獨立進程重啟。",switchScheduled:"已排程切換。管理面板將在約 10 秒後自動重新整理。",autoRefreshIn:"本頁將於 {n} 秒後自動重新載入…",autoRefreshNow:"正在重新載入…",omniPid:"ysk-omni 進程 ID",configTitle:"PM2 設定",configHint:"儲存至 pm2.runtime.json，經 ecosystem.config.cjs 套用。若目前用 PM2 運行，「儲存並套用」會重啟 PM2。",saveConfig:"儲存並套用",saveOnly:"只儲存",resetConfig:"還原預設",confirmReset:"確定將 PM2 設定還原為預設？",configSaved:"設定已儲存",fieldName:"應用名稱",fieldScript:"啟動腳本",fieldCwd:"工作目錄 (cwd)",fieldInstances:"實例數",fieldExecMode:"執行模式",fieldAutorestart:"自動重啟",fieldWatch:"檔案監視 (Watch)",fieldMaxMem:"記憶體上限重啟",fieldMaxRestarts:"最大重啟次數",fieldMinUptime:"最短運行時間",fieldRestartDelay:"重啟延遲 (ms)",fieldBackoff:"指數退避延遲 (ms)",fieldMergeLogs:"合併日誌",fieldTime:"日誌時間戳",fieldErrorFile:"錯誤日誌檔",fieldOutFile:"輸出日誌檔",fieldEnvExtra:"額外環境變數（每行 KEY=value）",fieldPreferred:"偏好 runner",empty:"pm2 列表中找不到此應用",modeFork:"fork",modeCluster:"cluster",phCwd:"（套件根目錄）",phInstances:"1 或 max",phEnv:"NODE_ENV=production",statusOnline:"運行中",statusErrored:"錯誤",statusStopped:"已停止",msgOk:"正常",msgDisabled:"PM2 管理已停用（PM2_ADMIN_ENABLED=false）。",msgBinaryMissing:"找不到 pm2，請執行：npm install -g pm2",msgNotInList:"應用「{app}」不在 PM2 列表中 — 請用「用 PM2 啟動」或「切換到 PM2」。",msgPortGctoac:"連接埠 {port} 正由 ysk-omni 佔用（pid {pid}）。請按「切換到 PM2」移交。",msgPortBusy:"連接埠 {port} 被佔用（pid {pids}）。",msgErrored:"PM2 進程出錯 — 請查日誌／設定，然後重啟或處理連接埠衝突。",msgBothRunners:"偵測到兩個 runner；ysk-omni pid {pid} 仍佔用資源。請用「切換」只保留一個。",msgError:"PM2 錯誤：{error}",msgSwitchPm2:"正在切換至 PM2… Gateway 將於數秒內以 PM2 重新啟動。",msgSwitchGctoac:"正在切換至 ysk-omni… Gateway 將於數秒內以獨立進程重新啟動。"},system:{title:"系統狀態",tabSoftware:"軟件",tabSessions:"Grok sessions",sessionsHint:"本機 Grok Build session（並非 gateway 對話紀錄）。",sessionsSearch:"搜尋標題、摘要或 id…",sessionDelete:"刪除",sessionDeleteConfirm:"永久刪除 Grok session {id}？無法復原。",sessionId:"Session",sessionTitle:"標題",sessionCwd:"cwd",sessionUpdated:"更新",tabPackage:"套件",tabEnv:"環境",envHint:"運行環境與版本快照。",checkUpdate:"檢查更新",oneClick:"更新套件並重啟",selfUpdate:"套件版本",selfHint:"對比版本 · 更新套件會重啟 gateway。",current:"本機版本",npm:"npm 最新版",github:"GitHub 最新版",install:"安裝渠道",confirmUpdate:"確定更新套件並重啟 gateway？期間 API 會短暫中斷。",scheduled:"已排程更新，請約 30 秒後重新整理頁面。",database:"資料庫",grokCli:"Grok CLI（已移除）",grokInspect:"Grok 殘留",grokInspectHint:"GCTOAC 殘留。不再 spawn Grok CLI；文字引擎是 llama-server / vLLM。",grokVersion:"Grok 版本",inspectChannel:"頻道",inspectDefaultModel:"預設模型",inspectModels:"模型數",inspectSkills:"Skills",inspectMcp:"MCP",inspectPlugins:"Plugins",inspectHooks:"Hooks",concurrency:"併發",runtime:"運行狀態",software:"系統軟件",softwareHint:"所需軟件與已安裝版本。",softName:"軟件",softLevel:"需求",softInstalled:"已安裝",softVersion:"版本",softStatus:"狀態",softDetail:"說明",levelRequired:"必須",levelRecommended:"建議",levelOptional:"可選",levelBundled:"內建",softOk:"正常",softMissing:"未安裝",softWarn:"注意",envTitle:"環境變數",up:"正常",down:"異常",yes:"是",no:"否",badgeUpdate:"有新版本",badgeOk:"已是最新",badgeAhead:"新於 npm",badgeUnknown:"無法比較",statusHintUpdate:"發佈庫有較新版本，可按「更新套件並重啟」。",statusHintOk:"本機版本與目前已知最新發佈版一致。",statusHintAhead:"本機版本比 npm 新（常見於 git／開發版）。若是 git 安裝，「更新套件」仍可拉取最新 commits。",statusHintUnknown:"無法連上 npm／GitHub，未能比較版本。",checkResult:"版本檢查結果",channelGit:"git（開發目錄）",channelNpmGlobal:"npm 全域",channelNpmLocal:"npm 本地",channelUnknown:"未知",encryption:"加密",ready:"就緒",notReady:"未就緒",allRequiredOk:"必須軟件齊全",requiredMissing:"有必須軟件缺失"},support:{title:"支援",subtitle:"作者、贊助與 YSK Limited — 免費產品，務實支援",pillSupport:"支援",pillSponsor:"支援／贊助 Linktree",pillHelp:"遇到問題？ email@ysk.hk",creatorTitle:"作者",creatorBody:"本閘道為免費開源產品，供希望以本機模型提供 API 的使用者。項目以開源方式維護；你的意見與錯誤回報十分重要。",sponsorTitle:"支援／贊助",sponsorBody:"若本閘道為你節省時間，歡迎贊助開發。每一份支援均有助產品繼續免費供所有人使用。",githubSponsors:"GitHub 贊助",linktree:"Linktree",walletsTitle:"加密貨幣／Web3 地址",walletsHint:"請只在對應網絡轉帳，轉帳前請再次核對地址。",net:"網絡",addr:"地址",copy:"複製",netEvm:"EVM (ETH/BSC/AVAX)",netNear:"NEAR",netAda:"ADA (Cardano)",yskTitle:"YSK Limited",yskBody:"需要超出免費面板的人手協助？YSK Limited 可以提供：",yskLi1:"伺服器安裝、加固與日常維運",yskLi2:"主機架構設計（網站、電郵、DNS、資料庫）",yskLi3:"遷移、自動化與客製整合",yskLi4:"事故處理與上線就緒檢查",yskPrice:"此處不標價 — 請來信，我們會按你的環境商討方案。",site:"ysk.hk",helpTitle:"遇到問題？",helpBody:"請來信說明作業系統、安裝紀錄路徑，以及預期與實際結果。每封來信均會閱讀。",docs:"完整文件見倉庫 README"},common:{empty:"暫無資料",active:"啟用",revoked:"已撤銷",save:"儲存",cancel:"關閉",loading:"載入中…",powered:"技術支援",actions:"操作",yes:"是",no:"否",ok:"確定",confirm:"確定",notice:"提示",confirmTitle:"請確認",dangerTitle:"確認操作",apply:"套用",reset:"重設",search:"搜尋",prev:"上一頁",next:"下一頁",perPage:"每頁",pagerTotal:"共 {n} 筆",pagerPage:"第 {n} / {total} 頁",filterTitle:"搜尋與篩選",filterHint:"設定條件後按「套用」",sortHint:"點擊欄位以 API 排序（預設：最新在前）",featureOff:"已關閉",all:"全部",requestFailed:"請求失敗",ms:"{n} 毫秒",perMin:"{n}/分",minutes:"{n} 分鐘",mb:"{n} MB",percent:"{n}%",ipLabel:"IP",uaLabel:"UA",httpStatus:"HTTP"},errors:{unauthorized:"憑證無效或缺失，請重新登入。",forbidden:"你沒有執行此操作的權限。",not_found:"找不到請求的資源。",validation_error:"請求無效，請檢查輸入內容。",rate_limit_exceeded:"已超過速率限制，請稍後再試。",concurrency_limit_exceeded:"Grok 並行工作過多，請稍候再試。",internal_error:"伺服器發生內部錯誤。",grok_error:"Grok CLI 回傳錯誤。",grok_timeout:"Grok CLI 執行逾時。",grok_not_available:"此伺服器無法使用 Grok CLI。",document_too_large:"文件大小超過允許上限。",document_type_not_allowed:"不允許此文件類型。",invalid_cwd:"不允許使用此工作目錄。",service_unavailable:"服務暫時無法使用。",queue_full:"對話佇列已滿，請稍後再試。",queue_draining:"對話佇列已暫停或正在排空。",queue_wait_timeout:"在對話佇列中等待逾時。",queue_cancelled:"對話工作已取消。",media_not_supported:"此媒體功能不可用或已停用。",media_provider_unavailable:"媒體提供者不可用。",media_generation_failed:"媒體生成失敗。",media_forbidden:"此 API 金鑰不允許生成媒體。請使用 agent 模式金鑰或管理員工作階段。",feature_disabled:"此 API 功能已停用。",feature:{imagesApi:"Images API 已停用。請至「管理 → API 能力 → Images API」啟用。",videoApi:"Video API 已停用。請至「管理 → API 能力 → Videos API」啟用。",audioApi:"Audio API 已停用。請至「管理 → API 能力 → Audio API」啟用。",tools:"Tools 已停用。請至「管理 → API 能力」啟用 Tools（圖像生成需要）。",filesOpenAiAlias:"OpenAI Files API 別名已停用。請至「管理 → API 能力 → Files API 別名」啟用。"},media:{agent_or_admin_required:"圖像生成需要 agent 模式 API 金鑰或管理員工作階段。安全模式金鑰無法使用圖像工具。",source_required:"請提供圖像檔、媒體資產或文件作為來源。",source_must_be_image:"編輯或生成影片時，來源必須為圖像。",no_image_in_sandbox:"Grok 已結束，但沙箱及今次 run 對應的 session images/ 均未找到圖像檔。這不是 imagesApi 或 API 金鑰問題。",no_video_in_sandbox:"Grok 已結束，但沙箱及今次 run 對應的 session 均未找到影片檔。",provider_no_edit:"目前媒體提供者不支援圖像編輯。"}}}};function ws(){const a=localStorage.getItem(Ga);return a==="en"||a==="zh-Hant"?a:(navigator.language||navigator.userLanguage||"en").toLowerCase().startsWith("zh")?"zh-Hant":"en"}let it=ws();function vt(){return it}function Qa(a){a!=="en"&&a!=="zh-Hant"||(it=a,localStorage.setItem(Ga,a))}function e(a){const s=a.split(".");let o=Vt[it]||Vt.en;for(const n of s)if(o&&typeof o=="object"&&n in o)o=o[n];else{o=Vt.en;for(const i of s)if(o&&typeof o=="object"&&i in o)o=o[i];else return a;break}return typeof o=="string"?o:a}function xe(a){return e(a)!==a}function T(a,s={}){let o=e(a);for(const[n,i]of Object.entries(s))o=o.replaceAll(`{${n}}`,String(i));return o}function na(){return`
  <div class="lang-switch" role="group" aria-label="${it==="zh-Hant"?"語言":"Language"}">
    <button type="button" data-lang="en" class="${it==="en"?"is-active":""}">EN</button>
    <button type="button" data-lang="zh-Hant" class="${it==="zh-Hant"?"is-active":""}">中文</button>
  </div>`}const Wa=new Set([".txt",".md",".markdown",".csv",".json",".xml",".html",".htm",".js",".ts",".tsx",".jsx",".py",".java",".go",".rs",".c",".cpp",".h",".hpp",".css",".yml",".yaml",".toml",".ini",".env",".sh",".sql",".log",".pdf",".png",".jpg",".jpeg",".webp",".gif"]),Ps=[...Wa].join(","),$t="/admin/api",Ot="gog_admin_session";let We=null,ze=!1;function fa(a,s){const o=a?.error&&typeof a.error=="object"?a.error:a||{},n=typeof o.code=="string"?o.code:"",i=o.details&&typeof o.details=="object"?o.details:{},d=typeof i.feature=="string"?i.feature:typeof i.flag=="string"?i.flag:"",l=typeof i.reason=="string"?i.reason:"",u=String(o.message||a?.message||s||"");if(d&&(n==="feature_disabled"||n==="media_not_supported"||n==="forbidden")){const c=`errors.feature.${d}`;if(xe(c))return e(c)}if(n==="feature_disabled"&&xe("errors.feature_disabled")){const c=Jt(u);return c&&xe(`errors.feature.${c}`)?e(`errors.feature.${c}`):e("errors.feature_disabled")}if(l&&xe(`errors.media.${l}`))return e(`errors.media.${l}`);if(n==="media_generation_failed"&&l&&xe(`errors.media.${l}`))return e(`errors.media.${l}`);if(n==="media_forbidden"&&xe("errors.media_forbidden"))return e("errors.media_forbidden");const m=Jt(u);if(m&&xe(`errors.feature.${m}`))return e(`errors.feature.${m}`);if(n){const c=`errors.${n}`;if(xe(c))return e(c)}const p=Jt(u);return p&&xe(`errors.feature.${p}`)?e(`errors.feature.${p}`):/agent-mode|agent mode|Safe keys cannot/i.test(u)?e("errors.media.agent_or_admin_required"):/no image file was found/i.test(u)?e("errors.media.no_image_in_sandbox"):/no video file was found/i.test(u)?e("errors.media.no_video_in_sandbox"):/does not support image edits/i.test(u)?e("errors.media.provider_no_edit"):/Provide an image file|sourceAssetId|sourceDocumentId/i.test(u)?e("errors.media.source_required"):/must be an image/i.test(u)?e("errors.media.source_must_be_image"):u||e("common.requestFailed")}function Jt(a){const s=String(a||"");return/videoApi/i.test(s)||/Video API is disabled/i.test(s)?"videoApi":/imagesApi/i.test(s)||/Images API is disabled/i.test(s)?"imagesApi":/audioApi/i.test(s)||/Audio API is disabled/i.test(s)?"audioApi":/filesOpenAiAlias/i.test(s)||/Files API alias/i.test(s)?"filesOpenAiAlias":/Tools are disabled/i.test(s)||/\btools\b/i.test(s)&&/disabled/i.test(s)&&/image/i.test(s)?"tools":""}const r={key:sessionStorage.getItem(Ot)||"",page:"dashboard",me:null,error:"",modal:null,chatFilter:{q:"",status:"",model:"",apiKeyId:"",from:"",to:"",policyMode:"",hasDocuments:"",sortBy:"createdAt",sortDir:"desc",limit:50,offset:0},docFilter:{q:"",apiKeyId:"",storageType:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",limit:20,offset:0},keyFilter:{q:"",role:"",mode:"",isActive:"",sortBy:"createdAt",sortDir:"desc",limit:20,offset:0},auditFilter:{q:"",action:"",apiKeyId:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",limit:50,offset:0},usageFilter:{tab:"model",modelQ:"",keyQ:"",keyActive:"",modelPage:0,keyPage:0,pageSize:10,sortBy:"lastUsedAt",sortDir:"desc",modelSortBy:"requests",modelSortDir:"desc"},ddosFilter:{tab:"policy",liveQ:"",banQ:"",banSource:"",livePage:0,banPage:0,pageSize:15,liveSortBy:"startedAt",liveSortDir:"desc",banSortBy:"createdAt",banSortDir:"desc",eventSortBy:"at",eventSortDir:"desc"},mediaFilter:{tab:"studio",q:"",kind:"",provider:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",jobSortBy:"createdAt",jobSortDir:"desc",limit:20,offset:0},systemTab:"software",grokSessionQ:"",pm2Tab:"runner",apiFeaturesTab:"protocols",catalogTab:"local",catalogModality:"",catalogPulling:"",catalogPull:{id:"",bytes:0,total:0},catalogHubQ:"",catalogHubHits:null,catalogHubNext:"",catalogHubBusy:!1,catalogPopularSyncedAt:"",models:[],keys:[]},Es={login:"login",dashboard:"dashboard",chat:"chat",chats:"chats",keys:"keys",documents:"documents",media:"media",catalog:"catalog",audit:"audit",settings:"settings","api-features":"apiFeatures",apifeatures:"apiFeatures",usage:"usage",ddos:"ddos",queue:"queue",pm2:"pm2",system:"system",support:"support"};function Is(a){return a==="apiFeatures"?"api-features":a||"dashboard"}function ba(a){const s=String(a||"").replace(/^#\/?/,"").split("?")[0].split("/")[0].toLowerCase();return s&&Es[s]||null}function ya(a){const s=`#/${Is(a)}`;location.hash!==s&&history.pushState(null,"",s)}function Ms(){const a=ba(location.hash);return a||(r.key?"dashboard":"login")}async function M(a,s={}){const o={...s.body?{"Content-Type":"application/json"}:{},...r.key?{Authorization:`Bearer ${r.key}`}:{},...s.headers||{}},n=await fetch(`${$t}${a}`,{...s,headers:o}),i=await n.text();let d=null;try{d=i?JSON.parse(i):null}catch{d={error:{message:i}}}if(!n.ok){const l=fa(d,n.statusText),u=d?.error?.code||"";n.status===401?r.page!=="login"&&_t(!1):n.status===403&&!["media_forbidden","feature_disabled","forbidden","media_not_supported"].includes(u)&&r.page!=="login"&&_t(!1);const m=new Error(l);throw m.status=n.status,m.code=u,m.details=d?.error?.details,m}return d}async function qa(a){const s=await a.text();let o=null;try{o=s?JSON.parse(s):null}catch{o={error:{message:s}}}if(!a.ok){const n=fa(o,a.statusText),i=new Error(n);throw i.status=a.status,i.code=o?.error?.code,i.details=o?.error?.details,i}return o}function _t(a=!0){const s=r.key;a&&s&&String(s).startsWith("gog_sess_")&&fetch("/admin/api/auth/logout",{method:"POST",headers:{Authorization:`Bearer ${s}`}}).catch(()=>{}),a&&sessionStorage.removeItem(Ot),r.key="",r.me=null,r.page="login",ya("login"),zt()}function ha(a){va(a,{writeHash:!0})}function va(a,s={}){const o=a||"dashboard";r.page=o,r.modal=null,r.error="",o==="chats"&&(r.chatFilter.offset=0),o==="documents"&&(r.docFilter.offset=0),o==="keys"&&(r.keyFilter.offset=0),o==="audit"&&(r.auditFilter.offset=0),o==="media"&&(r.mediaFilter.offset=0),o!=="ddos"&&We&&(clearInterval(We),We=null),o!=="chat"&&document.body.classList.remove("chat-history-open"),s.writeHash!==!1&&ya(o),zt()}function t(a){return String(a??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}let Te=null,Rt=null;function Ve(a){const s=Rt;Rt=null,Te&&(Te.remove(),Te=null),document.body.classList.remove("ui-dialog-open"),document.removeEventListener("keydown",$a,!0),s&&s(a)}function $a(a){if(Te&&a.key==="Escape"){a.preventDefault(),a.stopPropagation();const s=Te.dataset.cancelable!=="0";Ve(s?Te.dataset.prompt==="1"?null:!1:!0)}}function za(a){Te&&Ve(!1);const s=a.variant||(a.showCancel===!1?"info":"confirm"),o=a.showCancel!==!1,n=!!a.input,i=a.title||e(s==="danger"?"common.dangerTitle":o?"common.confirmTitle":"common.notice"),d=a.confirmText||e(o?"common.confirm":"common.ok"),l=a.cancelText||e("common.cancel"),u=s==="danger"?"!":s==="info"&&!o?"i":"?",m=document.createElement("div");m.className="ui-dialog-back",m.id="ui-dialog-back",m.dataset.cancelable=o||n?"1":"0",m.dataset.prompt=n?"1":"0",m.setAttribute("role","presentation"),m.innerHTML=`
    <div class="ui-dialog ui-dialog--${t(s)}" role="alertdialog" aria-modal="true" aria-labelledby="ui-dialog-title" aria-describedby="ui-dialog-msg">
      <div class="ui-dialog-h">
        <div class="ui-dialog-icon" aria-hidden="true">${u}</div>
        <h3 class="ui-dialog-title" id="ui-dialog-title">${t(i)}</h3>
      </div>
      <div class="ui-dialog-body" id="ui-dialog-msg">${t(a.message||"")}</div>
      ${n?`<div class="ui-dialog-input-wrap">
              <input type="text" class="ui-dialog-input" id="ui-dialog-input" value="${t(a.defaultValue||"")}" placeholder="${t(a.placeholder||"")}" maxlength="${a.maxLength||500}" autocomplete="off" />
            </div>`:""}
      <div class="ui-dialog-actions">
        ${o||n?`<button type="button" class="btn secondary sm" id="ui-dialog-cancel">${t(l)}</button>`:""}
        <button type="button" class="btn ${s==="danger"?"danger":""} sm" id="ui-dialog-ok">${t(d)}</button>
      </div>
    </div>`,document.body.appendChild(m),document.body.classList.add("ui-dialog-open"),Te=m,document.addEventListener("keydown",$a,!0);const p=m.querySelector("#ui-dialog-ok"),c=m.querySelector("#ui-dialog-cancel"),w=m.querySelector("#ui-dialog-input"),y=g=>{if(n){if(!g){Ve(null);return}const v=w instanceof HTMLInputElement?w.value:"";Ve(v);return}Ve(!!g)};return p?.addEventListener("click",g=>{g.preventDefault(),y(!0)}),c?.addEventListener("click",g=>{g.preventDefault(),y(!1)}),m.addEventListener("click",g=>{g.target===m&&(o||n)&&y(!1)}),w instanceof HTMLInputElement&&w.addEventListener("keydown",g=>{g.key==="Enter"&&(g.preventDefault(),y(!0))}),requestAnimationFrame(()=>{w instanceof HTMLInputElement?(w.focus(),w.select()):p?.focus()}),new Promise(g=>{Rt=g})}async function be(a){const s=typeof a=="string"?{message:a,showCancel:!1,variant:"info"}:{title:a.title,message:a.message,showCancel:!1,variant:a.variant||"info",confirmText:a.confirmText||e("common.ok")};await za(s)}async function ee(a){const s=typeof a=="string"?{message:a,showCancel:!0,variant:"confirm"}:{title:a.title,message:a.message,showCancel:!0,variant:a.variant||"confirm",confirmText:a.confirmText,cancelText:a.cancelText};return!!await za(s)}function xs(){const a=typeof window<"u"?window.marked:null;if(!a||a.__gogConfigured)return a;try{typeof a.setOptions=="function"?a.setOptions({gfm:!0,breaks:!0}):a.marked&&typeof a.marked.setOptions=="function"&&a.marked.setOptions({gfm:!0,breaks:!0})}catch{}return a.__gogConfigured=!0,a}function Va(a){if(!a)return"";const s=xs(),o=typeof window<"u"?window.DOMPurify||window.dompurify:null;if(!s)return t(a);let n="";try{if(typeof s.parse=="function")n=s.parse(a,{gfm:!0,breaks:!0});else if(typeof s=="function")n=s(a,{gfm:!0,breaks:!0});else if(s.marked&&typeof s.marked.parse=="function")n=s.marked.parse(a,{gfm:!0,breaks:!0});else return t(a)}catch{return t(a)}if(typeof n!="string"&&(n=String(n??"")),o&&typeof o.sanitize=="function"){n=o.sanitize(n,{USE_PROFILES:{html:!0},ADD_ATTR:["target","rel"]});try{n=n.replace(/<a\s+([^>]*href=)/gi,'<a target="_blank" rel="noopener noreferrer" $1')}catch{}return n}return t(a)}async function Qt(a){const s=String(a??"");if(!s)return!1;try{if(navigator.clipboard&&window.isSecureContext!==!1)return await navigator.clipboard.writeText(s),!0}catch{}try{const o=document.createElement("textarea");o.value=s,o.setAttribute("readonly",""),o.style.position="fixed",o.style.left="-9999px",document.body.appendChild(o),o.select();const n=document.execCommand("copy");return document.body.removeChild(o),n}catch{return!1}}function ae(a){if(!a)return"-";try{return new Date(a).toLocaleString(vt()==="zh-Hant"?"zh-HK":"en-US")}catch{return a}}function Be(a){return a==null?"—":a<1024?`${a} B`:a<1024*1024?`${(a/1024).toFixed(1)} KB`:T("common.mb",{n:(a/1024/1024).toFixed(1)})}function kt(a){return a==null||a===""?"—":T("common.ms",{n:a})}function Ja(a){return a==null||a===""?"—":T("common.perMin",{n:a})}function Q(a){r.error=a;const s=document.querySelector("#flash-error");s&&(s.hidden=!a,s.textContent=a)}function ka(a){const s=a==="success"?"success":a==="error"||a==="timeout"?"error":"pending",o=a==="success"?e("status.success"):a==="error"?e("status.error"):a==="timeout"?e("status.timeout"):a==="pending"?e("status.pending"):a||"-";return`<span class="badge ${s}">${t(o)}</span>`}function qs(a){const o={queued:{cls:"pending",label:e("queue.stQueued")},leased:{cls:"info",label:e("queue.stLeased")},running:{cls:"success",label:e("queue.stRunning")},succeeded:{cls:"success",label:e("queue.stSucceeded")},failed:{cls:"error",label:e("queue.stFailed")},dead:{cls:"error",label:e("queue.stDead")},cancelled:{cls:"muted",label:e("queue.stCancelled")}}[a]||{cls:"pending",label:a||"—"};return`<span class="badge ${o.cls}">${t(o.label)}</span>`}function As(a){const s=a==="playground"?e("queue.srcPlayground"):a==="v1"?e("queue.srcV1"):a||"—";return`<span class="badge muted">${t(s)}</span>`}function Wt(a){const s=a==="agent"?"agent":a==="safe"?"safe":a||"safe",o=s==="agent"?e("keys.modeAgentBadge"):s==="safe"?e("keys.modeSafeBadge"):s;return`<span class="badge ${s==="agent"?"agent":"safe"}">${t(o)}</span>`}function Ts(a){const s=String(a||"").toLowerCase(),o=s==="admin"?e("keys.roleAdminBadge"):s==="client"||s==="user"?e("keys.roleClientBadge"):a||"-";return t(o)}function Pt(a){return String(a||"").toLowerCase().startsWith("image/")}function Sa(a,s=""){const o=String(a||"").toLowerCase().trim(),i=(String(s||"").toLowerCase().match(/\.([a-z0-9]+)$/)||[])[1]||"";return o.startsWith("image/")||["png","jpg","jpeg","gif","webp","svg","bmp","avif","ico"].includes(i)?"image":o.startsWith("video/")||["mp4","webm","ogg","ogv","mov","m4v"].includes(i)?"video":o.startsWith("audio/")||["mp3","wav","ogg","oga","m4a","aac","flac","opus"].includes(i)?"audio":o==="application/pdf"||i==="pdf"?"pdf":o.startsWith("text/")||o==="application/json"||o==="application/xml"||o==="application/javascript"||["txt","md","csv","json","xml","html","htm","css","js","log","svg"].includes(i)?i==="svg"?"image":"text":null}function Bs(a,s=""){return Sa(a,s)!=null}let Lt=null;function Xa(){if(Lt){try{URL.revokeObjectURL(Lt)}catch{}Lt=null}}function Cs(a,s,o){return a==="image"?`<img class="media-lb-media media-lb-img" src="${s}" alt="${t(o)}" />`:a==="video"?`<video class="media-lb-media media-lb-video" src="${s}" controls playsinline preload="metadata"></video>`:a==="audio"?`
      <div class="media-lb-audio-wrap">
        <div class="media-lb-audio-icon" aria-hidden="true">♪</div>
        <audio class="media-lb-media media-lb-audio" src="${s}" controls preload="metadata"></audio>
      </div>`:a==="pdf"?`<iframe class="media-lb-media media-lb-pdf" src="${s}#toolbar=1" title="${t(o)}"></iframe>`:a==="text"?`<div class="media-lb-text-loading muted">${t(e("common.loading")||"…")}</div>`:`<div class="data-empty"><strong>${t(e("media.previewUnsupported"))}</strong></div>`}function Aa(a,s){const o=a.mime||s.type||"",n=a.filename||a.id||"asset",i=Sa(o,n)||"image",d=e("media.preview"),l=[n,o||"—",a.bytes!=null?Be(a.bytes):"",a.kind||""].filter(Boolean),u=t(l.join(" · ")),m=a.prompt?`<div class="media-lb-prompt"><span class="muted">${t(e("media.prompt"))}</span><p>${t(a.prompt)}</p></div>`:"";ct({title:d,subtitle:u,size:"xl",bodyHtml:`
      <div class="media-lightbox" data-preview-kind="${t(i)}">
        <div class="media-lb-stage">
          <div class="media-lb-text-loading muted">${t(e("common.loading")||"…")}</div>
        </div>
        ${m}
      </div>`,footerHtml:`
      <button type="button" class="btn secondary sm" id="media-lb-download">${t(e("media.download"))}</button>
      <button type="button" class="btn sm" id="media-lb-close">${t(e("common.cancel"))}</button>`});const p=document.querySelector("#modal-back .modal");p&&p.classList.add("modal--media-preview");const c=URL.createObjectURL(s);Lt=c;const w=document.querySelector("#modal-back .media-lb-stage");w&&(w.innerHTML=Cs(i,c,n));const y=()=>{document.querySelectorAll("#modal-back video, #modal-back audio").forEach(g=>{try{g.pause()}catch{}}),Xa(),he()};document.getElementById("modal-close")?.addEventListener("click",g=>{g.preventDefault(),y()}),document.getElementById("media-lb-close")?.addEventListener("click",g=>{g.preventDefault(),y()}),document.getElementById("modal-back")?.addEventListener("click",g=>{g.target?.id==="modal-back"&&y()}),document.getElementById("media-lb-download")?.addEventListener("click",()=>{const g=document.createElement("a");g.href=c,g.download=n,g.click()}),i==="text"&&s.text().then(g=>{const v=document.querySelector("#modal-back .media-lb-stage");if(!v)return;const S=4e5,C=g.length>S?g.slice(0,S)+`
… (${e("media.previewTruncated")})`:g;v.innerHTML=`<pre class="media-lb-text">${t(C)}</pre>`}).catch(()=>{const g=document.querySelector("#modal-back .media-lb-stage");g&&(g.innerHTML=`<div class="error-box">${t(e("media.previewFail"))}</div>`)})}function Ya(){return`
  <footer class="site-footer">
    <a class="powered-by" href="https://ysk.hk/" target="_blank" rel="noopener noreferrer">
      <img src="/admin/assets/logo.svg" alt="" width="22" height="22" />
      <span>${t(e("common.powered"))} <strong>YSK Limited</strong></span>
    </a>
  </footer>`}function Ls(){return{dashboard:e("nav.dashboard"),chat:e("nav.chat"),chats:e("nav.chats"),keys:e("nav.keys"),documents:e("nav.documents"),audit:e("nav.audit"),settings:e("nav.settings"),apiFeatures:e("nav.apiFeatures"),media:e("nav.media"),catalog:e("nav.catalog"),usage:e("nav.usage"),ddos:e("nav.ddos"),queue:e("nav.queue"),pm2:e("nav.pm2"),system:e("nav.system"),support:e("nav.support")}[r.page]||e("brand")}function xt(){document.body.classList.remove("nav-open")}function Hs(){document.body.classList.add("nav-open")}function le(a){return`
  <div class="app-shell">
    <header class="mobile-bar">
      <button type="button" class="icon-btn" id="nav-open" aria-label="${t(e("shell.menu"))}">☰</button>
      <div class="mobile-title">${t(Ls())}</div>
      ${na()}
      <button type="button" class="btn ghost sm" id="btn-logout-mobile">${t(e("logout"))}</button>
    </header>
    <div class="layout">
      <button type="button" class="sidebar-backdrop" id="nav-backdrop" aria-label="${t(e("shell.closeMenu"))}"></button>
      <aside class="sidebar" id="sidebar">
        <div class="brand">
          <img class="brand-logo" src="/admin/assets/logo.svg" alt="YSK" width="40" height="40" />
          <div class="brand-text">
            <strong>${t(e("brand"))}</strong>
            <small>${t(e("brandSub"))}</small>
          </div>
        </div>
        ${na()}
        ${re("dashboard",e("nav.dashboard"))}
        ${re("chat",e("nav.chat"))}
        ${re("chats",e("nav.chats"))}
        ${re("keys",e("nav.keys"))}
        ${re("documents",e("nav.documents"))}
        ${re("media",e("nav.media"))}
        ${re("catalog",e("nav.catalog"))}
        ${re("audit",e("nav.audit"))}
        ${re("settings",e("nav.settings"))}
        ${re("apiFeatures",e("nav.apiFeatures"))}
        ${re("usage",e("nav.usage"))}
        ${re("ddos",e("nav.ddos"))}
        ${re("queue",e("nav.queue"))}
        ${re("pm2",e("nav.pm2"))}
        ${re("system",e("nav.system"))}
        ${re("support",e("nav.support"))}
        <div class="sidebar-foot">
          <button class="btn secondary sm logout-btn" id="btn-logout">${t(e("logout"))}</button>
        </div>
      </aside>
      <main class="main">
        <div id="flash-error" class="error-box" ${r.error?"":"hidden"}>${t(r.error)}</div>
        ${a}
      </main>
    </div>
    ${Ya()}
  </div>
  ${r.modal||""}
  `}function re(a,s){return`<button type="button" class="nav-btn ${r.page===a?"active":""}" data-nav="${a}">${t(s)}</button>`}function de(){xt(),document.querySelectorAll("[data-nav]").forEach(s=>{s.onclick=()=>{xt(),ha(s.dataset.nav)}});const a=()=>_t(!0);document.getElementById("btn-logout")?.addEventListener("click",a),document.getElementById("btn-logout-mobile")?.addEventListener("click",a),document.getElementById("nav-open")?.addEventListener("click",Hs),document.getElementById("nav-backdrop")?.addEventListener("click",xt),document.addEventListener("keydown",s=>{s.key==="Escape"&&xt()},{once:!0}),document.querySelectorAll("[data-lang]").forEach(s=>{s.onclick=()=>{Qa(s.dataset.lang),zt().catch(h)}}),wa(document)}function Ds(a){if(!a)return"";const s=(a.getAttribute("data-label")||"").trim();if(s)return s;const o=a.querySelector(".th-sort-btn");return(o?[...o.childNodes].filter(i=>i.nodeType===Node.TEXT_NODE).map(i=>i.textContent||"").join(""):a.textContent||"").replace(/[▲▼]/g,"").replace(/\s+/g," ").trim()}function wa(a){(a||document).querySelectorAll("table.data-table").forEach(o=>{const n=[...o.querySelectorAll("thead th")].map(Ds);o.querySelectorAll("tbody tr").forEach(i=>{i.classList.contains("empty-row")||[...i.children].forEach((d,l)=>{const u=[...d.children],m=d.classList.contains("row-actions")||!!d.querySelector(":scope > .row-actions")||u.length>0&&u.every(p=>p.matches("button, .btn, .row-actions"));if(d.classList.toggle("is-actions",m),d.classList.toggle("is-primary",l===0&&!m),m){d.removeAttribute("data-label");return}n[l]&&d.setAttribute("data-label",n[l])})})})}function h(a){console.error(a),Q(a.message||String(a))}async function Za(){if(!r.key)return!1;const a=await M("/me");return r.me=a.data,!0}async function St(a=!1){try{const s=await M(`/models${a?"?refresh=1":""}`);return r.models=s.data?.models||[],s.data}catch{return r.models=[],{models:[],source:"fallback",defaultModel:""}}}async function Et(){try{const a=await M("/keys?all=1");r.keys=a.data||[]}catch{r.keys=[]}}function ke(a){const s=(Array.isArray(a)?a:[a]).filter(Boolean);return s.length?`<div class="page-meta" role="status">${s.map(n=>`<span>${typeof n=="string"?t(n):n}</span>`).join('<span class="page-meta-sep" aria-hidden="true">·</span>')}</div>`:""}function Oe({title:a,hint:s,meta:o,searchHtml:n,gridHtml:i}){return`
    <div class="panel data-filter-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(a)}</strong>
          ${s?`<span class="muted">${t(s)}</span>`:""}
        </div>
        ${o?`<span class="panel-h-meta muted">${typeof o=="string"?t(o):o}</span>`:""}
      </div>
      <div class="data-filter">
        ${n||""}
        ${i?`<div class="data-filter-grid">${i}</div>`:""}
        <div class="data-filter-actions">
          <button type="button" class="btn secondary sm" data-filter-reset>${t(e("common.reset"))}</button>
          <button type="button" class="btn sm" data-filter-apply>${t(e("common.apply"))}</button>
        </div>
      </div>
    </div>`}function $e({headHtml:a,bodyHtml:s,colSpan:o,emptyText:n,pagerHtml:i}){const d=s||`<tr class="empty-row"><td colspan="${o||6}">
      <div class="data-empty">
        <div class="data-empty-icon">∅</div>
        <strong>${t(n||e("common.empty"))}</strong>
      </div>
    </td></tr>`;return`
    <div class="panel data-table-panel">
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr>${a}</tr></thead>
          <tbody>${d}</tbody>
        </table>
      </div>
      ${i||""}
    </div>`}function Ee(a,s,o="sortBy",n="sortDir"){const i=s?.[o],d=s?.[n];return i&&a.set("sortBy",String(i)),(d==="asc"||d==="desc")&&a.set("sortDir",d),a}function N({field:a,label:s,filterRef:o,sortByKey:n="sortBy",sortDirKey:i="sortDir"}){const d=o?.[n]===a,l=d?o?.[i]||"desc":"",u=d&&l==="asc"?"ascending":d&&l==="desc"?"descending":"none",m=d?l==="asc"?" ▲":" ▼":"";return`<th class="th-sort${d?" is-sorted":""}" data-label="${t(s)}" data-sort-field="${t(a)}" data-sort-by-key="${t(n)}" data-sort-dir-key="${t(i)}" aria-sort="${u}" title="${t(e("common.sortHint")||"Sort")}"><button type="button" class="th-sort-btn">${t(s)}<span class="th-sort-ind" aria-hidden="true">${m}</span></button></th>`}function Ge(a,s){document.querySelectorAll("th.th-sort[data-sort-field]").forEach(o=>{(o.querySelector(".th-sort-btn")||o).addEventListener("click",i=>{i.preventDefault();const d=o.getAttribute("data-sort-field");if(!d||!a)return;const l=o.getAttribute("data-sort-by-key")||"sortBy",u=o.getAttribute("data-sort-dir-key")||"sortDir";a[l]===d?a[u]=a[u]==="asc"?"desc":"asc":(a[l]=d,a[u]="desc"),"offset"in a&&(a.offset=0),"modelPage"in a&&l==="modelSortBy"&&(a.modelPage=0),"keyPage"in a&&l==="sortBy"&&(a.keyPage=0),"livePage"in a&&l==="liveSortBy"&&(a.livePage=0),"banPage"in a&&l==="banSortBy"&&(a.banPage=0),s()})})}function Ce({total:a,limit:s,offset:o,idPrefix:n}){const i=Math.max(1,Math.ceil((a||0)/s)||1),d=Math.floor(o/s)+1,l=o>0,u=o+s<a;return`
    <div class="data-pager" id="${n}-pager">
      <div class="data-pager-meta">
        <span>${t(T("common.pagerTotal",{n:a||0}))}</span>
        <span>${t(T("common.pagerPage",{n:d,total:i}))}</span>
        <label class="muted">${t(e("common.perPage"))}
          <select id="${n}-limit">
            ${[10,20,50,100].map(m=>`<option value="${m}" ${s===m?"selected":""}>${m}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="data-pager-actions">
        <button type="button" class="btn secondary sm" id="${n}-prev" ${l?"":"disabled"}>${t(e("common.prev"))}</button>
        <button type="button" class="btn secondary sm" id="${n}-next" ${u?"":"disabled"}>${t(e("common.next"))}</button>
      </div>
    </div>`}function rt(a,s,o){document.getElementById(`${a}-prev`)?.addEventListener("click",()=>{s.offset=Math.max(0,s.offset-s.limit),o()}),document.getElementById(`${a}-next`)?.addEventListener("click",()=>{s.offset=s.offset+s.limit,o()}),document.getElementById(`${a}-limit`)?.addEventListener("change",n=>{s.limit=Number(n.target.value)||20,s.offset=0,o()})}function he(){document.querySelectorAll("#modal-back video, #modal-back audio").forEach(a=>{try{a.pause()}catch{}}),Xa(),document.getElementById("modal-back")?.remove(),r.modal=null}function ct({title:a,subtitle:s,bodyHtml:o,footerHtml:n,size:i="md"}){he();const d=`
    <div class="modal-back" id="modal-back">
      <div class="modal modal--${t(i)}" role="dialog" aria-modal="true">
        <div class="modal-h">
          <div class="modal-title-block">
            <strong>${t(a||"")}</strong>
            ${s?`<div class="muted">${s}</div>`:""}
          </div>
          <button type="button" class="modal-x" id="modal-close" aria-label="${t(e("common.cancel"))}">×</button>
        </div>
        <div class="modal-b">${o||""}</div>
        ${n?`<div class="modal-f">${n}</div>`:""}
      </div>
    </div>`;document.getElementById("app").insertAdjacentHTML("beforeend",d);const l=()=>he();document.getElementById("modal-close").onclick=l,document.getElementById("modal-back").onclick=m=>{m.target.id==="modal-back"&&l()};const u=m=>{m.key==="Escape"&&(l(),document.removeEventListener("keydown",u))};document.addEventListener("keydown",u)}async function es(){const a="ysk-omni admin otp";document.getElementById("app").innerHTML=`
    <div class="login-wrap">
      <div class="login-stage">
        <div class="login-card">
          <div class="login-brand">
            <img src="/admin/assets/logo.svg" alt="YSK" width="48" height="48" />
            <h1 class="brand-title">${t(e("loginTitle"))}</h1>
          </div>
          ${na()}
          <div id="flash-error" class="error-box" ${r.error?"":"hidden"}>${t(r.error)}</div>
          <label for="login-key">${t(e("loginOtpLabel"))}</label>
          <input id="login-key" type="text" inputmode="text" autocomplete="one-time-code" placeholder="ABCD-EFGH" autofocus spellcheck="false" />
          <button class="btn" id="btn-login">${t(e("loginBtn"))}</button>
        </div>
        <p class="login-cmd-hint">${t(e("loginOtpHint"))}</p>
        <div class="login-cmd">
          <code id="login-cmd-text">${t(a)}</code>
          <button type="button" class="btn-copy" id="btn-copy-cmd">${t(e("loginCopy"))}</button>
        </div>
        <p class="login-cmd-hint">${t(e("loginOtpExpiry"))}</p>
      </div>
      ${Ya()}
    </div>
  `,document.querySelectorAll("[data-lang]").forEach(s=>{s.onclick=()=>{Qa(s.dataset.lang),es().catch(h)}}),document.getElementById("btn-copy-cmd").onclick=async()=>{try{await navigator.clipboard.writeText(a);const s=document.getElementById("btn-copy-cmd");s.textContent=e("loginCopied"),setTimeout(()=>{s.textContent=e("loginCopy")},1500)}catch{}},document.getElementById("btn-login").onclick=async()=>{const s=document.getElementById("login-key").value.trim();if(!s)return Q(e("needOtp"));try{const o=await fetch("/admin/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:s})}),n=await o.json().catch(()=>({}));if(!o.ok)throw new Error(n?.error?.message||n?.message||e("loginOtpFail"));const i=n?.data?.token;if(!i)throw new Error(e("loginOtpFail"));r.key=i,sessionStorage.setItem(Ot,i),await Za(),r.error="",ha("dashboard")}catch(o){r.key="",sessionStorage.removeItem(Ot),Q(o.message||e("loginOtpFail"))}},document.getElementById("login-key").onkeydown=s=>{s.key==="Enter"&&document.getElementById("btn-login").click()}}function Se({label:a,value:s,sub:o,tone:n,href:i,valueId:d,subId:l}){const u=n?` dash-kpi--${n}`:"",m=d?` id="${t(d)}"`:"",p=l?` id="${t(l)}"`:"",c=`
    <div class="label">${t(a)}</div>
    <div class="value"${m}>${s}</div>
    ${o!=null&&o!==""?`<div class="dash-kpi-sub muted"${p}>${o}</div>`:""}`;return i?`<button type="button" class="card dash-kpi${u}" data-nav="${t(i)}">${c}</button>`:`<div class="card dash-kpi${u}">${c}</div>`}function Ke(a,s,o){return a?`<span class="badge success">${t(s)}</span>`:`<span class="badge warn">${t(o)}</span>`}function Pa({id:a,on:s,onLabel:o,offLabel:n,title:i}){return`<button type="button"
    class="master-toggle ${s?"is-on":"is-off"}"
    id="${t(a)}"
    aria-pressed="${s?"true":"false"}"
    title="${t(i||"")}">
    <span class="master-toggle-track" aria-hidden="true"><span class="master-toggle-knob"></span></span>
    <span class="master-toggle-label">${t(s?o:n)}</span>
  </button>`}function Xe(a){const s=document.getElementById(a);return s?s.classList.contains("is-on"):!1}function Ye(a,s,o,n){const i=document.getElementById(a);if(!i)return;i.classList.toggle("is-on",!!s),i.classList.toggle("is-off",!s),i.setAttribute("aria-pressed",s?"true":"false");const d=i.querySelector(".master-toggle-label");d&&o!=null&&n!=null&&(d.textContent=s?o:n)}function Ze(a,s){const o=document.getElementById(a);o&&(o.hidden=!s)}function et(a,s){const o=document.getElementById(a);o&&o.classList.toggle("is-feature-off",!!s)}function Os(a){return{auto:e("ddos.proxySrcAuto"),cloudflare:e("ddos.proxySrcCf"),nginx:e("ddos.proxySrcNginx"),"x-forwarded-for":e("ddos.proxySrcXff"),socket:e("ddos.proxySrcSocket")}[a]||a||"—"}async function ia(){const s=(await M("/stats")).data||{},o=s.totals||{},n=s.protection||{},i=s.runtime||{},d=s.concurrency||{},l=s.queue||null,u=s.safety||null,m=s.models24h||[],p=o.successRate24h??0,c=o.successRate??0,w=s.generatedAt?ae(s.generatedAt):"—";let y="—",g=e("dash.kpiQueueSub"),v="";if(l){l.enabled?l.paused?(y=e("dash.kpiQueuePaused"),v="warn"):l.drainMode?(y=e("dash.kpiQueueDrain"),v="warn"):y=`${l.depth??0}`:(y=e("dash.kpiQueueOff"),v="warn");const A=l.oldestQueuedAgeMs>0?` · wait ${Math.round(l.oldestQueuedAgeMs/1e3)}s`:"";g=T("dash.kpiQueueSubLive",{run:l.running??0,max:l.globalConcurrency??"—",dead:l.dead??0,wait:A}),((l.dead||0)>0||(l.depth||0)>20)&&(v=v||"warn")}const S=!!u?.globalSafeMode,C=u?e(S?"dash.kpiSafeOn":"dash.kpiSafeOff"):"—",L=t(u?T("dash.kpiSafeSub",{tools:u.safeToolsMode||"—",turns:u.safeMaxTurns??"—",model:u.defaultModel||"—"}):e("dash.kpiSafeSubEmpty")),R=(s.recentChats||[]).map(A=>`
    <tr>
      <td><button class="linkish cell-primary" data-chat="${A.id}">${t(A.requestId)}</button>
        <div class="cell-sub">${t(A.apiKey?.name||"")}</div></td>
      <td>${t(A.model)}</td>
      <td>${ka(A.status)}</td>
      <td>${Wt(A.policyMode||"-")}</td>
      <td>${kt(A.durationMs)}</td>
      <td>${ae(A.createdAt)}</td>
    </tr>`).join(""),q=$e({headHtml:`
      <th>${t(e("chats.request"))}</th>
      <th>${t(e("chats.model"))}</th>
      <th>${t(e("chats.status"))}</th>
      <th>${t(e("chats.mode"))}</th>
      <th>${t(e("chats.duration"))}</th>
      <th>${t(e("chats.time"))}</th>`,bodyHtml:R,colSpan:6,emptyText:e("dash.empty")}),j=Math.max(1,...m.map(A=>A.requests||0)),x=m.length?m.map(A=>{const f=Math.round((A.requests||0)/j*100);return`
          <div class="dash-bar-row">
            <div class="dash-bar-label" title="${t(A.model)}">${t(A.model)}</div>
            <div class="dash-bar-track"><span style="width:${f}%"></span></div>
            <div class="dash-bar-n">${A.requests}</div>
          </div>`}).join(""):`<div class="data-empty" style="padding:20px"><strong>${t(e("dash.emptyModels"))}</strong></div>`,P=(A,f)=>`<span class="dash-rule-chip ${A?"is-on":"is-off"}">${t(f)}</span>`,K=l?`
      <div class="dash-stat-grid">
        <div><div class="label">${t(e("dash.qQueued"))}</div><div class="value value-sm">${l.queued??0}</div></div>
        <div><div class="label">${t(e("dash.qRunning"))}</div><div class="value value-sm">${l.running??0}<span class="dash-kpi-den">/${l.globalConcurrency??"—"}</span></div></div>
        <div><div class="label">${t(e("dash.qDead"))}</div><div class="value value-sm">${l.dead??0}</div></div>
        <div><div class="label">${t(e("dash.qSucceeded"))}</div><div class="value value-sm">${l.succeeded??0}</div></div>
      </div>
      <div class="dash-prot-meta muted">
        ${t(e("dash.qWorker"))}: ${t(l.workerId||"—")}
        · ${t(e("dash.qWorkerActive"))}: ${l.workerActive??0}
        ${l.oldestQueuedAgeMs>0?` · ${t(e("dash.qOldest"))}: ${Math.round(l.oldestQueuedAgeMs/1e3)}s`:""}
      </div>`:`<div class="data-empty" style="padding:12px 0"><strong>${t(e("dash.qUnavailable"))}</strong></div>`;document.getElementById("app").innerHTML=le(`
    <div class="dash-hero">
      <div class="dash-hero-text">
        <h2>${t(e("dash.title"))}</h2>
        <p class="muted">${t(e("dash.subtitle"))}</p>
      </div>
      <div class="dash-hero-meta">
        <span class="muted">${t(e("dash.updated"))}: ${t(w)}</span>
        <button type="button" class="btn secondary sm" id="dash-refresh">${t(e("dash.refresh"))}</button>
      </div>
    </div>

    <div class="dash-kpi-grid">
      ${Se({label:e("dash.kpi24h"),value:o.chats24h??0,sub:T("dash.kpi24hSub",{ok:o.success24h??0,err:o.error24h??0}),tone:"primary",href:"chats"})}
      ${Se({label:e("dash.kpiSuccessRate"),value:`${p}%`,sub:T("dash.kpiSuccessRateSub",{all:c}),tone:p>=90?"ok":p>=70?"warn":"danger",href:"usage"})}
      ${Se({label:e("dash.kpiErrors"),value:o.error24h??0,sub:T("dash.kpiErrorsSub",{all:o.errors??0}),tone:(o.error24h||0)>0?"warn":"ok",href:"chats"})}
      ${Se({label:e("dash.kpiQueue"),value:y,sub:g,tone:v,href:"queue"})}
      ${Se({label:e("dash.kpiSafe"),value:C,sub:L,tone:u?S?"ok":"warn":"",href:"settings"})}
      ${Se({label:e("dash.kpiKeys"),value:`${o.activeKeys??0}<span class="dash-kpi-den">/${o.totalKeys??0}</span>`,sub:e("dash.kpiKeysSub"),href:"keys"})}
      ${Se({label:e("dash.kpiDocs"),value:o.documents??0,sub:e("dash.kpiDocsSub"),href:"documents"})}
      ${Se({label:e("dash.kpiMedia")||"Media",value:o.mediaAssets??0,sub:T("dash.kpiMediaSub",{n:o.mediaAssets24h??0}),href:"media"})}
      ${Se({label:e("dash.kpiConv"),value:o.conversations??0,sub:T("dash.kpiConvSub",{n:o.conversations24h??0}),href:"chat"})}
      ${Se({label:e("dash.kpiSessions"),value:o.adminSessions??i.adminSessions??0,sub:e("dash.kpiSessionsSub")})}
      ${Se({label:e("dash.kpiConcurrent"),value:`${d.active??0}<span class="dash-kpi-den">/${d.max??0}</span>`,sub:e("dash.kpiConcurrentSub"),tone:(d.active||0)>=(d.max||1)?"warn":""})}
    </div>

    <div class="dash-layout">
      <div class="dash-main">
        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${t(e("dash.recent"))}</strong>
            <button type="button" class="btn secondary sm" data-nav="chats">${t(e("dash.viewAll"))}</button>
          </div>
          ${q.replace("data-table-panel","data-table-panel dash-embed-table")}
        </div>

        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${t(e("dash.queuePanel"))}</strong>
            <button type="button" class="btn secondary sm" data-nav="queue">${t(e("dash.openQueue"))}</button>
          </div>
          <div class="panel-pad dash-prot">
            <div class="dash-prot-row">
              <span>${t(e("dash.queueState"))}</span>
              ${l?l.enabled?l.paused?`<span class="badge warn">${t(e("dash.kpiQueuePaused"))}</span>`:l.drainMode?`<span class="badge warn">${t(e("dash.kpiQueueDrain"))}</span>`:`<span class="badge success">${t(e("dash.queueLive"))}</span>`:`<span class="badge warn">${t(e("dash.kpiQueueOff"))}</span>`:`<span class="badge warn">${t(e("dash.kpiQueueOff"))}</span>`}
            </div>
            ${K}
          </div>
        </div>
      </div>

      <aside class="dash-side">
        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${t(e("dash.safety"))}</strong>
            <button type="button" class="btn secondary sm" data-nav="settings">${t(e("dash.openSettings"))}</button>
          </div>
          <div class="panel-pad dash-prot">
            <div class="dash-prot-row">
              <span>${t(e("dash.globalSafe"))}</span>
              ${Ke(S,e("dash.on"),e("dash.off"))}
            </div>
            <div class="dash-stat-grid">
              <div><div class="label">${t(e("dash.safeTools"))}</div><div class="value value-sm">${t(u?.safeToolsMode||"—")}</div></div>
              <div><div class="label">${t(e("dash.safeTurns"))}</div><div class="value value-sm">${u?.safeMaxTurns??"—"}</div></div>
              <div><div class="label">${t(e("dash.safeTimeout"))}</div><div class="value value-sm">${u?.safeTimeoutMs!=null?Math.round(u.safeTimeoutMs/1e3)+"s":"—"}</div></div>
              <div><div class="label">${t(e("dash.defaultModel"))}</div><div class="value value-sm" style="font-size:0.95rem!important">${t(u?.defaultModel||"—")}</div></div>
            </div>
            <div class="dash-prot-meta muted">${t(e("dash.safetyHint"))}</div>
          </div>
        </div>

        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${t(e("dash.protection"))}</strong>
            <button type="button" class="btn secondary sm" data-nav="ddos">${t(e("dash.openDdos"))}</button>
          </div>
          <div class="panel-pad dash-prot">
            <div class="dash-prot-row">
              <span>${t(e("dash.autoBan"))}</span>
              ${Ke(!!n.autoBanEnabled,e("dash.on"),e("dash.off"))}
            </div>
            <div class="dash-rule-row">
              ${P(n.autoAuthEnabled,e("dash.ruleAuth"))}
              ${P(n.autoRateEnabled,e("dash.ruleRate"))}
              ${P(n.autoConnEnabled,e("dash.ruleConn"))}
              ${P(n.autoVelocityEnabled,e("dash.ruleVelocity"))}
            </div>
            <div class="dash-stat-grid">
              <div><div class="label">${t(e("dash.bans"))}</div><div class="value value-sm">${n.bans??0}</div></div>
              <div><div class="label">${t(e("dash.blocked"))}</div><div class="value value-sm">${n.blockedHits??0}</div></div>
              <div><div class="label">${t(e("dash.rateHits"))}</div><div class="value value-sm">${n.rateLimitedHits??0}</div></div>
              <div><div class="label">${t(e("dash.liveConn"))}</div><div class="value value-sm">${n.activeConnections??0}</div></div>
            </div>
            <div class="dash-prot-meta muted">
              ${t(e("dash.proxy"))}: ${t(Os(n.proxyIpSource))}
              · ${t(e("dash.hops"))}: ${n.proxyTrustHops??0}
              · ${t(e("dash.limits"))}: ${n.rateLimitMax??"—"}/${n.rateLimitIpMax??"—"}
            </div>
          </div>
        </div>

        <div class="panel dash-panel">
          <div class="panel-h"><strong>${t(e("dash.models24h"))}</strong></div>
          <div class="panel-pad">${x}</div>
        </div>

        <div class="panel dash-panel">
          <div class="panel-h"><strong>${t(e("dash.runtime"))}</strong></div>
          <div class="panel-pad dash-runtime">
            <div class="dash-prot-row">
              <span>${t(e("dash.port"))}</span>
              <strong>${i.port??"—"}<span class="muted" style="font-weight:500"> (${t(e("dash.defaultPort"))} ${i.defaultPort??3850})</span></strong>
            </div>
            <div class="dash-prot-row">
              <span>${t(e("dash.env"))}</span>
              <strong>${t(i.env||"—")}</strong>
            </div>
            <div class="dash-prot-row">
              <span>${t(e("dash.authMode"))}</span>
              <strong>${t(e("dash.authOtp"))}</strong>
            </div>
            <div class="dash-prot-row">
              <span>${t(e("dash.encryption"))}</span>
              ${Ke(!!i.encryptionReady,e("dash.ready"),e("dash.notReady"))}
            </div>
            <div class="dash-quick">
              <button type="button" class="btn secondary sm" data-nav="chat">${t(e("nav.chat"))}</button>
              <button type="button" class="btn secondary sm" data-nav="queue">${t(e("dash.openQueue"))}</button>
              <button type="button" class="btn secondary sm" data-nav="settings">${t(e("nav.settings"))}</button>
              <button type="button" class="btn secondary sm" data-nav="usage">${t(e("nav.usage"))}</button>
              <button type="button" class="btn secondary sm" data-nav="pm2">${t(e("nav.pm2"))}</button>
              <button type="button" class="btn secondary sm" data-nav="system">${t(e("nav.system"))}</button>
              <button type="button" class="btn secondary sm" data-nav="audit">${t(e("nav.audit"))}</button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  `),de(),document.getElementById("dash-refresh")?.addEventListener("click",()=>ia().catch(h)),document.querySelectorAll("[data-nav]").forEach(A=>{A.onclick=()=>{const f=A.dataset.nav;f&&ha(f)}}),document.querySelectorAll("[data-chat]").forEach(A=>{A.onclick=()=>as(A.dataset.chat)})}function _s(a){return a?.length?a.map(s=>`<span class="chip ${Pt(s.mimeType)?"img":""}" title="${t(s.mimeType)}">${t(s.originalName||e("chats.file"))}</span>`).join(" "):'<span class="muted">—</span>'}function ts(a){const s=String(a||"");if(!s.trim())return{system:"",body:"",hasRoles:!1};if(!/^(system|user|assistant|tool): /m.test(s))return{system:"",body:s,hasRoles:!1};const o=/(^|\n)(system|user|assistant|tool): /g,n=[];let i;for(;(i=o.exec(s))!==null;)n.push({role:i[2],contentStart:i.index+i[0].length,index:i.index});if(!n.length)return{system:"",body:s,hasRoles:!1};const d=n.map((m,p)=>{const c=p+1<n.length?n[p+1].index:s.length;return{role:m.role,content:s.slice(m.contentStart,c)}}),l=d.filter(m=>m.role==="system").map(m=>m.content),u=d.filter(m=>m.role!=="system").map(m=>`${m.role}: ${m.content}`);return{system:l.join(`

`).trim(),body:u.length?u.join(`
`):s,hasRoles:!0,blocks:d}}async function ft(){await Promise.all([St(),Et()]);const a=r.chatFilter,s=new URLSearchParams;if(s.set("limit",String(a.limit)),s.set("offset",String(a.offset)),a.status&&s.set("status",a.status),a.model&&s.set("model",a.model),a.apiKeyId&&s.set("apiKeyId",a.apiKeyId),a.q&&s.set("q",a.q),a.from&&s.set("from",new Date(a.from).toISOString()),a.to){const c=new Date(a.to);c.setHours(23,59,59,999),s.set("to",c.toISOString())}a.policyMode&&s.set("policyMode",a.policyMode),a.hasDocuments!==""&&s.set("hasDocuments",a.hasDocuments),Ee(s,a);const o=await M(`/chats?${s}`),n=o.total||0,i=[`<option value="">${t(e("chats.allModels"))}</option>`,...r.models.map(c=>`<option value="${t(c)}" ${a.model===c?"selected":""}>${t(c)}</option>`)].join(""),d=[`<option value="">${t(e("chats.allKeys"))}</option>`,...r.keys.map(c=>`<option value="${c.id}" ${a.apiKeyId===c.id?"selected":""}>${t(c.name)} (${t(c.keyPrefix)})</option>`)].join(""),l=(o.items||[]).map(c=>{const w=ts(c.promptPreview||""),y=!!w.system,g=y?w.body.slice(0,160):c.promptPreview||"";return`
    <tr>
      <td><button class="linkish cell-primary" data-chat="${c.id}">${t(c.requestId)}</button></td>
      <td><div class="cell-primary">${t(c.apiKey?.name||"")}</div><div class="cell-sub">${t(c.apiKey?.keyPrefix||"")}</div></td>
      <td>${t(c.model)}</td>
      <td>${ka(c.status)} ${Wt(c.policyMode||"-")}</td>
      <td>${_s(c.documents)} ${c.documentCount?`<span class="muted">×${c.documentCount}</span>`:""}</td>
      <td class="chats-preview-cell">
        ${y?`<span class="chip sys-chip" title="${t(w.system.slice(0,400))}">${t(e("chats.hasSystem"))}</span>`:""}
        <div class="muted preview-text">${t(g)}</div>
      </td>
      <td class="chats-preview-cell"><div class="muted preview-text">${t(c.contentPreview)}</div></td>
      <td>${ae(c.createdAt)}</td>
      <td class="muted">${c.durationMs!=null?kt(c.durationMs):"—"}</td>
    </tr>`}).join(""),u=Oe({title:e("chats.filterTitle")||e("common.filterTitle"),hint:e("chats.filterHint")||e("common.filterHint"),meta:T("common.pagerTotal",{n}),searchHtml:`
      <div class="data-filter-search">
        <label for="f-q">${t(e("chats.search"))}</label>
        <input type="search" id="f-q" value="${t(a.q)}" placeholder="${t(e("chats.searchPh"))}" />
      </div>`,gridHtml:`
      <label>${t(e("chats.status"))}
        <select id="f-status">
          <option value="">${t(e("chats.allStatus"))}</option>
          ${["success","error","timeout","pending"].map(c=>`<option value="${c}" ${a.status===c?"selected":""}>${t(e(`status.${c}`))}</option>`).join("")}
        </select>
      </label>
      <label>${t(e("chats.model"))}
        <select id="f-model">${i}</select>
      </label>
      <label>${t(e("chats.apiKey"))}
        <select id="f-key">${d}</select>
      </label>
      <label>${t(e("chats.mode"))}
        <select id="f-mode">
          <option value="">${t(e("chats.allModes"))}</option>
          <option value="safe" ${a.policyMode==="safe"?"selected":""}>${t(e("keys.modeSafeBadge"))}</option>
          <option value="agent" ${a.policyMode==="agent"?"selected":""}>${t(e("keys.modeAgentBadge"))}</option>
        </select>
      </label>
      <label>${t(e("chats.from"))}
        <input type="date" id="f-from" value="${t(a.from)}" />
      </label>
      <label>${t(e("chats.to"))}
        <input type="date" id="f-to" value="${t(a.to)}" />
      </label>
      <label class="data-filter-check">
        <input type="checkbox" id="f-docs" ${a.hasDocuments==="true"?"checked":""} />
        <span>${t(e("chats.hasDocs"))}</span>
      </label>`}),m=$e({headHtml:`
      <th>${t(e("chats.request"))}</th>
      <th>${t(e("chats.apiKey"))}</th>
      ${N({field:"model",label:e("chats.model"),filterRef:a})}
      ${N({field:"status",label:e("chats.status"),filterRef:a})}
      <th>${t(e("chats.attachments"))}</th>
      <th>${t(e("chats.prompt"))}</th>
      <th>${t(e("chats.response"))}</th>
      ${N({field:"createdAt",label:e("chats.time"),filterRef:a})}
      ${N({field:"durationMs",label:e("ddos.duration"),filterRef:a})}`,bodyHtml:l,colSpan:9,emptyText:e("common.empty"),pagerHtml:Ce({total:n,limit:a.limit,offset:a.offset,idPrefix:"chats"})});document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("chats.title"))}</h2>
    </div>
    ${ke([e("chats.decrypt")])}
    ${u}
    ${m}
  `),de(),rt("chats",r.chatFilter,()=>ft().catch(h)),Ge(r.chatFilter,()=>ft().catch(h));const p=()=>{r.chatFilter.q=document.getElementById("f-q").value.trim(),r.chatFilter.status=document.getElementById("f-status").value,r.chatFilter.model=document.getElementById("f-model").value,r.chatFilter.apiKeyId=document.getElementById("f-key").value,r.chatFilter.policyMode=document.getElementById("f-mode").value,r.chatFilter.from=document.getElementById("f-from").value,r.chatFilter.to=document.getElementById("f-to").value,r.chatFilter.hasDocuments=document.getElementById("f-docs").checked?"true":"",r.chatFilter.offset=0,ft().catch(h)};document.querySelector("[data-filter-apply]").onclick=p,document.getElementById("f-q").onkeydown=c=>{c.key==="Enter"&&p()},document.querySelector("[data-filter-reset]").onclick=()=>{r.chatFilter={q:"",status:"",model:"",apiKeyId:"",from:"",to:"",policyMode:"",hasDocuments:"",sortBy:"createdAt",sortDir:"desc",limit:50,offset:0},ft().catch(h)},document.querySelectorAll("[data-chat]").forEach(c=>{c.onclick=()=>as(c.dataset.chat)})}async function as(a){const{data:s}=await M(`/chats/${a}`),o=s.response||{},n=s.documents||[];let i=`<p class="muted">${t(e("chats.noAttach"))}</p>`;if(n.length){const m=[];for(const p of n){let c="";if(Pt(p.mimeType))try{const w=await M(`/documents/${p.id}`),y=await ns(w.data||{id:p.id,isImage:!0,mimeType:p.mimeType});y?.src&&(c=`<img class="preview" src="${y.src}" alt="${t(p.originalName)}" />`)}catch{c=`<span class="muted">${t(e("chats.previewFailed"))}</span>`}m.push(`
        <div class="attach-item">
          <div style="flex:1;min-width:0">
            <strong>${t(p.originalName)}</strong>
            <div class="muted">${t(p.mimeType)} · ${Be(p.sizeBytes)}</div>
            ${c}
          </div>
          <button class="btn secondary sm" data-open-doc="${p.id}">${t(e("chats.openFile"))}</button>
        </div>`)}i=`<div class="attach-list">${m.join("")}</div>`}const d=ts(s.prompt||""),l=d.system?`<div class="block block-system">
        <div class="block-head">
          <h4>${t(e("chats.systemPrompt"))}</h4>
          <button class="btn secondary sm" data-copy="system">${t(e("chats.copySystem"))}</button>
        </div>
        <p class="hint">${t(e("chats.systemHint"))}</p>
        <div class="pre pre-system">${t(d.system)}</div>
      </div>`:`<div class="block block-system muted-block">
        <h4>${t(e("chats.systemPrompt"))}</h4>
        <p class="muted">${t(e("chats.noSystem"))}</p>
      </div>`,u=`
    <div class="grid modal-meta-grid">
      <div class="card"><div class="label">${t(e("chats.model"))}</div><div class="value value-sm">${t(s.model)}</div></div>
      <div class="card"><div class="label">${t(e("chats.duration"))}</div><div class="value value-sm">${kt(s.durationMs)}</div></div>
      <div class="card"><div class="label">${t(e("chats.apiKey"))}</div><div class="value value-sm">${t(s.apiKey?.name||"")}</div></div>
      <div class="card"><div class="label">${t(e("chats.stream"))}</div><div class="value value-sm">${s.stream?e("common.yes"):e("common.no")}</div></div>
    </div>
    ${s.errorMessage?`<div class="error-box">${t(s.errorMessage)}</div>`:""}
    ${l}
    <div class="block">
      <h4>${t(e("chats.attachments"))}</h4>
      ${i}
    </div>
    <div class="block">
      <div class="block-head">
        <h4>${t(e("chats.userPrompt"))}</h4>
        <button class="btn secondary sm" data-copy="prompt">${t(e("chats.copyPrompt"))}</button>
      </div>
      <div class="pre">${t(d.body||s.prompt||e("chats.none"))}</div>
    </div>
    <div class="block">
      <h4>${t(e("chats.reasoning"))}</h4>
      <div class="pre">${t(o.reasoning_content||e("chats.none"))}</div>
    </div>
    <div class="block">
      <div class="block-head">
        <h4>${t(e("chats.content"))}</h4>
        <button class="btn secondary sm" data-copy="content">${t(e("chats.copyContent"))}</button>
      </div>
      <div class="pre">${t(o.content||e("chats.none"))}</div>
    </div>
    <div class="block">
      <div class="block-head">
        <h4>${t(e("chats.rawPrompt"))}</h4>
        <button class="btn secondary sm" data-copy="raw-prompt">${t(e("chats.copyRawPrompt"))}</button>
      </div>
      <div class="pre">${t(s.prompt||e("chats.none"))}</div>
    </div>
    <div class="block">
      <h4>${t(e("chats.raw"))}</h4>
      <div class="pre">${t(o.raw||"")}</div>
    </div>
    <div class="modal-meta-foot muted">${t(e("common.ipLabel"))}: ${t(s.ip||"—")} · ${t(e("common.uaLabel"))}: ${t(s.userAgent||"—")} · ${ae(s.createdAt)}</div>`;ct({title:e("chats.detail"),subtitle:`${t(s.requestId)} · ${ka(s.status)} ${Wt(s.policyMode||"-")}`,bodyHtml:u,size:"xl",footerHtml:`<button type="button" class="btn secondary sm" id="modal-ok">${t(e("chats.close"))}</button>`}),document.getElementById("modal-ok")?.addEventListener("click",()=>he()),document.querySelector('[data-copy="system"]')?.addEventListener("click",()=>{navigator.clipboard.writeText(d.system||"")}),document.querySelector('[data-copy="prompt"]')?.addEventListener("click",()=>{navigator.clipboard.writeText(d.body||s.prompt||"")}),document.querySelector('[data-copy="raw-prompt"]')?.addEventListener("click",()=>{navigator.clipboard.writeText(s.prompt||"")}),document.querySelector('[data-copy="content"]')?.addEventListener("click",()=>{navigator.clipboard.writeText(o.content||"")}),document.querySelectorAll("[data-open-doc]").forEach(m=>{m.onclick=()=>is(m.dataset.openDoc)})}async function Fe(){const a=r.keyFilter;let s={};try{const p=await M("/usage");for(const c of p.data?.perKey||[])s[c.apiKeyId]=c}catch{}const o=new URLSearchParams;o.set("limit",String(a.limit)),o.set("offset",String(a.offset)),a.q&&o.set("q",a.q),a.role&&o.set("role",a.role),a.mode&&o.set("mode",a.mode),a.isActive!==""&&o.set("isActive",a.isActive),Ee(o,a);const n=await M(`/keys?${o}`),i=n.data||[],d=n.total??i.length,l=i.map(p=>{const c=s[p.id],w=c?.requests??"—",y=c?Math.round((c.utilization||0)*100):0,g=p.ipWhitelist||[],v=g.length?T("keys.ipCount",{n:g.length}):e("keys.ipAll");return`
    <tr>
      <td><div class="cell-primary">${t(p.name)}</div><div class="cell-sub">${t(p.keyPrefix)}…</div></td>
      <td>${Ts(p.role)}</td>
      <td>${Wt(p.mode)}</td>
      <td>${Ja(p.rateLimit)}</td>
      <td title="${t(g.join(", "))}">${t(v)}</td>
      <td>
        <div>${w} <span class="muted">(${t(e("keys.usage24"))})</span></div>
        <div class="usage-bar ${y>80?"warn":""}"><span style="width:${y}%"></span></div>
      </td>
      <td>${p.isActive?`<span class="badge success">${t(e("common.active"))}</span>`:`<span class="badge error">${t(e("common.revoked"))}</span>`}</td>
      <td>${ae(p.createdAt)}</td>
      <td><div class="row-actions">
        <button class="btn secondary sm" data-edit="${p.id}">${t(e("keys.edit"))}</button>
        ${p.isActive?`<button class="btn danger sm" data-revoke="${p.id}">${t(e("keys.revoke"))}</button>`:""}
      </div></td>
    </tr>`}).join(""),u=Oe({title:e("common.filterTitle"),hint:e("common.filterHint"),meta:T("common.pagerTotal",{n:d}),searchHtml:`
      <div class="data-filter-search">
        <label for="kf-q">${t(e("common.search"))}</label>
        <input type="search" id="kf-q" value="${t(a.q)}" placeholder="${t(e("keys.searchPh"))}" />
      </div>`,gridHtml:`
      <label>${t(e("keys.role"))}
        <select id="kf-role">
          <option value="">${t(e("common.all"))}</option>
          <option value="client" ${a.role==="client"?"selected":""}>${t(e("keys.roleClient"))}</option>
          <option value="admin" ${a.role==="admin"?"selected":""}>${t(e("keys.roleAdmin"))}</option>
        </select>
      </label>
      <label>${t(e("keys.mode"))}
        <select id="kf-mode">
          <option value="">${t(e("common.all"))}</option>
          <option value="safe" ${a.mode==="safe"?"selected":""}>${t(e("keys.modeSafeBadge"))}</option>
          <option value="agent" ${a.mode==="agent"?"selected":""}>${t(e("keys.modeAgentBadge"))}</option>
        </select>
      </label>
      <label>${t(e("keys.status"))}
        <select id="kf-active">
          <option value="">${t(e("common.all"))}</option>
          <option value="true" ${a.isActive==="true"?"selected":""}>${t(e("common.active"))}</option>
          <option value="false" ${a.isActive==="false"?"selected":""}>${t(e("common.revoked"))}</option>
        </select>
      </label>`}),m=$e({headHtml:`
      ${N({field:"name",label:e("keys.name"),filterRef:a})}
      ${N({field:"role",label:e("keys.role"),filterRef:a})}
      ${N({field:"mode",label:e("keys.mode"),filterRef:a})}
      ${N({field:"rateLimit",label:e("keys.rate"),filterRef:a})}
      <th>${t(e("keys.ipWhitelistCol"))}</th>
      <th>${t(e("keys.usage24"))}</th>
      ${N({field:"isActive",label:e("keys.status"),filterRef:a})}
      ${N({field:"createdAt",label:e("keys.created"),filterRef:a})}
      <th>${t(e("common.actions"))}</th>`,bodyHtml:l,colSpan:9,emptyText:e("keys.empty"),pagerHtml:Ce({total:d,limit:a.limit,offset:a.offset,idPrefix:"keys"})});document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("keys.title"))}</h2>
      <div class="toolbar">
        <button class="btn" id="btn-new-key">${t(e("keys.new"))}</button>
      </div>
    </div>
    ${u}
    ${m}
  `),de(),rt("keys",r.keyFilter,()=>Fe().catch(h)),Ge(r.keyFilter,()=>Fe().catch(h)),document.querySelector("[data-filter-apply]").onclick=()=>{r.keyFilter.q=document.getElementById("kf-q").value.trim(),r.keyFilter.role=document.getElementById("kf-role").value,r.keyFilter.mode=document.getElementById("kf-mode").value,r.keyFilter.isActive=document.getElementById("kf-active").value,r.keyFilter.offset=0,Fe().catch(h)},document.querySelector("[data-filter-reset]").onclick=()=>{r.keyFilter={q:"",role:"",mode:"",isActive:"",sortBy:"createdAt",sortDir:"desc",limit:20,offset:0},Fe().catch(h)},document.getElementById("btn-new-key").onclick=()=>Ta(),document.querySelectorAll("[data-edit]").forEach(p=>{const c=i.find(w=>w.id===p.dataset.edit);p.onclick=()=>Ta(c)}),document.querySelectorAll("[data-revoke]").forEach(p=>{p.onclick=async()=>{await ee({message:e("keys.confirmRevoke"),variant:"danger",confirmText:e("keys.revoke")})&&(await M(`/keys/${p.dataset.revoke}`,{method:"DELETE"}),Fe().catch(h))}})}function Ta(a){const s=!!a,o=(a?.ipWhitelist||[]).join(`
`);ct({title:e(s?"keys.edit":"keys.new"),subtitle:s?`${t(a?.name||"")} · ${t(a?.keyPrefix||"")}…`:"",size:"md",bodyHtml:`
      <div class="form-grid">
        <label class="full">${t(e("keys.name"))}<input id="k-name" value="${t(a?.name||"")}" /></label>
        <label>${t(e("keys.role"))}
          <select id="k-role">
            <option value="client">${t(e("keys.roleClient"))}</option>
            <option value="admin">${t(e("keys.roleAdmin"))}</option>
          </select>
        </label>
        <label>${t(e("keys.mode"))}
          <select id="k-mode">
            <option value="safe">${t(e("keys.modeSafe"))}</option>
            <option value="agent">${t(e("keys.modeAgent"))}</option>
          </select>
        </label>
        <label>${t(e("keys.rate"))}<input id="k-rate" type="number" value="${a?.rateLimit??60}" /></label>
        <label>${t(e("keys.maxTurns"))}<input id="k-turns" type="number" value="${a?.maxTurns??""}" /></label>
        <label>${t(e("keys.timeoutMs"))}<input id="k-timeout" type="number" value="${a?.timeoutMs??""}" /></label>
        <label class="full">${t(e("keys.ipWhitelist"))}
          <textarea id="k-ip" rows="4" placeholder="${t(e("keys.ipPlaceholder"))}">${t(o)}</textarea>
          <span class="field-hint">${t(e("keys.ipWhitelistHint"))}</span>
        </label>
        ${s?`<label class="full">${t(e("keys.status"))}
          <select id="k-active"><option value="true">${t(e("common.active"))}</option><option value="false">${t(e("common.revoked"))}</option></select>
        </label>`:""}
      </div>
      <pre id="k-created" class="pre key-once-box" hidden></pre>`,footerHtml:`
      <button type="button" class="btn secondary sm" id="k-cancel">${t(e("common.cancel"))}</button>
      <button type="button" class="btn sm" id="k-save">${t(e("common.save"))}</button>`}),document.getElementById("k-role").value=a?.role||"client",document.getElementById("k-mode").value=a?.mode||"safe",s&&(document.getElementById("k-active").value=String(a.isActive)),document.getElementById("k-cancel").onclick=()=>he(),document.getElementById("k-save").onclick=async()=>{const n=document.getElementById("k-ip").value.split(/[\n,]+/).map(d=>d.trim()).filter(Boolean),i={name:document.getElementById("k-name").value.trim(),role:document.getElementById("k-role").value,mode:document.getElementById("k-mode").value,rateLimit:Number(document.getElementById("k-rate").value||60),maxTurns:document.getElementById("k-turns").value?Number(document.getElementById("k-turns").value):null,timeoutMs:document.getElementById("k-timeout").value?Number(document.getElementById("k-timeout").value):null,ipWhitelist:n};try{if(s)i.isActive=document.getElementById("k-active").value==="true",await M(`/keys/${a.id}`,{method:"PATCH",body:JSON.stringify(i)}),he(),Fe().catch(h);else{const d=await M("/keys",{method:"POST",body:JSON.stringify(i)}),l=document.getElementById("k-created");l&&(l.hidden=!1,l.textContent=`${e("keys.keyOnce")}
${d.data?.key||JSON.stringify(d.data)}`);const u=document.getElementById("k-save");u&&(u.textContent=e("chats.close"),u.onclick=()=>{he(),Fe().catch(h)})}}catch(d){h(d)}}}function ss(a){return e(a==="filesystem"?"docs.storageFs":"docs.storageDb")}async function os(a,s){try{const o=await fetch(`${$t}/documents/${a}/download`,{headers:r.key?{Authorization:`Bearer ${r.key}`}:{}});if(!o.ok){const l=await o.text();let u=l;try{u=JSON.parse(l).error?.message||l}catch{}throw new Error(u||e("docs.downloadFail"))}const n=await o.blob(),i=URL.createObjectURL(n),d=document.createElement("a");d.href=i,d.download=s||"download",document.body.appendChild(d),d.click(),d.remove(),URL.revokeObjectURL(i)}catch(o){Q(o.message||e("docs.downloadFail"))}}async function st(){await Et();const a=r.docFilter,s=new URLSearchParams({limit:String(a.limit),offset:String(a.offset)});if(a.q&&s.set("q",a.q),a.apiKeyId&&s.set("apiKeyId",a.apiKeyId),a.storageType&&s.set("storageType",a.storageType),a.from&&s.set("from",new Date(a.from).toISOString()),a.to){const c=new Date(a.to);c.setHours(23,59,59,999),s.set("to",c.toISOString())}Ee(s,a);const o=await M(`/documents?${s}`),n=o.total??0,i=o.meta||{},d=T("docs.storageHint",{dir:i.storageDir||"—",dbMax:Be(i.documentDbMaxBytes),upMax:Be(i.uploadMaxBytes)}),l=[`<option value="">${t(e("common.all"))}</option>`,...r.keys.map(c=>`<option value="${c.id}" ${a.apiKeyId===c.id?"selected":""}>${t(c.name)}</option>`)].join(""),u=(o.data||[]).map(c=>`
    <tr>
      <td><button class="linkish cell-primary" data-doc="${c.id}">${t(c.originalName)}</button>
        ${Pt(c.mimeType)?`<span class="chip img">${t(e("chats.img"))}</span>`:""}</td>
      <td>${t(c.apiKey?.name||"")}</td>
      <td>${t(c.mimeType)}</td>
      <td>${Be(c.sizeBytes)}</td>
      <td>
        <span title="${t(c.storagePath||"")}">${t(ss(c.storageType))}</span>
        ${c.storagePath?`<div class="cell-sub">${t(c.storagePath)}</div>`:""}
      </td>
      <td>${ae(c.createdAt)}</td>
      <td><div class="row-actions">
        <button class="btn secondary sm" data-dl="${c.id}" data-name="${t(c.originalName)}">${t(e("docs.download"))}</button>
        <button class="btn danger sm" data-del="${c.id}">${t(e("docs.delete"))}</button>
      </div></td>
    </tr>`).join(""),m=Oe({title:e("common.filterTitle"),hint:e("common.filterHint"),meta:T("common.pagerTotal",{n}),searchHtml:`
      <div class="data-filter-search">
        <label for="df-q">${t(e("common.search"))}</label>
        <input type="search" id="df-q" value="${t(a.q)}" placeholder="${t(e("docs.searchPh"))}" />
      </div>`,gridHtml:`
      <label>${t(e("chats.apiKey"))}
        <select id="df-key">${l}</select>
      </label>
      <label>${t(e("docs.storage"))}
        <select id="df-storage">
          <option value="">${t(e("common.all"))}</option>
          <option value="db" ${a.storageType==="db"?"selected":""}>${t(e("docs.storageDb"))}</option>
          <option value="filesystem" ${a.storageType==="filesystem"?"selected":""}>${t(e("docs.storageFs"))}</option>
        </select>
      </label>
      <label>${t(e("chats.from"))}<input type="date" id="df-from" value="${t(a.from)}" /></label>
      <label>${t(e("chats.to"))}<input type="date" id="df-to" value="${t(a.to)}" /></label>`}),p=$e({headHtml:`
      ${N({field:"originalName",label:e("docs.file"),filterRef:a})}
      <th>${t(e("chats.apiKey"))}</th>
      ${N({field:"mimeType",label:e("docs.mime"),filterRef:a})}
      ${N({field:"sizeBytes",label:e("docs.size"),filterRef:a})}
      ${N({field:"storageType",label:e("docs.storage"),filterRef:a})}
      ${N({field:"createdAt",label:e("docs.time"),filterRef:a})}
      <th>${t(e("common.actions"))}</th>`,bodyHtml:u,colSpan:7,emptyText:e("docs.empty"),pagerHtml:Ce({total:n,limit:a.limit,offset:a.offset,idPrefix:"docs"})});document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("docs.title"))}</h2>
    </div>
    ${ke([d])}
    ${m}
    ${p}
  `),de(),rt("docs",r.docFilter,()=>st().catch(h)),Ge(r.docFilter,()=>st().catch(h)),document.querySelector("[data-filter-apply]").onclick=()=>{r.docFilter.q=document.getElementById("df-q").value.trim(),r.docFilter.apiKeyId=document.getElementById("df-key").value,r.docFilter.storageType=document.getElementById("df-storage").value,r.docFilter.from=document.getElementById("df-from").value,r.docFilter.to=document.getElementById("df-to").value,r.docFilter.offset=0,st().catch(h)},document.querySelector("[data-filter-reset]").onclick=()=>{r.docFilter={q:"",apiKeyId:"",storageType:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",limit:20,offset:0},st().catch(h)},document.querySelectorAll("[data-doc]").forEach(c=>{c.onclick=()=>is(c.dataset.doc)}),document.querySelectorAll("[data-dl]").forEach(c=>{c.onclick=()=>os(c.getAttribute("data-dl"),c.getAttribute("data-name")||"file")}),document.querySelectorAll("[data-del]").forEach(c=>{c.onclick=async()=>{await ee({message:e("docs.confirmDel"),variant:"danger",confirmText:e("docs.delete")})&&(await M(`/documents/${c.dataset.del}`,{method:"DELETE"}),st().catch(h))}})}async function Rs(a){const s=await fetch(`${$t}/documents/${a}/download`,{headers:r.key?{Authorization:`Bearer ${r.key}`}:{}});if(!s.ok){const n=await s.text();let i=n;try{i=JSON.parse(n)?.error?.message||n}catch{}throw new Error(i||e("docs.downloadFail"))}const o=await s.blob();return URL.createObjectURL(o)}async function ns(a){if(a?.imageDataUrl)return{src:a.imageDataUrl,revoke:null};if(a?.isImage||Pt(a?.mimeType)){const s=await Rs(a.id);return{src:s,revoke:s}}return null}async function is(a){const{data:s}=await M(`/documents/${a}`);let o,n=null;try{const l=await ns(s);l?(n=l.revoke,o=`<img class="preview doc-preview-img" src="${l.src}" alt="${t(s.originalName||"")}" />`):s.isBinary||s.content==null?o=`<div class="data-empty"><div class="data-empty-icon">⧉</div><strong>${t(e("docs.binaryPreview"))}</strong></div>`:o=`<div class="pre" id="doc-content">${t(s.content||e("chats.none"))}</div>`}catch{o=`<div class="data-empty"><div class="data-empty-icon">⧉</div><strong>${t(e("chats.previewFailed")||e("docs.binaryPreview"))}</strong></div>`}const i=`${ss(s.storageType)}${s.storagePath?` · ${s.storagePath}`:""}`;ct({title:e("docs.detail"),subtitle:`${t(s.originalName)} · ${t(s.mimeType)} · ${Be(s.sizeBytes)}<br/><span class="muted">${t(e("docs.storage"))}: ${t(i)}</span>`,size:"lg",bodyHtml:`
      <div class="block">
        <h4>${t(e("docs.preview"))}</h4>
        ${o}
      </div>`,footerHtml:`
      ${!s.imageDataUrl&&!(s.isImage||Pt(s.mimeType))&&s.content&&!s.isBinary?`<button type="button" class="btn secondary sm" id="doc-copy">${t(e("docs.copy"))}</button>`:""}
      <button type="button" class="btn sm" id="doc-download">${t(e("docs.download"))}</button>
      <button type="button" class="btn secondary sm" id="doc-close">${t(e("chats.close"))}</button>`});const d=()=>{if(n)try{URL.revokeObjectURL(n)}catch{}he()};document.getElementById("doc-close")?.addEventListener("click",d),document.getElementById("doc-download").onclick=()=>os(s.id,s.originalName),document.getElementById("doc-copy")?.addEventListener("click",async()=>{if(await Qt(s.content||"")){const u=document.getElementById("doc-copy");u&&(u.textContent=e("chat.copied"))}})}function Ba(a){if(!a)return"-";const s=`audit.actions.${String(a).replace(/\./g,"_")}`,o=e(s);return o===s?a:o}function Fs(a){if(!a)return"";const s=`audit.resources.${String(a).replace(/\./g,"_")}`,o=e(s);return o===s?a:o}function Ns(a){if(!a)return"";try{const s=typeof a=="string"?JSON.parse(a):a;return!s||typeof s!="object"?String(a):Object.entries(s).map(([o,n])=>{const i={originalName:e("docs.file"),mimeType:e("docs.mime"),sizeBytes:e("docs.size"),storageType:e("audit.metaStorage"),asKeyId:e("audit.metaAsKey"),asKeyName:e("audit.metaAsKeyName"),model:e("chats.model"),stream:e("chats.stream")}[o]||o,d=typeof n=="object"?JSON.stringify(n):String(n??"");return`${i}: ${d}`}).join(" · ")}catch{return String(a)}}async function bt(){await Et();const a=r.auditFilter,s=new URLSearchParams;if(s.set("limit",String(a.limit)),s.set("offset",String(a.offset)),a.q&&s.set("q",a.q),a.action&&s.set("action",a.action),a.apiKeyId&&s.set("apiKeyId",a.apiKeyId),a.from&&s.set("from",new Date(a.from).toISOString()),a.to){const c=new Date(a.to);c.setHours(23,59,59,999),s.set("to",c.toISOString())}Ee(s,a);const o=await M(`/audit-logs?${s}`),n=o.total??0,i=["","chat.create","document.upload","document.delete","document.download","api_key.create","api_key.update","api_key.delete","settings.update","playground.chat","ip.ban","ip.unban","ddos.policy_update","pm2.switch","system.update"],d=[`<option value="">${t(e("common.all"))}</option>`,...r.keys.map(c=>`<option value="${c.id}" ${a.apiKeyId===c.id?"selected":""}>${t(c.name)}</option>`)].join(""),l=i.map(c=>c?`<option value="${t(c)}" ${a.action===c?"selected":""}>${t(Ba(c))}</option>`:`<option value="">${t(e("common.all"))}</option>`).join(""),u=(o.data||[]).map(c=>`
    <tr>
      <td>${ae(c.createdAt)}</td>
      <td title="${t(c.action||"")}"><span class="cell-primary">${t(Ba(c.action))}</span></td>
      <td>
        <div>${t(Fs(c.resource))}</div>
        ${c.resourceId?`<div class="cell-sub audit-id" title="${t(c.resourceId)}">${t(c.resourceId)}</div>`:""}
      </td>
      <td>${t(c.apiKey?.name||"-")}</td>
      <td class="muted audit-meta">${t(Ns(c.metaJson))}</td>
    </tr>`).join(""),m=Oe({title:e("common.filterTitle"),hint:e("common.filterHint"),meta:T("common.pagerTotal",{n}),searchHtml:`
      <div class="data-filter-search">
        <label for="af-q">${t(e("common.search"))}</label>
        <input type="search" id="af-q" value="${t(a.q)}" placeholder="${t(e("audit.searchPh"))}" />
      </div>`,gridHtml:`
      <label>${t(e("audit.action"))}
        <select id="af-action">${l}</select>
      </label>
      <label>${t(e("audit.key"))}
        <select id="af-key">${d}</select>
      </label>
      <label>${t(e("chats.from"))}<input type="date" id="af-from" value="${t(a.from)}" /></label>
      <label>${t(e("chats.to"))}<input type="date" id="af-to" value="${t(a.to)}" /></label>`}),p=$e({headHtml:`
      ${N({field:"createdAt",label:e("audit.time"),filterRef:a})}
      ${N({field:"action",label:e("audit.action"),filterRef:a})}
      ${N({field:"resource",label:e("audit.resource"),filterRef:a})}
      <th>${t(e("audit.key"))}</th>
      <th>${t(e("audit.meta"))}</th>`,bodyHtml:u,colSpan:5,emptyText:e("audit.empty"),pagerHtml:Ce({total:n,limit:a.limit,offset:a.offset,idPrefix:"audit"})});document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("audit.title"))}</h2>
    </div>
    ${m}
    ${p}
  `),de(),rt("audit",r.auditFilter,()=>bt().catch(h)),Ge(r.auditFilter,()=>bt().catch(h)),document.querySelector("[data-filter-apply]").onclick=()=>{r.auditFilter.q=document.getElementById("af-q").value.trim(),r.auditFilter.action=document.getElementById("af-action").value,r.auditFilter.apiKeyId=document.getElementById("af-key").value,r.auditFilter.from=document.getElementById("af-from").value,r.auditFilter.to=document.getElementById("af-to").value,r.auditFilter.offset=0,bt().catch(h)},document.querySelector("[data-filter-reset]").onclick=()=>{r.auditFilter={q:"",action:"",apiKeyId:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",limit:50,offset:0},bt().catch(h)}}function la(){return[{id:"local",titleKey:"settings.scLocalTitle",descKey:"settings.scLocalDesc",detailKey:"settings.scLocalDetail",values:{globalSafeMode:!1,safeToolsMode:"none",safeMaxTurns:16,safeTimeoutMs:18e4}},{id:"prod",titleKey:"settings.scProdTitle",descKey:"settings.scProdDesc",detailKey:"settings.scProdDetail",values:{globalSafeMode:!0,safeToolsMode:"none",safeMaxTurns:10,safeTimeoutMs:12e4}},{id:"code",titleKey:"settings.scCodeTitle",descKey:"settings.scCodeDesc",detailKey:"settings.scCodeDetail",values:{globalSafeMode:!1,safeToolsMode:"none",safeMaxTurns:20,safeTimeoutMs:3e5}},{id:"read",titleKey:"settings.scReadTitle",descKey:"settings.scReadDesc",detailKey:"settings.scReadDetail",values:{globalSafeMode:!0,safeToolsMode:"readonly",safeMaxTurns:12,safeTimeoutMs:15e4}},{id:"chat",titleKey:"settings.scChatTitle",descKey:"settings.scChatDesc",detailKey:"settings.scChatDetail",values:{globalSafeMode:!0,safeToolsMode:"none",safeMaxTurns:5,safeTimeoutMs:6e4}},{id:"long",titleKey:"settings.scLongTitle",descKey:"settings.scLongDesc",detailKey:"settings.scLongDetail",values:{globalSafeMode:!0,safeToolsMode:"none",safeMaxTurns:40,safeTimeoutMs:6e5}}]}function Ks(){return{globalSafeMode:document.getElementById("s-master-global")?Xe("s-master-global"):!1,safeToolsMode:document.getElementById("s-tools")?.value||"none",safeMaxTurns:Number(document.getElementById("s-turns")?.value),safeTimeoutMs:Number(document.getElementById("s-timeout")?.value)}}function js(a){const s=Ks();return!Number.isFinite(s.safeMaxTurns)||!Number.isFinite(s.safeTimeoutMs)?!1:s.globalSafeMode===!!a.globalSafeMode&&s.safeToolsMode===a.safeToolsMode&&s.safeMaxTurns===Number(a.safeMaxTurns)&&s.safeTimeoutMs===Number(a.safeTimeoutMs)}function nt(){for(const a of la()){const s=document.querySelector(`[data-preset="${a.id}"]`),o=document.querySelector(`[data-apply-preset="${a.id}"]`);if(!s||!o)continue;const n=js(a.values);s.classList.toggle("is-applied",n),o.textContent=e(n?"settings.guideActive":"settings.guideApply"),o.disabled=n,o.classList.toggle("is-applied",n),o.setAttribute("aria-pressed",n?"true":"false")}}function Us(a){const s=document.getElementById("s-tools"),o=document.getElementById("s-turns"),n=document.getElementById("s-timeout"),i=!!a.globalSafeMode;Ye("s-master-global",i,e("settings.masterOn"),e("settings.masterOff")),et("settings-root",!i),Ze("settings-disabled-banner",!i),s&&a.safeToolsMode&&(s.value=a.safeToolsMode),o&&a.safeMaxTurns!=null&&(o.value=String(a.safeMaxTurns)),n&&a.safeTimeoutMs!=null&&(n.value=String(a.safeTimeoutMs)),nt()}async function Gs(a){if(a?.values&&await ee({title:e(a.titleKey),message:T("settings.guideApplyConfirm",{name:e(a.titleKey)}),variant:"confirm",confirmText:e("settings.guideApply")})){Us(a.values);try{await M("/settings",{method:"PUT",body:JSON.stringify({globalSafeMode:!!a.values.globalSafeMode,safeToolsMode:a.values.safeToolsMode,safeMaxTurns:Number(a.values.safeMaxTurns),safeTimeoutMs:Number(a.values.safeTimeoutMs),defaultModel:document.getElementById("s-model")?.value?.trim()||""})}),nt();const s=document.querySelector("#flash-error");s&&(s.hidden=!1,s.classList.add("flash-ok"),s.textContent=e("settings.guideApplied"),setTimeout(()=>{s.textContent===e("settings.guideApplied")&&(s.hidden=!0,s.classList.remove("flash-ok"),s.textContent="")},2500))}catch(s){h(s)}}}async function ls(){const[{data:a},s]=await Promise.all([M("/settings"),St()]),o=(s.models||r.models||[]).map(l=>`<option value="${t(l)}" ${a.defaultModel===l?"selected":""}>${t(l)}</option>`).join(""),n=la().map(l=>`
      <article class="settings-guide-card" data-preset="${t(l.id)}">
        <div class="settings-guide-card-h">
          <strong>${t(e(l.titleKey))}</strong>
          <button type="button" class="btn secondary sm" data-apply-preset="${t(l.id)}">${t(e("settings.guideApply"))}</button>
        </div>
        <p class="settings-guide-desc">${t(e(l.descKey))}</p>
        <p class="settings-guide-detail muted">${t(e(l.detailKey))}</p>
        <div class="settings-guide-chips">
          <span class="chip">${t(l.values.globalSafeMode?e("settings.chipGlobalOn"):e("settings.chipGlobalOff"))}</span>
          <span class="chip">${t(l.values.safeToolsMode)}</span>
          <span class="chip">turns ${l.values.safeMaxTurns}</span>
          <span class="chip">${Math.round(l.values.safeTimeoutMs/1e3)}s</span>
        </div>
      </article>`).join(""),i=!!a.globalSafeMode;document.getElementById("app").innerHTML=le(`
    <div id="settings-root" class="${i?"":"is-feature-off"}">
    <div class="topbar">
      <h2>${t(e("settings.title"))}</h2>
      <div class="toolbar">
        ${Pa({id:"s-master-global",on:i,onLabel:e("settings.masterOn"),offLabel:e("settings.masterOff"),title:e("settings.globalSafeHint")})}
        <button class="btn secondary sm" id="btn-refresh-models">${t(e("settings.refreshModels"))}</button>
      </div>
    </div>
    <div class="feature-off-banner" id="settings-disabled-banner" ${i?"hidden":""} role="status">
      <strong>${t(e("common.featureOff"))}</strong>
      <span>${t(e("settings.disabledBanner"))}</span>
    </div>
    ${ke([e("settings.globalSafeHint")])}
    <div class="panel">
      <div class="modal-b">
        <div class="form-grid settings-safe-fields">
          <label>${t(e("settings.tools"))}
            <select id="s-tools">
              <option value="none">${t(e("settings.toolsNone"))}</option>
              <option value="readonly">${t(e("settings.toolsReadonly"))}</option>
            </select>
            <span class="hint">${t(e("settings.toolsHint"))}</span>
          </label>
          <label>${t(e("settings.maxTurns"))}
            <input id="s-turns" type="number" min="1" max="50" value="${a.safeMaxTurns}" />
            <span class="hint">${t(e("settings.maxTurnsHint"))}</span>
          </label>
          <label>${t(e("settings.timeout"))}
            <input id="s-timeout" type="number" min="1000" step="1000" value="${a.safeTimeoutMs}" />
            <span class="hint">${t(e("settings.timeoutHint"))}</span>
          </label>
          <label class="full">${t(e("settings.defaultModel"))}
            <select id="s-model">${o||`<option value="${t(a.defaultModel)}">${t(a.defaultModel)}</option>`}</select>
            <span class="hint">${t(e("settings.defaultModelHint"))}${s.source?` · ${t(s.source)}`:""}</span>
          </label>
        </div>
        <div class="toolbar settings-save-bar">
          <button class="btn" id="s-save">${t(e("settings.save"))}</button>
        </div>
      </div>
    </div>
    <div class="panel settings-guide">
      <div class="panel-h">
        <strong>${t(e("settings.guideTitle"))}</strong>
        <span class="muted panel-h-sub">${t(e("settings.guideIntro"))}</span>
      </div>
      <div class="modal-b">
        <div class="settings-guide-grid">${n}</div>
      </div>
    </div>
    <div class="danger-zone">
      <h3>${t(e("settings.dangerTitle"))}</h3>
      <p class="muted">${t(e("settings.panelOffHint"))} · ${t(e("settings.panelStatus"))}: <strong>${a.adminPanelEnabled?e("settings.panelOn"):e("settings.panelOff")}</strong></p>
      <button class="btn danger sm" id="s-disable-panel" ${a.adminPanelEnabled?"":"disabled"}>${t(e("settings.disablePanel"))}</button>
    </div>
    </div>
  `),de(),document.getElementById("s-tools").value=a.safeToolsMode||"none";const d=()=>nt();["s-tools","s-turns","s-timeout"].forEach(l=>{const u=document.getElementById(l);u&&(u.addEventListener("change",d),u.addEventListener("input",d))}),nt(),document.getElementById("s-master-global")?.addEventListener("click",async()=>{const l=!Xe("s-master-global");Ye("s-master-global",l,e("settings.masterOn"),e("settings.masterOff")),et("settings-root",!l),Ze("settings-disabled-banner",!l),nt();try{await M("/settings",{method:"PUT",body:JSON.stringify({globalSafeMode:l,safeToolsMode:document.getElementById("s-tools").value,safeMaxTurns:Number(document.getElementById("s-turns").value),safeTimeoutMs:Number(document.getElementById("s-timeout").value),defaultModel:document.getElementById("s-model").value.trim()})})}catch(u){Ye("s-master-global",!l,e("settings.masterOn"),e("settings.masterOff")),et("settings-root",l),Ze("settings-disabled-banner",l),h(u)}}),document.getElementById("btn-refresh-models").onclick=async()=>{await St(!0),ls().catch(h)},document.getElementById("s-save").onclick=async()=>{try{await M("/settings",{method:"PUT",body:JSON.stringify({globalSafeMode:Xe("s-master-global"),safeToolsMode:document.getElementById("s-tools").value,safeMaxTurns:Number(document.getElementById("s-turns").value),safeTimeoutMs:Number(document.getElementById("s-timeout").value),defaultModel:document.getElementById("s-model").value.trim()})}),nt();const l=document.querySelector("#flash-error");l&&(l.hidden=!1,l.classList.add("flash-ok"),l.textContent=e("settings.saved"),setTimeout(()=>{l.hidden=!0,l.classList.remove("flash-ok"),l.textContent=""},2e3))}catch(l){h(l)}},document.querySelectorAll("[data-apply-preset]").forEach(l=>{l.addEventListener("click",async()=>{if(l.disabled)return;const u=l.getAttribute("data-apply-preset"),m=la().find(p=>p.id===u);m&&await Gs(m)})}),document.getElementById("s-disable-panel").onclick=async()=>{if(await ee({message:e("settings.disablePanelConfirm"),variant:"danger",confirmText:e("settings.disablePanel")}))try{await M("/settings",{method:"PUT",body:JSON.stringify({adminPanelEnabled:!1})}),await be({message:e("settings.disablePanelDone"),title:e("common.notice")}),_t(!1)}catch(l){h(l)}}}async function Ht(){const a=await M("/api-features");if(r.page!=="apiFeatures")return;const s=a.data||{},o=[{id:"protocols",title:e("apiFeatures.groupProtocols"),tabLabel:e("apiFeatures.tabProtocols"),keys:["openaiChat","openaiResponses","anthropicMessages"]},{id:"media",title:e("apiFeatures.groupMedia"),tabLabel:e("apiFeatures.tabMedia"),keys:["imagesApi","filesOpenAiAlias","videoApi","audioApi"]},{id:"caps",title:e("apiFeatures.groupCaps"),tabLabel:e("apiFeatures.tabCaps"),keys:["tools","structuredOutput","vision","reasoningEffort","webSearch","subagents","planMode","memory","sessionResume","bestOfN","checkLoop","systemOverride","rules","permissionMode","sandbox"]},{id:"emu",title:e("apiFeatures.groupEmu"),tabLabel:e("apiFeatures.tabEmu"),keys:["usageEstimate","assistantsEmulation","strictSampling","forceDisableToolsInSafe"]}],n=r.apiFeaturesTab==="media"||r.apiFeaturesTab==="caps"||r.apiFeaturesTab==="emu"||r.apiFeaturesTab==="protocols"?r.apiFeaturesTab:"protocols";r.apiFeaturesTab=n;const i=g=>e(`apiFeatures.flag.${g}`)||g,d=g=>e(`apiFeatures.hint.${g}`)||"",l=g=>g.filter(v=>!!s[v]).length,u=g=>g.map(v=>{const S=!!s[v];return`
          <div class="dash-prot-row api-feat-row" data-feat="${t(v)}">
            <div>
              <strong>${t(i(v))}</strong>
              <div class="muted api-feat-hint">${t(d(v))}</div>
            </div>
            <button type="button" class="master-toggle ${S?"is-on":"is-off"}" data-feat-toggle="${t(v)}" aria-pressed="${S?"true":"false"}">
              <span class="master-toggle-track" aria-hidden="true"><span class="master-toggle-knob"></span></span>
              <span class="master-toggle-label">${t(e(S?"dash.on":"dash.off"))}</span>
            </button>
          </div>`}).join(""),m=o.reduce((g,v)=>g+v.keys.length,0),p=o.reduce((g,v)=>g+l(v.keys),0),c=`
    <div class="grid api-feat-kpi-grid">
      <div class="card">
        <div class="label">${t(e("apiFeatures.kpiEnabled"))}</div>
        <div class="value value-sm">${p}<span class="dash-kpi-den">/${m}</span></div>
        <div class="muted card-sub">${t(e("apiFeatures.kpiEnabledSub"))}</div>
      </div>
      ${o.map(g=>{const v=l(g.keys);return`
        <div class="card">
          <div class="label">${t(g.tabLabel)}</div>
          <div class="value value-sm">${v}<span class="dash-kpi-den">/${g.keys.length}</span></div>
          <div class="muted card-sub">${t(g.title)}</div>
        </div>`}).join("")}
    </div>`,w=o.map(g=>{const v=l(g.keys);return`
        <button type="button" role="tab" class="seg-tab ${n===g.id?"is-active":""}" data-feat-tab="${t(g.id)}" aria-selected="${n===g.id}">
          ${t(g.tabLabel)}
          <span class="seg-tab-count">${v}/${g.keys.length}</span>
        </button>`}).join(""),y=o.map(g=>`
        <div class="usage-tab-pane api-feat-tab-pane" id="api-feat-tab-${t(g.id)}" ${n===g.id?"":"hidden"}>
          <div class="panel data-table-panel api-feat-panel">
            <div class="panel-h">
              <div class="panel-h-text">
                <strong>${t(g.title)}</strong>
                <span class="muted panel-h-sub">${t(T("apiFeatures.groupMeta",{on:l(g.keys),n:g.keys.length}))}</span>
              </div>
            </div>
            <div class="panel-pad api-feat-list">${u(g.keys)}</div>
          </div>
        </div>`).join("");document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("apiFeatures.title"))}</h2>
      <div class="toolbar">
        <button type="button" class="btn secondary sm" data-feat-preset="open">${t(e("apiFeatures.presetOpen"))}</button>
        <button type="button" class="btn secondary sm" data-feat-preset="locked">${t(e("apiFeatures.presetLocked"))}</button>
        <button type="button" class="btn secondary sm" data-feat-preset="dev">${t(e("apiFeatures.presetDev"))}</button>
      </div>
    </div>
    ${ke([e("apiFeatures.intro")])}
    ${c}

    <div class="usage-tabs-panel panel api-feat-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("apiFeatures.title"))}">
        ${w}
      </div>
      <div class="usage-tab-body">
        ${y}
      </div>
    </div>
  `),de(),document.querySelectorAll("[data-feat-tab]").forEach(g=>{g.addEventListener("click",()=>{const v=g.getAttribute("data-feat-tab")||"protocols",S=v==="media"||v==="caps"||v==="emu"||v==="protocols"?v:"protocols";r.apiFeaturesTab!==S&&(r.apiFeaturesTab=S,Ht().catch(h))})}),document.querySelectorAll("[data-feat-toggle]").forEach(g=>{g.addEventListener("click",async()=>{const v=g.getAttribute("data-feat-toggle");if(!v)return;const S=!g.classList.contains("is-on");try{await M("/api-features",{method:"PUT",body:JSON.stringify({[v]:S})}),await Ht()}catch(C){h(C)}})}),document.querySelectorAll("[data-feat-preset]").forEach(g=>{g.addEventListener("click",async()=>{const v=g.getAttribute("data-feat-preset");if(await ee({message:T("apiFeatures.presetConfirm",{name:v}),confirmText:e("common.confirm")}))try{await M("/api-features/preset",{method:"POST",body:JSON.stringify({name:v})}),await Ht()}catch(S){h(S)}})})}async function qe(){r.mediaFilter||(r.mediaFilter={tab:"studio",q:"",kind:"",provider:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",jobSortBy:"createdAt",jobSortDir:"desc",limit:20,offset:0}),r.mediaFilter.sortBy||(r.mediaFilter.sortBy="createdAt"),r.mediaFilter.sortDir||(r.mediaFilter.sortDir="desc"),r.mediaFilter.jobSortBy||(r.mediaFilter.jobSortBy="createdAt"),r.mediaFilter.jobSortDir||(r.mediaFilter.jobSortDir="desc"),r.mediaFilter.tab||(r.mediaFilter.tab="studio");const a=r.mediaFilter,s=a.tab==="assets"||a.tab==="jobs"||a.tab==="studio"?a.tab:"studio";a.tab=s;const o=new URLSearchParams({limit:String(a.limit),offset:String(a.offset)});if(a.q&&o.set("q",a.q),a.kind&&o.set("kind",a.kind),a.provider&&o.set("provider",a.provider),a.from&&o.set("from",new Date(a.from).toISOString()),a.to){const f=new Date(a.to);f.setHours(23,59,59,999),o.set("to",f.toISOString())}Ee(o,a);const n=new URLSearchParams({limit:"50",offset:"0"});Ee(n,a,"jobSortBy","jobSortDir");const[i,,d,l]=await Promise.all([St(!1).catch(()=>({models:r.models||[],defaultModel:""})),Et().catch(()=>{}),M(`/media/assets?${o}`),M(`/media/jobs?${n}`).catch(()=>({data:[],total:0}))]),u=d.data||[],m=d.total??u.length,p=l.data||[],c=l.total??p.length,w=(r.keys||[]).filter(f=>f.isActive!==!1&&(f.mode==="agent"||f.role==="admin")),y=[`<option value="">${t(e("media.generateKeySession"))}</option>`,...w.map(f=>`<option value="${t(f.id)}">${t(f.name||f.id)} · ${t(f.keyPrefix||"")}… · ${t(f.mode||"")}</option>`)].join(""),g=i.models?.length?i.models:r.models||[],v=i.defaultModel||g[0]||"",S=g.length?g.map(f=>`<option value="${t(f)}" ${f===v?"selected":""}>${t(f)}${f===v?` · ${t(e("media.modelDefault"))}`:""}</option>`).join(""):`<option value="">${t(v||e("media.modelEmpty"))}</option>`,C=[["1:1","1:1 · square"],["16:9","16:9 · landscape"],["9:16","9:16 · portrait / story"],["4:3","4:3"],["3:4","3:4"],["3:2","3:2"],["2:3","2:3"],["auto","auto"]].map(([f,$],U)=>`<option value="${f}" ${U===0?"selected":""}>${t($)}</option>`).join(""),L=u.map(f=>{const $=f.mime||"",U=f.filename||f.originalName||"",b=Bs($,U),k=Sa($,U)||"",I=b?`<button type="button" class="btn ghost sm" data-media-preview="${t(f.id)}" data-media-mime="${t($)}" data-media-name="${t(U)}" data-media-kind="${t(f.kind||"")}" data-media-bytes="${t(String(f.bytes??""))}" data-media-prompt="${t(f.prompt||"")}" data-preview-kind="${t(k)}" title="${t(e("media.preview"))}">${t(e("media.preview"))}</button>`:"";return`
    <tr>
      <td>
        <div class="cell-primary mono" title="${t(f.id)}">${t(String(f.id).slice(0,8))}…</div>
        <div class="cell-sub">${t(U||f.source||"—")}</div>
      </td>
      <td>${t(f.kind||"—")}</td>
      <td class="muted">${t($||"—")}</td>
      <td>${Be(f.bytes)}</td>
      <td>${t(f.provider||"—")}</td>
      <td class="muted" title="${t(f.prompt||"")}">${t((f.prompt||"—").slice(0,48))}</td>
      <td>${ae(f.created_at)}</td>
      <td><div class="row-actions">
        ${I}
        <button type="button" class="btn ghost sm" data-media-dl="${t(f.id)}" data-media-name="${t(U)}">${t(e("media.download"))}</button>
        <button type="button" class="btn danger sm" data-media-del="${t(f.id)}">${t(e("media.delete"))}</button>
      </div></td>
    </tr>`}).join(""),R=Oe({title:e("common.filterTitle"),hint:e("common.filterHint"),meta:T("common.pagerTotal",{n:m}),searchHtml:`
      <div class="data-filter-search">
        <label for="mf-q">${t(e("common.search"))}</label>
        <input type="search" id="mf-q" value="${t(a.q)}" placeholder="${t(e("media.searchPh"))}" />
      </div>`,gridHtml:`
      <label>${t(e("media.kind"))}
        <select id="mf-kind">
          <option value="">${t(e("media.allKinds"))}</option>
          <option value="image" ${a.kind==="image"?"selected":""}>image</option>
          <option value="video" ${a.kind==="video"?"selected":""}>video</option>
          <option value="audio" ${a.kind==="audio"?"selected":""}>audio</option>
        </select>
      </label>
      <label>${t(e("media.provider"))}
        <input type="text" id="mf-provider" value="${t(a.provider)}" placeholder="${t(e("media.providerPh"))}" />
      </label>
      <label>${t(e("media.from"))}
        <input type="date" id="mf-from" value="${t(a.from)}" />
      </label>
      <label>${t(e("media.to"))}
        <input type="date" id="mf-to" value="${t(a.to)}" />
      </label>`}),q=$e({headHtml:`
      <th>ID</th>
      ${N({field:"kind",label:e("media.kind"),filterRef:a})}
      ${N({field:"mime",label:"MIME",filterRef:a})}
      ${N({field:"byteSize",label:e("media.bytes"),filterRef:a})}
      ${N({field:"provider",label:e("media.provider"),filterRef:a})}
      <th>${t(e("media.prompt"))}</th>
      ${N({field:"createdAt",label:e("media.created"),filterRef:a})}
      <th>${t(e("common.actions"))}</th>`,bodyHtml:L,colSpan:8,emptyText:e("media.empty"),pagerHtml:Ce({total:m,limit:a.limit,offset:a.offset,idPrefix:"media"})}),j=p.map(f=>`
    <tr>
      <td>
        <div class="cell-primary mono" title="${t(f.id)}">${t(String(f.id).slice(0,8))}…</div>
      </td>
      <td>${t(f.status||"—")}</td>
      <td class="muted" title="${t(f.prompt||"")}">${t((f.prompt||"—").slice(0,64))}</td>
      <td class="mono">${t(f.result_asset_id?String(f.result_asset_id).slice(0,8)+"…":"—")}</td>
      <td>${ae(f.created_at)}</td>
    </tr>`).join(""),x=$e({headHtml:`
      <th>ID</th>
      ${N({field:"status",label:e("media.status"),filterRef:a,sortByKey:"jobSortBy",sortDirKey:"jobSortDir"})}
      <th>${t(e("media.prompt"))}</th>
      <th>Asset</th>
      ${N({field:"createdAt",label:e("media.created"),filterRef:a,sortByKey:"jobSortBy",sortDirKey:"jobSortDir"})}`,bodyHtml:j,colSpan:5,emptyText:e("media.jobsEmpty")}),P=`
    <div class="panel media-studio-panel data-table-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("media.studioTitle"))}</strong>
          <span class="muted panel-h-sub">${t(e("media.studioHint"))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <div class="seg-tabs media-mode-tabs" role="tablist" aria-label="${t(e("media.studioTitle"))}">
          <button type="button" class="seg-tab is-active" data-mg-mode="generate" role="tab" aria-selected="true">${t(e("media.modeGenerate"))}</button>
          <button type="button" class="seg-tab" data-mg-mode="edit" role="tab" aria-selected="false">${t(e("media.modeEdit"))}</button>
          <button type="button" class="seg-tab" data-mg-mode="video" role="tab" aria-selected="false">${t(e("media.modeVideo"))}</button>
        </div>
        <div class="form-grid">
          <label class="full">${t(e("media.generatePrompt"))}
            <textarea id="mg-prompt" rows="3" placeholder="${t(e("media.generatePromptPh"))}"></textarea>
          </label>
          <label>${t(e("media.generateKey"))}
            <select id="mg-key">${y}</select>
          </label>
          <label>${t(e("chats.model"))}
            <select id="mg-model">${S}</select>
            <span class="hint">${t(e("media.modelHint"))}</span>
          </label>
          <label id="mg-aspect-wrap">${t(e("media.aspectRatio"))}
            <select id="mg-aspect">${C}</select>
            <span class="hint">${t(e("media.aspectHint"))}</span>
          </label>
          <label id="mg-n-wrap">${t(e("media.generateN"))}
            <input type="number" id="mg-n" min="1" max="4" value="1" />
            <span class="hint">${t(e("media.nHint"))}</span>
          </label>
          <label id="mg-voice-wrap" hidden>${t(e("media.videoVoice"))}
            <select id="mg-voice">
              <option value="">${t(e("media.videoVoiceNone"))}</option>
              ${["ara","eve","leo","rex","sal","mio"].map(f=>`<option value="${f}">${f}</option>`).join("")}
            </select>
            <span class="hint">${t(e("media.videoVoiceHint"))}</span>
          </label>
          <label id="mg-duration-wrap" hidden>${t(e("media.videoDuration"))}
            <select id="mg-duration">
              ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(f=>`<option value="${f}" ${f===6?"selected":""}>${f}s</option>`).join("")}
            </select>
            <span class="hint">${t(e("media.videoDurationHint"))}</span>
          </label>
        </div>
        <div id="mg-source-section" class="media-source-section" hidden>
          <div class="media-source-head">
            <strong>${t(e("media.sourceTitle"))}</strong>
            <span class="muted hint">${t(e("media.sourceHint"))}</span>
          </div>
          <div class="media-dropzone" id="mg-dropzone" tabindex="0" role="button" aria-label="${t(e("media.dropzoneAria"))}">
            <input type="file" id="mg-file" accept="image/*" hidden />
            <div class="media-dropzone-inner" id="mg-drop-inner">
              <div class="media-dropzone-icon" aria-hidden="true">📎</div>
              <strong id="mg-drop-title">${t(e("media.dropTitle"))}</strong>
              <span class="muted" id="mg-drop-hint">${t(e("media.dropHint"))}</span>
              <div class="media-dropzone-actions">
                <button type="button" class="btn secondary sm" id="mg-pick-file">${t(e("media.pickFile"))}</button>
                <button type="button" class="btn secondary sm" id="mg-pick-lib">${t(e("media.pickLibrary"))}</button>
                <button type="button" class="btn ghost sm" id="mg-clear-source" hidden>${t(e("media.clearSource"))}</button>
              </div>
              <div class="media-source-chip" id="mg-source-chip" hidden></div>
            </div>
          </div>
        </div>
        <div class="media-gen-actions toolbar">
          <button type="button" class="btn" id="mg-submit">${t(e("media.generateSubmit"))}</button>
          <span id="mg-status" class="muted" hidden></span>
        </div>
      </div>
    </div>`,K=`
    <div class="grid media-kpi-grid" id="media-kpi-grid">
      <div class="card">
        <div class="label">${t(e("media.assets"))}</div>
        <div class="value value-sm">${m}</div>
        <div class="muted card-sub">${t(e("media.kpiAssetsSub"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("media.jobs"))}</div>
        <div class="value value-sm">${c}</div>
        <div class="muted card-sub">${t(e("media.kpiJobsSub"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("media.tabStudio"))}</div>
        <div class="value value-sm">${t(e("media.modeGenerate"))} / ${t(e("media.modeEdit"))} / ${t(e("media.modeVideo"))}</div>
        <div class="muted card-sub">${t(e("media.kpiStudioSub"))}</div>
      </div>
    </div>`;document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("media.title"))}</h2>
    </div>
    ${ke([e("media.intro")])}
    ${K}
    <div class="usage-tabs-panel panel media-tabs-panel queue-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("media.title"))}">
        <button type="button" role="tab" class="seg-tab ${s==="studio"?"is-active":""}" data-media-tab="studio" aria-selected="${s==="studio"}">
          ${t(e("media.tabStudio"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${s==="assets"?"is-active":""}" data-media-tab="assets" aria-selected="${s==="assets"}">
          ${t(e("media.tabAssets"))}
          <span class="seg-tab-count">${m}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${s==="jobs"?"is-active":""}" data-media-tab="jobs" aria-selected="${s==="jobs"}">
          ${t(e("media.tabJobs"))}
          <span class="seg-tab-count">${c}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane media-tab-pane-studio" id="media-tab-studio" ${s==="studio"?"":"hidden"}>
          ${P}
        </div>
        <div class="usage-tab-pane media-tab-pane-assets" id="media-tab-assets" ${s==="assets"?"":"hidden"}>
          ${R}
          ${q}
        </div>
        <div class="usage-tab-pane media-tab-pane-jobs" id="media-tab-jobs" ${s==="jobs"?"":"hidden"}>
          ${x}
        </div>
      </div>
    </div>
  `),de(),document.querySelectorAll("[data-media-tab]").forEach(f=>{f.addEventListener("click",()=>{const $=f.getAttribute("data-media-tab")||"studio",U=$==="assets"||$==="jobs"||$==="studio"?$:"studio";r.mediaFilter.tab!==U&&(r.mediaFilter.tab=U,qe().catch(h))})});async function A(f){const $=await fetch(`/admin/api/media/assets/${f}/download`,{headers:{Authorization:`Bearer ${r.key}`}});if(!$.ok)throw new Error(await $.text());return $.blob()}{let f="generate",$=null;const U=()=>{const E=document.getElementById("mg-source-chip"),B=document.getElementById("mg-clear-source");if(!E)return;if(!$){E.hidden=!0,E.innerHTML="",B&&(B.hidden=!0);return}const Y=$.kind==="file"?e("media.sourceKindUpload"):$.kind==="asset"?e("media.sourceKindAsset"):e("media.sourceKindDocument");E.hidden=!1,E.innerHTML=`<span class="chip">${t(Y)}</span> <span class="mono">${t($.name||$.id||"")}</span>`,B&&(B.hidden=!1)},b=E=>{$=E;const B=document.getElementById("mg-file");B&&E?.kind!=="file"&&(B.value=""),U()},k=E=>{f=E==="edit"||E==="video"?E:"generate",document.querySelectorAll("[data-mg-mode]").forEach(Ie=>{const Me=Ie.getAttribute("data-mg-mode")===f;Ie.classList.toggle("is-active",Me),Ie.setAttribute("aria-selected",Me?"true":"false")});const B=document.getElementById("mg-source-section"),Y=document.getElementById("mg-n-wrap"),se=document.getElementById("mg-duration-wrap"),ue=document.getElementById("mg-voice-wrap"),fe=document.getElementById("mg-submit");B&&(B.hidden=f==="generate"),Y&&(Y.hidden=f==="video"),se&&(se.hidden=f!=="video"),ue&&(ue.hidden=f!=="video"),fe&&(fe.textContent=e(f==="edit"?"media.editSubmit":f==="video"?"media.videoSubmit":"media.generateSubmit"));const oe=document.getElementById("mg-prompt");oe&&(oe.placeholder=e(f==="edit"?"media.editPromptPh":f==="video"?"media.videoPromptPh":"media.generatePromptPh"));const me=document.getElementById("mg-drop-title"),ye=document.getElementById("mg-drop-hint");me&&(me.textContent=e(f==="video"?"media.dropTitleVideo":"media.dropTitle")),ye&&(ye.textContent=e(f==="video"?"media.dropHintVideo":"media.dropHint"))};document.querySelectorAll("[data-mg-mode]").forEach(E=>{E.addEventListener("click",()=>k(E.getAttribute("data-mg-mode")||"generate"))}),k("generate");const I=document.getElementById("mg-dropzone"),F=document.getElementById("mg-file"),Z=E=>E?E.type&&E.type.startsWith("image/")?!0:/\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(E.name||""):!1,z=E=>{const B=[...E||[]].find(Z);if(!B){Q(e("media.sourceNeedImage"));return}b({kind:"file",file:B,name:B.name,mime:B.type||"image/*"}),Q("")};if(document.getElementById("mg-pick-file")?.addEventListener("click",E=>{E.preventDefault(),E.stopPropagation(),F?.click()}),F?.addEventListener("change",()=>{F.files?.length&&z(F.files)}),document.getElementById("mg-clear-source")?.addEventListener("click",E=>{E.preventDefault(),E.stopPropagation(),b(null)}),document.getElementById("mg-pick-lib")?.addEventListener("click",E=>{E.preventDefault(),E.stopPropagation(),Qs({imagesOnly:!0,onPick:B=>{b({kind:B.kind,id:B.id,name:B.name,mime:B.mime}),Q("")}}).catch(B=>Q(B.message||e("media.libraryLoadFail")))}),I&&(I.addEventListener("click",E=>{E.target.closest("button")||F?.click()}),I.addEventListener("keydown",E=>{(E.key==="Enter"||E.key===" ")&&(E.preventDefault(),F?.click())}),["dragenter","dragover"].forEach(E=>{I.addEventListener(E,B=>{B.preventDefault(),B.stopPropagation(),I.classList.add("is-dragover")})}),["dragleave","drop"].forEach(E=>{I.addEventListener(E,B=>{B.preventDefault(),B.stopPropagation(),I.classList.remove("is-dragover")})}),I.addEventListener("drop",E=>{const B=E.dataTransfer;B?.files?.length&&z(B.files)})),r._mediaDragAbort)try{r._mediaDragAbort.abort()}catch{}r._mediaDragAbort=new AbortController;const G={signal:r._mediaDragAbort.signal},W=document.getElementById("app");let D=0;window.addEventListener("dragenter",E=>{f!=="generate"&&[...E.dataTransfer?.types||[]].includes("Files")&&(D+=1,W?.classList.add("is-media-file-drag"))},G),window.addEventListener("dragleave",()=>{D=Math.max(0,D-1),D===0&&W?.classList.remove("is-media-file-drag")},G),window.addEventListener("drop",E=>{D=0,W?.classList.remove("is-media-file-drag"),f!=="generate"&&E.dataTransfer?.files?.length&&(E.preventDefault(),z(E.dataTransfer.files))},G),window.addEventListener("dragover",E=>{f!=="generate"&&[...E.dataTransfer?.types||[]].includes("Files")&&E.preventDefault()},G),document.getElementById("mg-submit")?.addEventListener("click",async()=>{const E=document.getElementById("mg-prompt")?.value?.trim()||"";if(!E){Q(e("media.generateNeedPrompt"));return}const B=document.getElementById("mg-key")?.value||"",Y=document.getElementById("mg-model")?.value||void 0,se=document.getElementById("mg-aspect")?.value||"1:1",ue=Math.min(4,Math.max(1,Number(document.getElementById("mg-n")?.value)||1)),fe=document.getElementById("mg-submit"),oe=document.getElementById("mg-status"),me=e(f==="video"?"media.videoBusy":f==="edit"?"media.editBusy":"media.generateBusy");fe&&(fe.disabled=!0,fe.textContent=me),oe&&(oe.hidden=!1,oe.textContent=me),Q("");try{if(f==="edit"){if(!$)throw new Error(e("media.editNeedImage"));const X=new FormData;X.append("prompt",E),X.append("aspect_ratio",se),X.append("n",String(ue)),X.append("response_format","url"),Y&&X.append("model",Y),B&&X.append("apiKeyId",B),$.kind==="file"&&$.file?X.append("image",$.file):$.kind==="asset"&&$.id?X.append("sourceAssetId",$.id):$.kind==="document"&&$.id&&X.append("sourceDocumentId",$.id),await qa(await fetch("/admin/api/media/edit",{method:"POST",headers:{Authorization:`Bearer ${r.key}`},body:X})),oe&&(oe.textContent=e("media.editOk")),r.mediaFilter.tab="assets",r.mediaFilter.offset=0,await qe();return}if(f==="video"){const X=new FormData;X.append("prompt",E),X.append("aspect_ratio",se),X.append("seconds",String(document.getElementById("mg-duration")?.value||6)),Y&&X.append("model",Y),B&&X.append("apiKeyId",B);const xa=document.getElementById("mg-voice")?.value||"";xa&&X.append("voices",xa),$?.kind==="file"&&$.file?X.append("image",$.file):$?.kind==="asset"&&$.id?X.append("source_asset_id",$.id):$?.kind==="document"&&$.id&&X.append("source_document_id",$.id),await qa(await fetch("/admin/api/media/videos",{method:"POST",headers:{Authorization:`Bearer ${r.key}`},body:X})),oe&&(oe.textContent=e("media.videoOk")),r.mediaFilter.tab="jobs",await qe();return}const ye={prompt:E,aspect_ratio:se,n:ue,response_format:"url"};Y&&(ye.model=Y),B&&(ye.apiKeyId=B);const Me=(await M("/media/generate",{method:"POST",body:JSON.stringify(ye)}))?.data?.grok?.asset_ids||[];if(oe&&(oe.textContent=e("media.generateOk")),r.mediaFilter.tab="assets",r.mediaFilter.offset=0,await qe(),Me[0])try{const X=await A(Me[0]);Aa({id:Me[0],mime:X.type||"image/png",filename:`generated-${String(Me[0]).slice(0,8)}`,kind:"image",bytes:X.size,prompt:E},X)}catch{}}catch(ye){h(ye),oe&&(oe.textContent=ye.message||e("media.generateFail")),fe&&(fe.disabled=!1,k(f))}})}(s==="assets"||s==="jobs")&&Ge(r.mediaFilter,()=>qe().catch(h)),s==="assets"&&(rt("media",r.mediaFilter,()=>qe().catch(h)),document.querySelector("#media-tab-assets [data-filter-apply]")?.addEventListener("click",()=>{r.mediaFilter.q=document.getElementById("mf-q")?.value.trim()||"",r.mediaFilter.kind=document.getElementById("mf-kind")?.value||"",r.mediaFilter.provider=document.getElementById("mf-provider")?.value.trim()||"",r.mediaFilter.from=document.getElementById("mf-from")?.value||"",r.mediaFilter.to=document.getElementById("mf-to")?.value||"",r.mediaFilter.offset=0,qe().catch(h)}),document.querySelector("#media-tab-assets [data-filter-reset]")?.addEventListener("click",()=>{const f=r.mediaFilter.tab;r.mediaFilter={tab:f,q:"",kind:"",provider:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",jobSortBy:"createdAt",jobSortDir:"desc",limit:20,offset:0},qe().catch(h)}),document.querySelectorAll("[data-media-preview]").forEach(f=>{f.addEventListener("click",async()=>{try{const $=f.getAttribute("data-media-preview");if(!$)return;const U=f.getAttribute("data-media-mime")||"",b=f.getAttribute("data-media-name")||"",k=f.getAttribute("data-media-kind")||"",I=f.getAttribute("data-media-bytes")||"",F=f.getAttribute("data-media-prompt")||"",Z=await A($);Aa({id:$,mime:U||Z.type||"",filename:b,kind:k,bytes:I?Number(I):Z.size,prompt:F},Z)}catch($){h($)}})}),document.querySelectorAll("[data-media-dl]").forEach(f=>{f.addEventListener("click",async()=>{try{const $=f.getAttribute("data-media-dl"),U=f.getAttribute("data-media-name")||"",b=await A($),k=document.createElement("a");k.href=URL.createObjectURL(b),k.download=U||`media-${String($).slice(0,8)}`,k.click(),setTimeout(()=>URL.revokeObjectURL(k.href),3e4)}catch($){h($)}})}),document.querySelectorAll("[data-media-del]").forEach(f=>{f.addEventListener("click",async()=>{const $=f.getAttribute("data-media-del");if(await ee({message:e("media.deleteConfirm"),variant:"danger",confirmText:e("media.delete")}))try{await M(`/media/assets/${$}`,{method:"DELETE"}),await qe()}catch(U){h(U)}})}))}async function Qs(a){const s=a.imagesOnly!==!1;let o="documents",n=0,i=null;ct({title:e("media.libraryTitle"),subtitle:t(e("media.librarySubtitle")),size:"md",bodyHtml:`
      <div class="chat-lib media-lib">
        <div class="seg-tabs" role="tablist" style="margin-bottom:0.75rem">
          <button type="button" class="seg-tab is-active" data-mlib-tab="documents">${t(e("media.libraryTabDocs"))}</button>
          <button type="button" class="seg-tab" data-mlib-tab="assets">${t(e("media.libraryTabAssets"))}</button>
        </div>
        <div class="chat-lib-toolbar">
          <input type="search" id="mlib-q" class="chat-lib-search" placeholder="${t(e("media.librarySearch"))}" autocomplete="off" />
          <span class="muted chat-lib-count" id="mlib-count"></span>
        </div>
        <div class="muted chat-lib-formats">${t(e("media.libraryFormats"))}</div>
        <div id="mlib-list" class="chat-lib-list" role="listbox">
          <div class="muted chat-lib-status">${t(e("common.loading")||"…")}</div>
        </div>
      </div>`,footerHtml:`
      <button type="button" class="btn secondary sm" id="mlib-cancel">${t(e("common.cancel"))}</button>
      <button type="button" class="btn sm" id="mlib-add" disabled>${t(e("media.librarySelect"))}</button>`});const d=document.getElementById("mlib-list"),l=document.getElementById("mlib-q"),u=document.getElementById("mlib-add");document.getElementById("mlib-cancel")?.addEventListener("click",()=>he());const m=()=>{u&&(u.disabled=!i,u.textContent=i?`${e("media.librarySelect")} · ${i.name.slice(0,24)}`:e("media.librarySelect"))},p=v=>String(v||"").startsWith("image/"),c=v=>/\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(String(v||"")),w=v=>{if(d){if(!v.length){d.innerHTML=`<div class="data-empty chat-lib-empty"><strong>${t(e("media.libraryEmpty"))}</strong></div>`;return}d.innerHTML=v.map(S=>{const C=i?.id===S.id&&i?.kind===S.kind;return`
          <label class="chat-lib-row ${C?"is-selected":""}" data-kind="${t(S.kind)}" data-id="${t(S.id)}">
            <input type="radio" name="mlib-pick" ${C?"checked":""} />
            <span class="chat-lib-meta">
              <span class="chat-lib-name" title="${t(S.name)}">${t(S.name)}</span>
              <span class="muted">${t(S.kindLabel)} · ${t(S.mime||"—")}${S.size!=null?` · ${Be(S.size)}`:""}</span>
            </span>
          </label>`}).join(""),d.querySelectorAll(".chat-lib-row").forEach(S=>{S.addEventListener("click",()=>{const C=S.getAttribute("data-kind"),L=S.getAttribute("data-id"),R=v.find(q=>q.id===L&&q.kind===C);R&&(i={kind:R.kind,id:R.id,name:R.name,mime:R.mime},d.querySelectorAll(".chat-lib-row").forEach(q=>{q.classList.toggle("is-selected",q.getAttribute("data-id")===L&&q.getAttribute("data-kind")===C);const j=q.querySelector("input");j&&(j.checked=q.getAttribute("data-id")===L&&q.getAttribute("data-kind")===C)}),m())})})}},y=async()=>{const v=++n;d&&(d.innerHTML=`<div class="muted chat-lib-status">${t(e("common.loading")||"…")}</div>`);try{const S=(l?.value||"").trim();let C=[];if(o==="assets"){const L=new URLSearchParams({limit:"80",offset:"0"});S&&L.set("q",S),s&&L.set("kind","image"),C=((await M(`/media/assets?${L}`)).data||[]).filter(q=>!s||p(q.mime)||c(q.filename)).map(q=>({kind:"asset",kindLabel:e("media.sourceKindAsset"),id:q.id,name:q.filename||q.prompt||q.id,mime:q.mime||"",size:q.bytes}))}else{const L=new URLSearchParams({limit:"80",offset:"0"});S&&L.set("q",S),C=((await M(`/documents?${L}`)).data||[]).filter(q=>!s||p(q.mimeType)||c(q.originalName)).map(q=>({kind:"document",kindLabel:e("media.sourceKindDocument"),id:q.id,name:q.originalName||q.id,mime:q.mimeType||"",size:q.sizeBytes}))}if(v!==n)return;w(C)}catch(S){if(v!==n)return;d&&(d.innerHTML=`<div class="error-box">${t(S.message||e("media.libraryLoadFail"))}</div>`)}};document.querySelectorAll("[data-mlib-tab]").forEach(v=>{v.addEventListener("click",()=>{o=v.getAttribute("data-mlib-tab")==="assets"?"assets":"documents",document.querySelectorAll("[data-mlib-tab]").forEach(S=>{S.classList.toggle("is-active",S.getAttribute("data-mlib-tab")===o)}),i=null,m(),y()})});let g=null;l?.addEventListener("input",()=>{g&&clearTimeout(g),g=setTimeout(()=>y(),280)}),u?.addEventListener("click",()=>{i&&(a.onPick(i),he())}),m(),await y()}async function ge(){const a=r.usageFilter;a.sortBy||(a.sortBy="lastUsedAt"),a.sortDir||(a.sortDir="desc"),a.modelSortBy||(a.modelSortBy="requests"),a.modelSortDir||(a.modelSortDir="desc");const s=new URLSearchParams;Ee(s,a),a.modelSortBy&&s.set("modelSortBy",a.modelSortBy),(a.modelSortDir==="asc"||a.modelSortDir==="desc")&&s.set("modelSortDir",a.modelSortDir);const{data:o}=await M(`/usage?${s}`),n=o.totals||{},i=o.limits||{},d=a.pageSize||10;let l=o.byModel||[];if(a.modelQ.trim()){const x=a.modelQ.trim().toLowerCase();l=l.filter(P=>String(P.model||"").toLowerCase().includes(x))}const u=l.length,p=l.slice(a.modelPage*d,a.modelPage*d+d).map(x=>`<tr><td class="cell-primary">${t(x.model)}</td><td>${x.requests}</td></tr>`).join("");let c=o.perKey||[];if(a.keyQ.trim()){const x=a.keyQ.trim().toLowerCase();c=c.filter(P=>String(P.name||"").toLowerCase().includes(x)||String(P.keyPrefix||"").toLowerCase().includes(x))}a.keyActive==="true"&&(c=c.filter(x=>x.isActive)),a.keyActive==="false"&&(c=c.filter(x=>!x.isActive));const w=c.length,g=c.slice(a.keyPage*d,a.keyPage*d+d).map(x=>{const P=Math.round((x.utilization||0)*100);return`<tr>
        <td><div class="cell-primary">${t(x.name)}</div><div class="cell-sub">${t(x.keyPrefix)}</div></td>
        <td>${x.requests}</td>
        <td>${Ja(x.rateLimit)}</td>
        <td>
          <div>${T("common.percent",{n:P})}</div>
          <div class="usage-bar ${P>80?"warn":""}"><span style="width:${P}%"></span></div>
        </td>
        <td>${x.isActive?`<span class="badge success">${t(e("common.active"))}</span>`:`<span class="badge error">${t(e("common.revoked"))}</span>`}</td>
        <td class="muted">${x.lastUsedAt?ae(x.lastUsedAt):"—"}</td>
      </tr>`}).join(""),v=Ce({total:u,limit:d,offset:a.modelPage*d,idPrefix:"umodel"}),S=Ce({total:w,limit:d,offset:a.keyPage*d,idPrefix:"ukey"}),C=a.tab==="key"?"key":"model",L=Oe({title:e("usage.byModel"),hint:e("common.filterHint"),searchHtml:`<div class="data-filter-search"><label>${t(e("common.search"))}<input type="search" id="uf-model" value="${t(a.modelQ)}" placeholder="${t(e("chats.model"))}" /></label></div>`,gridHtml:""}),R=$e({headHtml:`
      ${N({field:"model",label:e("chats.model"),filterRef:a,sortByKey:"modelSortBy",sortDirKey:"modelSortDir"})}
      ${N({field:"requests",label:e("usage.requests"),filterRef:a,sortByKey:"modelSortBy",sortDirKey:"modelSortDir"})}`,bodyHtml:p,colSpan:2,emptyText:e("common.empty"),pagerHtml:v}),q=Oe({title:e("usage.byKey"),hint:e("common.filterHint"),searchHtml:`<div class="data-filter-search"><label>${t(e("common.search"))}<input type="search" id="uf-key" value="${t(a.keyQ)}" placeholder="${t(e("keys.name"))}" /></label></div>`,gridHtml:`<label>${t(e("keys.status"))}
      <select id="uf-active">
        <option value="">${t(e("common.all"))}</option>
        <option value="true" ${a.keyActive==="true"?"selected":""}>${t(e("common.active"))}</option>
        <option value="false" ${a.keyActive==="false"?"selected":""}>${t(e("common.revoked"))}</option>
      </select>
    </label>`}),j=$e({headHtml:`
      ${N({field:"name",label:e("keys.name"),filterRef:a})}
      ${N({field:"requests",label:e("usage.requests"),filterRef:a})}
      ${N({field:"rateLimit",label:e("usage.rateLimit"),filterRef:a})}
      ${N({field:"utilization",label:e("usage.util"),filterRef:a})}
      ${N({field:"isActive",label:e("keys.status"),filterRef:a})}
      ${N({field:"lastUsedAt",label:e("usage.lastUsed")||e("media.created"),filterRef:a})}`,bodyHtml:g,colSpan:6,emptyText:e("common.empty"),pagerHtml:S});document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("usage.title"))}</h2>
      <button class="btn secondary sm" id="btn-usage-refresh">${t(e("usage.refresh"))}</button>
    </div>
    ${ke([`${e("usage.window")}: ${ae(o.from)} → ${ae(o.to)} (${T("common.minutes",{n:o.windowMinutes})})`])}
    <div class="grid">
      <div class="card"><div class="label">${t(e("usage.requests"))}</div><div class="value">${n.requests??0}</div></div>
      <div class="card"><div class="label">${t(e("usage.success"))}</div><div class="value">${n.success??0}</div></div>
      <div class="card"><div class="label">${t(e("usage.errors"))}</div><div class="value">${n.errors??0}</div></div>
      <div class="card"><div class="label">${t(e("usage.errorRate"))}</div><div class="value">${Math.round((n.errorRate||0)*100)}%</div></div>
    </div>
    <div class="panel data-table-panel" style="margin-bottom:14px">
      <div class="panel-h"><strong>${t(e("usage.limits"))}</strong></div>
      <div class="panel-pad">
        <div class="grid">
          <div class="card"><div class="label">${t(e("usage.global"))}</div><div class="value value-sm">${i.globalMax} / ${i.globalWindowMs}ms</div></div>
          <div class="card"><div class="label">${t(e("usage.ipMax"))}</div><div class="value value-sm">${i.ipMax}</div></div>
          <div class="card"><div class="label">${t(e("usage.burst"))}</div><div class="value value-sm">${i.chatBurstMax}</div></div>
          <div class="card"><div class="label">${t(e("usage.block"))}</div><div class="value value-sm">${i.blockFailedAuthThreshold}</div></div>
          <div class="card"><div class="label">${t(e("usage.concurrent"))}</div><div class="value value-sm">${i.grokMaxConcurrent}</div></div>
        </div>
      </div>
    </div>

    <div class="usage-tabs-panel panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("usage.title"))}">
        <button type="button" role="tab" class="seg-tab ${C==="model"?"is-active":""}" data-usage-tab="model" aria-selected="${C==="model"}">
          ${t(e("usage.byModel"))}
          <span class="seg-tab-count">${u}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${C==="key"?"is-active":""}" data-usage-tab="key" aria-selected="${C==="key"}">
          ${t(e("usage.byKey"))}
          <span class="seg-tab-count">${w}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane" id="usage-tab-model" ${C==="model"?"":"hidden"}>
          ${L}
          ${R}
        </div>
        <div class="usage-tab-pane" id="usage-tab-key" ${C==="key"?"":"hidden"}>
          ${q}
          ${j}
        </div>
      </div>
    </div>
  `),de(),Ge(r.usageFilter,()=>ge().catch(h)),document.getElementById("btn-usage-refresh").onclick=()=>ge().catch(h),document.querySelectorAll("[data-usage-tab]").forEach(x=>{x.onclick=()=>{const P=x.dataset.usageTab==="key"?"key":"model";r.usageFilter.tab!==P&&(r.usageFilter.tab=P,ge().catch(h))}}),document.getElementById("umodel-prev")?.addEventListener("click",()=>{r.usageFilter.modelPage=Math.max(0,a.modelPage-1),ge().catch(h)}),document.getElementById("umodel-next")?.addEventListener("click",()=>{(a.modelPage+1)*d<u&&(r.usageFilter.modelPage+=1,ge().catch(h))}),document.getElementById("umodel-limit")?.addEventListener("change",x=>{r.usageFilter.pageSize=Number(x.target.value)||10,r.usageFilter.modelPage=0,ge().catch(h)}),document.getElementById("ukey-prev")?.addEventListener("click",()=>{r.usageFilter.keyPage=Math.max(0,a.keyPage-1),ge().catch(h)}),document.getElementById("ukey-next")?.addEventListener("click",()=>{(a.keyPage+1)*d<w&&(r.usageFilter.keyPage+=1,ge().catch(h))}),document.getElementById("ukey-limit")?.addEventListener("change",x=>{r.usageFilter.pageSize=Number(x.target.value)||10,r.usageFilter.keyPage=0,ge().catch(h)}),document.querySelectorAll("#usage-tab-model [data-filter-apply]").forEach(x=>{x.onclick=()=>{r.usageFilter.modelQ=document.getElementById("uf-model")?.value?.trim()||"",r.usageFilter.modelPage=0,ge().catch(h)}}),document.querySelectorAll("#usage-tab-model [data-filter-reset]").forEach(x=>{x.onclick=()=>{r.usageFilter.modelQ="",r.usageFilter.modelPage=0,ge().catch(h)}}),document.querySelectorAll("#usage-tab-key [data-filter-apply]").forEach(x=>{x.onclick=()=>{r.usageFilter.keyQ=document.getElementById("uf-key")?.value?.trim()||"",r.usageFilter.keyActive=document.getElementById("uf-active")?.value||"",r.usageFilter.keyPage=0,ge().catch(h)}}),document.querySelectorAll("#usage-tab-key [data-filter-reset]").forEach(x=>{x.onclick=()=>{r.usageFilter.keyQ="",r.usageFilter.keyActive="",r.usageFilter.keyPage=0,ge().catch(h)}})}function Ca(a){const s=a.versionStatus||(a.updateAvailable?"update_available":a.latest?"up_to_date":"unknown");return s==="update_available"?{badge:`<span class="badge warn" title="${t(e("system.statusHintUpdate"))}">${t(e("system.badgeUpdate"))}</span>`,hint:e("system.statusHintUpdate")}:s==="ahead"?{badge:`<span class="badge pending" title="${t(e("system.statusHintAhead"))}">${t(e("system.badgeAhead"))}</span>`,hint:e("system.statusHintAhead")}:s==="up_to_date"?{badge:`<span class="badge success" title="${t(e("system.statusHintOk"))}">${t(e("system.badgeOk"))}</span>`,hint:e("system.statusHintOk")}:{badge:`<span class="badge pending" title="${t(e("system.statusHintUnknown"))}">${t(e("system.badgeUnknown"))}</span>`,hint:e("system.statusHintUnknown")}}function Ws(a){return e(a==="git"?"system.channelGit":a==="npm-global"?"system.channelNpmGlobal":a==="npm-local"?"system.channelNpmLocal":"system.channelUnknown")}function zs(a){return a==="required"?e("system.levelRequired"):a==="recommended"?e("system.levelRecommended"):a==="optional"?e("system.levelOptional"):a==="bundled"?e("system.levelBundled"):a||"—"}function Vs(a){return a.installed?a.ok?`<span class="badge success">${t(e("system.softOk"))}</span>`:`<span class="badge warn">${t(e("system.softWarn"))}</span>`:a.level==="required"||a.level==="bundled"?`<span class="badge error">${t(e("system.softMissing"))}</span>`:`<span class="badge pending">${t(e("system.softMissing"))}</span>`}function La(a){return a==="up"?`<span class="badge success">${t(e("system.up"))}</span>`:`<span class="badge error">${t(e("system.down"))}</span>`}async function ot(){const{data:a}=await M("/system");if(r.page!=="system")return;const s=a.version||{},o=Ca(s),n=a.software||{checks:[],allRequiredOk:!0},i=n.checks||[],d=r.systemTab==="package"||r.systemTab==="env"||r.systemTab==="sessions"?r.systemTab:"software";r.systemTab=d;let l={data:[],total:0};try{const P=new URLSearchParams({limit:d==="sessions"?"50":"1",offset:"0"});d==="sessions"&&r.grokSessionQ&&P.set("q",r.grokSessionQ);const K=await M(`/grok/sessions?${P}`);l={data:K.data||[],total:K.total||0}}catch(P){l={data:[],total:0,error:P.message||String(P)}}const u=i.map(P=>`
      <tr>
        <td><div class="cell-primary">${t(P.name||P.id)}</div>${P.requiredVersion?`<div class="cell-sub">${t(P.requiredVersion)}</div>`:""}</td>
        <td>${t(zs(P.level))}</td>
        <td>${t(P.installed?e("system.yes"):e("system.no"))}${P.path?`<div class="cell-sub soft-path">${t(P.path)}</div>`:""}</td>
        <td><code class="cell-code">${t(P.version||"—")}</code></td>
        <td>${Vs(P)}</td>
        <td class="muted">${t(P.detail||"")}</td>
      </tr>`).join(""),m=n.allRequiredOk?`<span class="badge success">${t(e("system.allRequiredOk"))}</span>`:`<span class="badge error">${t(e("system.requiredMissing"))}</span>`,p=a.encryption&&a.encryption.ready,c=Ws(s.channel),w=s.installSource?`${c} · ${s.installSource}`:c,y=$e({headHtml:`
      <th>${t(e("system.softName"))}</th>
      <th>${t(e("system.softLevel"))}</th>
      <th>${t(e("system.softInstalled"))}</th>
      <th>${t(e("system.softVersion"))}</th>
      <th>${t(e("system.softStatus"))}</th>
      <th>${t(e("system.softDetail"))}</th>`,bodyHtml:u,colSpan:6,emptyText:e("common.empty")}),g=`
    <div class="grid system-kpi-grid" id="system-kpi-grid">
      <div class="card">
        <div class="label">${t(e("system.database"))}</div>
        <div class="value value-sm">${La(a.database)}</div>
        <div class="muted card-sub">${t(e("system.runtime"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("system.grokCli"))}</div>
        <div class="value value-sm">${La(a.grokCli)}</div>
        <div class="muted card-sub">${t(a.grokInspect?.grokVersion?`${a.grokInspect.grokVersion}${a.grokInspect.channel?` · ${a.grokInspect.channel}`:""}`:e("system.runtime"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("system.concurrency"))}</div>
        <div class="value value-sm">${a.concurrency?.active??0}<span class="dash-kpi-den">/${a.concurrency?.max??"—"}</span></div>
        <div class="muted card-sub">${t(e("system.concurrency"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("system.encryption"))}</div>
        <div class="value value-sm">${p?`<span class="badge success">${t(e("system.ready"))}</span>`:`<span class="badge error">${t(e("system.notReady"))}</span>`}</div>
        <div class="muted card-sub">${t(e("system.runtime"))}</div>
      </div>
    </div>`,v=a.grokInspect,S=v?[[e("system.grokVersion"),v.grokVersion||"—"],[e("system.inspectChannel"),v.channel||"—"],[e("system.inspectDefaultModel"),v.defaultModel||"—"],[e("system.inspectModels"),String(v.models?.length??0)],[e("system.inspectSkills"),String(v.skills??0)],[e("system.inspectMcp"),String(v.mcpServers??0)],[e("system.inspectPlugins"),String(v.plugins??0)],[e("system.inspectHooks"),String(v.hooks??0)]]:[],C=v?`
    <div class="panel system-inspect-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("system.grokInspect"))}</strong>
          <span class="muted panel-h-sub">${t(e("system.grokInspectHint"))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <div class="grid system-inspect-grid">
          ${S.map(([P,K])=>`
            <div class="card">
              <div class="label">${t(P)}</div>
              <div class="value value-sm">${t(K)}</div>
            </div>`).join("")}
        </div>
        ${v.error?`<div class="error-box">${t(v.error)}</div>`:""}
      </div>
    </div>`:"",L=`
    <div class="system-tab-toolbar">
      <span class="muted">${t(e("system.softwareHint"))}</span>
      ${m}
    </div>
    ${C}
    ${y}`,R=`
    <div class="panel data-table-panel system-package-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("system.selfUpdate"))}</strong>
          <span class="muted panel-h-sub">${t(o.hint)}</span>
        </div>
        ${o.badge}
      </div>
      <div class="panel-pad">
        <div class="grid">
          <div class="card"><div class="label">${t(e("system.current"))}</div><div class="value value-sm">${t(s.current||"-")} ${o.badge}</div></div>
          <div class="card"><div class="label">${t(e("system.npm"))}</div><div class="value value-sm">${t(s.latestNpm||"n/a")}</div></div>
          <div class="card"><div class="label">${t(e("system.github"))}</div><div class="value value-sm">${t(s.latestGithub||"n/a")}</div></div>
          <div class="card"><div class="label">${t(e("system.install"))}</div><div class="value value-sm">${t(w)}</div></div>
        </div>
        <pre id="update-log" class="pre" style="display:none;margin-top:12px"></pre>
      </div>
    </div>`,q=`
    <div class="panel data-table-panel system-env-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("system.envTitle"))}</strong>
          <span class="muted panel-h-sub">${t(e("system.envHint"))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <pre class="pre system-env-pre">${t(JSON.stringify({env:a.env,version:s},null,2))}</pre>
      </div>
    </div>`,j=(l.data||[]).map(P=>`
      <tr>
        <td><code class="cell-code">${t(P.id)}</code></td>
        <td><div class="cell-primary">${t(P.title||"—")}</div>
          <div class="cell-sub">${t(P.summary||"")}</div></td>
        <td class="muted">${t(P.cwd||"—")}</td>
        <td>${t((P.updatedAt||"").slice(0,19).replace("T"," ")||"—")}</td>
        <td>${P.messageCount!=null?P.messageCount:"—"}</td>
        <td><button type="button" class="btn danger sm" data-del-gsess="${t(P.id)}">${t(e("system.sessionDelete"))}</button></td>
      </tr>`).join(""),x=`
    <div class="system-tab-toolbar">
      <span class="muted">${t(e("system.sessionsHint"))}</span>
      <form id="gsess-search" class="inline-form">
        <input type="search" id="gsess-q" value="${t(r.grokSessionQ||"")}" placeholder="${t(e("system.sessionsSearch"))}" />
        <button type="submit" class="btn secondary sm">${t(e("common.search")||"Search")}</button>
      </form>
    </div>
    ${l.error?`<div class="error-box">${t(l.error)}</div>`:""}
    ${$e({headHtml:`
        <th>${t(e("system.sessionId"))}</th>
        <th>${t(e("system.sessionTitle"))}</th>
        <th>${t(e("system.sessionCwd"))}</th>
        <th>${t(e("system.sessionUpdated"))}</th>
        <th>${t(e("chats.msgs")||"#")}</th>
        <th></th>`,bodyHtml:j,colSpan:6,emptyText:e("common.empty")})}
    <div class="muted">${t(String(l.total||0))}</div>`;document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("system.title"))}</h2>
      <div class="toolbar">
        <button class="btn secondary sm" id="btn-check-update" title="${t(e("system.selfHint"))}">${t(e("system.checkUpdate"))}</button>
        <button class="btn sm" id="btn-one-click-update" title="${t(e("system.confirmUpdate"))}">${t(e("system.oneClick"))}</button>
      </div>
    </div>
    ${ke([e("system.selfHint")])}
    ${g}

    <div class="usage-tabs-panel panel system-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("system.title"))}">
        <button type="button" role="tab" class="seg-tab ${d==="software"?"is-active":""}" data-system-tab="software" aria-selected="${d==="software"}">
          ${t(e("system.tabSoftware"))}
          <span class="seg-tab-count">${i.length}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${d==="package"?"is-active":""}" data-system-tab="package" aria-selected="${d==="package"}">
          ${t(e("system.tabPackage"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${d==="env"?"is-active":""}" data-system-tab="env" aria-selected="${d==="env"}">
          ${t(e("system.tabEnv"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${d==="sessions"?"is-active":""}" data-system-tab="sessions" aria-selected="${d==="sessions"}">
          ${t(e("system.tabSessions"))}
          <span class="seg-tab-count">${l.total}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane system-tab-pane-software" id="system-tab-software" ${d==="software"?"":"hidden"}>
          ${L}
        </div>
        <div class="usage-tab-pane system-tab-pane-package" id="system-tab-package" ${d==="package"?"":"hidden"}>
          ${R}
        </div>
        <div class="usage-tab-pane system-tab-pane-env" id="system-tab-env" ${d==="env"?"":"hidden"}>
          ${q}
        </div>
        <div class="usage-tab-pane system-tab-pane-sessions" id="system-tab-sessions" ${d==="sessions"?"":"hidden"}>
          ${x}
        </div>
      </div>
    </div>
  `),de(),document.getElementById("gsess-search")?.addEventListener("submit",P=>{P.preventDefault(),r.grokSessionQ=document.getElementById("gsess-q")?.value||"",ot().catch(h)}),document.querySelectorAll("[data-del-gsess]").forEach(P=>{P.addEventListener("click",async()=>{const K=P.getAttribute("data-del-gsess");if(!(!K||!await ee({title:e("system.sessionDelete"),message:e("system.sessionDeleteConfirm").replace("{id}",K)})))try{await M(`/grok/sessions/${encodeURIComponent(K)}`,{method:"DELETE"}),await ot()}catch(f){h(f)}})}),document.querySelectorAll("[data-system-tab]").forEach(P=>{P.addEventListener("click",()=>{const K=P.getAttribute("data-system-tab")||"software",A=K==="package"||K==="env"||K==="software"||K==="sessions"?K:"software";r.systemTab!==A&&(r.systemTab=A,ot().catch(h))})}),document.getElementById("btn-check-update").onclick=async()=>{try{const K=(await M("/system/update-check")).data||{},A=Ca(K);await be({title:e("system.checkResult"),message:`${e("system.current")}: ${K.current||"?"}
${e("system.npm")}: ${K.latestNpm||"n/a"}
${e("system.github")}: ${K.latestGithub||"n/a"}
${A.hint}`}),r.systemTab="package",ot().catch(h)}catch(P){h(P)}},document.getElementById("btn-one-click-update").onclick=async()=>{if(!await ee({message:e("system.confirmUpdate"),variant:"danger",confirmText:e("system.oneClick")}))return;r.systemTab!=="package"&&(r.systemTab="package",await ot());const P=document.getElementById("update-log");try{const K=document.getElementById("btn-one-click-update");K&&(K.disabled=!0);const A=await M("/system/update",{method:"POST",body:JSON.stringify({restart:!0})});P&&(P.style.display="block",P.textContent=A.data&&(A.data.message||JSON.stringify(A.data,null,2))||e("system.scheduled")),await be(A.data&&A.data.message||e("system.scheduled"))}catch(K){h(K)}}}function da(a){if(!a)return"—";const s=`ddos.sources.${a}`,o=e(s);return o===s?a:o}function Ae(a){return Math.max(1,Math.round(Number(a||0)/1e3))}function Pe(a){return Math.max(1,Math.round(Number(a||0)/6e4))}function ut(a){return Math.max(1e3,Math.round(Number(a||0)*1e3))}function mt(a){return Math.max(1e3,Math.round(Number(a||0)*6e4))}function J(a,s){const o=Number(document.getElementById(a)?.value);return Number.isFinite(o)?o:s}function at(a){return document.getElementById(a)?.checked===!0}function ra(){const a=(document.getElementById("dp-whitelist")?.value||"").split(/[\n,]+/).map(n=>n.trim()).filter(Boolean),s=(document.getElementById("dp-trustedProxies")?.value||"").split(/[\n,]+/).map(n=>n.trim()).filter(Boolean);return{autoBanEnabled:document.getElementById("ddos-master-autoban")?Xe("ddos-master-autoban"):at("dp-autoBanEnabled")||document.getElementById("dp-autoBanEnabled")?.value==="1",rateLimitWindowMs:ut(J("dp-rateWindowSec",60)),rateLimitMax:Math.floor(J("dp-rateMaxKey",120)),rateLimitIpMax:Math.floor(J("dp-rateMaxIp",60)),chatBurstWindowMs:ut(J("dp-burstWindowSec",10)),chatBurstMax:Math.floor(J("dp-burstMax",20)),autoAuthEnabled:at("dp-autoAuthEnabled"),failedAuthThreshold:Math.floor(J("dp-authThreshold",20)),failedAuthWindowMs:ut(J("dp-authWindowSec",300)),authBanDurationMs:mt(J("dp-authBanMin",10)),autoRateEnabled:at("dp-autoRateEnabled"),rateHitThreshold:Math.floor(J("dp-rateHitThreshold",30)),rateHitWindowMs:ut(J("dp-rateHitWindowSec",60)),rateBanDurationMs:mt(J("dp-rateBanMin",15)),autoConnEnabled:at("dp-autoConnEnabled"),maxConcurrentPerIp:Math.floor(J("dp-maxConcurrent",20)),connBanDurationMs:mt(J("dp-connBanMin",10)),autoVelocityEnabled:at("dp-autoVelocityEnabled"),velocityMaxRequests:Math.floor(J("dp-velocityMax",200)),velocityWindowMs:ut(J("dp-velocityWindowSec",60)),velocityBanDurationMs:mt(J("dp-velocityBanMin",10)),escalateEnabled:at("dp-escalateEnabled"),escalateAfterBans:Math.floor(J("dp-escalateAfter",3)),escalateDurationMs:mt(J("dp-escalateMin",1440)),whitelist:a,proxyTrustHops:Math.max(0,Math.min(10,Math.floor(J("dp-proxyTrustHops",1)))),proxyIpSource:document.getElementById("dp-proxyIpSource")?.value||"auto",trustedProxies:s.length?s:["127.0.0.1","::1"]}}const Js=["autoBanEnabled","rateLimitWindowMs","rateLimitMax","rateLimitIpMax","chatBurstWindowMs","chatBurstMax","autoAuthEnabled","failedAuthThreshold","failedAuthWindowMs","authBanDurationMs","autoRateEnabled","rateHitThreshold","rateHitWindowMs","rateBanDurationMs","autoConnEnabled","maxConcurrentPerIp","connBanDurationMs","autoVelocityEnabled","velocityMaxRequests","velocityWindowMs","velocityBanDurationMs","escalateEnabled","escalateAfterBans","escalateDurationMs"];function Ha(a){if(!a)return{};const s={};for(const o of Js){const n=a[o];typeof n=="boolean"?s[o]=n:typeof n=="number"&&Number.isFinite(n)?s[o]=Math.round(n):n==null?s[o]=null:s[o]=n}return s}function ds(a,s){return JSON.stringify(Ha(a))===JSON.stringify(Ha(s))}function ca(a){const s=r._ddosPresetsCache;if(!s||!a)return"custom";for(const o of["relaxed","balanced","strict"])if(s[o]&&ds(a,s[o]))return o;return"custom"}function Dt(a){return e(a==="relaxed"?"ddos.presetRelaxed":a==="balanced"?"ddos.presetBalanced":a==="strict"?"ddos.presetStrict":"ddos.presetCustom")}function rs(a,{unsaved:s=!1}={}){const o=Dt(a),n=a==="relaxed"?"relaxed":a==="balanced"?"balanced":a==="strict"?"strict":"custom",i=s?T("ddos.presetFormLabel",{name:o}):T("ddos.presetActiveLabel",{name:o});return`<span class="ddos-preset-badge is-${n}" id="ddos-preset-badge" title="${t(i)}">${t(i)}</span>`}function _e(){if(!document.getElementById("ddos-policy-panel"))return;let a;try{a=ra()}catch{return}const s=ca(a),o=ca(r._ddosPolicyCache||a),n=!ds(a,r._ddosPolicyCache||a);document.querySelectorAll("[data-ddos-preset]").forEach(u=>{const m=u.dataset.ddosPreset,p=m===s,c=m===o;u.classList.toggle("is-active",p),u.classList.toggle("is-saved",c&&!p),u.setAttribute("aria-pressed",p?"true":"false");const w=e(m==="relaxed"?"ddos.presetRelaxed":m==="balanced"?"ddos.presetBalanced":"ddos.presetStrict");p&&c?u.innerHTML=`${t(w)} <span class="preset-tag">${t(e("ddos.presetTagActive"))}</span>`:p&&n?u.innerHTML=`${t(w)} <span class="preset-tag preset-tag--draft">${t(e("ddos.presetTagDraft"))}</span>`:c?u.innerHTML=`${t(w)} <span class="preset-tag preset-tag--saved">${t(e("ddos.presetTagSaved"))}</span>`:u.textContent=w});const i=document.getElementById("ddos-preset-badge");if(i){const u=rs(s,{unsaved:n&&s!==o});i.outerHTML=u}const d=document.getElementById("ddos-preset-custom");d&&(d.classList.toggle("is-active",s==="custom"),d.setAttribute("aria-pressed",s==="custom"?"true":"false"));const l=document.getElementById("ddos-preset-hint");l&&(n&&s!==o?(l.textContent=T("ddos.presetUnsavedHint",{form:Dt(s),saved:Dt(o)}),l.hidden=!1):s==="custom"?(l.textContent=e("ddos.presetCustomHint"),l.hidden=!1):(l.textContent=T("ddos.presetActiveHint",{name:Dt(s)}),l.hidden=!1))}function Xt(a){if(!a||!document.getElementById("dp-autoBanEnabled"))return;const s=(n,i)=>{const d=document.getElementById(n);d&&(d.type==="checkbox"?d.checked=!!i:d.value=i)},o=document.getElementById("dp-autoBanEnabled");o&&(o.type==="checkbox"?o.checked=!!a.autoBanEnabled:o.value=a.autoBanEnabled?"1":"0"),Ye("ddos-master-autoban",!!a.autoBanEnabled,e("ddos.masterOn"),e("ddos.masterOff")),et("ddos-root",!a.autoBanEnabled),Ze("ddos-disabled-banner",!a.autoBanEnabled),s("dp-rateWindowSec",Ae(a.rateLimitWindowMs)),s("dp-rateMaxKey",a.rateLimitMax),s("dp-rateMaxIp",a.rateLimitIpMax),s("dp-burstWindowSec",Ae(a.chatBurstWindowMs)),s("dp-burstMax",a.chatBurstMax),s("dp-autoAuthEnabled",a.autoAuthEnabled),s("dp-authThreshold",a.failedAuthThreshold),s("dp-authWindowSec",Ae(a.failedAuthWindowMs)),s("dp-authBanMin",Pe(a.authBanDurationMs)),s("dp-autoRateEnabled",a.autoRateEnabled),s("dp-rateHitThreshold",a.rateHitThreshold),s("dp-rateHitWindowSec",Ae(a.rateHitWindowMs)),s("dp-rateBanMin",Pe(a.rateBanDurationMs)),s("dp-autoConnEnabled",a.autoConnEnabled),s("dp-maxConcurrent",a.maxConcurrentPerIp),s("dp-connBanMin",Pe(a.connBanDurationMs)),s("dp-autoVelocityEnabled",a.autoVelocityEnabled),s("dp-velocityMax",a.velocityMaxRequests),s("dp-velocityWindowSec",Ae(a.velocityWindowMs)),s("dp-velocityBanMin",Pe(a.velocityBanDurationMs)),s("dp-escalateEnabled",a.escalateEnabled),s("dp-escalateAfter",a.escalateAfterBans),s("dp-escalateMin",Pe(a.escalateDurationMs)),s("dp-whitelist",(a.whitelist||[]).join(`
`)),s("dp-proxyTrustHops",a.proxyTrustHops??1),s("dp-proxyIpSource",a.proxyIpSource||"auto"),s("dp-trustedProxies",(a.trustedProxies&&a.trustedProxies.length?a.trustedProxies:["127.0.0.1","::1"]).join(`
`)),Ea(a.autoBanEnabled),_e()}function Ea(a){const s=document.getElementById("ddos-auto-badge");s&&(s.className=`badge ${a?"success":"pending"}`,s.textContent=e(a?"ddos.autoOn":"ddos.autoOff"))}function Xs(a){const s=(d,l)=>`<label class="data-filter-check policy-enable"><input type="checkbox" id="${d}" ${l?"checked":""} /> <span>${t(e("ddos.enableRule"))}</span></label>`,o=(d,l,u,m="1")=>`<label>${t(d)}<input type="number" id="${l}" value="${t(String(u))}" min="1" step="${m}" /></label>`,n=ca(a),i=rs(n);return`
    <div class="panel data-table-panel ddos-policy-panel" id="ddos-policy-panel">
      <div class="panel-h">
        <div>
          <strong>${t(e("ddos.policyTitle"))}</strong>
          <span class="muted">${t(e("ddos.policyHint"))}</span>
        </div>
        <div class="ddos-header-badges">
          ${i}
          <span class="badge ${a.autoBanEnabled?"success":"pending"}" id="ddos-auto-badge">${t(a.autoBanEnabled?e("ddos.autoOn"):e("ddos.autoOff"))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <div class="ddos-preset-block">
          <div class="ddos-preset-block-h">
            <strong>${t(e("ddos.presetTitle"))}</strong>
            <span class="muted">${t(e("ddos.presetHint"))}</span>
          </div>
          <div class="ddos-presets" role="group" aria-label="${t(e("ddos.presetTitle"))}">
            <button type="button" class="ddos-preset-btn" data-ddos-preset="relaxed" aria-pressed="false">${t(e("ddos.presetRelaxed"))}</button>
            <button type="button" class="ddos-preset-btn" data-ddos-preset="balanced" aria-pressed="false">${t(e("ddos.presetBalanced"))}</button>
            <button type="button" class="ddos-preset-btn" data-ddos-preset="strict" aria-pressed="false">${t(e("ddos.presetStrict"))}</button>
            <button type="button" class="ddos-preset-btn ddos-preset-btn--custom" id="ddos-preset-custom" disabled aria-pressed="false">${t(e("ddos.presetCustom"))}</button>
          </div>
          <p class="ddos-preset-hint" id="ddos-preset-hint"></p>
        </div>
        <p class="muted policy-master-hint">${t(e("ddos.autoBanMasterHint"))}</p>
        <input type="hidden" id="dp-autoBanEnabled" value="${a.autoBanEnabled?"1":"0"}" />

        <div class="policy-section">
          <h4>${t(e("ddos.sectionProxy"))}</h4>
          <p class="muted" style="margin:0 0 10px">${t(e("ddos.proxyHint"))}</p>
          <div class="form-grid">
            <label>${t(e("ddos.proxyTrustHops"))}
              <input type="number" id="dp-proxyTrustHops" value="${t(String(a.proxyTrustHops??1))}" min="0" max="10" step="1" />
              <span class="field-hint">${t(e("ddos.proxyTrustHopsHint"))}</span>
            </label>
            <label>${t(e("ddos.proxyIpSource"))}
              <select id="dp-proxyIpSource">
                <option value="auto" ${(a.proxyIpSource||"auto")==="auto"?"selected":""}>${t(e("ddos.proxySrcAuto"))}</option>
                <option value="cloudflare" ${a.proxyIpSource==="cloudflare"?"selected":""}>${t(e("ddos.proxySrcCf"))}</option>
                <option value="nginx" ${a.proxyIpSource==="nginx"?"selected":""}>${t(e("ddos.proxySrcNginx"))}</option>
                <option value="x-forwarded-for" ${a.proxyIpSource==="x-forwarded-for"?"selected":""}>${t(e("ddos.proxySrcXff"))}</option>
                <option value="socket" ${a.proxyIpSource==="socket"?"selected":""}>${t(e("ddos.proxySrcSocket"))}</option>
              </select>
              <span class="field-hint">${t(e("ddos.proxyIpSourceHint"))}</span>
            </label>
            <label class="full">${t(e("ddos.trustedProxies"))}
              <textarea id="dp-trustedProxies" rows="3" class="policy-whitelist">${t((a.trustedProxies&&a.trustedProxies.length?a.trustedProxies:["127.0.0.1","::1"]).join(`
`))}</textarea>
              <span class="field-hint">${t(e("ddos.trustedProxiesHint"))}</span>
            </label>
          </div>
        </div>

        <div class="policy-section">
          <h4>${t(e("ddos.sectionLimits"))}</h4>
          <div class="form-grid">
            ${o(e("ddos.rateWindow"),"dp-rateWindowSec",Ae(a.rateLimitWindowMs))}
            ${o(e("ddos.rateMaxKey"),"dp-rateMaxKey",a.rateLimitMax)}
            ${o(e("ddos.rateMaxIp"),"dp-rateMaxIp",a.rateLimitIpMax)}
            ${o(e("ddos.burstWindow"),"dp-burstWindowSec",Ae(a.chatBurstWindowMs))}
            ${o(e("ddos.burstMax"),"dp-burstMax",a.chatBurstMax)}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionAuth"))}</h4>${s("dp-autoAuthEnabled",a.autoAuthEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.threshold"),"dp-authThreshold",a.failedAuthThreshold)}
            ${o(e("ddos.windowSec"),"dp-authWindowSec",Ae(a.failedAuthWindowMs))}
            ${o(e("ddos.banMin"),"dp-authBanMin",Pe(a.authBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionRate"))}</h4>${s("dp-autoRateEnabled",a.autoRateEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.threshold"),"dp-rateHitThreshold",a.rateHitThreshold)}
            ${o(e("ddos.windowSec"),"dp-rateHitWindowSec",Ae(a.rateHitWindowMs))}
            ${o(e("ddos.banMin"),"dp-rateBanMin",Pe(a.rateBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionConn"))}</h4>${s("dp-autoConnEnabled",a.autoConnEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.maxConcurrent"),"dp-maxConcurrent",a.maxConcurrentPerIp)}
            ${o(e("ddos.banMin"),"dp-connBanMin",Pe(a.connBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionVelocity"))}</h4>${s("dp-autoVelocityEnabled",a.autoVelocityEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.velocityMax"),"dp-velocityMax",a.velocityMaxRequests)}
            ${o(e("ddos.windowSec"),"dp-velocityWindowSec",Ae(a.velocityWindowMs))}
            ${o(e("ddos.banMin"),"dp-velocityBanMin",Pe(a.velocityBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionEscalate"))}</h4>${s("dp-escalateEnabled",a.escalateEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.escalateAfter"),"dp-escalateAfter",a.escalateAfterBans)}
            ${o(e("ddos.escalateMin"),"dp-escalateMin",Pe(a.escalateDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <h4>${t(e("ddos.sectionWhitelist"))}</h4>
          <p class="muted" style="margin:0 0 8px">${t(e("ddos.whitelistHint"))}</p>
          <textarea id="dp-whitelist" rows="4" class="policy-whitelist">${t((a.whitelist||[]).join(`
`))}</textarea>
        </div>

        <div class="ddos-policy-actions">
          <button type="button" class="btn secondary sm" id="dp-reset">${t(e("ddos.resetPolicy"))}</button>
          <button type="button" class="btn sm" id="dp-save">${t(e("ddos.savePolicy"))}</button>
        </div>
      </div>
    </div>`}function Ys(a){return a?.length?a.map(s=>`
    <tr>
      <td>${ae(s.at)}</td>
      <td class="cell-primary">${t(s.ip)}</td>
      <td><span class="badge ${s.escalated?"warn":"pending"}">${t(da(s.source))}</span></td>
      <td class="muted" style="max-width:280px;word-break:break-word">${t(s.reason||"")}</td>
      <td>${t(Pe(s.durationMs))} min</td>
    </tr>`).join(""):`<tr class="empty-row"><td colspan="5"><div class="data-empty"><strong>${t(e("ddos.emptyEvents"))}</strong></div></td></tr>`}async function ne(a={}){const s=!!a.soft&&document.getElementById("ddos-root"),o=document.querySelector(".main"),n=o?o.scrollTop:0;We&&(clearInterval(We),We=null);const i=r.ddosFilter;i.liveSortBy||(i.liveSortBy="startedAt"),i.liveSortDir||(i.liveSortDir="desc"),i.banSortBy||(i.banSortBy="createdAt"),i.banSortDir||(i.banSortDir="desc"),i.eventSortBy||(i.eventSortBy="at"),i.eventSortDir||(i.eventSortDir="desc");const d=new URLSearchParams;Ee(d,i,"liveSortBy","liveSortDir");const l=new URLSearchParams;Ee(l,i,"banSortBy","banSortDir");const u=new URLSearchParams;Ee(u,i,"eventSortBy","eventSortDir");const m=[M(`/ddos/connections?${d}`),M(`/ddos/blacklist?${l}`),M("/ddos/stats"),M(`/ddos/events?${u}`)];s||m.push(M("/ddos/policy"));const p=await Promise.all(m),[c,w,y,g]=p,v=s?null:p[4],S=i.pageSize||15;let C=c.data?.active||[],L=c.data?.recent||[],R=w.data||[];const q=y.data||{},j=g.data||[],x=v?.data||r._ddosPolicyCache||null,P=v?.presets||r._ddosPresetsCache||null;x&&(r._ddosPolicyCache=x),P&&(r._ddosPresetsCache=P);const K=(r._ddosPolicyCache?.whitelist||[]).map(String);if(i.liveQ.trim()){const D=i.liveQ.trim().toLowerCase(),E=B=>[B.ip,B.path,B.method,B.apiKeyName,B.apiKeyPrefix].filter(Boolean).some(Y=>String(Y).toLowerCase().includes(D));C=C.filter(E),L=L.filter(E)}if(i.banQ.trim()){const D=i.banQ.trim().toLowerCase();R=R.filter(E=>String(E.ip||"").toLowerCase().includes(D)||String(E.reason||"").toLowerCase().includes(D))}i.banSource&&(R=R.filter(D=>D.source===i.banSource));const A=C.slice(i.livePage*S,i.livePage*S+S),f=R.slice(i.banPage*S,i.banPage*S+S),$=A.map(D=>`
    <tr>
      <td class="cell-primary">${t(D.ip)}</td>
      <td>${t(D.method)}</td>
      <td class="muted" style="max-width:220px;word-break:break-all">${t(D.path)}</td>
      <td>${t(D.apiKeyName||D.apiKeyPrefix||"—")}</td>
      <td><span class="badge pending">${t(e("status.active"))}</span></td>
      <td>${kt(Date.now()-D.startedAt)}</td>
      <td><div class="row-actions"><button class="btn danger sm" data-ban="${t(D.ip)}">${t(e("ddos.ban"))}</button></div></td>
    </tr>`).join(""),U=L.slice(0,40).map(D=>`
    <tr>
      <td class="cell-primary">${t(D.ip)}</td>
      <td>${t(D.method)} ${t(D.path)}</td>
      <td>${D.statusCode??"—"}</td>
      <td>${kt(D.durationMs)}</td>
      <td><div class="row-actions"><button class="btn danger sm" data-ban="${t(D.ip)}">${t(e("ddos.ban"))}</button></div></td>
    </tr>`).join(""),b=f.map(D=>`
    <tr>
      <td class="cell-primary">${t(D.ip)}</td>
      <td>${t(D.reason||"—")}</td>
      <td><span class="badge pending">${t(da(D.source))}</span></td>
      <td>${D.expiresAt?ae(D.expiresAt):t(e("ddos.permanent"))}</td>
      <td><div class="row-actions"><button class="btn secondary sm" data-unban="${t(D.ip)}">${t(e("ddos.unban"))}</button></div></td>
    </tr>`).join(""),k=(q.topIps||[]).map(D=>`<tr><td class="cell-primary">${t(D.ip)}</td><td>${D.requests}</td>
      <td><div class="row-actions"><button class="btn danger sm" data-ban="${t(D.ip)}">${t(e("ddos.ban"))}</button></div></td></tr>`).join(""),I=Ys(j),F=`<tr class="empty-row"><td colspan="7"><div class="data-empty"><strong>${t(e("ddos.emptyLive"))}</strong></div></td></tr>`,Z=`<tr class="empty-row"><td colspan="5"><div class="data-empty"><strong>${t(e("common.empty"))}</strong></div></td></tr>`,z=`<tr class="empty-row"><td colspan="5"><div class="data-empty"><strong>${t(e("ddos.emptyBan"))}</strong></div></td></tr>`,G=`<tr class="empty-row"><td colspan="3"><div class="data-empty"><strong>${t(e("common.empty"))}</strong></div></td></tr>`,W=["","manual","auto-auth","auto-rate","auto-conn","auto-velocity","auto-escalate"].map(D=>D?`<option value="${D}" ${i.banSource===D?"selected":""}>${t(da(D))}</option>`:`<option value="">${t(e("common.all"))}</option>`).join("");if(s){const D=(B,Y)=>{const se=document.getElementById(B);se&&(se.innerHTML=Y)},E=(B,Y)=>{const se=document.getElementById(B);se&&(se.textContent=Y)};E("ddos-stat-active",String(q.activeConnections??C.length)),E("ddos-stat-rate",String(q.rateLimitedHits??0)),E("ddos-stat-blocked",String(q.blockedHits??0)),E("ddos-stat-ban",String(R.length)),E("ddos-stat-auto",String(q.autoBanTotal??0)),E("ddos-tab-count-live",String(C.length)),E("ddos-tab-count-ban",String(R.length)),E("ddos-tab-count-events",String(j.length)),D("ddos-live-body",$||F),D("ddos-recent-body",U||Z),D("ddos-ban-body",b||z),D("ddos-top-body",k||G),D("ddos-events-body",I),wa(document),q.policySummary&&Ea(!!q.policySummary.autoBanEnabled),Da(),o&&(o.scrollTop=n)}else{const D=x||{autoBanEnabled:!0,rateLimitWindowMs:6e4,rateLimitMax:120,rateLimitIpMax:60,chatBurstWindowMs:1e4,chatBurstMax:20,autoAuthEnabled:!0,failedAuthThreshold:20,failedAuthWindowMs:3e5,authBanDurationMs:6e5,autoRateEnabled:!0,rateHitThreshold:30,rateHitWindowMs:6e4,rateBanDurationMs:9e5,autoConnEnabled:!0,maxConcurrentPerIp:20,connBanDurationMs:6e5,autoVelocityEnabled:!0,velocityMaxRequests:200,velocityWindowMs:6e4,velocityBanDurationMs:6e5,escalateEnabled:!0,escalateAfterBans:3,escalateDurationMs:864e5,whitelist:["127.0.0.1","::1"],proxyTrustHops:1,proxyIpSource:"auto",trustedProxies:["127.0.0.1","::1"]},E=!!D.autoBanEnabled,B=i.tab==="live"||i.tab==="blacklist"||i.tab==="events"||i.tab==="policy"?i.tab:"policy";r.ddosFilter.tab=B;const Y=`
    <div class="grid ddos-kpi-grid">
      <div class="card"><div class="label">${t(e("ddos.activeConn"))}</div><div class="value value-sm" id="ddos-stat-active">${q.activeConnections??C.length}</div><div class="muted card-sub">${t(e("ddos.live"))}</div></div>
      <div class="card"><div class="label">${t(e("ddos.rateHits"))}</div><div class="value value-sm" id="ddos-stat-rate">${q.rateLimitedHits??0}</div><div class="muted card-sub">${t(e("ddos.stats"))}</div></div>
      <div class="card"><div class="label">${t(e("ddos.blockedHits"))}</div><div class="value value-sm" id="ddos-stat-blocked">${q.blockedHits??0}</div><div class="muted card-sub">${t(e("ddos.stats"))}</div></div>
      <div class="card"><div class="label">${t(e("ddos.blacklist"))}</div><div class="value value-sm" id="ddos-stat-ban">${R.length}</div><div class="muted card-sub">${t(e("ddos.tabBlacklist"))}</div></div>
      <div class="card"><div class="label">${t(e("ddos.autoBans"))}</div><div class="value value-sm" id="ddos-stat-auto">${q.autoBanTotal??0}</div><div class="muted card-sub">${t(e("ddos.tabEvents"))}</div></div>
    </div>`,se=Xs(D),ue=`
    <div class="panel data-filter-panel ddos-filter-panel">
      <div class="panel-h"><strong>${t(e("common.filterTitle"))}</strong></div>
      <div class="data-filter">
        <div class="data-filter-grid">
          <label class="full">${t(e("ddos.live"))} / ${t(e("ddos.recent"))}
            <input type="search" id="ddos-live-q" value="${t(i.liveQ)}" placeholder="IP / path / key" />
          </label>
        </div>
        <div class="data-filter-actions">
          <button type="button" class="btn secondary sm" id="ddos-live-filter-reset">${t(e("common.reset"))}</button>
          <button type="button" class="btn sm" id="ddos-live-filter-apply">${t(e("common.apply"))}</button>
        </div>
      </div>
    </div>
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${t(e("ddos.live"))}</strong>
        <span class="muted">${t(T("common.pagerTotal",{n:C.length}))}</span>
      </div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          ${N({field:"ip",label:e("ddos.ip"),filterRef:i,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${N({field:"method",label:e("ddos.method"),filterRef:i,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${N({field:"path",label:e("ddos.path"),filterRef:i,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          <th>${t(e("ddos.key"))}</th>
          <th>${t(e("ddos.state"))}</th>
          ${N({field:"durationMs",label:e("ddos.duration"),filterRef:i,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          <th>${t(e("common.actions"))}</th>
        </tr></thead>
        <tbody id="ddos-live-body">${$||F}</tbody>
      </table>
      </div>
      ${Ce({total:C.length,limit:S,offset:i.livePage*S,idPrefix:"ddoslive"})}
    </div>
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${t(e("ddos.recent"))}</strong></div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          ${N({field:"ip",label:e("ddos.ip"),filterRef:i,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${N({field:"path",label:e("ddos.path"),filterRef:i,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${N({field:"statusCode",label:e("common.httpStatus"),filterRef:i,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${N({field:"durationMs",label:e("ddos.duration"),filterRef:i,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          <th>${t(e("common.actions"))}</th>
        </tr></thead>
        <tbody id="ddos-recent-body">${U||Z}</tbody>
      </table>
      </div>
    </div>`,fe=`
    <div class="panel data-filter-panel ddos-filter-panel">
      <div class="panel-h"><strong>${t(e("common.filterTitle"))}</strong></div>
      <div class="data-filter">
        <div class="data-filter-grid">
          <label>${t(e("ddos.blacklist"))}
            <input type="search" id="ddos-ban-q" value="${t(i.banQ)}" placeholder="IP / reason" />
          </label>
          <label>${t(e("ddos.source"))}
            <select id="ddos-ban-source">${W}</select>
          </label>
        </div>
        <div class="data-filter-actions">
          <button type="button" class="btn secondary sm" id="ddos-ban-filter-reset">${t(e("common.reset"))}</button>
          <button type="button" class="btn sm" id="ddos-ban-filter-apply">${t(e("common.apply"))}</button>
        </div>
      </div>
    </div>
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${t(e("ddos.blacklist"))}</strong>
        <span class="muted">${t(T("common.pagerTotal",{n:R.length}))}</span>
      </div>
      <div class="filter-bar">
        <label>${t(e("ddos.ip"))}<input id="ban-ip" placeholder="${t(e("ddos.ipPlaceholder"))}" /></label>
        <label>${t(e("ddos.reason"))}<input id="ban-reason" placeholder="${t(e("ddos.reasonPh"))}" class="wide" /></label>
        <label>${t(e("ddos.ttl"))}
          <select id="ban-ttl">
            <option value="">${t(e("ddos.ttlPerm"))}</option>
            <option value="3600">${t(e("ddos.ttl1h"))}</option>
            <option value="86400">${t(e("ddos.ttl24h"))}</option>
            <option value="604800">${t(e("ddos.ttl7d"))}</option>
          </select>
        </label>
        <button class="btn sm" id="ban-add">${t(e("ddos.addBan"))}</button>
      </div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          ${N({field:"ip",label:e("ddos.ip"),filterRef:i,sortByKey:"banSortBy",sortDirKey:"banSortDir"})}
          ${N({field:"reason",label:e("ddos.reason"),filterRef:i,sortByKey:"banSortBy",sortDirKey:"banSortDir"})}
          ${N({field:"source",label:e("ddos.source"),filterRef:i,sortByKey:"banSortBy",sortDirKey:"banSortDir"})}
          ${N({field:"expiresAt",label:e("ddos.expires"),filterRef:i,sortByKey:"banSortBy",sortDirKey:"banSortDir"})}
          <th>${t(e("common.actions"))}</th>
        </tr></thead>
        <tbody id="ddos-ban-body">${b||z}</tbody>
      </table>
      </div>
      ${Ce({total:R.length,limit:S,offset:i.banPage*S,idPrefix:"ddosban"})}
    </div>`,oe=`
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${t(e("ddos.eventsTitle"))}</strong>
        <span class="muted">${t(T("common.pagerTotal",{n:j.length}))}</span>
      </div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          ${N({field:"at",label:e("ddos.eventTime"),filterRef:i,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
          ${N({field:"ip",label:e("ddos.ip"),filterRef:i,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
          ${N({field:"source",label:e("ddos.eventSource"),filterRef:i,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
          ${N({field:"reason",label:e("ddos.reason"),filterRef:i,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
          ${N({field:"durationMs",label:e("ddos.eventDuration"),filterRef:i,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
        </tr></thead>
        <tbody id="ddos-events-body">${I}</tbody>
      </table>
      </div>
    </div>
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${t(e("ddos.topIps"))}</strong></div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>${t(e("ddos.ip"))}</th><th>${t(e("usage.requests"))}</th><th>${t(e("common.actions"))}</th></tr></thead>
        <tbody id="ddos-top-body">${k||G}</tbody>
      </table>
      </div>
    </div>`;document.getElementById("app").innerHTML=le(`
    <div id="ddos-root" class="${E?"":"is-feature-off"}">
    <div class="topbar">
      <h2>${t(e("ddos.title"))}</h2>
      <div class="toolbar">
        ${Pa({id:"ddos-master-autoban",on:E,onLabel:e("ddos.masterOn"),offLabel:e("ddos.masterOff"),title:e("ddos.autoBanMasterHint")})}
        <button class="btn secondary sm" id="ddos-refresh">${t(e("ddos.refresh"))}</button>
        <button class="btn secondary sm" id="ddos-pause">${t(e(ze?"ddos.resume":"ddos.pause"))}</button>
      </div>
    </div>
    ${ke([e("ddos.policyHint")])}
    <div class="feature-off-banner" id="ddos-disabled-banner" ${E?"hidden":""} role="status">
      <strong>${t(e("common.featureOff"))}</strong>
      <span>${t(e("ddos.disabledBanner"))}</span>
    </div>
    ${Y}

    <div class="usage-tabs-panel panel ddos-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("ddos.title"))}">
        <button type="button" role="tab" class="seg-tab ${B==="policy"?"is-active":""}" data-ddos-tab="policy" aria-selected="${B==="policy"}">
          ${t(e("ddos.tabPolicy"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${B==="live"?"is-active":""}" data-ddos-tab="live" aria-selected="${B==="live"}">
          ${t(e("ddos.tabLive"))}
          <span class="seg-tab-count" id="ddos-tab-count-live">${C.length}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${B==="blacklist"?"is-active":""}" data-ddos-tab="blacklist" aria-selected="${B==="blacklist"}">
          ${t(e("ddos.tabBlacklist"))}
          <span class="seg-tab-count" id="ddos-tab-count-ban">${R.length}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${B==="events"?"is-active":""}" data-ddos-tab="events" aria-selected="${B==="events"}">
          ${t(e("ddos.tabEvents"))}
          <span class="seg-tab-count" id="ddos-tab-count-events">${j.length}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-policy" id="ddos-tab-policy" ${B==="policy"?"":"hidden"}>
          ${se}
        </div>
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-stack" id="ddos-tab-live" ${B==="live"?"":"hidden"}>
          ${ue}
        </div>
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-stack" id="ddos-tab-blacklist" ${B==="blacklist"?"":"hidden"}>
          ${fe}
        </div>
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-stack" id="ddos-tab-events" ${B==="events"?"":"hidden"}>
          ${oe}
        </div>
      </div>
    </div>
    </div>
  `),de(),Da(!0,K),Ge(r.ddosFilter,()=>ne().catch(h)),document.querySelectorAll("[data-ddos-tab]").forEach(ye=>{ye.addEventListener("click",()=>{const Ie=ye.getAttribute("data-ddos-tab")||"policy",Me=Ie==="live"||Ie==="blacklist"||Ie==="events"||Ie==="policy"?Ie:"policy";r.ddosFilter.tab!==Me&&(r.ddosFilter.tab=Me,ne().catch(h))})}),document.getElementById("ddos-live-filter-apply")?.addEventListener("click",()=>{r.ddosFilter.liveQ=document.getElementById("ddos-live-q")?.value?.trim()||"",r.ddosFilter.livePage=0,ne().catch(h)}),document.getElementById("ddos-live-filter-reset")?.addEventListener("click",()=>{r.ddosFilter.liveQ="",r.ddosFilter.liveSortBy="startedAt",r.ddosFilter.liveSortDir="desc",r.ddosFilter.livePage=0,ne().catch(h)}),document.getElementById("ddos-ban-filter-apply")?.addEventListener("click",()=>{r.ddosFilter.banQ=document.getElementById("ddos-ban-q")?.value?.trim()||"",r.ddosFilter.banSource=document.getElementById("ddos-ban-source")?.value||"",r.ddosFilter.banPage=0,ne().catch(h)}),document.getElementById("ddos-ban-filter-reset")?.addEventListener("click",()=>{r.ddosFilter.banQ="",r.ddosFilter.banSource="",r.ddosFilter.banSortBy="createdAt",r.ddosFilter.banSortDir="desc",r.ddosFilter.banPage=0,ne().catch(h)}),document.getElementById("ddoslive-prev")?.addEventListener("click",()=>{r.ddosFilter.livePage=Math.max(0,i.livePage-1),ne().catch(h)}),document.getElementById("ddoslive-next")?.addEventListener("click",()=>{(i.livePage+1)*S<C.length&&(r.ddosFilter.livePage+=1,ne().catch(h))}),document.getElementById("ddosban-prev")?.addEventListener("click",()=>{r.ddosFilter.banPage=Math.max(0,i.banPage-1),ne().catch(h)}),document.getElementById("ddosban-next")?.addEventListener("click",()=>{(i.banPage+1)*S<R.length&&(r.ddosFilter.banPage+=1,ne().catch(h))});const me=document.querySelector(".main");me&&(me.onscroll=()=>{r._ddosScrollPauseUntil=Date.now()+4e3})}!ze&&r.page==="ddos"&&(We=setInterval(()=>{r.page!=="ddos"||ze||r._ddosScrollPauseUntil&&Date.now()<r._ddosScrollPauseUntil||ne({soft:!0}).catch(()=>{})},2e3))}function Da(a=!1,s=[]){const o=s.length?s:r._ddosPolicyCache?.whitelist||[],n=async i=>{if(!i)return;const d=o.some(l=>String(l)===i||String(l).startsWith(i));await ee({message:e(d?"ddos.banWhitelistWarn":"ddos.banConfirm"),variant:"danger",confirmText:e("ddos.ban")})&&(await M("/ddos/blacklist",{method:"POST",body:JSON.stringify({ip:i,reason:e("ddos.banReasonDefault"),ttlSeconds:null})}),ne({soft:!0}).catch(h))};if(document.querySelectorAll("[data-ban]").forEach(i=>{i.onclick=()=>n(i.dataset.ban)}),document.querySelectorAll("[data-unban]").forEach(i=>{i.onclick=async()=>{await ee({message:e("ddos.unbanConfirm"),variant:"danger",confirmText:e("ddos.unban")})&&(await M(`/ddos/blacklist/${encodeURIComponent(i.dataset.unban)}`,{method:"DELETE"}),ne({soft:!0}).catch(h))}}),a){document.getElementById("ban-add").onclick=async()=>{const d=document.getElementById("ban-ip").value.trim();if(!d||o.some(m=>String(m)===d)&&!await ee({message:e("ddos.banWhitelistWarn"),variant:"danger",confirmText:e("ddos.ban")}))return;const u=document.getElementById("ban-ttl").value;await M("/ddos/blacklist",{method:"POST",body:JSON.stringify({ip:d,reason:document.getElementById("ban-reason").value.trim()||void 0,ttlSeconds:u?Number(u):null})}),ne({soft:!0}).catch(h)},document.getElementById("ddos-refresh").onclick=()=>ne({soft:!1}).catch(h),document.getElementById("ddos-pause").onclick=()=>{ze=!ze;const d=document.getElementById("ddos-pause");d&&(d.textContent=e(ze?"ddos.resume":"ddos.pause")),ze||ne({soft:!0}).catch(h)},document.getElementById("ddos-master-autoban")?.addEventListener("click",async()=>{const d=!Xe("ddos-master-autoban");Ye("ddos-master-autoban",d,e("ddos.masterOn"),e("ddos.masterOff"));const l=document.getElementById("dp-autoBanEnabled");l&&(l.type==="checkbox"?l.checked=d:l.value=d?"1":"0"),Ea(d),et("ddos-root",!d),Ze("ddos-disabled-banner",!d),_e();try{const u=ra(),m=await M("/ddos/policy",{method:"PUT",body:JSON.stringify(u)});r._ddosPolicyCache=m.data,_e()}catch(u){Ye("ddos-master-autoban",!d,e("ddos.masterOn"),e("ddos.masterOff")),et("ddos-root",d),Ze("ddos-disabled-banner",d),h(u)}});const i=document.getElementById("ddos-policy-panel");i?.addEventListener("input",()=>_e()),i?.addEventListener("change",()=>_e()),document.querySelectorAll("[data-ddos-preset]").forEach(d=>{d.onclick=()=>{const l=d.dataset.ddosPreset;if(l==="custom")return;const u=r._ddosPresetsCache?.[l];u&&Xt(u)}}),_e(),document.getElementById("dp-save")?.addEventListener("click",async()=>{try{const d=ra(),l=await M("/ddos/policy",{method:"PUT",body:JSON.stringify(d)});r._ddosPolicyCache=l.data,Xt(l.data),_e(),await be({title:e("ddos.policyTitle"),message:e("ddos.policySaved")}),ne({soft:!0}).catch(h)}catch(d){h(d)}}),document.getElementById("dp-reset")?.addEventListener("click",async()=>{if(await ee({message:e("ddos.confirmReset"),variant:"danger",confirmText:e("ddos.resetPolicy")}))try{const d=await M("/ddos/policy/reset",{method:"POST"});r._ddosPolicyCache=d.data,Xt(d.data),_e(),await be({title:e("ddos.policyTitle"),message:e("ddos.policyReset")}),ne({soft:!0}).catch(h)}catch(d){h(d)}})}}function qt(a){return e(a==="pm2"?"pm2.runnerPm2":a==="ysk-omni"?"pm2.runnerGctoac":a==="none"?"pm2.runnerNone":"pm2.runnerUnknown")}function ua(a){if(!a)return"";const s=a.messageKey;if(s&&typeof s=="string"){if(s==="pm2.msgOk")return"";const n=a.messageParams||{},i=T(s,n);if(i&&i!==s)return i}const o=a.message||"";return!o||o==="ok"?"":o}function Oa(a=10){const s=Math.max(1,Number(a)||10)*1e3;window.setTimeout(()=>{try{window.location.reload()}catch{window.location.href=window.location.href}},s)}function Zs(a,s){const o=s?.messageKey||(a==="pm2"?"pm2.msgSwitchPm2":"pm2.msgSwitchGctoac");let n=ua({messageKey:o,messageParams:s?.messageParams,message:void 0});n||(n=e(a==="pm2"?"pm2.msgSwitchPm2":"pm2.msgSwitchGctoac"));const i=s?.port||s?.messageParams?.port||(typeof location<"u"&&location.port?location.port:"3850");return[n,T("pm2.portAfterRestart",{port:i}),T("pm2.autoRefreshIn",{n:10})].filter(Boolean).join(`
`)}function Yt(a){return a==="pm2"?`<span class="badge success">${t(qt(a))}</span>`:a==="ysk-omni"?`<span class="badge agent">${t(qt(a))}</span>`:a==="none"?`<span class="badge pending">${t(qt(a))}</span>`:`<span class="badge warn">${t(qt(a))}</span>`}function eo(a){return!a||typeof a!="object"?"":Object.entries(a).map(([s,o])=>`${s}=${o}`).join(`
`)}function to(a){const s={};for(const o of(a||"").split(`
`)){const n=o.trim();if(!n||n.startsWith("#"))continue;const i=n.indexOf("=");i<=0||(s[n.slice(0,i).trim()]=n.slice(i+1).trim())}return s}function ao(){const a=d=>document.getElementById(d)?.checked===!0,s=d=>document.getElementById(d)?.value??"";let o=s("pm2-cfg-instances").trim();if(o!=="max"){const d=Number(o);o=Number.isFinite(d)&&d>=1?d:1}const n=s("pm2-cfg-port").trim(),i=Number(n);return{port:Number.isFinite(i)&&i>=1&&i<=65535?i:void 0,name:s("pm2-cfg-name").trim()||"ysk-omni",script:s("pm2-cfg-script").trim()||"dist/server.js",cwd:s("pm2-cfg-cwd").trim()||void 0,instances:o,exec_mode:s("pm2-cfg-exec")==="cluster"?"cluster":"fork",autorestart:a("pm2-cfg-autorestart"),watch:a("pm2-cfg-watch"),max_memory_restart:s("pm2-cfg-maxmem").trim()||"512M",max_restarts:Number(s("pm2-cfg-maxrestarts"))||10,min_uptime:s("pm2-cfg-minuptime").trim()||"5s",restart_delay:Number(s("pm2-cfg-restartdelay"))||2e3,exp_backoff_restart_delay:Number(s("pm2-cfg-backoff"))||1e3,merge_logs:a("pm2-cfg-mergelogs"),time:a("pm2-cfg-time"),error_file:s("pm2-cfg-errfile").trim()||"logs/pm2-error.log",out_file:s("pm2-cfg-outfile").trim()||"logs/pm2-out.log",env_extra:to(s("pm2-cfg-envextra")),preferred_runner:s("pm2-cfg-preferred")==="pm2"?"pm2":"ysk-omni"}}async function Le(){const s=(await M("/pm2/status")).data||{},o=s.app,n=s.config||{},i=s.portHolders||{},d=i.pids&&i.pids.length>0||!1,l=ua(s);let u="",m=null;try{const k=await M("/pm2/logs?lines=80");u=(k.data?.stdout||"")+(k.data?.stderr?`
`+k.data.stderr:""),m=k.data||null}catch(k){u=k.message||""}s.lastError&&(u=`===== last errors =====
${s.lastError}

${u}`);const p=m?.files||[],c=p.length?p.filter(k=>k.exists).map(k=>`${k.label}: ${k.size<1024?k.size+" B":Math.round(k.size/1024)+" KB"}`).join(" · "):"",w=m?.maxBytes?Math.round(m.maxBytes/(1024*1024)):5,y=m?.keepBytes?Math.round(m.keepBytes/1024):512,g=o?.status||"—",v=g==="online"?e("pm2.statusOnline"):g==="errored"?e("pm2.statusErrored"):g==="stopped"?e("pm2.statusStopped"):g,S=g==="online"?`<span class="badge success">${t(v)}</span>`:g==="errored"?`<span class="badge error">${t(v)}</span>`:t(v),C=s.available,L=s.available&&o,R=s.runner||"unknown",q=l&&g!=="errored"&&s.available!==!1&&s.messageKey!=="pm2.msgErrored",j=eo(n.env_extra),x=r.pm2Tab==="port"||r.pm2Tab==="config"||r.pm2Tab==="logs"||r.pm2Tab==="runner"?r.pm2Tab:"runner";r.pm2Tab=x;const P=`
    <div class="grid pm2-kpi-grid" id="pm2-kpi-grid">
      <div class="card">
        <div class="label">${t(e("pm2.app"))}</div>
        <div class="value value-sm">${t(s.appName||n.name||"ysk-omni")}</div>
        <div class="muted card-sub">${Yt(R)}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("pm2.status"))}</div>
        <div class="value value-sm">${S}</div>
        <div class="muted card-sub">${t(e("pm2.pid"))}: ${o?.pid&&o.pid!==0?o.pid:"—"}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("pm2.restarts"))}</div>
        <div class="value value-sm">${o?.restarts??"—"}</div>
        <div class="muted card-sub">CPU ${o?.cpu!=null?o.cpu+"%":"—"} · ${o?.memory!=null?T("common.mb",{n:Math.round(o.memory/1024/1024)}):"—"}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("pm2.port"))}</div>
        <div class="value value-sm">${s.port??"—"}</div>
        <div class="muted card-sub">${t(e("pm2.portBusy"))}: ${e(d?"common.yes":"common.no")}</div>
      </div>
    </div>`,K=`
    <div class="panel data-table-panel pm2-section-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("pm2.switchTitle"))}</strong>
          <span class="muted panel-h-sub">${t(e("pm2.switchHint"))}</span>
        </div>
        ${Yt(R)}
      </div>
      <div class="panel-pad">
        <div class="grid">
          <div class="card"><div class="label">${t(e("pm2.currentRunner"))}</div><div class="value value-sm">${Yt(R)}</div></div>
          <div class="card"><div class="label">${t(e("pm2.omniPid"))}</div><div class="value value-sm">${s.omni?.running&&s.omni?.pid?s.ysk-omni.pid:"—"}</div></div>
          <div class="card"><div class="label">${t(e("pm2.port"))}</div><div class="value value-sm">${s.port??"—"}</div></div>
          <div class="card"><div class="label">${t(e("pm2.portBusy"))}</div><div class="value value-sm">${e(d?"common.yes":"common.no")}</div></div>
        </div>
        <div class="toolbar settings-save-bar">
          <button class="btn sm" id="pm2-switch-pm2" ${C?"":"disabled"}>${t(e("pm2.switchToPm2"))}</button>
          <button class="btn secondary sm" id="pm2-switch-ysk-omni">${t(e("pm2.switchToGctoac"))}</button>
        </div>
      </div>
    </div>`,A=`
    <div class="panel data-table-panel pm2-section-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("pm2.portTitle"))}</strong>
          <span class="muted panel-h-sub">${t(e("pm2.portHint"))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <div class="form-grid">
          <label class="full">${t(e("pm2.fieldPort"))}
            <input type="number" id="pm2-cfg-port" min="1" max="65535" step="1" value="${t(String(s.port??3850))}" placeholder="3850" />
            <span class="hint">${t(e("pm2.portDefaultNote"))}</span>
          </label>
        </div>
        <div class="toolbar settings-save-bar">
          <button type="button" class="btn sm" id="pm2-port-save">${t(e("pm2.savePort"))}</button>
          <button type="button" class="btn secondary sm" id="pm2-port-default">${t(e("pm2.useDefaultPort"))}</button>
        </div>
      </div>
    </div>`,f=`
    <div class="panel data-table-panel pm2-section-panel" id="pm2-config-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("pm2.configTitle"))}</strong>
          <span class="muted panel-h-sub">${t(e("pm2.configHint"))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <div class="form-grid pm2-config-form">
          <label>${t(e("pm2.fieldName"))}<input id="pm2-cfg-name" value="${t(n.name||"")}" /></label>
          <label>${t(e("pm2.fieldScript"))}<input id="pm2-cfg-script" value="${t(n.script||"dist/server.js")}" /></label>
          <label>${t(e("pm2.fieldCwd"))}<input id="pm2-cfg-cwd" value="${t(n.cwd||"")}" placeholder="${t(e("pm2.phCwd"))}" /></label>
          <label>${t(e("pm2.fieldInstances"))}<input id="pm2-cfg-instances" value="${t(String(n.instances??1))}" placeholder="${t(e("pm2.phInstances"))}" /></label>
          <label>${t(e("pm2.fieldExecMode"))}
            <select id="pm2-cfg-exec">
              <option value="fork" ${n.exec_mode!=="cluster"?"selected":""}>${t(e("pm2.modeFork"))}</option>
              <option value="cluster" ${n.exec_mode==="cluster"?"selected":""}>${t(e("pm2.modeCluster"))}</option>
            </select>
          </label>
          <label>${t(e("pm2.fieldMaxMem"))}<input id="pm2-cfg-maxmem" value="${t(n.max_memory_restart||"512M")}" /></label>
          <label>${t(e("pm2.fieldMaxRestarts"))}<input id="pm2-cfg-maxrestarts" type="number" value="${t(String(n.max_restarts??10))}" /></label>
          <label>${t(e("pm2.fieldMinUptime"))}<input id="pm2-cfg-minuptime" value="${t(String(n.min_uptime??"5s"))}" /></label>
          <label>${t(e("pm2.fieldRestartDelay"))}<input id="pm2-cfg-restartdelay" type="number" value="${t(String(n.restart_delay??2e3))}" /></label>
          <label>${t(e("pm2.fieldBackoff"))}<input id="pm2-cfg-backoff" type="number" value="${t(String(n.exp_backoff_restart_delay??1e3))}" /></label>
          <label>${t(e("pm2.fieldErrorFile"))}<input id="pm2-cfg-errfile" value="${t(n.error_file||"logs/pm2-error.log")}" /></label>
          <label>${t(e("pm2.fieldOutFile"))}<input id="pm2-cfg-outfile" value="${t(n.out_file||"logs/pm2-out.log")}" /></label>
          <label>${t(e("pm2.fieldPreferred"))}
            <select id="pm2-cfg-preferred">
              <option value="ysk-omni" ${n.preferred_runner!=="pm2"?"selected":""}>ysk-omni</option>
              <option value="pm2" ${n.preferred_runner==="pm2"?"selected":""}>pm2</option>
            </select>
          </label>
          <label class="check"><input type="checkbox" id="pm2-cfg-autorestart" ${n.autorestart!==!1?"checked":""}/> ${t(e("pm2.fieldAutorestart"))}</label>
          <label class="check"><input type="checkbox" id="pm2-cfg-watch" ${n.watch?"checked":""}/> ${t(e("pm2.fieldWatch"))}</label>
          <label class="check"><input type="checkbox" id="pm2-cfg-mergelogs" ${n.merge_logs!==!1?"checked":""}/> ${t(e("pm2.fieldMergeLogs"))}</label>
          <label class="check"><input type="checkbox" id="pm2-cfg-time" ${n.time!==!1?"checked":""}/> ${t(e("pm2.fieldTime"))}</label>
          <label class="full">${t(e("pm2.fieldEnvExtra"))}<textarea id="pm2-cfg-envextra" rows="4" placeholder="${t(e("pm2.phEnv"))}">${t(j)}</textarea></label>
        </div>
        <div class="toolbar settings-save-bar">
          <button class="btn sm" id="pm2-cfg-save">${t(e("pm2.saveConfig"))}</button>
          <button class="btn secondary sm" id="pm2-cfg-save-only">${t(e("pm2.saveOnly"))}</button>
          <button class="btn secondary sm" id="pm2-cfg-reset">${t(e("pm2.resetConfig"))}</button>
        </div>
      </div>
    </div>`,$=`
    <div class="panel data-table-panel pm2-section-panel pm2-logs-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("pm2.logs"))}</strong>
          <span class="muted panel-h-sub">${t(e("pm2.logsHint"))}</span>
        </div>
        <div class="toolbar">
          <button type="button" class="btn secondary sm" id="pm2-logs-refresh">${t(e("pm2.refresh"))}</button>
          <button type="button" class="btn danger sm" id="pm2-logs-clear">${t(e("pm2.clearLogs"))}</button>
        </div>
      </div>
      <div class="panel-pad">
        <p class="muted" style="margin:0 0 8px;font-size:0.82rem">
          ${t(T("pm2.logsAutoTrim",{maxMb:w,keepKb:y}))}
          ${c?` · ${t(c)}`:""}
        </p>
        <pre class="pre pre-logs" id="pm2-logs-pre">${t(u||e("common.empty"))}</pre>
      </div>
    </div>`;document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("pm2.title"))}</h2>
      <div class="toolbar">
        <button class="btn secondary sm" id="pm2-refresh">${t(e("pm2.refresh"))}</button>
        <button class="btn sm" id="pm2-start" ${C?"":"disabled"}>${t(e("pm2.start"))}</button>
        <button class="btn secondary sm" id="pm2-stop" ${L?"":"disabled"}>${t(e("pm2.stop"))}</button>
        <button class="btn sm" id="pm2-restart" ${C?"":"disabled"}>${t(e("pm2.restart"))}</button>
        <button class="btn secondary sm" id="pm2-reload" ${!L||o?.status!=="online"?"disabled":""}>${t(e("pm2.reload"))}</button>
      </div>
    </div>
    ${ke([e("pm2.hint")])}
    ${l?`<div class="error-box${q?" warn-box":""}">${t(l)}</div>`:s.available?"":`<div class="error-box">${t(e("pm2.unavailable"))}</div>`}
    ${P}

    <div class="usage-tabs-panel panel pm2-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("pm2.title"))}">
        <button type="button" role="tab" class="seg-tab ${x==="runner"?"is-active":""}" data-pm2-tab="runner" aria-selected="${x==="runner"}">
          ${t(e("pm2.tabRunner"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${x==="port"?"is-active":""}" data-pm2-tab="port" aria-selected="${x==="port"}">
          ${t(e("pm2.tabPort"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${x==="config"?"is-active":""}" data-pm2-tab="config" aria-selected="${x==="config"}">
          ${t(e("pm2.tabConfig"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${x==="logs"?"is-active":""}" data-pm2-tab="logs" aria-selected="${x==="logs"}">
          ${t(e("pm2.tabLogs"))}
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-runner" ${x==="runner"?"":"hidden"}>
          ${K}
        </div>
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-port" ${x==="port"?"":"hidden"}>
          ${A}
        </div>
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-config" ${x==="config"?"":"hidden"}>
          ${f}
        </div>
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-logs" ${x==="logs"?"":"hidden"}>
          ${$}
        </div>
      </div>
    </div>
  `),de(),document.querySelectorAll("[data-pm2-tab]").forEach(k=>{k.addEventListener("click",()=>{const I=k.getAttribute("data-pm2-tab")||"runner",F=I==="port"||I==="config"||I==="logs"||I==="runner"?I:"runner";r.pm2Tab!==F&&(r.pm2Tab=F,Le().catch(h))})}),document.getElementById("pm2-logs-refresh")?.addEventListener("click",()=>{r.pm2Tab="logs",Le().catch(h)}),document.getElementById("pm2-logs-clear")?.addEventListener("click",async()=>{if(await ee({message:e("pm2.confirmClearLogs"),variant:"danger",confirmText:e("pm2.clearLogs")}))try{const I=(await M("/pm2/logs/clear",{method:"POST",body:JSON.stringify({which:"all"})})).data?.cleared?.length||0;await be({message:T("pm2.logsCleared",{n:I})}),Le().catch(h)}catch(k){h(k)}});const U=async k=>{if(await ee({message:e(k==="pm2"?"pm2.confirmSwitchPm2":"pm2.confirmSwitchGctoac"),variant:"confirm",confirmText:e(k==="pm2"?"pm2.switchToPm2":"pm2.switchToGctoac")}))try{const F=await M("/pm2/switch",{method:"POST",body:JSON.stringify({mode:k})}),Z=F?.data||F||{},z=Zs(k==="pm2"?"pm2":"ysk-omni",Z);Oa(10),await be({title:e("common.notice"),message:z,confirmText:e("common.ok")});try{window.location.reload()}catch{window.location.href=window.location.href}}catch(F){h(F)}};document.getElementById("pm2-refresh").onclick=()=>Le().catch(h),document.getElementById("pm2-switch-pm2").onclick=()=>U("pm2"),document.getElementById("pm2-switch-ysk-omni").onclick=()=>U("ysk-omni"),document.getElementById("pm2-start").onclick=()=>U("pm2"),document.getElementById("pm2-stop").onclick=async()=>{if(await ee({message:e("pm2.confirmStop"),variant:"danger",confirmText:e("pm2.stop")}))try{await M("/pm2/stop",{method:"POST",body:"{}"}),Le().catch(h)}catch(k){h(k)}},document.getElementById("pm2-restart").onclick=async()=>{if(await ee({message:e("pm2.confirmRestart"),variant:"confirm",confirmText:e("pm2.restart")}))try{await U("pm2")}catch(k){h(k)}},document.getElementById("pm2-reload").onclick=async()=>{try{await M("/pm2/reload",{method:"POST",body:"{}"}),Le().catch(h)}catch(k){h(k)}};const b=async k=>{try{const I={...ao(),restart:k};if(I.port==null){await be({message:e("pm2.portInvalid")});return}const F=await M("/pm2/config",{method:"PUT",body:JSON.stringify(I)});if(F.data?.scheduled){const Z=F.data.portChange?`
${T("pm2.portChangedMsg",{from:F.data.portChange.previous,to:F.data.portChange.port})}`:"",z=ua(F.data.scheduled)||e("pm2.switchScheduled");Oa(10),await be({title:e("common.notice"),message:z+Z+`
${T("pm2.autoRefreshIn",{n:10})}`});try{window.location.reload()}catch{window.location.href=window.location.href}}else await be(F.data?.portChange?T("pm2.portSavedNeedRestart",{port:F.data.port}):e("pm2.configSaved")),Le().catch(h)}catch(I){h(I)}};document.getElementById("pm2-cfg-save").onclick=()=>b(!0),document.getElementById("pm2-cfg-save-only").onclick=()=>b(!1),document.getElementById("pm2-port-default")?.addEventListener("click",()=>{const k=document.getElementById("pm2-cfg-port");k&&(k.value="3850")}),document.getElementById("pm2-port-save")?.addEventListener("click",async()=>{const k=Number(document.getElementById("pm2-cfg-port")?.value);if(!Number.isFinite(k)||k<1||k>65535){await be({message:e("pm2.portInvalid")});return}if(await ee({message:T("pm2.confirmPortChange",{port:k}),variant:"confirm",confirmText:e("pm2.savePort")}))try{const I=await M("/pm2/config",{method:"PUT",body:JSON.stringify({port:k,restart:!0})}),F=I.data?.scheduled?.message||(I.data?.portChange?T("pm2.portChangedMsg",{from:I.data.portChange.previous,to:I.data.portChange.port}):e("pm2.configSaved"));await be(F+`
`+T("pm2.portAfterRestart",{port:k}))}catch(I){h(I)}}),document.getElementById("pm2-cfg-reset").onclick=async()=>{if(await ee({message:e("pm2.confirmReset"),variant:"danger",confirmText:e("pm2.resetConfig")}))try{await M("/pm2/config/reset",{method:"POST",body:"{}"}),Le().catch(h)}catch(k){h(k)}}}let te=[],ve=null,ie=[],yt=!1,Ne=0;const Re=new Map,H={keyId:"",model:"",reasoning:!0,effort:"",resumeId:"",forkSession:!1,memory:!1,noPlan:!1,permissionMode:"",systemPrompt:"",systemOpen:!1,settingsOpen:!1},_={mode:"full",recentN:6,summary:"",summaryAt:null,summarySourceCount:0},so=3,cs=40,oo=20,no=2200,O={conversationId:null,historyPage:0,historyLimit:20,historyQ:"",historyTotal:0,historyItems:[],historyLoading:!1,historyOpenMobile:!1,saving:!1,saveQueued:!1,renamingId:null};let Zt=null;const Ft=10,Ia=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;function io(a){const s=String(a||"").split(/[/\\]/).pop()||"",o=s.lastIndexOf(".");return o<0?"":s.slice(o).toLowerCase()}function Nt(a){return Wa.has(io(a))}function Kt(){return e("chat.formatsHint")}function us(){_.mode="full",_.recentN=6,_.summary="",_.summaryAt=null,_.summarySourceCount=0,Ne=0,Re.clear()}function lo(a){const s=(a?.title||"").trim();if(s)return s;const o=(a?.preview||"").trim();return o||e("chat.untitled")}function ro(){return te.filter(a=>!a.streaming).map(a=>{const s={role:a.role,content:a.content||""};return a.reasoning&&(s.reasoning=a.reasoning),a.docs&&a.docs.length&&(s.docs=a.docs),a.error&&(s.error=!0),s})}function co(){return{contextMode:_.mode,contextRecentN:_.recentN,summaryText:_.summary||"",summaryAt:_.summaryAt,summarySourceCount:_.summarySourceCount||0}}function uo(a){a&&(_.mode=a.contextMode==="summary"||a.contextMode==="recent"?a.contextMode:"full",_.recentN=Math.min(40,Math.max(2,Number(a.contextRecentN)||6)),_.summary=(a.summaryText||"").trim(),_.summaryAt=a.summaryAt||null,_.summarySourceCount=Number(a.summarySourceCount)||0,_.mode==="summary"&&!_.summary&&(_.mode="full"))}function ms(a){return a.reduce((s,o)=>s+(o.content||"").length+(o.reasoning||"").length,0)}function ps(){const a=te.filter(s=>!s.streaming);return a.length<2?!1:a.length>=so?!0:ms(a)>=800}function mo(){const a=(H.systemPrompt||"").trim(),s=te.filter(l=>!l.streaming),o=Math.min(40,Math.max(2,Number(_.recentN)||6));let n=s.map(l=>({role:l.role,content:l.content||""})),i=a;if(_.mode==="summary"&&_.summary){const l=(vt()==="zh-Hant"?`【先前對話摘要 — 僅供延續語境，完整記錄仍在用戶介面】
`:`[Prior conversation summary — full history remains in the UI]
`)+_.summary;i=i?`${i}

${l}`:l;const u=s.slice(_.summarySourceCount||0);n=(u.length?u:s.slice(-o)).slice(-o).map(p=>({role:p.role,content:p.content||""}))}else _.mode==="recent"&&(n=s.slice(-o).map(l=>({role:l.role,content:l.content||""})));const d=n.map(l=>({role:l.role,content:l.content}));return i&&d.unshift({role:"system",content:i}),d}function po(){return _.mode==="summary"&&_.summary?T("chat.ctxModeSummaryLabel",{n:_.recentN}):_.mode==="recent"?T("chat.ctxModeRecentLabel",{n:_.recentN}):e("chat.ctxModeFullLabel")}function lt(){const a=document.getElementById("chat-compress");if(!a)return;const s=te.some(i=>i.streaming),o=!!ve||yt||s,n=ps();a.disabled=o||!n,a.textContent=e(yt?"chat.compressing":"chat.compress"),a.title=e(n?"chat.compress":"chat.compressNeedMore"),je(),tt()}function tt(){const a=document.getElementById("chat-ctx-mode"),s=document.getElementById("chat-ctx-n");if(a){const o=_.mode==="summary"&&!_.summary?"full":_.mode;a.value=o;const n=a.querySelector('option[value="summary"]');n&&(n.disabled=!_.summary)}s&&(s.value=String(_.recentN),s.disabled=_.mode==="full"),jt()}function je(){const a=document.getElementById("chat-compress-banner");if(!a)return;const s=!!_.summary,o=te.filter(d=>!d.streaming).length>40||ms(te)>6e4;if(!s&&_.mode==="full"&&!o){a.hidden=!0,a.innerHTML="";return}a.hidden=!1;const n=s?_.summary.length>160?`${_.summary.slice(0,159)}…`:_.summary:"",i=o?`<p class="chat-compress-warn">${t(e("chat.ctxLongHint"))}</p>`:"";a.innerHTML=`
    <div class="chat-compress-banner-inner">
      <div class="chat-compress-banner-text">
        <strong>${t(e("chat.ctxPolicyTitle"))}</strong>
        <span class="muted">${t(po())}</span>
        <p class="chat-compress-remark">${t(e("chat.ctxRemark"))}</p>
        ${n?`<p class="chat-compress-preview">${t(n)}</p>`:""}
        ${i}
      </div>
      <div class="chat-compress-banner-actions">
        ${s?`<button type="button" class="btn secondary sm" id="chat-summary-view">${t(e("chat.compressView"))}</button>`:""}
      </div>
    </div>`,document.getElementById("chat-summary-view")?.addEventListener("click",()=>{gs()})}async function gs(){if(!_.summary){Q(e("chat.compressNeedSummary"));return}const a=_.summaryAt?ae(_.summaryAt):"—",s=Va(_.summary);Te&&Ve(!1);const o=document.createElement("div");return o.className="ui-dialog-back",o.id="ui-dialog-back",o.dataset.cancelable="1",o.innerHTML=`
    <div class="ui-dialog ui-dialog--info ui-dialog--large" role="dialog" aria-modal="true">
      <div class="ui-dialog-h">
        <div class="ui-dialog-icon" aria-hidden="true">Σ</div>
        <h3 class="ui-dialog-title">${t(e("chat.compressResultTitle"))}</h3>
      </div>
      <div class="ui-dialog-body ui-dialog-body--md">
        <p class="muted" style="margin:0 0 10px">${t(T("chat.summaryMeta",{when:a,n:_.summarySourceCount}))}</p>
        <div class="chat-content md">${s}</div>
      </div>
      <div class="ui-dialog-actions">
        <button type="button" class="btn secondary sm" id="ui-dialog-copy">${t(e("chat.copy"))}</button>
        <button type="button" class="btn sm" id="ui-dialog-ok">${t(e("common.ok"))}</button>
      </div>
    </div>`,document.body.appendChild(o),document.body.classList.add("ui-dialog-open"),Te=o,document.addEventListener("keydown",$a,!0),new Promise(n=>{Rt=n;const i=()=>Ve(!0);o.querySelector("#ui-dialog-ok")?.addEventListener("click",i),o.addEventListener("click",d=>{d.target===o&&i()}),o.querySelector("#ui-dialog-copy")?.addEventListener("click",async()=>{const d=await Qt(_.summary),l=o.querySelector("#ui-dialog-copy");d&&l&&(l.textContent=e("chat.copied"),setTimeout(()=>{l.isConnected&&(l.textContent=e("chat.copy"))},1500))})})}function go(a){return a.map(s=>{const o=s.role||"user";let n=(s.content||"").trim();if(s.docs&&s.docs.length){const i=s.docs.map(d=>d.name).join(", ");n=n?`${n}
[attachments: ${i}]`:`[attachments: ${i}]`}return n.length>5e3&&(n=`${n.slice(0,4999)}…`),`${o}: ${n}`}).join(`

`)}function fo(){return vt()==="zh-Hant"?["你是對話摘要助手。只輸出精簡摘要，不要使用任何工具、不要上網、不要反問。","若已有舊摘要，請合併更新為一份。","請用繁體中文（或對齊原對話語言）條列：","1) 主題與目標 2) 已確定事實／決定 3) 未完成事項 4) 用戶偏好或約束","控制在約 600–1000 字。不要大段複製原文。只輸出摘要正文。"].join(`
`):["You are a conversation summary assistant. Output only a concise summary.","Merge any prior summary into one updated summary. No tools, no browsing, no questions.","Cover: (1) topics/goals (2) facts/decisions (3) open items (4) preferences.","Keep under ~600–1000 words. Summary body only."].join(`
`)}async function bo(){if(yt||ve||te.some(i=>i.streaming)){Q(e("chat.compressBusy"));return}const a=te.filter(i=>!i.streaming);if(!ps()){Q(e("chat.compressNeedMore"));return}if(!await ee({title:e("chat.compress"),message:e("chat.compressConfirm"),variant:"confirm",confirmText:e("chat.compress")}))return;const s=Mt();if(!s){Q(e("chat.needKey"));return}pe(),yt=!0,lt();const o=document.getElementById("chat-send");o&&(o.disabled=!0);const n=document.getElementById("chat-stream-status");n&&(n.hidden=!1,n.textContent=e("chat.compressing"));try{let i=go(a);_.summary&&(i=(vt()==="zh-Hant"?`先前摘要：
${_.summary}

完整對話：
`:`Prior summary:
${_.summary}

Full conversation:
`)+i);const d=document.getElementById("chat-model")?.value||H.model||"echo",l=Ma(),u={model:d,stream:!1,include_reasoning:!1,messages:[{role:"system",content:fo()},{role:"user",content:(vt()==="zh-Hant"?`請為以下對話產生摘要（僅供之後回合作為語境，不會刪除用戶介面中的記錄）：

`:`Summarize the following conversation (for later context only; UI history is kept):

`)+i}]},m=It();m&&(u.apiKeyId=m);const p=await fetch("/admin/api/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${s}`,"Content-Type":"application/json"},body:JSON.stringify(u)});if(!p.ok){const y=await p.text();let g=y;try{g=JSON.parse(y).error?.message||y}catch{}throw new Error(g||e("chat.compressFail"))}const c=await p.json();let w=c?.choices?.[0]?.message?.content||c?.choices?.[0]?.delta?.content||"";if(typeof w!="string"&&(w=String(w||"")),w=w.trim().replace(/^【對話摘要】\s*/u,"").replace(/^\[Conversation summary\]\s*/i,""),!w)throw new Error(e("chat.compressFail"));_.summary=w,_.summaryAt=new Date().toISOString(),_.summarySourceCount=a.length,_.mode="summary",je(),tt(),Q(""),n&&(n.hidden=!1,n.textContent=e("chat.compressOk"),setTimeout(()=>{const y=document.getElementById("chat-stream-status");y&&y.textContent===e("chat.compressOk")&&(y.hidden=!0,y.textContent="")},2800)),await wt().catch(()=>{}),await gs()}catch(i){Q(i.message||e("chat.compressFail"))}finally{yt=!1,lt(),o&&(o.disabled=!1),n&&n.textContent===e("chat.compressing")&&(n.hidden=!0,n.textContent="")}}function ma(a){O.historyOpenMobile=!!a,document.body.classList.toggle("chat-history-open",O.historyOpenMobile)}function pa(){ma(!1)}async function Ue(){if(r.key){O.historyLoading=!0,De();try{const a=O.historyPage*O.historyLimit,s=new URLSearchParams({limit:String(O.historyLimit),offset:String(a)});O.historyQ.trim()&&s.set("q",O.historyQ.trim());const o=await M(`/conversations?${s}`);O.historyItems=o.data||[],O.historyTotal=o.total??0}catch(a){O.historyItems=[],O.historyTotal=0,console.warn(a)}finally{O.historyLoading=!1,De()}}}function De(){const a=document.getElementById("chat-history-list"),s=document.getElementById("chat-history-pager");if(a){if(O.historyLoading&&!O.historyItems.length?a.innerHTML=`<li class="chat-history-empty">${t(e("common.loading"))}</li>`:O.historyItems.length?a.innerHTML=O.historyItems.map(o=>{const n=O.conversationId===o.id?" is-active":"",i=lo(o),d=o.title&&o.preview&&o.preview!==o.title?o.preview:o.model||T("chat.msgs",{n:o.messageCount||0}),l=O.renamingId===o.id,u=i,m=l?`<input type="text" class="chat-history-title-input" data-title-input="${t(o.id)}" value="${t(u)}" maxlength="120" placeholder="${t(e("chat.renamePh"))}" aria-label="${t(e("chat.renamePh"))}" />
            <span class="preview">${t(d||"—")}</span>
            <span class="meta"><span>${t(ae(o.updatedAt))}</span></span>`:`<span class="title" data-title-label="${t(o.id)}" title="${t(e("chat.rename"))}">${t(i)}</span>
            <span class="preview">${t(d||"—")}</span>
            <span class="meta"><span>${t(ae(o.updatedAt))}</span></span>`,p=l?`<div class="chat-history-item${n} is-editing" data-conv-body="${t(o.id)}">${m}</div>`:`<div class="chat-history-item${n}" data-open-conv="${t(o.id)}" role="button" tabindex="0" title="${t(i)}">${m}</div>`;return`
        <li class="chat-history-row${n}${l?" is-renaming":""}" data-conv-row="${t(o.id)}">
          ${p}
          <div class="chat-history-item-actions">
            <button type="button" class="icon-action" data-rename-conv="${t(o.id)}" title="${t(e("chat.rename"))}" aria-label="${t(e("chat.rename"))}">✎</button>
            <button type="button" class="icon-action danger" data-del-conv="${t(o.id)}" title="${t(e("chat.deleteConversation"))}" aria-label="${t(e("chat.deleteConversation"))}">×</button>
          </div>
        </li>`}).join(""):a.innerHTML=`<li class="chat-history-empty">${t(e("chat.historyEmpty"))}</li>`,s){const o=O.historyLimit,n=Math.max(1,Math.ceil(O.historyTotal/o)||1),i=Math.min(O.historyPage+1,n),d=T("chat.historyPage",{n:i,total:n}),l=O.historyPage>0,u=(O.historyPage+1)*o<O.historyTotal;s.innerHTML=`
      <button type="button" class="btn secondary sm" id="chat-hist-prev" ${l?"":"disabled"}>${t(e("chat.historyPrev"))}</button>
      <span>${t(d)}</span>
      <button type="button" class="btn secondary sm" id="chat-hist-next" ${u?"":"disabled"}>${t(e("chat.historyNext"))}</button>
    `;const m=document.getElementById("chat-hist-prev"),p=document.getElementById("chat-hist-next");m&&(m.onclick=()=>{O.historyPage>0&&(O.historyPage-=1,Ue())}),p&&(p.onclick=()=>{(O.historyPage+1)*o<O.historyTotal&&(O.historyPage+=1,Ue())})}if(a.querySelectorAll("[data-open-conv]").forEach(o=>{const n=o.getAttribute("data-open-conv");if(!n)return;let i=null;const d=()=>{i&&(clearTimeout(i),i=null)};o.addEventListener("click",l=>{O.renamingId||l.target instanceof Element&&l.target.closest(".chat-history-item-actions")||(d(),i=setTimeout(()=>{i=null,!O.renamingId&&_a(n)},280))}),o.addEventListener("dblclick",l=>{l.preventDefault(),l.stopPropagation(),d(),ea(n)}),o.addEventListener("keydown",l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),O.renamingId||_a(n))})}),a.querySelectorAll("[data-title-label]").forEach(o=>{o.addEventListener("dblclick",n=>{n.preventDefault(),n.stopPropagation();const i=o.getAttribute("data-title-label");i&&ea(i)})}),a.querySelectorAll("[data-rename-conv]").forEach(o=>{o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const i=o.getAttribute("data-rename-conv");i&&ea(i)})}),a.querySelectorAll("[data-del-conv]").forEach(o=>{o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const i=o.getAttribute("data-del-conv");i&&ho(i)})}),O.renamingId){const o=String(O.renamingId).replace(/\\/g,"\\\\").replace(/"/g,'\\"'),n=a.querySelector(`[data-title-input="${o}"]`);n instanceof HTMLInputElement&&(yo(n,O.renamingId),requestAnimationFrame(()=>{n.isConnected&&(n.focus(),n.select())}))}}}function ea(a){a&&(O.renamingId&&O.renamingId!==a&&(O.renamingId=null),O.renamingId=a,De())}function yo(a,s){let o=!1;const n=async i=>{if(o)return;o=!0;const d=a.value;if(O.renamingId=null,!i){De();return}const l=String(d??"").trim().slice(0,120),u=O.historyItems.find(p=>p.id===s),m=u?(u.title||"").trim():"";if(l===m){De();return}u&&(u.title=l),De();try{await M(`/conversations/${s}`,{method:"PATCH",body:JSON.stringify({title:l})}),await Ue()}catch(p){Q(p.message||e("chat.saveFail")),await Ue()}};a.addEventListener("keydown",i=>{i.stopPropagation(),i.key==="Enter"?(i.preventDefault(),n(!0)):i.key==="Escape"&&(i.preventDefault(),n(!1))}),a.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation()}),a.addEventListener("mousedown",i=>i.stopPropagation()),a.addEventListener("dblclick",i=>{i.preventDefault(),i.stopPropagation()}),a.addEventListener("blur",()=>{setTimeout(()=>n(!0),0)})}async function _a(a){(!a||ve)&&ve&&ve.abort();try{Q("");const s=await M(`/conversations/${a}`),o=s.data||s;O.conversationId=o.id,Ne=0,Re.clear(),te=(o.messages||[]).filter(u=>!u.compressed).map(u=>({role:u.role,content:u.content||"",reasoning:u.reasoning||void 0,docs:u.docs,error:u.error})),ie=[],H.systemPrompt=o.systemPrompt||"",uo(o),o.model&&(H.model=o.model),o.apiKeyId&&(H.keyId=o.apiKeyId);const n=document.getElementById("chat-system");n&&(n.value=H.systemPrompt);const i=document.getElementById("chat-system-wrap");i&&(i.hidden=!H.systemPrompt.trim()&&!H.systemOpen);const d=document.getElementById("chat-model");d&&o.model&&(d.value=o.model);const l=document.getElementById("chat-key-select");l&&o.apiKeyId&&[...l.options].some(m=>m.value===o.apiKeyId)&&(l.value=o.apiKeyId,H.keyId=o.apiKeyId),He(),Qe(),De(),je(),tt(),pa()}catch(s){Q(s.message||e("chat.loadFail"))}}function It(){const a=Ma();return!a||String(a).startsWith("admin-session:")||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(a)?null:a}async function wt(){const a=ro();if(!a.length&&!_.summary)return;if(O.saving){O.saveQueued=!0;return}O.saving=!0,O.saveQueued=!1,pe();const s={messages:a,model:H.model||null,systemPrompt:H.systemPrompt||"",apiKeyId:It(),...co()};try{if(O.conversationId)await M(`/conversations/${O.conversationId}`,{method:"PATCH",body:JSON.stringify(s)});else{if(!a.length)return;const o=await M("/conversations",{method:"POST",body:JSON.stringify({...s,title:""})}),n=o.data||o;O.conversationId=n.id}await Ue()}catch(o){console.warn(o)}finally{O.saving=!1,O.saveQueued&&(O.saveQueued=!1,wt().catch(()=>{}))}}async function ho(a){if(await ee({title:e("chat.deleteConversation"),message:e("chat.deleteConfirm"),variant:"danger",confirmText:e("chat.deleteConversation")}))try{await M(`/conversations/${a}`,{method:"DELETE"}),O.conversationId===a&&(O.conversationId=null,te=[],ie=[],us(),He(),Qe(),je(),tt()),O.historyItems.length<=1&&O.historyPage>0&&(O.historyPage-=1),await Ue()}catch(s){Q(s.message||e("common.requestFailed"))}}function vo(a=!0){ve&&ve.abort(),te=[],ie=[],O.conversationId=null,us(),a||(H.systemPrompt="",H.systemOpen=!1),He(),Qe(),De(),je(),tt()}function Mt(){return r.key}function Ma(){const s=document.getElementById("chat-key-select")?.value||H.keyId||"";return s&&s!=="session"?s:r.me?.id||""}function pe(){const a=document.getElementById("chat-key-select"),s=document.getElementById("chat-model"),o=document.getElementById("chat-reasoning"),n=document.getElementById("chat-system");a&&(H.keyId=a.value==="session"?"":a.value),s&&(H.model=s.value),o&&(H.reasoning=o.checked);const i=document.getElementById("chat-effort");i&&(H.effort=i.value||"");const d=document.getElementById("chat-resume");d&&(H.resumeId=d.value.trim());const l=document.getElementById("chat-fork");l&&(H.forkSession=l.checked);const u=document.getElementById("chat-memory");u&&(H.memory=u.checked);const m=document.getElementById("chat-no-plan");m&&(H.noPlan=m.checked);const p=document.getElementById("chat-perm");p&&(H.permissionMode=p.value||""),n&&(H.systemPrompt=n.value),jt()}function jt(){const a=document.querySelector(".chat-shell"),s=document.getElementById("chat-settings-toggle"),o=document.getElementById("chat-settings-summary"),n=document.getElementById("chat-settings-toggle-label");if(a&&a.classList.toggle("is-settings-open",!!H.settingsOpen),s&&s.setAttribute("aria-expanded",H.settingsOpen?"true":"false"),n&&(n.textContent=H.settingsOpen?e("chat.settingsHide"):e("chat.settings")),o){const i=H.model||"—",d=_.mode==="summary"?"chat.ctxModeSummary":_.mode==="recent"?"chat.ctxModeRecent":"chat.ctxModeFull";o.textContent=`${i} · ${e(d)}`}}function Qe(){const a=document.getElementById("chat-pending");if(a){if(!ie.length){a.innerHTML="",a.hidden=!0;return}a.hidden=!1,a.innerHTML=ie.map((s,o)=>`
      <div class="chat-pending-item" title="${t(s.name)}">
        <span class="name">${t(s.name)}</span>
        <span class="muted">${Be(s.size)}</span>
        <button type="button" class="rm" data-rm-doc="${o}" aria-label="${t(e("chat.removeFile"))}">×</button>
      </div>`).join(""),a.querySelectorAll("[data-rm-doc]").forEach(s=>{s.onclick=()=>{const o=Number(s.getAttribute("data-rm-doc"));ie.splice(o,1),Qe()}})}}function $o(a,s){return`${a}:${(s||"").length}:${(s||"").slice(0,40)}`}function He(){const a=document.getElementById("chat-messages");if(!a)return;const s=a.scrollHeight-a.scrollTop-a.clientHeight<120,o=te.some(c=>c.streaming),n=document.getElementById("chat-stream-status");if(n&&(n.hidden=!o,n.textContent=o?e("chat.streaming"):""),!te.length){a.innerHTML=`
      <div class="chat-empty">
        <strong>${t(e("chat.emptyTitle"))}</strong>
        <p>${t(e("chat.emptyHint"))}</p>
      </div>`,lt();return}const i=te.length,d=Math.max(0,i-cs);Ne>d&&(Ne=d);const l=Ne,u=te.slice(l),m=l,p=m>0?`<div class="chat-load-older">
          <button type="button" class="btn secondary sm" id="chat-load-older">${t(T("chat.loadOlder",{n:m}))}</button>
        </div>`:"";a.innerHTML=p+u.map((c,w)=>{const y=l+w,g=c.role==="user"?"user":"assistant",v=c.role==="user"?e("chat.you"):e("chat.assistant"),S=c.docs&&c.docs.length?`<div class="chat-attach-list">${c.docs.map(I=>`<span class="chat-attach-chip" title="${t(I.name)}"><span>📎 ${t(I.name)}</span></span>`).join("")}</div>`:"",L=!!c.reasoning?`<details class="chat-reasoning" ${c.streaming||!c.content?"open":""}>
            <summary>${t(e("chat.reasoning"))}${c.streaming&&!c.content?` · ${t(e("chat.streaming"))}`:""}</summary>
            <pre>${t(c.reasoning)}</pre>
          </details>`:"";let R=c.content||"";!R&&c.streaming&&(R=c.reasoning?"":"…");const q=c.error?" error":"",j=c.streaming?" is-streaming":"",x=g==="assistant"&&!c.streaming&&!!R;let P;if(x){const I=$o(y,R);if(Re.has(I))P=Re.get(I);else if(P=Va(R),Re.set(I,P),Re.size>200){const F=Re.keys().next().value;Re.delete(F)}}else P=t(R);const K=!c.streaming&&R.length>no,A=`${x?"chat-content md":"chat-content"}${K?" is-collapsible":""}`,f=K?`<button type="button" class="btn ghost sm chat-expand-btn" data-expand="${y}">${t(e("chat.showMore"))}</button>`:"",$=ko(c),U=$?`<div class="muted chat-spend">${t($)}</div>`:"",b=Array.isArray(c.tools)&&c.tools.length?`<div class="chat-tools">${c.tools.map(I=>`<span class="chat-tool-chip" title="${t(I.arguments||"")}">${t(I.name||"tool")}</span>`).join("")}</div>`:"",k=R?`<button type="button" class="chat-copy-btn" data-copy-msg="${y}" title="${t(e("chat.copy"))}">${t(e("chat.copy"))}</button>`:"";return`<div class="chat-bubble ${g}${q}${j}" data-msg-idx="${y}">
        <div class="chat-bubble-head">
          <div class="chat-role">${t(v)}${c.streaming?` <span class="chat-live">${t(e("chat.streaming"))}</span>`:""}</div>
          ${k}
        </div>
        ${S}
        ${L}
        ${b}
        <div class="${A}" data-content-idx="${y}">${P}${c.streaming?'<span class="chat-cursor">▍</span>':""}</div>
        ${f}
        ${U}
      </div>`}).join(""),(s||o)&&(a.scrollTop=a.scrollHeight),lt(),document.getElementById("chat-load-older")?.addEventListener("click",()=>{const c=a.scrollHeight;Ne=Math.max(0,Ne-oo),He();const w=document.getElementById("chat-messages");w&&(w.scrollTop=w.scrollHeight-c)}),a.querySelectorAll("[data-expand]").forEach(c=>{c.addEventListener("click",()=>{const w=a.querySelector(`[data-content-idx="${c.getAttribute("data-expand")}"]`);w&&(w.classList.toggle("is-expanded"),c.textContent=w.classList.contains("is-expanded")?e("chat.showLess"):e("chat.showMore"))})}),a.querySelectorAll("[data-copy-msg]").forEach(c=>{c.addEventListener("click",async w=>{w.preventDefault(),w.stopPropagation();const y=Number(c.getAttribute("data-copy-msg")),g=te[y];if(!g?.content)return;if(await Qt(g.content)){const S=c.textContent;c.textContent=e("chat.copied"),c.classList.add("is-copied"),setTimeout(()=>{c.isConnected&&(c.textContent=S||e("chat.copy"),c.classList.remove("is-copied"))},1600)}else Q(e("chat.copyFail"))})})}function ta(a){const o=a.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),n=o.pop()||"",i=[];for(const d of o){const l=d.trim();if(!l||l.startsWith(":")||!l.startsWith("data:"))continue;const u=l.slice(5).trim();u&&i.push(u)}return{events:i,rest:n}}function ko(a){if(!a||a.streaming)return"";const s=[],o=a.usage;if(o&&(o.prompt_tokens||o.completion_tokens||o.total_tokens)){const i=o.prompt_tokens_details?.cached_tokens,d=i!=null?` · ${e("chat.cacheTokens")}: ${i}`:"";s.push(`${e("chat.tokens")}: ${o.prompt_tokens||0}+${o.completion_tokens||0}=${o.total_tokens||0}${d}`)}const n=a.grok?.cost?.total_cost_usd;return typeof n=="number"&&s.push(`${e("chat.cost")}: $${n.toFixed(6)}`),a.grok?.sessionId&&s.push(`${e("chat.resume")}: ${a.grok.sessionId}`),s.join(" · ")}function At(a,s){if(!s||typeof s!="object")return!1;if(s.error){const l=fa({error:s.error});return a.error=!0,a.content=(a.content||"")+`
✗ ${l}`,!0}const o=s.choices?.[0]?.delta||{};let n=!1;if(o.reasoning_content&&(a.reasoning=(a.reasoning||"")+o.reasoning_content,n=!0),(o.thought&&!o.reasoning_content||o.thought&&o.reasoning_content&&o.thought!==o.reasoning_content)&&(a.reasoning=(a.reasoning||"")+o.thought,n=!0),typeof o.content=="string"&&o.content.length&&(a.content=(a.content||"")+o.content,n=!0),s.usage&&typeof s.usage=="object"&&(a.usage=s.usage,n=!0),s.grok&&typeof s.grok=="object"){if(a.grok={...a.grok||{},...s.grok},a.grok.sessionId){H.resumeId=a.grok.sessionId;const l=document.getElementById("chat-resume");l&&(l.value=a.grok.sessionId)}n=!0}if(s.grok_event&&typeof s.grok_event=="object"){const l=s.grok_event;if(Array.isArray(a.tools)||(a.tools=[]),l.type==="tool_call"||l.type==="tool_call_update"){const u=l.toolCallId,m=u?a.tools.find(y=>y.id===u):null,p=l.toolName||l.title||m?.name||"tool",c=l.rawInput!=null?typeof l.rawInput=="string"?l.rawInput:JSON.stringify(l.rawInput):m?.arguments||"",w=l.status?`${p} (${l.status})`:p;m?(m.name=w,c&&(m.arguments=c)):a.tools.push({id:u,name:w,arguments:c}),n=!0}}const i=s.choices?.[0]?.delta?.tool_calls;if(Array.isArray(i)&&i.length){Array.isArray(a.tools)||(a.tools=[]);for(const l of i){const u=l?.function?.name||l?.name||"tool",m=l?.function?.arguments||"";a.tools.push({id:l?.id,name:u,arguments:typeof m=="string"?m:JSON.stringify(m||{})})}n=!0}const d=s.choices?.[0]?.message;return d&&(d.content&&!a.content&&(a.content=d.content,n=!0),d.reasoning_content&&!a.reasoning&&(a.reasoning=d.reasoning_content,n=!0)),n}function So(a,s){const o=Mt();return o?new Promise((n,i)=>{const d=new FormData;d.append("file",a,a.name);const l=It();l&&d.append("apiKeyId",l);const u=new XMLHttpRequest;u.open("POST","/admin/api/documents"),u.setRequestHeader("Authorization",`Bearer ${o}`),u.upload.onprogress=m=>{if(s)if(m.lengthComputable&&m.total>0){const p=Math.min(100,Math.round(m.loaded/m.total*100));s({loaded:m.loaded,total:m.total,percent:p})}else s({loaded:m.loaded||0,total:0,percent:-1})},u.onload=()=>{let m=null;try{m=u.responseText?JSON.parse(u.responseText):null}catch{m=null}if(u.status<200||u.status>=300){const w=m?.error?.message||m?.message||u.responseText||u.statusText;i(new Error(w||e("chat.uploadFail")));return}const p=m?.data||m,c=p?.id;if(!c||typeof c!="string"){i(new Error(e("chat.uploadFail")));return}n({id:c,name:p.originalName||p.filename||a.name,mime:p.mimeType||a.type||"",size:p.sizeBytes??p.size??a.size??0})},u.onerror=()=>i(new Error(e("chat.uploadFail"))),u.onabort=()=>i(new Error(e("chat.uploadFail"))),u.send(d)}):Promise.reject(new Error(e("chat.needKey")))}function Tt(a){const s=document.getElementById("chat-upload-progress");if(!s)return;const{visible:o,fileName:n,fileIndex:i,fileTotal:d,percent:l,indeterminate:u}=a;if(!o){s.hidden=!0,s.setAttribute("aria-hidden","true");return}s.hidden=!1,s.setAttribute("aria-hidden","false");const m=document.getElementById("chat-upload-label"),p=document.getElementById("chat-upload-bar"),c=document.getElementById("chat-upload-pct"),w=n||"",y=i||1,g=d||1;m&&(m.textContent=g>1?T("chat.uploadProgressMulti",{name:w,i:y,n:g}):T("chat.uploadProgress",{name:w}));const v=!!u||l<0;p&&(p.classList.toggle("is-indeterminate",v),v?p.style.width="40%":p.style.width=`${Math.max(0,Math.min(100,l))}%`),c&&(c.textContent=v?e("chat.uploading"):T("common.percent",{n:Math.max(0,Math.min(100,l))}))}function wo(a){const s=Array.isArray(a)?a:[];if(!s.length)return{added:0,skipped:0};let o=0,n=0;const i=new Set(ie.map(d=>d.id));for(const d of s){if(ie.length>=Ft){n+=s.length-o-n;break}const l=d?.id,u=d?.name||d?.originalName||"";if(!l||!Ia.test(String(l))){n+=1;continue}if(!Nt(u)){n+=1;continue}if(i.has(l)){n+=1;continue}ie.push({id:l,name:u||l,mime:d.mime||d.mimeType||"",size:d.size??d.sizeBytes??0}),i.add(l),o+=1}return Qe(),{added:o,skipped:n}}async function Po(){if(!Mt()){Q(e("chat.needKey"));return}const a=It(),s=Math.max(0,Ft-ie.length);if(s<=0){Q(e("chat.tooManyFiles"));return}const o=new Map;let n=0;ct({title:e("chat.libraryTitle"),subtitle:t(e("chat.librarySubtitle")),size:"md",bodyHtml:`
      <div class="chat-lib">
        <div class="chat-lib-toolbar">
          <input type="search" id="chat-lib-q" class="chat-lib-search" placeholder="${t(e("chat.librarySearch"))}" autocomplete="off" />
          <span class="muted chat-lib-count" id="chat-lib-count">${t(T("chat.librarySelected",{n:0}))}</span>
        </div>
        <div class="muted chat-lib-formats">${t(e("chat.formatsLabel"))}: ${t(Kt())}</div>
        <div id="chat-lib-list" class="chat-lib-list" role="listbox" aria-multiselectable="true">
          <div class="muted chat-lib-status">${t(e("common.loading")||"…")}</div>
        </div>
      </div>`,footerHtml:`
      <button type="button" class="btn secondary sm" id="chat-lib-cancel">${t(e("common.cancel"))}</button>
      <button type="button" class="btn sm" id="chat-lib-add" disabled>${t(e("chat.libraryAdd"))}</button>`});const i=document.getElementById("chat-lib-list"),d=document.getElementById("chat-lib-q"),l=document.getElementById("chat-lib-count"),u=document.getElementById("chat-lib-add");document.getElementById("chat-lib-cancel")?.addEventListener("click",()=>he());const m=()=>{l&&(l.textContent=T("chat.librarySelected",{n:o.size})),u&&(u.disabled=o.size===0,u.textContent=o.size>0?`${e("chat.libraryAdd")} (${o.size})`:e("chat.libraryAdd"))},p=y=>{if(!i)return;const g=new Set(ie.map(S=>S.id)),v=(y||[]).filter(S=>Nt(S.originalName));if(!v.length){i.innerHTML=`<div class="data-empty chat-lib-empty"><strong>${t(e("chat.libraryEmpty"))}</strong></div>`;return}i.innerHTML=v.map(S=>{const C=g.has(S.id),L=o.has(S.id),R=C&&!L;return`
          <label class="chat-lib-row ${C?"is-already":""} ${L?"is-selected":""}" data-id="${t(S.id)}">
            <input type="checkbox" data-lib-id="${t(S.id)}" ${L?"checked":""} ${R?"disabled":""} />
            <span class="chat-lib-meta">
              <span class="chat-lib-name" title="${t(S.originalName)}">${t(S.originalName)}</span>
              <span class="muted">${t(S.mimeType||"")} · ${Be(S.sizeBytes||0)}${C?` · ${t(e("chat.libraryAlready"))}`:""}</span>
            </span>
          </label>`}).join(""),i.querySelectorAll("input[data-lib-id]").forEach(S=>{S.addEventListener("change",()=>{const C=S.getAttribute("data-lib-id"),L=v.find(q=>q.id===C);if(!L)return;if(S.checked){if(o.size>=s&&!o.has(C)){S.checked=!1,Q(e("chat.tooManyFiles"));return}o.set(C,L)}else o.delete(C);const R=S.closest(".chat-lib-row");R&&R.classList.toggle("is-selected",S.checked),m()})})},c=async()=>{const y=++n;i&&(i.innerHTML=`<div class="muted chat-lib-status">${t(e("common.loading")||"…")}</div>`);try{const g=new URLSearchParams({limit:"50",offset:"0"});a&&g.set("apiKeyId",a);const v=(d?.value||"").trim();v&&g.set("q",v);const S=await M(`/documents?${g}`);if(y!==n)return;p(S.data||[])}catch(g){if(y!==n)return;i&&(i.innerHTML=`<div class="error-box">${t(g.message||e("chat.libraryLoadFail"))}</div>`)}};let w=null;d?.addEventListener("input",()=>{w&&clearTimeout(w),w=setTimeout(()=>c(),280)}),u?.addEventListener("click",()=>{const y=[...o.values()],{added:g}=wo(y.map(v=>({id:v.id,name:v.originalName,mime:v.mimeType,size:v.sizeBytes})));he(),g>0&&Q("")}),m(),await c(),d?.focus()}async function fs(a){const s=[...a||[]];if(!s.length)return;if(!Mt()){Q(e("chat.needKey"));return}const o=s.filter(u=>!Nt(u.name)),n=s.filter(u=>Nt(u.name));if(o.length&&(Q(T("chat.formatsReject",{name:o.map(u=>u.name).join(", "),formats:Kt()})),!n.length))return;if(ie.length+n.length>Ft){Q(e("chat.tooManyFiles"));return}const i=document.getElementById("chat-attach"),d=document.getElementById("chat-send");i&&(i.disabled=!0,i.textContent=e("chat.uploading")),d&&(d.disabled=!0);const l=n.length;try{let u=0;for(const m of n){if(ie.length>=Ft)break;u+=1,Tt({visible:!0,fileName:m.name,fileIndex:u,fileTotal:l,percent:0,indeterminate:!1});const p=await So(m,({percent:c})=>{Tt({visible:!0,fileName:m.name,fileIndex:u,fileTotal:l,percent:c<0?0:c,indeterminate:c<0})});Tt({visible:!0,fileName:m.name,fileIndex:u,fileTotal:l,percent:100,indeterminate:!1}),ie.some(c=>c.id===p.id)||ie.push(p),Qe()}o.length||Q("")}catch(u){Q(u.message||e("chat.uploadFail"))}finally{Tt({visible:!1}),i&&(i.disabled=!1,i.textContent=e("chat.attach")),d&&(d.disabled=!1)}}function Eo(){const a=r.me?.id||"",s=r.me?`${e("chat.useSessionKey")} · ${r.me.name||""} (${r.me.keyPrefix||""}…)`:e("chat.useSessionKey"),o=H.keyId||"session",n=(r.keys||[]).filter(d=>d.isActive!==!1),i=[`<option value="session" ${o==="session"||o===a||!o?"selected":""}>${t(s)}</option>`];for(const d of n){if(a&&d.id===a)continue;const l=`${d.name||"key"} · ${d.keyPrefix||""}… · ${d.role||""}/${d.mode||""}`;i.push(`<option value="${t(d.id)}" ${o===d.id?"selected":""}>${t(l)}</option>`)}return i.join("")}function Io(a,s,o){const n=new Set,i=[],d=l=>{const u=String(l||"").trim();!u||n.has(u)||(n.add(u),i.push(u))};for(const l of s||[])d(l.id||l);for(const l of o||[])d(l.id||l);for(const l of a||[])l!=="echo"&&d(l);return d("echo"),i}async function Mo(){const[,,a]=await Promise.all([St(!1),Et(),M("/catalog").catch(()=>({loaded:[],local:[]}))]),s=Io(r.models||[],a.loaded||[],a.local||[]);r.models=s;const o=a.loaded&&a.loaded[0]&&a.loaded[0].id||s.find(c=>c!=="echo")||"echo";(!H.model||H.model==="echo"||!s.includes(H.model))&&(H.model=o);const n=s.map(c=>`<option value="${t(c)}" ${H.model===c?"selected":""}>${t(c)}</option>`).join("");ma(!1),document.getElementById("app").innerHTML=le(`
    <div class="chat-page" id="chat-page">
      <div class="chat-drop-overlay" id="chat-drop-overlay" hidden aria-hidden="true">
        <div class="chat-drop-overlay-card">
          <div class="chat-drop-overlay-icon" aria-hidden="true">📎</div>
          <strong>${t(e("chat.dropTitle"))}</strong>
          <span class="muted">${t(e("chat.dropHint"))}</span>
        </div>
      </div>
      <div class="topbar">
        <h2>${t(e("chat.title"))}</h2>
        <div class="toolbar">
          <button type="button" class="btn secondary sm" id="chat-history-toggle">${t(e("chat.historyOpen"))}</button>
          <button type="button" class="btn secondary sm" id="chat-compress" title="${t(e("chat.compress"))}">${t(e("chat.compress"))}</button>
          <button type="button" class="btn secondary sm" id="chat-new">${t(e("chat.new"))}</button>
        </div>
      </div>
      <div class="chat-body">
        <div class="chat-history-backdrop" id="chat-history-backdrop"></div>
        <div class="chat-shell${H.settingsOpen?" is-settings-open":""}">
          <div class="chat-settings-bar">
            <button type="button" class="chat-settings-toggle" id="chat-settings-toggle" aria-expanded="${H.settingsOpen?"true":"false"}" aria-controls="chat-toolbar">
              <span class="chat-settings-summary" id="chat-settings-summary"></span>
              <span class="chat-settings-caret" id="chat-settings-toggle-label">${t(H.settingsOpen?e("chat.settingsHide"):e("chat.settings"))}</span>
            </button>
          </div>
          <div class="chat-toolbar" id="chat-toolbar">
            <label class="chat-field-full">${t(e("chat.keySelect"))}
              <select id="chat-key-select">${Eo()}</select>
            </label>
            <label>${t(e("chats.model"))}
              <select id="chat-model">${n||'<option value="echo">echo</option>'}</select>
            </label>
            <label class="check-inline" for="chat-reasoning">
              <input type="checkbox" id="chat-reasoning" ${H.reasoning!==!1?"checked":""} />
              ${t(e("chat.includeReasoning"))}
            </label>
            <label class="chat-ctx-label">${t(e("chat.effort"))}
              <select id="chat-effort">
                ${["","none","minimal","low","medium","high","xhigh","max"].map(c=>{const w=e(c?`chat.effort_${c}`:"chat.effortDefault"),y=(H.effort||"")===c?" selected":"";return`<option value="${t(c)}"${y}>${t(w)}</option>`}).join("")}
              </select>
            </label>
            <label class="chat-ctx-label">${t(e("chat.ctxMode"))}
              <select id="chat-ctx-mode">
                <option value="full">${t(e("chat.ctxModeFull"))}</option>
                <option value="summary">${t(e("chat.ctxModeSummary"))}</option>
                <option value="recent">${t(e("chat.ctxModeRecent"))}</option>
              </select>
            </label>
            <label class="chat-ctx-label chat-ctx-n-label">${t(e("chat.ctxRecentN"))}
              <input type="number" id="chat-ctx-n" min="2" max="40" value="${_.recentN}" />
            </label>
            <button type="button" class="btn ghost sm chat-field-full" id="chat-system-toggle" title="${t(e("chat.systemHint"))}">
              ${t(e("chat.systemPrompt"))}${H.systemPrompt?" ·":""}
            </button>
            <label class="chat-ctx-label chat-field-full" title="${t(e("chat.resumeHint"))}">${t(e("chat.resume"))}
              <input type="text" id="chat-resume" value="${t(H.resumeId||"")}" placeholder="${t(e("chat.resumePh"))}" spellcheck="false" />
            </label>
            <div class="chat-checks">
            <label class="check-inline" for="chat-fork">
              <input type="checkbox" id="chat-fork" ${H.forkSession?"checked":""} />
              ${t(e("chat.fork"))}
            </label>
            <label class="check-inline" for="chat-memory">
              <input type="checkbox" id="chat-memory" ${H.memory?"checked":""} />
              ${t(e("chat.memory"))}
            </label>
            <label class="check-inline" for="chat-no-plan">
              <input type="checkbox" id="chat-no-plan" ${H.noPlan?"checked":""} />
              ${t(e("chat.noPlan"))}
            </label>
            </div>
            <label class="chat-ctx-label chat-field-full">${t(e("chat.permission"))}
              <select id="chat-perm">
                ${["","default","acceptEdits","auto","dontAsk","bypassPermissions","plan"].map(c=>{const w=c||e("chat.effortDefault"),y=(H.permissionMode||"")===c?" selected":"";return`<option value="${t(c)}"${y}>${t(w)}</option>`}).join("")}
              </select>
            </label>
          </div>
          <div class="chat-system-wrap" id="chat-system-wrap" ${H.systemOpen||H.systemPrompt?"":"hidden"}>
            <label class="chat-system-label" for="chat-system">${t(e("chat.systemPrompt"))}
              <span class="hint">${t(e("chat.systemHint"))}</span>
            </label>
            <textarea id="chat-system" rows="3" placeholder="${t(e("chat.systemPlaceholder"))}">${t(H.systemPrompt||"")}</textarea>
          </div>
          <div id="chat-compress-banner" class="chat-compress-banner" hidden></div>
          <div id="chat-messages" class="chat-messages"></div>
          <div class="chat-composer" id="chat-composer">
            <div id="chat-pending" class="chat-pending" hidden></div>
            <div id="chat-upload-progress" class="chat-upload-progress" hidden aria-hidden="true">
              <div class="chat-upload-meta">
                <span id="chat-upload-label" class="chat-upload-label"></span>
                <span id="chat-upload-pct" class="chat-upload-pct"></span>
              </div>
              <div class="chat-upload-track" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                <div id="chat-upload-bar" class="chat-upload-bar"></div>
              </div>
            </div>
            <div id="chat-stream-status" class="chat-stream-status" hidden></div>
            <textarea id="chat-input" rows="2" placeholder="${t(e("chat.placeholder"))}"></textarea>
            <div class="chat-composer-actions">
              <div class="chat-composer-left">
                <input type="file" id="chat-file" class="chat-file-input" multiple accept="${t(Ps)}" />
                <button type="button" class="btn secondary sm" id="chat-attach" title="${t(e("chat.attachHint"))}">${t(e("chat.attach"))}</button>
                <button type="button" class="btn secondary sm" id="chat-attach-lib" title="${t(e("chat.libraryTitle"))}">${t(e("chat.attachLibrary"))}</button>
                <span class="chat-formats-hint" title="${t(Kt())}">
                  <span class="chat-formats-label">${t(e("chat.formatsLabel"))}</span>
                  <span class="muted">${t(Kt())}</span>
                </span>
              </div>
              <div class="chat-composer-right">
                <button type="button" class="btn secondary sm" id="chat-stop" disabled>${t(e("chat.stop"))}</button>
                <button type="button" class="btn sm" id="chat-send">${t(e("chat.send"))}</button>
              </div>
            </div>
          </div>
        </div>
        <aside class="chat-history-rail" id="chat-history-rail" aria-label="${t(e("chat.history"))}">
          <div class="chat-history-head">
            <div class="chat-history-head-row">
              <h3>${t(e("chat.history"))}</h3>
              <button type="button" class="btn ghost sm" id="chat-history-close-mobile" aria-label="${t(e("chat.historyClose"))}">×</button>
            </div>
            <input type="search" id="chat-history-search" class="chat-history-search" placeholder="${t(e("chat.historySearch"))}" value="${t(O.historyQ)}" />
          </div>
          <ul class="chat-history-list" id="chat-history-list"></ul>
          <div class="chat-history-pager" id="chat-history-pager"></div>
        </aside>
      </div>
    </div>
  `),de(),He(),Qe(),De(),lt(),je(),tt(),jt(),Ue().catch(()=>{}),document.getElementById("chat-settings-toggle")?.addEventListener("click",()=>{H.settingsOpen=!H.settingsOpen,jt()}),document.getElementById("chat-key-select").onchange=()=>pe();const i=document.getElementById("chat-ctx-mode"),d=document.getElementById("chat-ctx-n");i&&(i.onchange=()=>{const c=i.value;if(c==="summary"&&!_.summary){Q(e("chat.compressNeedSummary")),i.value=_.mode==="recent"?"recent":"full";return}_.mode=c==="summary"||c==="recent"?c:"full",je(),tt(),wt().catch(()=>{})}),d&&(d.onchange=()=>{_.recentN=Math.min(40,Math.max(2,Number(d.value)||6)),je(),wt().catch(()=>{})}),document.getElementById("chat-model").onchange=()=>pe(),document.getElementById("chat-reasoning").onchange=()=>pe(),document.getElementById("chat-effort")?.addEventListener("change",()=>pe()),document.getElementById("chat-resume")?.addEventListener("change",()=>pe()),document.getElementById("chat-fork")?.addEventListener("change",()=>pe()),document.getElementById("chat-memory")?.addEventListener("change",()=>pe()),document.getElementById("chat-no-plan")?.addEventListener("change",()=>pe()),document.getElementById("chat-perm")?.addEventListener("change",()=>pe()),document.getElementById("chat-system").oninput=()=>pe(),document.getElementById("chat-system-toggle").onclick=()=>{pe(),H.systemOpen=!H.systemOpen;const c=document.getElementById("chat-system-wrap");c&&(c.hidden=!H.systemOpen&&!H.systemPrompt.trim()),H.systemOpen&&document.getElementById("chat-system")?.focus()},document.getElementById("chat-new").onclick=()=>{vo(!0)},document.getElementById("chat-compress").onclick=()=>{bo().catch(()=>{})},document.getElementById("chat-stop").onclick=()=>{ve&&ve.abort()},document.getElementById("chat-send").onclick=()=>Ra(),document.getElementById("chat-attach").onclick=()=>{document.getElementById("chat-file")?.click()},document.getElementById("chat-attach-lib")?.addEventListener("click",()=>{Po().catch(c=>Q(c.message||e("chat.libraryLoadFail")))}),document.getElementById("chat-file").onchange=c=>{const w=c.target;fs(w.files).finally(()=>{w.value=""})};const l=document.getElementById("chat-history-toggle"),u=document.getElementById("chat-history-backdrop"),m=document.getElementById("chat-history-close-mobile");l&&(l.onclick=()=>{ma(!O.historyOpenMobile)}),u&&(u.onclick=()=>pa()),m&&(m.onclick=()=>pa());const p=document.getElementById("chat-history-search");p&&(p.oninput=()=>{O.historyQ=p.value,Zt&&clearTimeout(Zt),Zt=setTimeout(()=>{O.historyPage=0,Ue()},280)}),xo(),document.getElementById("chat-input").onkeydown=c=>{c.key==="Enter"&&!c.shiftKey&&(c.preventDefault(),Ra())}}function xo(){const a=document.getElementById("chat-page"),s=document.getElementById("chat-drop-overlay"),o=document.getElementById("chat-composer");if(!a)return;let n=0;const i=y=>{const g=y.dataTransfer?.types;return g?typeof g.includes=="function"?g.includes("Files"):[...g].includes("Files"):!1},d=y=>{a.classList.toggle("is-file-drag",y),o&&o.classList.toggle("is-dragover",y),s&&(s.hidden=!y,s.setAttribute("aria-hidden",y?"false":"true"))},l=y=>{i(y)&&(y.preventDefault(),y.stopPropagation(),n+=1,d(!0))},u=y=>{i(y)&&(y.preventDefault(),y.stopPropagation(),y.dataTransfer&&(y.dataTransfer.dropEffect="copy"),d(!0))},m=y=>{i(y)&&(y.preventDefault(),y.stopPropagation(),n=Math.max(0,n-1),n===0&&d(!1))},p=y=>{if(!i(y))return;y.preventDefault(),y.stopPropagation(),n=0,d(!1);const g=y.dataTransfer?.files;g?.length&&fs(g).catch(v=>Q(v.message||e("chat.uploadFail")))};a.addEventListener("dragenter",l),a.addEventListener("dragover",u),a.addEventListener("dragleave",m),a.addEventListener("drop",p);const c=y=>{r.page==="chat"&&i(y)&&y.preventDefault()},w=y=>{r.page==="chat"&&i(y)&&y.preventDefault()};window.addEventListener("dragover",c),window.addEventListener("drop",w),a._chatDropCleanup=()=>{window.removeEventListener("dragover",c),window.removeEventListener("drop",w)}}function qo(a){const s=new Set,o=[],n=i=>{if(!i||typeof i!="string")return;const d=i.trim();!Ia.test(d)||s.has(d)||(s.add(d),o.push(d))};for(const i of a||[])n(i?.id);for(const i of te)if(i?.docs?.length)for(const d of i.docs)n(d?.id);return o}async function Ra(){pe();const a=document.getElementById("chat-input");let s=a?.value.trim()||"";const o=[...ie];if(!s&&!o.length){Q(e("chat.needContent"));return}const n=Mt();if(!n){Q(e("chat.needKey"));return}if(!s&&o.length&&(s=e("chat.fileOnlyPrompt")),o.filter(L=>!L?.id||!Ia.test(String(L.id))).length){Q(e("chat.uploadFail"));return}const d=document.getElementById("chat-model")?.value||H.model||"echo",l=document.getElementById("chat-reasoning")?.checked!==!1,u=document.getElementById("chat-effort")?.value||H.effort||"";Ma();const m=o.map(L=>({id:L.id,name:L.name})),p=qo(o);te.push({role:"user",content:s,docs:m.length?m:void 0}),a&&(a.value=""),ie=[],Qe();const c={role:"assistant",content:"",reasoning:"",streaming:!0};te.push(c),Ne=Math.max(0,te.length-cs),He();const y=mo(),g=document.getElementById("chat-send"),v=document.getElementById("chat-stop"),S=document.getElementById("chat-attach"),C=document.getElementById("chat-attach-lib");g&&(g.disabled=!0),S&&(S.disabled=!0),C&&(C.disabled=!0),v&&(v.disabled=!1),ve=new AbortController;try{const L={model:d,stream:!0,include_reasoning:l,messages:y};u&&(L.reasoning_effort=u),pe(),H.resumeId&&(L.resume=H.resumeId),H.forkSession&&(L.fork_session=!0),H.memory&&(L.experimental_memory=!0),H.noPlan&&(L.no_plan=!0),H.permissionMode&&(L.permission_mode=H.permissionMode),p.length&&(L.document_ids=p);const R=It();R&&(L.apiKeyId=R);const q=await fetch("/admin/api/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${n}`,"Content-Type":"application/json"},body:JSON.stringify(L),signal:ve.signal});if(!q.ok){const j=await q.text();let x=j;try{x=JSON.parse(j).error?.message||j}catch{}throw new Error(x||q.statusText)}if(q.body&&typeof q.body.getReader=="function"){const j=q.body.getReader(),x=new TextDecoder;let P="",K=0;const A=(f=!1)=>{const $=performance.now();(f||$-K>40)&&(K=$,He())};for(;;){const{done:f,value:$}=await j.read();if(f)break;P+=x.decode($,{stream:!0});const{events:U,rest:b}=ta(P);P=b;let k=!1;for(const I of U)if(I!=="[DONE]")try{const F=JSON.parse(I);At(c,F)&&(k=!0)}catch{}k&&A(!1)}if(P.trim()){const{events:f}=ta(P+`
`);for(const $ of f)if($!=="[DONE]")try{At(c,JSON.parse($))}catch{}}A(!0)}else{const j=await q.text(),{events:x}=ta(j+`
`);for(const P of x)if(P!=="[DONE]")try{At(c,JSON.parse(P))}catch{try{const K=JSON.parse(j);At(c,K)}catch{}}He()}!c.content&&!c.reasoning&&(c.content=e("chat.emptyReply")),Q("")}catch(L){L.name==="AbortError"?c.content=(c.content||"")+`
[${e("chat.stopped")}]`:(c.error=!0,c.content=(c.content||"")+`
✗ ${L.message||L}`,Q(L.message||String(L)))}finally{c.streaming=!1,ve=null,He(),lt(),g&&(g.disabled=!1),S&&(S.disabled=!1),C&&(C.disabled=!1),v&&(v.disabled=!0),wt().catch(()=>{})}}const aa="email@ysk.hk",Ao="https://github.com/sponsors/yanshekki",To="https://linktr.ee/yanshekki",Bo="https://ysk.hk/",Co="https://github.com/yanshekki/ysk-omni#readme";async function Lo(){const s=[[e("support.netEvm"),"yanshekki.eth"],[e("support.netNear"),"yanshekki.near"],[e("support.netAda"),"$yanshekki"]].map(([o,n])=>`
      <tr>
        <td>${t(o)}</td>
        <td><code class="cell-code">${t(n)}</code></td>
        <td class="row-actions"><button type="button" class="btn secondary sm" data-copy="${t(n)}">${t(e("support.copy"))}</button></td>
      </tr>`).join("");document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("support.title"))}</h2>
    </div>
    ${ke([e("support.subtitle")])}
    <div class="support-pills" role="navigation">
      <button type="button" class="seg-tab is-active" data-jump="support-creator">${t(e("support.pillSupport"))}</button>
      <button type="button" class="seg-tab" data-jump="support-sponsor">${t(e("support.pillSponsor"))}</button>
      <a class="seg-tab" href="mailto:${aa}">${t(e("support.pillHelp"))}</a>
    </div>
    <div class="support-stack">
      <section class="panel support-panel" id="support-creator">
        <div class="panel-h"><strong>${t(e("support.creatorTitle"))}</strong></div>
        <div class="panel-pad"><p class="support-prose">${t(e("support.creatorBody"))}</p></div>
      </section>
      <section class="panel support-panel" id="support-sponsor">
        <div class="panel-h"><strong>${t(e("support.sponsorTitle"))}</strong></div>
        <div class="panel-pad">
          <p class="support-prose">${t(e("support.sponsorBody"))}</p>
          <div class="support-actions">
            <a class="btn" href="${Ao}" target="_blank" rel="noopener noreferrer">${t(e("support.githubSponsors"))}</a>
            <a class="btn secondary" href="${To}" target="_blank" rel="noopener noreferrer">${t(e("support.linktree"))}</a>
          </div>
          <div class="support-wallets">
            <div class="support-wallets-h">
              <strong>${t(e("support.walletsTitle"))}</strong>
              <span class="muted">${t(e("support.walletsHint"))}</span>
            </div>
            <table class="data-table">
              <thead><tr>
                <th>${t(e("support.net"))}</th>
                <th>${t(e("support.addr"))}</th>
                <th></th>
              </tr></thead>
              <tbody>${s}</tbody>
            </table>
          </div>
        </div>
      </section>
      <section class="panel support-panel" id="support-ysk">
        <div class="panel-h"><strong>${t(e("support.yskTitle"))}</strong></div>
        <div class="panel-pad">
          <p class="support-prose">${t(e("support.yskBody"))}</p>
          <ul class="support-list">
            <li>${t(e("support.yskLi1"))}</li>
            <li>${t(e("support.yskLi2"))}</li>
            <li>${t(e("support.yskLi3"))}</li>
            <li>${t(e("support.yskLi4"))}</li>
          </ul>
          <p class="muted">${t(e("support.yskPrice"))}</p>
          <a class="btn secondary sm" href="${Bo}" target="_blank" rel="noopener noreferrer">${t(e("support.site"))}</a>
        </div>
      </section>
      <section class="panel support-panel" id="support-help">
        <div class="panel-h"><strong>${t(e("support.helpTitle"))}</strong></div>
        <div class="panel-pad">
          <p class="support-prose">${t(e("support.helpBody"))}</p>
          <a class="btn support-email-btn" href="mailto:${aa}">${aa}</a>
          <p class="support-docs"><a href="${Co}" target="_blank" rel="noopener noreferrer">${t(e("support.docs"))}</a></p>
        </div>
      </section>
    </div>
  `),de(),document.querySelectorAll("[data-jump]").forEach(o=>{o.addEventListener("click",()=>{const n=o.getAttribute("data-jump");n&&document.getElementById(n)?.scrollIntoView({behavior:"smooth",block:"start"})})}),document.querySelectorAll("[data-copy]").forEach(o=>{o.addEventListener("click",async()=>{const n=o.getAttribute("data-copy")||"",i=await Qt(n);o.textContent=e(i?"chat.copied":"support.copy"),setTimeout(()=>{o.textContent=e("support.copy")},1400)})})}const Ho=[{id:"Qwen/Qwen2.5-0.5B-Instruct-GGUF",modality:"text",runtime:"llamacpp",quants:["Q4_K_M","Q5_K_M","Q8_0"],vramMb:512},{id:"Qwen/Qwen2.5-7B-Instruct",modality:"text",runtime:"vllm",quants:[],vramMb:16e3},{id:"Tongyi-MAI/Z-Image-Turbo",label:"Z-Image-Turbo",modality:"image",runtime:"diffusion",quants:[],vramMb:8e3},{id:"black-forest-labs/FLUX.2-klein-4B",label:"FLUX.2 Klein 4B",modality:"image",runtime:"diffusion",quants:[],vramMb:8e3},{id:"Qwen/Qwen3-TTS",modality:"tts",runtime:"diffusion",quants:[],vramMb:4e3},{id:"Systran/faster-whisper-small",modality:"stt",runtime:"whisper",quants:[],vramMb:1e3},{id:"Lightricks/LTX-2.5",label:"LTX-2.5",modality:"video",runtime:"diffusion",quants:[],vramMb:12e3},{id:"Wan-AI/Wan2.2",label:"Wan 2.2",modality:"video",runtime:"diffusion",quants:[],vramMb:2e4}];function sa(a){return a.label||String(a.id||"").split("/").pop()||a.id||""}function Fa(a,s){const o=String(a.id||"");return(s||[]).filter(n=>n.id===o||n.repoId===o||String(n.id||"").startsWith(`${o}:`))}function Bt(a){const s=`catalog.mod.${a}`;return xe(s)?e(s):a||"—"}function Do(a){const s=a||[];return s.includes("Q4_K_M")?"Q4_K_M":s[0]||""}function Oo(a){const s=Number(a)||0;return s>=1e6?`${(s/1e6).toFixed(1)}M`:s>=1e3?`${(s/1e3).toFixed(1)}k`:String(s)}function dt(a){const s=Number(a)||0;return s<=0?"—":s>=1024?`${(s/1024).toFixed(1)} GB`:`${Math.round(s).toLocaleString()} MB`}function oa(a,s){const o=r.catalogPull||{},n=s||o.id===a,i=n?o.bytes:0,d=n?o.total:0,l=d>0?Math.min(100,Math.max(0,Math.round(i/d*100))):0,u=n&&d>0?`${l}% · ${dt(i/(1024*1024))} / ${dt(d/(1024*1024))}`:e("catalog.pulling");return`
    <div class="catalog-pull-progress${n&&d<=0?" is-indeterminate":""}" data-pull-status="${t(a)}" data-pull-live="${n?"1":""}" ${n?"":"hidden"}>
      <div class="catalog-pull-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${l}">
        <span style="width:${n&&d>0?l:0}%"></span>
      </div>
      <div class="catalog-pull-meta muted">${t(u)}</div>
    </div>`}function Na(a){const s=a?.status,o=a?.entry?.path;if(s==="done"&&o)return;const n=String(a?.reason||"");throw n.includes("no GGUF")?new Error(e("catalog.pullNoGguf")):new Error(n||e("catalog.pullFail"))}function _o(a,s,o){if(!a)return;a.hidden=!1;const n=a.querySelector(".catalog-pull-bar"),i=a.querySelector(".catalog-pull-bar > span"),d=a.querySelector(".catalog-pull-meta"),l=Number(s)||0,u=Number(o)||0;if(u>0){const m=Math.min(100,Math.max(0,Math.round(l/u*100)));a.classList.remove("is-indeterminate"),i&&(i.style.width=`${m}%`),n&&n.setAttribute("aria-valuenow",String(m)),d&&(d.textContent=`${m}% · ${dt(l/(1024*1024))} / ${dt(u/(1024*1024))}`)}else a.classList.add("is-indeterminate"),i&&(i.style.width="40%"),d&&(d.textContent=e("catalog.pulling"))}function pt(a,s,o){r.catalogPulling=a||"",r.catalogPull={id:a||"",bytes:Number(s)||0,total:Number(o)||0};const n=document.getElementById("cat-pull-banner");n&&(n.hidden=!a),document.querySelectorAll('[data-pull-live="1"]').forEach(i=>{_o(i,s,o)})}function Ct(){r.catalogPulling="",r.catalogPull={id:"",bytes:0,total:0};const a=document.getElementById("cat-pull-banner");a&&(a.hidden=!0)}async function gt({append:a=!1}={}){if(!r.catalogHubBusy){r.catalogHubBusy=!0;try{const s=new URLSearchParams;r.catalogHubQ&&s.set("q",r.catalogHubQ),r.catalogModality&&s.set("modality",r.catalogModality),a&&r.catalogHubNext&&s.set("cursor",r.catalogHubNext);const o=await M(`/catalog/hub?${s}`),n=o.hits||[];r.catalogHubHits=a?[...r.catalogHubHits||[],...n]:n,r.catalogHubNext=o.nextCursor||""}catch(s){a||(r.catalogHubHits=[]),h(s)}finally{r.catalogHubBusy=!1,await we()}}}async function we(){let a={};try{a=await M("/catalog")}catch(b){h(b)}const s=a.packs&&a.packs.length?a.packs:Ho,o=a.local||[],n=a.loaded||[];a.popularSyncedAt&&(r.catalogPopularSyncedAt=a.popularSyncedAt),r.catalogHubHits==null&&Array.isArray(a.popular)&&a.popular.length&&(r.catalogHubHits=a.popular);const i=new Set(n.map(b=>b.id)),d=a.usedMb??0,l=a.budgetMb??0,u=l?Math.min(100,Math.round(d/l*100)):0,m=r.catalogTab==="hub"||r.catalogTab==="local"?r.catalogTab:"local";r.catalogTab=m;const p=r.catalogModality||"",c=["text","image","video","tts","stt"],w=p?s.filter(b=>b.modality===p):s,y=r.catalogPulling||r.catalogPull?.id||"",g=w.map(b=>{const k=Fa(b,o),I=b.quants||[],F=Do(I),Z=I.length?`<select class="catalog-quant-select" data-quant-for="${t(b.id)}">${I.map(W=>`<option value="${t(W)}" ${W===F?"selected":""}>${t(W)}</option>`).join("")}</select>`:`<span class="muted">${t(e("catalog.noQuant"))}</span>`,z=y===b.id,G=z?e("catalog.pulling"):k.length?e("catalog.pullAgain"):e("catalog.pull");return`
      <tr>
        <td>
          <div class="cell-primary">${t(sa(b))}</div>
          <div class="cell-sub mono" title="${t(b.id)}">${t(b.id)}</div>
        </td>
        <td><span class="badge muted">${t(Bt(b.modality))}</span></td>
        <td><span class="badge muted">${t(b.runtime||"—")}</span></td>
        <td>${Z}</td>
        <td class="catalog-vram-cell">${b.vramMb??0} MB</td>
        <td>${k.length?`<span class="badge success">${t(e("catalog.onDisk"))}</span>`:'<span class="muted">—</span>'}</td>
        <td>
          <div class="row-actions">
            <button type="button" class="btn ${k.length?"secondary":""} sm" data-pull="${t(b.id)}" ${z?"disabled":""}>${t(G)}</button>
            ${oa(b.id,z)}
          </div>
        </td>
      </tr>`}).join(""),v=`
    <tr class="empty-row"><td colspan="7">
      <div class="data-empty">
        <div class="data-empty-icon">∅</div>
        <strong>${t(e("catalog.emptyPacks"))}</strong>
      </div>
    </td></tr>`,S=o.map(b=>{const k=i.has(b.id);return`
      <tr>
        <td>
          <div class="cell-primary mono">${t(b.id)}</div>
          <div class="cell-sub" title="${t(b.path||"")}">${t(b.path||"—")}</div>
        </td>
        <td class="catalog-vram-cell">${b.vramMb??0} MB</td>
        <td>${k?`<span class="badge success">${t(e("catalog.loaded"))}</span>`:`<span class="badge muted">${t(e("catalog.idle"))}</span>`}</td>
        <td>
          <div class="row-actions">
            <button type="button" class="btn sm" data-load="${t(b.id)}" data-vram="${b.vramMb??0}" ${k?"disabled":""}>${t(e("catalog.load"))}</button>
            <button type="button" class="btn secondary sm" data-unload="${t(b.id)}" ${k?"":"disabled"}>${t(e("catalog.unload"))}</button>
            <button type="button" class="btn danger sm" data-rm="${t(b.id)}">${t(e("catalog.delete"))}</button>
          </div>
        </td>
      </tr>`}).join(""),C=`
    <tr class="empty-row"><td colspan="4">
      <div class="data-empty">
        <div class="data-empty-icon">∅</div>
        <strong>${t(e("catalog.emptyLocal"))}</strong>
        <p class="muted">${t(e("catalog.emptyLocalHint"))}</p>
      </div>
    </td></tr>`,L=n.map(b=>sa({id:b.id})).join(", "),R=`
    <div class="grid catalog-kpi-grid media-kpi-grid">
      <div class="card">
        <div class="label">${t(e("catalog.kpiLoaded"))}</div>
        <div class="value value-sm">${n.length}</div>
        <div class="muted card-sub">${t(L||e("catalog.kpiLoadedNone"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("catalog.kpiVram"))}</div>
        <div class="value value-sm">${d}<span class="dash-kpi-den">/${l}</span></div>
        <div class="usage-bar ${u>80?"warn":""}"><span style="width:${u}%"></span></div>
        <div class="muted card-sub">${t(T("catalog.kpiVramSub",{used:d,budget:l}))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("catalog.kpiLocal"))}</div>
        <div class="value value-sm">${o.length}</div>
        <div class="muted card-sub">${t(e("catalog.kpiLocalSub"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("catalog.tabHub"))}</div>
        <div class="value value-sm">${(a.popular||[]).length}</div>
        <div class="muted card-sub">${t(e("catalog.sync"))}</div>
      </div>
    </div>`;Oe({title:e("catalog.filterModality"),hint:e("catalog.intro"),meta:T("common.pagerTotal",{n:w.length}),searchHtml:"",gridHtml:`
      <label>${t(e("catalog.filterModality"))}
        <select id="cat-mod">
          <option value="">${t(e("catalog.filterAll"))}</option>
          ${c.map(b=>`<option value="${t(b)}" ${p===b?"selected":""}>${t(Bt(b))}</option>`).join("")}
        </select>
      </label>`}),`${t(e("catalog.colName"))}${t(e("catalog.colModality"))}${t(e("catalog.colRuntime"))}${t(e("catalog.colQuant"))}${t(e("catalog.colVram"))}${t(e("catalog.colStatus"))}${t(e("common.actions"))}${g||v}`;const q=`
    <div class="panel data-table-panel">
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>${t(e("catalog.colName"))}</th>
            <th>${t(e("catalog.colVram"))}</th>
            <th>${t(e("catalog.colStatus"))}</th>
            <th>${t(e("common.actions"))}</th>
          </tr></thead>
          <tbody>${S||C}</tbody>
        </table>
      </div>
    </div>`,j=(Array.isArray(r.catalogHubHits)?r.catalogHubHits:[]).filter(b=>b.supported!==!1),x=j.map(b=>{const k=Fa({id:b.id},o),I=y===b.id||y.startsWith(`${b.id}:`),F=b.supported?`<button type="button" class="btn ${k.length?"secondary":""} sm" data-pull="${t(b.id)}" ${I?"disabled":""}>${t(I?e("catalog.pulling"):k.length?e("catalog.pullAgain"):e("catalog.pull"))}</button>`:`<span class="muted">${t(e("catalog.unsupported"))}</span>`;return`
      <tr>
        <td>
          <div class="cell-primary">${t(sa(b))}</div>
          <div class="cell-sub mono">${t(b.id)}</div>
        </td>
        <td><span class="badge muted">${t(Bt(b.modality))}</span></td>
        <td><span class="badge muted">${t(b.runtime||"—")}</span></td>
        <td class="catalog-vram-cell">
          <div class="cell-primary">${t(dt(b.sizeMb))}</div>
          <div class="cell-sub">${t(b.sizeLabel||e("catalog.sizeEst"))}</div>
        </td>
        <td class="catalog-vram-cell">
          <div class="cell-primary">${t(dt(b.vramMb))}</div>
          <div class="cell-sub">${b.paramsB?t(`${b.paramsB}B`):t(e("catalog.sizeEst"))}</div>
        </td>
        <td>${t(Oo(b.downloads))}</td>
        <td>${k.length?`<span class="badge success">${t(e("catalog.onDisk"))}</span>`:b.supported?'<span class="muted">—</span>':`<span class="badge warn">${t(e("catalog.unsupported"))}</span>`}</td>
        <td>
          <div class="row-actions catalog-pull-actions">
            ${F}
            ${oa(b.id,I)}
          </div>
        </td>
      </tr>`}).join(""),P=`
    <tr class="empty-row"><td colspan="8">
      <div class="data-empty">
        <div class="data-empty-icon">∅</div>
        <strong>${t(e("catalog.hubEmpty"))}</strong>
      </div>
    </td></tr>`,K=[["",e("catalog.filterAll")],...c.map(b=>[b,Bt(b)])].map(([b,k])=>`<button type="button" class="catalog-mod-chip ${p===b?"is-on":""}" data-hub-mod="${t(b)}" aria-pressed="${p===b}">${t(k)}</button>`).join(""),A=`
    <div class="catalog-hub-stack">
      <div class="panel catalog-hub-card">
        <div class="panel-h">
          <div class="panel-h-text">
            <strong>${t(e("catalog.hubBrowse"))}</strong>
            <span class="muted">${t(e("catalog.hubBrowseHint"))}</span>
          </div>
          ${j.length?`<span class="panel-h-meta muted">${t(T("common.pagerTotal",{n:j.length}))}</span>`:""}
        </div>
        <div class="catalog-hub-row">
          <input type="search" id="cat-hub-q" value="${t(r.catalogHubQ||"")}" placeholder="${t(e("catalog.hubSearchPh"))}" aria-label="${t(e("catalog.hubSearch"))}" />
          <button type="button" class="btn sm" id="cat-hub-go">${t(e("catalog.hubSearchBtn"))}</button>
          <button type="button" class="btn secondary sm" id="cat-hub-reset">${t(e("common.reset"))}</button>
        </div>
        <div class="catalog-mod-chips" role="group" aria-label="${t(e("catalog.filterModality"))}">${K}</div>
      </div>
      <div class="panel catalog-hub-card catalog-hub-pull-card">
        <div class="panel-h">
          <div class="panel-h-text">
            <strong>${t(e("catalog.pullSpec"))}</strong>
            <span class="muted">${t(e("catalog.pullSpecHint"))}</span>
          </div>
        </div>
        <div class="catalog-hub-row">
          <input type="text" id="cat-spec" placeholder="${t(e("catalog.pullSpecPh"))}" autocomplete="off" spellcheck="false" aria-label="${t(e("catalog.pullSpec"))}" />
          <button type="button" class="btn sm" id="cat-spec-pull">${t(e("catalog.pullSpecBtn"))}</button>
        </div>
      </div>
    </div>`,f=`
    <div class="panel data-table-panel">
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>${t(e("catalog.colName"))}</th>
            <th>${t(e("catalog.colModality"))}</th>
            <th>${t(e("catalog.colRuntime"))}</th>
            <th>${t(e("catalog.colSize"))}</th>
            <th>${t(e("catalog.colVram"))}</th>
            <th>${t(e("catalog.downloads"))}</th>
            <th>${t(e("catalog.colStatus"))}</th>
            <th>${t(e("common.actions"))}</th>
          </tr></thead>
          <tbody>${x||P}</tbody>
        </table>
      </div>
      ${r.catalogHubNext?`<div class="pager"><button type="button" class="btn secondary sm" id="cat-hub-more">${t(e("catalog.hubMore"))}</button></div>`:""}
    </div>`;document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("catalog.title"))}</h2>
      <div class="toolbar">
        <button type="button" class="btn sm" id="cat-sync">${t(e("catalog.sync"))}</button>
      </div>
    </div>
    <div id="cat-pull-banner" class="catalog-pull-banner" ${y?"":"hidden"}>
      <div class="catalog-pull-banner-copy">
        <strong>${t(T("catalog.pullingBanner",{id:y||"—"}))}</strong>
      </div>
      ${oa(y||"banner",!!y)}
    </div>
    ${ke([e("catalog.intro"),e("catalog.syncHint"),r.catalogPopularSyncedAt?T("catalog.syncAt",{when:ae(r.catalogPopularSyncedAt)}):""])}
    ${R}
    <div class="usage-tabs-panel panel catalog-tabs-panel media-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("catalog.title"))}">
        <button type="button" role="tab" class="seg-tab ${m==="local"?"is-active":""}" data-catalog-tab="local" aria-selected="${m==="local"}">
          ${t(e("catalog.tabLocal"))}
          <span class="seg-tab-count">${o.length}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${m==="hub"?"is-active":""}" data-catalog-tab="hub" aria-selected="${m==="hub"}">
          ${t(e("catalog.tabHub"))}
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane catalog-tab-pane" id="catalog-tab-local" ${m==="local"?"":"hidden"}>
          ${q}
        </div>
        <div class="usage-tab-pane catalog-tab-pane" id="catalog-tab-hub" ${m==="hub"?"":"hidden"}>
          ${A}
          ${f}
        </div>
      </div>
    </div>
  `),de(),document.querySelectorAll("[data-catalog-tab]").forEach(b=>{b.onclick=()=>{const k=b.getAttribute("data-catalog-tab")||"local";r.catalogTab=k,document.querySelectorAll(".catalog-tab-pane").forEach(I=>{I.hidden=I.id!==`catalog-tab-${k}`}),document.querySelectorAll("[data-catalog-tab]").forEach(I=>{const F=I.getAttribute("data-catalog-tab")===k;I.classList.toggle("is-active",F),I.setAttribute("aria-selected",String(F))})}});const $=document.getElementById("cat-mod");$&&($.onchange=()=>{r.catalogModality=$.value,we().catch(h)}),document.querySelector("#catalog-tab-packs [data-filter-apply]")?.addEventListener("click",()=>{r.catalogModality=document.getElementById("cat-mod")?.value||"",we().catch(h)}),document.querySelector("#catalog-tab-packs [data-filter-reset]")?.addEventListener("click",()=>{r.catalogModality="",we().catch(h)});const U=()=>{r.catalogHubQ=document.getElementById("cat-hub-q")?.value.trim()||"",r.catalogHubHits=null,gt().catch(h)};document.getElementById("cat-hub-go")?.addEventListener("click",U),document.getElementById("cat-hub-reset")?.addEventListener("click",()=>{r.catalogHubQ="",r.catalogModality="",r.catalogHubHits=null,gt().catch(h)}),document.querySelectorAll("[data-hub-mod]").forEach(b=>{b.addEventListener("click",()=>{r.catalogModality=b.getAttribute("data-hub-mod")||"",r.catalogHubQ=document.getElementById("cat-hub-q")?.value.trim()||"",r.catalogHubHits=null,gt().catch(h)})}),document.getElementById("cat-hub-q")?.addEventListener("keydown",b=>{b.key==="Enter"&&(b.preventDefault(),U())}),document.getElementById("cat-spec")?.addEventListener("keydown",b=>{b.key==="Enter"&&(b.preventDefault(),document.getElementById("cat-spec-pull")?.click())}),document.getElementById("cat-hub-more")?.addEventListener("click",()=>{gt({append:!0}).catch(h)}),m==="hub"&&r.catalogHubHits==null&&!r.catalogHubBusy&&gt().catch(h),document.getElementById("cat-sync")?.addEventListener("click",async()=>{const b=document.getElementById("cat-sync");if(b){b.setAttribute("disabled","disabled"),b.textContent=e("catalog.syncing");try{const k=await M("/catalog/sync",{method:"POST",body:JSON.stringify({})});r.catalogHubHits=k.hits||[],r.catalogHubNext="",r.catalogHubQ="",r.catalogTab="hub",r.catalogPopularSyncedAt=k.syncedAt||"",await we()}catch(k){b.removeAttribute("disabled"),b.textContent=e("catalog.sync"),h(k)}}}),document.querySelectorAll("[data-pull]").forEach(b=>{b.onclick=async()=>{const k=b.getAttribute("data-pull")||"",I=document.querySelector(`[data-quant-for="${CSS.escape(k)}"]`),F=I&&I.value?I.value:"",Z=F?`${k}:${F}`:k;b.disabled=!0,b.textContent=e("catalog.pulling"),pt(k,0,0);try{const z=await fetch(`${$t}/catalog/pull`,{method:"POST",headers:{"Content-Type":"application/json",...r.key?{Authorization:`Bearer ${r.key}`}:{}},body:JSON.stringify({model:Z})}),G=z.body&&z.body.getReader?z.body.getReader():null;let W="";if(G){const B=new TextDecoder;for(;;){const{done:Y,value:se}=await G.read();if(Y)break;const ue=B.decode(se,{stream:!0});W+=ue;const fe=W.split(`
`).map(me=>me.trim()).filter(Boolean),oe=fe[fe.length-1];if(oe)try{const me=JSON.parse(oe);me.status==="downloading"?pt(k,me.bytes,me.total):me.status&&pt(k,r.catalogPull.bytes,r.catalogPull.total)}catch{}}}else W=await z.text();const D=W.split(`
`).map(B=>B.trim()).filter(Boolean),E=D.length?JSON.parse(D[D.length-1]):{};if(!z.ok)throw new Error(E.error?.message||E.reason||z.statusText);Na(E),Ct(),r.catalogTab="local",await we()}catch(z){Ct(),b.disabled=!1,b.textContent=e("catalog.pull"),h(z)}}}),document.querySelectorAll("[data-load]").forEach(b=>{b.onclick=async()=>{try{await M("/models/load",{method:"POST",body:JSON.stringify({id:b.getAttribute("data-load"),vramMb:Number(b.getAttribute("data-vram")||0)})}),await we()}catch(k){h(k)}}}),document.querySelectorAll("[data-unload]").forEach(b=>{b.onclick=async()=>{try{await M("/models/unload",{method:"POST",body:JSON.stringify({id:b.getAttribute("data-unload")})}),await we()}catch(k){h(k)}}}),document.querySelectorAll("[data-rm]").forEach(b=>{b.onclick=async()=>{const k=b.getAttribute("data-rm")||"";if(await ee({variant:"danger",message:T("catalog.deleteConfirm",{id:k}),confirmText:e("catalog.delete")}))try{await M("/catalog/rm",{method:"POST",body:JSON.stringify({id:k})}),await we()}catch(F){h(F)}}}),document.getElementById("cat-spec-pull")?.addEventListener("click",async()=>{const b=document.getElementById("cat-spec")?.value.trim();if(!b)return;const k=document.getElementById("cat-spec-pull");k&&(k.setAttribute("disabled","disabled"),k.textContent=e("catalog.pulling")),pt(b,0,0);try{const I=await fetch(`${$t}/catalog/pull`,{method:"POST",headers:{"Content-Type":"application/json",...r.key?{Authorization:`Bearer ${r.key}`}:{}},body:JSON.stringify({model:b})}),F=I.body&&I.body.getReader?I.body.getReader():null;let Z="";if(F){const W=new TextDecoder;for(;;){const{done:D,value:E}=await F.read();if(D)break;const B=W.decode(E,{stream:!0});Z+=B;const Y=Z.split(`
`).map(ue=>ue.trim()).filter(Boolean),se=Y[Y.length-1];if(se)try{const ue=JSON.parse(se);ue.status==="downloading"&&pt(b,ue.bytes,ue.total)}catch{}}}else Z=await I.text();const z=Z.split(`
`).map(W=>W.trim()).filter(Boolean),G=z.length?JSON.parse(z[z.length-1]):{};if(!I.ok)throw new Error(G.error?.message||G.reason||I.statusText);Na(G),Ct(),r.catalogTab="local",await we()}catch(I){Ct(),k&&(k.removeAttribute("disabled"),k.textContent=e("catalog.pullSpecBtn")),h(I)}})}async function zt(){const a=document.getElementById("app");try{if(!r.key){await es();return}r.me||await Za(),r.page==="dashboard"?await ia():r.page==="chat"?await Mo():r.page==="chats"?await ft():r.page==="keys"?await Fe():r.page==="documents"?await st():r.page==="media"?await qe():r.page==="catalog"?await we():r.page==="audit"?await bt():r.page==="settings"?await ls():r.page==="apiFeatures"?await Ht():r.page==="usage"?await ge():r.page==="ddos"?await ne():r.page==="queue"?await ce():r.page==="pm2"?await Le():r.page==="system"?await ot():r.page==="support"?await Lo():await ia()}catch(s){a.innerHTML=le(`<div class="error-box">${t(s.message)}</div>`),de()}}let Je=null;const V={tab:"overview",status:"",sortBy:"queuedAt",sortDir:"desc",limit:20,offset:0};function Ut(a){return!a||a<0?"—":a<1e3?`${a}ms`:a<6e4?`${Math.round(a/1e3)}s`:a<36e5?`${Math.round(a/6e4)}m`:`${(a/36e5).toFixed(1)}h`}const Ro=["enabled","globalConcurrency","perKeyConcurrency","maxQueueDepth","maxQueueDepthPerKey","fairness","defaultPriority","playgroundPriority","leaseMs","maxWaitMs"];function bs(){return{relaxed:{enabled:!0,globalConcurrency:6,perKeyConcurrency:2,maxQueueDepth:200,maxQueueDepthPerKey:40,fairness:"weighted_round_robin",defaultPriority:100,playgroundPriority:40,leaseMs:6e4,maxWaitMs:9e5},balanced:{enabled:!0,globalConcurrency:4,perKeyConcurrency:1,maxQueueDepth:100,maxQueueDepthPerKey:20,fairness:"weighted_round_robin",defaultPriority:100,playgroundPriority:50,leaseMs:45e3,maxWaitMs:6e5},strict:{enabled:!0,globalConcurrency:2,perKeyConcurrency:1,maxQueueDepth:40,maxQueueDepthPerKey:8,fairness:"fifo_global",defaultPriority:100,playgroundPriority:80,leaseMs:3e4,maxWaitMs:3e5}}}function Ka(a){if(!a)return{};const s={};for(const o of Ro){const n=a[o];typeof n=="boolean"?s[o]=n:typeof n=="number"&&Number.isFinite(n)?s[o]=Math.round(n):typeof n=="string"?s[o]=n:n==null?s[o]=null:s[o]=n}return s}function ys(a,s){return JSON.stringify(Ka(a))===JSON.stringify(Ka(s))}function ga(a){if(!a)return"custom";const s=bs();for(const o of["relaxed","balanced","strict"])if(ys(a,s[o]))return o;return"custom"}function Fo(a){return e(a==="relaxed"?"queue.presetRelaxed":a==="balanced"?"queue.presetBalanced":a==="strict"?"queue.presetStrict":"queue.presetCustom")}function hs(a,{unsaved:s=!1}={}){const o=Fo(a),n=a==="relaxed"?"relaxed":a==="balanced"?"balanced":a==="strict"?"strict":"custom",i=s?T("queue.presetFormLabel",{name:o}):T("queue.presetActiveLabel",{name:o});return`<span class="ddos-preset-badge is-${n}" id="queue-preset-badge" title="${t(i)}">${t(i)}</span>`}function vs(){return{enabled:document.getElementById("q-master-enabled")?Xe("q-master-enabled"):!0,globalConcurrency:Math.max(1,Math.min(64,Math.floor(J("qp-gconc",4)))),perKeyConcurrency:Math.max(1,Math.min(16,Math.floor(J("qp-kconc",1)))),maxQueueDepth:Math.max(1,Math.floor(J("qp-depth",100))),maxQueueDepthPerKey:Math.max(1,Math.floor(J("qp-depthk",20))),fairness:document.getElementById("qp-fair")?.value==="fifo_global"?"fifo_global":"weighted_round_robin",defaultPriority:Math.max(0,Math.min(1e3,Math.floor(J("qp-pri",100)))),playgroundPriority:Math.max(0,Math.min(1e3,Math.floor(J("qp-ppri",50)))),leaseMs:Math.max(5e3,Math.floor(J("qp-lease",45e3))),maxWaitMs:Math.max(5e3,Math.floor(J("qp-wait",6e5)))}}function Gt(a){Ye("q-master-enabled",a,e("queue.masterOn"),e("queue.masterOff")),et("queue-root",!a),Ze("queue-disabled-banner",!a);const s=document.getElementById("qk-pill-enabled");s&&(s.innerHTML=Ke(a,e("dash.on"),e("dash.off")))}function No(a){if(!a)return;const s=(n,i)=>{const d=document.getElementById(n);d&&(d.value=String(i))};Gt(a.enabled!==!1),s("qp-gconc",a.globalConcurrency),s("qp-kconc",a.perKeyConcurrency),s("qp-depth",a.maxQueueDepth),s("qp-depthk",a.maxQueueDepthPerKey);const o=document.getElementById("qp-fair");o&&(o.value=a.fairness||"weighted_round_robin"),s("qp-pri",a.defaultPriority),s("qp-ppri",a.playgroundPriority),s("qp-lease",a.leaseMs),s("qp-wait",a.maxWaitMs),ht()}function ht(){if(!document.getElementById("queue-policy-panel"))return;let a;try{a=vs()}catch{return}const s=ga(a),o=ga(r._queuePolicyCache||a),n=!ys(a,r._queuePolicyCache||a);document.querySelectorAll("[data-queue-preset]").forEach(l=>{const u=l.dataset.queuePreset;if(u==="custom"){const w=s==="custom";l.classList.toggle("is-active",w),l.setAttribute("aria-pressed",w?"true":"false"),l.disabled=!w;return}const m=u===s,p=u===o;l.classList.toggle("is-active",m),l.classList.toggle("is-saved",p&&!m),l.setAttribute("aria-pressed",m?"true":"false");const c=e(u==="relaxed"?"queue.presetRelaxed":u==="balanced"?"queue.presetBalanced":"queue.presetStrict");m&&p?l.innerHTML=`${t(c)} <span class="preset-tag">${t(e("queue.presetTagActive"))}</span>`:m&&n?l.innerHTML=`${t(c)} <span class="preset-tag preset-tag--draft">${t(e("queue.presetTagDraft"))}</span>`:p?l.innerHTML=`${t(c)} <span class="preset-tag preset-tag--saved">${t(e("queue.presetTagSaved"))}</span>`:l.textContent=c});const i=document.getElementById("queue-preset-badge");i&&(i.outerHTML=hs(s,{unsaved:n&&s!==o}));const d=document.getElementById("queue-preset-hint");if(d){const l={relaxed:e("queue.presetRelaxedHint"),balanced:e("queue.presetBalancedHint"),strict:e("queue.presetStrictHint"),custom:e("queue.presetCustomHint")};d.textContent=l[s]||l.custom}}function Ko(){document.querySelectorAll("[data-queue-preset]").forEach(a=>{a.dataset.queuePreset!=="custom"&&(a.onclick=()=>{const s=a.dataset.queuePreset,o=bs()[s];o&&No(o)})}),["qp-gconc","qp-kconc","qp-depth","qp-depthk","qp-fair","qp-pri","qp-ppri","qp-lease","qp-wait"].forEach(a=>{const s=document.getElementById(a);s&&(s.addEventListener("change",()=>ht()),s.addEventListener("input",()=>ht()))}),ht()}function ja(){return document.querySelector(".main")}function $s(a){return a.map(s=>{const o=s.status==="queued"||s.status==="leased"||s.status==="running",n=s.status==="failed"||s.status==="dead"||s.status==="cancelled",i=s.startedAt||s.finishedAt?null:s.queuedAt?Date.now()-new Date(s.queuedAt).getTime():null;return`
    <tr data-q-row="${t(s.id)}">
      <td>
        <div class="cell-primary mono" title="${t(s.id||"")}">${t((s.id||"").slice(0,10))}…</div>
        <div class="cell-sub mono" title="${t(s.requestId||"")}">${t((s.requestId||"").slice(0,18))}${(s.requestId||"").length>18?"…":""}</div>
        ${s.errorMessage?`<div class="queue-job-err" title="${t(s.errorMessage)}">${t(String(s.errorMessage).slice(0,80))}</div>`:""}
      </td>
      <td>${As(s.source)}</td>
      <td>
        ${qs(s.status)}
        ${s.cancelRequested?`<div class="cell-sub">${t(e("queue.cancelReq"))}</div>`:""}
      </td>
      <td class="mono" title="${t(s.model||"")}">${t(s.model||"—")}</td>
      <td><span class="queue-pri">${s.priority??"—"}</span></td>
      <td>
        <div class="cell-primary mono" title="${t(s.apiKeyId||"")}">${t((s.apiKeyId||"").slice(0,8))}…</div>
      </td>
      <td class="mono">${s.attempt??0}<span class="muted">/${s.maxAttempts??1}</span></td>
      <td>
        <div class="cell-primary">${ae(s.queuedAt)}</div>
        ${i!=null&&s.status==="queued"?`<div class="cell-sub" data-q-wait>${t(e("queue.wait"))}: ${Ut(i)}</div>`:s.startedAt?`<div class="cell-sub">${t(e("queue.started"))}: ${ae(s.startedAt)}</div>`:""}
      </td>
      <td>
        <div class="row-actions">
        ${o?`<button type="button" class="btn danger sm" data-q-cancel="${t(s.id)}">${t(e("queue.cancel"))}</button>`:""}
        ${s.status==="queued"?`<button type="button" class="btn secondary sm" data-q-pri="${t(s.id)}" data-pri="${s.priority}">${t(e("queue.priorityBtn"))}</button>`:""}
        ${n?`<button type="button" class="btn secondary sm" data-q-requeue="${t(s.id)}">${t(e("queue.requeue"))}</button>`:""}
        </div>
      </td>
    </tr>`}).join("")}function ks(){document.querySelectorAll("[data-q-cancel]").forEach(a=>{a.onclick=async()=>{await ee({title:e("queue.cancel"),message:e("queue.cancelConfirm"),variant:"danger",confirmText:e("queue.cancel")})&&(await M(`/queue/jobs/${a.dataset.qCancel}/cancel`,{method:"POST",body:"{}"}),ce().catch(h))}}),document.querySelectorAll("[data-q-requeue]").forEach(a=>{a.onclick=async()=>{await M(`/queue/jobs/${a.dataset.qRequeue}/requeue`,{method:"POST",body:"{}"}),ce().catch(h)}}),document.querySelectorAll("[data-q-pri]").forEach(a=>{a.onclick=async()=>{const s=Number(a.dataset.pri)||100,o=window.prompt(e("queue.priorityPh"),String(s));if(o==null)return;const n=Number(o);!Number.isFinite(n)||n<0||n>1e3||(await M(`/queue/jobs/${a.dataset.qPri}/priority`,{method:"POST",body:JSON.stringify({priority:n})}),ce().catch(h))}})}function Ss(a){return a.enabled?a.paused?e("queue.paused"):a.drainMode?e("queue.drain"):e("queue.running"):e("queue.modeOff")}function jo({s:a,pol:s,jobs:o,total:n,by:i}){const d=a.dead??i.dead??0,l=a.leased??i.leased??0,u=a.running??i.running??0,m=a.queued??i.queued??0,p=a.depth??m+l+u,c=Ss(s),w=s.fairness==="fifo_global"?e("queue.fifo"):e("queue.wrr"),y=(A,f)=>{const $=document.getElementById(A);$&&($.textContent=f)},g=(A,f)=>{const $=document.getElementById(A);$&&($.innerHTML=f)};y("qk-depth",String(p)),y("qk-depth-sub",T("queue.kpiDepthSub",{q:m,l})),g("qk-running",`${u}<span class="dash-kpi-den">/${s.globalConcurrency??"—"}</span>`),y("qk-running-sub",T("queue.kpiActiveSub",{n:a.workerActive??0})),y("qk-queued",String(m)),y("qk-dead",String(d)),y("qk-oldest",a.oldestQueuedAgeMs?Ut(a.oldestQueuedAgeMs):"—"),y("qk-mode",c),y("qk-mode-sub",w);const v=document.getElementById("qk-worker-id");if(v){const A=a.workerId||"—";v.textContent=A,v.title=A}const S=(A,f,$,U)=>{const b=document.getElementById(A);b&&(b.outerHTML=`<span id="${A}">${Ke(f,$,U)}</span>`)};S("qk-pill-enabled",s.enabled!==!1,e("dash.on"),e("dash.off")),S("qk-pill-consumer",!s.paused&&s.enabled!==!1,e("queue.running"),s.paused?e("queue.paused"):e("queue.modeOff")),S("qk-pill-admission",!s.drainMode,e("queue.accepting"),e("queue.drain")),y("qk-fairness-val",w),y("qk-conc-val",`${s.perKeyConcurrency??1} / ${s.globalConcurrency??"—"}`);const C=document.getElementById("queue-dlq-slot");C&&(d>0?(C.innerHTML=`
        <div class="queue-dlq-banner" role="status">
          <div class="queue-dlq-text">
            <strong>${t(e("queue.dlqTitle"))}</strong>
            <span class="queue-dlq-count">${d}</span>
            <span class="muted">${t(e("queue.dlqHint"))}</span>
          </div>
          <div class="toolbar">
            <button type="button" class="btn secondary sm" id="q-filter-dead">${t(e("queue.viewDlq"))}</button>
            <button type="button" class="btn danger sm" id="q-purge-dlq">${t(e("queue.purgeDead"))}</button>
          </div>
        </div>`,document.getElementById("q-filter-dead")?.addEventListener("click",()=>{V.status="dead",V.offset=0,V.tab="jobs",ce().catch(h)})):C.innerHTML="");const L=(A,f)=>{const $=document.getElementById(A);$&&($.textContent=String(f??0))};L("q-tab-count-jobs",n),L("q-tab-count-dead",d);const R=document.getElementById("qk-jobs-meta");R&&(R.textContent=T("queue.jobsMeta",{n}));const q=document.querySelector("#queue-jobs-table tbody");if(q){const A=o.map($=>`${$.id}|${$.status}|${$.priority}|${$.attempt}|${$.cancelRequested?1:0}|${$.errorMessage||""}|${$.startedAt||""}|${$.finishedAt||""}`).join(";"),f=$s(o)||`<tr class="empty-row"><td colspan="9">
        <div class="data-empty">
          <div class="data-empty-icon">∅</div>
          <strong>${t(e("queue.empty"))}</strong>
        </div>
      </td></tr>`;if(q.dataset.qsig!==A){const $=document.querySelector("#queue-jobs-table .table-wrap"),U=$?.scrollLeft||0;q.dataset.qsig=A,q.innerHTML=f,ks(),wa(document.querySelector("#queue-jobs-table")||document),$&&($.scrollLeft=U)}else o.forEach($=>{if($.status!=="queued"||!$.queuedAt)return;const U=Date.now()-new Date($.queuedAt).getTime(),b=String($.id||"");let k=null;q.querySelectorAll("[data-q-row]").forEach(F=>{F.getAttribute("data-q-row")===b&&(k=F)});const I=k?.querySelector("[data-q-wait]");I&&(I.textContent=`${e("queue.wait")}: ${Ut(U)}`)})}if(document.querySelector("#queue-pager .data-pager-meta span")){const A=Math.max(1,Math.ceil((n||0)/V.limit)||1),f=Math.floor(V.offset/V.limit)+1,$=document.querySelectorAll("#queue-pager .data-pager-meta > span");$[0]&&($[0].textContent=T("common.pagerTotal",{n:n||0})),$[1]&&($[1].textContent=T("common.pagerPage",{n:f,total:A}));const U=document.getElementById("queue-prev"),b=document.getElementById("queue-next");U&&(U.disabled=V.offset<=0),b&&(b.disabled=V.offset+V.limit>=n)}const x=document.getElementById("q-pause");x&&(x.textContent=s.paused?e("queue.resume"):e("queue.pause"));const P=document.getElementById("q-drain");P&&(P.textContent=s.drainMode?e("queue.undrain"):e("queue.drainBtn"));const K=document.getElementById("q-master-enabled");K&&document.activeElement!==K&&Gt(s.enabled!==!1)}function Ua(){Je||(Je=setInterval(()=>{if(r.page!=="queue"){clearInterval(Je),Je=null;return}const a=document.activeElement;a&&a.closest&&a.closest("#queue-policy-panel")&&(a.tagName==="INPUT"||a.tagName==="SELECT"||a.tagName==="TEXTAREA")||ce({soft:!0}).catch(()=>{})},4e3))}async function ce(a={}){const s=!!a.soft&&document.getElementById("queue-root");!s&&Je&&(clearInterval(Je),Je=null);const o=ja(),n=!s&&o?o.scrollTop:0,i=V;i.sortBy||(i.sortBy="queuedAt"),i.sortDir||(i.sortDir="desc");const d=new URLSearchParams;d.set("limit",String(i.limit)),d.set("offset",String(i.offset)),i.status&&d.set("status",i.status),Ee(d,i);const[l,u,m]=await Promise.all([M("/queue/stats"),M(`/queue/jobs?${d}`),M("/queue/policy")]);if(r.page!=="queue")return;const p=l.data||{},c=m.data||p.policy||{},w=u.data||[],y=u.total??w.length,g=p.byStatus||{},v=p.dead??g.dead??0,S=p.leased??g.leased??0,C=p.running??g.running??0,L=p.queued??g.queued??0,R=p.depth??L+S+C,q=Ss(c);if(r._queuePolicyCache={...c},s){jo({s:p,pol:c,jobs:w,total:y,by:g}),Ua();return}V.tab||(V.tab="overview");const j=V.tab==="jobs"||V.tab==="policy"?V.tab:"overview";V.tab=j;const x=$s(w),P=Oe({title:e("queue.filterTitle"),hint:e("queue.filterHint"),meta:T("queue.jobsMeta",{n:y}),gridHtml:`
      <label>${t(e("queue.filterStatus"))}
        <select id="qf-status">
          <option value="">${t(e("queue.allStatuses"))}</option>
          <option value="queued" ${i.status==="queued"?"selected":""}>${t(e("queue.filterQueued"))}</option>
          <option value="active" ${i.status==="active"?"selected":""}>${t(e("queue.filterRunning"))}</option>
          <option value="dead" ${i.status==="dead"?"selected":""}>${t(e("queue.filterDead"))}</option>
          <option value="failed" ${i.status==="failed"?"selected":""}>${t(e("queue.filterFailed"))}</option>
          <option value="succeeded" ${i.status==="succeeded"?"selected":""}>${t(e("queue.filterSucceeded"))}</option>
          <option value="cancelled" ${i.status==="cancelled"?"selected":""}>${t(e("queue.filterCancelled"))}</option>
        </select>
      </label>`}),K=$e({headHtml:`
      <th>${t(e("queue.colJob"))}</th>
      <th>${t(e("queue.colSource"))}</th>
      ${N({field:"status",label:e("queue.colStatus"),filterRef:i})}
      ${N({field:"model",label:e("queue.colModel"),filterRef:i})}
      ${N({field:"priority",label:e("queue.colPri"),filterRef:i})}
      <th>${t(e("queue.colKey"))}</th>
      ${N({field:"attempt",label:e("queue.colTry"),filterRef:i})}
      ${N({field:"queuedAt",label:e("queue.colTime"),filterRef:i})}
      <th>${t(e("common.actions"))}</th>`,bodyHtml:x,colSpan:9,emptyText:e("queue.empty"),pagerHtml:Ce({total:y,limit:i.limit,offset:i.offset,idPrefix:"queue"})}),A=c.fairness==="fifo_global"?e("queue.fifo"):e("queue.wrr"),f=c.enabled!==!1,$=(G,W,D,E,B)=>`
    <div class="card">
      <div class="label">${t(G)}</div>
      <div class="value value-sm" id="${t(E)}">${W}</div>
      ${D!=null&&D!==""?`<div class="muted card-sub"${B?` id="${t(B)}"`:""}>${t(String(D))}</div>`:""}
    </div>`,U=`
    <div class="grid queue-kpi-grid" id="queue-kpi-grid">
      ${$(e("queue.depth"),t(String(R)),T("queue.kpiDepthSub",{q:L,l:S}),"qk-depth","qk-depth-sub")}
      ${$(e("queue.activeJobs"),`${C}<span class="dash-kpi-den">/${c.globalConcurrency??"—"}</span>`,T("queue.kpiActiveSub",{n:p.workerActive??0}),"qk-running","qk-running-sub")}
      ${$(e("queue.queued"),t(String(L)),e("queue.kpiQueuedSub"),"qk-queued","qk-queued-sub")}
      ${$(e("queue.dead"),t(String(v)),e("queue.kpiDeadSub"),"qk-dead","qk-dead-sub")}
      ${$(e("queue.oldest"),t(p.oldestQueuedAgeMs?Ut(p.oldestQueuedAgeMs):"—"),e("queue.kpiOldestSub"),"qk-oldest","qk-oldest-sub")}
      ${$(e("queue.mode"),t(q),A,"qk-mode","qk-mode-sub")}
    </div>`,b=`
    <div class="panel data-table-panel queue-status-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("queue.statusPanel"))}</strong>
          <span class="muted panel-h-sub">${t(e("queue.statusPanelHint"))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <div class="queue-status-row queue-status-row--6">
          <div class="queue-status-item">
            <span class="label">${t(e("queue.enabled"))}</span>
            <span id="qk-pill-enabled">${Ke(c.enabled!==!1,e("dash.on"),e("dash.off"))}</span>
          </div>
          <div class="queue-status-item">
            <span class="label">${t(e("queue.consumer"))}</span>
            <span id="qk-pill-consumer">${Ke(!c.paused&&c.enabled!==!1,e("queue.running"),c.paused?e("queue.paused"):e("queue.modeOff"))}</span>
          </div>
          <div class="queue-status-item">
            <span class="label">${t(e("queue.admission"))}</span>
            <span id="qk-pill-admission">${Ke(!c.drainMode,e("queue.accepting"),e("queue.drain"))}</span>
          </div>
          <div class="queue-status-item">
            <span class="label">${t(e("queue.fairness"))}</span>
            <strong class="queue-status-val" id="qk-fairness-val">${t(A)}</strong>
          </div>
          <div class="queue-status-item">
            <span class="label">${t(e("queue.concurrency"))}</span>
            <strong class="queue-status-val mono" id="qk-conc-val">${c.perKeyConcurrency??1} / ${c.globalConcurrency??"—"}</strong>
          </div>
          <div class="queue-status-item queue-status-item--worker">
            <span class="label">${t(e("queue.workerInstance"))}</span>
            <code class="queue-worker-id" id="qk-worker-id" title="${t(p.workerId||"")}">${t(p.workerId||"—")}</code>
            <span class="queue-worker-hint muted">${t(e("queue.workerInstanceHint"))}</span>
          </div>
        </div>
      </div>
    </div>

    <div id="queue-dlq-slot">
    ${v>0?`<div class="queue-dlq-banner" role="status">
      <div class="queue-dlq-text">
        <strong>${t(e("queue.dlqTitle"))}</strong>
        <span class="queue-dlq-count">${v}</span>
        <span class="muted">${t(e("queue.dlqHint"))}</span>
      </div>
      <div class="toolbar">
        <button type="button" class="btn secondary sm" id="q-filter-dead">${t(e("queue.viewDlq"))}</button>
        <button type="button" class="btn danger sm" id="q-purge-dlq">${t(e("queue.purgeDead"))}</button>
      </div>
    </div>`:""}
    </div>`,k=`
    ${P}
    <div id="queue-jobs-table" class="queue-jobs-table-host">${K}</div>`,I=`
    <div class="panel data-table-panel queue-policy-panel" id="queue-policy-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("queue.policyTitle"))}</strong>
          <span class="muted panel-h-sub">${t(e("queue.policyHint"))}</span>
        </div>
        ${hs(ga(c))}
      </div>
      <div class="panel-pad">
        <div class="ddos-preset-block">
          <div class="ddos-preset-block-h">
            <strong>${t(e("queue.presetTitle"))}</strong>
            <span class="muted">${t(e("queue.presetHint"))}</span>
          </div>
          <div class="ddos-presets" role="group" aria-label="${t(e("queue.presetTitle"))}">
            <button type="button" class="ddos-preset-btn" data-queue-preset="relaxed" data-ddos-preset="relaxed" aria-pressed="false">${t(e("queue.presetRelaxed"))}</button>
            <button type="button" class="ddos-preset-btn" data-queue-preset="balanced" data-ddos-preset="balanced" aria-pressed="false">${t(e("queue.presetBalanced"))}</button>
            <button type="button" class="ddos-preset-btn" data-queue-preset="strict" data-ddos-preset="strict" aria-pressed="false">${t(e("queue.presetStrict"))}</button>
            <button type="button" class="ddos-preset-btn ddos-preset-btn--custom" data-queue-preset="custom" disabled aria-pressed="false">${t(e("queue.presetCustom"))}</button>
          </div>
          <p class="ddos-preset-hint" id="queue-preset-hint"></p>
        </div>
        <div class="form-grid">
          <label>${t(e("queue.globalConcurrency"))}
            <input type="number" id="qp-gconc" min="1" max="64" value="${Number(c.globalConcurrency)||2}" />
            <span class="hint">${t(e("queue.hintGlobalConc"))}</span>
          </label>
          <label>${t(e("queue.perKeyConcurrency"))}
            <input type="number" id="qp-kconc" min="1" max="16" value="${Number(c.perKeyConcurrency)||1}" />
            <span class="hint">${t(e("queue.hintPerKeyConc"))}</span>
          </label>
          <label>${t(e("queue.maxDepth"))}
            <input type="number" id="qp-depth" min="1" value="${Number(c.maxQueueDepth)||100}" />
            <span class="hint">${t(e("queue.hintMaxDepth"))}</span>
          </label>
          <label>${t(e("queue.maxDepthKey"))}
            <input type="number" id="qp-depthk" min="1" value="${Number(c.maxQueueDepthPerKey)||20}" />
            <span class="hint">${t(e("queue.hintMaxDepthKey"))}</span>
          </label>
          <label>${t(e("queue.fairness"))}
            <select id="qp-fair">
              <option value="weighted_round_robin" ${c.fairness==="weighted_round_robin"?"selected":""}>${t(e("queue.wrr"))}</option>
              <option value="fifo_global" ${c.fairness==="fifo_global"?"selected":""}>${t(e("queue.fifo"))}</option>
            </select>
            <span class="hint">${t(e("queue.hintFairness"))}</span>
          </label>
          <label>${t(e("queue.defaultPriority"))}
            <input type="number" id="qp-pri" min="0" max="1000" value="${Number(c.defaultPriority)||100}" />
          </label>
          <label>${t(e("queue.playgroundPriority"))}
            <input type="number" id="qp-ppri" min="0" max="1000" value="${Number(c.playgroundPriority)||50}" />
          </label>
          <label>${t(e("queue.leaseMs"))}
            <input type="number" id="qp-lease" min="5000" step="1000" value="${Number(c.leaseMs)||45e3}" />
            <span class="hint">${t(e("queue.hintLease"))}</span>
          </label>
          <label>${t(e("queue.maxWaitMs"))}
            <input type="number" id="qp-wait" min="5000" step="1000" value="${Number(c.maxWaitMs)||6e5}" />
            <span class="hint">${t(e("queue.hintMaxWait"))}</span>
          </label>
        </div>
        <div class="toolbar settings-save-bar">
          <button type="button" class="btn sm" id="qp-save">${t(e("queue.savePolicy"))}</button>
        </div>
      </div>
    </div>`;if(document.getElementById("app").innerHTML=le(`
  <div id="queue-root" class="${f?"":"is-feature-off"}">
    <div class="topbar">
      <h2>${t(e("queue.title"))}</h2>
      <div class="toolbar">
        ${Pa({id:"q-master-enabled",on:f,onLabel:e("queue.masterOn"),offLabel:e("queue.masterOff"),title:e("queue.masterHint")})}
        <button type="button" class="btn secondary sm" id="q-pause">${t(c.paused?e("queue.resume"):e("queue.pause"))}</button>
        <button type="button" class="btn secondary sm" id="q-drain">${t(c.drainMode?e("queue.undrain"):e("queue.drainBtn"))}</button>
        <button type="button" class="btn danger sm" id="q-purge">${t(e("queue.purgeDead"))}</button>
      </div>
    </div>
    ${ke([e("queue.subtitle")])}
    <div class="feature-off-banner" id="queue-disabled-banner" ${f?"hidden":""} role="status">
      <strong>${t(e("common.featureOff"))}</strong>
      <span>${t(e("queue.disabledBanner"))}</span>
    </div>

    ${U}

    <div class="usage-tabs-panel panel queue-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("queue.title"))}">
        <button type="button" role="tab" class="seg-tab ${j==="overview"?"is-active":""}" data-queue-tab="overview" aria-selected="${j==="overview"}">
          ${t(e("queue.tabOverview"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${j==="jobs"?"is-active":""}" data-queue-tab="jobs" aria-selected="${j==="jobs"}">
          ${t(e("queue.tabJobs"))}
          <span class="seg-tab-count" id="q-tab-count-jobs">${y}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${j==="policy"?"is-active":""}" data-queue-tab="policy" aria-selected="${j==="policy"}">
          ${t(e("queue.tabPolicy"))}
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane queue-tab-pane-overview" id="queue-tab-overview" ${j==="overview"?"":"hidden"}>
          ${b}
        </div>
        <div class="usage-tab-pane queue-tab-pane-jobs" id="queue-tab-jobs" ${j==="jobs"?"":"hidden"}>
          ${k}
        </div>
        <div class="usage-tab-pane queue-tab-pane-policy" id="queue-tab-policy" ${j==="policy"?"":"hidden"}>
          ${I}
        </div>
      </div>
    </div>
  </div>
  `),de(),document.querySelectorAll("[data-queue-tab]").forEach(G=>{G.addEventListener("click",()=>{const W=G.getAttribute("data-queue-tab")||"overview";W!=="overview"&&W!=="jobs"&&W!=="policy"||V.tab!==W&&(V.tab=W,ce().catch(h))})}),n>0){const G=ja();G&&(G.scrollTop=n,requestAnimationFrame(()=>{G.scrollTop=n}))}document.getElementById("q-master-enabled").onclick=async()=>{const G=!Xe("q-master-enabled");Gt(G);try{const W=await M("/queue/policy",{method:"PUT",body:JSON.stringify({enabled:G})});r._queuePolicyCache={...r._queuePolicyCache||{},...W.data||{enabled:G}},ht()}catch(W){Gt(!G),h(W)}},document.getElementById("q-pause").onclick=async()=>{await M(c.paused?"/queue/resume":"/queue/pause",{method:"POST",body:"{}"}),ce().catch(h)},document.getElementById("q-drain").onclick=async()=>{await M(c.drainMode?"/queue/undrain":"/queue/drain",{method:"POST",body:"{}"}),ce().catch(h)};let F=!1;const Z=async()=>{if(!F){F=!0;try{if(!await ee({title:e("queue.purgeTitle"),message:e("queue.purgeConfirm"),variant:"danger",confirmText:e("queue.purgeConfirmBtn"),cancelText:e("common.cancel")}))return;const W=await M("/queue/purge-dead",{method:"POST",body:"{}"}),D=Number(W?.data?.deleted??0);await be({title:e("queue.purgeDoneTitle"),message:T("queue.purgeDoneMsg",{n:D}),confirmText:e("common.ok")}),await ce()}finally{F=!1}}},z=document.getElementById("queue-root");z&&(z.onclick=G=>{G.target?.closest?.("#q-purge, #q-purge-dlq")&&(G.preventDefault(),Z().catch(h))}),document.getElementById("q-filter-dead")?.addEventListener("click",()=>{V.status="dead",V.offset=0,V.tab="jobs",ce().catch(h)}),document.querySelectorAll("[data-filter-apply]").forEach(G=>{G.onclick=()=>{V.status=document.getElementById("qf-status")?.value||"",V.offset=0,ce().catch(h)}}),document.querySelectorAll("[data-filter-reset]").forEach(G=>{G.onclick=()=>{V.status="",V.sortBy="queuedAt",V.sortDir="desc",V.offset=0,ce().catch(h)}}),rt("queue",V,()=>ce().catch(h)),Ge(V,()=>ce().catch(h)),document.getElementById("qp-save").onclick=async()=>{const G=vs();await M("/queue/policy",{method:"PUT",body:JSON.stringify(G)}),r._queuePolicyCache={...r._queuePolicyCache||{},...G},Q(""),ce().catch(h)},Ko(),ks(),Ua()}r.page=Ms();(!location.hash||location.hash==="#"||location.hash==="#/")&&ya(r.page);window.addEventListener("hashchange",()=>{const a=ba(location.hash);a&&a!==r.page&&va(a,{writeHash:!1})});window.addEventListener("popstate",()=>{const a=ba(location.hash);!a||a===r.page||va(a,{writeHash:!1})});zt();
//# sourceMappingURL=boot.js.map
