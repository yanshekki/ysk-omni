const Fa="gog_admin_lang",Qt={en:{brand:"YSK Omni",brandSub:"Admin Panel",loginTitle:"Admin",loginLabel:"API Key",loginOtpLabel:"One-time login code",loginBtn:"Sign in",loginCmdHint:"Get a key in terminal:",loginOtpHint:"Generate a code in terminal (required every login):",loginOtpExpiry:"Code expires in 5 minutes and can be used only once.",loginOtpFail:"Invalid or expired code",loginLostKey:"Lost old key? Create a new admin key (plaintext is not stored).",loginCopy:"Copy",loginCopied:"Copied",needKey:"Enter API key",needOtp:"Enter the one-time code from the terminal",logout:"Log out",shell:{menu:"Open menu",closeMenu:"Close menu"},nav:{dashboard:"Dashboard",chat:"Chat",chats:"Chat logs",keys:"API Keys",documents:"Documents",media:"Media",catalog:"Catalog",audit:"Audit Logs",settings:"Safety",apiFeatures:"API features",usage:"Usage & Limits",ddos:"DDoS Center",queue:"Queue",pm2:"PM2",system:"System",support:"Support"},queue:{title:"Chat queue",subtitle:"Pause, drain, requeue, and tune concurrency.",paused:"Paused",running:"Consuming",drain:"Drain mode",mode:"Mode",modeOff:"Disabled",depth:"Depth",queued:"Queued",leased:"Leased",activeJobs:"Running",dead:"Dead letter",oldest:"Oldest wait",concurrency:"Per-key / global",worker:"In-process workers",workerInstance:"Worker instance",workerInstanceHint:"This process’s consumer ID (lease owner). Changes on restart.",kpiActiveSub:"{n} active in this process",consumer:"Consumer",admission:"Admission",accepting:"Accepting jobs",pause:"Pause",resume:"Resume",drainBtn:"Drain",undrain:"Stop drain",savePolicy:"Save policy",refresh:"Refresh",jobs:"Jobs",tabOverview:"Overview",tabJobs:"Jobs",tabPolicy:"Policy",jobsMeta:"{n} matching",cancel:"Cancel",requeue:"Requeue",purgeDead:"Purge DLQ & old jobs",purgeTitle:"Purge finished jobs?",purgeConfirm:"Deletes all dead-letter (DLQ) jobs now, plus succeeded / failed / cancelled jobs finished more than 24 hours ago.",purgeConfirmBtn:"Delete",purgeDoneTitle:"Purge complete",purgeDoneMsg:"Deleted {n} job(s).",cancelConfirm:"Cancel this job? If it is running, cancellation is cooperative.",empty:"No jobs match this filter",enabled:"Queue enabled",masterOn:"Queue on",masterOff:"Queue off",masterHint:"Master switch for the durable chat queue. Applies immediately.",disabledBanner:"Queue is disabled — new chat requests bypass the queue and run immediately (subject to concurrency limits).",globalConcurrency:"Global concurrency",perKeyConcurrency:"Per-key concurrency",maxDepth:"Max queue depth",maxDepthKey:"Max per key",fairness:"Fairness",fifo:"Global FIFO",wrr:"Weighted round-robin",playgroundPriority:"Playground priority (lower first)",defaultPriority:"Default priority",leaseMs:"Lease (ms)",maxWaitMs:"Max wait (ms)",filterTitle:"Filter jobs",filterHint:"Filter by status. Auto-refreshes.",filterStatus:"Status",allStatuses:"All statuses",filterDead:"Dead letter (DLQ)",filterQueued:"Queued",filterRunning:"Running / leased",filterFailed:"Failed",filterSucceeded:"Succeeded",filterCancelled:"Cancelled",errorCol:"Error",priorityBtn:"Priority",priorityPh:"Priority (0–1000, lower first)",dlqTitle:"Dead letter queue",dlqHint:"Jobs that exhausted retries — requeue or purge when ready.",viewDlq:"View DLQ",statusPanel:"Runtime status",statusPanelHint:"Live consumer, admission, and worker identity. Auto-refreshes every few seconds.",policyTitle:"Queue policy",policyHint:"Pick a scheme or fine-tune values. Save to apply. Editing pauses auto-refresh.",presetTitle:"Policy schemes",presetHint:"One-click presets. Active = matches form · Saved = currently stored.",presetRelaxed:"Relaxed",presetBalanced:"Balanced",presetStrict:"Strict",presetCustom:"Custom",presetRelaxedHint:"Higher concurrency and deeper queues — better for multi-key playgrounds and burst traffic.",presetBalancedHint:"Default production balance: fair round-robin, moderate depth, one job per key.",presetStrictHint:"Tight limits + global FIFO — protects the host when traffic is untrusted or resource is scarce.",presetCustomHint:"Values do not match a built-in scheme. Adjust fields or pick a scheme above.",presetActiveLabel:"Active: {name}",presetFormLabel:"Draft: {name}",presetTagActive:"Active",presetTagDraft:"Draft",presetTagSaved:"Saved",hintGlobalConc:"Max jobs running at once across all keys",hintPerKeyConc:"Max concurrent jobs for a single API key",hintMaxDepth:"Reject new jobs when total queue is full",hintMaxDepthKey:"Reject when this key has too many waiting/running jobs",hintFairness:"WRR shares capacity across keys; FIFO is global order by priority/time",hintLease:"How long a worker holds a job before reclaim",hintMaxWait:"Client wait timeout while queued",colJob:"Job / request",colSource:"Source",colStatus:"Status",colModel:"Model",colPri:"Pri",colKey:"API key",colTry:"Try",colTime:"Queued",stQueued:"queued",stLeased:"leased",stRunning:"running",stSucceeded:"succeeded",stFailed:"failed",stDead:"dead",stCancelled:"cancelled",srcV1:"API",srcPlayground:"Playground",kpiDepthSub:"{q} queued · {l} leased",kpiQueuedSub:"Waiting for a worker",kpiDeadSub:"Exhausted attempts",kpiOldestSub:"Head of queue wait",wait:"Wait",started:"Started",cancelReq:"Cancel requested"},chat:{title:"Chat",new:"New chat",send:"Send",stop:"Stop",stopped:"stopped",placeholder:"Message… (Enter to send, Shift+Enter newline)",keyMode:"API key",keySelect:"API key",useSessionKey:"Signed-in admin key",useCustomKey:"Custom key",customKey:"Key",includeReasoning:"Show reasoning",resume:"Resume",resumePh:"Grok session UUID",resumeHint:"Continue a Grok CLI session (--resume)",fork:"Fork",memory:"Memory",noPlan:"No plan",permission:"Permission",effort:"Effort",effortDefault:"Default",effort_none:"None",effort_minimal:"Minimal",effort_low:"Low",effort_medium:"Medium",effort_high:"High",effort_xhigh:"X high",effort_max:"Max",tokens:"Tokens",cacheTokens:"cache",cost:"Cost",reasoning:"Thinking",needKey:"Enter or select an API key",attach:"Upload",attachLibrary:"From library",attachHint:"Drop files anywhere on this page, upload, or pick from library",dropTitle:"Drop files to attach",dropHint:"Release to upload — same formats as the attach button",formatsLabel:"Formats",formatsHint:"txt, md, csv, json, xml, html, pdf, images (png/jpg/webp/gif), code (js/ts/py/go/rs/java/c/cpp/css/yml/sql/sh…)",formatsReject:"Unsupported type: {name}. Allowed: {formats}",libraryTitle:"Previously uploaded files",librarySubtitle:"Select files owned by the current API key (same formats as upload).",librarySearch:"Search by name…",libraryEmpty:"No matching files for this key",libraryAdd:"Add selected",librarySelected:"{n} selected",libraryAlready:"Already attached",libraryLoadFail:"Could not load documents",uploading:"Uploading…",uploadFail:"Upload failed",uploadProgress:"Uploading {name}",uploadProgressMulti:"Uploading {name} ({i}/{n})",emptyTitle:"Start a conversation",emptyHint:"Send a message or attach files. Open a previous chat from the history panel to continue.",needContent:"Type a message or attach at least one file",tooManyFiles:"Too many files (max 10 per message)",fileOnlyPrompt:"Please review the attached files.",removeFile:"Remove",docs:"Attachments",you:"You",assistant:"Assistant",streaming:"Streaming…",emptyReply:"(empty reply)",systemPrompt:"System prompt",systemPlaceholder:"Optional system instructions for the model…",systemHint:"Sent as a system message on every turn. Not shown in the chat bubbles.",history:"History",historyEmpty:"No saved conversations yet",historySearch:"Search topics…",historyOpen:"Show history",historyClose:"Close history",rename:"Rename",renamePh:"Conversation topic",untitled:"Untitled chat",deleteConversation:"Delete",deleteConfirm:"Delete this conversation? This cannot be undone.",saveFail:"Could not save conversation",loadFail:"Could not load conversation",historyPrev:"Previous",historyNext:"Next",historyPage:"Page {n} / {total}",msgs:"{n} messages",settings:"Settings",settingsHide:"Hide settings",compress:"Summarize for context",compressConfirm:"Generate a conversation summary for later turns? Your full chat history stays on screen. Only the model context is shortened. This uses one model call.",compressing:"Summarizing…",compressNeedMore:"Need at least 3 messages (or 2 long ones) to summarize. Continue chatting, then try again.",compressFail:"Could not create summary",compressNeedSummary:"Create a summary first (Summarize for context).",compressedBadge:"Summary",compressOk:"Summary ready — full history kept. Context mode set to summary.",compressBusy:"Wait for the current reply to finish",compressResultTitle:"Conversation summary",compressView:"View summary",summaryMeta:"Created: {when} · Based on {n} messages",ctxPolicyTitle:"Model context",ctxRemark:"Full messages stay visible. This only controls what is sent to the model next.",ctxMode:"Context",ctxModeFull:"Full history",ctxModeSummary:"Summary + recent",ctxModeRecent:"Recent only",ctxModeFullLabel:"Sending full history to the model",ctxModeSummaryLabel:"Sending summary + last {n} messages",ctxModeRecentLabel:"Sending last {n} messages only",ctxRecentN:"Recent N",ctxLongHint:"Long thread detected — consider Summary or Recent to reduce tokens and lag.",loadOlder:"Load {n} earlier messages",showMore:"Show more",showLess:"Show less",copy:"Copy",copied:"Copied",copyFail:"Copy failed"},status:{success:"success",error:"error",timeout:"timeout",pending:"pending",active:"active",finished:"finished",online:"online",stopped:"stopped"},dash:{title:"Dashboard",subtitle:"Traffic, queue, safety, and protection at a glance.",last24:"Requests (24h)",totalChat:"Total chats",success:"Success",errors:"Errors / timeout",docs:"Documents",keys:"Active keys",concurrent:"Grok concurrency",recent:"Recent API chats",empty:"No data yet",emptyModels:"No model traffic in the last 24h",updated:"Updated",refresh:"Refresh",viewAll:"View all",openDdos:"DDoS center",openSettings:"Safety",openQueue:"Open queue",kpi24h:"Requests (24h)",kpi24hSub:"{ok} ok · {err} errors",kpiSuccessRate:"Success rate (24h)",kpiSuccessRateSub:"All-time {all}%",kpiErrors:"Errors (24h)",kpiErrorsSub:"All-time {all}",kpiKeys:"API keys",kpiKeysSub:"Active / total",kpiDocs:"Documents",kpiMedia:"Media assets",kpiMediaSub:"{n} in 24h",kpiDocsSub:"Stored files",kpiConv:"Playground threads",kpiConvSub:"{n} updated in 24h",kpiSessions:"OTP sessions",kpiSessionsSub:"Active admin logins",kpiConcurrent:"Grok concurrency",kpiConcurrentSub:"Active / max slots",kpiQueue:"Chat queue",kpiQueueSub:"Depth · running / max · dead",kpiQueueSubLive:"{run}/{max} run · {dead} dead{wait}",kpiQueuePaused:"Paused",kpiQueueDrain:"Drain",kpiQueueOff:"Disabled",kpiSafe:"Global safe",kpiSafeOn:"On",kpiSafeOff:"Off",kpiSafeSub:"{tools} · turns {turns} · {model}",kpiSafeSubEmpty:"Settings unavailable",queuePanel:"Chat queue",queueState:"State",queueLive:"Live",qQueued:"Queued",qRunning:"Running",qDead:"Dead",qSucceeded:"Succeeded",qWorker:"Worker",qWorkerActive:"active slots",qOldest:"oldest wait",qUnavailable:"Queue stats unavailable",safety:"Safety settings",globalSafe:"Global safe mode",safeTools:"Tools",safeTurns:"Max turns",safeTimeout:"Timeout",defaultModel:"Default model",safetyHint:"Affects safe-mode keys and forced-safe traffic. Playground OTP sessions use agent mode unless global safe is on.",protection:"Protection",autoBan:"Auto-ban",on:"On",off:"Off",ruleAuth:"Auth",ruleRate:"429",ruleConn:"Conn",ruleVelocity:"Velocity",bans:"Blacklist",blocked:"Blocked hits",rateHits:"Rate-limit hits",liveConn:"Live connections",proxy:"Proxy IP",hops:"hops",limits:"Key/IP limits",models24h:"Models (24h)",runtime:"Runtime",port:"Listen port",defaultPort:"default",env:"Environment",authMode:"Admin auth",authOtp:"OTP session",encryption:"Encryption",ready:"Ready",notReady:"Not ready"},chats:{title:"Chat history",total:"Total",decrypt:"Open a row to view decrypted content.",search:"Search",searchPh:"Request ID, key name, model…",filterTitle:"Search & filters",filterHint:"Filter, then open a row for full detail.",status:"Status",allStatus:"All statuses",model:"Model",allModels:"All models",apiKey:"API key",allKeys:"All keys",from:"From",to:"To",mode:"Mode",allModes:"All modes",hasDocs:"Has attachments",filter:"Apply filters",reset:"Reset",request:"Request",prompt:"Prompt",response:"Response",time:"Time",attachments:"Attachments",page:"Page",prev:"Previous",next:"Next",perPage:"Per page",detail:"Chat detail",noAttach:"No attachments",openFile:"Open / preview",close:"Close",copyPrompt:"Copy prompt",copyContent:"Copy content",copySystem:"Copy system prompt",copyRawPrompt:"Copy raw prompt",duration:"Duration",stream:"Stream",reasoning:"Reasoning / thought",content:"Content (output)",raw:"Raw stored response",rawPrompt:"Raw stored prompt",userPrompt:"User / conversation prompt",systemPrompt:"System prompt",systemHint:"Extracted from the stored prompt (system role messages).",noSystem:"No system prompt in this request.",hasSystem:"Has system",none:"(none)",file:"file",img:"img",previewFailed:"Preview failed"},keys:{title:"API Keys",new:"New key",searchPh:"Name or key prefix…",name:"Name",role:"Role",mode:"Mode",rate:"Rate / min",status:"Status",created:"Created",edit:"Edit",revoke:"Revoke",confirmRevoke:"Revoke this key?",empty:"No keys",usage24:"24h use",maxTurns:"Max turns",timeoutMs:"Timeout (ms)",ipWhitelist:"IP whitelist",ipWhitelistHint:"One IP or CIDR per line. Empty = allow all IPs.",ipWhitelistCol:"IP allow",ipAll:"All IPs",keyOnce:"Store this key securely — shown once:",roleClient:"client",roleAdmin:"admin",roleClientBadge:"client",roleAdminBadge:"admin",modeSafe:"safe (external)",modeAgent:"agent (full tools)",modeSafeBadge:"safe",modeAgentBadge:"agent",ipCount:"{n} IPs",ipPlaceholder:`127.0.0.1
203.0.113.0/24`},docs:{title:"Documents",total:"Total",file:"File",mime:"MIME",size:"Size",time:"Time",storage:"Storage",storageDb:"Database (encrypted)",storageFs:"Filesystem (encrypted)",storageHint:"Encrypted storage · DB under {dbMax}, files in {dir} · max {upMax}.",download:"Download",downloadFail:"Download failed",binaryPreview:"This is a binary file (e.g. PDF). Preview is not available — please use Download.",delete:"Delete",confirmDel:"Delete this document?",detail:"Document detail",preview:"Preview",copy:"Copy content",empty:"No documents",searchPh:"File name or MIME…",page:"Page",prev:"Previous",next:"Next"},audit:{title:"Audit logs",searchPh:"Action, resource, IP, key…",time:"Time",action:"Action",resource:"Resource",key:"Key",meta:"Meta",empty:"No logs",id:"ID",actions:{chat_create:"Chat create",document_upload:"Document upload",document_delete:"Document delete",document_list:"Document list",document_read:"Document read",document_download:"Document download",api_key_create:"API key create",api_key_update:"API key update",api_key_delete:"API key revoke",api_key_list:"API key list",settings_update:"Settings update",chat_admin_view:"Chat admin view",system_update:"System update",system_update_check:"Update check",ip_ban:"IP ban",ip_unban:"IP unban",ddos_policy_update:"DDoS policy update",pm2_start:"PM2 start",pm2_stop:"PM2 stop",pm2_restart:"PM2 restart",pm2_reload:"PM2 reload",pm2_config:"PM2 config",pm2_switch:"PM2 switch runner",playground_chat:"Playground chat",playground_upload:"Playground upload"},resources:{document:"Document",chat:"Chat",api_key:"API key",settings:"Settings",system:"System",pm2:"PM2",playground:"Playground",ip:"IP"},metaStorage:"Storage",metaAsKey:"As key id",metaAsKeyName:"As key name"},settings:{title:"Safety settings",hint:"Global safe mode for all keys.",globalSafe:"Global safe mode",globalSafeHint:"On = all keys safe. Off = each key’s own mode.",masterOn:"Safe mode on",masterOff:"Safe mode off",disabledBanner:"Global safe is off — keys use their own safe/agent mode.",tools:"Tools mode",toolsHint:"none: no shell/web/write. readonly: read/search only.",toolsNone:"none",toolsReadonly:"readonly",maxTurns:"Max turns",maxTurnsHint:"Safe-mode steps. Chat 3–6 · API 8–12 · multi-step 15–40.",timeout:"Timeout (ms)",timeoutHint:"Safe-mode deadline. 60s–120s normal · 300s–600s long jobs.",defaultModel:"Default model",defaultModelHint:"When client omits model.",modelSource:"Grok CLI",refreshModels:"Refresh models",panel:"Admin Panel",save:"Save",saved:"Saved",guideTitle:"Presets",guideIntro:"Apply, then tweak if needed.",guideApply:"Apply",guideActive:"Applied",guideApplyConfirm:"Apply “{name}” and save? Current values will be replaced.",guideApplied:"Preset saved",chipGlobalOn:"Safe: On",chipGlobalOff:"Safe: Off",scLocalTitle:"Local playground",scLocalDesc:"Full tools on your machine.",scLocalDetail:"Safe OFF · agent keys.",scProdTitle:"Public API",scProdDesc:"Least privilege for apps/customers.",scProdDetail:"Safe ON · tools none · turns 8–12 · 60–120s.",scCodeTitle:"Coding agent",scCodeDesc:"Trusted host only — edit & run.",scCodeDetail:"Safe OFF · agent keys.",scReadTitle:"Read-only",scReadDesc:"Explain/search code, no writes.",scReadDetail:"Safe ON · tools readonly · turns 8–15 · 120–180s.",scChatTitle:"Q&A only",scChatDesc:"Text answers, no tools.",scChatDetail:"Safe ON · tools none · turns 3–6 · 60s.",scLongTitle:"Long safe tasks",scLongDesc:"Many steps without max-turns fail.",scLongDetail:"Safe ON · none/readonly · turns 20–40 · 300–600s.",dangerTitle:"Danger zone",disablePanel:"Disable Admin Panel",disablePanelConfirm:"Disable panel and sign out? Re-enable: ysk-omni admin on",disablePanelDone:"Panel disabled. Re-enable: ysk-omni admin on",panelOffHint:"Turn off here. Re-enable on server: ysk-omni admin on",panelStatus:"Status",panelOn:"On",panelOff:"Off"},apiFeatures:{title:"API features",intro:"Toggle protocols & capabilities · applies in ~2s · no restart.",tabProtocols:"Protocols",tabMedia:"Media",tabCaps:"Capabilities",tabEmu:"Emulation",kpiEnabled:"Enabled",kpiEnabledSub:"Flags currently on",groupMeta:"{on} / {n} enabled",groupProtocols:"Protocol surfaces",groupMedia:"Media APIs (OpenAI-compatible)",groupCaps:"Grok CLI capabilities",groupEmu:"Emulation & safety",presetOpen:"Preset: Open",presetLocked:"Preset: Locked",presetDev:"Preset: Dev",presetConfirm:"Apply feature preset “{name}”? This overwrites all API feature flags.",flag:{openaiChat:"OpenAI Chat Completions",openaiResponses:"OpenAI Responses",anthropicMessages:"Anthropic Messages",imagesApi:"Images API",filesOpenAiAlias:"Files API alias",videoApi:"Videos API (async jobs)",audioApi:"Audio API (speech / STT)",tools:"Tools / function calling",structuredOutput:"Structured output (--json-schema)",vision:"Vision / image parts (--prompt-json)",reasoningEffort:"Reasoning effort",webSearch:"Web search tools",subagents:"Subagents",planMode:"Plan mode",memory:"Cross-session memory",sessionResume:"Session resume / continue",bestOfN:"best-of-n (removed in Grok 1.0+)",checkLoop:"Self-check loop (removed in Grok 1.0+)",systemOverride:"System prompt override",rules:"Extra rules",permissionMode:"Permission mode",sandbox:"Sandbox profile",usageEstimate:"Estimate token usage",assistantsEmulation:"Assistants-lite (local)",strictSampling:"Strict sampling (reject temperature…)",forceDisableToolsInSafe:"Force tool limits in safe mode"},hint:{openaiChat:"POST /v1/chat/completions",openaiResponses:"POST /v1/responses",anthropicMessages:"POST /v1/messages",imagesApi:"POST /v1/images/generations + /edits (agent key)",filesOpenAiAlias:"POST/GET /v1/files → documents + media store",videoApi:"POST /v1/videos + poll GET /v1/videos/:id",audioApi:"POST /v1/audio/speech + /transcriptions (needs provider)",tools:"Maps tools → Grok --tools + system tool list",structuredOutput:"response_format / json_schema",vision:"image_url content parts",reasoningEffort:"--reasoning-effort",webSearch:"When off: --disable-web-search",subagents:"--no-subagents when off",planMode:"--no-plan when off",memory:"--experimental-memory",sessionResume:"--resume / --continue",bestOfN:"Deprecated — Grok Build 1.0+ rejects this flag",checkLoop:"Deprecated — Grok Build 1.0+ rejects this flag",systemOverride:"--system-prompt-override",rules:"--rules",permissionMode:"--permission-mode",sandbox:"--sandbox",usageEstimate:"Fill usage with char/4 estimates",assistantsEmulation:"Local /v1/assistants + /v1/threads",strictSampling:"400 if temperature/top_p/stop sent",forceDisableToolsInSafe:"Keep safe-mode tool policy"}},catalog:{title:"Catalog",intro:"Pull Hugging Face packs, then load a local GGUF into llama-server.",tabPacks:"Curated packs",tabLocal:"Local models",tabHub:"Hugging Face",kpiLoaded:"Loaded",kpiLoadedSub:"Engines in VRAM",kpiLoadedNone:"None loaded",kpiVram:"VRAM",kpiVramSub:"{used} / {budget} MB estimated",kpiLocal:"On disk",kpiLocalSub:"Registry entries",kpiPacks:"Packs",kpiPacksSub:"Curated catalog",filterModality:"Modality",filterAll:"All",colName:"Model",colModality:"Modality",colRuntime:"Runtime",colQuant:"Quant",colVram:"VRAM",colStatus:"Status",colPath:"Path",pull:"Pull",pulling:"Pulling…",pullAgain:"Pull again",onDisk:"On disk",load:"Load",unload:"Unload",loaded:"Loaded",idle:"Idle",emptyPacks:"No packs in this filter",emptyLocal:"Empty registry — pull a pack first",emptyLocalHint:"Open Curated packs, pick a GGUF, then Pull.",hubHint:"Live Hugging Face Hub REST API (/api/models). Paginated with Link cursors. There is no RSS/Atom feed for the model index.",hubSearch:"Search Hub",hubSearchPh:"Qwen, llama, flux, whisper…",hubEmpty:"No Hub results",hubMore:"Load more",downloads:"Downloads",unsupported:"No local runtime",hubFail:"Hub search failed",noQuant:"—",pullFail:"Pull failed",loadFail:"Load failed",unloadFail:"Unload failed",mod:{text:"Text",image:"Image",video:"Video",tts:"Speech",stt:"Transcribe"}},media:{title:"Media library",intro:"Studio, assets, and video jobs. Needs imagesApi / tools (videoApi for video).",tabStudio:"Studio",tabAssets:"Assets",tabJobs:"Jobs",kpiAssetsSub:"Stored media files",kpiJobsSub:"Video generation jobs",kpiStudioSub:"Generate, edit, or image-to-video",assets:"Assets",jobs:"Video jobs",empty:"No media assets yet",jobsEmpty:"No video jobs yet",kind:"Kind",bytes:"Size",provider:"Provider",providerPh:"Provider name…",prompt:"Prompt",created:"Created",status:"Status",preview:"Preview",previewUnsupported:"This format cannot be previewed in the browser. Please download the file.",previewFail:"Failed to load preview",previewTruncated:"preview truncated",download:"Download",delete:"Delete",deleteConfirm:"Soft-delete this media asset?",allKinds:"All kinds",searchPh:"Prompt, filename, MIME, provider, or ID…",from:"From",to:"To",generate:"Generate image",generateTitle:"Generate image",studioTitle:"Media studio",studioHint:"Create images, edit existing images, or start image-to-video jobs. Execution limits follow Safety settings. Requires imagesApi and tools (videoApi for video).",generateHint:"Uses Grok Imagine tools (image_gen, image_edit, image_to_video).",generatePrompt:"Prompt",generatePromptPh:"Describe the image you want to create…",generateSize:"Size",aspectRatio:"Aspect ratio",aspectHint:"Grok Imagine aspect_ratio values (not OpenAI pixel sizes)",generateN:"Count",nHint:"Grok does not batch n; the gateway runs sequential generations (1–4)",generateKey:"API key",generateKeySession:"Signed-in admin session",generateSubmit:"Generate",generateBusy:"Generating… this may take a minute",generateOk:"Image generated. See the assets list below.",generateFail:"Image generation failed",generateNeedPrompt:"Please enter a prompt",modeGenerate:"Generate",modeEdit:"Edit",modeVideo:"Video",modelDefault:"system default",modelEmpty:"No models reported by Grok CLI",modelHint:"All models from the local Grok CLI; system default is pre-selected",editSubmit:"Edit image",editBusy:"Editing…",editOk:"Image edited. See the assets list below.",editNeedImage:"Select or drop a source image to edit",editImage:"Source image",editImageHint:"Required for image_edit",editPromptPh:"Describe the changes to apply…",videoSubmit:"Create video job",videoBusy:"Queuing video job…",videoOk:"Video job queued. See the Jobs tab.",videoVoice:"Voice",videoVoiceNone:"No speech",videoVoiceHint:"Optional preset voice — uses reference_to_video",videoDuration:"Duration",videoDurationHint:"Grok image_to_video / reference_to_video: 1–15 seconds",videoSource:"Source frame (optional)",videoSourceHint:"Optional. If omitted, a frame is generated from the prompt first, then animated.",videoNoSource:"Auto-generate frame from prompt",videoPromptPh:"Describe camera motion and the shot…",sourceTitle:"Source image",sourceHint:"Drag and drop an image, choose a local file, or pick any image from Documents or Media assets.",dropzoneAria:"Drop zone for source image",dropTitle:"Drop an image here",dropHint:"Or choose a local file / pick from the system library",dropTitleVideo:"Drop a source frame (optional)",dropHintVideo:"Optional for video. Empty source generates a frame from the prompt first.",pickFile:"Choose file",pickLibrary:"System library",clearSource:"Clear",sourceNeedImage:"Please provide an image file (PNG, JPEG, WebP, GIF…)",sourceKindUpload:"Upload",sourceKindAsset:"Media asset",sourceKindDocument:"Document",libraryTitle:"Select source file",librarySubtitle:"Any image stored in Documents or Media assets on this gateway.",libraryTabDocs:"Documents",libraryTabAssets:"Media assets",librarySearch:"Search by name, MIME, or ID…",libraryFormats:"Images only (PNG, JPEG, WebP, GIF, …)",libraryEmpty:"No matching files",librarySelect:"Use selected",libraryLoadFail:"Failed to load library"},usage:{title:"Usage & anti-abuse",window:"Window",requests:"Requests",success:"Success",errors:"Errors",errorRate:"Error rate",byModel:"By model",byKey:"Per API key",rateLimit:"Limit / min",util:"Est. utilization",lastUsed:"Last used",limits:"Gateway limits",global:"Global max / window",ipMax:"Unauth IP max",burst:"Chat burst (10s)",block:"Auth fail block threshold",concurrent:"Grok max concurrent",refresh:"Refresh"},ddos:{title:"DDoS control center",tabPolicy:"Policy",tabLive:"Traffic",tabBlacklist:"Blacklist",tabEvents:"Events",live:"Live connections",recent:"Recent requests",blacklist:"IP blacklist",stats:"Abuse stats",refresh:"Refresh",pause:"Pause auto-refresh",resume:"Resume auto-refresh",ban:"Ban IP",unban:"Unban",banConfirm:"Ban this IP?",banWhitelistWarn:"This IP is on the auto-ban whitelist. Ban anyway?",unbanConfirm:"Remove this IP from blacklist?",ip:"IP",method:"Method",path:"Path",key:"API key",duration:"Duration",state:"State",ua:"User-Agent",reason:"Reason",source:"Source",expires:"Expires",permanent:"Permanent",addBan:"Add ban",ttl:"TTL",ttlPerm:"Permanent",ttl1h:"1 hour",ttl24h:"24 hours",ttl7d:"7 days",activeConn:"Active",rateHits:"Rate-limit hits",blockedHits:"Blocked hits",autoBans:"Auto bans",topIps:"Top IPs (recent)",emptyLive:"No active connections",emptyBan:"Blacklist is empty",emptyEvents:"No auto-ban events yet",reasonPh:"Optional reason",banReasonDefault:"manual from admin",ipPlaceholder:"1.2.3.4",policyTitle:"Protection policy",policyHint:"All thresholds are live — no restart. Env values are only the initial defaults.",autoOn:"Auto-judgment ON",autoOff:"Auto-judgment OFF",autoBanMaster:"Enable automatic IP bans",autoBanMasterHint:"When off, rate limits still apply but IPs are never auto-banned.",masterOn:"Auto-ban on",masterOff:"Auto-ban off",disabledBanner:"Automatic IP bans are off — rate limits still apply, but IPs will not be auto-blacklisted.",presetTitle:"Policy profile",presetHint:"Pick a profile or edit fields — custom is detected automatically.",presetRelaxed:"Relaxed",presetBalanced:"Balanced",presetStrict:"Strict",presetCustom:"Custom",presetActiveLabel:"Active: {name}",presetFormLabel:"Form: {name} (unsaved)",presetTagActive:"Active",presetTagDraft:"Draft",presetTagSaved:"Saved",presetActiveHint:"Current profile: {name}. Click Save if you changed other fields.",presetCustomHint:"Values do not match Relaxed / Balanced / Strict — treated as Custom.",presetUnsavedHint:"Form shows {form}; server still has {saved}. Click Save policy to apply.",savePolicy:"Save policy",resetPolicy:"Reset to env defaults",policySaved:"Protection policy saved. Rate limiters reloaded.",policyReset:"Policy reset to environment defaults.",confirmReset:"Reset all DDoS policy fields to .env defaults?",sectionProxy:"Reverse proxy / CDN",proxyHint:"When traffic passes through nginx or Cloudflare, enable trust hops so bans, rate limits, and audit logs use the real client IP — not the proxy IP.",proxyTrustHops:"Trusted proxy hops",proxyTrustHopsHint:"0 = direct only (ignore headers). 1 = nginx or Cloudflare→app. 2 = Cloudflare→nginx→app.",proxyIpSource:"Client IP source",proxyIpSourceHint:"auto tries CF-Connecting-IP, then X-Real-IP, then X-Forwarded-For. Use “socket” only for direct connections.",proxySrcAuto:"Auto (recommended)",proxySrcCf:"Cloudflare (CF-Connecting-IP)",proxySrcNginx:"nginx (X-Real-IP)",proxySrcXff:"X-Forwarded-For only",proxySrcSocket:"TCP socket only (no proxy)",trustedProxies:"Trusted proxy IPs / CIDRs",trustedProxiesHint:"Only these peers may set CF-Connecting-IP / X-Real-IP / XFF. Default 127.0.0.1 — add your nginx/LB host if remote. Direct clients cannot spoof headers.",sectionLimits:"Rate limits",sectionAuth:"Failed authentication",sectionRate:"Rate-limit abuse (429)",sectionConn:"Connection flood",sectionVelocity:"Request velocity",sectionEscalate:"Repeat offender escalation",sectionWhitelist:"Auto-ban whitelist",whitelistHint:"One IP or CIDR per line. These IPs are never auto-banned.",rateWindow:"Window (sec)",rateMaxKey:"Max / key",rateMaxIp:"Max / IP (no key)",burstWindow:"Burst window (sec)",burstMax:"Burst max",enableRule:"Enabled",threshold:"Threshold",windowSec:"Window (sec)",banMin:"Ban duration (min)",escalateAfter:"Escalate after N auto-bans",escalateMin:"Escalated ban (min)",maxConcurrent:"Max concurrent / IP",velocityMax:"Max requests",eventsTitle:"Recent auto-ban events",eventTime:"When",eventSource:"Rule",eventDuration:"Ban for",sources:{manual:"Manual","auto-auth":"Auto · auth","auto-rate":"Auto · 429","auto-conn":"Auto · concurrent","auto-velocity":"Auto · velocity","auto-escalate":"Auto · escalated"}},pm2:{title:"PM2 control",tabRunner:"Runner",tabPort:"Port",tabConfig:"Config",tabLogs:"Logs",status:"Process status",start:"Start with PM2",stop:"Stop PM2",restart:"Restart",reload:"Reload",logs:"Logs",logsHint:"Error log first",clearLogs:"Clear logs",confirmClearLogs:"Clear PM2 and ysk-omni log files? This cannot be undone (files are truncated).",logsCleared:"Cleared {n} log file(s).",logsAutoTrim:"Auto-trim over {maxMb} MB → keep last ~{keepKb} KB (on each log read).",refresh:"Refresh",confirmStop:"Stop the PM2 process?",confirmRestart:"Restart under PM2? Port will be handed over cleanly.",unavailable:"PM2 not available",disabled:"PM2 admin is disabled",app:"App name",pid:"PID",uptime:"Uptime",memory:"Memory",cpu:"CPU",restarts:"Restarts",portBusy:"Port in use",port:"Port",portTitle:"Listen port",portHint:"HTTP port for the gateway Admin UI and API. Changing the port updates .env and restarts the runner so the new port takes effect.",fieldPort:"Port",portDefaultNote:"Default is 3850. Valid range: 1–65535.",savePort:"Save port & restart",useDefaultPort:"Use default (3850)",portInvalid:"Enter a valid port number (1–65535).",confirmPortChange:"Change listen port to {port} and restart the gateway? You will need to open Admin on the new port (e.g. http://localhost:{port}/admin).",portChangedMsg:"Port updated: {from} → {to}.",portSavedNeedRestart:"Port {port} saved to .env. Restart the gateway for it to take effect.",portAfterRestart:"After restart, open Admin at http://localhost:{port}/admin",hint:"Run with PM2 or detached ysk-omni. Switch anytime here or via CLI.",switchTitle:"Runner",switchHint:"Only one runner should bind the port.",currentRunner:"Current runner",runnerPm2:"PM2",runnerGctoac:"ysk-omni (detached)",runnerNone:"Not running",runnerUnknown:"Unknown / mixed",switchToPm2:"Switch to PM2",switchToGctoac:"Switch to ysk-omni",confirmSwitchPm2:"Switch to PM2? Gateway restarts under PM2 in a few seconds.",confirmSwitchGctoac:"Switch to ysk-omni? Gateway restarts as a detached process in a few seconds.",switchScheduled:"Switch scheduled. Admin will refresh automatically in about 10 seconds.",autoRefreshIn:"This page will reload automatically in {n} seconds…",autoRefreshNow:"Reloading…",omniPid:"ysk-omni PID",configTitle:"PM2 config",configHint:"Saved to pm2.runtime.json and applied via ecosystem.config.cjs. Save & apply restarts PM2 if it is the active runner.",saveConfig:"Save & apply",saveOnly:"Save only",resetConfig:"Reset defaults",confirmReset:"Reset PM2 config to defaults?",configSaved:"Config saved",fieldName:"App name",fieldScript:"Script",fieldCwd:"Working directory (cwd)",fieldInstances:"Instances",fieldExecMode:"Exec mode",fieldAutorestart:"Autorestart",fieldWatch:"Watch",fieldMaxMem:"Max memory restart",fieldMaxRestarts:"Max restarts",fieldMinUptime:"Min uptime",fieldRestartDelay:"Restart delay (ms)",fieldBackoff:"Exp backoff restart delay (ms)",fieldMergeLogs:"Merge logs",fieldTime:"Log timestamps",fieldErrorFile:"Error log file",fieldOutFile:"Out log file",fieldEnvExtra:"Extra env (KEY=value per line)",fieldPreferred:"Preferred runner",empty:"App not in pm2 list",modeFork:"fork",modeCluster:"cluster",phCwd:"(package root)",phInstances:"1 or max",phEnv:"NODE_ENV=production",statusOnline:"online",statusErrored:"errored",statusStopped:"stopped",msgOk:"OK",msgDisabled:"PM2 admin is disabled (PM2_ADMIN_ENABLED=false).",msgBinaryMissing:"pm2 not found on PATH. Install: npm install -g pm2",msgNotInList:'App "{app}" is not in the PM2 list — use Start with PM2 or Switch to PM2.',msgPortGctoac:"Port {port} is held by ysk-omni (pid {pid}). Use “Switch to PM2” to hand over.",msgPortBusy:"Port {port} is in use (pid {pids}).",msgErrored:"PM2 process errored — check logs / config, then Restart or fix port conflicts.",msgBothRunners:"Both runners detected; ysk-omni pid {pid} also holds resources. Prefer one via Switch.",msgError:"PM2 error: {error}",msgSwitchPm2:"Switching to PM2… The gateway will restart under PM2 in a few seconds.",msgSwitchGctoac:"Switching to ysk-omni… The gateway will restart as a detached process in a few seconds."},system:{title:"System",tabSoftware:"Software",tabSessions:"Grok sessions",sessionsHint:"Local Grok Build sessions on this machine (not gateway chat logs).",sessionsSearch:"Search title, summary, or id…",sessionDelete:"Delete",sessionDeleteConfirm:"Permanently delete Grok session {id}? This cannot be undone.",sessionId:"Session",sessionTitle:"Title",sessionCwd:"cwd",sessionUpdated:"Updated",tabPackage:"Package",tabEnv:"Environment",envHint:"Runtime env & version snapshot.",checkUpdate:"Check for updates",oneClick:"Update package & restart",selfUpdate:"Package version",selfHint:"Compare versions · update package restarts the gateway.",current:"This install",npm:"npm latest",github:"GitHub latest",install:"Install channel",confirmUpdate:"Update the package and restart the gateway? API will be briefly unavailable.",scheduled:"Update scheduled. Refresh this page in ~30s.",database:"Database",grokCli:"Grok CLI (removed)",grokInspect:"Grok leftover",grokInspectHint:"GCTOAC leftover. Grok CLI is not spawned; local engines are llama-server / vLLM.",grokVersion:"Grok version",inspectChannel:"Channel",inspectDefaultModel:"Default model",inspectModels:"Models",inspectSkills:"Skills",inspectMcp:"MCP servers",inspectPlugins:"Plugins",inspectHooks:"Hooks",concurrency:"Concurrency",runtime:"Runtime health",software:"Required software",softwareHint:"Required tools and installed versions.",softName:"Software",softLevel:"Need",softInstalled:"Installed",softVersion:"Version",softStatus:"Status",softDetail:"Note",levelRequired:"Required",levelRecommended:"Recommended",levelOptional:"Optional",levelBundled:"Bundled",softOk:"OK",softMissing:"Missing",softWarn:"Warning",envTitle:"Environment",up:"Up",down:"Down",yes:"Yes",no:"No",badgeUpdate:"Update available",badgeOk:"Up to date",badgeAhead:"Newer than npm",badgeUnknown:"Unknown",statusHintUpdate:"A newer published version is available. Use “Update package & restart”.",statusHintOk:"This install matches the latest known release.",statusHintAhead:"Local version is newer than npm (typical for git / dev). “Update package” still pulls latest git commits if on the git channel.",statusHintUnknown:"Could not reach npm/GitHub to compare versions.",checkResult:"Version check",channelGit:"git (dev tree)",channelNpmGlobal:"npm global",channelNpmLocal:"npm local",channelUnknown:"unknown",encryption:"Encryption",ready:"Ready",notReady:"Not ready",allRequiredOk:"All required software present",requiredMissing:"Some required software is missing"},support:{title:"Support",subtitle:"Creator, sponsors, and YSK Limited — free product, real help",pillSupport:"Support",pillSponsor:"Sponsor · Linktree",pillHelp:"Questions? email@ysk.hk",creatorTitle:"Creator",creatorBody:"This Grok → OpenAI gateway is free and open source, for people who want to run Grok CLI themselves. Feedback and bug reports keep the project going.",sponsorTitle:"Support / sponsor",sponsorBody:"If this gateway saves you time, consider sponsoring development. Every bit helps keep it free for everyone.",githubSponsors:"GitHub Sponsors",linktree:"Linktree",walletsTitle:"Crypto / Web3 addresses",walletsHint:"Send only on the matching network. Double-check the address before you transfer.",net:"Network",addr:"Address",copy:"Copy",netEvm:"EVM (ETH/BSC/AVAX)",netNear:"NEAR",netAda:"ADA (Cardano)",yskTitle:"YSK Limited",yskBody:"Need hands-on help beyond the free Admin panel? YSK Limited can provide:",yskLi1:"Server install, hardening, and day-to-day ops",yskLi2:"Hosting stack (web, email, DNS, databases)",yskLi3:"Migration, automation, and custom integration",yskLi4:"Incident response and go-live checks",yskPrice:"No public price list — email us and we will scope it to your setup.",site:"ysk.hk",helpTitle:"Have a problem?",helpBody:"Email with OS, install / log path, and expected vs actual result. Every message is read.",docs:"Full docs are in the repo README"},common:{empty:"No data",active:"active",revoked:"revoked",save:"Save",cancel:"Close",loading:"Loading…",powered:"Powered by",actions:"Actions",yes:"Yes",no:"No",ok:"OK",confirm:"Confirm",notice:"Notice",confirmTitle:"Please confirm",dangerTitle:"Confirm action",apply:"Apply",reset:"Reset",search:"Search",prev:"Previous",next:"Next",perPage:"Per page",pagerTotal:"Total {n}",pagerPage:"Page {n} / {total}",filterTitle:"Search & filters",filterHint:"Narrow results, then apply",sortHint:"Click to sort (API). Default: newest first",all:"All",requestFailed:"Request failed",featureOff:"Off",ms:"{n} ms",perMin:"{n}/min",minutes:"{n} min",mb:"{n} MB",percent:"{n}%",ipLabel:"IP",uaLabel:"UA",httpStatus:"HTTP"},errors:{unauthorized:"Invalid or missing credentials. Please sign in again.",forbidden:"You do not have permission for this action.",not_found:"The requested resource was not found.",validation_error:"Invalid request. Please check your input.",rate_limit_exceeded:"Rate limit exceeded. Please try again later.",concurrency_limit_exceeded:"Too many concurrent Grok jobs. Please wait and retry.",internal_error:"An internal server error occurred.",grok_error:"Grok CLI returned an error.",grok_timeout:"Grok CLI timed out.",grok_not_available:"Grok CLI is not available on this server.",document_too_large:"The document exceeds the maximum allowed size.",document_type_not_allowed:"This document type is not allowed.",invalid_cwd:"The working directory is not allowed.",service_unavailable:"The service is temporarily unavailable.",queue_full:"The chat queue is full. Please try again later.",queue_draining:"The chat queue is paused or draining.",queue_wait_timeout:"Timed out while waiting in the chat queue.",queue_cancelled:"The chat job was cancelled.",media_not_supported:"This media feature is not available or is disabled.",media_provider_unavailable:"The media provider is not available.",media_generation_failed:"Media generation failed.",media_forbidden:"Media generation is not allowed for this API key. Use an agent-mode key or an admin session.",feature_disabled:"This API feature is disabled.",feature:{imagesApi:"Images API is disabled. Enable it under Admin → API features → Images API.",videoApi:"Video API is disabled. Enable it under Admin → API features → Videos API.",audioApi:"Audio API is disabled. Enable it under Admin → API features → Audio API.",tools:"Tools are disabled. Enable Tools under Admin → API features (required for image generation).",filesOpenAiAlias:"OpenAI Files API alias is disabled. Enable it under Admin → API features → Files API alias."},media:{agent_or_admin_required:"Image generation requires an agent-mode API key or an admin session. Safe-mode keys cannot use image tools.",source_required:"Provide an image file, a media asset, or a document as the source.",source_must_be_image:"The selected source must be an image for edit or video generation.",no_image_in_sandbox:"Grok finished but no image file was found in the sandbox or this run's session images/. This is not an imagesApi or API-key problem.",no_video_in_sandbox:"Grok finished but no video file was found in the sandbox or this run's session.",provider_no_edit:"The current media provider does not support image edits."}}},"zh-Hant":{brand:"YSK Omni",brandSub:"管理面板",loginTitle:"管理員登入",loginLabel:"API 金鑰",loginOtpLabel:"一次性登入碼",loginBtn:"登入",loginCmdHint:"終端機取得 key：",loginOtpHint:"每次登入請在終端機產生新碼：",loginOtpExpiry:"登入碼 5 分鐘內有效，且只能使用一次。",loginOtpFail:"登入碼無效或已過期",loginLostKey:"舊 key 無法找回（只存 hash），請建立新的 admin key。",loginCopy:"複製",loginCopied:"已複製",needKey:"請輸入 API 金鑰",needOtp:"請輸入終端機產生的一次性登入碼",logout:"登出",shell:{menu:"開啟選單",closeMenu:"關閉選單"},nav:{dashboard:"儀表板",chat:"對話",chats:"對話記錄",keys:"API 金鑰",documents:"文件",media:"媒體庫",catalog:"目錄",audit:"稽核日誌",settings:"安全設定",apiFeatures:"API 能力",usage:"用量與防護",ddos:"DDoS 中心",queue:"佇列",pm2:"PM2",system:"系統狀態",support:"支持"},queue:{title:"對話佇列",subtitle:"暫停、排空、重新入隊，並調整併發。",paused:"已暫停",running:"消費中",drain:"排空模式",mode:"模式",modeOff:"已停用",depth:"佇列深度",queued:"排隊中",leased:"已認領",activeJobs:"執行中",dead:"死信",oldest:"最長等待",concurrency:"每 Key / 全域",worker:"進程內 worker",workerInstance:"Worker 實例",workerInstanceHint:"本進程消費者 ID（租約持有者）。重啟後會變更。",kpiActiveSub:"本進程進行中 {n} 個",consumer:"消費者",admission:"接單",accepting:"接受新單",pause:"暫停消費",resume:"恢復消費",drainBtn:"排空",undrain:"停止排空",savePolicy:"儲存政策",refresh:"重新整理",jobs:"工作列表",tabOverview:"總覽",tabJobs:"工作列表",tabPolicy:"政策",jobsMeta:"共 {n} 筆",cancel:"取消",requeue:"重新入隊",purgeDead:"清理死信與舊工作",purgeTitle:"確認清理工作？",purgeConfirm:"會立即刪除全部死信（DLQ），以及完成已超過 24 小時的成功／失敗／取消工作。",purgeConfirmBtn:"確認刪除",purgeDoneTitle:"清理完成",purgeDoneMsg:"已刪除 {n} 筆工作。",cancelConfirm:"取消此工作？若正在執行，取消為協作式（cooperative）。",empty:"沒有符合篩選的工作",enabled:"啟用佇列",masterOn:"佇列已開",masterOff:"佇列已關",masterHint:"對話佇列總開關，即時生效。",disabledBanner:"佇列已關閉 — 新對話會跳過排隊、即時執行（仍受併發上限約束）。",globalConcurrency:"全域併發",perKeyConcurrency:"每 Key 併發",maxDepth:"全域佇列上限",maxDepthKey:"每 Key 上限",fairness:"公平策略",fifo:"全域 FIFO",wrr:"加權輪詢",playgroundPriority:"Playground 優先級（越小越先）",defaultPriority:"預設優先級",leaseMs:"租約（ms）",maxWaitMs:"最長等待（ms）",filterTitle:"篩選工作",filterHint:"依狀態篩選。會自動重新整理。",filterStatus:"狀態",allStatuses:"全部狀態",filterDead:"死信（DLQ）",filterQueued:"排隊中",filterRunning:"執行中 / 已認領",filterFailed:"失敗",filterSucceeded:"成功",filterCancelled:"已取消",errorCol:"錯誤",priorityBtn:"優先級",priorityPh:"優先級（0–1000，越小越先）",dlqTitle:"死信佇列",dlqHint:"已用盡重試次數 — 可重新入隊或清理。",viewDlq:"查看死信",statusPanel:"運行狀態",statusPanelHint:"消費者、接單與 worker 實例即時狀態；每隔數秒自動重新整理。",policyTitle:"佇列政策",policyHint:"可先選方案再微調數值；儲存後生效。編輯時會暫停自動重新整理。",presetTitle:"政策方案",presetHint:"一鍵套用。Active＝表單目前值 · Saved＝已儲存。",presetRelaxed:"寬鬆",presetBalanced:"均衡",presetStrict:"嚴格",presetCustom:"自訂",presetRelaxedHint:"較高併發、較深佇列 — 適合多 key／Playground 與突發流量。",presetBalancedHint:"預設生產平衡：公平輪詢、中等深度、每 key 同時只跑 1 個。",presetStrictHint:"較低上限 + 全域 FIFO — 流量不可信或主機資源緊張時使用。",presetCustomHint:"數值不符合內建方案。可繼續微調，或於上方選取一個方案。",presetActiveLabel:"目前：{name}",presetFormLabel:"草稿：{name}",presetTagActive:"目前",presetTagDraft:"草稿",presetTagSaved:"已套用",hintGlobalConc:"全域同時執行的工作上限",hintPerKeyConc:"單一 API key 同時執行上限",hintMaxDepth:"佇列總深度滿時拒收新單",hintMaxDepthKey:"該 key 排隊／執行過多時拒收",hintFairness:"WRR 按 key 輪流；FIFO 按全域優先級與時間",hintLease:"Worker 持有工作多久未完成會被回收",hintMaxWait:"客戶端排隊最長等待時間",colJob:"工作 / 請求",colSource:"來源",colStatus:"狀態",colModel:"模型",colPri:"優先",colKey:"API 金鑰",colTry:"嘗試",colTime:"入隊時間",stQueued:"排隊",stLeased:"已認領",stRunning:"執行中",stSucceeded:"成功",stFailed:"失敗",stDead:"死信",stCancelled:"已取消",srcV1:"API",srcPlayground:"Playground",kpiDepthSub:"{q} 排隊 · {l} 認領",kpiQueuedSub:"等待 worker",kpiDeadSub:"重試已盡",kpiOldestSub:"隊頭等待時間",wait:"等待",started:"開始",cancelReq:"已請求取消"},chat:{title:"對話",new:"新對話",send:"傳送",stop:"停止",stopped:"已停止",placeholder:"輸入訊息…（Enter 傳送，Shift+Enter 換行）",keyMode:"API 金鑰",keySelect:"API 金鑰",useSessionKey:"目前登入的 admin 金鑰",useCustomKey:"自訂金鑰",customKey:"金鑰",includeReasoning:"顯示思考",resume:"繼續 session",resumePh:"Grok session UUID",resumeHint:"用 --resume 接續 Grok CLI session",fork:"Fork",memory:"記憶",noPlan:"關 plan",permission:"權限",effort:"推理力度",effortDefault:"預設",effort_none:"無",effort_minimal:"最低",effort_low:"低",effort_medium:"中",effort_high:"高",effort_xhigh:"極高",effort_max:"最大",tokens:"Tokens",cacheTokens:"快取",cost:"費用",reasoning:"思考過程",needKey:"請輸入或選擇 API 金鑰",attach:"上傳",attachLibrary:"從已上傳選擇",attachHint:"可於本頁任意位置拖放檔案、上傳，或從已上傳庫挑選",dropTitle:"放開以附加檔案",dropHint:"放開即上傳 — 格式與「上傳」按鈕相同",formatsLabel:"格式",formatsHint:"txt、md、csv、json、xml、html、pdf、圖片（png/jpg/webp/gif）、程式碼（js/ts/py/go/rs/java/c/cpp/css/yml/sql/sh…）",formatsReject:"不支援的格式：{name}。允許：{formats}",libraryTitle:"已上傳的檔案",librarySubtitle:"選擇目前 API 金鑰名下的檔案（格式與上傳相同）。",librarySearch:"依檔名搜尋…",libraryEmpty:"此金鑰沒有符合的檔案",libraryAdd:"加入所選",librarySelected:"已選 {n} 個",libraryAlready:"已附加",libraryLoadFail:"無法載入檔案列表",uploading:"上傳中…",uploadFail:"上傳失敗",uploadProgress:"正在上傳 {name}",uploadProgressMulti:"正在上傳 {name}（{i}/{n}）",emptyTitle:"開始對話",emptyHint:"輸入訊息或附加檔案。可從右側歷史開啟舊對話繼續。",needContent:"請輸入訊息或至少附加一個檔案",tooManyFiles:"檔案太多（每則訊息最多 10 個）",fileOnlyPrompt:"請查看附加的檔案。",removeFile:"移除",docs:"附件",you:"你",assistant:"助理",streaming:"串流中…",emptyReply:"（無回覆內容）",systemPrompt:"系統提示",systemPlaceholder:"可選：模型系統指示（system 訊息）…",systemHint:"每次傳送會以 system 角色附帶，不會顯示於對話氣泡。",history:"歷史對話",historyEmpty:"尚未有已儲存的對話",historySearch:"搜尋主題…",historyOpen:"顯示歷史",historyClose:"關閉歷史",rename:"重新命名",renamePh:"對話主題",untitled:"未命名對話",deleteConversation:"刪除",deleteConfirm:"確定刪除此對話？此操作無法還原。",saveFail:"無法儲存對話",loadFail:"無法載入對話",historyPrev:"上一頁",historyNext:"下一頁",historyPage:"第 {n} / {total} 頁",msgs:"{n} 則訊息",settings:"設定",settingsHide:"收起設定",compress:"產生語境摘要",compressConfirm:"為之後回合產生對話摘要以節省 token？畫面上的完整對話記錄不會被刪除或改寫，只影響傳送給模型的內容。此操作會呼叫模型一次。",compressing:"正在產生摘要…",compressNeedMore:"至少需要 3 則訊息（或 2 則較長內容）才可產生摘要。請先繼續對話再試。",compressFail:"無法產生摘要",compressNeedSummary:"請先按「產生語境摘要」建立摘要。",compressedBadge:"摘要",compressOk:"摘要已就緒（完整記錄仍保留）。已切換為「摘要 + 最近訊息」模式。",compressBusy:"請等待目前回覆完成",compressResultTitle:"對話摘要",compressView:"查看摘要",summaryMeta:"產生時間：{when} · 依據 {n} 則訊息",ctxPolicyTitle:"模型上下文",ctxRemark:"完整訊息仍顯示於對話區。此設定只控制下一次傳送給模型的內容。",ctxMode:"上下文",ctxModeFull:"完整記錄",ctxModeSummary:"摘要 + 最近",ctxModeRecent:"僅最近",ctxModeFullLabel:"目前送出完整對話記錄",ctxModeSummaryLabel:"目前送出摘要 + 最近 {n} 則",ctxModeRecentLabel:"目前只送出最近 {n} 則",ctxRecentN:"最近則數",ctxLongHint:"對話較長 — 建議改用「摘要 + 最近」或「僅最近」，以減少 token 並避免介面卡頓。",loadOlder:"載入較早的 {n} 則訊息",showMore:"顯示更多",showLess:"收合",copy:"複製",copied:"已複製",copyFail:"複製失敗"},status:{success:"成功",error:"錯誤",timeout:"逾時",pending:"處理中",active:"進行中",finished:"已完成",online:"運行中",stopped:"已停止"},dash:{title:"儀表板",subtitle:"流量、佇列、安全與防護一覽。",last24:"最近 24h 請求",totalChat:"總對話",success:"成功",errors:"錯誤/逾時",docs:"文件",keys:"活躍金鑰",concurrent:"Grok 併發",recent:"最近 API 請求",empty:"暫無資料",emptyModels:"最近 24h 尚無模型用量",updated:"更新於",refresh:"重新整理",viewAll:"查看全部",openDdos:"DDoS 中心",openSettings:"安全設定",openQueue:"開啟佇列",kpi24h:"請求（24h）",kpi24hSub:"{ok} 成功 · {err} 錯誤",kpiSuccessRate:"成功率（24h）",kpiSuccessRateSub:"全部時間 {all}%",kpiErrors:"錯誤（24h）",kpiErrorsSub:"全部時間 {all}",kpiKeys:"API 金鑰",kpiKeysSub:"活躍 / 總數",kpiDocs:"文件",kpiMedia:"媒體資產",kpiMediaSub:"24 小時 {n} 個",kpiDocsSub:"已儲存檔案",kpiConv:"Playground 對話",kpiConvSub:"24h 內更新 {n} 則",kpiSessions:"OTP 工作階段",kpiSessionsSub:"目前有效的管理員登入",kpiConcurrent:"Grok 併發",kpiConcurrentSub:"進行中 / 上限",kpiQueue:"對話佇列",kpiQueueSub:"深度 · 執行 / 上限 · 死信",kpiQueueSubLive:"{run}/{max} 執行 · {dead} 死信{wait}",kpiQueuePaused:"已暫停",kpiQueueDrain:"排空",kpiQueueOff:"已停用",kpiSafe:"全域安全",kpiSafeOn:"開",kpiSafeOff:"關",kpiSafeSub:"{tools} · turns {turns} · {model}",kpiSafeSubEmpty:"無法讀取設定",queuePanel:"對話佇列",queueState:"狀態",queueLive:"運作中",qQueued:"排隊中",qRunning:"執行中",qDead:"死信",qSucceeded:"已成功",qWorker:"Worker",qWorkerActive:"活躍槽",qOldest:"最舊等待",qUnavailable:"無法取得佇列統計",safety:"安全設定",globalSafe:"全域安全模式",safeTools:"工具",safeTurns:"最大 turns",safeTimeout:"逾時",defaultModel:"預設模型",safetyHint:"影響 safe 模式金鑰與強制 safe 的流量。Playground OTP 預設 agent；開啟全域安全後會套用 safe 限制。",protection:"防護狀態",autoBan:"自動封鎖",on:"開",off:"關",ruleAuth:"認證",ruleRate:"429",ruleConn:"並發",ruleVelocity:"速率",bans:"黑名單",blocked:"已攔截",rateHits:"限流次數",liveConn:"即時連線",proxy:"代理 IP",hops:"層數",limits:"金鑰/IP 上限",models24h:"模型用量（24h）",runtime:"運行環境",port:"監聽連接埠",defaultPort:"預設",env:"環境",authMode:"管理登入",authOtp:"OTP 工作階段",encryption:"加密",ready:"就緒",notReady:"未就緒"},chats:{title:"對話記錄",total:"共",decrypt:"點選列項可查看解密後內容。",search:"搜尋",searchPh:"請求 ID、金鑰名稱、模型…",filterTitle:"搜尋與篩選",filterHint:"篩選後點列項查看詳情。",status:"狀態",allStatus:"全部狀態",model:"模型",allModels:"全部模型",apiKey:"API 金鑰",allKeys:"全部金鑰",from:"由",to:"至",mode:"模式",allModes:"全部模式",hasDocs:"有附件",filter:"套用篩選",reset:"重設",request:"請求",prompt:"提示",response:"回覆",time:"時間",attachments:"附件",page:"頁",prev:"上一頁",next:"下一頁",perPage:"每頁",detail:"對話詳情",noAttach:"無附件",openFile:"開啟 / 預覽",close:"關閉",copyPrompt:"複製提示",copyContent:"複製內容",copySystem:"複製 system prompt",copyRawPrompt:"複製原始 prompt",duration:"耗時",stream:"串流",reasoning:"思考過程",content:"輸出內容",raw:"原始儲存回覆",rawPrompt:"原始儲存 prompt",userPrompt:"用戶／對話 prompt",systemPrompt:"System prompt",systemHint:"從已儲存 prompt 中抽出 system 角色內容。",noSystem:"此請求沒有 system prompt。",hasSystem:"有 system",none:"（無）",file:"檔案",img:"圖片",previewFailed:"預覽失敗"},keys:{title:"API 金鑰",new:"新增金鑰",searchPh:"名稱或 key 前綴…",name:"名稱",role:"角色",mode:"模式",rate:"速率 / 分",status:"狀態",created:"建立",edit:"編輯",revoke:"撤銷",confirmRevoke:"確定撤銷此金鑰？",empty:"暫無",usage24:"24h 用量",maxTurns:"最大 turns",timeoutMs:"逾時 (ms)",ipWhitelist:"IP 白名單",ipWhitelistHint:"每行一個 IP 或 CIDR。留空 = 不限制 IP。",ipWhitelistCol:"IP 允許",ipAll:"全部 IP",keyOnce:"請妥善保存（明文只顯示一次）：",roleClient:"用戶 (client)",roleAdmin:"管理員 (admin)",roleClientBadge:"用戶",roleAdminBadge:"管理員",modeSafe:"safe（對外）",modeAgent:"agent（全能力）",modeSafeBadge:"安全",modeAgentBadge:"代理",ipCount:"{n} 個 IP",ipPlaceholder:`127.0.0.1
203.0.113.0/24`},docs:{title:"文件",total:"共",file:"檔名",mime:"類型",size:"大小",time:"時間",storage:"儲存位置",storageDb:"資料庫（加密）",storageFs:"檔案系統（加密）",storageHint:"加密儲存 · 小於 {dbMax} 入 DB，其餘於 {dir} · 上限 {upMax}。",download:"下載",downloadFail:"下載失敗",binaryPreview:"此為二進位檔（例如 PDF），無法在此預覽，請使用「下載」。",delete:"刪除",confirmDel:"確定刪除此文件？",detail:"文件詳情",preview:"預覽",copy:"複製內容",empty:"暫無",searchPh:"檔名或 MIME…",page:"頁",prev:"上一頁",next:"下一頁"},audit:{title:"稽核日誌",searchPh:"動作、資源、IP、金鑰…",time:"時間",action:"動作",resource:"資源",key:"金鑰",meta:"詳情",empty:"暫無日誌",id:"識別碼",actions:{chat_create:"建立對話",document_upload:"上傳文件",document_delete:"刪除文件",document_list:"列出文件",document_read:"讀取文件",document_download:"下載文件",api_key_create:"建立金鑰",api_key_update:"更新金鑰",api_key_delete:"撤銷金鑰",api_key_list:"列出金鑰",settings_update:"更新設定",chat_admin_view:"管理員查看對話",system_update:"系統更新",system_update_check:"檢查更新",ip_ban:"封鎖 IP",ip_unban:"解除 IP 封鎖",ddos_policy_update:"DDoS 策略更新",pm2_start:"PM2 啟動",pm2_stop:"PM2 停止",pm2_restart:"PM2 重啟",pm2_reload:"PM2 重載",pm2_config:"PM2 設定",pm2_switch:"PM2 切換 runner",playground_chat:"對話試玩",playground_upload:"試玩上傳"},resources:{document:"文件",chat:"對話",api_key:"API 金鑰",settings:"設定",system:"系統",pm2:"PM2",playground:"試玩",ip:"IP"},metaStorage:"儲存方式",metaAsKey:"代行金鑰 ID",metaAsKeyName:"代行金鑰名稱"},settings:{title:"安全設定",hint:"全域安全模式，套用至所有金鑰。",globalSafe:"全域安全模式",globalSafeHint:"開＝全部 safe。關＝跟各金鑰自身模式。",masterOn:"安全模式：開",masterOff:"安全模式：關",disabledBanner:"全域安全已關 — 各金鑰用自身 safe／agent 設定。",tools:"工具模式",toolsHint:"none：禁 shell／上網／寫入。readonly：只讀搜尋。",toolsNone:"none",toolsReadonly:"readonly",maxTurns:"最大 turns",maxTurnsHint:"safe 步數。問答 3–6 · API 8–12 · 多步驟 15–40。",timeout:"逾時（ms）",timeoutHint:"safe 時限。一般 60–120s · 長任務 300–600s。",defaultModel:"預設模型",defaultModelHint:"客戶端未指定 model 時使用。",modelSource:"Grok CLI",refreshModels:"重新整理模型",panel:"管理面板",save:"儲存",saved:"已儲存",guideTitle:"建議預設",guideIntro:"套用後可再微調。",guideApply:"套用",guideActive:"已應用",guideApplyConfirm:"套用「{name}」並儲存？會覆寫目前數值。",guideApplied:"已套用",chipGlobalOn:"安全：開",chipGlobalOff:"安全：關",scLocalTitle:"本機試用",scLocalDesc:"本機完整能力。",scLocalDetail:"安全關 · agent 金鑰。",scProdTitle:"對外 API",scProdDesc:"產品端點，最小權限。",scProdDetail:"安全開 · none · turns 8–12 · 60–120s。",scCodeTitle:"程式代理",scCodeDesc:"可信主機改檔／跑指令。",scCodeDetail:"安全關 · agent 金鑰。",scReadTitle:"只讀分析",scReadDesc:"解碼／搜尋，不寫入。",scReadDetail:"安全開 · readonly · turns 8–15 · 120–180s。",scChatTitle:"純問答",scChatDesc:"只回覆文字，不需使用工具。",scChatDetail:"安全開 · none · turns 3–6 · 60s。",scLongTitle:"長任務（safe）",scLongDesc:"多步驟，減少 max turns 失敗。",scLongDetail:"安全開 · none/readonly · turns 20–40 · 300–600s。",dangerTitle:"危險操作",disablePanel:"關閉管理面板",disablePanelConfirm:"關閉面板並登出？重開：ysk-omni admin on",disablePanelDone:"面板已關。重開：ysk-omni admin on",panelOffHint:"此處可關閉。重開請在伺服器執行 ysk-omni admin on。",panelStatus:"狀態",panelOn:"開",panelOff:"關"},apiFeatures:{title:"API 能力",intro:"開關協議與能力 · 約 2 秒生效 · 無需重啟。",tabProtocols:"協議",tabMedia:"媒體",tabCaps:"能力",tabEmu:"模擬",kpiEnabled:"已啟用",kpiEnabledSub:"目前開啟的開關",groupMeta:"已開 {on} / {n}",groupProtocols:"協議表面",groupMedia:"媒體 API（OpenAI 兼容）",groupCaps:"Grok CLI 能力",groupEmu:"模擬與安全",presetOpen:"預設：開放",presetLocked:"預設：鎖定",presetDev:"預設：開發",presetConfirm:"套用能力預設「{name}」？會覆寫全部 API 開關。",flag:{openaiChat:"OpenAI Chat Completions",openaiResponses:"OpenAI Responses",anthropicMessages:"Anthropic Messages",imagesApi:"Images API",filesOpenAiAlias:"Files API 別名",videoApi:"Videos API（異步 job）",audioApi:"Audio API（語音 / STT）",tools:"Tools / function calling",structuredOutput:"結構化輸出 (--json-schema)",vision:"視覺 / 圖片 (--prompt-json)",reasoningEffort:"推理力度",webSearch:"網絡搜尋工具",subagents:"子代理",planMode:"Plan 模式",memory:"跨 session 記憶",sessionResume:"恢復 session",bestOfN:"best-of-n（Grok 1.0+ 已移除）",checkLoop:"自我檢查迴圈（Grok 1.0+ 已移除）",systemOverride:"System prompt 覆寫",rules:"額外 rules",permissionMode:"權限模式",sandbox:"Sandbox profile",usageEstimate:"估算 token usage",assistantsEmulation:"Assistants-lite（本機）",strictSampling:"嚴格採樣（拒絕 temperature…）",forceDisableToolsInSafe:"Safe 模式強制工具限制"},hint:{openaiChat:"POST /v1/chat/completions",openaiResponses:"POST /v1/responses",anthropicMessages:"POST /v1/messages",imagesApi:"POST /v1/images/generations + /edits（要 agent key）",filesOpenAiAlias:"POST/GET /v1/files → documents + media",videoApi:"POST /v1/videos + poll GET /v1/videos/:id",audioApi:"POST /v1/audio/speech + /transcriptions（要 provider）",tools:"映射 tools → Grok --tools",structuredOutput:"response_format / json_schema",vision:"image_url content parts",reasoningEffort:"--reasoning-effort",webSearch:"關閉時加 --disable-web-search",subagents:"關閉時 --no-subagents",planMode:"關閉時 --no-plan",memory:"--experimental-memory",sessionResume:"--resume / --continue",bestOfN:"已棄用 — Grok Build 1.0+ 會拒絕此 flag",checkLoop:"已棄用 — Grok Build 1.0+ 會拒絕此 flag",systemOverride:"--system-prompt-override",rules:"--rules",permissionMode:"--permission-mode",sandbox:"--sandbox",usageEstimate:"usage 用字元/4 估算",assistantsEmulation:"本機 /v1/assistants + /v1/threads",strictSampling:"帶 temperature 等則 400",forceDisableToolsInSafe:"維持 safe 工具政策"}},catalog:{title:"目錄",intro:"從 Hugging Face 拉取精選包，再把本機 GGUF 載入 llama-server。",tabPacks:"精選包",tabLocal:"本機模型",tabHub:"Hugging Face",kpiLoaded:"已載入",kpiLoadedSub:"佔用 VRAM 的引擎",kpiLoadedNone:"尚未載入",kpiVram:"VRAM",kpiVramSub:"估計 {used} / {budget} MB",kpiLocal:"磁碟",kpiLocalSub:"本機 registry",kpiPacks:"精選",kpiPacksSub:"策展目錄",filterModality:"模態",filterAll:"全部",colName:"模型",colModality:"模態",colRuntime:"執行時",colQuant:"量化",colVram:"VRAM",colStatus:"狀態",colPath:"路徑",pull:"Pull",pulling:"拉取中…",pullAgain:"再拉一次",onDisk:"已下載",load:"Load",unload:"Unload",loaded:"已載入",idle:"待命",emptyPacks:"此篩選沒有精選包",emptyLocal:"registry 是空的 — 請先 Pull 一個包",emptyLocalHint:"打開「精選包」，選一個 GGUF，然後 Pull。",hubHint:"即時查官方 Hub REST（/api/models），用 Link cursor 翻頁。模型索引沒有 RSS／Atom。",hubSearch:"搜尋 Hub",hubSearchPh:"Qwen、llama、flux、whisper…",hubEmpty:"沒有 Hub 結果",hubMore:"載入更多",downloads:"下載數",unsupported:"無本機 runtime",hubFail:"Hub 搜尋失敗",noQuant:"—",pullFail:"拉取失敗",loadFail:"載入失敗",unloadFail:"卸載失敗",mod:{text:"文字",image:"圖像",video:"影片",tts:"語音",stt:"轉錄"}},media:{title:"媒體庫",intro:"工作室、資產與影片工作。需 imagesApi／tools（影片另需 videoApi）。",tabStudio:"工作室",tabAssets:"資產",tabJobs:"工作",kpiAssetsSub:"已儲存的媒體檔案",kpiJobsSub:"影片生成工作",kpiStudioSub:"生成、編輯或圖生影片",assets:"資產",jobs:"影片工作",empty:"尚無媒體資產",jobsEmpty:"尚無影片工作",kind:"類型",bytes:"大小",provider:"提供者",providerPh:"提供者名稱…",prompt:"提示詞",created:"建立時間",status:"狀態",preview:"預覽",previewUnsupported:"瀏覽器無法預覽此格式，請下載檔案後開啟。",previewFail:"無法載入預覽",previewTruncated:"預覽已截斷",download:"下載",delete:"刪除",deleteConfirm:"確定要軟刪除此媒體資產？",allKinds:"全部類型",searchPh:"提示詞、檔名、MIME、提供者或 ID…",from:"開始日期",to:"結束日期",generate:"生成圖片",generateTitle:"生成圖片",studioTitle:"媒體工作室",studioHint:"可生成圖片、編輯既有圖片，或建立圖生影片工作。執行限制依循安全設定。需啟用 imagesApi 與 tools（影片另需 videoApi）。",generateHint:"透過 Grok Imagine 工具（image_gen、image_edit、image_to_video）。",generatePrompt:"提示詞",generatePromptPh:"描述你想生成的圖像…",generateSize:"尺寸",aspectRatio:"長寬比",aspectHint:"採用 Grok Imagine 的 aspect_ratio（非 OpenAI 像素尺寸）",generateN:"數量",nHint:"Grok 不支援批量 n；閘道會依序執行 1–4 次",generateKey:"API 金鑰",generateKeySession:"目前登入的管理員工作階段",generateSubmit:"生成",generateBusy:"正在生成，可能需要一分鐘…",generateOk:"已生成圖像，請見下方資產列表。",generateFail:"圖像生成失敗",generateNeedPrompt:"請輸入提示詞",modeGenerate:"生成",modeEdit:"編輯",modeVideo:"影片",modelDefault:"系統預設",modelEmpty:"本機 Grok CLI 未回報模型",modelHint:"列出本機 Grok CLI 全部模型，並預選系統預設",editSubmit:"編輯圖像",editBusy:"正在編輯…",editOk:"已編輯圖像，請見下方資產列表。",editNeedImage:"請選擇或拖放來源圖像後再編輯",editImage:"來源圖像",editImageHint:"image_edit 必須提供來源圖像",editPromptPh:"描述要套用的變更…",videoSubmit:"建立影片工作",videoBusy:"正在將影片工作加入佇列…",videoOk:"影片工作已加入佇列，請見「影片工作」分頁。",videoVoice:"聲線",videoVoiceNone:"不加入對白",videoVoiceHint:"可選 preset voice — 會用 reference_to_video",videoDuration:"時長",videoDurationHint:"Grok image_to_video / reference_to_video：1–15 秒",videoSource:"來源幀（選填）",videoSourceHint:"選填。若未提供，會先依提示詞生成畫面，再進行動畫。",videoNoSource:"自動依提示詞生成畫面",videoPromptPh:"描述鏡頭運動與畫面內容…",sourceTitle:"來源圖像",sourceHint:"可拖放圖像、選擇本機檔案，或從文件庫／媒體資產中挑選任一圖像。",dropzoneAria:"來源圖像拖放區",dropTitle:"將圖像拖放至此",dropHint:"亦可選擇本機檔案，或從系統庫挑選",dropTitleVideo:"拖放來源幀（選填）",dropHintVideo:"影片可選填來源。未指定時，會先依提示詞生成畫面。",pickFile:"選擇檔案",pickLibrary:"系統庫",clearSource:"清除",sourceNeedImage:"請提供圖像檔（PNG、JPEG、WebP、GIF 等）",sourceKindUpload:"上傳",sourceKindAsset:"媒體資產",sourceKindDocument:"文件",libraryTitle:"選擇來源檔案",librarySubtitle:"可選取本閘道「文件」或「媒體資產」中的任一圖像。",libraryTabDocs:"文件",libraryTabAssets:"媒體資產",librarySearch:"依名稱、MIME 或 ID 搜尋…",libraryFormats:"僅圖像（PNG、JPEG、WebP、GIF 等）",libraryEmpty:"沒有符合的檔案",librarySelect:"使用所選",libraryLoadFail:"無法載入檔案庫"},usage:{title:"用量與防濫用",window:"統計區間",requests:"請求數",success:"成功",errors:"錯誤",errorRate:"錯誤率",byModel:"按模型",byKey:"按 API 金鑰",rateLimit:"上限 / 分",util:"估計使用率",lastUsed:"最近使用",limits:"Gateway 限流設定",global:"全域上限 / 視窗",ipMax:"未認證 IP 上限",burst:"對話短窗 burst（10s）",block:"認證失敗封鎖門檻",concurrent:"Grok 最大併發",refresh:"重新整理"},ddos:{title:"DDoS 控制中心",tabPolicy:"政策",tabLive:"流量",tabBlacklist:"黑名單",tabEvents:"事件",live:"即時連線",recent:"最近請求",blacklist:"IP 黑名單",stats:"濫用統計",refresh:"重新整理",pause:"暫停自動刷新",resume:"恢復自動刷新",ban:"封鎖 IP",unban:"解除封鎖",banConfirm:"確定封鎖此 IP？",banWhitelistWarn:"此 IP 在自動封鎖白名單內。仍要手動封鎖？",unbanConfirm:"確定從黑名單移除此 IP？",ip:"IP",method:"方法",path:"路徑",key:"API 金鑰",duration:"耗時",state:"狀態",ua:"瀏覽器識別 (UA)",reason:"原因",source:"來源",expires:"到期",permanent:"永久",addBan:"新增封鎖",ttl:"有效期",ttlPerm:"永久",ttl1h:"1 小時",ttl24h:"24 小時",ttl7d:"7 日",activeConn:"進行中",rateHits:"限流次數",blockedHits:"已封鎖攔截",autoBans:"自動封鎖",topIps:"熱門 IP（最近）",emptyLive:"目前無進行中連線",emptyBan:"黑名單為空",emptyEvents:"尚無自動封鎖事件",reasonPh:"可選原因",banReasonDefault:"管理員手動封鎖",ipPlaceholder:"1.2.3.4",policyTitle:"防護策略",policyHint:"所有門檻即時生效，無需重啟。環境變數僅作為初始預設值。",autoOn:"自動判斷：開",autoOff:"自動判斷：關",autoBanMaster:"啟用自動封鎖 IP",autoBanMasterHint:"關閉後仍會限流，但不會自動加入黑名單。",masterOn:"自動封鎖：開",masterOff:"自動封鎖：關",disabledBanner:"自動封鎖已關閉 — 仍會限流，但 IP 不會被自動加入黑名單。",presetTitle:"防護方案",presetHint:"點選預設方案，或自行改數值；系統會自動判斷是否為自訂。",presetRelaxed:"寬鬆",presetBalanced:"均衡",presetStrict:"嚴格",presetCustom:"自訂",presetActiveLabel:"目前：{name}",presetFormLabel:"表單：{name}（未儲存）",presetTagActive:"使用中",presetTagDraft:"草稿",presetTagSaved:"已儲存",presetActiveHint:"目前方案：{name}。若改動其他欄位請按「儲存策略」。",presetCustomHint:"目前數值不屬於寬鬆／均衡／嚴格，已判定為「自訂」。",presetUnsavedHint:"表單顯示「{form}」，伺服器仍為「{saved}」。請按「儲存策略」先套用。",savePolicy:"儲存策略",resetPolicy:"重設為環境預設",policySaved:"防護策略已儲存，限流器已重新載入。",policyReset:"已重設為環境變數預設值。",confirmReset:"確定將所有 DDoS 策略欄位重設為 .env 預設？",sectionProxy:"反向代理 / CDN",proxyHint:"流量經 nginx 或 Cloudflare 時，請設定信任層數，令封鎖、限流、稽核日誌使用真實用戶 IP，而非代理伺服器 IP。",proxyTrustHops:"信任代理層數",proxyTrustHopsHint:"0 = 直連（忽略 header）。1 = nginx 或 Cloudflare→應用。2 = Cloudflare→nginx→應用。",proxyIpSource:"客戶端 IP 來源",proxyIpSourceHint:"auto 會依序嘗試 CF-Connecting-IP、X-Real-IP、X-Forwarded-For。僅直連時先選「socket」。",proxySrcAuto:"自動（建議）",proxySrcCf:"Cloudflare（CF-Connecting-IP）",proxySrcNginx:"nginx（X-Real-IP）",proxySrcXff:"僅 X-Forwarded-For",proxySrcSocket:"僅 TCP socket（無代理）",trustedProxies:"可信代理 IP / CIDR",trustedProxiesHint:"只有這些 peer 才可設定 CF-Connecting-IP / X-Real-IP / XFF。預設 127.0.0.1（本機 nginx）。遠端代理請加入其 IP。直連客戶無法偽造 header。",sectionLimits:"限流",sectionAuth:"失敗認證",sectionRate:"限流濫用（429）",sectionConn:"連線洪水",sectionVelocity:"請求速率",sectionEscalate:"累犯升級",sectionWhitelist:"自動封鎖白名單",whitelistHint:"每行一個 IP 或 CIDR。白名單 IP 永不被自動封鎖。",rateWindow:"視窗（秒）",rateMaxKey:"金鑰上限",rateMaxIp:"未認證 IP 上限",burstWindow:"Burst 視窗（秒）",burstMax:"Burst 上限",enableRule:"啟用",threshold:"門檻",windowSec:"視窗（秒）",banMin:"封鎖時長（分）",escalateAfter:"累計自動封鎖 N 次後升級",escalateMin:"升級後封鎖（分）",maxConcurrent:"每 IP 最大並發",velocityMax:"最大請求數",eventsTitle:"最近自動封鎖事件",eventTime:"時間",eventSource:"規則",eventDuration:"封鎖時長",sources:{manual:"手動","auto-auth":"自動 · 認證","auto-rate":"自動 · 429","auto-conn":"自動 · 並發","auto-velocity":"自動 · 速率","auto-escalate":"自動 · 升級"}},pm2:{title:"PM2 控制",tabRunner:"運行方式",tabPort:"連接埠",tabConfig:"設定",tabLogs:"日誌",status:"進程狀態",start:"用 PM2 啟動",stop:"停止 PM2",restart:"重啟",reload:"重載",logs:"日誌",logsHint:"優先顯示錯誤日誌",clearLogs:"清除日誌",confirmClearLogs:"確定清除 PM2 與 ysk-omni 日誌檔？此操作無法復原（檔案會被清空）。",logsCleared:"已清除 {n} 個日誌檔。",logsAutoTrim:"超過 {maxMb} MB 會自動裁剪，只保留最後約 {keepKb} KB（每次讀取日誌時檢查）。",refresh:"重新整理",confirmStop:"確定停止 PM2 進程？",confirmRestart:"確定以 PM2 重啟？會妥善移交 port。",unavailable:"PM2 不可用",disabled:"已停用 PM2 管理",app:"應用名稱",pid:"進程 ID",uptime:"運行時間",memory:"記憶體",cpu:"CPU",restarts:"重啟次數",portBusy:"連接埠佔用中",port:"連接埠",portTitle:"監聽連接埠",portHint:"Gateway Admin 與 API 的 HTTP 連接埠。更改後會寫入 .env 並重啟進程，新連接埠才會生效。",fieldPort:"連接埠",portDefaultNote:"預設為 3850。有效範圍：1–65535。",savePort:"儲存連接埠並重啟",useDefaultPort:"使用預設（3850）",portInvalid:"請輸入有效連接埠（1–65535）。",confirmPortChange:"將監聽連接埠改為 {port} 並重啟 Gateway？之後請用新連接埠開啟 Admin（例如 http://localhost:{port}/admin）。",portChangedMsg:"連接埠已更新：{from} → {to}。",portSavedNeedRestart:"連接埠 {port} 已寫入 .env。請重啟後才會生效。",portAfterRestart:"重啟後請開啟 http://localhost:{port}/admin",hint:"可用 PM2 或 ysk-omni 運行，可在此或 CLI 切換。",switchTitle:"運行方式",switchHint:"同一時間只應有一個進程綁定連接埠。",currentRunner:"目前 runner",runnerPm2:"PM2",runnerGctoac:"ysk-omni（獨立進程）",runnerNone:"未運行",runnerUnknown:"未知／混合",switchToPm2:"切換到 PM2",switchToGctoac:"切換到 ysk-omni",confirmSwitchPm2:"確定切換到 PM2？gateway 會在數秒內以 PM2 重啟。",confirmSwitchGctoac:"確定切換到 ysk-omni？gateway 會在數秒內以獨立進程重啟。",switchScheduled:"已排程切換。管理面板將在約 10 秒後自動重新整理。",autoRefreshIn:"本頁將於 {n} 秒後自動重新載入…",autoRefreshNow:"正在重新載入…",omniPid:"ysk-omni 進程 ID",configTitle:"PM2 設定",configHint:"儲存至 pm2.runtime.json，經 ecosystem.config.cjs 套用。若目前用 PM2 運行，「儲存並套用」會重啟 PM2。",saveConfig:"儲存並套用",saveOnly:"只儲存",resetConfig:"還原預設",confirmReset:"確定將 PM2 設定還原為預設？",configSaved:"設定已儲存",fieldName:"應用名稱",fieldScript:"啟動腳本",fieldCwd:"工作目錄 (cwd)",fieldInstances:"實例數",fieldExecMode:"執行模式",fieldAutorestart:"自動重啟",fieldWatch:"檔案監視 (Watch)",fieldMaxMem:"記憶體上限重啟",fieldMaxRestarts:"最大重啟次數",fieldMinUptime:"最短運行時間",fieldRestartDelay:"重啟延遲 (ms)",fieldBackoff:"指數退避延遲 (ms)",fieldMergeLogs:"合併日誌",fieldTime:"日誌時間戳",fieldErrorFile:"錯誤日誌檔",fieldOutFile:"輸出日誌檔",fieldEnvExtra:"額外環境變數（每行 KEY=value）",fieldPreferred:"偏好 runner",empty:"pm2 列表中找不到此應用",modeFork:"fork",modeCluster:"cluster",phCwd:"（套件根目錄）",phInstances:"1 或 max",phEnv:"NODE_ENV=production",statusOnline:"運行中",statusErrored:"錯誤",statusStopped:"已停止",msgOk:"正常",msgDisabled:"PM2 管理已停用（PM2_ADMIN_ENABLED=false）。",msgBinaryMissing:"找不到 pm2，請執行：npm install -g pm2",msgNotInList:"應用「{app}」不在 PM2 列表中 — 請用「用 PM2 啟動」或「切換到 PM2」。",msgPortGctoac:"連接埠 {port} 正由 ysk-omni 佔用（pid {pid}）。請按「切換到 PM2」移交。",msgPortBusy:"連接埠 {port} 被佔用（pid {pids}）。",msgErrored:"PM2 進程出錯 — 請查日誌／設定，然後重啟或處理連接埠衝突。",msgBothRunners:"偵測到兩個 runner；ysk-omni pid {pid} 仍佔用資源。請用「切換」只保留一個。",msgError:"PM2 錯誤：{error}",msgSwitchPm2:"正在切換至 PM2… Gateway 將於數秒內以 PM2 重新啟動。",msgSwitchGctoac:"正在切換至 ysk-omni… Gateway 將於數秒內以獨立進程重新啟動。"},system:{title:"系統狀態",tabSoftware:"軟件",tabSessions:"Grok sessions",sessionsHint:"本機 Grok Build session（並非 gateway 對話紀錄）。",sessionsSearch:"搜尋標題、摘要或 id…",sessionDelete:"刪除",sessionDeleteConfirm:"永久刪除 Grok session {id}？無法復原。",sessionId:"Session",sessionTitle:"標題",sessionCwd:"cwd",sessionUpdated:"更新",tabPackage:"套件",tabEnv:"環境",envHint:"運行環境與版本快照。",checkUpdate:"檢查更新",oneClick:"更新套件並重啟",selfUpdate:"套件版本",selfHint:"對比版本 · 更新套件會重啟 gateway。",current:"本機版本",npm:"npm 最新版",github:"GitHub 最新版",install:"安裝渠道",confirmUpdate:"確定更新套件並重啟 gateway？期間 API 會短暫中斷。",scheduled:"已排程更新，請約 30 秒後重新整理頁面。",database:"資料庫",grokCli:"Grok CLI（已移除）",grokInspect:"Grok 殘留",grokInspectHint:"GCTOAC 殘留。不再 spawn Grok CLI；文字引擎是 llama-server / vLLM。",grokVersion:"Grok 版本",inspectChannel:"頻道",inspectDefaultModel:"預設模型",inspectModels:"模型數",inspectSkills:"Skills",inspectMcp:"MCP",inspectPlugins:"Plugins",inspectHooks:"Hooks",concurrency:"併發",runtime:"運行狀態",software:"系統軟件",softwareHint:"所需軟件與已安裝版本。",softName:"軟件",softLevel:"需求",softInstalled:"已安裝",softVersion:"版本",softStatus:"狀態",softDetail:"說明",levelRequired:"必須",levelRecommended:"建議",levelOptional:"可選",levelBundled:"內建",softOk:"正常",softMissing:"未安裝",softWarn:"注意",envTitle:"環境變數",up:"正常",down:"異常",yes:"是",no:"否",badgeUpdate:"有新版本",badgeOk:"已是最新",badgeAhead:"新於 npm",badgeUnknown:"無法比較",statusHintUpdate:"發佈庫有較新版本，可按「更新套件並重啟」。",statusHintOk:"本機版本與目前已知最新發佈版一致。",statusHintAhead:"本機版本比 npm 新（常見於 git／開發版）。若是 git 安裝，「更新套件」仍可拉取最新 commits。",statusHintUnknown:"無法連上 npm／GitHub，未能比較版本。",checkResult:"版本檢查結果",channelGit:"git（開發目錄）",channelNpmGlobal:"npm 全域",channelNpmLocal:"npm 本地",channelUnknown:"未知",encryption:"加密",ready:"就緒",notReady:"未就緒",allRequiredOk:"必須軟件齊全",requiredMissing:"有必須軟件缺失"},support:{title:"支持",subtitle:"作者、贊助與 YSK Limited — 免費產品，務實支援",pillSupport:"支持",pillSponsor:"支持／贊助 Linktree",pillHelp:"遇到問題？ email@ysk.hk",creatorTitle:"作者",creatorBody:"本 Grok → OpenAI Gateway 為免費開源產品，供希望自行運行 Grok CLI 作為 API 的使用者。項目以開源方式維護；你的意見與錯誤回報十分重要。",sponsorTitle:"支持／贊助",sponsorBody:"若本 Gateway 為你節省時間，歡迎贊助開發。每一份支持均有助產品繼續免費供所有人使用。",githubSponsors:"GitHub 贊助",linktree:"Linktree",walletsTitle:"加密貨幣／Web3 地址",walletsHint:"請只在對應網絡轉帳，轉帳前請再次核對地址。",net:"網絡",addr:"地址",copy:"複製",netEvm:"EVM (ETH/BSC/AVAX)",netNear:"NEAR",netAda:"ADA (Cardano)",yskTitle:"YSK Limited",yskBody:"需要超出免費面板的人手協助？YSK Limited 可以提供：",yskLi1:"伺服器安裝、加固與日常維運",yskLi2:"主機架構設計（網站、電郵、DNS、資料庫）",yskLi3:"遷移、自動化與客製整合",yskLi4:"事故處理與上線就緒檢查",yskPrice:"此處不標價 — 請來信，我們會按你的環境商討方案。",site:"ysk.hk",helpTitle:"遇到問題？",helpBody:"請來信說明作業系統、安裝紀錄路徑，以及預期與實際結果。每封來信均會閱讀。",docs:"完整文件見倉庫 README"},common:{empty:"暫無資料",active:"啟用",revoked:"已撤銷",save:"儲存",cancel:"關閉",loading:"載入中…",powered:"技術支援",actions:"操作",yes:"是",no:"否",ok:"確定",confirm:"確定",notice:"提示",confirmTitle:"請確認",dangerTitle:"確認操作",apply:"套用",reset:"重設",search:"搜尋",prev:"上一頁",next:"下一頁",perPage:"每頁",pagerTotal:"共 {n} 筆",pagerPage:"第 {n} / {total} 頁",filterTitle:"搜尋與篩選",filterHint:"設定條件後按「套用」",sortHint:"點擊欄位以 API 排序（預設：最新在前）",featureOff:"已關閉",all:"全部",requestFailed:"請求失敗",ms:"{n} 毫秒",perMin:"{n}/分",minutes:"{n} 分鐘",mb:"{n} MB",percent:"{n}%",ipLabel:"IP",uaLabel:"UA",httpStatus:"HTTP"},errors:{unauthorized:"憑證無效或缺失，請重新登入。",forbidden:"你沒有執行此操作的權限。",not_found:"找不到請求的資源。",validation_error:"請求無效，請檢查輸入內容。",rate_limit_exceeded:"已超過速率限制，請稍後再試。",concurrency_limit_exceeded:"Grok 並行工作過多，請稍候再試。",internal_error:"伺服器發生內部錯誤。",grok_error:"Grok CLI 回傳錯誤。",grok_timeout:"Grok CLI 執行逾時。",grok_not_available:"此伺服器無法使用 Grok CLI。",document_too_large:"文件大小超過允許上限。",document_type_not_allowed:"不允許此文件類型。",invalid_cwd:"不允許使用此工作目錄。",service_unavailable:"服務暫時無法使用。",queue_full:"對話佇列已滿，請稍後再試。",queue_draining:"對話佇列已暫停或正在排空。",queue_wait_timeout:"在對話佇列中等待逾時。",queue_cancelled:"對話工作已取消。",media_not_supported:"此媒體功能不可用或已停用。",media_provider_unavailable:"媒體提供者不可用。",media_generation_failed:"媒體生成失敗。",media_forbidden:"此 API 金鑰不允許生成媒體。請使用 agent 模式金鑰或管理員工作階段。",feature_disabled:"此 API 功能已停用。",feature:{imagesApi:"Images API 已停用。請至「管理 → API 能力 → Images API」啟用。",videoApi:"Video API 已停用。請至「管理 → API 能力 → Videos API」啟用。",audioApi:"Audio API 已停用。請至「管理 → API 能力 → Audio API」啟用。",tools:"Tools 已停用。請至「管理 → API 能力」啟用 Tools（圖像生成需要）。",filesOpenAiAlias:"OpenAI Files API 別名已停用。請至「管理 → API 能力 → Files API 別名」啟用。"},media:{agent_or_admin_required:"圖像生成需要 agent 模式 API 金鑰或管理員工作階段。安全模式金鑰無法使用圖像工具。",source_required:"請提供圖像檔、媒體資產或文件作為來源。",source_must_be_image:"編輯或生成影片時，來源必須為圖像。",no_image_in_sandbox:"Grok 已結束，但沙箱及今次 run 對應的 session images/ 均未找到圖像檔。這不是 imagesApi 或 API 金鑰問題。",no_video_in_sandbox:"Grok 已結束，但沙箱及今次 run 對應的 session 均未找到影片檔。",provider_no_edit:"目前媒體提供者不支援圖像編輯。"}}}};function hs(){const a=localStorage.getItem(Fa);return a==="en"||a==="zh-Hant"?a:(navigator.language||navigator.userLanguage||"en").toLowerCase().startsWith("zh")?"zh-Hant":"en"}let it=hs();function yt(){return it}function Na(a){a!=="en"&&a!=="zh-Hant"||(it=a,localStorage.setItem(Fa,a))}function e(a){const s=a.split(".");let o=Qt[it]||Qt.en;for(const i of s)if(o&&typeof o=="object"&&i in o)o=o[i];else{o=Qt.en;for(const n of s)if(o&&typeof o=="object"&&n in o)o=o[n];else return a;break}return typeof o=="string"?o:a}function Ie(a){return e(a)!==a}function A(a,s={}){let o=e(a);for(const[i,n]of Object.entries(s))o=o.replaceAll(`{${i}}`,String(n));return o}function ta(){return`
  <div class="lang-switch" role="group" aria-label="${it==="zh-Hant"?"語言":"Language"}">
    <button type="button" data-lang="en" class="${it==="en"?"is-active":""}">EN</button>
    <button type="button" data-lang="zh-Hant" class="${it==="zh-Hant"?"is-active":""}">中文</button>
  </div>`}const Ka=new Set([".txt",".md",".markdown",".csv",".json",".xml",".html",".htm",".js",".ts",".tsx",".jsx",".py",".java",".go",".rs",".c",".cpp",".h",".hpp",".css",".yml",".yaml",".toml",".ini",".env",".sh",".sql",".log",".pdf",".png",".jpg",".jpeg",".webp",".gif"]),vs=[...Ka].join(","),Kt="/admin/api",Ct="gog_admin_session";let We=null,ze=!1;function ua(a,s){const o=a?.error&&typeof a.error=="object"?a.error:a||{},i=typeof o.code=="string"?o.code:"",n=o.details&&typeof o.details=="object"?o.details:{},d=typeof n.feature=="string"?n.feature:typeof n.flag=="string"?n.flag:"",l=typeof n.reason=="string"?n.reason:"",u=String(o.message||a?.message||s||"");if(d&&(i==="feature_disabled"||i==="media_not_supported"||i==="forbidden")){const r=`errors.feature.${d}`;if(Ie(r))return e(r)}if(i==="feature_disabled"&&Ie("errors.feature_disabled")){const r=Wt(u);return r&&Ie(`errors.feature.${r}`)?e(`errors.feature.${r}`):e("errors.feature_disabled")}if(l&&Ie(`errors.media.${l}`))return e(`errors.media.${l}`);if(i==="media_generation_failed"&&l&&Ie(`errors.media.${l}`))return e(`errors.media.${l}`);if(i==="media_forbidden"&&Ie("errors.media_forbidden"))return e("errors.media_forbidden");const m=Wt(u);if(m&&Ie(`errors.feature.${m}`))return e(`errors.feature.${m}`);if(i){const r=`errors.${i}`;if(Ie(r))return e(r)}const p=Wt(u);return p&&Ie(`errors.feature.${p}`)?e(`errors.feature.${p}`):/agent-mode|agent mode|Safe keys cannot/i.test(u)?e("errors.media.agent_or_admin_required"):/no image file was found/i.test(u)?e("errors.media.no_image_in_sandbox"):/no video file was found/i.test(u)?e("errors.media.no_video_in_sandbox"):/does not support image edits/i.test(u)?e("errors.media.provider_no_edit"):/Provide an image file|sourceAssetId|sourceDocumentId/i.test(u)?e("errors.media.source_required"):/must be an image/i.test(u)?e("errors.media.source_must_be_image"):u||e("common.requestFailed")}function Wt(a){const s=String(a||"");return/videoApi/i.test(s)||/Video API is disabled/i.test(s)?"videoApi":/imagesApi/i.test(s)||/Images API is disabled/i.test(s)?"imagesApi":/audioApi/i.test(s)||/Audio API is disabled/i.test(s)?"audioApi":/filesOpenAiAlias/i.test(s)||/Files API alias/i.test(s)?"filesOpenAiAlias":/Tools are disabled/i.test(s)||/\btools\b/i.test(s)&&/disabled/i.test(s)&&/image/i.test(s)?"tools":""}const c={key:sessionStorage.getItem(Ct)||"",page:"dashboard",me:null,error:"",modal:null,chatFilter:{q:"",status:"",model:"",apiKeyId:"",from:"",to:"",policyMode:"",hasDocuments:"",sortBy:"createdAt",sortDir:"desc",limit:50,offset:0},docFilter:{q:"",apiKeyId:"",storageType:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",limit:20,offset:0},keyFilter:{q:"",role:"",mode:"",isActive:"",sortBy:"createdAt",sortDir:"desc",limit:20,offset:0},auditFilter:{q:"",action:"",apiKeyId:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",limit:50,offset:0},usageFilter:{tab:"model",modelQ:"",keyQ:"",keyActive:"",modelPage:0,keyPage:0,pageSize:10,sortBy:"lastUsedAt",sortDir:"desc",modelSortBy:"requests",modelSortDir:"desc"},ddosFilter:{tab:"policy",liveQ:"",banQ:"",banSource:"",livePage:0,banPage:0,pageSize:15,liveSortBy:"startedAt",liveSortDir:"desc",banSortBy:"createdAt",banSortDir:"desc",eventSortBy:"at",eventSortDir:"desc"},mediaFilter:{tab:"studio",q:"",kind:"",provider:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",jobSortBy:"createdAt",jobSortDir:"desc",limit:20,offset:0},systemTab:"software",grokSessionQ:"",pm2Tab:"runner",apiFeaturesTab:"protocols",catalogTab:"packs",catalogModality:"",catalogPulling:"",catalogHubQ:"",catalogHubHits:null,catalogHubNext:"",catalogHubBusy:!1,models:[],keys:[]},$s={login:"login",dashboard:"dashboard",chat:"chat",chats:"chats",keys:"keys",documents:"documents",media:"media",catalog:"catalog",audit:"audit",settings:"settings","api-features":"apiFeatures",apifeatures:"apiFeatures",usage:"usage",ddos:"ddos",queue:"queue",pm2:"pm2",system:"system",support:"support"};function ks(a){return a==="apiFeatures"?"api-features":a||"dashboard"}function ma(a){const s=String(a||"").replace(/^#\/?/,"").split("?")[0].split("/")[0].toLowerCase();return s&&$s[s]||null}function pa(a){const s=`#/${ks(a)}`;location.hash!==s&&history.pushState(null,"",s)}function Ss(){const a=ma(location.hash);return a||(c.key?"dashboard":"login")}async function I(a,s={}){const o={...s.body?{"Content-Type":"application/json"}:{},...c.key?{Authorization:`Bearer ${c.key}`}:{},...s.headers||{}},i=await fetch(`${Kt}${a}`,{...s,headers:o}),n=await i.text();let d=null;try{d=n?JSON.parse(n):null}catch{d={error:{message:n}}}if(!i.ok){const l=ua(d,i.statusText),u=d?.error?.code||"";i.status===401?c.page!=="login"&&Lt(!1):i.status===403&&!["media_forbidden","feature_disabled","forbidden","media_not_supported"].includes(u)&&c.page!=="login"&&Lt(!1);const m=new Error(l);throw m.status=i.status,m.code=u,m.details=d?.error?.details,m}return d}async function Ea(a){const s=await a.text();let o=null;try{o=s?JSON.parse(s):null}catch{o={error:{message:s}}}if(!a.ok){const i=ua(o,a.statusText),n=new Error(i);throw n.status=a.status,n.code=o?.error?.code,n.details=o?.error?.details,n}return o}function Lt(a=!0){const s=c.key;a&&s&&String(s).startsWith("gog_sess_")&&fetch("/admin/api/auth/logout",{method:"POST",headers:{Authorization:`Bearer ${s}`}}).catch(()=>{}),a&&sessionStorage.removeItem(Ct),c.key="",c.me=null,c.page="login",pa("login"),Gt()}function fa(a){ga(a,{writeHash:!0})}function ga(a,s={}){const o=a||"dashboard";c.page=o,c.modal=null,c.error="",o==="chats"&&(c.chatFilter.offset=0),o==="documents"&&(c.docFilter.offset=0),o==="keys"&&(c.keyFilter.offset=0),o==="audit"&&(c.auditFilter.offset=0),o==="media"&&(c.mediaFilter.offset=0),o!=="ddos"&&We&&(clearInterval(We),We=null),o!=="chat"&&document.body.classList.remove("chat-history-open"),s.writeHash!==!1&&pa(o),Gt()}function t(a){return String(a??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}let qe=null,Dt=null;function Ve(a){const s=Dt;Dt=null,qe&&(qe.remove(),qe=null),document.body.classList.remove("ui-dialog-open"),document.removeEventListener("keydown",ya,!0),s&&s(a)}function ya(a){if(qe&&a.key==="Escape"){a.preventDefault(),a.stopPropagation();const s=qe.dataset.cancelable!=="0";Ve(s?qe.dataset.prompt==="1"?null:!1:!0)}}function ja(a){qe&&Ve(!1);const s=a.variant||(a.showCancel===!1?"info":"confirm"),o=a.showCancel!==!1,i=!!a.input,n=a.title||e(s==="danger"?"common.dangerTitle":o?"common.confirmTitle":"common.notice"),d=a.confirmText||e(o?"common.confirm":"common.ok"),l=a.cancelText||e("common.cancel"),u=s==="danger"?"!":s==="info"&&!o?"i":"?",m=document.createElement("div");m.className="ui-dialog-back",m.id="ui-dialog-back",m.dataset.cancelable=o||i?"1":"0",m.dataset.prompt=i?"1":"0",m.setAttribute("role","presentation"),m.innerHTML=`
    <div class="ui-dialog ui-dialog--${t(s)}" role="alertdialog" aria-modal="true" aria-labelledby="ui-dialog-title" aria-describedby="ui-dialog-msg">
      <div class="ui-dialog-h">
        <div class="ui-dialog-icon" aria-hidden="true">${u}</div>
        <h3 class="ui-dialog-title" id="ui-dialog-title">${t(n)}</h3>
      </div>
      <div class="ui-dialog-body" id="ui-dialog-msg">${t(a.message||"")}</div>
      ${i?`<div class="ui-dialog-input-wrap">
              <input type="text" class="ui-dialog-input" id="ui-dialog-input" value="${t(a.defaultValue||"")}" placeholder="${t(a.placeholder||"")}" maxlength="${a.maxLength||500}" autocomplete="off" />
            </div>`:""}
      <div class="ui-dialog-actions">
        ${o||i?`<button type="button" class="btn secondary sm" id="ui-dialog-cancel">${t(l)}</button>`:""}
        <button type="button" class="btn ${s==="danger"?"danger":""} sm" id="ui-dialog-ok">${t(d)}</button>
      </div>
    </div>`,document.body.appendChild(m),document.body.classList.add("ui-dialog-open"),qe=m,document.addEventListener("keydown",ya,!0);const p=m.querySelector("#ui-dialog-ok"),r=m.querySelector("#ui-dialog-cancel"),k=m.querySelector("#ui-dialog-input"),b=f=>{if(i){if(!f){Ve(null);return}const h=k instanceof HTMLInputElement?k.value:"";Ve(h);return}Ve(!!f)};return p?.addEventListener("click",f=>{f.preventDefault(),b(!0)}),r?.addEventListener("click",f=>{f.preventDefault(),b(!1)}),m.addEventListener("click",f=>{f.target===m&&(o||i)&&b(!1)}),k instanceof HTMLInputElement&&k.addEventListener("keydown",f=>{f.key==="Enter"&&(f.preventDefault(),b(!0))}),requestAnimationFrame(()=>{k instanceof HTMLInputElement?(k.focus(),k.select()):p?.focus()}),new Promise(f=>{Dt=f})}async function fe(a){const s=typeof a=="string"?{message:a,showCancel:!1,variant:"info"}:{title:a.title,message:a.message,showCancel:!1,variant:a.variant||"info",confirmText:a.confirmText||e("common.ok")};await ja(s)}async function Z(a){const s=typeof a=="string"?{message:a,showCancel:!0,variant:"confirm"}:{title:a.title,message:a.message,showCancel:!0,variant:a.variant||"confirm",confirmText:a.confirmText,cancelText:a.cancelText};return!!await ja(s)}function ws(){const a=typeof window<"u"?window.marked:null;if(!a||a.__gogConfigured)return a;try{typeof a.setOptions=="function"?a.setOptions({gfm:!0,breaks:!0}):a.marked&&typeof a.marked.setOptions=="function"&&a.marked.setOptions({gfm:!0,breaks:!0})}catch{}return a.__gogConfigured=!0,a}function Ua(a){if(!a)return"";const s=ws(),o=typeof window<"u"?window.DOMPurify||window.dompurify:null;if(!s)return t(a);let i="";try{if(typeof s.parse=="function")i=s.parse(a,{gfm:!0,breaks:!0});else if(typeof s=="function")i=s(a,{gfm:!0,breaks:!0});else if(s.marked&&typeof s.marked.parse=="function")i=s.marked.parse(a,{gfm:!0,breaks:!0});else return t(a)}catch{return t(a)}if(typeof i!="string"&&(i=String(i??"")),o&&typeof o.sanitize=="function"){i=o.sanitize(i,{USE_PROFILES:{html:!0},ADD_ATTR:["target","rel"]});try{i=i.replace(/<a\s+([^>]*href=)/gi,'<a target="_blank" rel="noopener noreferrer" $1')}catch{}return i}return t(a)}async function jt(a){const s=String(a??"");if(!s)return!1;try{if(navigator.clipboard&&window.isSecureContext!==!1)return await navigator.clipboard.writeText(s),!0}catch{}try{const o=document.createElement("textarea");o.value=s,o.setAttribute("readonly",""),o.style.position="fixed",o.style.left="-9999px",document.body.appendChild(o),o.select();const i=document.execCommand("copy");return document.body.removeChild(o),i}catch{return!1}}function oe(a){if(!a)return"-";try{return new Date(a).toLocaleString(yt()==="zh-Hant"?"zh-HK":"en-US")}catch{return a}}function Te(a){return a==null?"—":a<1024?`${a} B`:a<1024*1024?`${(a/1024).toFixed(1)} KB`:A("common.mb",{n:(a/1024/1024).toFixed(1)})}function bt(a){return a==null||a===""?"—":A("common.ms",{n:a})}function Ga(a){return a==null||a===""?"—":A("common.perMin",{n:a})}function Q(a){c.error=a;const s=document.querySelector("#flash-error");s&&(s.hidden=!a,s.textContent=a)}function ba(a){const s=a==="success"?"success":a==="error"||a==="timeout"?"error":"pending",o=a==="success"?e("status.success"):a==="error"?e("status.error"):a==="timeout"?e("status.timeout"):a==="pending"?e("status.pending"):a||"-";return`<span class="badge ${s}">${t(o)}</span>`}function Ps(a){const o={queued:{cls:"pending",label:e("queue.stQueued")},leased:{cls:"info",label:e("queue.stLeased")},running:{cls:"success",label:e("queue.stRunning")},succeeded:{cls:"success",label:e("queue.stSucceeded")},failed:{cls:"error",label:e("queue.stFailed")},dead:{cls:"error",label:e("queue.stDead")},cancelled:{cls:"muted",label:e("queue.stCancelled")}}[a]||{cls:"pending",label:a||"—"};return`<span class="badge ${o.cls}">${t(o.label)}</span>`}function Es(a){const s=a==="playground"?e("queue.srcPlayground"):a==="v1"?e("queue.srcV1"):a||"—";return`<span class="badge muted">${t(s)}</span>`}function Ut(a){const s=a==="agent"?"agent":a==="safe"?"safe":a||"safe",o=s==="agent"?e("keys.modeAgentBadge"):s==="safe"?e("keys.modeSafeBadge"):s;return`<span class="badge ${s==="agent"?"agent":"safe"}">${t(o)}</span>`}function Is(a){const s=String(a||"").toLowerCase(),o=s==="admin"?e("keys.roleAdminBadge"):s==="client"||s==="user"?e("keys.roleClientBadge"):a||"-";return t(o)}function $t(a){return String(a||"").toLowerCase().startsWith("image/")}function ha(a,s=""){const o=String(a||"").toLowerCase().trim(),n=(String(s||"").toLowerCase().match(/\.([a-z0-9]+)$/)||[])[1]||"";return o.startsWith("image/")||["png","jpg","jpeg","gif","webp","svg","bmp","avif","ico"].includes(n)?"image":o.startsWith("video/")||["mp4","webm","ogg","ogv","mov","m4v"].includes(n)?"video":o.startsWith("audio/")||["mp3","wav","ogg","oga","m4a","aac","flac","opus"].includes(n)?"audio":o==="application/pdf"||n==="pdf"?"pdf":o.startsWith("text/")||o==="application/json"||o==="application/xml"||o==="application/javascript"||["txt","md","csv","json","xml","html","htm","css","js","log","svg"].includes(n)?n==="svg"?"image":"text":null}function Ms(a,s=""){return ha(a,s)!=null}let Tt=null;function Qa(){if(Tt){try{URL.revokeObjectURL(Tt)}catch{}Tt=null}}function xs(a,s,o){return a==="image"?`<img class="media-lb-media media-lb-img" src="${s}" alt="${t(o)}" />`:a==="video"?`<video class="media-lb-media media-lb-video" src="${s}" controls playsinline preload="metadata"></video>`:a==="audio"?`
      <div class="media-lb-audio-wrap">
        <div class="media-lb-audio-icon" aria-hidden="true">♪</div>
        <audio class="media-lb-media media-lb-audio" src="${s}" controls preload="metadata"></audio>
      </div>`:a==="pdf"?`<iframe class="media-lb-media media-lb-pdf" src="${s}#toolbar=1" title="${t(o)}"></iframe>`:a==="text"?`<div class="media-lb-text-loading muted">${t(e("common.loading")||"…")}</div>`:`<div class="data-empty"><strong>${t(e("media.previewUnsupported"))}</strong></div>`}function Ia(a,s){const o=a.mime||s.type||"",i=a.filename||a.id||"asset",n=ha(o,i)||"image",d=e("media.preview"),l=[i,o||"—",a.bytes!=null?Te(a.bytes):"",a.kind||""].filter(Boolean),u=t(l.join(" · ")),m=a.prompt?`<div class="media-lb-prompt"><span class="muted">${t(e("media.prompt"))}</span><p>${t(a.prompt)}</p></div>`:"";rt({title:d,subtitle:u,size:"xl",bodyHtml:`
      <div class="media-lightbox" data-preview-kind="${t(n)}">
        <div class="media-lb-stage">
          <div class="media-lb-text-loading muted">${t(e("common.loading")||"…")}</div>
        </div>
        ${m}
      </div>`,footerHtml:`
      <button type="button" class="btn secondary sm" id="media-lb-download">${t(e("media.download"))}</button>
      <button type="button" class="btn sm" id="media-lb-close">${t(e("common.cancel"))}</button>`});const p=document.querySelector("#modal-back .modal");p&&p.classList.add("modal--media-preview");const r=URL.createObjectURL(s);Tt=r;const k=document.querySelector("#modal-back .media-lb-stage");k&&(k.innerHTML=xs(n,r,i));const b=()=>{document.querySelectorAll("#modal-back video, #modal-back audio").forEach(f=>{try{f.pause()}catch{}}),Qa(),ye()};document.getElementById("modal-close")?.addEventListener("click",f=>{f.preventDefault(),b()}),document.getElementById("media-lb-close")?.addEventListener("click",f=>{f.preventDefault(),b()}),document.getElementById("modal-back")?.addEventListener("click",f=>{f.target?.id==="modal-back"&&b()}),document.getElementById("media-lb-download")?.addEventListener("click",()=>{const f=document.createElement("a");f.href=r,f.download=i,f.click()}),n==="text"&&s.text().then(f=>{const h=document.querySelector("#modal-back .media-lb-stage");if(!h)return;const $=4e5,B=f.length>$?f.slice(0,$)+`
… (${e("media.previewTruncated")})`:f;h.innerHTML=`<pre class="media-lb-text">${t(B)}</pre>`}).catch(()=>{const f=document.querySelector("#modal-back .media-lb-stage");f&&(f.innerHTML=`<div class="error-box">${t(e("media.previewFail"))}</div>`)})}function Wa(){return`
  <footer class="site-footer">
    <a class="powered-by" href="https://ysk.hk/" target="_blank" rel="noopener noreferrer">
      <img src="/admin/assets/logo.svg" alt="" width="22" height="22" />
      <span>${t(e("common.powered"))} <strong>YSK Limited</strong></span>
    </a>
  </footer>`}function qs(){return{dashboard:e("nav.dashboard"),chat:e("nav.chat"),chats:e("nav.chats"),keys:e("nav.keys"),documents:e("nav.documents"),audit:e("nav.audit"),settings:e("nav.settings"),apiFeatures:e("nav.apiFeatures"),media:e("nav.media"),catalog:e("nav.catalog"),usage:e("nav.usage"),ddos:e("nav.ddos"),queue:e("nav.queue"),pm2:e("nav.pm2"),system:e("nav.system"),support:e("nav.support")}[c.page]||e("brand")}function Pt(){document.body.classList.remove("nav-open")}function Ts(){document.body.classList.add("nav-open")}function le(a){return`
  <div class="app-shell">
    <header class="mobile-bar">
      <button type="button" class="icon-btn" id="nav-open" aria-label="${t(e("shell.menu"))}">☰</button>
      <div class="mobile-title">${t(qs())}</div>
      ${ta()}
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
        ${ta()}
        ${ce("dashboard",e("nav.dashboard"))}
        ${ce("chat",e("nav.chat"))}
        ${ce("chats",e("nav.chats"))}
        ${ce("keys",e("nav.keys"))}
        ${ce("documents",e("nav.documents"))}
        ${ce("media",e("nav.media"))}
        ${ce("catalog",e("nav.catalog"))}
        ${ce("audit",e("nav.audit"))}
        ${ce("settings",e("nav.settings"))}
        ${ce("apiFeatures",e("nav.apiFeatures"))}
        ${ce("usage",e("nav.usage"))}
        ${ce("ddos",e("nav.ddos"))}
        ${ce("queue",e("nav.queue"))}
        ${ce("pm2",e("nav.pm2"))}
        ${ce("system",e("nav.system"))}
        ${ce("support",e("nav.support"))}
        <div class="sidebar-foot">
          <button class="btn secondary sm logout-btn" id="btn-logout">${t(e("logout"))}</button>
        </div>
      </aside>
      <main class="main">
        <div id="flash-error" class="error-box" ${c.error?"":"hidden"}>${t(c.error)}</div>
        ${a}
      </main>
    </div>
    ${Wa()}
  </div>
  ${c.modal||""}
  `}function ce(a,s){return`<button type="button" class="nav-btn ${c.page===a?"active":""}" data-nav="${a}">${t(s)}</button>`}function de(){Pt(),document.querySelectorAll("[data-nav]").forEach(s=>{s.onclick=()=>{Pt(),fa(s.dataset.nav)}});const a=()=>Lt(!0);document.getElementById("btn-logout")?.addEventListener("click",a),document.getElementById("btn-logout-mobile")?.addEventListener("click",a),document.getElementById("nav-open")?.addEventListener("click",Ts),document.getElementById("nav-backdrop")?.addEventListener("click",Pt),document.addEventListener("keydown",s=>{s.key==="Escape"&&Pt()},{once:!0}),document.querySelectorAll("[data-lang]").forEach(s=>{s.onclick=()=>{Na(s.dataset.lang),Gt().catch(y)}}),va(document)}function As(a){if(!a)return"";const s=(a.getAttribute("data-label")||"").trim();if(s)return s;const o=a.querySelector(".th-sort-btn");return(o?[...o.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent||"").join(""):a.textContent||"").replace(/[▲▼]/g,"").replace(/\s+/g," ").trim()}function va(a){(a||document).querySelectorAll("table.data-table").forEach(o=>{const i=[...o.querySelectorAll("thead th")].map(As);o.querySelectorAll("tbody tr").forEach(n=>{n.classList.contains("empty-row")||[...n.children].forEach((d,l)=>{const u=[...d.children],m=d.classList.contains("row-actions")||!!d.querySelector(":scope > .row-actions")||u.length>0&&u.every(p=>p.matches("button, .btn, .row-actions"));if(d.classList.toggle("is-actions",m),d.classList.toggle("is-primary",l===0&&!m),m){d.removeAttribute("data-label");return}i[l]&&d.setAttribute("data-label",i[l])})})})}function y(a){console.error(a),Q(a.message||String(a))}async function za(){if(!c.key)return!1;const a=await I("/me");return c.me=a.data,!0}async function ht(a=!1){try{const s=await I(`/models${a?"?refresh=1":""}`);return c.models=s.data?.models||[],s.data}catch{return c.models=[],{models:[],source:"fallback",defaultModel:""}}}async function kt(){try{const a=await I("/keys?all=1");c.keys=a.data||[]}catch{c.keys=[]}}function ve(a){const s=(Array.isArray(a)?a:[a]).filter(Boolean);return s.length?`<div class="page-meta" role="status">${s.map(i=>`<span>${typeof i=="string"?t(i):i}</span>`).join('<span class="page-meta-sep" aria-hidden="true">·</span>')}</div>`:""}function Ae({title:a,hint:s,meta:o,searchHtml:i,gridHtml:n}){return`
    <div class="panel data-filter-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(a)}</strong>
          ${s?`<span class="muted">${t(s)}</span>`:""}
        </div>
        ${o?`<span class="panel-h-meta muted">${typeof o=="string"?t(o):o}</span>`:""}
      </div>
      <div class="data-filter">
        ${i||""}
        ${n?`<div class="data-filter-grid">${n}</div>`:""}
        <div class="data-filter-actions">
          <button type="button" class="btn secondary sm" data-filter-reset>${t(e("common.reset"))}</button>
          <button type="button" class="btn sm" data-filter-apply>${t(e("common.apply"))}</button>
        </div>
      </div>
    </div>`}function he({headHtml:a,bodyHtml:s,colSpan:o,emptyText:i,pagerHtml:n}){const d=s||`<tr class="empty-row"><td colspan="${o||6}">
      <div class="data-empty">
        <div class="data-empty-icon">∅</div>
        <strong>${t(i||e("common.empty"))}</strong>
      </div>
    </td></tr>`;return`
    <div class="panel data-table-panel">
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr>${a}</tr></thead>
          <tbody>${d}</tbody>
        </table>
      </div>
      ${n||""}
    </div>`}function we(a,s,o="sortBy",i="sortDir"){const n=s?.[o],d=s?.[i];return n&&a.set("sortBy",String(n)),(d==="asc"||d==="desc")&&a.set("sortDir",d),a}function F({field:a,label:s,filterRef:o,sortByKey:i="sortBy",sortDirKey:n="sortDir"}){const d=o?.[i]===a,l=d?o?.[n]||"desc":"",u=d&&l==="asc"?"ascending":d&&l==="desc"?"descending":"none",m=d?l==="asc"?" ▲":" ▼":"";return`<th class="th-sort${d?" is-sorted":""}" data-label="${t(s)}" data-sort-field="${t(a)}" data-sort-by-key="${t(i)}" data-sort-dir-key="${t(n)}" aria-sort="${u}" title="${t(e("common.sortHint")||"Sort")}"><button type="button" class="th-sort-btn">${t(s)}<span class="th-sort-ind" aria-hidden="true">${m}</span></button></th>`}function Ge(a,s){document.querySelectorAll("th.th-sort[data-sort-field]").forEach(o=>{(o.querySelector(".th-sort-btn")||o).addEventListener("click",n=>{n.preventDefault();const d=o.getAttribute("data-sort-field");if(!d||!a)return;const l=o.getAttribute("data-sort-by-key")||"sortBy",u=o.getAttribute("data-sort-dir-key")||"sortDir";a[l]===d?a[u]=a[u]==="asc"?"desc":"asc":(a[l]=d,a[u]="desc"),"offset"in a&&(a.offset=0),"modelPage"in a&&l==="modelSortBy"&&(a.modelPage=0),"keyPage"in a&&l==="sortBy"&&(a.keyPage=0),"livePage"in a&&l==="liveSortBy"&&(a.livePage=0),"banPage"in a&&l==="banSortBy"&&(a.banPage=0),s()})})}function Be({total:a,limit:s,offset:o,idPrefix:i}){const n=Math.max(1,Math.ceil((a||0)/s)||1),d=Math.floor(o/s)+1,l=o>0,u=o+s<a;return`
    <div class="data-pager" id="${i}-pager">
      <div class="data-pager-meta">
        <span>${t(A("common.pagerTotal",{n:a||0}))}</span>
        <span>${t(A("common.pagerPage",{n:d,total:n}))}</span>
        <label class="muted">${t(e("common.perPage"))}
          <select id="${i}-limit">
            ${[10,20,50,100].map(m=>`<option value="${m}" ${s===m?"selected":""}>${m}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="data-pager-actions">
        <button type="button" class="btn secondary sm" id="${i}-prev" ${l?"":"disabled"}>${t(e("common.prev"))}</button>
        <button type="button" class="btn secondary sm" id="${i}-next" ${u?"":"disabled"}>${t(e("common.next"))}</button>
      </div>
    </div>`}function dt(a,s,o){document.getElementById(`${a}-prev`)?.addEventListener("click",()=>{s.offset=Math.max(0,s.offset-s.limit),o()}),document.getElementById(`${a}-next`)?.addEventListener("click",()=>{s.offset=s.offset+s.limit,o()}),document.getElementById(`${a}-limit`)?.addEventListener("change",i=>{s.limit=Number(i.target.value)||20,s.offset=0,o()})}function ye(){document.querySelectorAll("#modal-back video, #modal-back audio").forEach(a=>{try{a.pause()}catch{}}),Qa(),document.getElementById("modal-back")?.remove(),c.modal=null}function rt({title:a,subtitle:s,bodyHtml:o,footerHtml:i,size:n="md"}){ye();const d=`
    <div class="modal-back" id="modal-back">
      <div class="modal modal--${t(n)}" role="dialog" aria-modal="true">
        <div class="modal-h">
          <div class="modal-title-block">
            <strong>${t(a||"")}</strong>
            ${s?`<div class="muted">${s}</div>`:""}
          </div>
          <button type="button" class="modal-x" id="modal-close" aria-label="${t(e("common.cancel"))}">×</button>
        </div>
        <div class="modal-b">${o||""}</div>
        ${i?`<div class="modal-f">${i}</div>`:""}
      </div>
    </div>`;document.getElementById("app").insertAdjacentHTML("beforeend",d);const l=()=>ye();document.getElementById("modal-close").onclick=l,document.getElementById("modal-back").onclick=m=>{m.target.id==="modal-back"&&l()};const u=m=>{m.key==="Escape"&&(l(),document.removeEventListener("keydown",u))};document.addEventListener("keydown",u)}async function Va(){const a="ysk-omni admin otp";document.getElementById("app").innerHTML=`
    <div class="login-wrap">
      <div class="login-stage">
        <div class="login-card">
          <div class="login-brand">
            <img src="/admin/assets/logo.svg" alt="YSK" width="48" height="48" />
            <h1 class="brand-title">${t(e("loginTitle"))}</h1>
          </div>
          ${ta()}
          <div id="flash-error" class="error-box" ${c.error?"":"hidden"}>${t(c.error)}</div>
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
      ${Wa()}
    </div>
  `,document.querySelectorAll("[data-lang]").forEach(s=>{s.onclick=()=>{Na(s.dataset.lang),Va().catch(y)}}),document.getElementById("btn-copy-cmd").onclick=async()=>{try{await navigator.clipboard.writeText(a);const s=document.getElementById("btn-copy-cmd");s.textContent=e("loginCopied"),setTimeout(()=>{s.textContent=e("loginCopy")},1500)}catch{}},document.getElementById("btn-login").onclick=async()=>{const s=document.getElementById("login-key").value.trim();if(!s)return Q(e("needOtp"));try{const o=await fetch("/admin/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:s})}),i=await o.json().catch(()=>({}));if(!o.ok)throw new Error(i?.error?.message||i?.message||e("loginOtpFail"));const n=i?.data?.token;if(!n)throw new Error(e("loginOtpFail"));c.key=n,sessionStorage.setItem(Ct,n),await za(),c.error="",fa("dashboard")}catch(o){c.key="",sessionStorage.removeItem(Ct),Q(o.message||e("loginOtpFail"))}},document.getElementById("login-key").onkeydown=s=>{s.key==="Enter"&&document.getElementById("btn-login").click()}}function ke({label:a,value:s,sub:o,tone:i,href:n,valueId:d,subId:l}){const u=i?` dash-kpi--${i}`:"",m=d?` id="${t(d)}"`:"",p=l?` id="${t(l)}"`:"",r=`
    <div class="label">${t(a)}</div>
    <div class="value"${m}>${s}</div>
    ${o!=null&&o!==""?`<div class="dash-kpi-sub muted"${p}>${o}</div>`:""}`;return n?`<button type="button" class="card dash-kpi${u}" data-nav="${t(n)}">${r}</button>`:`<div class="card dash-kpi${u}">${r}</div>`}function Ke(a,s,o){return a?`<span class="badge success">${t(s)}</span>`:`<span class="badge warn">${t(o)}</span>`}function $a({id:a,on:s,onLabel:o,offLabel:i,title:n}){return`<button type="button"
    class="master-toggle ${s?"is-on":"is-off"}"
    id="${t(a)}"
    aria-pressed="${s?"true":"false"}"
    title="${t(n||"")}">
    <span class="master-toggle-track" aria-hidden="true"><span class="master-toggle-knob"></span></span>
    <span class="master-toggle-label">${t(s?o:i)}</span>
  </button>`}function Xe(a){const s=document.getElementById(a);return s?s.classList.contains("is-on"):!1}function Ye(a,s,o,i){const n=document.getElementById(a);if(!n)return;n.classList.toggle("is-on",!!s),n.classList.toggle("is-off",!s),n.setAttribute("aria-pressed",s?"true":"false");const d=n.querySelector(".master-toggle-label");d&&o!=null&&i!=null&&(d.textContent=s?o:i)}function Ze(a,s){const o=document.getElementById(a);o&&(o.hidden=!s)}function et(a,s){const o=document.getElementById(a);o&&o.classList.toggle("is-feature-off",!!s)}function Bs(a){return{auto:e("ddos.proxySrcAuto"),cloudflare:e("ddos.proxySrcCf"),nginx:e("ddos.proxySrcNginx"),"x-forwarded-for":e("ddos.proxySrcXff"),socket:e("ddos.proxySrcSocket")}[a]||a||"—"}async function aa(){const s=(await I("/stats")).data||{},o=s.totals||{},i=s.protection||{},n=s.runtime||{},d=s.concurrency||{},l=s.queue||null,u=s.safety||null,m=s.models24h||[],p=o.successRate24h??0,r=o.successRate??0,k=s.generatedAt?oe(s.generatedAt):"—";let b="—",f=e("dash.kpiQueueSub"),h="";if(l){l.enabled?l.paused?(b=e("dash.kpiQueuePaused"),h="warn"):l.drainMode?(b=e("dash.kpiQueueDrain"),h="warn"):b=`${l.depth??0}`:(b=e("dash.kpiQueueOff"),h="warn");const q=l.oldestQueuedAgeMs>0?` · wait ${Math.round(l.oldestQueuedAgeMs/1e3)}s`:"";f=A("dash.kpiQueueSubLive",{run:l.running??0,max:l.globalConcurrency??"—",dead:l.dead??0,wait:q}),((l.dead||0)>0||(l.depth||0)>20)&&(h=h||"warn")}const $=!!u?.globalSafeMode,B=u?e($?"dash.kpiSafeOn":"dash.kpiSafeOff"):"—",L=t(u?A("dash.kpiSafeSub",{tools:u.safeToolsMode||"—",turns:u.safeMaxTurns??"—",model:u.defaultModel||"—"}):e("dash.kpiSafeSubEmpty")),R=(s.recentChats||[]).map(q=>`
    <tr>
      <td><button class="linkish cell-primary" data-chat="${q.id}">${t(q.requestId)}</button>
        <div class="cell-sub">${t(q.apiKey?.name||"")}</div></td>
      <td>${t(q.model)}</td>
      <td>${ba(q.status)}</td>
      <td>${Ut(q.policyMode||"-")}</td>
      <td>${bt(q.durationMs)}</td>
      <td>${oe(q.createdAt)}</td>
    </tr>`).join(""),x=he({headHtml:`
      <th>${t(e("chats.request"))}</th>
      <th>${t(e("chats.model"))}</th>
      <th>${t(e("chats.status"))}</th>
      <th>${t(e("chats.mode"))}</th>
      <th>${t(e("chats.duration"))}</th>
      <th>${t(e("chats.time"))}</th>`,bodyHtml:R,colSpan:6,emptyText:e("dash.empty")}),G=Math.max(1,...m.map(q=>q.requests||0)),M=m.length?m.map(q=>{const g=Math.round((q.requests||0)/G*100);return`
          <div class="dash-bar-row">
            <div class="dash-bar-label" title="${t(q.model)}">${t(q.model)}</div>
            <div class="dash-bar-track"><span style="width:${g}%"></span></div>
            <div class="dash-bar-n">${q.requests}</div>
          </div>`}).join(""):`<div class="data-empty" style="padding:20px"><strong>${t(e("dash.emptyModels"))}</strong></div>`,w=(q,g)=>`<span class="dash-rule-chip ${q?"is-on":"is-off"}">${t(g)}</span>`,N=l?`
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
        <span class="muted">${t(e("dash.updated"))}: ${t(k)}</span>
        <button type="button" class="btn secondary sm" id="dash-refresh">${t(e("dash.refresh"))}</button>
      </div>
    </div>

    <div class="dash-kpi-grid">
      ${ke({label:e("dash.kpi24h"),value:o.chats24h??0,sub:A("dash.kpi24hSub",{ok:o.success24h??0,err:o.error24h??0}),tone:"primary",href:"chats"})}
      ${ke({label:e("dash.kpiSuccessRate"),value:`${p}%`,sub:A("dash.kpiSuccessRateSub",{all:r}),tone:p>=90?"ok":p>=70?"warn":"danger",href:"usage"})}
      ${ke({label:e("dash.kpiErrors"),value:o.error24h??0,sub:A("dash.kpiErrorsSub",{all:o.errors??0}),tone:(o.error24h||0)>0?"warn":"ok",href:"chats"})}
      ${ke({label:e("dash.kpiQueue"),value:b,sub:f,tone:h,href:"queue"})}
      ${ke({label:e("dash.kpiSafe"),value:B,sub:L,tone:u?$?"ok":"warn":"",href:"settings"})}
      ${ke({label:e("dash.kpiKeys"),value:`${o.activeKeys??0}<span class="dash-kpi-den">/${o.totalKeys??0}</span>`,sub:e("dash.kpiKeysSub"),href:"keys"})}
      ${ke({label:e("dash.kpiDocs"),value:o.documents??0,sub:e("dash.kpiDocsSub"),href:"documents"})}
      ${ke({label:e("dash.kpiMedia")||"Media",value:o.mediaAssets??0,sub:A("dash.kpiMediaSub",{n:o.mediaAssets24h??0}),href:"media"})}
      ${ke({label:e("dash.kpiConv"),value:o.conversations??0,sub:A("dash.kpiConvSub",{n:o.conversations24h??0}),href:"chat"})}
      ${ke({label:e("dash.kpiSessions"),value:o.adminSessions??n.adminSessions??0,sub:e("dash.kpiSessionsSub")})}
      ${ke({label:e("dash.kpiConcurrent"),value:`${d.active??0}<span class="dash-kpi-den">/${d.max??0}</span>`,sub:e("dash.kpiConcurrentSub"),tone:(d.active||0)>=(d.max||1)?"warn":""})}
    </div>

    <div class="dash-layout">
      <div class="dash-main">
        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${t(e("dash.recent"))}</strong>
            <button type="button" class="btn secondary sm" data-nav="chats">${t(e("dash.viewAll"))}</button>
          </div>
          ${x.replace("data-table-panel","data-table-panel dash-embed-table")}
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
            ${N}
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
              ${Ke($,e("dash.on"),e("dash.off"))}
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
              ${Ke(!!i.autoBanEnabled,e("dash.on"),e("dash.off"))}
            </div>
            <div class="dash-rule-row">
              ${w(i.autoAuthEnabled,e("dash.ruleAuth"))}
              ${w(i.autoRateEnabled,e("dash.ruleRate"))}
              ${w(i.autoConnEnabled,e("dash.ruleConn"))}
              ${w(i.autoVelocityEnabled,e("dash.ruleVelocity"))}
            </div>
            <div class="dash-stat-grid">
              <div><div class="label">${t(e("dash.bans"))}</div><div class="value value-sm">${i.bans??0}</div></div>
              <div><div class="label">${t(e("dash.blocked"))}</div><div class="value value-sm">${i.blockedHits??0}</div></div>
              <div><div class="label">${t(e("dash.rateHits"))}</div><div class="value value-sm">${i.rateLimitedHits??0}</div></div>
              <div><div class="label">${t(e("dash.liveConn"))}</div><div class="value value-sm">${i.activeConnections??0}</div></div>
            </div>
            <div class="dash-prot-meta muted">
              ${t(e("dash.proxy"))}: ${t(Bs(i.proxyIpSource))}
              · ${t(e("dash.hops"))}: ${i.proxyTrustHops??0}
              · ${t(e("dash.limits"))}: ${i.rateLimitMax??"—"}/${i.rateLimitIpMax??"—"}
            </div>
          </div>
        </div>

        <div class="panel dash-panel">
          <div class="panel-h"><strong>${t(e("dash.models24h"))}</strong></div>
          <div class="panel-pad">${M}</div>
        </div>

        <div class="panel dash-panel">
          <div class="panel-h"><strong>${t(e("dash.runtime"))}</strong></div>
          <div class="panel-pad dash-runtime">
            <div class="dash-prot-row">
              <span>${t(e("dash.port"))}</span>
              <strong>${n.port??"—"}<span class="muted" style="font-weight:500"> (${t(e("dash.defaultPort"))} ${n.defaultPort??3850})</span></strong>
            </div>
            <div class="dash-prot-row">
              <span>${t(e("dash.env"))}</span>
              <strong>${t(n.env||"—")}</strong>
            </div>
            <div class="dash-prot-row">
              <span>${t(e("dash.authMode"))}</span>
              <strong>${t(e("dash.authOtp"))}</strong>
            </div>
            <div class="dash-prot-row">
              <span>${t(e("dash.encryption"))}</span>
              ${Ke(!!n.encryptionReady,e("dash.ready"),e("dash.notReady"))}
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
  `),de(),document.getElementById("dash-refresh")?.addEventListener("click",()=>aa().catch(y)),document.querySelectorAll("[data-nav]").forEach(q=>{q.onclick=()=>{const g=q.dataset.nav;g&&fa(g)}}),document.querySelectorAll("[data-chat]").forEach(q=>{q.onclick=()=>Xa(q.dataset.chat)})}function Cs(a){return a?.length?a.map(s=>`<span class="chip ${$t(s.mimeType)?"img":""}" title="${t(s.mimeType)}">${t(s.originalName||e("chats.file"))}</span>`).join(" "):'<span class="muted">—</span>'}function Ja(a){const s=String(a||"");if(!s.trim())return{system:"",body:"",hasRoles:!1};if(!/^(system|user|assistant|tool): /m.test(s))return{system:"",body:s,hasRoles:!1};const o=/(^|\n)(system|user|assistant|tool): /g,i=[];let n;for(;(n=o.exec(s))!==null;)i.push({role:n[2],contentStart:n.index+n[0].length,index:n.index});if(!i.length)return{system:"",body:s,hasRoles:!1};const d=i.map((m,p)=>{const r=p+1<i.length?i[p+1].index:s.length;return{role:m.role,content:s.slice(m.contentStart,r)}}),l=d.filter(m=>m.role==="system").map(m=>m.content),u=d.filter(m=>m.role!=="system").map(m=>`${m.role}: ${m.content}`);return{system:l.join(`

`).trim(),body:u.length?u.join(`
`):s,hasRoles:!0,blocks:d}}async function mt(){await Promise.all([ht(),kt()]);const a=c.chatFilter,s=new URLSearchParams;if(s.set("limit",String(a.limit)),s.set("offset",String(a.offset)),a.status&&s.set("status",a.status),a.model&&s.set("model",a.model),a.apiKeyId&&s.set("apiKeyId",a.apiKeyId),a.q&&s.set("q",a.q),a.from&&s.set("from",new Date(a.from).toISOString()),a.to){const r=new Date(a.to);r.setHours(23,59,59,999),s.set("to",r.toISOString())}a.policyMode&&s.set("policyMode",a.policyMode),a.hasDocuments!==""&&s.set("hasDocuments",a.hasDocuments),we(s,a);const o=await I(`/chats?${s}`),i=o.total||0,n=[`<option value="">${t(e("chats.allModels"))}</option>`,...c.models.map(r=>`<option value="${t(r)}" ${a.model===r?"selected":""}>${t(r)}</option>`)].join(""),d=[`<option value="">${t(e("chats.allKeys"))}</option>`,...c.keys.map(r=>`<option value="${r.id}" ${a.apiKeyId===r.id?"selected":""}>${t(r.name)} (${t(r.keyPrefix)})</option>`)].join(""),l=(o.items||[]).map(r=>{const k=Ja(r.promptPreview||""),b=!!k.system,f=b?k.body.slice(0,160):r.promptPreview||"";return`
    <tr>
      <td><button class="linkish cell-primary" data-chat="${r.id}">${t(r.requestId)}</button></td>
      <td><div class="cell-primary">${t(r.apiKey?.name||"")}</div><div class="cell-sub">${t(r.apiKey?.keyPrefix||"")}</div></td>
      <td>${t(r.model)}</td>
      <td>${ba(r.status)} ${Ut(r.policyMode||"-")}</td>
      <td>${Cs(r.documents)} ${r.documentCount?`<span class="muted">×${r.documentCount}</span>`:""}</td>
      <td class="chats-preview-cell">
        ${b?`<span class="chip sys-chip" title="${t(k.system.slice(0,400))}">${t(e("chats.hasSystem"))}</span>`:""}
        <div class="muted preview-text">${t(f)}</div>
      </td>
      <td class="chats-preview-cell"><div class="muted preview-text">${t(r.contentPreview)}</div></td>
      <td>${oe(r.createdAt)}</td>
      <td class="muted">${r.durationMs!=null?bt(r.durationMs):"—"}</td>
    </tr>`}).join(""),u=Ae({title:e("chats.filterTitle")||e("common.filterTitle"),hint:e("chats.filterHint")||e("common.filterHint"),meta:A("common.pagerTotal",{n:i}),searchHtml:`
      <div class="data-filter-search">
        <label for="f-q">${t(e("chats.search"))}</label>
        <input type="search" id="f-q" value="${t(a.q)}" placeholder="${t(e("chats.searchPh"))}" />
      </div>`,gridHtml:`
      <label>${t(e("chats.status"))}
        <select id="f-status">
          <option value="">${t(e("chats.allStatus"))}</option>
          ${["success","error","timeout","pending"].map(r=>`<option value="${r}" ${a.status===r?"selected":""}>${t(e(`status.${r}`))}</option>`).join("")}
        </select>
      </label>
      <label>${t(e("chats.model"))}
        <select id="f-model">${n}</select>
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
      </label>`}),m=he({headHtml:`
      <th>${t(e("chats.request"))}</th>
      <th>${t(e("chats.apiKey"))}</th>
      ${F({field:"model",label:e("chats.model"),filterRef:a})}
      ${F({field:"status",label:e("chats.status"),filterRef:a})}
      <th>${t(e("chats.attachments"))}</th>
      <th>${t(e("chats.prompt"))}</th>
      <th>${t(e("chats.response"))}</th>
      ${F({field:"createdAt",label:e("chats.time"),filterRef:a})}
      ${F({field:"durationMs",label:e("ddos.duration"),filterRef:a})}`,bodyHtml:l,colSpan:9,emptyText:e("common.empty"),pagerHtml:Be({total:i,limit:a.limit,offset:a.offset,idPrefix:"chats"})});document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("chats.title"))}</h2>
    </div>
    ${ve([e("chats.decrypt")])}
    ${u}
    ${m}
  `),de(),dt("chats",c.chatFilter,()=>mt().catch(y)),Ge(c.chatFilter,()=>mt().catch(y));const p=()=>{c.chatFilter.q=document.getElementById("f-q").value.trim(),c.chatFilter.status=document.getElementById("f-status").value,c.chatFilter.model=document.getElementById("f-model").value,c.chatFilter.apiKeyId=document.getElementById("f-key").value,c.chatFilter.policyMode=document.getElementById("f-mode").value,c.chatFilter.from=document.getElementById("f-from").value,c.chatFilter.to=document.getElementById("f-to").value,c.chatFilter.hasDocuments=document.getElementById("f-docs").checked?"true":"",c.chatFilter.offset=0,mt().catch(y)};document.querySelector("[data-filter-apply]").onclick=p,document.getElementById("f-q").onkeydown=r=>{r.key==="Enter"&&p()},document.querySelector("[data-filter-reset]").onclick=()=>{c.chatFilter={q:"",status:"",model:"",apiKeyId:"",from:"",to:"",policyMode:"",hasDocuments:"",sortBy:"createdAt",sortDir:"desc",limit:50,offset:0},mt().catch(y)},document.querySelectorAll("[data-chat]").forEach(r=>{r.onclick=()=>Xa(r.dataset.chat)})}async function Xa(a){const{data:s}=await I(`/chats/${a}`),o=s.response||{},i=s.documents||[];let n=`<p class="muted">${t(e("chats.noAttach"))}</p>`;if(i.length){const m=[];for(const p of i){let r="";if($t(p.mimeType))try{const k=await I(`/documents/${p.id}`),b=await es(k.data||{id:p.id,isImage:!0,mimeType:p.mimeType});b?.src&&(r=`<img class="preview" src="${b.src}" alt="${t(p.originalName)}" />`)}catch{r=`<span class="muted">${t(e("chats.previewFailed"))}</span>`}m.push(`
        <div class="attach-item">
          <div style="flex:1;min-width:0">
            <strong>${t(p.originalName)}</strong>
            <div class="muted">${t(p.mimeType)} · ${Te(p.sizeBytes)}</div>
            ${r}
          </div>
          <button class="btn secondary sm" data-open-doc="${p.id}">${t(e("chats.openFile"))}</button>
        </div>`)}n=`<div class="attach-list">${m.join("")}</div>`}const d=Ja(s.prompt||""),l=d.system?`<div class="block block-system">
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
      <div class="card"><div class="label">${t(e("chats.duration"))}</div><div class="value value-sm">${bt(s.durationMs)}</div></div>
      <div class="card"><div class="label">${t(e("chats.apiKey"))}</div><div class="value value-sm">${t(s.apiKey?.name||"")}</div></div>
      <div class="card"><div class="label">${t(e("chats.stream"))}</div><div class="value value-sm">${s.stream?e("common.yes"):e("common.no")}</div></div>
    </div>
    ${s.errorMessage?`<div class="error-box">${t(s.errorMessage)}</div>`:""}
    ${l}
    <div class="block">
      <h4>${t(e("chats.attachments"))}</h4>
      ${n}
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
    <div class="modal-meta-foot muted">${t(e("common.ipLabel"))}: ${t(s.ip||"—")} · ${t(e("common.uaLabel"))}: ${t(s.userAgent||"—")} · ${oe(s.createdAt)}</div>`;rt({title:e("chats.detail"),subtitle:`${t(s.requestId)} · ${ba(s.status)} ${Ut(s.policyMode||"-")}`,bodyHtml:u,size:"xl",footerHtml:`<button type="button" class="btn secondary sm" id="modal-ok">${t(e("chats.close"))}</button>`}),document.getElementById("modal-ok")?.addEventListener("click",()=>ye()),document.querySelector('[data-copy="system"]')?.addEventListener("click",()=>{navigator.clipboard.writeText(d.system||"")}),document.querySelector('[data-copy="prompt"]')?.addEventListener("click",()=>{navigator.clipboard.writeText(d.body||s.prompt||"")}),document.querySelector('[data-copy="raw-prompt"]')?.addEventListener("click",()=>{navigator.clipboard.writeText(s.prompt||"")}),document.querySelector('[data-copy="content"]')?.addEventListener("click",()=>{navigator.clipboard.writeText(o.content||"")}),document.querySelectorAll("[data-open-doc]").forEach(m=>{m.onclick=()=>ts(m.dataset.openDoc)})}async function Fe(){const a=c.keyFilter;let s={};try{const p=await I("/usage");for(const r of p.data?.perKey||[])s[r.apiKeyId]=r}catch{}const o=new URLSearchParams;o.set("limit",String(a.limit)),o.set("offset",String(a.offset)),a.q&&o.set("q",a.q),a.role&&o.set("role",a.role),a.mode&&o.set("mode",a.mode),a.isActive!==""&&o.set("isActive",a.isActive),we(o,a);const i=await I(`/keys?${o}`),n=i.data||[],d=i.total??n.length,l=n.map(p=>{const r=s[p.id],k=r?.requests??"—",b=r?Math.round((r.utilization||0)*100):0,f=p.ipWhitelist||[],h=f.length?A("keys.ipCount",{n:f.length}):e("keys.ipAll");return`
    <tr>
      <td><div class="cell-primary">${t(p.name)}</div><div class="cell-sub">${t(p.keyPrefix)}…</div></td>
      <td>${Is(p.role)}</td>
      <td>${Ut(p.mode)}</td>
      <td>${Ga(p.rateLimit)}</td>
      <td title="${t(f.join(", "))}">${t(h)}</td>
      <td>
        <div>${k} <span class="muted">(${t(e("keys.usage24"))})</span></div>
        <div class="usage-bar ${b>80?"warn":""}"><span style="width:${b}%"></span></div>
      </td>
      <td>${p.isActive?`<span class="badge success">${t(e("common.active"))}</span>`:`<span class="badge error">${t(e("common.revoked"))}</span>`}</td>
      <td>${oe(p.createdAt)}</td>
      <td><div class="row-actions">
        <button class="btn secondary sm" data-edit="${p.id}">${t(e("keys.edit"))}</button>
        ${p.isActive?`<button class="btn danger sm" data-revoke="${p.id}">${t(e("keys.revoke"))}</button>`:""}
      </div></td>
    </tr>`}).join(""),u=Ae({title:e("common.filterTitle"),hint:e("common.filterHint"),meta:A("common.pagerTotal",{n:d}),searchHtml:`
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
      </label>`}),m=he({headHtml:`
      ${F({field:"name",label:e("keys.name"),filterRef:a})}
      ${F({field:"role",label:e("keys.role"),filterRef:a})}
      ${F({field:"mode",label:e("keys.mode"),filterRef:a})}
      ${F({field:"rateLimit",label:e("keys.rate"),filterRef:a})}
      <th>${t(e("keys.ipWhitelistCol"))}</th>
      <th>${t(e("keys.usage24"))}</th>
      ${F({field:"isActive",label:e("keys.status"),filterRef:a})}
      ${F({field:"createdAt",label:e("keys.created"),filterRef:a})}
      <th>${t(e("common.actions"))}</th>`,bodyHtml:l,colSpan:9,emptyText:e("keys.empty"),pagerHtml:Be({total:d,limit:a.limit,offset:a.offset,idPrefix:"keys"})});document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("keys.title"))}</h2>
      <div class="toolbar">
        <button class="btn" id="btn-new-key">${t(e("keys.new"))}</button>
      </div>
    </div>
    ${u}
    ${m}
  `),de(),dt("keys",c.keyFilter,()=>Fe().catch(y)),Ge(c.keyFilter,()=>Fe().catch(y)),document.querySelector("[data-filter-apply]").onclick=()=>{c.keyFilter.q=document.getElementById("kf-q").value.trim(),c.keyFilter.role=document.getElementById("kf-role").value,c.keyFilter.mode=document.getElementById("kf-mode").value,c.keyFilter.isActive=document.getElementById("kf-active").value,c.keyFilter.offset=0,Fe().catch(y)},document.querySelector("[data-filter-reset]").onclick=()=>{c.keyFilter={q:"",role:"",mode:"",isActive:"",sortBy:"createdAt",sortDir:"desc",limit:20,offset:0},Fe().catch(y)},document.getElementById("btn-new-key").onclick=()=>Ma(),document.querySelectorAll("[data-edit]").forEach(p=>{const r=n.find(k=>k.id===p.dataset.edit);p.onclick=()=>Ma(r)}),document.querySelectorAll("[data-revoke]").forEach(p=>{p.onclick=async()=>{await Z({message:e("keys.confirmRevoke"),variant:"danger",confirmText:e("keys.revoke")})&&(await I(`/keys/${p.dataset.revoke}`,{method:"DELETE"}),Fe().catch(y))}})}function Ma(a){const s=!!a,o=(a?.ipWhitelist||[]).join(`
`);rt({title:e(s?"keys.edit":"keys.new"),subtitle:s?`${t(a?.name||"")} · ${t(a?.keyPrefix||"")}…`:"",size:"md",bodyHtml:`
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
      <button type="button" class="btn sm" id="k-save">${t(e("common.save"))}</button>`}),document.getElementById("k-role").value=a?.role||"client",document.getElementById("k-mode").value=a?.mode||"safe",s&&(document.getElementById("k-active").value=String(a.isActive)),document.getElementById("k-cancel").onclick=()=>ye(),document.getElementById("k-save").onclick=async()=>{const i=document.getElementById("k-ip").value.split(/[\n,]+/).map(d=>d.trim()).filter(Boolean),n={name:document.getElementById("k-name").value.trim(),role:document.getElementById("k-role").value,mode:document.getElementById("k-mode").value,rateLimit:Number(document.getElementById("k-rate").value||60),maxTurns:document.getElementById("k-turns").value?Number(document.getElementById("k-turns").value):null,timeoutMs:document.getElementById("k-timeout").value?Number(document.getElementById("k-timeout").value):null,ipWhitelist:i};try{if(s)n.isActive=document.getElementById("k-active").value==="true",await I(`/keys/${a.id}`,{method:"PATCH",body:JSON.stringify(n)}),ye(),Fe().catch(y);else{const d=await I("/keys",{method:"POST",body:JSON.stringify(n)}),l=document.getElementById("k-created");l&&(l.hidden=!1,l.textContent=`${e("keys.keyOnce")}
${d.data?.key||JSON.stringify(d.data)}`);const u=document.getElementById("k-save");u&&(u.textContent=e("chats.close"),u.onclick=()=>{ye(),Fe().catch(y)})}}catch(d){y(d)}}}function Ya(a){return e(a==="filesystem"?"docs.storageFs":"docs.storageDb")}async function Za(a,s){try{const o=await fetch(`${Kt}/documents/${a}/download`,{headers:c.key?{Authorization:`Bearer ${c.key}`}:{}});if(!o.ok){const l=await o.text();let u=l;try{u=JSON.parse(l).error?.message||l}catch{}throw new Error(u||e("docs.downloadFail"))}const i=await o.blob(),n=URL.createObjectURL(i),d=document.createElement("a");d.href=n,d.download=s||"download",document.body.appendChild(d),d.click(),d.remove(),URL.revokeObjectURL(n)}catch(o){Q(o.message||e("docs.downloadFail"))}}async function st(){await kt();const a=c.docFilter,s=new URLSearchParams({limit:String(a.limit),offset:String(a.offset)});if(a.q&&s.set("q",a.q),a.apiKeyId&&s.set("apiKeyId",a.apiKeyId),a.storageType&&s.set("storageType",a.storageType),a.from&&s.set("from",new Date(a.from).toISOString()),a.to){const r=new Date(a.to);r.setHours(23,59,59,999),s.set("to",r.toISOString())}we(s,a);const o=await I(`/documents?${s}`),i=o.total??0,n=o.meta||{},d=A("docs.storageHint",{dir:n.storageDir||"—",dbMax:Te(n.documentDbMaxBytes),upMax:Te(n.uploadMaxBytes)}),l=[`<option value="">${t(e("common.all"))}</option>`,...c.keys.map(r=>`<option value="${r.id}" ${a.apiKeyId===r.id?"selected":""}>${t(r.name)}</option>`)].join(""),u=(o.data||[]).map(r=>`
    <tr>
      <td><button class="linkish cell-primary" data-doc="${r.id}">${t(r.originalName)}</button>
        ${$t(r.mimeType)?`<span class="chip img">${t(e("chats.img"))}</span>`:""}</td>
      <td>${t(r.apiKey?.name||"")}</td>
      <td>${t(r.mimeType)}</td>
      <td>${Te(r.sizeBytes)}</td>
      <td>
        <span title="${t(r.storagePath||"")}">${t(Ya(r.storageType))}</span>
        ${r.storagePath?`<div class="cell-sub">${t(r.storagePath)}</div>`:""}
      </td>
      <td>${oe(r.createdAt)}</td>
      <td><div class="row-actions">
        <button class="btn secondary sm" data-dl="${r.id}" data-name="${t(r.originalName)}">${t(e("docs.download"))}</button>
        <button class="btn danger sm" data-del="${r.id}">${t(e("docs.delete"))}</button>
      </div></td>
    </tr>`).join(""),m=Ae({title:e("common.filterTitle"),hint:e("common.filterHint"),meta:A("common.pagerTotal",{n:i}),searchHtml:`
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
      <label>${t(e("chats.to"))}<input type="date" id="df-to" value="${t(a.to)}" /></label>`}),p=he({headHtml:`
      ${F({field:"originalName",label:e("docs.file"),filterRef:a})}
      <th>${t(e("chats.apiKey"))}</th>
      ${F({field:"mimeType",label:e("docs.mime"),filterRef:a})}
      ${F({field:"sizeBytes",label:e("docs.size"),filterRef:a})}
      ${F({field:"storageType",label:e("docs.storage"),filterRef:a})}
      ${F({field:"createdAt",label:e("docs.time"),filterRef:a})}
      <th>${t(e("common.actions"))}</th>`,bodyHtml:u,colSpan:7,emptyText:e("docs.empty"),pagerHtml:Be({total:i,limit:a.limit,offset:a.offset,idPrefix:"docs"})});document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("docs.title"))}</h2>
    </div>
    ${ve([d])}
    ${m}
    ${p}
  `),de(),dt("docs",c.docFilter,()=>st().catch(y)),Ge(c.docFilter,()=>st().catch(y)),document.querySelector("[data-filter-apply]").onclick=()=>{c.docFilter.q=document.getElementById("df-q").value.trim(),c.docFilter.apiKeyId=document.getElementById("df-key").value,c.docFilter.storageType=document.getElementById("df-storage").value,c.docFilter.from=document.getElementById("df-from").value,c.docFilter.to=document.getElementById("df-to").value,c.docFilter.offset=0,st().catch(y)},document.querySelector("[data-filter-reset]").onclick=()=>{c.docFilter={q:"",apiKeyId:"",storageType:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",limit:20,offset:0},st().catch(y)},document.querySelectorAll("[data-doc]").forEach(r=>{r.onclick=()=>ts(r.dataset.doc)}),document.querySelectorAll("[data-dl]").forEach(r=>{r.onclick=()=>Za(r.getAttribute("data-dl"),r.getAttribute("data-name")||"file")}),document.querySelectorAll("[data-del]").forEach(r=>{r.onclick=async()=>{await Z({message:e("docs.confirmDel"),variant:"danger",confirmText:e("docs.delete")})&&(await I(`/documents/${r.dataset.del}`,{method:"DELETE"}),st().catch(y))}})}async function Ls(a){const s=await fetch(`${Kt}/documents/${a}/download`,{headers:c.key?{Authorization:`Bearer ${c.key}`}:{}});if(!s.ok){const i=await s.text();let n=i;try{n=JSON.parse(i)?.error?.message||i}catch{}throw new Error(n||e("docs.downloadFail"))}const o=await s.blob();return URL.createObjectURL(o)}async function es(a){if(a?.imageDataUrl)return{src:a.imageDataUrl,revoke:null};if(a?.isImage||$t(a?.mimeType)){const s=await Ls(a.id);return{src:s,revoke:s}}return null}async function ts(a){const{data:s}=await I(`/documents/${a}`);let o,i=null;try{const l=await es(s);l?(i=l.revoke,o=`<img class="preview doc-preview-img" src="${l.src}" alt="${t(s.originalName||"")}" />`):s.isBinary||s.content==null?o=`<div class="data-empty"><div class="data-empty-icon">⧉</div><strong>${t(e("docs.binaryPreview"))}</strong></div>`:o=`<div class="pre" id="doc-content">${t(s.content||e("chats.none"))}</div>`}catch{o=`<div class="data-empty"><div class="data-empty-icon">⧉</div><strong>${t(e("chats.previewFailed")||e("docs.binaryPreview"))}</strong></div>`}const n=`${Ya(s.storageType)}${s.storagePath?` · ${s.storagePath}`:""}`;rt({title:e("docs.detail"),subtitle:`${t(s.originalName)} · ${t(s.mimeType)} · ${Te(s.sizeBytes)}<br/><span class="muted">${t(e("docs.storage"))}: ${t(n)}</span>`,size:"lg",bodyHtml:`
      <div class="block">
        <h4>${t(e("docs.preview"))}</h4>
        ${o}
      </div>`,footerHtml:`
      ${!s.imageDataUrl&&!(s.isImage||$t(s.mimeType))&&s.content&&!s.isBinary?`<button type="button" class="btn secondary sm" id="doc-copy">${t(e("docs.copy"))}</button>`:""}
      <button type="button" class="btn sm" id="doc-download">${t(e("docs.download"))}</button>
      <button type="button" class="btn secondary sm" id="doc-close">${t(e("chats.close"))}</button>`});const d=()=>{if(i)try{URL.revokeObjectURL(i)}catch{}ye()};document.getElementById("doc-close")?.addEventListener("click",d),document.getElementById("doc-download").onclick=()=>Za(s.id,s.originalName),document.getElementById("doc-copy")?.addEventListener("click",async()=>{if(await jt(s.content||"")){const u=document.getElementById("doc-copy");u&&(u.textContent=e("chat.copied"))}})}function xa(a){if(!a)return"-";const s=`audit.actions.${String(a).replace(/\./g,"_")}`,o=e(s);return o===s?a:o}function Ds(a){if(!a)return"";const s=`audit.resources.${String(a).replace(/\./g,"_")}`,o=e(s);return o===s?a:o}function Hs(a){if(!a)return"";try{const s=typeof a=="string"?JSON.parse(a):a;return!s||typeof s!="object"?String(a):Object.entries(s).map(([o,i])=>{const n={originalName:e("docs.file"),mimeType:e("docs.mime"),sizeBytes:e("docs.size"),storageType:e("audit.metaStorage"),asKeyId:e("audit.metaAsKey"),asKeyName:e("audit.metaAsKeyName"),model:e("chats.model"),stream:e("chats.stream")}[o]||o,d=typeof i=="object"?JSON.stringify(i):String(i??"");return`${n}: ${d}`}).join(" · ")}catch{return String(a)}}async function pt(){await kt();const a=c.auditFilter,s=new URLSearchParams;if(s.set("limit",String(a.limit)),s.set("offset",String(a.offset)),a.q&&s.set("q",a.q),a.action&&s.set("action",a.action),a.apiKeyId&&s.set("apiKeyId",a.apiKeyId),a.from&&s.set("from",new Date(a.from).toISOString()),a.to){const r=new Date(a.to);r.setHours(23,59,59,999),s.set("to",r.toISOString())}we(s,a);const o=await I(`/audit-logs?${s}`),i=o.total??0,n=["","chat.create","document.upload","document.delete","document.download","api_key.create","api_key.update","api_key.delete","settings.update","playground.chat","ip.ban","ip.unban","ddos.policy_update","pm2.switch","system.update"],d=[`<option value="">${t(e("common.all"))}</option>`,...c.keys.map(r=>`<option value="${r.id}" ${a.apiKeyId===r.id?"selected":""}>${t(r.name)}</option>`)].join(""),l=n.map(r=>r?`<option value="${t(r)}" ${a.action===r?"selected":""}>${t(xa(r))}</option>`:`<option value="">${t(e("common.all"))}</option>`).join(""),u=(o.data||[]).map(r=>`
    <tr>
      <td>${oe(r.createdAt)}</td>
      <td title="${t(r.action||"")}"><span class="cell-primary">${t(xa(r.action))}</span></td>
      <td>
        <div>${t(Ds(r.resource))}</div>
        ${r.resourceId?`<div class="cell-sub audit-id" title="${t(r.resourceId)}">${t(r.resourceId)}</div>`:""}
      </td>
      <td>${t(r.apiKey?.name||"-")}</td>
      <td class="muted audit-meta">${t(Hs(r.metaJson))}</td>
    </tr>`).join(""),m=Ae({title:e("common.filterTitle"),hint:e("common.filterHint"),meta:A("common.pagerTotal",{n:i}),searchHtml:`
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
      <label>${t(e("chats.to"))}<input type="date" id="af-to" value="${t(a.to)}" /></label>`}),p=he({headHtml:`
      ${F({field:"createdAt",label:e("audit.time"),filterRef:a})}
      ${F({field:"action",label:e("audit.action"),filterRef:a})}
      ${F({field:"resource",label:e("audit.resource"),filterRef:a})}
      <th>${t(e("audit.key"))}</th>
      <th>${t(e("audit.meta"))}</th>`,bodyHtml:u,colSpan:5,emptyText:e("audit.empty"),pagerHtml:Be({total:i,limit:a.limit,offset:a.offset,idPrefix:"audit"})});document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("audit.title"))}</h2>
    </div>
    ${m}
    ${p}
  `),de(),dt("audit",c.auditFilter,()=>pt().catch(y)),Ge(c.auditFilter,()=>pt().catch(y)),document.querySelector("[data-filter-apply]").onclick=()=>{c.auditFilter.q=document.getElementById("af-q").value.trim(),c.auditFilter.action=document.getElementById("af-action").value,c.auditFilter.apiKeyId=document.getElementById("af-key").value,c.auditFilter.from=document.getElementById("af-from").value,c.auditFilter.to=document.getElementById("af-to").value,c.auditFilter.offset=0,pt().catch(y)},document.querySelector("[data-filter-reset]").onclick=()=>{c.auditFilter={q:"",action:"",apiKeyId:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",limit:50,offset:0},pt().catch(y)}}function sa(){return[{id:"local",titleKey:"settings.scLocalTitle",descKey:"settings.scLocalDesc",detailKey:"settings.scLocalDetail",values:{globalSafeMode:!1,safeToolsMode:"none",safeMaxTurns:16,safeTimeoutMs:18e4}},{id:"prod",titleKey:"settings.scProdTitle",descKey:"settings.scProdDesc",detailKey:"settings.scProdDetail",values:{globalSafeMode:!0,safeToolsMode:"none",safeMaxTurns:10,safeTimeoutMs:12e4}},{id:"code",titleKey:"settings.scCodeTitle",descKey:"settings.scCodeDesc",detailKey:"settings.scCodeDetail",values:{globalSafeMode:!1,safeToolsMode:"none",safeMaxTurns:20,safeTimeoutMs:3e5}},{id:"read",titleKey:"settings.scReadTitle",descKey:"settings.scReadDesc",detailKey:"settings.scReadDetail",values:{globalSafeMode:!0,safeToolsMode:"readonly",safeMaxTurns:12,safeTimeoutMs:15e4}},{id:"chat",titleKey:"settings.scChatTitle",descKey:"settings.scChatDesc",detailKey:"settings.scChatDetail",values:{globalSafeMode:!0,safeToolsMode:"none",safeMaxTurns:5,safeTimeoutMs:6e4}},{id:"long",titleKey:"settings.scLongTitle",descKey:"settings.scLongDesc",detailKey:"settings.scLongDetail",values:{globalSafeMode:!0,safeToolsMode:"none",safeMaxTurns:40,safeTimeoutMs:6e5}}]}function Os(){return{globalSafeMode:document.getElementById("s-master-global")?Xe("s-master-global"):!1,safeToolsMode:document.getElementById("s-tools")?.value||"none",safeMaxTurns:Number(document.getElementById("s-turns")?.value),safeTimeoutMs:Number(document.getElementById("s-timeout")?.value)}}function _s(a){const s=Os();return!Number.isFinite(s.safeMaxTurns)||!Number.isFinite(s.safeTimeoutMs)?!1:s.globalSafeMode===!!a.globalSafeMode&&s.safeToolsMode===a.safeToolsMode&&s.safeMaxTurns===Number(a.safeMaxTurns)&&s.safeTimeoutMs===Number(a.safeTimeoutMs)}function nt(){for(const a of sa()){const s=document.querySelector(`[data-preset="${a.id}"]`),o=document.querySelector(`[data-apply-preset="${a.id}"]`);if(!s||!o)continue;const i=_s(a.values);s.classList.toggle("is-applied",i),o.textContent=e(i?"settings.guideActive":"settings.guideApply"),o.disabled=i,o.classList.toggle("is-applied",i),o.setAttribute("aria-pressed",i?"true":"false")}}function Rs(a){const s=document.getElementById("s-tools"),o=document.getElementById("s-turns"),i=document.getElementById("s-timeout"),n=!!a.globalSafeMode;Ye("s-master-global",n,e("settings.masterOn"),e("settings.masterOff")),et("settings-root",!n),Ze("settings-disabled-banner",!n),s&&a.safeToolsMode&&(s.value=a.safeToolsMode),o&&a.safeMaxTurns!=null&&(o.value=String(a.safeMaxTurns)),i&&a.safeTimeoutMs!=null&&(i.value=String(a.safeTimeoutMs)),nt()}async function Fs(a){if(a?.values&&await Z({title:e(a.titleKey),message:A("settings.guideApplyConfirm",{name:e(a.titleKey)}),variant:"confirm",confirmText:e("settings.guideApply")})){Rs(a.values);try{await I("/settings",{method:"PUT",body:JSON.stringify({globalSafeMode:!!a.values.globalSafeMode,safeToolsMode:a.values.safeToolsMode,safeMaxTurns:Number(a.values.safeMaxTurns),safeTimeoutMs:Number(a.values.safeTimeoutMs),defaultModel:document.getElementById("s-model")?.value?.trim()||""})}),nt();const s=document.querySelector("#flash-error");s&&(s.hidden=!1,s.classList.add("flash-ok"),s.textContent=e("settings.guideApplied"),setTimeout(()=>{s.textContent===e("settings.guideApplied")&&(s.hidden=!0,s.classList.remove("flash-ok"),s.textContent="")},2500))}catch(s){y(s)}}}async function as(){const[{data:a},s]=await Promise.all([I("/settings"),ht()]),o=(s.models||c.models||[]).map(l=>`<option value="${t(l)}" ${a.defaultModel===l?"selected":""}>${t(l)}</option>`).join(""),i=sa().map(l=>`
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
      </article>`).join(""),n=!!a.globalSafeMode;document.getElementById("app").innerHTML=le(`
    <div id="settings-root" class="${n?"":"is-feature-off"}">
    <div class="topbar">
      <h2>${t(e("settings.title"))}</h2>
      <div class="toolbar">
        ${$a({id:"s-master-global",on:n,onLabel:e("settings.masterOn"),offLabel:e("settings.masterOff"),title:e("settings.globalSafeHint")})}
        <button class="btn secondary sm" id="btn-refresh-models">${t(e("settings.refreshModels"))}</button>
      </div>
    </div>
    <div class="feature-off-banner" id="settings-disabled-banner" ${n?"hidden":""} role="status">
      <strong>${t(e("common.featureOff"))}</strong>
      <span>${t(e("settings.disabledBanner"))}</span>
    </div>
    ${ve([e("settings.globalSafeHint")])}
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
        <div class="settings-guide-grid">${i}</div>
      </div>
    </div>
    <div class="danger-zone">
      <h3>${t(e("settings.dangerTitle"))}</h3>
      <p class="muted">${t(e("settings.panelOffHint"))} · ${t(e("settings.panelStatus"))}: <strong>${a.adminPanelEnabled?e("settings.panelOn"):e("settings.panelOff")}</strong></p>
      <button class="btn danger sm" id="s-disable-panel" ${a.adminPanelEnabled?"":"disabled"}>${t(e("settings.disablePanel"))}</button>
    </div>
    </div>
  `),de(),document.getElementById("s-tools").value=a.safeToolsMode||"none";const d=()=>nt();["s-tools","s-turns","s-timeout"].forEach(l=>{const u=document.getElementById(l);u&&(u.addEventListener("change",d),u.addEventListener("input",d))}),nt(),document.getElementById("s-master-global")?.addEventListener("click",async()=>{const l=!Xe("s-master-global");Ye("s-master-global",l,e("settings.masterOn"),e("settings.masterOff")),et("settings-root",!l),Ze("settings-disabled-banner",!l),nt();try{await I("/settings",{method:"PUT",body:JSON.stringify({globalSafeMode:l,safeToolsMode:document.getElementById("s-tools").value,safeMaxTurns:Number(document.getElementById("s-turns").value),safeTimeoutMs:Number(document.getElementById("s-timeout").value),defaultModel:document.getElementById("s-model").value.trim()})})}catch(u){Ye("s-master-global",!l,e("settings.masterOn"),e("settings.masterOff")),et("settings-root",l),Ze("settings-disabled-banner",l),y(u)}}),document.getElementById("btn-refresh-models").onclick=async()=>{await ht(!0),as().catch(y)},document.getElementById("s-save").onclick=async()=>{try{await I("/settings",{method:"PUT",body:JSON.stringify({globalSafeMode:Xe("s-master-global"),safeToolsMode:document.getElementById("s-tools").value,safeMaxTurns:Number(document.getElementById("s-turns").value),safeTimeoutMs:Number(document.getElementById("s-timeout").value),defaultModel:document.getElementById("s-model").value.trim()})}),nt();const l=document.querySelector("#flash-error");l&&(l.hidden=!1,l.classList.add("flash-ok"),l.textContent=e("settings.saved"),setTimeout(()=>{l.hidden=!0,l.classList.remove("flash-ok"),l.textContent=""},2e3))}catch(l){y(l)}},document.querySelectorAll("[data-apply-preset]").forEach(l=>{l.addEventListener("click",async()=>{if(l.disabled)return;const u=l.getAttribute("data-apply-preset"),m=sa().find(p=>p.id===u);m&&await Fs(m)})}),document.getElementById("s-disable-panel").onclick=async()=>{if(await Z({message:e("settings.disablePanelConfirm"),variant:"danger",confirmText:e("settings.disablePanel")}))try{await I("/settings",{method:"PUT",body:JSON.stringify({adminPanelEnabled:!1})}),await fe({message:e("settings.disablePanelDone"),title:e("common.notice")}),Lt(!1)}catch(l){y(l)}}}async function At(){const a=await I("/api-features");if(c.page!=="apiFeatures")return;const s=a.data||{},o=[{id:"protocols",title:e("apiFeatures.groupProtocols"),tabLabel:e("apiFeatures.tabProtocols"),keys:["openaiChat","openaiResponses","anthropicMessages"]},{id:"media",title:e("apiFeatures.groupMedia"),tabLabel:e("apiFeatures.tabMedia"),keys:["imagesApi","filesOpenAiAlias","videoApi","audioApi"]},{id:"caps",title:e("apiFeatures.groupCaps"),tabLabel:e("apiFeatures.tabCaps"),keys:["tools","structuredOutput","vision","reasoningEffort","webSearch","subagents","planMode","memory","sessionResume","bestOfN","checkLoop","systemOverride","rules","permissionMode","sandbox"]},{id:"emu",title:e("apiFeatures.groupEmu"),tabLabel:e("apiFeatures.tabEmu"),keys:["usageEstimate","assistantsEmulation","strictSampling","forceDisableToolsInSafe"]}],i=c.apiFeaturesTab==="media"||c.apiFeaturesTab==="caps"||c.apiFeaturesTab==="emu"||c.apiFeaturesTab==="protocols"?c.apiFeaturesTab:"protocols";c.apiFeaturesTab=i;const n=f=>e(`apiFeatures.flag.${f}`)||f,d=f=>e(`apiFeatures.hint.${f}`)||"",l=f=>f.filter(h=>!!s[h]).length,u=f=>f.map(h=>{const $=!!s[h];return`
          <div class="dash-prot-row api-feat-row" data-feat="${t(h)}">
            <div>
              <strong>${t(n(h))}</strong>
              <div class="muted api-feat-hint">${t(d(h))}</div>
            </div>
            <button type="button" class="master-toggle ${$?"is-on":"is-off"}" data-feat-toggle="${t(h)}" aria-pressed="${$?"true":"false"}">
              <span class="master-toggle-track" aria-hidden="true"><span class="master-toggle-knob"></span></span>
              <span class="master-toggle-label">${t(e($?"dash.on":"dash.off"))}</span>
            </button>
          </div>`}).join(""),m=o.reduce((f,h)=>f+h.keys.length,0),p=o.reduce((f,h)=>f+l(h.keys),0),r=`
    <div class="grid api-feat-kpi-grid">
      <div class="card">
        <div class="label">${t(e("apiFeatures.kpiEnabled"))}</div>
        <div class="value value-sm">${p}<span class="dash-kpi-den">/${m}</span></div>
        <div class="muted card-sub">${t(e("apiFeatures.kpiEnabledSub"))}</div>
      </div>
      ${o.map(f=>{const h=l(f.keys);return`
        <div class="card">
          <div class="label">${t(f.tabLabel)}</div>
          <div class="value value-sm">${h}<span class="dash-kpi-den">/${f.keys.length}</span></div>
          <div class="muted card-sub">${t(f.title)}</div>
        </div>`}).join("")}
    </div>`,k=o.map(f=>{const h=l(f.keys);return`
        <button type="button" role="tab" class="seg-tab ${i===f.id?"is-active":""}" data-feat-tab="${t(f.id)}" aria-selected="${i===f.id}">
          ${t(f.tabLabel)}
          <span class="seg-tab-count">${h}/${f.keys.length}</span>
        </button>`}).join(""),b=o.map(f=>`
        <div class="usage-tab-pane api-feat-tab-pane" id="api-feat-tab-${t(f.id)}" ${i===f.id?"":"hidden"}>
          <div class="panel data-table-panel api-feat-panel">
            <div class="panel-h">
              <div class="panel-h-text">
                <strong>${t(f.title)}</strong>
                <span class="muted panel-h-sub">${t(A("apiFeatures.groupMeta",{on:l(f.keys),n:f.keys.length}))}</span>
              </div>
            </div>
            <div class="panel-pad api-feat-list">${u(f.keys)}</div>
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
    ${ve([e("apiFeatures.intro")])}
    ${r}

    <div class="usage-tabs-panel panel api-feat-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("apiFeatures.title"))}">
        ${k}
      </div>
      <div class="usage-tab-body">
        ${b}
      </div>
    </div>
  `),de(),document.querySelectorAll("[data-feat-tab]").forEach(f=>{f.addEventListener("click",()=>{const h=f.getAttribute("data-feat-tab")||"protocols",$=h==="media"||h==="caps"||h==="emu"||h==="protocols"?h:"protocols";c.apiFeaturesTab!==$&&(c.apiFeaturesTab=$,At().catch(y))})}),document.querySelectorAll("[data-feat-toggle]").forEach(f=>{f.addEventListener("click",async()=>{const h=f.getAttribute("data-feat-toggle");if(!h)return;const $=!f.classList.contains("is-on");try{await I("/api-features",{method:"PUT",body:JSON.stringify({[h]:$})}),await At()}catch(B){y(B)}})}),document.querySelectorAll("[data-feat-preset]").forEach(f=>{f.addEventListener("click",async()=>{const h=f.getAttribute("data-feat-preset");if(await Z({message:A("apiFeatures.presetConfirm",{name:h}),confirmText:e("common.confirm")}))try{await I("/api-features/preset",{method:"POST",body:JSON.stringify({name:h})}),await At()}catch($){y($)}})})}async function Me(){c.mediaFilter||(c.mediaFilter={tab:"studio",q:"",kind:"",provider:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",jobSortBy:"createdAt",jobSortDir:"desc",limit:20,offset:0}),c.mediaFilter.sortBy||(c.mediaFilter.sortBy="createdAt"),c.mediaFilter.sortDir||(c.mediaFilter.sortDir="desc"),c.mediaFilter.jobSortBy||(c.mediaFilter.jobSortBy="createdAt"),c.mediaFilter.jobSortDir||(c.mediaFilter.jobSortDir="desc"),c.mediaFilter.tab||(c.mediaFilter.tab="studio");const a=c.mediaFilter,s=a.tab==="assets"||a.tab==="jobs"||a.tab==="studio"?a.tab:"studio";a.tab=s;const o=new URLSearchParams({limit:String(a.limit),offset:String(a.offset)});if(a.q&&o.set("q",a.q),a.kind&&o.set("kind",a.kind),a.provider&&o.set("provider",a.provider),a.from&&o.set("from",new Date(a.from).toISOString()),a.to){const g=new Date(a.to);g.setHours(23,59,59,999),o.set("to",g.toISOString())}we(o,a);const i=new URLSearchParams({limit:"50",offset:"0"});we(i,a,"jobSortBy","jobSortDir");const[n,,d,l]=await Promise.all([ht(!1).catch(()=>({models:c.models||[],defaultModel:""})),kt().catch(()=>{}),I(`/media/assets?${o}`),I(`/media/jobs?${i}`).catch(()=>({data:[],total:0}))]),u=d.data||[],m=d.total??u.length,p=l.data||[],r=l.total??p.length,k=(c.keys||[]).filter(g=>g.isActive!==!1&&(g.mode==="agent"||g.role==="admin")),b=[`<option value="">${t(e("media.generateKeySession"))}</option>`,...k.map(g=>`<option value="${t(g.id)}">${t(g.name||g.id)} · ${t(g.keyPrefix||"")}… · ${t(g.mode||"")}</option>`)].join(""),f=n.models?.length?n.models:c.models||[],h=n.defaultModel||f[0]||"",$=f.length?f.map(g=>`<option value="${t(g)}" ${g===h?"selected":""}>${t(g)}${g===h?` · ${t(e("media.modelDefault"))}`:""}</option>`).join(""):`<option value="">${t(h||e("media.modelEmpty"))}</option>`,B=[["1:1","1:1 · square"],["16:9","16:9 · landscape"],["9:16","9:16 · portrait / story"],["4:3","4:3"],["3:4","3:4"],["3:2","3:2"],["2:3","2:3"],["auto","auto"]].map(([g,v],j)=>`<option value="${g}" ${j===0?"selected":""}>${t(v)}</option>`).join(""),L=u.map(g=>{const v=g.mime||"",j=g.filename||g.originalName||"",S=Ms(v,j),P=ha(v,j)||"",C=S?`<button type="button" class="btn ghost sm" data-media-preview="${t(g.id)}" data-media-mime="${t(v)}" data-media-name="${t(j)}" data-media-kind="${t(g.kind||"")}" data-media-bytes="${t(String(g.bytes??""))}" data-media-prompt="${t(g.prompt||"")}" data-preview-kind="${t(P)}" title="${t(e("media.preview"))}">${t(e("media.preview"))}</button>`:"";return`
    <tr>
      <td>
        <div class="cell-primary mono" title="${t(g.id)}">${t(String(g.id).slice(0,8))}…</div>
        <div class="cell-sub">${t(j||g.source||"—")}</div>
      </td>
      <td>${t(g.kind||"—")}</td>
      <td class="muted">${t(v||"—")}</td>
      <td>${Te(g.bytes)}</td>
      <td>${t(g.provider||"—")}</td>
      <td class="muted" title="${t(g.prompt||"")}">${t((g.prompt||"—").slice(0,48))}</td>
      <td>${oe(g.created_at)}</td>
      <td><div class="row-actions">
        ${C}
        <button type="button" class="btn ghost sm" data-media-dl="${t(g.id)}" data-media-name="${t(j)}">${t(e("media.download"))}</button>
        <button type="button" class="btn danger sm" data-media-del="${t(g.id)}">${t(e("media.delete"))}</button>
      </div></td>
    </tr>`}).join(""),R=Ae({title:e("common.filterTitle"),hint:e("common.filterHint"),meta:A("common.pagerTotal",{n:m}),searchHtml:`
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
      </label>`}),x=he({headHtml:`
      <th>ID</th>
      ${F({field:"kind",label:e("media.kind"),filterRef:a})}
      ${F({field:"mime",label:"MIME",filterRef:a})}
      ${F({field:"byteSize",label:e("media.bytes"),filterRef:a})}
      ${F({field:"provider",label:e("media.provider"),filterRef:a})}
      <th>${t(e("media.prompt"))}</th>
      ${F({field:"createdAt",label:e("media.created"),filterRef:a})}
      <th>${t(e("common.actions"))}</th>`,bodyHtml:L,colSpan:8,emptyText:e("media.empty"),pagerHtml:Be({total:m,limit:a.limit,offset:a.offset,idPrefix:"media"})}),G=p.map(g=>`
    <tr>
      <td>
        <div class="cell-primary mono" title="${t(g.id)}">${t(String(g.id).slice(0,8))}…</div>
      </td>
      <td>${t(g.status||"—")}</td>
      <td class="muted" title="${t(g.prompt||"")}">${t((g.prompt||"—").slice(0,64))}</td>
      <td class="mono">${t(g.result_asset_id?String(g.result_asset_id).slice(0,8)+"…":"—")}</td>
      <td>${oe(g.created_at)}</td>
    </tr>`).join(""),M=he({headHtml:`
      <th>ID</th>
      ${F({field:"status",label:e("media.status"),filterRef:a,sortByKey:"jobSortBy",sortDirKey:"jobSortDir"})}
      <th>${t(e("media.prompt"))}</th>
      <th>Asset</th>
      ${F({field:"createdAt",label:e("media.created"),filterRef:a,sortByKey:"jobSortBy",sortDirKey:"jobSortDir"})}`,bodyHtml:G,colSpan:5,emptyText:e("media.jobsEmpty")}),w=`
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
            <select id="mg-key">${b}</select>
          </label>
          <label>${t(e("chats.model"))}
            <select id="mg-model">${$}</select>
            <span class="hint">${t(e("media.modelHint"))}</span>
          </label>
          <label id="mg-aspect-wrap">${t(e("media.aspectRatio"))}
            <select id="mg-aspect">${B}</select>
            <span class="hint">${t(e("media.aspectHint"))}</span>
          </label>
          <label id="mg-n-wrap">${t(e("media.generateN"))}
            <input type="number" id="mg-n" min="1" max="4" value="1" />
            <span class="hint">${t(e("media.nHint"))}</span>
          </label>
          <label id="mg-voice-wrap" hidden>${t(e("media.videoVoice"))}
            <select id="mg-voice">
              <option value="">${t(e("media.videoVoiceNone"))}</option>
              ${["ara","eve","leo","rex","sal","mio"].map(g=>`<option value="${g}">${g}</option>`).join("")}
            </select>
            <span class="hint">${t(e("media.videoVoiceHint"))}</span>
          </label>
          <label id="mg-duration-wrap" hidden>${t(e("media.videoDuration"))}
            <select id="mg-duration">
              ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(g=>`<option value="${g}" ${g===6?"selected":""}>${g}s</option>`).join("")}
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
    </div>`,N=`
    <div class="grid media-kpi-grid" id="media-kpi-grid">
      <div class="card">
        <div class="label">${t(e("media.assets"))}</div>
        <div class="value value-sm">${m}</div>
        <div class="muted card-sub">${t(e("media.kpiAssetsSub"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("media.jobs"))}</div>
        <div class="value value-sm">${r}</div>
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
    ${ve([e("media.intro")])}
    ${N}
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
          <span class="seg-tab-count">${r}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane media-tab-pane-studio" id="media-tab-studio" ${s==="studio"?"":"hidden"}>
          ${w}
        </div>
        <div class="usage-tab-pane media-tab-pane-assets" id="media-tab-assets" ${s==="assets"?"":"hidden"}>
          ${R}
          ${x}
        </div>
        <div class="usage-tab-pane media-tab-pane-jobs" id="media-tab-jobs" ${s==="jobs"?"":"hidden"}>
          ${M}
        </div>
      </div>
    </div>
  `),de(),document.querySelectorAll("[data-media-tab]").forEach(g=>{g.addEventListener("click",()=>{const v=g.getAttribute("data-media-tab")||"studio",j=v==="assets"||v==="jobs"||v==="studio"?v:"studio";c.mediaFilter.tab!==j&&(c.mediaFilter.tab=j,Me().catch(y))})});async function q(g){const v=await fetch(`/admin/api/media/assets/${g}/download`,{headers:{Authorization:`Bearer ${c.key}`}});if(!v.ok)throw new Error(await v.text());return v.blob()}{let g="generate",v=null;const j=()=>{const E=document.getElementById("mg-source-chip"),T=document.getElementById("mg-clear-source");if(!E)return;if(!v){E.hidden=!0,E.innerHTML="",T&&(T.hidden=!0);return}const X=v.kind==="file"?e("media.sourceKindUpload"):v.kind==="asset"?e("media.sourceKindAsset"):e("media.sourceKindDocument");E.hidden=!1,E.innerHTML=`<span class="chip">${t(X)}</span> <span class="mono">${t(v.name||v.id||"")}</span>`,T&&(T.hidden=!1)},S=E=>{v=E;const T=document.getElementById("mg-file");T&&E?.kind!=="file"&&(T.value=""),j()},P=E=>{g=E==="edit"||E==="video"?E:"generate",document.querySelectorAll("[data-mg-mode]").forEach(Pe=>{const Ee=Pe.getAttribute("data-mg-mode")===g;Pe.classList.toggle("is-active",Ee),Pe.setAttribute("aria-selected",Ee?"true":"false")});const T=document.getElementById("mg-source-section"),X=document.getElementById("mg-n-wrap"),re=document.getElementById("mg-duration-wrap"),Ce=document.getElementById("mg-voice-wrap"),ge=document.getElementById("mg-submit");T&&(T.hidden=g==="generate"),X&&(X.hidden=g==="video"),re&&(re.hidden=g!=="video"),Ce&&(Ce.hidden=g!=="video"),ge&&(ge.textContent=e(g==="edit"?"media.editSubmit":g==="video"?"media.videoSubmit":"media.generateSubmit"));const ae=document.getElementById("mg-prompt");ae&&(ae.placeholder=e(g==="edit"?"media.editPromptPh":g==="video"?"media.videoPromptPh":"media.generatePromptPh"));const $e=document.getElementById("mg-drop-title"),Y=document.getElementById("mg-drop-hint");$e&&($e.textContent=e(g==="video"?"media.dropTitleVideo":"media.dropTitle")),Y&&(Y.textContent=e(g==="video"?"media.dropHintVideo":"media.dropHint"))};document.querySelectorAll("[data-mg-mode]").forEach(E=>{E.addEventListener("click",()=>P(E.getAttribute("data-mg-mode")||"generate"))}),P("generate");const C=document.getElementById("mg-dropzone"),K=document.getElementById("mg-file"),ne=E=>E?E.type&&E.type.startsWith("image/")?!0:/\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(E.name||""):!1,ee=E=>{const T=[...E||[]].find(ne);if(!T){Q(e("media.sourceNeedImage"));return}S({kind:"file",file:T,name:T.name,mime:T.type||"image/*"}),Q("")};if(document.getElementById("mg-pick-file")?.addEventListener("click",E=>{E.preventDefault(),E.stopPropagation(),K?.click()}),K?.addEventListener("change",()=>{K.files?.length&&ee(K.files)}),document.getElementById("mg-clear-source")?.addEventListener("click",E=>{E.preventDefault(),E.stopPropagation(),S(null)}),document.getElementById("mg-pick-lib")?.addEventListener("click",E=>{E.preventDefault(),E.stopPropagation(),Ns({imagesOnly:!0,onPick:T=>{S({kind:T.kind,id:T.id,name:T.name,mime:T.mime}),Q("")}}).catch(T=>Q(T.message||e("media.libraryLoadFail")))}),C&&(C.addEventListener("click",E=>{E.target.closest("button")||K?.click()}),C.addEventListener("keydown",E=>{(E.key==="Enter"||E.key===" ")&&(E.preventDefault(),K?.click())}),["dragenter","dragover"].forEach(E=>{C.addEventListener(E,T=>{T.preventDefault(),T.stopPropagation(),C.classList.add("is-dragover")})}),["dragleave","drop"].forEach(E=>{C.addEventListener(E,T=>{T.preventDefault(),T.stopPropagation(),C.classList.remove("is-dragover")})}),C.addEventListener("drop",E=>{const T=E.dataTransfer;T?.files?.length&&ee(T.files)})),c._mediaDragAbort)try{c._mediaDragAbort.abort()}catch{}c._mediaDragAbort=new AbortController;const U={signal:c._mediaDragAbort.signal},z=document.getElementById("app");let H=0;window.addEventListener("dragenter",E=>{g!=="generate"&&[...E.dataTransfer?.types||[]].includes("Files")&&(H+=1,z?.classList.add("is-media-file-drag"))},U),window.addEventListener("dragleave",()=>{H=Math.max(0,H-1),H===0&&z?.classList.remove("is-media-file-drag")},U),window.addEventListener("drop",E=>{H=0,z?.classList.remove("is-media-file-drag"),g!=="generate"&&E.dataTransfer?.files?.length&&(E.preventDefault(),ee(E.dataTransfer.files))},U),window.addEventListener("dragover",E=>{g!=="generate"&&[...E.dataTransfer?.types||[]].includes("Files")&&E.preventDefault()},U),document.getElementById("mg-submit")?.addEventListener("click",async()=>{const E=document.getElementById("mg-prompt")?.value?.trim()||"";if(!E){Q(e("media.generateNeedPrompt"));return}const T=document.getElementById("mg-key")?.value||"",X=document.getElementById("mg-model")?.value||void 0,re=document.getElementById("mg-aspect")?.value||"1:1",Ce=Math.min(4,Math.max(1,Number(document.getElementById("mg-n")?.value)||1)),ge=document.getElementById("mg-submit"),ae=document.getElementById("mg-status"),$e=e(g==="video"?"media.videoBusy":g==="edit"?"media.editBusy":"media.generateBusy");ge&&(ge.disabled=!0,ge.textContent=$e),ae&&(ae.hidden=!1,ae.textContent=$e),Q("");try{if(g==="edit"){if(!v)throw new Error(e("media.editNeedImage"));const J=new FormData;J.append("prompt",E),J.append("aspect_ratio",re),J.append("n",String(Ce)),J.append("response_format","url"),X&&J.append("model",X),T&&J.append("apiKeyId",T),v.kind==="file"&&v.file?J.append("image",v.file):v.kind==="asset"&&v.id?J.append("sourceAssetId",v.id):v.kind==="document"&&v.id&&J.append("sourceDocumentId",v.id),await Ea(await fetch("/admin/api/media/edit",{method:"POST",headers:{Authorization:`Bearer ${c.key}`},body:J})),ae&&(ae.textContent=e("media.editOk")),c.mediaFilter.tab="assets",c.mediaFilter.offset=0,await Me();return}if(g==="video"){const J=new FormData;J.append("prompt",E),J.append("aspect_ratio",re),J.append("seconds",String(document.getElementById("mg-duration")?.value||6)),X&&J.append("model",X),T&&J.append("apiKeyId",T);const Pa=document.getElementById("mg-voice")?.value||"";Pa&&J.append("voices",Pa),v?.kind==="file"&&v.file?J.append("image",v.file):v?.kind==="asset"&&v.id?J.append("source_asset_id",v.id):v?.kind==="document"&&v.id&&J.append("source_document_id",v.id),await Ea(await fetch("/admin/api/media/videos",{method:"POST",headers:{Authorization:`Bearer ${c.key}`},body:J})),ae&&(ae.textContent=e("media.videoOk")),c.mediaFilter.tab="jobs",await Me();return}const Y={prompt:E,aspect_ratio:re,n:Ce,response_format:"url"};X&&(Y.model=X),T&&(Y.apiKeyId=T);const Ee=(await I("/media/generate",{method:"POST",body:JSON.stringify(Y)}))?.data?.grok?.asset_ids||[];if(ae&&(ae.textContent=e("media.generateOk")),c.mediaFilter.tab="assets",c.mediaFilter.offset=0,await Me(),Ee[0])try{const J=await q(Ee[0]);Ia({id:Ee[0],mime:J.type||"image/png",filename:`generated-${String(Ee[0]).slice(0,8)}`,kind:"image",bytes:J.size,prompt:E},J)}catch{}}catch(Y){y(Y),ae&&(ae.textContent=Y.message||e("media.generateFail")),ge&&(ge.disabled=!1,P(g))}})}(s==="assets"||s==="jobs")&&Ge(c.mediaFilter,()=>Me().catch(y)),s==="assets"&&(dt("media",c.mediaFilter,()=>Me().catch(y)),document.querySelector("#media-tab-assets [data-filter-apply]")?.addEventListener("click",()=>{c.mediaFilter.q=document.getElementById("mf-q")?.value.trim()||"",c.mediaFilter.kind=document.getElementById("mf-kind")?.value||"",c.mediaFilter.provider=document.getElementById("mf-provider")?.value.trim()||"",c.mediaFilter.from=document.getElementById("mf-from")?.value||"",c.mediaFilter.to=document.getElementById("mf-to")?.value||"",c.mediaFilter.offset=0,Me().catch(y)}),document.querySelector("#media-tab-assets [data-filter-reset]")?.addEventListener("click",()=>{const g=c.mediaFilter.tab;c.mediaFilter={tab:g,q:"",kind:"",provider:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",jobSortBy:"createdAt",jobSortDir:"desc",limit:20,offset:0},Me().catch(y)}),document.querySelectorAll("[data-media-preview]").forEach(g=>{g.addEventListener("click",async()=>{try{const v=g.getAttribute("data-media-preview");if(!v)return;const j=g.getAttribute("data-media-mime")||"",S=g.getAttribute("data-media-name")||"",P=g.getAttribute("data-media-kind")||"",C=g.getAttribute("data-media-bytes")||"",K=g.getAttribute("data-media-prompt")||"",ne=await q(v);Ia({id:v,mime:j||ne.type||"",filename:S,kind:P,bytes:C?Number(C):ne.size,prompt:K},ne)}catch(v){y(v)}})}),document.querySelectorAll("[data-media-dl]").forEach(g=>{g.addEventListener("click",async()=>{try{const v=g.getAttribute("data-media-dl"),j=g.getAttribute("data-media-name")||"",S=await q(v),P=document.createElement("a");P.href=URL.createObjectURL(S),P.download=j||`media-${String(v).slice(0,8)}`,P.click(),setTimeout(()=>URL.revokeObjectURL(P.href),3e4)}catch(v){y(v)}})}),document.querySelectorAll("[data-media-del]").forEach(g=>{g.addEventListener("click",async()=>{const v=g.getAttribute("data-media-del");if(await Z({message:e("media.deleteConfirm"),variant:"danger",confirmText:e("media.delete")}))try{await I(`/media/assets/${v}`,{method:"DELETE"}),await Me()}catch(j){y(j)}})}))}async function Ns(a){const s=a.imagesOnly!==!1;let o="documents",i=0,n=null;rt({title:e("media.libraryTitle"),subtitle:t(e("media.librarySubtitle")),size:"md",bodyHtml:`
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
      <button type="button" class="btn sm" id="mlib-add" disabled>${t(e("media.librarySelect"))}</button>`});const d=document.getElementById("mlib-list"),l=document.getElementById("mlib-q"),u=document.getElementById("mlib-add");document.getElementById("mlib-cancel")?.addEventListener("click",()=>ye());const m=()=>{u&&(u.disabled=!n,u.textContent=n?`${e("media.librarySelect")} · ${n.name.slice(0,24)}`:e("media.librarySelect"))},p=h=>String(h||"").startsWith("image/"),r=h=>/\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(String(h||"")),k=h=>{if(d){if(!h.length){d.innerHTML=`<div class="data-empty chat-lib-empty"><strong>${t(e("media.libraryEmpty"))}</strong></div>`;return}d.innerHTML=h.map($=>{const B=n?.id===$.id&&n?.kind===$.kind;return`
          <label class="chat-lib-row ${B?"is-selected":""}" data-kind="${t($.kind)}" data-id="${t($.id)}">
            <input type="radio" name="mlib-pick" ${B?"checked":""} />
            <span class="chat-lib-meta">
              <span class="chat-lib-name" title="${t($.name)}">${t($.name)}</span>
              <span class="muted">${t($.kindLabel)} · ${t($.mime||"—")}${$.size!=null?` · ${Te($.size)}`:""}</span>
            </span>
          </label>`}).join(""),d.querySelectorAll(".chat-lib-row").forEach($=>{$.addEventListener("click",()=>{const B=$.getAttribute("data-kind"),L=$.getAttribute("data-id"),R=h.find(x=>x.id===L&&x.kind===B);R&&(n={kind:R.kind,id:R.id,name:R.name,mime:R.mime},d.querySelectorAll(".chat-lib-row").forEach(x=>{x.classList.toggle("is-selected",x.getAttribute("data-id")===L&&x.getAttribute("data-kind")===B);const G=x.querySelector("input");G&&(G.checked=x.getAttribute("data-id")===L&&x.getAttribute("data-kind")===B)}),m())})})}},b=async()=>{const h=++i;d&&(d.innerHTML=`<div class="muted chat-lib-status">${t(e("common.loading")||"…")}</div>`);try{const $=(l?.value||"").trim();let B=[];if(o==="assets"){const L=new URLSearchParams({limit:"80",offset:"0"});$&&L.set("q",$),s&&L.set("kind","image"),B=((await I(`/media/assets?${L}`)).data||[]).filter(x=>!s||p(x.mime)||r(x.filename)).map(x=>({kind:"asset",kindLabel:e("media.sourceKindAsset"),id:x.id,name:x.filename||x.prompt||x.id,mime:x.mime||"",size:x.bytes}))}else{const L=new URLSearchParams({limit:"80",offset:"0"});$&&L.set("q",$),B=((await I(`/documents?${L}`)).data||[]).filter(x=>!s||p(x.mimeType)||r(x.originalName)).map(x=>({kind:"document",kindLabel:e("media.sourceKindDocument"),id:x.id,name:x.originalName||x.id,mime:x.mimeType||"",size:x.sizeBytes}))}if(h!==i)return;k(B)}catch($){if(h!==i)return;d&&(d.innerHTML=`<div class="error-box">${t($.message||e("media.libraryLoadFail"))}</div>`)}};document.querySelectorAll("[data-mlib-tab]").forEach(h=>{h.addEventListener("click",()=>{o=h.getAttribute("data-mlib-tab")==="assets"?"assets":"documents",document.querySelectorAll("[data-mlib-tab]").forEach($=>{$.classList.toggle("is-active",$.getAttribute("data-mlib-tab")===o)}),n=null,m(),b()})});let f=null;l?.addEventListener("input",()=>{f&&clearTimeout(f),f=setTimeout(()=>b(),280)}),u?.addEventListener("click",()=>{n&&(a.onPick(n),ye())}),m(),await b()}async function pe(){const a=c.usageFilter;a.sortBy||(a.sortBy="lastUsedAt"),a.sortDir||(a.sortDir="desc"),a.modelSortBy||(a.modelSortBy="requests"),a.modelSortDir||(a.modelSortDir="desc");const s=new URLSearchParams;we(s,a),a.modelSortBy&&s.set("modelSortBy",a.modelSortBy),(a.modelSortDir==="asc"||a.modelSortDir==="desc")&&s.set("modelSortDir",a.modelSortDir);const{data:o}=await I(`/usage?${s}`),i=o.totals||{},n=o.limits||{},d=a.pageSize||10;let l=o.byModel||[];if(a.modelQ.trim()){const M=a.modelQ.trim().toLowerCase();l=l.filter(w=>String(w.model||"").toLowerCase().includes(M))}const u=l.length,p=l.slice(a.modelPage*d,a.modelPage*d+d).map(M=>`<tr><td class="cell-primary">${t(M.model)}</td><td>${M.requests}</td></tr>`).join("");let r=o.perKey||[];if(a.keyQ.trim()){const M=a.keyQ.trim().toLowerCase();r=r.filter(w=>String(w.name||"").toLowerCase().includes(M)||String(w.keyPrefix||"").toLowerCase().includes(M))}a.keyActive==="true"&&(r=r.filter(M=>M.isActive)),a.keyActive==="false"&&(r=r.filter(M=>!M.isActive));const k=r.length,f=r.slice(a.keyPage*d,a.keyPage*d+d).map(M=>{const w=Math.round((M.utilization||0)*100);return`<tr>
        <td><div class="cell-primary">${t(M.name)}</div><div class="cell-sub">${t(M.keyPrefix)}</div></td>
        <td>${M.requests}</td>
        <td>${Ga(M.rateLimit)}</td>
        <td>
          <div>${A("common.percent",{n:w})}</div>
          <div class="usage-bar ${w>80?"warn":""}"><span style="width:${w}%"></span></div>
        </td>
        <td>${M.isActive?`<span class="badge success">${t(e("common.active"))}</span>`:`<span class="badge error">${t(e("common.revoked"))}</span>`}</td>
        <td class="muted">${M.lastUsedAt?oe(M.lastUsedAt):"—"}</td>
      </tr>`}).join(""),h=Be({total:u,limit:d,offset:a.modelPage*d,idPrefix:"umodel"}),$=Be({total:k,limit:d,offset:a.keyPage*d,idPrefix:"ukey"}),B=a.tab==="key"?"key":"model",L=Ae({title:e("usage.byModel"),hint:e("common.filterHint"),searchHtml:`<div class="data-filter-search"><label>${t(e("common.search"))}<input type="search" id="uf-model" value="${t(a.modelQ)}" placeholder="${t(e("chats.model"))}" /></label></div>`,gridHtml:""}),R=he({headHtml:`
      ${F({field:"model",label:e("chats.model"),filterRef:a,sortByKey:"modelSortBy",sortDirKey:"modelSortDir"})}
      ${F({field:"requests",label:e("usage.requests"),filterRef:a,sortByKey:"modelSortBy",sortDirKey:"modelSortDir"})}`,bodyHtml:p,colSpan:2,emptyText:e("common.empty"),pagerHtml:h}),x=Ae({title:e("usage.byKey"),hint:e("common.filterHint"),searchHtml:`<div class="data-filter-search"><label>${t(e("common.search"))}<input type="search" id="uf-key" value="${t(a.keyQ)}" placeholder="${t(e("keys.name"))}" /></label></div>`,gridHtml:`<label>${t(e("keys.status"))}
      <select id="uf-active">
        <option value="">${t(e("common.all"))}</option>
        <option value="true" ${a.keyActive==="true"?"selected":""}>${t(e("common.active"))}</option>
        <option value="false" ${a.keyActive==="false"?"selected":""}>${t(e("common.revoked"))}</option>
      </select>
    </label>`}),G=he({headHtml:`
      ${F({field:"name",label:e("keys.name"),filterRef:a})}
      ${F({field:"requests",label:e("usage.requests"),filterRef:a})}
      ${F({field:"rateLimit",label:e("usage.rateLimit"),filterRef:a})}
      ${F({field:"utilization",label:e("usage.util"),filterRef:a})}
      ${F({field:"isActive",label:e("keys.status"),filterRef:a})}
      ${F({field:"lastUsedAt",label:e("usage.lastUsed")||e("media.created"),filterRef:a})}`,bodyHtml:f,colSpan:6,emptyText:e("common.empty"),pagerHtml:$});document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("usage.title"))}</h2>
      <button class="btn secondary sm" id="btn-usage-refresh">${t(e("usage.refresh"))}</button>
    </div>
    ${ve([`${e("usage.window")}: ${oe(o.from)} → ${oe(o.to)} (${A("common.minutes",{n:o.windowMinutes})})`])}
    <div class="grid">
      <div class="card"><div class="label">${t(e("usage.requests"))}</div><div class="value">${i.requests??0}</div></div>
      <div class="card"><div class="label">${t(e("usage.success"))}</div><div class="value">${i.success??0}</div></div>
      <div class="card"><div class="label">${t(e("usage.errors"))}</div><div class="value">${i.errors??0}</div></div>
      <div class="card"><div class="label">${t(e("usage.errorRate"))}</div><div class="value">${Math.round((i.errorRate||0)*100)}%</div></div>
    </div>
    <div class="panel data-table-panel" style="margin-bottom:14px">
      <div class="panel-h"><strong>${t(e("usage.limits"))}</strong></div>
      <div class="panel-pad">
        <div class="grid">
          <div class="card"><div class="label">${t(e("usage.global"))}</div><div class="value value-sm">${n.globalMax} / ${n.globalWindowMs}ms</div></div>
          <div class="card"><div class="label">${t(e("usage.ipMax"))}</div><div class="value value-sm">${n.ipMax}</div></div>
          <div class="card"><div class="label">${t(e("usage.burst"))}</div><div class="value value-sm">${n.chatBurstMax}</div></div>
          <div class="card"><div class="label">${t(e("usage.block"))}</div><div class="value value-sm">${n.blockFailedAuthThreshold}</div></div>
          <div class="card"><div class="label">${t(e("usage.concurrent"))}</div><div class="value value-sm">${n.grokMaxConcurrent}</div></div>
        </div>
      </div>
    </div>

    <div class="usage-tabs-panel panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("usage.title"))}">
        <button type="button" role="tab" class="seg-tab ${B==="model"?"is-active":""}" data-usage-tab="model" aria-selected="${B==="model"}">
          ${t(e("usage.byModel"))}
          <span class="seg-tab-count">${u}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${B==="key"?"is-active":""}" data-usage-tab="key" aria-selected="${B==="key"}">
          ${t(e("usage.byKey"))}
          <span class="seg-tab-count">${k}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane" id="usage-tab-model" ${B==="model"?"":"hidden"}>
          ${L}
          ${R}
        </div>
        <div class="usage-tab-pane" id="usage-tab-key" ${B==="key"?"":"hidden"}>
          ${x}
          ${G}
        </div>
      </div>
    </div>
  `),de(),Ge(c.usageFilter,()=>pe().catch(y)),document.getElementById("btn-usage-refresh").onclick=()=>pe().catch(y),document.querySelectorAll("[data-usage-tab]").forEach(M=>{M.onclick=()=>{const w=M.dataset.usageTab==="key"?"key":"model";c.usageFilter.tab!==w&&(c.usageFilter.tab=w,pe().catch(y))}}),document.getElementById("umodel-prev")?.addEventListener("click",()=>{c.usageFilter.modelPage=Math.max(0,a.modelPage-1),pe().catch(y)}),document.getElementById("umodel-next")?.addEventListener("click",()=>{(a.modelPage+1)*d<u&&(c.usageFilter.modelPage+=1,pe().catch(y))}),document.getElementById("umodel-limit")?.addEventListener("change",M=>{c.usageFilter.pageSize=Number(M.target.value)||10,c.usageFilter.modelPage=0,pe().catch(y)}),document.getElementById("ukey-prev")?.addEventListener("click",()=>{c.usageFilter.keyPage=Math.max(0,a.keyPage-1),pe().catch(y)}),document.getElementById("ukey-next")?.addEventListener("click",()=>{(a.keyPage+1)*d<k&&(c.usageFilter.keyPage+=1,pe().catch(y))}),document.getElementById("ukey-limit")?.addEventListener("change",M=>{c.usageFilter.pageSize=Number(M.target.value)||10,c.usageFilter.keyPage=0,pe().catch(y)}),document.querySelectorAll("#usage-tab-model [data-filter-apply]").forEach(M=>{M.onclick=()=>{c.usageFilter.modelQ=document.getElementById("uf-model")?.value?.trim()||"",c.usageFilter.modelPage=0,pe().catch(y)}}),document.querySelectorAll("#usage-tab-model [data-filter-reset]").forEach(M=>{M.onclick=()=>{c.usageFilter.modelQ="",c.usageFilter.modelPage=0,pe().catch(y)}}),document.querySelectorAll("#usage-tab-key [data-filter-apply]").forEach(M=>{M.onclick=()=>{c.usageFilter.keyQ=document.getElementById("uf-key")?.value?.trim()||"",c.usageFilter.keyActive=document.getElementById("uf-active")?.value||"",c.usageFilter.keyPage=0,pe().catch(y)}}),document.querySelectorAll("#usage-tab-key [data-filter-reset]").forEach(M=>{M.onclick=()=>{c.usageFilter.keyQ="",c.usageFilter.keyActive="",c.usageFilter.keyPage=0,pe().catch(y)}})}function qa(a){const s=a.versionStatus||(a.updateAvailable?"update_available":a.latest?"up_to_date":"unknown");return s==="update_available"?{badge:`<span class="badge warn" title="${t(e("system.statusHintUpdate"))}">${t(e("system.badgeUpdate"))}</span>`,hint:e("system.statusHintUpdate")}:s==="ahead"?{badge:`<span class="badge pending" title="${t(e("system.statusHintAhead"))}">${t(e("system.badgeAhead"))}</span>`,hint:e("system.statusHintAhead")}:s==="up_to_date"?{badge:`<span class="badge success" title="${t(e("system.statusHintOk"))}">${t(e("system.badgeOk"))}</span>`,hint:e("system.statusHintOk")}:{badge:`<span class="badge pending" title="${t(e("system.statusHintUnknown"))}">${t(e("system.badgeUnknown"))}</span>`,hint:e("system.statusHintUnknown")}}function Ks(a){return e(a==="git"?"system.channelGit":a==="npm-global"?"system.channelNpmGlobal":a==="npm-local"?"system.channelNpmLocal":"system.channelUnknown")}function js(a){return a==="required"?e("system.levelRequired"):a==="recommended"?e("system.levelRecommended"):a==="optional"?e("system.levelOptional"):a==="bundled"?e("system.levelBundled"):a||"—"}function Us(a){return a.installed?a.ok?`<span class="badge success">${t(e("system.softOk"))}</span>`:`<span class="badge warn">${t(e("system.softWarn"))}</span>`:a.level==="required"||a.level==="bundled"?`<span class="badge error">${t(e("system.softMissing"))}</span>`:`<span class="badge pending">${t(e("system.softMissing"))}</span>`}function Ta(a){return a==="up"?`<span class="badge success">${t(e("system.up"))}</span>`:`<span class="badge error">${t(e("system.down"))}</span>`}async function ot(){const{data:a}=await I("/system");if(c.page!=="system")return;const s=a.version||{},o=qa(s),i=a.software||{checks:[],allRequiredOk:!0},n=i.checks||[],d=c.systemTab==="package"||c.systemTab==="env"||c.systemTab==="sessions"?c.systemTab:"software";c.systemTab=d;let l={data:[],total:0};try{const w=new URLSearchParams({limit:d==="sessions"?"50":"1",offset:"0"});d==="sessions"&&c.grokSessionQ&&w.set("q",c.grokSessionQ);const N=await I(`/grok/sessions?${w}`);l={data:N.data||[],total:N.total||0}}catch(w){l={data:[],total:0,error:w.message||String(w)}}const u=n.map(w=>`
      <tr>
        <td><div class="cell-primary">${t(w.name||w.id)}</div>${w.requiredVersion?`<div class="cell-sub">${t(w.requiredVersion)}</div>`:""}</td>
        <td>${t(js(w.level))}</td>
        <td>${t(w.installed?e("system.yes"):e("system.no"))}${w.path?`<div class="cell-sub soft-path">${t(w.path)}</div>`:""}</td>
        <td><code class="cell-code">${t(w.version||"—")}</code></td>
        <td>${Us(w)}</td>
        <td class="muted">${t(w.detail||"")}</td>
      </tr>`).join(""),m=i.allRequiredOk?`<span class="badge success">${t(e("system.allRequiredOk"))}</span>`:`<span class="badge error">${t(e("system.requiredMissing"))}</span>`,p=a.encryption&&a.encryption.ready,r=Ks(s.channel),k=s.installSource?`${r} · ${s.installSource}`:r,b=he({headHtml:`
      <th>${t(e("system.softName"))}</th>
      <th>${t(e("system.softLevel"))}</th>
      <th>${t(e("system.softInstalled"))}</th>
      <th>${t(e("system.softVersion"))}</th>
      <th>${t(e("system.softStatus"))}</th>
      <th>${t(e("system.softDetail"))}</th>`,bodyHtml:u,colSpan:6,emptyText:e("common.empty")}),f=`
    <div class="grid system-kpi-grid" id="system-kpi-grid">
      <div class="card">
        <div class="label">${t(e("system.database"))}</div>
        <div class="value value-sm">${Ta(a.database)}</div>
        <div class="muted card-sub">${t(e("system.runtime"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("system.grokCli"))}</div>
        <div class="value value-sm">${Ta(a.grokCli)}</div>
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
    </div>`,h=a.grokInspect,$=h?[[e("system.grokVersion"),h.grokVersion||"—"],[e("system.inspectChannel"),h.channel||"—"],[e("system.inspectDefaultModel"),h.defaultModel||"—"],[e("system.inspectModels"),String(h.models?.length??0)],[e("system.inspectSkills"),String(h.skills??0)],[e("system.inspectMcp"),String(h.mcpServers??0)],[e("system.inspectPlugins"),String(h.plugins??0)],[e("system.inspectHooks"),String(h.hooks??0)]]:[],B=h?`
    <div class="panel system-inspect-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("system.grokInspect"))}</strong>
          <span class="muted panel-h-sub">${t(e("system.grokInspectHint"))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <div class="grid system-inspect-grid">
          ${$.map(([w,N])=>`
            <div class="card">
              <div class="label">${t(w)}</div>
              <div class="value value-sm">${t(N)}</div>
            </div>`).join("")}
        </div>
        ${h.error?`<div class="error-box">${t(h.error)}</div>`:""}
      </div>
    </div>`:"",L=`
    <div class="system-tab-toolbar">
      <span class="muted">${t(e("system.softwareHint"))}</span>
      ${m}
    </div>
    ${B}
    ${b}`,R=`
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
          <div class="card"><div class="label">${t(e("system.install"))}</div><div class="value value-sm">${t(k)}</div></div>
        </div>
        <pre id="update-log" class="pre" style="display:none;margin-top:12px"></pre>
      </div>
    </div>`,x=`
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
    </div>`,G=(l.data||[]).map(w=>`
      <tr>
        <td><code class="cell-code">${t(w.id)}</code></td>
        <td><div class="cell-primary">${t(w.title||"—")}</div>
          <div class="cell-sub">${t(w.summary||"")}</div></td>
        <td class="muted">${t(w.cwd||"—")}</td>
        <td>${t((w.updatedAt||"").slice(0,19).replace("T"," ")||"—")}</td>
        <td>${w.messageCount!=null?w.messageCount:"—"}</td>
        <td><button type="button" class="btn danger sm" data-del-gsess="${t(w.id)}">${t(e("system.sessionDelete"))}</button></td>
      </tr>`).join(""),M=`
    <div class="system-tab-toolbar">
      <span class="muted">${t(e("system.sessionsHint"))}</span>
      <form id="gsess-search" class="inline-form">
        <input type="search" id="gsess-q" value="${t(c.grokSessionQ||"")}" placeholder="${t(e("system.sessionsSearch"))}" />
        <button type="submit" class="btn secondary sm">${t(e("common.search")||"Search")}</button>
      </form>
    </div>
    ${l.error?`<div class="error-box">${t(l.error)}</div>`:""}
    ${he({headHtml:`
        <th>${t(e("system.sessionId"))}</th>
        <th>${t(e("system.sessionTitle"))}</th>
        <th>${t(e("system.sessionCwd"))}</th>
        <th>${t(e("system.sessionUpdated"))}</th>
        <th>${t(e("chats.msgs")||"#")}</th>
        <th></th>`,bodyHtml:G,colSpan:6,emptyText:e("common.empty")})}
    <div class="muted">${t(String(l.total||0))}</div>`;document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("system.title"))}</h2>
      <div class="toolbar">
        <button class="btn secondary sm" id="btn-check-update" title="${t(e("system.selfHint"))}">${t(e("system.checkUpdate"))}</button>
        <button class="btn sm" id="btn-one-click-update" title="${t(e("system.confirmUpdate"))}">${t(e("system.oneClick"))}</button>
      </div>
    </div>
    ${ve([e("system.selfHint")])}
    ${f}

    <div class="usage-tabs-panel panel system-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("system.title"))}">
        <button type="button" role="tab" class="seg-tab ${d==="software"?"is-active":""}" data-system-tab="software" aria-selected="${d==="software"}">
          ${t(e("system.tabSoftware"))}
          <span class="seg-tab-count">${n.length}</span>
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
          ${x}
        </div>
        <div class="usage-tab-pane system-tab-pane-sessions" id="system-tab-sessions" ${d==="sessions"?"":"hidden"}>
          ${M}
        </div>
      </div>
    </div>
  `),de(),document.getElementById("gsess-search")?.addEventListener("submit",w=>{w.preventDefault(),c.grokSessionQ=document.getElementById("gsess-q")?.value||"",ot().catch(y)}),document.querySelectorAll("[data-del-gsess]").forEach(w=>{w.addEventListener("click",async()=>{const N=w.getAttribute("data-del-gsess");if(!(!N||!await Z({title:e("system.sessionDelete"),message:e("system.sessionDeleteConfirm").replace("{id}",N)})))try{await I(`/grok/sessions/${encodeURIComponent(N)}`,{method:"DELETE"}),await ot()}catch(g){y(g)}})}),document.querySelectorAll("[data-system-tab]").forEach(w=>{w.addEventListener("click",()=>{const N=w.getAttribute("data-system-tab")||"software",q=N==="package"||N==="env"||N==="software"||N==="sessions"?N:"software";c.systemTab!==q&&(c.systemTab=q,ot().catch(y))})}),document.getElementById("btn-check-update").onclick=async()=>{try{const N=(await I("/system/update-check")).data||{},q=qa(N);await fe({title:e("system.checkResult"),message:`${e("system.current")}: ${N.current||"?"}
${e("system.npm")}: ${N.latestNpm||"n/a"}
${e("system.github")}: ${N.latestGithub||"n/a"}
${q.hint}`}),c.systemTab="package",ot().catch(y)}catch(w){y(w)}},document.getElementById("btn-one-click-update").onclick=async()=>{if(!await Z({message:e("system.confirmUpdate"),variant:"danger",confirmText:e("system.oneClick")}))return;c.systemTab!=="package"&&(c.systemTab="package",await ot());const w=document.getElementById("update-log");try{const N=document.getElementById("btn-one-click-update");N&&(N.disabled=!0);const q=await I("/system/update",{method:"POST",body:JSON.stringify({restart:!0})});w&&(w.style.display="block",w.textContent=q.data&&(q.data.message||JSON.stringify(q.data,null,2))||e("system.scheduled")),await fe(q.data&&q.data.message||e("system.scheduled"))}catch(N){y(N)}}}function oa(a){if(!a)return"—";const s=`ddos.sources.${a}`,o=e(s);return o===s?a:o}function xe(a){return Math.max(1,Math.round(Number(a||0)/1e3))}function Se(a){return Math.max(1,Math.round(Number(a||0)/6e4))}function ct(a){return Math.max(1e3,Math.round(Number(a||0)*1e3))}function ut(a){return Math.max(1e3,Math.round(Number(a||0)*6e4))}function V(a,s){const o=Number(document.getElementById(a)?.value);return Number.isFinite(o)?o:s}function at(a){return document.getElementById(a)?.checked===!0}function na(){const a=(document.getElementById("dp-whitelist")?.value||"").split(/[\n,]+/).map(i=>i.trim()).filter(Boolean),s=(document.getElementById("dp-trustedProxies")?.value||"").split(/[\n,]+/).map(i=>i.trim()).filter(Boolean);return{autoBanEnabled:document.getElementById("ddos-master-autoban")?Xe("ddos-master-autoban"):at("dp-autoBanEnabled")||document.getElementById("dp-autoBanEnabled")?.value==="1",rateLimitWindowMs:ct(V("dp-rateWindowSec",60)),rateLimitMax:Math.floor(V("dp-rateMaxKey",120)),rateLimitIpMax:Math.floor(V("dp-rateMaxIp",60)),chatBurstWindowMs:ct(V("dp-burstWindowSec",10)),chatBurstMax:Math.floor(V("dp-burstMax",20)),autoAuthEnabled:at("dp-autoAuthEnabled"),failedAuthThreshold:Math.floor(V("dp-authThreshold",20)),failedAuthWindowMs:ct(V("dp-authWindowSec",300)),authBanDurationMs:ut(V("dp-authBanMin",10)),autoRateEnabled:at("dp-autoRateEnabled"),rateHitThreshold:Math.floor(V("dp-rateHitThreshold",30)),rateHitWindowMs:ct(V("dp-rateHitWindowSec",60)),rateBanDurationMs:ut(V("dp-rateBanMin",15)),autoConnEnabled:at("dp-autoConnEnabled"),maxConcurrentPerIp:Math.floor(V("dp-maxConcurrent",20)),connBanDurationMs:ut(V("dp-connBanMin",10)),autoVelocityEnabled:at("dp-autoVelocityEnabled"),velocityMaxRequests:Math.floor(V("dp-velocityMax",200)),velocityWindowMs:ct(V("dp-velocityWindowSec",60)),velocityBanDurationMs:ut(V("dp-velocityBanMin",10)),escalateEnabled:at("dp-escalateEnabled"),escalateAfterBans:Math.floor(V("dp-escalateAfter",3)),escalateDurationMs:ut(V("dp-escalateMin",1440)),whitelist:a,proxyTrustHops:Math.max(0,Math.min(10,Math.floor(V("dp-proxyTrustHops",1)))),proxyIpSource:document.getElementById("dp-proxyIpSource")?.value||"auto",trustedProxies:s.length?s:["127.0.0.1","::1"]}}const Gs=["autoBanEnabled","rateLimitWindowMs","rateLimitMax","rateLimitIpMax","chatBurstWindowMs","chatBurstMax","autoAuthEnabled","failedAuthThreshold","failedAuthWindowMs","authBanDurationMs","autoRateEnabled","rateHitThreshold","rateHitWindowMs","rateBanDurationMs","autoConnEnabled","maxConcurrentPerIp","connBanDurationMs","autoVelocityEnabled","velocityMaxRequests","velocityWindowMs","velocityBanDurationMs","escalateEnabled","escalateAfterBans","escalateDurationMs"];function Aa(a){if(!a)return{};const s={};for(const o of Gs){const i=a[o];typeof i=="boolean"?s[o]=i:typeof i=="number"&&Number.isFinite(i)?s[o]=Math.round(i):i==null?s[o]=null:s[o]=i}return s}function ss(a,s){return JSON.stringify(Aa(a))===JSON.stringify(Aa(s))}function ia(a){const s=c._ddosPresetsCache;if(!s||!a)return"custom";for(const o of["relaxed","balanced","strict"])if(s[o]&&ss(a,s[o]))return o;return"custom"}function Bt(a){return e(a==="relaxed"?"ddos.presetRelaxed":a==="balanced"?"ddos.presetBalanced":a==="strict"?"ddos.presetStrict":"ddos.presetCustom")}function os(a,{unsaved:s=!1}={}){const o=Bt(a),i=a==="relaxed"?"relaxed":a==="balanced"?"balanced":a==="strict"?"strict":"custom",n=s?A("ddos.presetFormLabel",{name:o}):A("ddos.presetActiveLabel",{name:o});return`<span class="ddos-preset-badge is-${i}" id="ddos-preset-badge" title="${t(n)}">${t(n)}</span>`}function _e(){if(!document.getElementById("ddos-policy-panel"))return;let a;try{a=na()}catch{return}const s=ia(a),o=ia(c._ddosPolicyCache||a),i=!ss(a,c._ddosPolicyCache||a);document.querySelectorAll("[data-ddos-preset]").forEach(u=>{const m=u.dataset.ddosPreset,p=m===s,r=m===o;u.classList.toggle("is-active",p),u.classList.toggle("is-saved",r&&!p),u.setAttribute("aria-pressed",p?"true":"false");const k=e(m==="relaxed"?"ddos.presetRelaxed":m==="balanced"?"ddos.presetBalanced":"ddos.presetStrict");p&&r?u.innerHTML=`${t(k)} <span class="preset-tag">${t(e("ddos.presetTagActive"))}</span>`:p&&i?u.innerHTML=`${t(k)} <span class="preset-tag preset-tag--draft">${t(e("ddos.presetTagDraft"))}</span>`:r?u.innerHTML=`${t(k)} <span class="preset-tag preset-tag--saved">${t(e("ddos.presetTagSaved"))}</span>`:u.textContent=k});const n=document.getElementById("ddos-preset-badge");if(n){const u=os(s,{unsaved:i&&s!==o});n.outerHTML=u}const d=document.getElementById("ddos-preset-custom");d&&(d.classList.toggle("is-active",s==="custom"),d.setAttribute("aria-pressed",s==="custom"?"true":"false"));const l=document.getElementById("ddos-preset-hint");l&&(i&&s!==o?(l.textContent=A("ddos.presetUnsavedHint",{form:Bt(s),saved:Bt(o)}),l.hidden=!1):s==="custom"?(l.textContent=e("ddos.presetCustomHint"),l.hidden=!1):(l.textContent=A("ddos.presetActiveHint",{name:Bt(s)}),l.hidden=!1))}function zt(a){if(!a||!document.getElementById("dp-autoBanEnabled"))return;const s=(i,n)=>{const d=document.getElementById(i);d&&(d.type==="checkbox"?d.checked=!!n:d.value=n)},o=document.getElementById("dp-autoBanEnabled");o&&(o.type==="checkbox"?o.checked=!!a.autoBanEnabled:o.value=a.autoBanEnabled?"1":"0"),Ye("ddos-master-autoban",!!a.autoBanEnabled,e("ddos.masterOn"),e("ddos.masterOff")),et("ddos-root",!a.autoBanEnabled),Ze("ddos-disabled-banner",!a.autoBanEnabled),s("dp-rateWindowSec",xe(a.rateLimitWindowMs)),s("dp-rateMaxKey",a.rateLimitMax),s("dp-rateMaxIp",a.rateLimitIpMax),s("dp-burstWindowSec",xe(a.chatBurstWindowMs)),s("dp-burstMax",a.chatBurstMax),s("dp-autoAuthEnabled",a.autoAuthEnabled),s("dp-authThreshold",a.failedAuthThreshold),s("dp-authWindowSec",xe(a.failedAuthWindowMs)),s("dp-authBanMin",Se(a.authBanDurationMs)),s("dp-autoRateEnabled",a.autoRateEnabled),s("dp-rateHitThreshold",a.rateHitThreshold),s("dp-rateHitWindowSec",xe(a.rateHitWindowMs)),s("dp-rateBanMin",Se(a.rateBanDurationMs)),s("dp-autoConnEnabled",a.autoConnEnabled),s("dp-maxConcurrent",a.maxConcurrentPerIp),s("dp-connBanMin",Se(a.connBanDurationMs)),s("dp-autoVelocityEnabled",a.autoVelocityEnabled),s("dp-velocityMax",a.velocityMaxRequests),s("dp-velocityWindowSec",xe(a.velocityWindowMs)),s("dp-velocityBanMin",Se(a.velocityBanDurationMs)),s("dp-escalateEnabled",a.escalateEnabled),s("dp-escalateAfter",a.escalateAfterBans),s("dp-escalateMin",Se(a.escalateDurationMs)),s("dp-whitelist",(a.whitelist||[]).join(`
`)),s("dp-proxyTrustHops",a.proxyTrustHops??1),s("dp-proxyIpSource",a.proxyIpSource||"auto"),s("dp-trustedProxies",(a.trustedProxies&&a.trustedProxies.length?a.trustedProxies:["127.0.0.1","::1"]).join(`
`)),ka(a.autoBanEnabled),_e()}function ka(a){const s=document.getElementById("ddos-auto-badge");s&&(s.className=`badge ${a?"success":"pending"}`,s.textContent=e(a?"ddos.autoOn":"ddos.autoOff"))}function Qs(a){const s=(d,l)=>`<label class="data-filter-check policy-enable"><input type="checkbox" id="${d}" ${l?"checked":""} /> <span>${t(e("ddos.enableRule"))}</span></label>`,o=(d,l,u,m="1")=>`<label>${t(d)}<input type="number" id="${l}" value="${t(String(u))}" min="1" step="${m}" /></label>`,i=ia(a),n=os(i);return`
    <div class="panel data-table-panel ddos-policy-panel" id="ddos-policy-panel">
      <div class="panel-h">
        <div>
          <strong>${t(e("ddos.policyTitle"))}</strong>
          <span class="muted">${t(e("ddos.policyHint"))}</span>
        </div>
        <div class="ddos-header-badges">
          ${n}
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
            ${o(e("ddos.rateWindow"),"dp-rateWindowSec",xe(a.rateLimitWindowMs))}
            ${o(e("ddos.rateMaxKey"),"dp-rateMaxKey",a.rateLimitMax)}
            ${o(e("ddos.rateMaxIp"),"dp-rateMaxIp",a.rateLimitIpMax)}
            ${o(e("ddos.burstWindow"),"dp-burstWindowSec",xe(a.chatBurstWindowMs))}
            ${o(e("ddos.burstMax"),"dp-burstMax",a.chatBurstMax)}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionAuth"))}</h4>${s("dp-autoAuthEnabled",a.autoAuthEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.threshold"),"dp-authThreshold",a.failedAuthThreshold)}
            ${o(e("ddos.windowSec"),"dp-authWindowSec",xe(a.failedAuthWindowMs))}
            ${o(e("ddos.banMin"),"dp-authBanMin",Se(a.authBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionRate"))}</h4>${s("dp-autoRateEnabled",a.autoRateEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.threshold"),"dp-rateHitThreshold",a.rateHitThreshold)}
            ${o(e("ddos.windowSec"),"dp-rateHitWindowSec",xe(a.rateHitWindowMs))}
            ${o(e("ddos.banMin"),"dp-rateBanMin",Se(a.rateBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionConn"))}</h4>${s("dp-autoConnEnabled",a.autoConnEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.maxConcurrent"),"dp-maxConcurrent",a.maxConcurrentPerIp)}
            ${o(e("ddos.banMin"),"dp-connBanMin",Se(a.connBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionVelocity"))}</h4>${s("dp-autoVelocityEnabled",a.autoVelocityEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.velocityMax"),"dp-velocityMax",a.velocityMaxRequests)}
            ${o(e("ddos.windowSec"),"dp-velocityWindowSec",xe(a.velocityWindowMs))}
            ${o(e("ddos.banMin"),"dp-velocityBanMin",Se(a.velocityBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionEscalate"))}</h4>${s("dp-escalateEnabled",a.escalateEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.escalateAfter"),"dp-escalateAfter",a.escalateAfterBans)}
            ${o(e("ddos.escalateMin"),"dp-escalateMin",Se(a.escalateDurationMs))}
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
    </div>`}function Ws(a){return a?.length?a.map(s=>`
    <tr>
      <td>${oe(s.at)}</td>
      <td class="cell-primary">${t(s.ip)}</td>
      <td><span class="badge ${s.escalated?"warn":"pending"}">${t(oa(s.source))}</span></td>
      <td class="muted" style="max-width:280px;word-break:break-word">${t(s.reason||"")}</td>
      <td>${t(Se(s.durationMs))} min</td>
    </tr>`).join(""):`<tr class="empty-row"><td colspan="5"><div class="data-empty"><strong>${t(e("ddos.emptyEvents"))}</strong></div></td></tr>`}async function se(a={}){const s=!!a.soft&&document.getElementById("ddos-root"),o=document.querySelector(".main"),i=o?o.scrollTop:0;We&&(clearInterval(We),We=null);const n=c.ddosFilter;n.liveSortBy||(n.liveSortBy="startedAt"),n.liveSortDir||(n.liveSortDir="desc"),n.banSortBy||(n.banSortBy="createdAt"),n.banSortDir||(n.banSortDir="desc"),n.eventSortBy||(n.eventSortBy="at"),n.eventSortDir||(n.eventSortDir="desc");const d=new URLSearchParams;we(d,n,"liveSortBy","liveSortDir");const l=new URLSearchParams;we(l,n,"banSortBy","banSortDir");const u=new URLSearchParams;we(u,n,"eventSortBy","eventSortDir");const m=[I(`/ddos/connections?${d}`),I(`/ddos/blacklist?${l}`),I("/ddos/stats"),I(`/ddos/events?${u}`)];s||m.push(I("/ddos/policy"));const p=await Promise.all(m),[r,k,b,f]=p,h=s?null:p[4],$=n.pageSize||15;let B=r.data?.active||[],L=r.data?.recent||[],R=k.data||[];const x=b.data||{},G=f.data||[],M=h?.data||c._ddosPolicyCache||null,w=h?.presets||c._ddosPresetsCache||null;M&&(c._ddosPolicyCache=M),w&&(c._ddosPresetsCache=w);const N=(c._ddosPolicyCache?.whitelist||[]).map(String);if(n.liveQ.trim()){const H=n.liveQ.trim().toLowerCase(),E=T=>[T.ip,T.path,T.method,T.apiKeyName,T.apiKeyPrefix].filter(Boolean).some(X=>String(X).toLowerCase().includes(H));B=B.filter(E),L=L.filter(E)}if(n.banQ.trim()){const H=n.banQ.trim().toLowerCase();R=R.filter(E=>String(E.ip||"").toLowerCase().includes(H)||String(E.reason||"").toLowerCase().includes(H))}n.banSource&&(R=R.filter(H=>H.source===n.banSource));const q=B.slice(n.livePage*$,n.livePage*$+$),g=R.slice(n.banPage*$,n.banPage*$+$),v=q.map(H=>`
    <tr>
      <td class="cell-primary">${t(H.ip)}</td>
      <td>${t(H.method)}</td>
      <td class="muted" style="max-width:220px;word-break:break-all">${t(H.path)}</td>
      <td>${t(H.apiKeyName||H.apiKeyPrefix||"—")}</td>
      <td><span class="badge pending">${t(e("status.active"))}</span></td>
      <td>${bt(Date.now()-H.startedAt)}</td>
      <td><div class="row-actions"><button class="btn danger sm" data-ban="${t(H.ip)}">${t(e("ddos.ban"))}</button></div></td>
    </tr>`).join(""),j=L.slice(0,40).map(H=>`
    <tr>
      <td class="cell-primary">${t(H.ip)}</td>
      <td>${t(H.method)} ${t(H.path)}</td>
      <td>${H.statusCode??"—"}</td>
      <td>${bt(H.durationMs)}</td>
      <td><div class="row-actions"><button class="btn danger sm" data-ban="${t(H.ip)}">${t(e("ddos.ban"))}</button></div></td>
    </tr>`).join(""),S=g.map(H=>`
    <tr>
      <td class="cell-primary">${t(H.ip)}</td>
      <td>${t(H.reason||"—")}</td>
      <td><span class="badge pending">${t(oa(H.source))}</span></td>
      <td>${H.expiresAt?oe(H.expiresAt):t(e("ddos.permanent"))}</td>
      <td><div class="row-actions"><button class="btn secondary sm" data-unban="${t(H.ip)}">${t(e("ddos.unban"))}</button></div></td>
    </tr>`).join(""),P=(x.topIps||[]).map(H=>`<tr><td class="cell-primary">${t(H.ip)}</td><td>${H.requests}</td>
      <td><div class="row-actions"><button class="btn danger sm" data-ban="${t(H.ip)}">${t(e("ddos.ban"))}</button></div></td></tr>`).join(""),C=Ws(G),K=`<tr class="empty-row"><td colspan="7"><div class="data-empty"><strong>${t(e("ddos.emptyLive"))}</strong></div></td></tr>`,ne=`<tr class="empty-row"><td colspan="5"><div class="data-empty"><strong>${t(e("common.empty"))}</strong></div></td></tr>`,ee=`<tr class="empty-row"><td colspan="5"><div class="data-empty"><strong>${t(e("ddos.emptyBan"))}</strong></div></td></tr>`,U=`<tr class="empty-row"><td colspan="3"><div class="data-empty"><strong>${t(e("common.empty"))}</strong></div></td></tr>`,z=["","manual","auto-auth","auto-rate","auto-conn","auto-velocity","auto-escalate"].map(H=>H?`<option value="${H}" ${n.banSource===H?"selected":""}>${t(oa(H))}</option>`:`<option value="">${t(e("common.all"))}</option>`).join("");if(s){const H=(T,X)=>{const re=document.getElementById(T);re&&(re.innerHTML=X)},E=(T,X)=>{const re=document.getElementById(T);re&&(re.textContent=X)};E("ddos-stat-active",String(x.activeConnections??B.length)),E("ddos-stat-rate",String(x.rateLimitedHits??0)),E("ddos-stat-blocked",String(x.blockedHits??0)),E("ddos-stat-ban",String(R.length)),E("ddos-stat-auto",String(x.autoBanTotal??0)),E("ddos-tab-count-live",String(B.length)),E("ddos-tab-count-ban",String(R.length)),E("ddos-tab-count-events",String(G.length)),H("ddos-live-body",v||K),H("ddos-recent-body",j||ne),H("ddos-ban-body",S||ee),H("ddos-top-body",P||U),H("ddos-events-body",C),va(document),x.policySummary&&ka(!!x.policySummary.autoBanEnabled),Ba(),o&&(o.scrollTop=i)}else{const H=M||{autoBanEnabled:!0,rateLimitWindowMs:6e4,rateLimitMax:120,rateLimitIpMax:60,chatBurstWindowMs:1e4,chatBurstMax:20,autoAuthEnabled:!0,failedAuthThreshold:20,failedAuthWindowMs:3e5,authBanDurationMs:6e5,autoRateEnabled:!0,rateHitThreshold:30,rateHitWindowMs:6e4,rateBanDurationMs:9e5,autoConnEnabled:!0,maxConcurrentPerIp:20,connBanDurationMs:6e5,autoVelocityEnabled:!0,velocityMaxRequests:200,velocityWindowMs:6e4,velocityBanDurationMs:6e5,escalateEnabled:!0,escalateAfterBans:3,escalateDurationMs:864e5,whitelist:["127.0.0.1","::1"],proxyTrustHops:1,proxyIpSource:"auto",trustedProxies:["127.0.0.1","::1"]},E=!!H.autoBanEnabled,T=n.tab==="live"||n.tab==="blacklist"||n.tab==="events"||n.tab==="policy"?n.tab:"policy";c.ddosFilter.tab=T;const X=`
    <div class="grid ddos-kpi-grid">
      <div class="card"><div class="label">${t(e("ddos.activeConn"))}</div><div class="value value-sm" id="ddos-stat-active">${x.activeConnections??B.length}</div><div class="muted card-sub">${t(e("ddos.live"))}</div></div>
      <div class="card"><div class="label">${t(e("ddos.rateHits"))}</div><div class="value value-sm" id="ddos-stat-rate">${x.rateLimitedHits??0}</div><div class="muted card-sub">${t(e("ddos.stats"))}</div></div>
      <div class="card"><div class="label">${t(e("ddos.blockedHits"))}</div><div class="value value-sm" id="ddos-stat-blocked">${x.blockedHits??0}</div><div class="muted card-sub">${t(e("ddos.stats"))}</div></div>
      <div class="card"><div class="label">${t(e("ddos.blacklist"))}</div><div class="value value-sm" id="ddos-stat-ban">${R.length}</div><div class="muted card-sub">${t(e("ddos.tabBlacklist"))}</div></div>
      <div class="card"><div class="label">${t(e("ddos.autoBans"))}</div><div class="value value-sm" id="ddos-stat-auto">${x.autoBanTotal??0}</div><div class="muted card-sub">${t(e("ddos.tabEvents"))}</div></div>
    </div>`,re=Qs(H),Ce=`
    <div class="panel data-filter-panel ddos-filter-panel">
      <div class="panel-h"><strong>${t(e("common.filterTitle"))}</strong></div>
      <div class="data-filter">
        <div class="data-filter-grid">
          <label class="full">${t(e("ddos.live"))} / ${t(e("ddos.recent"))}
            <input type="search" id="ddos-live-q" value="${t(n.liveQ)}" placeholder="IP / path / key" />
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
        <span class="muted">${t(A("common.pagerTotal",{n:B.length}))}</span>
      </div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          ${F({field:"ip",label:e("ddos.ip"),filterRef:n,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${F({field:"method",label:e("ddos.method"),filterRef:n,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${F({field:"path",label:e("ddos.path"),filterRef:n,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          <th>${t(e("ddos.key"))}</th>
          <th>${t(e("ddos.state"))}</th>
          ${F({field:"durationMs",label:e("ddos.duration"),filterRef:n,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          <th>${t(e("common.actions"))}</th>
        </tr></thead>
        <tbody id="ddos-live-body">${v||K}</tbody>
      </table>
      </div>
      ${Be({total:B.length,limit:$,offset:n.livePage*$,idPrefix:"ddoslive"})}
    </div>
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${t(e("ddos.recent"))}</strong></div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          ${F({field:"ip",label:e("ddos.ip"),filterRef:n,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${F({field:"path",label:e("ddos.path"),filterRef:n,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${F({field:"statusCode",label:e("common.httpStatus"),filterRef:n,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${F({field:"durationMs",label:e("ddos.duration"),filterRef:n,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          <th>${t(e("common.actions"))}</th>
        </tr></thead>
        <tbody id="ddos-recent-body">${j||ne}</tbody>
      </table>
      </div>
    </div>`,ge=`
    <div class="panel data-filter-panel ddos-filter-panel">
      <div class="panel-h"><strong>${t(e("common.filterTitle"))}</strong></div>
      <div class="data-filter">
        <div class="data-filter-grid">
          <label>${t(e("ddos.blacklist"))}
            <input type="search" id="ddos-ban-q" value="${t(n.banQ)}" placeholder="IP / reason" />
          </label>
          <label>${t(e("ddos.source"))}
            <select id="ddos-ban-source">${z}</select>
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
        <span class="muted">${t(A("common.pagerTotal",{n:R.length}))}</span>
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
          ${F({field:"ip",label:e("ddos.ip"),filterRef:n,sortByKey:"banSortBy",sortDirKey:"banSortDir"})}
          ${F({field:"reason",label:e("ddos.reason"),filterRef:n,sortByKey:"banSortBy",sortDirKey:"banSortDir"})}
          ${F({field:"source",label:e("ddos.source"),filterRef:n,sortByKey:"banSortBy",sortDirKey:"banSortDir"})}
          ${F({field:"expiresAt",label:e("ddos.expires"),filterRef:n,sortByKey:"banSortBy",sortDirKey:"banSortDir"})}
          <th>${t(e("common.actions"))}</th>
        </tr></thead>
        <tbody id="ddos-ban-body">${S||ee}</tbody>
      </table>
      </div>
      ${Be({total:R.length,limit:$,offset:n.banPage*$,idPrefix:"ddosban"})}
    </div>`,ae=`
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${t(e("ddos.eventsTitle"))}</strong>
        <span class="muted">${t(A("common.pagerTotal",{n:G.length}))}</span>
      </div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          ${F({field:"at",label:e("ddos.eventTime"),filterRef:n,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
          ${F({field:"ip",label:e("ddos.ip"),filterRef:n,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
          ${F({field:"source",label:e("ddos.eventSource"),filterRef:n,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
          ${F({field:"reason",label:e("ddos.reason"),filterRef:n,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
          ${F({field:"durationMs",label:e("ddos.eventDuration"),filterRef:n,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
        </tr></thead>
        <tbody id="ddos-events-body">${C}</tbody>
      </table>
      </div>
    </div>
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${t(e("ddos.topIps"))}</strong></div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>${t(e("ddos.ip"))}</th><th>${t(e("usage.requests"))}</th><th>${t(e("common.actions"))}</th></tr></thead>
        <tbody id="ddos-top-body">${P||U}</tbody>
      </table>
      </div>
    </div>`;document.getElementById("app").innerHTML=le(`
    <div id="ddos-root" class="${E?"":"is-feature-off"}">
    <div class="topbar">
      <h2>${t(e("ddos.title"))}</h2>
      <div class="toolbar">
        ${$a({id:"ddos-master-autoban",on:E,onLabel:e("ddos.masterOn"),offLabel:e("ddos.masterOff"),title:e("ddos.autoBanMasterHint")})}
        <button class="btn secondary sm" id="ddos-refresh">${t(e("ddos.refresh"))}</button>
        <button class="btn secondary sm" id="ddos-pause">${t(e(ze?"ddos.resume":"ddos.pause"))}</button>
      </div>
    </div>
    ${ve([e("ddos.policyHint")])}
    <div class="feature-off-banner" id="ddos-disabled-banner" ${E?"hidden":""} role="status">
      <strong>${t(e("common.featureOff"))}</strong>
      <span>${t(e("ddos.disabledBanner"))}</span>
    </div>
    ${X}

    <div class="usage-tabs-panel panel ddos-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("ddos.title"))}">
        <button type="button" role="tab" class="seg-tab ${T==="policy"?"is-active":""}" data-ddos-tab="policy" aria-selected="${T==="policy"}">
          ${t(e("ddos.tabPolicy"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${T==="live"?"is-active":""}" data-ddos-tab="live" aria-selected="${T==="live"}">
          ${t(e("ddos.tabLive"))}
          <span class="seg-tab-count" id="ddos-tab-count-live">${B.length}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${T==="blacklist"?"is-active":""}" data-ddos-tab="blacklist" aria-selected="${T==="blacklist"}">
          ${t(e("ddos.tabBlacklist"))}
          <span class="seg-tab-count" id="ddos-tab-count-ban">${R.length}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${T==="events"?"is-active":""}" data-ddos-tab="events" aria-selected="${T==="events"}">
          ${t(e("ddos.tabEvents"))}
          <span class="seg-tab-count" id="ddos-tab-count-events">${G.length}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-policy" id="ddos-tab-policy" ${T==="policy"?"":"hidden"}>
          ${re}
        </div>
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-stack" id="ddos-tab-live" ${T==="live"?"":"hidden"}>
          ${Ce}
        </div>
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-stack" id="ddos-tab-blacklist" ${T==="blacklist"?"":"hidden"}>
          ${ge}
        </div>
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-stack" id="ddos-tab-events" ${T==="events"?"":"hidden"}>
          ${ae}
        </div>
      </div>
    </div>
    </div>
  `),de(),Ba(!0,N),Ge(c.ddosFilter,()=>se().catch(y)),document.querySelectorAll("[data-ddos-tab]").forEach(Y=>{Y.addEventListener("click",()=>{const Pe=Y.getAttribute("data-ddos-tab")||"policy",Ee=Pe==="live"||Pe==="blacklist"||Pe==="events"||Pe==="policy"?Pe:"policy";c.ddosFilter.tab!==Ee&&(c.ddosFilter.tab=Ee,se().catch(y))})}),document.getElementById("ddos-live-filter-apply")?.addEventListener("click",()=>{c.ddosFilter.liveQ=document.getElementById("ddos-live-q")?.value?.trim()||"",c.ddosFilter.livePage=0,se().catch(y)}),document.getElementById("ddos-live-filter-reset")?.addEventListener("click",()=>{c.ddosFilter.liveQ="",c.ddosFilter.liveSortBy="startedAt",c.ddosFilter.liveSortDir="desc",c.ddosFilter.livePage=0,se().catch(y)}),document.getElementById("ddos-ban-filter-apply")?.addEventListener("click",()=>{c.ddosFilter.banQ=document.getElementById("ddos-ban-q")?.value?.trim()||"",c.ddosFilter.banSource=document.getElementById("ddos-ban-source")?.value||"",c.ddosFilter.banPage=0,se().catch(y)}),document.getElementById("ddos-ban-filter-reset")?.addEventListener("click",()=>{c.ddosFilter.banQ="",c.ddosFilter.banSource="",c.ddosFilter.banSortBy="createdAt",c.ddosFilter.banSortDir="desc",c.ddosFilter.banPage=0,se().catch(y)}),document.getElementById("ddoslive-prev")?.addEventListener("click",()=>{c.ddosFilter.livePage=Math.max(0,n.livePage-1),se().catch(y)}),document.getElementById("ddoslive-next")?.addEventListener("click",()=>{(n.livePage+1)*$<B.length&&(c.ddosFilter.livePage+=1,se().catch(y))}),document.getElementById("ddosban-prev")?.addEventListener("click",()=>{c.ddosFilter.banPage=Math.max(0,n.banPage-1),se().catch(y)}),document.getElementById("ddosban-next")?.addEventListener("click",()=>{(n.banPage+1)*$<R.length&&(c.ddosFilter.banPage+=1,se().catch(y))});const $e=document.querySelector(".main");$e&&($e.onscroll=()=>{c._ddosScrollPauseUntil=Date.now()+4e3})}!ze&&c.page==="ddos"&&(We=setInterval(()=>{c.page!=="ddos"||ze||c._ddosScrollPauseUntil&&Date.now()<c._ddosScrollPauseUntil||se({soft:!0}).catch(()=>{})},2e3))}function Ba(a=!1,s=[]){const o=s.length?s:c._ddosPolicyCache?.whitelist||[],i=async n=>{if(!n)return;const d=o.some(l=>String(l)===n||String(l).startsWith(n));await Z({message:e(d?"ddos.banWhitelistWarn":"ddos.banConfirm"),variant:"danger",confirmText:e("ddos.ban")})&&(await I("/ddos/blacklist",{method:"POST",body:JSON.stringify({ip:n,reason:e("ddos.banReasonDefault"),ttlSeconds:null})}),se({soft:!0}).catch(y))};if(document.querySelectorAll("[data-ban]").forEach(n=>{n.onclick=()=>i(n.dataset.ban)}),document.querySelectorAll("[data-unban]").forEach(n=>{n.onclick=async()=>{await Z({message:e("ddos.unbanConfirm"),variant:"danger",confirmText:e("ddos.unban")})&&(await I(`/ddos/blacklist/${encodeURIComponent(n.dataset.unban)}`,{method:"DELETE"}),se({soft:!0}).catch(y))}}),a){document.getElementById("ban-add").onclick=async()=>{const d=document.getElementById("ban-ip").value.trim();if(!d||o.some(m=>String(m)===d)&&!await Z({message:e("ddos.banWhitelistWarn"),variant:"danger",confirmText:e("ddos.ban")}))return;const u=document.getElementById("ban-ttl").value;await I("/ddos/blacklist",{method:"POST",body:JSON.stringify({ip:d,reason:document.getElementById("ban-reason").value.trim()||void 0,ttlSeconds:u?Number(u):null})}),se({soft:!0}).catch(y)},document.getElementById("ddos-refresh").onclick=()=>se({soft:!1}).catch(y),document.getElementById("ddos-pause").onclick=()=>{ze=!ze;const d=document.getElementById("ddos-pause");d&&(d.textContent=e(ze?"ddos.resume":"ddos.pause")),ze||se({soft:!0}).catch(y)},document.getElementById("ddos-master-autoban")?.addEventListener("click",async()=>{const d=!Xe("ddos-master-autoban");Ye("ddos-master-autoban",d,e("ddos.masterOn"),e("ddos.masterOff"));const l=document.getElementById("dp-autoBanEnabled");l&&(l.type==="checkbox"?l.checked=d:l.value=d?"1":"0"),ka(d),et("ddos-root",!d),Ze("ddos-disabled-banner",!d),_e();try{const u=na(),m=await I("/ddos/policy",{method:"PUT",body:JSON.stringify(u)});c._ddosPolicyCache=m.data,_e()}catch(u){Ye("ddos-master-autoban",!d,e("ddos.masterOn"),e("ddos.masterOff")),et("ddos-root",d),Ze("ddos-disabled-banner",d),y(u)}});const n=document.getElementById("ddos-policy-panel");n?.addEventListener("input",()=>_e()),n?.addEventListener("change",()=>_e()),document.querySelectorAll("[data-ddos-preset]").forEach(d=>{d.onclick=()=>{const l=d.dataset.ddosPreset;if(l==="custom")return;const u=c._ddosPresetsCache?.[l];u&&zt(u)}}),_e(),document.getElementById("dp-save")?.addEventListener("click",async()=>{try{const d=na(),l=await I("/ddos/policy",{method:"PUT",body:JSON.stringify(d)});c._ddosPolicyCache=l.data,zt(l.data),_e(),await fe({title:e("ddos.policyTitle"),message:e("ddos.policySaved")}),se({soft:!0}).catch(y)}catch(d){y(d)}}),document.getElementById("dp-reset")?.addEventListener("click",async()=>{if(await Z({message:e("ddos.confirmReset"),variant:"danger",confirmText:e("ddos.resetPolicy")}))try{const d=await I("/ddos/policy/reset",{method:"POST"});c._ddosPolicyCache=d.data,zt(d.data),_e(),await fe({title:e("ddos.policyTitle"),message:e("ddos.policyReset")}),se({soft:!0}).catch(y)}catch(d){y(d)}})}}function Et(a){return e(a==="pm2"?"pm2.runnerPm2":a==="ysk-omni"?"pm2.runnerGctoac":a==="none"?"pm2.runnerNone":"pm2.runnerUnknown")}function la(a){if(!a)return"";const s=a.messageKey;if(s&&typeof s=="string"){if(s==="pm2.msgOk")return"";const i=a.messageParams||{},n=A(s,i);if(n&&n!==s)return n}const o=a.message||"";return!o||o==="ok"?"":o}function Ca(a=10){const s=Math.max(1,Number(a)||10)*1e3;window.setTimeout(()=>{try{window.location.reload()}catch{window.location.href=window.location.href}},s)}function zs(a,s){const o=s?.messageKey||(a==="pm2"?"pm2.msgSwitchPm2":"pm2.msgSwitchGctoac");let i=la({messageKey:o,messageParams:s?.messageParams,message:void 0});i||(i=e(a==="pm2"?"pm2.msgSwitchPm2":"pm2.msgSwitchGctoac"));const n=s?.port||s?.messageParams?.port||(typeof location<"u"&&location.port?location.port:"3850");return[i,A("pm2.portAfterRestart",{port:n}),A("pm2.autoRefreshIn",{n:10})].filter(Boolean).join(`
`)}function Vt(a){return a==="pm2"?`<span class="badge success">${t(Et(a))}</span>`:a==="ysk-omni"?`<span class="badge agent">${t(Et(a))}</span>`:a==="none"?`<span class="badge pending">${t(Et(a))}</span>`:`<span class="badge warn">${t(Et(a))}</span>`}function Vs(a){return!a||typeof a!="object"?"":Object.entries(a).map(([s,o])=>`${s}=${o}`).join(`
`)}function Js(a){const s={};for(const o of(a||"").split(`
`)){const i=o.trim();if(!i||i.startsWith("#"))continue;const n=i.indexOf("=");n<=0||(s[i.slice(0,n).trim()]=i.slice(n+1).trim())}return s}function Xs(){const a=d=>document.getElementById(d)?.checked===!0,s=d=>document.getElementById(d)?.value??"";let o=s("pm2-cfg-instances").trim();if(o!=="max"){const d=Number(o);o=Number.isFinite(d)&&d>=1?d:1}const i=s("pm2-cfg-port").trim(),n=Number(i);return{port:Number.isFinite(n)&&n>=1&&n<=65535?n:void 0,name:s("pm2-cfg-name").trim()||"ysk-omni",script:s("pm2-cfg-script").trim()||"dist/server.js",cwd:s("pm2-cfg-cwd").trim()||void 0,instances:o,exec_mode:s("pm2-cfg-exec")==="cluster"?"cluster":"fork",autorestart:a("pm2-cfg-autorestart"),watch:a("pm2-cfg-watch"),max_memory_restart:s("pm2-cfg-maxmem").trim()||"512M",max_restarts:Number(s("pm2-cfg-maxrestarts"))||10,min_uptime:s("pm2-cfg-minuptime").trim()||"5s",restart_delay:Number(s("pm2-cfg-restartdelay"))||2e3,exp_backoff_restart_delay:Number(s("pm2-cfg-backoff"))||1e3,merge_logs:a("pm2-cfg-mergelogs"),time:a("pm2-cfg-time"),error_file:s("pm2-cfg-errfile").trim()||"logs/pm2-error.log",out_file:s("pm2-cfg-outfile").trim()||"logs/pm2-out.log",env_extra:Js(s("pm2-cfg-envextra")),preferred_runner:s("pm2-cfg-preferred")==="pm2"?"pm2":"ysk-omni"}}async function Le(){const s=(await I("/pm2/status")).data||{},o=s.app,i=s.config||{},n=s.portHolders||{},d=n.pids&&n.pids.length>0||!1,l=la(s);let u="",m=null;try{const P=await I("/pm2/logs?lines=80");u=(P.data?.stdout||"")+(P.data?.stderr?`
`+P.data.stderr:""),m=P.data||null}catch(P){u=P.message||""}s.lastError&&(u=`===== last errors =====
${s.lastError}

${u}`);const p=m?.files||[],r=p.length?p.filter(P=>P.exists).map(P=>`${P.label}: ${P.size<1024?P.size+" B":Math.round(P.size/1024)+" KB"}`).join(" · "):"",k=m?.maxBytes?Math.round(m.maxBytes/(1024*1024)):5,b=m?.keepBytes?Math.round(m.keepBytes/1024):512,f=o?.status||"—",h=f==="online"?e("pm2.statusOnline"):f==="errored"?e("pm2.statusErrored"):f==="stopped"?e("pm2.statusStopped"):f,$=f==="online"?`<span class="badge success">${t(h)}</span>`:f==="errored"?`<span class="badge error">${t(h)}</span>`:t(h),B=s.available,L=s.available&&o,R=s.runner||"unknown",x=l&&f!=="errored"&&s.available!==!1&&s.messageKey!=="pm2.msgErrored",G=Vs(i.env_extra),M=c.pm2Tab==="port"||c.pm2Tab==="config"||c.pm2Tab==="logs"||c.pm2Tab==="runner"?c.pm2Tab:"runner";c.pm2Tab=M;const w=`
    <div class="grid pm2-kpi-grid" id="pm2-kpi-grid">
      <div class="card">
        <div class="label">${t(e("pm2.app"))}</div>
        <div class="value value-sm">${t(s.appName||i.name||"ysk-omni")}</div>
        <div class="muted card-sub">${Vt(R)}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("pm2.status"))}</div>
        <div class="value value-sm">${$}</div>
        <div class="muted card-sub">${t(e("pm2.pid"))}: ${o?.pid&&o.pid!==0?o.pid:"—"}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("pm2.restarts"))}</div>
        <div class="value value-sm">${o?.restarts??"—"}</div>
        <div class="muted card-sub">CPU ${o?.cpu!=null?o.cpu+"%":"—"} · ${o?.memory!=null?A("common.mb",{n:Math.round(o.memory/1024/1024)}):"—"}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("pm2.port"))}</div>
        <div class="value value-sm">${s.port??"—"}</div>
        <div class="muted card-sub">${t(e("pm2.portBusy"))}: ${e(d?"common.yes":"common.no")}</div>
      </div>
    </div>`,N=`
    <div class="panel data-table-panel pm2-section-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("pm2.switchTitle"))}</strong>
          <span class="muted panel-h-sub">${t(e("pm2.switchHint"))}</span>
        </div>
        ${Vt(R)}
      </div>
      <div class="panel-pad">
        <div class="grid">
          <div class="card"><div class="label">${t(e("pm2.currentRunner"))}</div><div class="value value-sm">${Vt(R)}</div></div>
          <div class="card"><div class="label">${t(e("pm2.omniPid"))}</div><div class="value value-sm">${s.omni?.running&&s.omni?.pid?s.ysk-omni.pid:"—"}</div></div>
          <div class="card"><div class="label">${t(e("pm2.port"))}</div><div class="value value-sm">${s.port??"—"}</div></div>
          <div class="card"><div class="label">${t(e("pm2.portBusy"))}</div><div class="value value-sm">${e(d?"common.yes":"common.no")}</div></div>
        </div>
        <div class="toolbar settings-save-bar">
          <button class="btn sm" id="pm2-switch-pm2" ${B?"":"disabled"}>${t(e("pm2.switchToPm2"))}</button>
          <button class="btn secondary sm" id="pm2-switch-ysk-omni">${t(e("pm2.switchToGctoac"))}</button>
        </div>
      </div>
    </div>`,q=`
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
    </div>`,g=`
    <div class="panel data-table-panel pm2-section-panel" id="pm2-config-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("pm2.configTitle"))}</strong>
          <span class="muted panel-h-sub">${t(e("pm2.configHint"))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <div class="form-grid pm2-config-form">
          <label>${t(e("pm2.fieldName"))}<input id="pm2-cfg-name" value="${t(i.name||"")}" /></label>
          <label>${t(e("pm2.fieldScript"))}<input id="pm2-cfg-script" value="${t(i.script||"dist/server.js")}" /></label>
          <label>${t(e("pm2.fieldCwd"))}<input id="pm2-cfg-cwd" value="${t(i.cwd||"")}" placeholder="${t(e("pm2.phCwd"))}" /></label>
          <label>${t(e("pm2.fieldInstances"))}<input id="pm2-cfg-instances" value="${t(String(i.instances??1))}" placeholder="${t(e("pm2.phInstances"))}" /></label>
          <label>${t(e("pm2.fieldExecMode"))}
            <select id="pm2-cfg-exec">
              <option value="fork" ${i.exec_mode!=="cluster"?"selected":""}>${t(e("pm2.modeFork"))}</option>
              <option value="cluster" ${i.exec_mode==="cluster"?"selected":""}>${t(e("pm2.modeCluster"))}</option>
            </select>
          </label>
          <label>${t(e("pm2.fieldMaxMem"))}<input id="pm2-cfg-maxmem" value="${t(i.max_memory_restart||"512M")}" /></label>
          <label>${t(e("pm2.fieldMaxRestarts"))}<input id="pm2-cfg-maxrestarts" type="number" value="${t(String(i.max_restarts??10))}" /></label>
          <label>${t(e("pm2.fieldMinUptime"))}<input id="pm2-cfg-minuptime" value="${t(String(i.min_uptime??"5s"))}" /></label>
          <label>${t(e("pm2.fieldRestartDelay"))}<input id="pm2-cfg-restartdelay" type="number" value="${t(String(i.restart_delay??2e3))}" /></label>
          <label>${t(e("pm2.fieldBackoff"))}<input id="pm2-cfg-backoff" type="number" value="${t(String(i.exp_backoff_restart_delay??1e3))}" /></label>
          <label>${t(e("pm2.fieldErrorFile"))}<input id="pm2-cfg-errfile" value="${t(i.error_file||"logs/pm2-error.log")}" /></label>
          <label>${t(e("pm2.fieldOutFile"))}<input id="pm2-cfg-outfile" value="${t(i.out_file||"logs/pm2-out.log")}" /></label>
          <label>${t(e("pm2.fieldPreferred"))}
            <select id="pm2-cfg-preferred">
              <option value="ysk-omni" ${i.preferred_runner!=="pm2"?"selected":""}>ysk-omni</option>
              <option value="pm2" ${i.preferred_runner==="pm2"?"selected":""}>pm2</option>
            </select>
          </label>
          <label class="check"><input type="checkbox" id="pm2-cfg-autorestart" ${i.autorestart!==!1?"checked":""}/> ${t(e("pm2.fieldAutorestart"))}</label>
          <label class="check"><input type="checkbox" id="pm2-cfg-watch" ${i.watch?"checked":""}/> ${t(e("pm2.fieldWatch"))}</label>
          <label class="check"><input type="checkbox" id="pm2-cfg-mergelogs" ${i.merge_logs!==!1?"checked":""}/> ${t(e("pm2.fieldMergeLogs"))}</label>
          <label class="check"><input type="checkbox" id="pm2-cfg-time" ${i.time!==!1?"checked":""}/> ${t(e("pm2.fieldTime"))}</label>
          <label class="full">${t(e("pm2.fieldEnvExtra"))}<textarea id="pm2-cfg-envextra" rows="4" placeholder="${t(e("pm2.phEnv"))}">${t(G)}</textarea></label>
        </div>
        <div class="toolbar settings-save-bar">
          <button class="btn sm" id="pm2-cfg-save">${t(e("pm2.saveConfig"))}</button>
          <button class="btn secondary sm" id="pm2-cfg-save-only">${t(e("pm2.saveOnly"))}</button>
          <button class="btn secondary sm" id="pm2-cfg-reset">${t(e("pm2.resetConfig"))}</button>
        </div>
      </div>
    </div>`,v=`
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
          ${t(A("pm2.logsAutoTrim",{maxMb:k,keepKb:b}))}
          ${r?` · ${t(r)}`:""}
        </p>
        <pre class="pre pre-logs" id="pm2-logs-pre">${t(u||e("common.empty"))}</pre>
      </div>
    </div>`;document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("pm2.title"))}</h2>
      <div class="toolbar">
        <button class="btn secondary sm" id="pm2-refresh">${t(e("pm2.refresh"))}</button>
        <button class="btn sm" id="pm2-start" ${B?"":"disabled"}>${t(e("pm2.start"))}</button>
        <button class="btn secondary sm" id="pm2-stop" ${L?"":"disabled"}>${t(e("pm2.stop"))}</button>
        <button class="btn sm" id="pm2-restart" ${B?"":"disabled"}>${t(e("pm2.restart"))}</button>
        <button class="btn secondary sm" id="pm2-reload" ${!L||o?.status!=="online"?"disabled":""}>${t(e("pm2.reload"))}</button>
      </div>
    </div>
    ${ve([e("pm2.hint")])}
    ${l?`<div class="error-box${x?" warn-box":""}">${t(l)}</div>`:s.available?"":`<div class="error-box">${t(e("pm2.unavailable"))}</div>`}
    ${w}

    <div class="usage-tabs-panel panel pm2-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("pm2.title"))}">
        <button type="button" role="tab" class="seg-tab ${M==="runner"?"is-active":""}" data-pm2-tab="runner" aria-selected="${M==="runner"}">
          ${t(e("pm2.tabRunner"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${M==="port"?"is-active":""}" data-pm2-tab="port" aria-selected="${M==="port"}">
          ${t(e("pm2.tabPort"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${M==="config"?"is-active":""}" data-pm2-tab="config" aria-selected="${M==="config"}">
          ${t(e("pm2.tabConfig"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${M==="logs"?"is-active":""}" data-pm2-tab="logs" aria-selected="${M==="logs"}">
          ${t(e("pm2.tabLogs"))}
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-runner" ${M==="runner"?"":"hidden"}>
          ${N}
        </div>
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-port" ${M==="port"?"":"hidden"}>
          ${q}
        </div>
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-config" ${M==="config"?"":"hidden"}>
          ${g}
        </div>
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-logs" ${M==="logs"?"":"hidden"}>
          ${v}
        </div>
      </div>
    </div>
  `),de(),document.querySelectorAll("[data-pm2-tab]").forEach(P=>{P.addEventListener("click",()=>{const C=P.getAttribute("data-pm2-tab")||"runner",K=C==="port"||C==="config"||C==="logs"||C==="runner"?C:"runner";c.pm2Tab!==K&&(c.pm2Tab=K,Le().catch(y))})}),document.getElementById("pm2-logs-refresh")?.addEventListener("click",()=>{c.pm2Tab="logs",Le().catch(y)}),document.getElementById("pm2-logs-clear")?.addEventListener("click",async()=>{if(await Z({message:e("pm2.confirmClearLogs"),variant:"danger",confirmText:e("pm2.clearLogs")}))try{const C=(await I("/pm2/logs/clear",{method:"POST",body:JSON.stringify({which:"all"})})).data?.cleared?.length||0;await fe({message:A("pm2.logsCleared",{n:C})}),Le().catch(y)}catch(P){y(P)}});const j=async P=>{if(await Z({message:e(P==="pm2"?"pm2.confirmSwitchPm2":"pm2.confirmSwitchGctoac"),variant:"confirm",confirmText:e(P==="pm2"?"pm2.switchToPm2":"pm2.switchToGctoac")}))try{const K=await I("/pm2/switch",{method:"POST",body:JSON.stringify({mode:P})}),ne=K?.data||K||{},ee=zs(P==="pm2"?"pm2":"ysk-omni",ne);Ca(10),await fe({title:e("common.notice"),message:ee,confirmText:e("common.ok")});try{window.location.reload()}catch{window.location.href=window.location.href}}catch(K){y(K)}};document.getElementById("pm2-refresh").onclick=()=>Le().catch(y),document.getElementById("pm2-switch-pm2").onclick=()=>j("pm2"),document.getElementById("pm2-switch-ysk-omni").onclick=()=>j("ysk-omni"),document.getElementById("pm2-start").onclick=()=>j("pm2"),document.getElementById("pm2-stop").onclick=async()=>{if(await Z({message:e("pm2.confirmStop"),variant:"danger",confirmText:e("pm2.stop")}))try{await I("/pm2/stop",{method:"POST",body:"{}"}),Le().catch(y)}catch(P){y(P)}},document.getElementById("pm2-restart").onclick=async()=>{if(await Z({message:e("pm2.confirmRestart"),variant:"confirm",confirmText:e("pm2.restart")}))try{await j("pm2")}catch(P){y(P)}},document.getElementById("pm2-reload").onclick=async()=>{try{await I("/pm2/reload",{method:"POST",body:"{}"}),Le().catch(y)}catch(P){y(P)}};const S=async P=>{try{const C={...Xs(),restart:P};if(C.port==null){await fe({message:e("pm2.portInvalid")});return}const K=await I("/pm2/config",{method:"PUT",body:JSON.stringify(C)});if(K.data?.scheduled){const ne=K.data.portChange?`
${A("pm2.portChangedMsg",{from:K.data.portChange.previous,to:K.data.portChange.port})}`:"",ee=la(K.data.scheduled)||e("pm2.switchScheduled");Ca(10),await fe({title:e("common.notice"),message:ee+ne+`
${A("pm2.autoRefreshIn",{n:10})}`});try{window.location.reload()}catch{window.location.href=window.location.href}}else await fe(K.data?.portChange?A("pm2.portSavedNeedRestart",{port:K.data.port}):e("pm2.configSaved")),Le().catch(y)}catch(C){y(C)}};document.getElementById("pm2-cfg-save").onclick=()=>S(!0),document.getElementById("pm2-cfg-save-only").onclick=()=>S(!1),document.getElementById("pm2-port-default")?.addEventListener("click",()=>{const P=document.getElementById("pm2-cfg-port");P&&(P.value="3850")}),document.getElementById("pm2-port-save")?.addEventListener("click",async()=>{const P=Number(document.getElementById("pm2-cfg-port")?.value);if(!Number.isFinite(P)||P<1||P>65535){await fe({message:e("pm2.portInvalid")});return}if(await Z({message:A("pm2.confirmPortChange",{port:P}),variant:"confirm",confirmText:e("pm2.savePort")}))try{const C=await I("/pm2/config",{method:"PUT",body:JSON.stringify({port:P,restart:!0})}),K=C.data?.scheduled?.message||(C.data?.portChange?A("pm2.portChangedMsg",{from:C.data.portChange.previous,to:C.data.portChange.port}):e("pm2.configSaved"));await fe(K+`
`+A("pm2.portAfterRestart",{port:P}))}catch(C){y(C)}}),document.getElementById("pm2-cfg-reset").onclick=async()=>{if(await Z({message:e("pm2.confirmReset"),variant:"danger",confirmText:e("pm2.resetConfig")}))try{await I("/pm2/config/reset",{method:"POST",body:"{}"}),Le().catch(y)}catch(P){y(P)}}}let te=[],be=null,ie=[],ft=!1,Ne=0;const Re=new Map,D={keyId:"",model:"",reasoning:!0,effort:"",resumeId:"",forkSession:!1,memory:!1,noPlan:!1,permissionMode:"",systemPrompt:"",systemOpen:!1,settingsOpen:!1},_={mode:"full",recentN:6,summary:"",summaryAt:null,summarySourceCount:0},Ys=3,ns=40,Zs=20,eo=2200,O={conversationId:null,historyPage:0,historyLimit:20,historyQ:"",historyTotal:0,historyItems:[],historyLoading:!1,historyOpenMobile:!1,saving:!1,saveQueued:!1,renamingId:null};let Jt=null;const Ht=10,Sa=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;function to(a){const s=String(a||"").split(/[/\\]/).pop()||"",o=s.lastIndexOf(".");return o<0?"":s.slice(o).toLowerCase()}function Ot(a){return Ka.has(to(a))}function _t(){return e("chat.formatsHint")}function is(){_.mode="full",_.recentN=6,_.summary="",_.summaryAt=null,_.summarySourceCount=0,Ne=0,Re.clear()}function ao(a){const s=(a?.title||"").trim();if(s)return s;const o=(a?.preview||"").trim();return o||e("chat.untitled")}function so(){return te.filter(a=>!a.streaming).map(a=>{const s={role:a.role,content:a.content||""};return a.reasoning&&(s.reasoning=a.reasoning),a.docs&&a.docs.length&&(s.docs=a.docs),a.error&&(s.error=!0),s})}function oo(){return{contextMode:_.mode,contextRecentN:_.recentN,summaryText:_.summary||"",summaryAt:_.summaryAt,summarySourceCount:_.summarySourceCount||0}}function no(a){a&&(_.mode=a.contextMode==="summary"||a.contextMode==="recent"?a.contextMode:"full",_.recentN=Math.min(40,Math.max(2,Number(a.contextRecentN)||6)),_.summary=(a.summaryText||"").trim(),_.summaryAt=a.summaryAt||null,_.summarySourceCount=Number(a.summarySourceCount)||0,_.mode==="summary"&&!_.summary&&(_.mode="full"))}function ls(a){return a.reduce((s,o)=>s+(o.content||"").length+(o.reasoning||"").length,0)}function ds(){const a=te.filter(s=>!s.streaming);return a.length<2?!1:a.length>=Ys?!0:ls(a)>=800}function io(){const a=(D.systemPrompt||"").trim(),s=te.filter(l=>!l.streaming),o=Math.min(40,Math.max(2,Number(_.recentN)||6));let i=s.map(l=>({role:l.role,content:l.content||""})),n=a;if(_.mode==="summary"&&_.summary){const l=(yt()==="zh-Hant"?`【先前對話摘要 — 僅供延續語境，完整記錄仍在用戶介面】
`:`[Prior conversation summary — full history remains in the UI]
`)+_.summary;n=n?`${n}

${l}`:l;const u=s.slice(_.summarySourceCount||0);i=(u.length?u:s.slice(-o)).slice(-o).map(p=>({role:p.role,content:p.content||""}))}else _.mode==="recent"&&(i=s.slice(-o).map(l=>({role:l.role,content:l.content||""})));const d=i.map(l=>({role:l.role,content:l.content}));return n&&d.unshift({role:"system",content:n}),d}function lo(){return _.mode==="summary"&&_.summary?A("chat.ctxModeSummaryLabel",{n:_.recentN}):_.mode==="recent"?A("chat.ctxModeRecentLabel",{n:_.recentN}):e("chat.ctxModeFullLabel")}function lt(){const a=document.getElementById("chat-compress");if(!a)return;const s=te.some(n=>n.streaming),o=!!be||ft||s,i=ds();a.disabled=o||!i,a.textContent=e(ft?"chat.compressing":"chat.compress"),a.title=e(i?"chat.compress":"chat.compressNeedMore"),je(),tt()}function tt(){const a=document.getElementById("chat-ctx-mode"),s=document.getElementById("chat-ctx-n");if(a){const o=_.mode==="summary"&&!_.summary?"full":_.mode;a.value=o;const i=a.querySelector('option[value="summary"]');i&&(i.disabled=!_.summary)}s&&(s.value=String(_.recentN),s.disabled=_.mode==="full"),Rt()}function je(){const a=document.getElementById("chat-compress-banner");if(!a)return;const s=!!_.summary,o=te.filter(d=>!d.streaming).length>40||ls(te)>6e4;if(!s&&_.mode==="full"&&!o){a.hidden=!0,a.innerHTML="";return}a.hidden=!1;const i=s?_.summary.length>160?`${_.summary.slice(0,159)}…`:_.summary:"",n=o?`<p class="chat-compress-warn">${t(e("chat.ctxLongHint"))}</p>`:"";a.innerHTML=`
    <div class="chat-compress-banner-inner">
      <div class="chat-compress-banner-text">
        <strong>${t(e("chat.ctxPolicyTitle"))}</strong>
        <span class="muted">${t(lo())}</span>
        <p class="chat-compress-remark">${t(e("chat.ctxRemark"))}</p>
        ${i?`<p class="chat-compress-preview">${t(i)}</p>`:""}
        ${n}
      </div>
      <div class="chat-compress-banner-actions">
        ${s?`<button type="button" class="btn secondary sm" id="chat-summary-view">${t(e("chat.compressView"))}</button>`:""}
      </div>
    </div>`,document.getElementById("chat-summary-view")?.addEventListener("click",()=>{rs()})}async function rs(){if(!_.summary){Q(e("chat.compressNeedSummary"));return}const a=_.summaryAt?oe(_.summaryAt):"—",s=Ua(_.summary);qe&&Ve(!1);const o=document.createElement("div");return o.className="ui-dialog-back",o.id="ui-dialog-back",o.dataset.cancelable="1",o.innerHTML=`
    <div class="ui-dialog ui-dialog--info ui-dialog--large" role="dialog" aria-modal="true">
      <div class="ui-dialog-h">
        <div class="ui-dialog-icon" aria-hidden="true">Σ</div>
        <h3 class="ui-dialog-title">${t(e("chat.compressResultTitle"))}</h3>
      </div>
      <div class="ui-dialog-body ui-dialog-body--md">
        <p class="muted" style="margin:0 0 10px">${t(A("chat.summaryMeta",{when:a,n:_.summarySourceCount}))}</p>
        <div class="chat-content md">${s}</div>
      </div>
      <div class="ui-dialog-actions">
        <button type="button" class="btn secondary sm" id="ui-dialog-copy">${t(e("chat.copy"))}</button>
        <button type="button" class="btn sm" id="ui-dialog-ok">${t(e("common.ok"))}</button>
      </div>
    </div>`,document.body.appendChild(o),document.body.classList.add("ui-dialog-open"),qe=o,document.addEventListener("keydown",ya,!0),new Promise(i=>{Dt=i;const n=()=>Ve(!0);o.querySelector("#ui-dialog-ok")?.addEventListener("click",n),o.addEventListener("click",d=>{d.target===o&&n()}),o.querySelector("#ui-dialog-copy")?.addEventListener("click",async()=>{const d=await jt(_.summary),l=o.querySelector("#ui-dialog-copy");d&&l&&(l.textContent=e("chat.copied"),setTimeout(()=>{l.isConnected&&(l.textContent=e("chat.copy"))},1500))})})}function ro(a){return a.map(s=>{const o=s.role||"user";let i=(s.content||"").trim();if(s.docs&&s.docs.length){const n=s.docs.map(d=>d.name).join(", ");i=i?`${i}
[attachments: ${n}]`:`[attachments: ${n}]`}return i.length>5e3&&(i=`${i.slice(0,4999)}…`),`${o}: ${i}`}).join(`

`)}function co(){return yt()==="zh-Hant"?["你是對話摘要助手。只輸出精簡摘要，不要使用任何工具、不要上網、不要反問。","若已有舊摘要，請合併更新為一份。","請用繁體中文（或對齊原對話語言）條列：","1) 主題與目標 2) 已確定事實／決定 3) 未完成事項 4) 用戶偏好或約束","控制在約 600–1000 字。不要大段複製原文。只輸出摘要正文。"].join(`
`):["You are a conversation summary assistant. Output only a concise summary.","Merge any prior summary into one updated summary. No tools, no browsing, no questions.","Cover: (1) topics/goals (2) facts/decisions (3) open items (4) preferences.","Keep under ~600–1000 words. Summary body only."].join(`
`)}async function uo(){if(ft||be||te.some(n=>n.streaming)){Q(e("chat.compressBusy"));return}const a=te.filter(n=>!n.streaming);if(!ds()){Q(e("chat.compressNeedMore"));return}if(!await Z({title:e("chat.compress"),message:e("chat.compressConfirm"),variant:"confirm",confirmText:e("chat.compress")}))return;const s=wt();if(!s){Q(e("chat.needKey"));return}me(),ft=!0,lt();const o=document.getElementById("chat-send");o&&(o.disabled=!0);const i=document.getElementById("chat-stream-status");i&&(i.hidden=!1,i.textContent=e("chat.compressing"));try{let n=ro(a);_.summary&&(n=(yt()==="zh-Hant"?`先前摘要：
${_.summary}

完整對話：
`:`Prior summary:
${_.summary}

Full conversation:
`)+n);const d=document.getElementById("chat-model")?.value||D.model||"echo",l=wa(),u={model:d,stream:!1,include_reasoning:!1,messages:[{role:"system",content:co()},{role:"user",content:(yt()==="zh-Hant"?`請為以下對話產生摘要（僅供之後回合作為語境，不會刪除用戶介面中的記錄）：

`:`Summarize the following conversation (for later context only; UI history is kept):

`)+n}]},m=St();m&&(u.apiKeyId=m);const p=await fetch("/admin/api/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${s}`,"Content-Type":"application/json"},body:JSON.stringify(u)});if(!p.ok){const b=await p.text();let f=b;try{f=JSON.parse(b).error?.message||b}catch{}throw new Error(f||e("chat.compressFail"))}const r=await p.json();let k=r?.choices?.[0]?.message?.content||r?.choices?.[0]?.delta?.content||"";if(typeof k!="string"&&(k=String(k||"")),k=k.trim().replace(/^【對話摘要】\s*/u,"").replace(/^\[Conversation summary\]\s*/i,""),!k)throw new Error(e("chat.compressFail"));_.summary=k,_.summaryAt=new Date().toISOString(),_.summarySourceCount=a.length,_.mode="summary",je(),tt(),Q(""),i&&(i.hidden=!1,i.textContent=e("chat.compressOk"),setTimeout(()=>{const b=document.getElementById("chat-stream-status");b&&b.textContent===e("chat.compressOk")&&(b.hidden=!0,b.textContent="")},2800)),await vt().catch(()=>{}),await rs()}catch(n){Q(n.message||e("chat.compressFail"))}finally{ft=!1,lt(),o&&(o.disabled=!1),i&&i.textContent===e("chat.compressing")&&(i.hidden=!0,i.textContent="")}}function da(a){O.historyOpenMobile=!!a,document.body.classList.toggle("chat-history-open",O.historyOpenMobile)}function ra(){da(!1)}async function Ue(){if(c.key){O.historyLoading=!0,Oe();try{const a=O.historyPage*O.historyLimit,s=new URLSearchParams({limit:String(O.historyLimit),offset:String(a)});O.historyQ.trim()&&s.set("q",O.historyQ.trim());const o=await I(`/conversations?${s}`);O.historyItems=o.data||[],O.historyTotal=o.total??0}catch(a){O.historyItems=[],O.historyTotal=0,console.warn(a)}finally{O.historyLoading=!1,Oe()}}}function Oe(){const a=document.getElementById("chat-history-list"),s=document.getElementById("chat-history-pager");if(a){if(O.historyLoading&&!O.historyItems.length?a.innerHTML=`<li class="chat-history-empty">${t(e("common.loading"))}</li>`:O.historyItems.length?a.innerHTML=O.historyItems.map(o=>{const i=O.conversationId===o.id?" is-active":"",n=ao(o),d=o.title&&o.preview&&o.preview!==o.title?o.preview:o.model||A("chat.msgs",{n:o.messageCount||0}),l=O.renamingId===o.id,u=n,m=l?`<input type="text" class="chat-history-title-input" data-title-input="${t(o.id)}" value="${t(u)}" maxlength="120" placeholder="${t(e("chat.renamePh"))}" aria-label="${t(e("chat.renamePh"))}" />
            <span class="preview">${t(d||"—")}</span>
            <span class="meta"><span>${t(oe(o.updatedAt))}</span></span>`:`<span class="title" data-title-label="${t(o.id)}" title="${t(e("chat.rename"))}">${t(n)}</span>
            <span class="preview">${t(d||"—")}</span>
            <span class="meta"><span>${t(oe(o.updatedAt))}</span></span>`,p=l?`<div class="chat-history-item${i} is-editing" data-conv-body="${t(o.id)}">${m}</div>`:`<div class="chat-history-item${i}" data-open-conv="${t(o.id)}" role="button" tabindex="0" title="${t(n)}">${m}</div>`;return`
        <li class="chat-history-row${i}${l?" is-renaming":""}" data-conv-row="${t(o.id)}">
          ${p}
          <div class="chat-history-item-actions">
            <button type="button" class="icon-action" data-rename-conv="${t(o.id)}" title="${t(e("chat.rename"))}" aria-label="${t(e("chat.rename"))}">✎</button>
            <button type="button" class="icon-action danger" data-del-conv="${t(o.id)}" title="${t(e("chat.deleteConversation"))}" aria-label="${t(e("chat.deleteConversation"))}">×</button>
          </div>
        </li>`}).join(""):a.innerHTML=`<li class="chat-history-empty">${t(e("chat.historyEmpty"))}</li>`,s){const o=O.historyLimit,i=Math.max(1,Math.ceil(O.historyTotal/o)||1),n=Math.min(O.historyPage+1,i),d=A("chat.historyPage",{n,total:i}),l=O.historyPage>0,u=(O.historyPage+1)*o<O.historyTotal;s.innerHTML=`
      <button type="button" class="btn secondary sm" id="chat-hist-prev" ${l?"":"disabled"}>${t(e("chat.historyPrev"))}</button>
      <span>${t(d)}</span>
      <button type="button" class="btn secondary sm" id="chat-hist-next" ${u?"":"disabled"}>${t(e("chat.historyNext"))}</button>
    `;const m=document.getElementById("chat-hist-prev"),p=document.getElementById("chat-hist-next");m&&(m.onclick=()=>{O.historyPage>0&&(O.historyPage-=1,Ue())}),p&&(p.onclick=()=>{(O.historyPage+1)*o<O.historyTotal&&(O.historyPage+=1,Ue())})}if(a.querySelectorAll("[data-open-conv]").forEach(o=>{const i=o.getAttribute("data-open-conv");if(!i)return;let n=null;const d=()=>{n&&(clearTimeout(n),n=null)};o.addEventListener("click",l=>{O.renamingId||l.target instanceof Element&&l.target.closest(".chat-history-item-actions")||(d(),n=setTimeout(()=>{n=null,!O.renamingId&&La(i)},280))}),o.addEventListener("dblclick",l=>{l.preventDefault(),l.stopPropagation(),d(),Xt(i)}),o.addEventListener("keydown",l=>{(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),O.renamingId||La(i))})}),a.querySelectorAll("[data-title-label]").forEach(o=>{o.addEventListener("dblclick",i=>{i.preventDefault(),i.stopPropagation();const n=o.getAttribute("data-title-label");n&&Xt(n)})}),a.querySelectorAll("[data-rename-conv]").forEach(o=>{o.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation();const n=o.getAttribute("data-rename-conv");n&&Xt(n)})}),a.querySelectorAll("[data-del-conv]").forEach(o=>{o.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation();const n=o.getAttribute("data-del-conv");n&&po(n)})}),O.renamingId){const o=String(O.renamingId).replace(/\\/g,"\\\\").replace(/"/g,'\\"'),i=a.querySelector(`[data-title-input="${o}"]`);i instanceof HTMLInputElement&&(mo(i,O.renamingId),requestAnimationFrame(()=>{i.isConnected&&(i.focus(),i.select())}))}}}function Xt(a){a&&(O.renamingId&&O.renamingId!==a&&(O.renamingId=null),O.renamingId=a,Oe())}function mo(a,s){let o=!1;const i=async n=>{if(o)return;o=!0;const d=a.value;if(O.renamingId=null,!n){Oe();return}const l=String(d??"").trim().slice(0,120),u=O.historyItems.find(p=>p.id===s),m=u?(u.title||"").trim():"";if(l===m){Oe();return}u&&(u.title=l),Oe();try{await I(`/conversations/${s}`,{method:"PATCH",body:JSON.stringify({title:l})}),await Ue()}catch(p){Q(p.message||e("chat.saveFail")),await Ue()}};a.addEventListener("keydown",n=>{n.stopPropagation(),n.key==="Enter"?(n.preventDefault(),i(!0)):n.key==="Escape"&&(n.preventDefault(),i(!1))}),a.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation()}),a.addEventListener("mousedown",n=>n.stopPropagation()),a.addEventListener("dblclick",n=>{n.preventDefault(),n.stopPropagation()}),a.addEventListener("blur",()=>{setTimeout(()=>i(!0),0)})}async function La(a){(!a||be)&&be&&be.abort();try{Q("");const s=await I(`/conversations/${a}`),o=s.data||s;O.conversationId=o.id,Ne=0,Re.clear(),te=(o.messages||[]).filter(u=>!u.compressed).map(u=>({role:u.role,content:u.content||"",reasoning:u.reasoning||void 0,docs:u.docs,error:u.error})),ie=[],D.systemPrompt=o.systemPrompt||"",no(o),o.model&&(D.model=o.model),o.apiKeyId&&(D.keyId=o.apiKeyId);const i=document.getElementById("chat-system");i&&(i.value=D.systemPrompt);const n=document.getElementById("chat-system-wrap");n&&(n.hidden=!D.systemPrompt.trim()&&!D.systemOpen);const d=document.getElementById("chat-model");d&&o.model&&(d.value=o.model);const l=document.getElementById("chat-key-select");l&&o.apiKeyId&&[...l.options].some(m=>m.value===o.apiKeyId)&&(l.value=o.apiKeyId,D.keyId=o.apiKeyId),He(),Qe(),Oe(),je(),tt(),ra()}catch(s){Q(s.message||e("chat.loadFail"))}}function St(){const a=wa();return!a||String(a).startsWith("admin-session:")||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(a)?null:a}async function vt(){const a=so();if(!a.length&&!_.summary)return;if(O.saving){O.saveQueued=!0;return}O.saving=!0,O.saveQueued=!1,me();const s={messages:a,model:D.model||null,systemPrompt:D.systemPrompt||"",apiKeyId:St(),...oo()};try{if(O.conversationId)await I(`/conversations/${O.conversationId}`,{method:"PATCH",body:JSON.stringify(s)});else{if(!a.length)return;const o=await I("/conversations",{method:"POST",body:JSON.stringify({...s,title:""})}),i=o.data||o;O.conversationId=i.id}await Ue()}catch(o){console.warn(o)}finally{O.saving=!1,O.saveQueued&&(O.saveQueued=!1,vt().catch(()=>{}))}}async function po(a){if(await Z({title:e("chat.deleteConversation"),message:e("chat.deleteConfirm"),variant:"danger",confirmText:e("chat.deleteConversation")}))try{await I(`/conversations/${a}`,{method:"DELETE"}),O.conversationId===a&&(O.conversationId=null,te=[],ie=[],is(),He(),Qe(),je(),tt()),O.historyItems.length<=1&&O.historyPage>0&&(O.historyPage-=1),await Ue()}catch(s){Q(s.message||e("common.requestFailed"))}}function fo(a=!0){be&&be.abort(),te=[],ie=[],O.conversationId=null,is(),a||(D.systemPrompt="",D.systemOpen=!1),He(),Qe(),Oe(),je(),tt()}function wt(){return c.key}function wa(){const s=document.getElementById("chat-key-select")?.value||D.keyId||"";return s&&s!=="session"?s:c.me?.id||""}function me(){const a=document.getElementById("chat-key-select"),s=document.getElementById("chat-model"),o=document.getElementById("chat-reasoning"),i=document.getElementById("chat-system");a&&(D.keyId=a.value==="session"?"":a.value),s&&(D.model=s.value),o&&(D.reasoning=o.checked);const n=document.getElementById("chat-effort");n&&(D.effort=n.value||"");const d=document.getElementById("chat-resume");d&&(D.resumeId=d.value.trim());const l=document.getElementById("chat-fork");l&&(D.forkSession=l.checked);const u=document.getElementById("chat-memory");u&&(D.memory=u.checked);const m=document.getElementById("chat-no-plan");m&&(D.noPlan=m.checked);const p=document.getElementById("chat-perm");p&&(D.permissionMode=p.value||""),i&&(D.systemPrompt=i.value),Rt()}function Rt(){const a=document.querySelector(".chat-shell"),s=document.getElementById("chat-settings-toggle"),o=document.getElementById("chat-settings-summary"),i=document.getElementById("chat-settings-toggle-label");if(a&&a.classList.toggle("is-settings-open",!!D.settingsOpen),s&&s.setAttribute("aria-expanded",D.settingsOpen?"true":"false"),i&&(i.textContent=D.settingsOpen?e("chat.settingsHide"):e("chat.settings")),o){const n=D.model||"—",d=_.mode==="summary"?"chat.ctxModeSummary":_.mode==="recent"?"chat.ctxModeRecent":"chat.ctxModeFull";o.textContent=`${n} · ${e(d)}`}}function Qe(){const a=document.getElementById("chat-pending");if(a){if(!ie.length){a.innerHTML="",a.hidden=!0;return}a.hidden=!1,a.innerHTML=ie.map((s,o)=>`
      <div class="chat-pending-item" title="${t(s.name)}">
        <span class="name">${t(s.name)}</span>
        <span class="muted">${Te(s.size)}</span>
        <button type="button" class="rm" data-rm-doc="${o}" aria-label="${t(e("chat.removeFile"))}">×</button>
      </div>`).join(""),a.querySelectorAll("[data-rm-doc]").forEach(s=>{s.onclick=()=>{const o=Number(s.getAttribute("data-rm-doc"));ie.splice(o,1),Qe()}})}}function go(a,s){return`${a}:${(s||"").length}:${(s||"").slice(0,40)}`}function He(){const a=document.getElementById("chat-messages");if(!a)return;const s=a.scrollHeight-a.scrollTop-a.clientHeight<120,o=te.some(r=>r.streaming),i=document.getElementById("chat-stream-status");if(i&&(i.hidden=!o,i.textContent=o?e("chat.streaming"):""),!te.length){a.innerHTML=`
      <div class="chat-empty">
        <strong>${t(e("chat.emptyTitle"))}</strong>
        <p>${t(e("chat.emptyHint"))}</p>
      </div>`,lt();return}const n=te.length,d=Math.max(0,n-ns);Ne>d&&(Ne=d);const l=Ne,u=te.slice(l),m=l,p=m>0?`<div class="chat-load-older">
          <button type="button" class="btn secondary sm" id="chat-load-older">${t(A("chat.loadOlder",{n:m}))}</button>
        </div>`:"";a.innerHTML=p+u.map((r,k)=>{const b=l+k,f=r.role==="user"?"user":"assistant",h=r.role==="user"?e("chat.you"):e("chat.assistant"),$=r.docs&&r.docs.length?`<div class="chat-attach-list">${r.docs.map(C=>`<span class="chat-attach-chip" title="${t(C.name)}"><span>📎 ${t(C.name)}</span></span>`).join("")}</div>`:"",L=!!r.reasoning?`<details class="chat-reasoning" ${r.streaming||!r.content?"open":""}>
            <summary>${t(e("chat.reasoning"))}${r.streaming&&!r.content?` · ${t(e("chat.streaming"))}`:""}</summary>
            <pre>${t(r.reasoning)}</pre>
          </details>`:"";let R=r.content||"";!R&&r.streaming&&(R=r.reasoning?"":"…");const x=r.error?" error":"",G=r.streaming?" is-streaming":"",M=f==="assistant"&&!r.streaming&&!!R;let w;if(M){const C=go(b,R);if(Re.has(C))w=Re.get(C);else if(w=Ua(R),Re.set(C,w),Re.size>200){const K=Re.keys().next().value;Re.delete(K)}}else w=t(R);const N=!r.streaming&&R.length>eo,q=`${M?"chat-content md":"chat-content"}${N?" is-collapsible":""}`,g=N?`<button type="button" class="btn ghost sm chat-expand-btn" data-expand="${b}">${t(e("chat.showMore"))}</button>`:"",v=yo(r),j=v?`<div class="muted chat-spend">${t(v)}</div>`:"",S=Array.isArray(r.tools)&&r.tools.length?`<div class="chat-tools">${r.tools.map(C=>`<span class="chat-tool-chip" title="${t(C.arguments||"")}">${t(C.name||"tool")}</span>`).join("")}</div>`:"",P=R?`<button type="button" class="chat-copy-btn" data-copy-msg="${b}" title="${t(e("chat.copy"))}">${t(e("chat.copy"))}</button>`:"";return`<div class="chat-bubble ${f}${x}${G}" data-msg-idx="${b}">
        <div class="chat-bubble-head">
          <div class="chat-role">${t(h)}${r.streaming?` <span class="chat-live">${t(e("chat.streaming"))}</span>`:""}</div>
          ${P}
        </div>
        ${$}
        ${L}
        ${S}
        <div class="${q}" data-content-idx="${b}">${w}${r.streaming?'<span class="chat-cursor">▍</span>':""}</div>
        ${g}
        ${j}
      </div>`}).join(""),(s||o)&&(a.scrollTop=a.scrollHeight),lt(),document.getElementById("chat-load-older")?.addEventListener("click",()=>{const r=a.scrollHeight;Ne=Math.max(0,Ne-Zs),He();const k=document.getElementById("chat-messages");k&&(k.scrollTop=k.scrollHeight-r)}),a.querySelectorAll("[data-expand]").forEach(r=>{r.addEventListener("click",()=>{const k=a.querySelector(`[data-content-idx="${r.getAttribute("data-expand")}"]`);k&&(k.classList.toggle("is-expanded"),r.textContent=k.classList.contains("is-expanded")?e("chat.showLess"):e("chat.showMore"))})}),a.querySelectorAll("[data-copy-msg]").forEach(r=>{r.addEventListener("click",async k=>{k.preventDefault(),k.stopPropagation();const b=Number(r.getAttribute("data-copy-msg")),f=te[b];if(!f?.content)return;if(await jt(f.content)){const $=r.textContent;r.textContent=e("chat.copied"),r.classList.add("is-copied"),setTimeout(()=>{r.isConnected&&(r.textContent=$||e("chat.copy"),r.classList.remove("is-copied"))},1600)}else Q(e("chat.copyFail"))})})}function Yt(a){const o=a.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),i=o.pop()||"",n=[];for(const d of o){const l=d.trim();if(!l||l.startsWith(":")||!l.startsWith("data:"))continue;const u=l.slice(5).trim();u&&n.push(u)}return{events:n,rest:i}}function yo(a){if(!a||a.streaming)return"";const s=[],o=a.usage;if(o&&(o.prompt_tokens||o.completion_tokens||o.total_tokens)){const n=o.prompt_tokens_details?.cached_tokens,d=n!=null?` · ${e("chat.cacheTokens")}: ${n}`:"";s.push(`${e("chat.tokens")}: ${o.prompt_tokens||0}+${o.completion_tokens||0}=${o.total_tokens||0}${d}`)}const i=a.grok?.cost?.total_cost_usd;return typeof i=="number"&&s.push(`${e("chat.cost")}: $${i.toFixed(6)}`),a.grok?.sessionId&&s.push(`${e("chat.resume")}: ${a.grok.sessionId}`),s.join(" · ")}function It(a,s){if(!s||typeof s!="object")return!1;if(s.error){const l=ua({error:s.error});return a.error=!0,a.content=(a.content||"")+`
✗ ${l}`,!0}const o=s.choices?.[0]?.delta||{};let i=!1;if(o.reasoning_content&&(a.reasoning=(a.reasoning||"")+o.reasoning_content,i=!0),(o.thought&&!o.reasoning_content||o.thought&&o.reasoning_content&&o.thought!==o.reasoning_content)&&(a.reasoning=(a.reasoning||"")+o.thought,i=!0),typeof o.content=="string"&&o.content.length&&(a.content=(a.content||"")+o.content,i=!0),s.usage&&typeof s.usage=="object"&&(a.usage=s.usage,i=!0),s.grok&&typeof s.grok=="object"){if(a.grok={...a.grok||{},...s.grok},a.grok.sessionId){D.resumeId=a.grok.sessionId;const l=document.getElementById("chat-resume");l&&(l.value=a.grok.sessionId)}i=!0}if(s.grok_event&&typeof s.grok_event=="object"){const l=s.grok_event;if(Array.isArray(a.tools)||(a.tools=[]),l.type==="tool_call"||l.type==="tool_call_update"){const u=l.toolCallId,m=u?a.tools.find(b=>b.id===u):null,p=l.toolName||l.title||m?.name||"tool",r=l.rawInput!=null?typeof l.rawInput=="string"?l.rawInput:JSON.stringify(l.rawInput):m?.arguments||"",k=l.status?`${p} (${l.status})`:p;m?(m.name=k,r&&(m.arguments=r)):a.tools.push({id:u,name:k,arguments:r}),i=!0}}const n=s.choices?.[0]?.delta?.tool_calls;if(Array.isArray(n)&&n.length){Array.isArray(a.tools)||(a.tools=[]);for(const l of n){const u=l?.function?.name||l?.name||"tool",m=l?.function?.arguments||"";a.tools.push({id:l?.id,name:u,arguments:typeof m=="string"?m:JSON.stringify(m||{})})}i=!0}const d=s.choices?.[0]?.message;return d&&(d.content&&!a.content&&(a.content=d.content,i=!0),d.reasoning_content&&!a.reasoning&&(a.reasoning=d.reasoning_content,i=!0)),i}function bo(a,s){const o=wt();return o?new Promise((i,n)=>{const d=new FormData;d.append("file",a,a.name);const l=St();l&&d.append("apiKeyId",l);const u=new XMLHttpRequest;u.open("POST","/admin/api/documents"),u.setRequestHeader("Authorization",`Bearer ${o}`),u.upload.onprogress=m=>{if(s)if(m.lengthComputable&&m.total>0){const p=Math.min(100,Math.round(m.loaded/m.total*100));s({loaded:m.loaded,total:m.total,percent:p})}else s({loaded:m.loaded||0,total:0,percent:-1})},u.onload=()=>{let m=null;try{m=u.responseText?JSON.parse(u.responseText):null}catch{m=null}if(u.status<200||u.status>=300){const k=m?.error?.message||m?.message||u.responseText||u.statusText;n(new Error(k||e("chat.uploadFail")));return}const p=m?.data||m,r=p?.id;if(!r||typeof r!="string"){n(new Error(e("chat.uploadFail")));return}i({id:r,name:p.originalName||p.filename||a.name,mime:p.mimeType||a.type||"",size:p.sizeBytes??p.size??a.size??0})},u.onerror=()=>n(new Error(e("chat.uploadFail"))),u.onabort=()=>n(new Error(e("chat.uploadFail"))),u.send(d)}):Promise.reject(new Error(e("chat.needKey")))}function Mt(a){const s=document.getElementById("chat-upload-progress");if(!s)return;const{visible:o,fileName:i,fileIndex:n,fileTotal:d,percent:l,indeterminate:u}=a;if(!o){s.hidden=!0,s.setAttribute("aria-hidden","true");return}s.hidden=!1,s.setAttribute("aria-hidden","false");const m=document.getElementById("chat-upload-label"),p=document.getElementById("chat-upload-bar"),r=document.getElementById("chat-upload-pct"),k=i||"",b=n||1,f=d||1;m&&(m.textContent=f>1?A("chat.uploadProgressMulti",{name:k,i:b,n:f}):A("chat.uploadProgress",{name:k}));const h=!!u||l<0;p&&(p.classList.toggle("is-indeterminate",h),h?p.style.width="40%":p.style.width=`${Math.max(0,Math.min(100,l))}%`),r&&(r.textContent=h?e("chat.uploading"):A("common.percent",{n:Math.max(0,Math.min(100,l))}))}function ho(a){const s=Array.isArray(a)?a:[];if(!s.length)return{added:0,skipped:0};let o=0,i=0;const n=new Set(ie.map(d=>d.id));for(const d of s){if(ie.length>=Ht){i+=s.length-o-i;break}const l=d?.id,u=d?.name||d?.originalName||"";if(!l||!Sa.test(String(l))){i+=1;continue}if(!Ot(u)){i+=1;continue}if(n.has(l)){i+=1;continue}ie.push({id:l,name:u||l,mime:d.mime||d.mimeType||"",size:d.size??d.sizeBytes??0}),n.add(l),o+=1}return Qe(),{added:o,skipped:i}}async function vo(){if(!wt()){Q(e("chat.needKey"));return}const a=St(),s=Math.max(0,Ht-ie.length);if(s<=0){Q(e("chat.tooManyFiles"));return}const o=new Map;let i=0;rt({title:e("chat.libraryTitle"),subtitle:t(e("chat.librarySubtitle")),size:"md",bodyHtml:`
      <div class="chat-lib">
        <div class="chat-lib-toolbar">
          <input type="search" id="chat-lib-q" class="chat-lib-search" placeholder="${t(e("chat.librarySearch"))}" autocomplete="off" />
          <span class="muted chat-lib-count" id="chat-lib-count">${t(A("chat.librarySelected",{n:0}))}</span>
        </div>
        <div class="muted chat-lib-formats">${t(e("chat.formatsLabel"))}: ${t(_t())}</div>
        <div id="chat-lib-list" class="chat-lib-list" role="listbox" aria-multiselectable="true">
          <div class="muted chat-lib-status">${t(e("common.loading")||"…")}</div>
        </div>
      </div>`,footerHtml:`
      <button type="button" class="btn secondary sm" id="chat-lib-cancel">${t(e("common.cancel"))}</button>
      <button type="button" class="btn sm" id="chat-lib-add" disabled>${t(e("chat.libraryAdd"))}</button>`});const n=document.getElementById("chat-lib-list"),d=document.getElementById("chat-lib-q"),l=document.getElementById("chat-lib-count"),u=document.getElementById("chat-lib-add");document.getElementById("chat-lib-cancel")?.addEventListener("click",()=>ye());const m=()=>{l&&(l.textContent=A("chat.librarySelected",{n:o.size})),u&&(u.disabled=o.size===0,u.textContent=o.size>0?`${e("chat.libraryAdd")} (${o.size})`:e("chat.libraryAdd"))},p=b=>{if(!n)return;const f=new Set(ie.map($=>$.id)),h=(b||[]).filter($=>Ot($.originalName));if(!h.length){n.innerHTML=`<div class="data-empty chat-lib-empty"><strong>${t(e("chat.libraryEmpty"))}</strong></div>`;return}n.innerHTML=h.map($=>{const B=f.has($.id),L=o.has($.id),R=B&&!L;return`
          <label class="chat-lib-row ${B?"is-already":""} ${L?"is-selected":""}" data-id="${t($.id)}">
            <input type="checkbox" data-lib-id="${t($.id)}" ${L?"checked":""} ${R?"disabled":""} />
            <span class="chat-lib-meta">
              <span class="chat-lib-name" title="${t($.originalName)}">${t($.originalName)}</span>
              <span class="muted">${t($.mimeType||"")} · ${Te($.sizeBytes||0)}${B?` · ${t(e("chat.libraryAlready"))}`:""}</span>
            </span>
          </label>`}).join(""),n.querySelectorAll("input[data-lib-id]").forEach($=>{$.addEventListener("change",()=>{const B=$.getAttribute("data-lib-id"),L=h.find(x=>x.id===B);if(!L)return;if($.checked){if(o.size>=s&&!o.has(B)){$.checked=!1,Q(e("chat.tooManyFiles"));return}o.set(B,L)}else o.delete(B);const R=$.closest(".chat-lib-row");R&&R.classList.toggle("is-selected",$.checked),m()})})},r=async()=>{const b=++i;n&&(n.innerHTML=`<div class="muted chat-lib-status">${t(e("common.loading")||"…")}</div>`);try{const f=new URLSearchParams({limit:"50",offset:"0"});a&&f.set("apiKeyId",a);const h=(d?.value||"").trim();h&&f.set("q",h);const $=await I(`/documents?${f}`);if(b!==i)return;p($.data||[])}catch(f){if(b!==i)return;n&&(n.innerHTML=`<div class="error-box">${t(f.message||e("chat.libraryLoadFail"))}</div>`)}};let k=null;d?.addEventListener("input",()=>{k&&clearTimeout(k),k=setTimeout(()=>r(),280)}),u?.addEventListener("click",()=>{const b=[...o.values()],{added:f}=ho(b.map(h=>({id:h.id,name:h.originalName,mime:h.mimeType,size:h.sizeBytes})));ye(),f>0&&Q("")}),m(),await r(),d?.focus()}async function cs(a){const s=[...a||[]];if(!s.length)return;if(!wt()){Q(e("chat.needKey"));return}const o=s.filter(u=>!Ot(u.name)),i=s.filter(u=>Ot(u.name));if(o.length&&(Q(A("chat.formatsReject",{name:o.map(u=>u.name).join(", "),formats:_t()})),!i.length))return;if(ie.length+i.length>Ht){Q(e("chat.tooManyFiles"));return}const n=document.getElementById("chat-attach"),d=document.getElementById("chat-send");n&&(n.disabled=!0,n.textContent=e("chat.uploading")),d&&(d.disabled=!0);const l=i.length;try{let u=0;for(const m of i){if(ie.length>=Ht)break;u+=1,Mt({visible:!0,fileName:m.name,fileIndex:u,fileTotal:l,percent:0,indeterminate:!1});const p=await bo(m,({percent:r})=>{Mt({visible:!0,fileName:m.name,fileIndex:u,fileTotal:l,percent:r<0?0:r,indeterminate:r<0})});Mt({visible:!0,fileName:m.name,fileIndex:u,fileTotal:l,percent:100,indeterminate:!1}),ie.some(r=>r.id===p.id)||ie.push(p),Qe()}o.length||Q("")}catch(u){Q(u.message||e("chat.uploadFail"))}finally{Mt({visible:!1}),n&&(n.disabled=!1,n.textContent=e("chat.attach")),d&&(d.disabled=!1)}}function $o(){const a=c.me?.id||"",s=c.me?`${e("chat.useSessionKey")} · ${c.me.name||""} (${c.me.keyPrefix||""}…)`:e("chat.useSessionKey"),o=D.keyId||"session",i=(c.keys||[]).filter(d=>d.isActive!==!1),n=[`<option value="session" ${o==="session"||o===a||!o?"selected":""}>${t(s)}</option>`];for(const d of i){if(a&&d.id===a)continue;const l=`${d.name||"key"} · ${d.keyPrefix||""}… · ${d.role||""}/${d.mode||""}`;n.push(`<option value="${t(d.id)}" ${o===d.id?"selected":""}>${t(l)}</option>`)}return n.join("")}function ko(a,s,o){const i=new Set,n=[],d=l=>{const u=String(l||"").trim();!u||i.has(u)||(i.add(u),n.push(u))};for(const l of s||[])d(l.id||l);for(const l of o||[])d(l.id||l);for(const l of a||[])l!=="echo"&&d(l);return d("echo"),n}async function So(){const[,,a]=await Promise.all([ht(!1),kt(),I("/catalog").catch(()=>({loaded:[],local:[]}))]),s=ko(c.models||[],a.loaded||[],a.local||[]);c.models=s;const o=a.loaded&&a.loaded[0]&&a.loaded[0].id||s.find(r=>r!=="echo")||"echo";(!D.model||D.model==="echo"||!s.includes(D.model))&&(D.model=o);const i=s.map(r=>`<option value="${t(r)}" ${D.model===r?"selected":""}>${t(r)}</option>`).join("");da(!1),document.getElementById("app").innerHTML=le(`
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
        <div class="chat-shell${D.settingsOpen?" is-settings-open":""}">
          <div class="chat-settings-bar">
            <button type="button" class="chat-settings-toggle" id="chat-settings-toggle" aria-expanded="${D.settingsOpen?"true":"false"}" aria-controls="chat-toolbar">
              <span class="chat-settings-summary" id="chat-settings-summary"></span>
              <span class="chat-settings-caret" id="chat-settings-toggle-label">${t(D.settingsOpen?e("chat.settingsHide"):e("chat.settings"))}</span>
            </button>
          </div>
          <div class="chat-toolbar" id="chat-toolbar">
            <label class="chat-field-full">${t(e("chat.keySelect"))}
              <select id="chat-key-select">${$o()}</select>
            </label>
            <label>${t(e("chats.model"))}
              <select id="chat-model">${i||'<option value="echo">echo</option>'}</select>
            </label>
            <label class="check-inline" for="chat-reasoning">
              <input type="checkbox" id="chat-reasoning" ${D.reasoning!==!1?"checked":""} />
              ${t(e("chat.includeReasoning"))}
            </label>
            <label class="chat-ctx-label">${t(e("chat.effort"))}
              <select id="chat-effort">
                ${["","none","minimal","low","medium","high","xhigh","max"].map(r=>{const k=e(r?`chat.effort_${r}`:"chat.effortDefault"),b=(D.effort||"")===r?" selected":"";return`<option value="${t(r)}"${b}>${t(k)}</option>`}).join("")}
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
              ${t(e("chat.systemPrompt"))}${D.systemPrompt?" ·":""}
            </button>
            <label class="chat-ctx-label chat-field-full" title="${t(e("chat.resumeHint"))}">${t(e("chat.resume"))}
              <input type="text" id="chat-resume" value="${t(D.resumeId||"")}" placeholder="${t(e("chat.resumePh"))}" spellcheck="false" />
            </label>
            <div class="chat-checks">
            <label class="check-inline" for="chat-fork">
              <input type="checkbox" id="chat-fork" ${D.forkSession?"checked":""} />
              ${t(e("chat.fork"))}
            </label>
            <label class="check-inline" for="chat-memory">
              <input type="checkbox" id="chat-memory" ${D.memory?"checked":""} />
              ${t(e("chat.memory"))}
            </label>
            <label class="check-inline" for="chat-no-plan">
              <input type="checkbox" id="chat-no-plan" ${D.noPlan?"checked":""} />
              ${t(e("chat.noPlan"))}
            </label>
            </div>
            <label class="chat-ctx-label chat-field-full">${t(e("chat.permission"))}
              <select id="chat-perm">
                ${["","default","acceptEdits","auto","dontAsk","bypassPermissions","plan"].map(r=>{const k=r||e("chat.effortDefault"),b=(D.permissionMode||"")===r?" selected":"";return`<option value="${t(r)}"${b}>${t(k)}</option>`}).join("")}
              </select>
            </label>
          </div>
          <div class="chat-system-wrap" id="chat-system-wrap" ${D.systemOpen||D.systemPrompt?"":"hidden"}>
            <label class="chat-system-label" for="chat-system">${t(e("chat.systemPrompt"))}
              <span class="hint">${t(e("chat.systemHint"))}</span>
            </label>
            <textarea id="chat-system" rows="3" placeholder="${t(e("chat.systemPlaceholder"))}">${t(D.systemPrompt||"")}</textarea>
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
                <input type="file" id="chat-file" class="chat-file-input" multiple accept="${t(vs)}" />
                <button type="button" class="btn secondary sm" id="chat-attach" title="${t(e("chat.attachHint"))}">${t(e("chat.attach"))}</button>
                <button type="button" class="btn secondary sm" id="chat-attach-lib" title="${t(e("chat.libraryTitle"))}">${t(e("chat.attachLibrary"))}</button>
                <span class="chat-formats-hint" title="${t(_t())}">
                  <span class="chat-formats-label">${t(e("chat.formatsLabel"))}</span>
                  <span class="muted">${t(_t())}</span>
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
  `),de(),He(),Qe(),Oe(),lt(),je(),tt(),Rt(),Ue().catch(()=>{}),document.getElementById("chat-settings-toggle")?.addEventListener("click",()=>{D.settingsOpen=!D.settingsOpen,Rt()}),document.getElementById("chat-key-select").onchange=()=>me();const n=document.getElementById("chat-ctx-mode"),d=document.getElementById("chat-ctx-n");n&&(n.onchange=()=>{const r=n.value;if(r==="summary"&&!_.summary){Q(e("chat.compressNeedSummary")),n.value=_.mode==="recent"?"recent":"full";return}_.mode=r==="summary"||r==="recent"?r:"full",je(),tt(),vt().catch(()=>{})}),d&&(d.onchange=()=>{_.recentN=Math.min(40,Math.max(2,Number(d.value)||6)),je(),vt().catch(()=>{})}),document.getElementById("chat-model").onchange=()=>me(),document.getElementById("chat-reasoning").onchange=()=>me(),document.getElementById("chat-effort")?.addEventListener("change",()=>me()),document.getElementById("chat-resume")?.addEventListener("change",()=>me()),document.getElementById("chat-fork")?.addEventListener("change",()=>me()),document.getElementById("chat-memory")?.addEventListener("change",()=>me()),document.getElementById("chat-no-plan")?.addEventListener("change",()=>me()),document.getElementById("chat-perm")?.addEventListener("change",()=>me()),document.getElementById("chat-system").oninput=()=>me(),document.getElementById("chat-system-toggle").onclick=()=>{me(),D.systemOpen=!D.systemOpen;const r=document.getElementById("chat-system-wrap");r&&(r.hidden=!D.systemOpen&&!D.systemPrompt.trim()),D.systemOpen&&document.getElementById("chat-system")?.focus()},document.getElementById("chat-new").onclick=()=>{fo(!0)},document.getElementById("chat-compress").onclick=()=>{uo().catch(()=>{})},document.getElementById("chat-stop").onclick=()=>{be&&be.abort()},document.getElementById("chat-send").onclick=()=>Da(),document.getElementById("chat-attach").onclick=()=>{document.getElementById("chat-file")?.click()},document.getElementById("chat-attach-lib")?.addEventListener("click",()=>{vo().catch(r=>Q(r.message||e("chat.libraryLoadFail")))}),document.getElementById("chat-file").onchange=r=>{const k=r.target;cs(k.files).finally(()=>{k.value=""})};const l=document.getElementById("chat-history-toggle"),u=document.getElementById("chat-history-backdrop"),m=document.getElementById("chat-history-close-mobile");l&&(l.onclick=()=>{da(!O.historyOpenMobile)}),u&&(u.onclick=()=>ra()),m&&(m.onclick=()=>ra());const p=document.getElementById("chat-history-search");p&&(p.oninput=()=>{O.historyQ=p.value,Jt&&clearTimeout(Jt),Jt=setTimeout(()=>{O.historyPage=0,Ue()},280)}),wo(),document.getElementById("chat-input").onkeydown=r=>{r.key==="Enter"&&!r.shiftKey&&(r.preventDefault(),Da())}}function wo(){const a=document.getElementById("chat-page"),s=document.getElementById("chat-drop-overlay"),o=document.getElementById("chat-composer");if(!a)return;let i=0;const n=b=>{const f=b.dataTransfer?.types;return f?typeof f.includes=="function"?f.includes("Files"):[...f].includes("Files"):!1},d=b=>{a.classList.toggle("is-file-drag",b),o&&o.classList.toggle("is-dragover",b),s&&(s.hidden=!b,s.setAttribute("aria-hidden",b?"false":"true"))},l=b=>{n(b)&&(b.preventDefault(),b.stopPropagation(),i+=1,d(!0))},u=b=>{n(b)&&(b.preventDefault(),b.stopPropagation(),b.dataTransfer&&(b.dataTransfer.dropEffect="copy"),d(!0))},m=b=>{n(b)&&(b.preventDefault(),b.stopPropagation(),i=Math.max(0,i-1),i===0&&d(!1))},p=b=>{if(!n(b))return;b.preventDefault(),b.stopPropagation(),i=0,d(!1);const f=b.dataTransfer?.files;f?.length&&cs(f).catch(h=>Q(h.message||e("chat.uploadFail")))};a.addEventListener("dragenter",l),a.addEventListener("dragover",u),a.addEventListener("dragleave",m),a.addEventListener("drop",p);const r=b=>{c.page==="chat"&&n(b)&&b.preventDefault()},k=b=>{c.page==="chat"&&n(b)&&b.preventDefault()};window.addEventListener("dragover",r),window.addEventListener("drop",k),a._chatDropCleanup=()=>{window.removeEventListener("dragover",r),window.removeEventListener("drop",k)}}function Po(a){const s=new Set,o=[],i=n=>{if(!n||typeof n!="string")return;const d=n.trim();!Sa.test(d)||s.has(d)||(s.add(d),o.push(d))};for(const n of a||[])i(n?.id);for(const n of te)if(n?.docs?.length)for(const d of n.docs)i(d?.id);return o}async function Da(){me();const a=document.getElementById("chat-input");let s=a?.value.trim()||"";const o=[...ie];if(!s&&!o.length){Q(e("chat.needContent"));return}const i=wt();if(!i){Q(e("chat.needKey"));return}if(!s&&o.length&&(s=e("chat.fileOnlyPrompt")),o.filter(L=>!L?.id||!Sa.test(String(L.id))).length){Q(e("chat.uploadFail"));return}const d=document.getElementById("chat-model")?.value||D.model||"echo",l=document.getElementById("chat-reasoning")?.checked!==!1,u=document.getElementById("chat-effort")?.value||D.effort||"";wa();const m=o.map(L=>({id:L.id,name:L.name})),p=Po(o);te.push({role:"user",content:s,docs:m.length?m:void 0}),a&&(a.value=""),ie=[],Qe();const r={role:"assistant",content:"",reasoning:"",streaming:!0};te.push(r),Ne=Math.max(0,te.length-ns),He();const b=io(),f=document.getElementById("chat-send"),h=document.getElementById("chat-stop"),$=document.getElementById("chat-attach"),B=document.getElementById("chat-attach-lib");f&&(f.disabled=!0),$&&($.disabled=!0),B&&(B.disabled=!0),h&&(h.disabled=!1),be=new AbortController;try{const L={model:d,stream:!0,include_reasoning:l,messages:b};u&&(L.reasoning_effort=u),me(),D.resumeId&&(L.resume=D.resumeId),D.forkSession&&(L.fork_session=!0),D.memory&&(L.experimental_memory=!0),D.noPlan&&(L.no_plan=!0),D.permissionMode&&(L.permission_mode=D.permissionMode),p.length&&(L.document_ids=p);const R=St();R&&(L.apiKeyId=R);const x=await fetch("/admin/api/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${i}`,"Content-Type":"application/json"},body:JSON.stringify(L),signal:be.signal});if(!x.ok){const G=await x.text();let M=G;try{M=JSON.parse(G).error?.message||G}catch{}throw new Error(M||x.statusText)}if(x.body&&typeof x.body.getReader=="function"){const G=x.body.getReader(),M=new TextDecoder;let w="",N=0;const q=(g=!1)=>{const v=performance.now();(g||v-N>40)&&(N=v,He())};for(;;){const{done:g,value:v}=await G.read();if(g)break;w+=M.decode(v,{stream:!0});const{events:j,rest:S}=Yt(w);w=S;let P=!1;for(const C of j)if(C!=="[DONE]")try{const K=JSON.parse(C);It(r,K)&&(P=!0)}catch{}P&&q(!1)}if(w.trim()){const{events:g}=Yt(w+`
`);for(const v of g)if(v!=="[DONE]")try{It(r,JSON.parse(v))}catch{}}q(!0)}else{const G=await x.text(),{events:M}=Yt(G+`
`);for(const w of M)if(w!=="[DONE]")try{It(r,JSON.parse(w))}catch{try{const N=JSON.parse(G);It(r,N)}catch{}}He()}!r.content&&!r.reasoning&&(r.content=e("chat.emptyReply")),Q("")}catch(L){L.name==="AbortError"?r.content=(r.content||"")+`
[${e("chat.stopped")}]`:(r.error=!0,r.content=(r.content||"")+`
✗ ${L.message||L}`,Q(L.message||String(L)))}finally{r.streaming=!1,be=null,He(),lt(),f&&(f.disabled=!1),$&&($.disabled=!1),B&&(B.disabled=!1),h&&(h.disabled=!0),vt().catch(()=>{})}}const Zt="email@ysk.hk",Eo="https://github.com/sponsors/yanshekki",Io="https://linktr.ee/yanshekki",Mo="https://ysk.hk/",xo="https://github.com/yanshekki/ysk-omni#readme";async function qo(){const s=[[e("support.netEvm"),"yanshekki.eth"],[e("support.netNear"),"yanshekki.near"],[e("support.netAda"),"$yanshekki"]].map(([o,i])=>`
      <tr>
        <td>${t(o)}</td>
        <td><code class="cell-code">${t(i)}</code></td>
        <td class="row-actions"><button type="button" class="btn secondary sm" data-copy="${t(i)}">${t(e("support.copy"))}</button></td>
      </tr>`).join("");document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("support.title"))}</h2>
    </div>
    ${ve([e("support.subtitle")])}
    <div class="support-pills" role="navigation">
      <button type="button" class="seg-tab is-active" data-jump="support-creator">${t(e("support.pillSupport"))}</button>
      <button type="button" class="seg-tab" data-jump="support-sponsor">${t(e("support.pillSponsor"))}</button>
      <a class="seg-tab" href="mailto:${Zt}">${t(e("support.pillHelp"))}</a>
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
            <a class="btn" href="${Eo}" target="_blank" rel="noopener noreferrer">${t(e("support.githubSponsors"))}</a>
            <a class="btn secondary" href="${Io}" target="_blank" rel="noopener noreferrer">${t(e("support.linktree"))}</a>
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
          <a class="btn secondary sm" href="${Mo}" target="_blank" rel="noopener noreferrer">${t(e("support.site"))}</a>
        </div>
      </section>
      <section class="panel support-panel" id="support-help">
        <div class="panel-h"><strong>${t(e("support.helpTitle"))}</strong></div>
        <div class="panel-pad">
          <p class="support-prose">${t(e("support.helpBody"))}</p>
          <a class="btn support-email-btn" href="mailto:${Zt}">${Zt}</a>
          <p class="support-docs"><a href="${xo}" target="_blank" rel="noopener noreferrer">${t(e("support.docs"))}</a></p>
        </div>
      </section>
    </div>
  `),de(),document.querySelectorAll("[data-jump]").forEach(o=>{o.addEventListener("click",()=>{const i=o.getAttribute("data-jump");i&&document.getElementById(i)?.scrollIntoView({behavior:"smooth",block:"start"})})}),document.querySelectorAll("[data-copy]").forEach(o=>{o.addEventListener("click",async()=>{const i=o.getAttribute("data-copy")||"",n=await jt(i);o.textContent=e(n?"chat.copied":"support.copy"),setTimeout(()=>{o.textContent=e("support.copy")},1400)})})}const To=[{id:"Qwen/Qwen2.5-0.5B-Instruct-GGUF",modality:"text",runtime:"llamacpp",quants:["Q4_K_M","Q5_K_M","Q8_0"],vramMb:512},{id:"Qwen/Qwen2.5-7B-Instruct",modality:"text",runtime:"vllm",quants:[],vramMb:16e3},{id:"Tongyi-MAI/Z-Image-Turbo",label:"Z-Image-Turbo",modality:"image",runtime:"diffusion",quants:[],vramMb:8e3},{id:"black-forest-labs/FLUX.2-klein-4B",label:"FLUX.2 Klein 4B",modality:"image",runtime:"diffusion",quants:[],vramMb:8e3},{id:"Qwen/Qwen3-TTS",modality:"tts",runtime:"diffusion",quants:[],vramMb:4e3},{id:"Systran/faster-whisper-small",modality:"stt",runtime:"whisper",quants:[],vramMb:1e3},{id:"Lightricks/LTX-2.5",label:"LTX-2.5",modality:"video",runtime:"diffusion",quants:[],vramMb:12e3},{id:"Wan-AI/Wan2.2",label:"Wan 2.2",modality:"video",runtime:"diffusion",quants:[],vramMb:2e4}];function ea(a){return a.label||String(a.id||"").split("/").pop()||a.id||""}function Ha(a,s){const o=String(a.id||"");return(s||[]).filter(i=>i.id===o||i.repoId===o||String(i.id||"").startsWith(`${o}:`))}function xt(a){const s=`catalog.mod.${a}`;return Ie(s)?e(s):a||"—"}function Ao(a){const s=a||[];return s.includes("Q4_K_M")?"Q4_K_M":s[0]||""}function Bo(a){const s=Number(a)||0;return s>=1e6?`${(s/1e6).toFixed(1)}M`:s>=1e3?`${(s/1e3).toFixed(1)}k`:String(s)}async function qt({append:a=!1}={}){if(!c.catalogHubBusy){c.catalogHubBusy=!0;try{const s=new URLSearchParams;c.catalogHubQ&&s.set("q",c.catalogHubQ),c.catalogModality&&s.set("modality",c.catalogModality),a&&c.catalogHubNext&&s.set("cursor",c.catalogHubNext);const o=await I(`/catalog/hub?${s}`),i=o.hits||[];c.catalogHubHits=a?[...c.catalogHubHits||[],...i]:i,c.catalogHubNext=o.nextCursor||""}catch(s){a||(c.catalogHubHits=[]),y(s)}finally{c.catalogHubBusy=!1,await De()}}}async function De(){let a={};try{a=await I("/catalog")}catch(S){y(S)}const s=a.packs&&a.packs.length?a.packs:To,o=a.local||[],i=a.loaded||[],n=new Set(i.map(S=>S.id)),d=a.usedMb??0,l=a.budgetMb??0,u=l?Math.min(100,Math.round(d/l*100)):0,m=c.catalogTab==="local"||c.catalogTab==="packs"||c.catalogTab==="hub"?c.catalogTab:"packs";c.catalogTab=m;const p=c.catalogModality||"",r=["text","image","video","tts","stt"],k=p?s.filter(S=>S.modality===p):s,b=c.catalogPulling||"",f=k.map(S=>{const P=Ha(S,o),C=S.quants||[],K=Ao(C),ne=C.length?`<select class="catalog-quant-select" data-quant-for="${t(S.id)}">${C.map(z=>`<option value="${t(z)}" ${z===K?"selected":""}>${t(z)}</option>`).join("")}</select>`:`<span class="muted">${t(e("catalog.noQuant"))}</span>`,ee=b===S.id,U=ee?e("catalog.pulling"):P.length?e("catalog.pullAgain"):e("catalog.pull");return`
      <tr>
        <td>
          <div class="cell-primary">${t(ea(S))}</div>
          <div class="cell-sub mono" title="${t(S.id)}">${t(S.id)}</div>
        </td>
        <td><span class="badge muted">${t(xt(S.modality))}</span></td>
        <td><span class="badge muted">${t(S.runtime||"—")}</span></td>
        <td>${ne}</td>
        <td class="catalog-vram-cell">${S.vramMb??0} MB</td>
        <td>${P.length?`<span class="badge success">${t(e("catalog.onDisk"))}</span>`:'<span class="muted">—</span>'}</td>
        <td>
          <div class="row-actions">
            <button type="button" class="btn ${P.length?"secondary":""} sm" data-pull="${t(S.id)}" ${ee?"disabled":""}>${t(U)}</button>
            <span class="muted" data-pull-status="${t(S.id)}"></span>
          </div>
        </td>
      </tr>`}).join(""),h=`
    <tr class="empty-row"><td colspan="7">
      <div class="data-empty">
        <div class="data-empty-icon">∅</div>
        <strong>${t(e("catalog.emptyPacks"))}</strong>
      </div>
    </td></tr>`,$=o.map(S=>{const P=n.has(S.id);return`
      <tr>
        <td>
          <div class="cell-primary mono">${t(S.id)}</div>
          <div class="cell-sub" title="${t(S.path||"")}">${t(S.path||"—")}</div>
        </td>
        <td class="catalog-vram-cell">${S.vramMb??0} MB</td>
        <td>${P?`<span class="badge success">${t(e("catalog.loaded"))}</span>`:`<span class="badge muted">${t(e("catalog.idle"))}</span>`}</td>
        <td>
          <div class="row-actions">
            <button type="button" class="btn sm" data-load="${t(S.id)}" data-vram="${S.vramMb??0}" ${P?"disabled":""}>${t(e("catalog.load"))}</button>
            <button type="button" class="btn secondary sm" data-unload="${t(S.id)}" ${P?"":"disabled"}>${t(e("catalog.unload"))}</button>
          </div>
        </td>
      </tr>`}).join(""),B=`
    <tr class="empty-row"><td colspan="4">
      <div class="data-empty">
        <div class="data-empty-icon">∅</div>
        <strong>${t(e("catalog.emptyLocal"))}</strong>
        <p class="muted">${t(e("catalog.emptyLocalHint"))}</p>
      </div>
    </td></tr>`,L=i.map(S=>ea({id:S.id})).join(", "),R=`
    <div class="grid catalog-kpi-grid media-kpi-grid">
      <div class="card">
        <div class="label">${t(e("catalog.kpiLoaded"))}</div>
        <div class="value value-sm">${i.length}</div>
        <div class="muted card-sub">${t(L||e("catalog.kpiLoadedNone"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("catalog.kpiVram"))}</div>
        <div class="value value-sm">${d}<span class="dash-kpi-den">/${l}</span></div>
        <div class="usage-bar ${u>80?"warn":""}"><span style="width:${u}%"></span></div>
        <div class="muted card-sub">${t(A("catalog.kpiVramSub",{used:d,budget:l}))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("catalog.kpiLocal"))}</div>
        <div class="value value-sm">${o.length}</div>
        <div class="muted card-sub">${t(e("catalog.kpiLocalSub"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("catalog.kpiPacks"))}</div>
        <div class="value value-sm">${s.length}</div>
        <div class="muted card-sub">${t(e("catalog.kpiPacksSub"))}</div>
      </div>
    </div>`,x=Ae({title:e("catalog.filterModality"),hint:e("catalog.intro"),meta:A("common.pagerTotal",{n:k.length}),searchHtml:"",gridHtml:`
      <label>${t(e("catalog.filterModality"))}
        <select id="cat-mod">
          <option value="">${t(e("catalog.filterAll"))}</option>
          ${r.map(S=>`<option value="${t(S)}" ${p===S?"selected":""}>${t(xt(S))}</option>`).join("")}
        </select>
      </label>`}),G=`
    <div class="panel data-table-panel">
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>${t(e("catalog.colName"))}</th>
            <th>${t(e("catalog.colModality"))}</th>
            <th>${t(e("catalog.colRuntime"))}</th>
            <th>${t(e("catalog.colQuant"))}</th>
            <th>${t(e("catalog.colVram"))}</th>
            <th>${t(e("catalog.colStatus"))}</th>
            <th>${t(e("common.actions"))}</th>
          </tr></thead>
          <tbody>${f||h}</tbody>
        </table>
      </div>
    </div>`,M=`
    <div class="panel data-table-panel">
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>${t(e("catalog.colName"))}</th>
            <th>${t(e("catalog.colVram"))}</th>
            <th>${t(e("catalog.colStatus"))}</th>
            <th>${t(e("common.actions"))}</th>
          </tr></thead>
          <tbody>${$||B}</tbody>
        </table>
      </div>
    </div>`,w=Array.isArray(c.catalogHubHits)?c.catalogHubHits:[],N=w.map(S=>{const P=Ha({id:S.id},o),C=b===S.id,K=S.supported?`<button type="button" class="btn ${P.length?"secondary":""} sm" data-pull="${t(S.id)}" ${C?"disabled":""}>${t(C?e("catalog.pulling"):P.length?e("catalog.pullAgain"):e("catalog.pull"))}</button>`:`<span class="muted">${t(e("catalog.unsupported"))}</span>`;return`
      <tr>
        <td>
          <div class="cell-primary">${t(ea(S))}</div>
          <div class="cell-sub mono">${t(S.id)}</div>
        </td>
        <td><span class="badge muted">${t(xt(S.modality))}</span></td>
        <td><span class="badge muted">${t(S.runtime||"—")}</span></td>
        <td>${t(Bo(S.downloads))}</td>
        <td>${P.length?`<span class="badge success">${t(e("catalog.onDisk"))}</span>`:S.supported?'<span class="muted">—</span>':`<span class="badge warn">${t(e("catalog.unsupported"))}</span>`}</td>
        <td>
          <div class="row-actions">
            ${K}
            <span class="muted" data-pull-status="${t(S.id)}"></span>
          </div>
        </td>
      </tr>`}).join(""),q=`
    <tr class="empty-row"><td colspan="6">
      <div class="data-empty">
        <div class="data-empty-icon">∅</div>
        <strong>${t(e("catalog.hubEmpty"))}</strong>
      </div>
    </td></tr>`,g=Ae({title:e("catalog.tabHub"),hint:e("catalog.hubHint"),meta:w.length?A("common.pagerTotal",{n:w.length}):"",searchHtml:`
      <div class="data-filter-search">
        <label for="cat-hub-q">${t(e("catalog.hubSearch"))}</label>
        <input type="search" id="cat-hub-q" value="${t(c.catalogHubQ||"")}" placeholder="${t(e("catalog.hubSearchPh"))}" />
      </div>`,gridHtml:`
      <label>${t(e("catalog.filterModality"))}
        <select id="cat-hub-mod">
          <option value="">${t(e("catalog.filterAll"))}</option>
          ${r.map(S=>`<option value="${t(S)}" ${p===S?"selected":""}>${t(xt(S))}</option>`).join("")}
        </select>
      </label>`}),v=`
    <div class="panel data-table-panel">
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>${t(e("catalog.colName"))}</th>
            <th>${t(e("catalog.colModality"))}</th>
            <th>${t(e("catalog.colRuntime"))}</th>
            <th>${t(e("catalog.downloads"))}</th>
            <th>${t(e("catalog.colStatus"))}</th>
            <th>${t(e("common.actions"))}</th>
          </tr></thead>
          <tbody>${N||q}</tbody>
        </table>
      </div>
      ${c.catalogHubNext?`<div class="pager"><button type="button" class="btn secondary sm" id="cat-hub-more">${t(e("catalog.hubMore"))}</button></div>`:""}
    </div>`;document.getElementById("app").innerHTML=le(`
    <div class="topbar">
      <h2>${t(e("catalog.title"))}</h2>
    </div>
    ${ve([e("catalog.intro")])}
    ${R}
    <div class="usage-tabs-panel panel catalog-tabs-panel media-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("catalog.title"))}">
        <button type="button" role="tab" class="seg-tab ${m==="packs"?"is-active":""}" data-catalog-tab="packs" aria-selected="${m==="packs"}">
          ${t(e("catalog.tabPacks"))}
          <span class="seg-tab-count">${s.length}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${m==="local"?"is-active":""}" data-catalog-tab="local" aria-selected="${m==="local"}">
          ${t(e("catalog.tabLocal"))}
          <span class="seg-tab-count">${o.length}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${m==="hub"?"is-active":""}" data-catalog-tab="hub" aria-selected="${m==="hub"}">
          ${t(e("catalog.tabHub"))}
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane catalog-tab-pane" id="catalog-tab-packs" ${m==="packs"?"":"hidden"}>
          ${x}
          ${G}
        </div>
        <div class="usage-tab-pane catalog-tab-pane" id="catalog-tab-local" ${m==="local"?"":"hidden"}>
          ${M}
        </div>
        <div class="usage-tab-pane catalog-tab-pane" id="catalog-tab-hub" ${m==="hub"?"":"hidden"}>
          ${g}
          ${v}
        </div>
      </div>
    </div>
  `),de(),document.querySelectorAll("[data-catalog-tab]").forEach(S=>{S.onclick=()=>{c.catalogTab=S.getAttribute("data-catalog-tab")||"packs",De().catch(y)}});const j=document.getElementById("cat-mod");j&&(j.onchange=()=>{c.catalogModality=j.value,De().catch(y)}),document.querySelector("#catalog-tab-packs [data-filter-apply]")?.addEventListener("click",()=>{c.catalogModality=document.getElementById("cat-mod")?.value||"",De().catch(y)}),document.querySelector("#catalog-tab-packs [data-filter-reset]")?.addEventListener("click",()=>{c.catalogModality="",De().catch(y)}),document.querySelector("#catalog-tab-hub [data-filter-apply]")?.addEventListener("click",()=>{c.catalogHubQ=document.getElementById("cat-hub-q")?.value.trim()||"",c.catalogModality=document.getElementById("cat-hub-mod")?.value||"",c.catalogHubHits=null,qt().catch(y)}),document.querySelector("#catalog-tab-hub [data-filter-reset]")?.addEventListener("click",()=>{c.catalogHubQ="",c.catalogModality="",c.catalogHubHits=null,qt().catch(y)}),document.getElementById("cat-hub-q")?.addEventListener("keydown",S=>{S.key==="Enter"&&(S.preventDefault(),document.querySelector("#catalog-tab-hub [data-filter-apply]")?.click())}),document.getElementById("cat-hub-more")?.addEventListener("click",()=>{qt({append:!0}).catch(y)}),m==="hub"&&c.catalogHubHits==null&&!c.catalogHubBusy&&qt().catch(y),document.querySelectorAll("[data-pull]").forEach(S=>{S.onclick=async()=>{const P=S.getAttribute("data-pull")||"",C=document.querySelector(`[data-quant-for="${CSS.escape(P)}"]`),K=C&&C.value?C.value:"",ne=K?`${P}:${K}`:P,ee=document.querySelector(`[data-pull-status="${CSS.escape(P)}"]`);c.catalogPulling=P,S.disabled=!0,S.textContent=e("catalog.pulling");try{const U=await fetch(`${Kt}/catalog/pull`,{method:"POST",headers:{"Content-Type":"application/json",...c.key?{Authorization:`Bearer ${c.key}`}:{}},body:JSON.stringify({model:ne})}),z=U.body&&U.body.getReader?U.body.getReader():null;let H="";if(z){const X=new TextDecoder;for(;;){const{done:re,value:Ce}=await z.read();if(re)break;const ge=X.decode(Ce,{stream:!0});H+=ge;const ae=H.split(`
`).map(Y=>Y.trim()).filter(Boolean),$e=ae[ae.length-1];if($e&&ee)try{const Y=JSON.parse($e);Y.status==="downloading"?ee.textContent=Y.total?`${Y.bytes||0}/${Y.total}`:String(Y.bytes||Y.file||e("catalog.pulling")):Y.status&&(ee.textContent=String(Y.status))}catch{}}}else H=await U.text();const E=H.split(`
`).map(X=>X.trim()).filter(Boolean),T=E.length?JSON.parse(E[E.length-1]):{};if(!U.ok)throw new Error(T.error?.message||T.reason||U.statusText);if(T.status==="error")throw new Error(T.reason||e("catalog.pullFail"));c.catalogPulling="",c.catalogTab="local",await De()}catch(U){c.catalogPulling="",S.disabled=!1,S.textContent=e("catalog.pull"),y(U)}}}),document.querySelectorAll("[data-load]").forEach(S=>{S.onclick=async()=>{try{await I("/models/load",{method:"POST",body:JSON.stringify({id:S.getAttribute("data-load"),vramMb:Number(S.getAttribute("data-vram")||0)})}),await De()}catch(P){y(P)}}}),document.querySelectorAll("[data-unload]").forEach(S=>{S.onclick=async()=>{try{await I("/models/unload",{method:"POST",body:JSON.stringify({id:S.getAttribute("data-unload")})}),await De()}catch(P){y(P)}}})}async function Gt(){const a=document.getElementById("app");try{if(!c.key){await Va();return}c.me||await za(),c.page==="dashboard"?await aa():c.page==="chat"?await So():c.page==="chats"?await mt():c.page==="keys"?await Fe():c.page==="documents"?await st():c.page==="media"?await Me():c.page==="catalog"?await De():c.page==="audit"?await pt():c.page==="settings"?await as():c.page==="apiFeatures"?await At():c.page==="usage"?await pe():c.page==="ddos"?await se():c.page==="queue"?await ue():c.page==="pm2"?await Le():c.page==="system"?await ot():c.page==="support"?await qo():await aa()}catch(s){a.innerHTML=le(`<div class="error-box">${t(s.message)}</div>`),de()}}let Je=null;const W={tab:"overview",status:"",sortBy:"queuedAt",sortDir:"desc",limit:20,offset:0};function Ft(a){return!a||a<0?"—":a<1e3?`${a}ms`:a<6e4?`${Math.round(a/1e3)}s`:a<36e5?`${Math.round(a/6e4)}m`:`${(a/36e5).toFixed(1)}h`}const Co=["enabled","globalConcurrency","perKeyConcurrency","maxQueueDepth","maxQueueDepthPerKey","fairness","defaultPriority","playgroundPriority","leaseMs","maxWaitMs"];function us(){return{relaxed:{enabled:!0,globalConcurrency:6,perKeyConcurrency:2,maxQueueDepth:200,maxQueueDepthPerKey:40,fairness:"weighted_round_robin",defaultPriority:100,playgroundPriority:40,leaseMs:6e4,maxWaitMs:9e5},balanced:{enabled:!0,globalConcurrency:4,perKeyConcurrency:1,maxQueueDepth:100,maxQueueDepthPerKey:20,fairness:"weighted_round_robin",defaultPriority:100,playgroundPriority:50,leaseMs:45e3,maxWaitMs:6e5},strict:{enabled:!0,globalConcurrency:2,perKeyConcurrency:1,maxQueueDepth:40,maxQueueDepthPerKey:8,fairness:"fifo_global",defaultPriority:100,playgroundPriority:80,leaseMs:3e4,maxWaitMs:3e5}}}function Oa(a){if(!a)return{};const s={};for(const o of Co){const i=a[o];typeof i=="boolean"?s[o]=i:typeof i=="number"&&Number.isFinite(i)?s[o]=Math.round(i):typeof i=="string"?s[o]=i:i==null?s[o]=null:s[o]=i}return s}function ms(a,s){return JSON.stringify(Oa(a))===JSON.stringify(Oa(s))}function ca(a){if(!a)return"custom";const s=us();for(const o of["relaxed","balanced","strict"])if(ms(a,s[o]))return o;return"custom"}function Lo(a){return e(a==="relaxed"?"queue.presetRelaxed":a==="balanced"?"queue.presetBalanced":a==="strict"?"queue.presetStrict":"queue.presetCustom")}function ps(a,{unsaved:s=!1}={}){const o=Lo(a),i=a==="relaxed"?"relaxed":a==="balanced"?"balanced":a==="strict"?"strict":"custom",n=s?A("queue.presetFormLabel",{name:o}):A("queue.presetActiveLabel",{name:o});return`<span class="ddos-preset-badge is-${i}" id="queue-preset-badge" title="${t(n)}">${t(n)}</span>`}function fs(){return{enabled:document.getElementById("q-master-enabled")?Xe("q-master-enabled"):!0,globalConcurrency:Math.max(1,Math.min(64,Math.floor(V("qp-gconc",4)))),perKeyConcurrency:Math.max(1,Math.min(16,Math.floor(V("qp-kconc",1)))),maxQueueDepth:Math.max(1,Math.floor(V("qp-depth",100))),maxQueueDepthPerKey:Math.max(1,Math.floor(V("qp-depthk",20))),fairness:document.getElementById("qp-fair")?.value==="fifo_global"?"fifo_global":"weighted_round_robin",defaultPriority:Math.max(0,Math.min(1e3,Math.floor(V("qp-pri",100)))),playgroundPriority:Math.max(0,Math.min(1e3,Math.floor(V("qp-ppri",50)))),leaseMs:Math.max(5e3,Math.floor(V("qp-lease",45e3))),maxWaitMs:Math.max(5e3,Math.floor(V("qp-wait",6e5)))}}function Nt(a){Ye("q-master-enabled",a,e("queue.masterOn"),e("queue.masterOff")),et("queue-root",!a),Ze("queue-disabled-banner",!a);const s=document.getElementById("qk-pill-enabled");s&&(s.innerHTML=Ke(a,e("dash.on"),e("dash.off")))}function Do(a){if(!a)return;const s=(i,n)=>{const d=document.getElementById(i);d&&(d.value=String(n))};Nt(a.enabled!==!1),s("qp-gconc",a.globalConcurrency),s("qp-kconc",a.perKeyConcurrency),s("qp-depth",a.maxQueueDepth),s("qp-depthk",a.maxQueueDepthPerKey);const o=document.getElementById("qp-fair");o&&(o.value=a.fairness||"weighted_round_robin"),s("qp-pri",a.defaultPriority),s("qp-ppri",a.playgroundPriority),s("qp-lease",a.leaseMs),s("qp-wait",a.maxWaitMs),gt()}function gt(){if(!document.getElementById("queue-policy-panel"))return;let a;try{a=fs()}catch{return}const s=ca(a),o=ca(c._queuePolicyCache||a),i=!ms(a,c._queuePolicyCache||a);document.querySelectorAll("[data-queue-preset]").forEach(l=>{const u=l.dataset.queuePreset;if(u==="custom"){const k=s==="custom";l.classList.toggle("is-active",k),l.setAttribute("aria-pressed",k?"true":"false"),l.disabled=!k;return}const m=u===s,p=u===o;l.classList.toggle("is-active",m),l.classList.toggle("is-saved",p&&!m),l.setAttribute("aria-pressed",m?"true":"false");const r=e(u==="relaxed"?"queue.presetRelaxed":u==="balanced"?"queue.presetBalanced":"queue.presetStrict");m&&p?l.innerHTML=`${t(r)} <span class="preset-tag">${t(e("queue.presetTagActive"))}</span>`:m&&i?l.innerHTML=`${t(r)} <span class="preset-tag preset-tag--draft">${t(e("queue.presetTagDraft"))}</span>`:p?l.innerHTML=`${t(r)} <span class="preset-tag preset-tag--saved">${t(e("queue.presetTagSaved"))}</span>`:l.textContent=r});const n=document.getElementById("queue-preset-badge");n&&(n.outerHTML=ps(s,{unsaved:i&&s!==o}));const d=document.getElementById("queue-preset-hint");if(d){const l={relaxed:e("queue.presetRelaxedHint"),balanced:e("queue.presetBalancedHint"),strict:e("queue.presetStrictHint"),custom:e("queue.presetCustomHint")};d.textContent=l[s]||l.custom}}function Ho(){document.querySelectorAll("[data-queue-preset]").forEach(a=>{a.dataset.queuePreset!=="custom"&&(a.onclick=()=>{const s=a.dataset.queuePreset,o=us()[s];o&&Do(o)})}),["qp-gconc","qp-kconc","qp-depth","qp-depthk","qp-fair","qp-pri","qp-ppri","qp-lease","qp-wait"].forEach(a=>{const s=document.getElementById(a);s&&(s.addEventListener("change",()=>gt()),s.addEventListener("input",()=>gt()))}),gt()}function _a(){return document.querySelector(".main")}function gs(a){return a.map(s=>{const o=s.status==="queued"||s.status==="leased"||s.status==="running",i=s.status==="failed"||s.status==="dead"||s.status==="cancelled",n=s.startedAt||s.finishedAt?null:s.queuedAt?Date.now()-new Date(s.queuedAt).getTime():null;return`
    <tr data-q-row="${t(s.id)}">
      <td>
        <div class="cell-primary mono" title="${t(s.id||"")}">${t((s.id||"").slice(0,10))}…</div>
        <div class="cell-sub mono" title="${t(s.requestId||"")}">${t((s.requestId||"").slice(0,18))}${(s.requestId||"").length>18?"…":""}</div>
        ${s.errorMessage?`<div class="queue-job-err" title="${t(s.errorMessage)}">${t(String(s.errorMessage).slice(0,80))}</div>`:""}
      </td>
      <td>${Es(s.source)}</td>
      <td>
        ${Ps(s.status)}
        ${s.cancelRequested?`<div class="cell-sub">${t(e("queue.cancelReq"))}</div>`:""}
      </td>
      <td class="mono" title="${t(s.model||"")}">${t(s.model||"—")}</td>
      <td><span class="queue-pri">${s.priority??"—"}</span></td>
      <td>
        <div class="cell-primary mono" title="${t(s.apiKeyId||"")}">${t((s.apiKeyId||"").slice(0,8))}…</div>
      </td>
      <td class="mono">${s.attempt??0}<span class="muted">/${s.maxAttempts??1}</span></td>
      <td>
        <div class="cell-primary">${oe(s.queuedAt)}</div>
        ${n!=null&&s.status==="queued"?`<div class="cell-sub" data-q-wait>${t(e("queue.wait"))}: ${Ft(n)}</div>`:s.startedAt?`<div class="cell-sub">${t(e("queue.started"))}: ${oe(s.startedAt)}</div>`:""}
      </td>
      <td>
        <div class="row-actions">
        ${o?`<button type="button" class="btn danger sm" data-q-cancel="${t(s.id)}">${t(e("queue.cancel"))}</button>`:""}
        ${s.status==="queued"?`<button type="button" class="btn secondary sm" data-q-pri="${t(s.id)}" data-pri="${s.priority}">${t(e("queue.priorityBtn"))}</button>`:""}
        ${i?`<button type="button" class="btn secondary sm" data-q-requeue="${t(s.id)}">${t(e("queue.requeue"))}</button>`:""}
        </div>
      </td>
    </tr>`}).join("")}function ys(){document.querySelectorAll("[data-q-cancel]").forEach(a=>{a.onclick=async()=>{await Z({title:e("queue.cancel"),message:e("queue.cancelConfirm"),variant:"danger",confirmText:e("queue.cancel")})&&(await I(`/queue/jobs/${a.dataset.qCancel}/cancel`,{method:"POST",body:"{}"}),ue().catch(y))}}),document.querySelectorAll("[data-q-requeue]").forEach(a=>{a.onclick=async()=>{await I(`/queue/jobs/${a.dataset.qRequeue}/requeue`,{method:"POST",body:"{}"}),ue().catch(y)}}),document.querySelectorAll("[data-q-pri]").forEach(a=>{a.onclick=async()=>{const s=Number(a.dataset.pri)||100,o=window.prompt(e("queue.priorityPh"),String(s));if(o==null)return;const i=Number(o);!Number.isFinite(i)||i<0||i>1e3||(await I(`/queue/jobs/${a.dataset.qPri}/priority`,{method:"POST",body:JSON.stringify({priority:i})}),ue().catch(y))}})}function bs(a){return a.enabled?a.paused?e("queue.paused"):a.drainMode?e("queue.drain"):e("queue.running"):e("queue.modeOff")}function Oo({s:a,pol:s,jobs:o,total:i,by:n}){const d=a.dead??n.dead??0,l=a.leased??n.leased??0,u=a.running??n.running??0,m=a.queued??n.queued??0,p=a.depth??m+l+u,r=bs(s),k=s.fairness==="fifo_global"?e("queue.fifo"):e("queue.wrr"),b=(q,g)=>{const v=document.getElementById(q);v&&(v.textContent=g)},f=(q,g)=>{const v=document.getElementById(q);v&&(v.innerHTML=g)};b("qk-depth",String(p)),b("qk-depth-sub",A("queue.kpiDepthSub",{q:m,l})),f("qk-running",`${u}<span class="dash-kpi-den">/${s.globalConcurrency??"—"}</span>`),b("qk-running-sub",A("queue.kpiActiveSub",{n:a.workerActive??0})),b("qk-queued",String(m)),b("qk-dead",String(d)),b("qk-oldest",a.oldestQueuedAgeMs?Ft(a.oldestQueuedAgeMs):"—"),b("qk-mode",r),b("qk-mode-sub",k);const h=document.getElementById("qk-worker-id");if(h){const q=a.workerId||"—";h.textContent=q,h.title=q}const $=(q,g,v,j)=>{const S=document.getElementById(q);S&&(S.outerHTML=`<span id="${q}">${Ke(g,v,j)}</span>`)};$("qk-pill-enabled",s.enabled!==!1,e("dash.on"),e("dash.off")),$("qk-pill-consumer",!s.paused&&s.enabled!==!1,e("queue.running"),s.paused?e("queue.paused"):e("queue.modeOff")),$("qk-pill-admission",!s.drainMode,e("queue.accepting"),e("queue.drain")),b("qk-fairness-val",k),b("qk-conc-val",`${s.perKeyConcurrency??1} / ${s.globalConcurrency??"—"}`);const B=document.getElementById("queue-dlq-slot");B&&(d>0?(B.innerHTML=`
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
        </div>`,document.getElementById("q-filter-dead")?.addEventListener("click",()=>{W.status="dead",W.offset=0,W.tab="jobs",ue().catch(y)})):B.innerHTML="");const L=(q,g)=>{const v=document.getElementById(q);v&&(v.textContent=String(g??0))};L("q-tab-count-jobs",i),L("q-tab-count-dead",d);const R=document.getElementById("qk-jobs-meta");R&&(R.textContent=A("queue.jobsMeta",{n:i}));const x=document.querySelector("#queue-jobs-table tbody");if(x){const q=o.map(v=>`${v.id}|${v.status}|${v.priority}|${v.attempt}|${v.cancelRequested?1:0}|${v.errorMessage||""}|${v.startedAt||""}|${v.finishedAt||""}`).join(";"),g=gs(o)||`<tr class="empty-row"><td colspan="9">
        <div class="data-empty">
          <div class="data-empty-icon">∅</div>
          <strong>${t(e("queue.empty"))}</strong>
        </div>
      </td></tr>`;if(x.dataset.qsig!==q){const v=document.querySelector("#queue-jobs-table .table-wrap"),j=v?.scrollLeft||0;x.dataset.qsig=q,x.innerHTML=g,ys(),va(document.querySelector("#queue-jobs-table")||document),v&&(v.scrollLeft=j)}else o.forEach(v=>{if(v.status!=="queued"||!v.queuedAt)return;const j=Date.now()-new Date(v.queuedAt).getTime(),S=String(v.id||"");let P=null;x.querySelectorAll("[data-q-row]").forEach(K=>{K.getAttribute("data-q-row")===S&&(P=K)});const C=P?.querySelector("[data-q-wait]");C&&(C.textContent=`${e("queue.wait")}: ${Ft(j)}`)})}if(document.querySelector("#queue-pager .data-pager-meta span")){const q=Math.max(1,Math.ceil((i||0)/W.limit)||1),g=Math.floor(W.offset/W.limit)+1,v=document.querySelectorAll("#queue-pager .data-pager-meta > span");v[0]&&(v[0].textContent=A("common.pagerTotal",{n:i||0})),v[1]&&(v[1].textContent=A("common.pagerPage",{n:g,total:q}));const j=document.getElementById("queue-prev"),S=document.getElementById("queue-next");j&&(j.disabled=W.offset<=0),S&&(S.disabled=W.offset+W.limit>=i)}const M=document.getElementById("q-pause");M&&(M.textContent=s.paused?e("queue.resume"):e("queue.pause"));const w=document.getElementById("q-drain");w&&(w.textContent=s.drainMode?e("queue.undrain"):e("queue.drainBtn"));const N=document.getElementById("q-master-enabled");N&&document.activeElement!==N&&Nt(s.enabled!==!1)}function Ra(){Je||(Je=setInterval(()=>{if(c.page!=="queue"){clearInterval(Je),Je=null;return}const a=document.activeElement;a&&a.closest&&a.closest("#queue-policy-panel")&&(a.tagName==="INPUT"||a.tagName==="SELECT"||a.tagName==="TEXTAREA")||ue({soft:!0}).catch(()=>{})},4e3))}async function ue(a={}){const s=!!a.soft&&document.getElementById("queue-root");!s&&Je&&(clearInterval(Je),Je=null);const o=_a(),i=!s&&o?o.scrollTop:0,n=W;n.sortBy||(n.sortBy="queuedAt"),n.sortDir||(n.sortDir="desc");const d=new URLSearchParams;d.set("limit",String(n.limit)),d.set("offset",String(n.offset)),n.status&&d.set("status",n.status),we(d,n);const[l,u,m]=await Promise.all([I("/queue/stats"),I(`/queue/jobs?${d}`),I("/queue/policy")]);if(c.page!=="queue")return;const p=l.data||{},r=m.data||p.policy||{},k=u.data||[],b=u.total??k.length,f=p.byStatus||{},h=p.dead??f.dead??0,$=p.leased??f.leased??0,B=p.running??f.running??0,L=p.queued??f.queued??0,R=p.depth??L+$+B,x=bs(r);if(c._queuePolicyCache={...r},s){Oo({s:p,pol:r,jobs:k,total:b,by:f}),Ra();return}W.tab||(W.tab="overview");const G=W.tab==="jobs"||W.tab==="policy"?W.tab:"overview";W.tab=G;const M=gs(k),w=Ae({title:e("queue.filterTitle"),hint:e("queue.filterHint"),meta:A("queue.jobsMeta",{n:b}),gridHtml:`
      <label>${t(e("queue.filterStatus"))}
        <select id="qf-status">
          <option value="">${t(e("queue.allStatuses"))}</option>
          <option value="queued" ${n.status==="queued"?"selected":""}>${t(e("queue.filterQueued"))}</option>
          <option value="active" ${n.status==="active"?"selected":""}>${t(e("queue.filterRunning"))}</option>
          <option value="dead" ${n.status==="dead"?"selected":""}>${t(e("queue.filterDead"))}</option>
          <option value="failed" ${n.status==="failed"?"selected":""}>${t(e("queue.filterFailed"))}</option>
          <option value="succeeded" ${n.status==="succeeded"?"selected":""}>${t(e("queue.filterSucceeded"))}</option>
          <option value="cancelled" ${n.status==="cancelled"?"selected":""}>${t(e("queue.filterCancelled"))}</option>
        </select>
      </label>`}),N=he({headHtml:`
      <th>${t(e("queue.colJob"))}</th>
      <th>${t(e("queue.colSource"))}</th>
      ${F({field:"status",label:e("queue.colStatus"),filterRef:n})}
      ${F({field:"model",label:e("queue.colModel"),filterRef:n})}
      ${F({field:"priority",label:e("queue.colPri"),filterRef:n})}
      <th>${t(e("queue.colKey"))}</th>
      ${F({field:"attempt",label:e("queue.colTry"),filterRef:n})}
      ${F({field:"queuedAt",label:e("queue.colTime"),filterRef:n})}
      <th>${t(e("common.actions"))}</th>`,bodyHtml:M,colSpan:9,emptyText:e("queue.empty"),pagerHtml:Be({total:b,limit:n.limit,offset:n.offset,idPrefix:"queue"})}),q=r.fairness==="fifo_global"?e("queue.fifo"):e("queue.wrr"),g=r.enabled!==!1,v=(U,z,H,E,T)=>`
    <div class="card">
      <div class="label">${t(U)}</div>
      <div class="value value-sm" id="${t(E)}">${z}</div>
      ${H!=null&&H!==""?`<div class="muted card-sub"${T?` id="${t(T)}"`:""}>${t(String(H))}</div>`:""}
    </div>`,j=`
    <div class="grid queue-kpi-grid" id="queue-kpi-grid">
      ${v(e("queue.depth"),t(String(R)),A("queue.kpiDepthSub",{q:L,l:$}),"qk-depth","qk-depth-sub")}
      ${v(e("queue.activeJobs"),`${B}<span class="dash-kpi-den">/${r.globalConcurrency??"—"}</span>`,A("queue.kpiActiveSub",{n:p.workerActive??0}),"qk-running","qk-running-sub")}
      ${v(e("queue.queued"),t(String(L)),e("queue.kpiQueuedSub"),"qk-queued","qk-queued-sub")}
      ${v(e("queue.dead"),t(String(h)),e("queue.kpiDeadSub"),"qk-dead","qk-dead-sub")}
      ${v(e("queue.oldest"),t(p.oldestQueuedAgeMs?Ft(p.oldestQueuedAgeMs):"—"),e("queue.kpiOldestSub"),"qk-oldest","qk-oldest-sub")}
      ${v(e("queue.mode"),t(x),q,"qk-mode","qk-mode-sub")}
    </div>`,S=`
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
            <span id="qk-pill-enabled">${Ke(r.enabled!==!1,e("dash.on"),e("dash.off"))}</span>
          </div>
          <div class="queue-status-item">
            <span class="label">${t(e("queue.consumer"))}</span>
            <span id="qk-pill-consumer">${Ke(!r.paused&&r.enabled!==!1,e("queue.running"),r.paused?e("queue.paused"):e("queue.modeOff"))}</span>
          </div>
          <div class="queue-status-item">
            <span class="label">${t(e("queue.admission"))}</span>
            <span id="qk-pill-admission">${Ke(!r.drainMode,e("queue.accepting"),e("queue.drain"))}</span>
          </div>
          <div class="queue-status-item">
            <span class="label">${t(e("queue.fairness"))}</span>
            <strong class="queue-status-val" id="qk-fairness-val">${t(q)}</strong>
          </div>
          <div class="queue-status-item">
            <span class="label">${t(e("queue.concurrency"))}</span>
            <strong class="queue-status-val mono" id="qk-conc-val">${r.perKeyConcurrency??1} / ${r.globalConcurrency??"—"}</strong>
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
    ${h>0?`<div class="queue-dlq-banner" role="status">
      <div class="queue-dlq-text">
        <strong>${t(e("queue.dlqTitle"))}</strong>
        <span class="queue-dlq-count">${h}</span>
        <span class="muted">${t(e("queue.dlqHint"))}</span>
      </div>
      <div class="toolbar">
        <button type="button" class="btn secondary sm" id="q-filter-dead">${t(e("queue.viewDlq"))}</button>
        <button type="button" class="btn danger sm" id="q-purge-dlq">${t(e("queue.purgeDead"))}</button>
      </div>
    </div>`:""}
    </div>`,P=`
    ${w}
    <div id="queue-jobs-table" class="queue-jobs-table-host">${N}</div>`,C=`
    <div class="panel data-table-panel queue-policy-panel" id="queue-policy-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("queue.policyTitle"))}</strong>
          <span class="muted panel-h-sub">${t(e("queue.policyHint"))}</span>
        </div>
        ${ps(ca(r))}
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
            <input type="number" id="qp-gconc" min="1" max="64" value="${Number(r.globalConcurrency)||2}" />
            <span class="hint">${t(e("queue.hintGlobalConc"))}</span>
          </label>
          <label>${t(e("queue.perKeyConcurrency"))}
            <input type="number" id="qp-kconc" min="1" max="16" value="${Number(r.perKeyConcurrency)||1}" />
            <span class="hint">${t(e("queue.hintPerKeyConc"))}</span>
          </label>
          <label>${t(e("queue.maxDepth"))}
            <input type="number" id="qp-depth" min="1" value="${Number(r.maxQueueDepth)||100}" />
            <span class="hint">${t(e("queue.hintMaxDepth"))}</span>
          </label>
          <label>${t(e("queue.maxDepthKey"))}
            <input type="number" id="qp-depthk" min="1" value="${Number(r.maxQueueDepthPerKey)||20}" />
            <span class="hint">${t(e("queue.hintMaxDepthKey"))}</span>
          </label>
          <label>${t(e("queue.fairness"))}
            <select id="qp-fair">
              <option value="weighted_round_robin" ${r.fairness==="weighted_round_robin"?"selected":""}>${t(e("queue.wrr"))}</option>
              <option value="fifo_global" ${r.fairness==="fifo_global"?"selected":""}>${t(e("queue.fifo"))}</option>
            </select>
            <span class="hint">${t(e("queue.hintFairness"))}</span>
          </label>
          <label>${t(e("queue.defaultPriority"))}
            <input type="number" id="qp-pri" min="0" max="1000" value="${Number(r.defaultPriority)||100}" />
          </label>
          <label>${t(e("queue.playgroundPriority"))}
            <input type="number" id="qp-ppri" min="0" max="1000" value="${Number(r.playgroundPriority)||50}" />
          </label>
          <label>${t(e("queue.leaseMs"))}
            <input type="number" id="qp-lease" min="5000" step="1000" value="${Number(r.leaseMs)||45e3}" />
            <span class="hint">${t(e("queue.hintLease"))}</span>
          </label>
          <label>${t(e("queue.maxWaitMs"))}
            <input type="number" id="qp-wait" min="5000" step="1000" value="${Number(r.maxWaitMs)||6e5}" />
            <span class="hint">${t(e("queue.hintMaxWait"))}</span>
          </label>
        </div>
        <div class="toolbar settings-save-bar">
          <button type="button" class="btn sm" id="qp-save">${t(e("queue.savePolicy"))}</button>
        </div>
      </div>
    </div>`;if(document.getElementById("app").innerHTML=le(`
  <div id="queue-root" class="${g?"":"is-feature-off"}">
    <div class="topbar">
      <h2>${t(e("queue.title"))}</h2>
      <div class="toolbar">
        ${$a({id:"q-master-enabled",on:g,onLabel:e("queue.masterOn"),offLabel:e("queue.masterOff"),title:e("queue.masterHint")})}
        <button type="button" class="btn secondary sm" id="q-pause">${t(r.paused?e("queue.resume"):e("queue.pause"))}</button>
        <button type="button" class="btn secondary sm" id="q-drain">${t(r.drainMode?e("queue.undrain"):e("queue.drainBtn"))}</button>
        <button type="button" class="btn danger sm" id="q-purge">${t(e("queue.purgeDead"))}</button>
      </div>
    </div>
    ${ve([e("queue.subtitle")])}
    <div class="feature-off-banner" id="queue-disabled-banner" ${g?"hidden":""} role="status">
      <strong>${t(e("common.featureOff"))}</strong>
      <span>${t(e("queue.disabledBanner"))}</span>
    </div>

    ${j}

    <div class="usage-tabs-panel panel queue-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("queue.title"))}">
        <button type="button" role="tab" class="seg-tab ${G==="overview"?"is-active":""}" data-queue-tab="overview" aria-selected="${G==="overview"}">
          ${t(e("queue.tabOverview"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${G==="jobs"?"is-active":""}" data-queue-tab="jobs" aria-selected="${G==="jobs"}">
          ${t(e("queue.tabJobs"))}
          <span class="seg-tab-count" id="q-tab-count-jobs">${b}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${G==="policy"?"is-active":""}" data-queue-tab="policy" aria-selected="${G==="policy"}">
          ${t(e("queue.tabPolicy"))}
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane queue-tab-pane-overview" id="queue-tab-overview" ${G==="overview"?"":"hidden"}>
          ${S}
        </div>
        <div class="usage-tab-pane queue-tab-pane-jobs" id="queue-tab-jobs" ${G==="jobs"?"":"hidden"}>
          ${P}
        </div>
        <div class="usage-tab-pane queue-tab-pane-policy" id="queue-tab-policy" ${G==="policy"?"":"hidden"}>
          ${C}
        </div>
      </div>
    </div>
  </div>
  `),de(),document.querySelectorAll("[data-queue-tab]").forEach(U=>{U.addEventListener("click",()=>{const z=U.getAttribute("data-queue-tab")||"overview";z!=="overview"&&z!=="jobs"&&z!=="policy"||W.tab!==z&&(W.tab=z,ue().catch(y))})}),i>0){const U=_a();U&&(U.scrollTop=i,requestAnimationFrame(()=>{U.scrollTop=i}))}document.getElementById("q-master-enabled").onclick=async()=>{const U=!Xe("q-master-enabled");Nt(U);try{const z=await I("/queue/policy",{method:"PUT",body:JSON.stringify({enabled:U})});c._queuePolicyCache={...c._queuePolicyCache||{},...z.data||{enabled:U}},gt()}catch(z){Nt(!U),y(z)}},document.getElementById("q-pause").onclick=async()=>{await I(r.paused?"/queue/resume":"/queue/pause",{method:"POST",body:"{}"}),ue().catch(y)},document.getElementById("q-drain").onclick=async()=>{await I(r.drainMode?"/queue/undrain":"/queue/drain",{method:"POST",body:"{}"}),ue().catch(y)};let K=!1;const ne=async()=>{if(!K){K=!0;try{if(!await Z({title:e("queue.purgeTitle"),message:e("queue.purgeConfirm"),variant:"danger",confirmText:e("queue.purgeConfirmBtn"),cancelText:e("common.cancel")}))return;const z=await I("/queue/purge-dead",{method:"POST",body:"{}"}),H=Number(z?.data?.deleted??0);await fe({title:e("queue.purgeDoneTitle"),message:A("queue.purgeDoneMsg",{n:H}),confirmText:e("common.ok")}),await ue()}finally{K=!1}}},ee=document.getElementById("queue-root");ee&&(ee.onclick=U=>{U.target?.closest?.("#q-purge, #q-purge-dlq")&&(U.preventDefault(),ne().catch(y))}),document.getElementById("q-filter-dead")?.addEventListener("click",()=>{W.status="dead",W.offset=0,W.tab="jobs",ue().catch(y)}),document.querySelectorAll("[data-filter-apply]").forEach(U=>{U.onclick=()=>{W.status=document.getElementById("qf-status")?.value||"",W.offset=0,ue().catch(y)}}),document.querySelectorAll("[data-filter-reset]").forEach(U=>{U.onclick=()=>{W.status="",W.sortBy="queuedAt",W.sortDir="desc",W.offset=0,ue().catch(y)}}),dt("queue",W,()=>ue().catch(y)),Ge(W,()=>ue().catch(y)),document.getElementById("qp-save").onclick=async()=>{const U=fs();await I("/queue/policy",{method:"PUT",body:JSON.stringify(U)}),c._queuePolicyCache={...c._queuePolicyCache||{},...U},Q(""),ue().catch(y)},Ho(),ys(),Ra()}c.page=Ss();(!location.hash||location.hash==="#"||location.hash==="#/")&&pa(c.page);window.addEventListener("hashchange",()=>{const a=ma(location.hash);a&&a!==c.page&&ga(a,{writeHash:!1})});window.addEventListener("popstate",()=>{const a=ma(location.hash);!a||a===c.page||ga(a,{writeHash:!1})});Gt();
//# sourceMappingURL=boot.js.map
