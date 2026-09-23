const Da="gog_admin_lang",Kt={en:{brand:"Grok Gateway",brandSub:"Admin Panel",loginTitle:"Admin",loginLabel:"API Key",loginOtpLabel:"One-time login code",loginBtn:"Sign in",loginCmdHint:"Get a key in terminal:",loginOtpHint:"Generate a code in terminal (required every login):",loginOtpExpiry:"Code expires in 5 minutes and can be used only once.",loginOtpFail:"Invalid or expired code",loginLostKey:"Lost old key? Create a new admin key (plaintext is not stored).",loginCopy:"Copy",loginCopied:"Copied",needKey:"Enter API key",needOtp:"Enter the one-time code from the terminal",logout:"Log out",shell:{menu:"Open menu",closeMenu:"Close menu"},nav:{dashboard:"Dashboard",chat:"Chat",chats:"Chat logs",keys:"API Keys",documents:"Documents",media:"Media",audit:"Audit Logs",settings:"Safety",apiFeatures:"API features",usage:"Usage & Limits",ddos:"DDoS Center",queue:"Queue",pm2:"PM2",system:"System",support:"Support"},queue:{title:"Chat queue",subtitle:"Pause, drain, requeue, and tune concurrency.",paused:"Paused",running:"Consuming",drain:"Drain mode",mode:"Mode",modeOff:"Disabled",depth:"Depth",queued:"Queued",leased:"Leased",activeJobs:"Running",dead:"Dead letter",oldest:"Oldest wait",concurrency:"Per-key / global",worker:"In-process workers",workerInstance:"Worker instance",workerInstanceHint:"This process’s consumer ID (lease owner). Changes on restart.",kpiActiveSub:"{n} active in this process",consumer:"Consumer",admission:"Admission",accepting:"Accepting jobs",pause:"Pause",resume:"Resume",drainBtn:"Drain",undrain:"Stop drain",savePolicy:"Save policy",refresh:"Refresh",jobs:"Jobs",tabOverview:"Overview",tabJobs:"Jobs",tabPolicy:"Policy",jobsMeta:"{n} matching",cancel:"Cancel",requeue:"Requeue",purgeDead:"Purge DLQ & old jobs",purgeTitle:"Purge finished jobs?",purgeConfirm:"Deletes all dead-letter (DLQ) jobs now, plus succeeded / failed / cancelled jobs finished more than 24 hours ago.",purgeConfirmBtn:"Delete",purgeDoneTitle:"Purge complete",purgeDoneMsg:"Deleted {n} job(s).",cancelConfirm:"Cancel this job? If it is running, cancellation is cooperative.",empty:"No jobs match this filter",enabled:"Queue enabled",masterOn:"Queue on",masterOff:"Queue off",masterHint:"Master switch for the durable chat queue. Applies immediately.",disabledBanner:"Queue is disabled — new chat requests bypass the queue and run immediately (subject to concurrency limits).",globalConcurrency:"Global concurrency",perKeyConcurrency:"Per-key concurrency",maxDepth:"Max queue depth",maxDepthKey:"Max per key",fairness:"Fairness",fifo:"Global FIFO",wrr:"Weighted round-robin",playgroundPriority:"Playground priority (lower first)",defaultPriority:"Default priority",leaseMs:"Lease (ms)",maxWaitMs:"Max wait (ms)",filterTitle:"Filter jobs",filterHint:"Filter by status. Auto-refreshes.",filterStatus:"Status",allStatuses:"All statuses",filterDead:"Dead letter (DLQ)",filterQueued:"Queued",filterRunning:"Running / leased",filterFailed:"Failed",filterSucceeded:"Succeeded",filterCancelled:"Cancelled",errorCol:"Error",priorityBtn:"Priority",priorityPh:"Priority (0–1000, lower first)",dlqTitle:"Dead letter queue",dlqHint:"Jobs that exhausted retries — requeue or purge when ready.",viewDlq:"View DLQ",statusPanel:"Runtime status",statusPanelHint:"Live consumer, admission, and worker identity. Auto-refreshes every few seconds.",policyTitle:"Queue policy",policyHint:"Pick a scheme or fine-tune values. Save to apply. Editing pauses auto-refresh.",presetTitle:"Policy schemes",presetHint:"One-click presets. Active = matches form · Saved = currently stored.",presetRelaxed:"Relaxed",presetBalanced:"Balanced",presetStrict:"Strict",presetCustom:"Custom",presetRelaxedHint:"Higher concurrency and deeper queues — better for multi-key playgrounds and burst traffic.",presetBalancedHint:"Default production balance: fair round-robin, moderate depth, one job per key.",presetStrictHint:"Tight limits + global FIFO — protects the host when traffic is untrusted or resource is scarce.",presetCustomHint:"Values do not match a built-in scheme. Adjust fields or pick a scheme above.",presetActiveLabel:"Active: {name}",presetFormLabel:"Draft: {name}",presetTagActive:"Active",presetTagDraft:"Draft",presetTagSaved:"Saved",hintGlobalConc:"Max jobs running at once across all keys",hintPerKeyConc:"Max concurrent jobs for a single API key",hintMaxDepth:"Reject new jobs when total queue is full",hintMaxDepthKey:"Reject when this key has too many waiting/running jobs",hintFairness:"WRR shares capacity across keys; FIFO is global order by priority/time",hintLease:"How long a worker holds a job before reclaim",hintMaxWait:"Client wait timeout while queued",colJob:"Job / request",colSource:"Source",colStatus:"Status",colModel:"Model",colPri:"Pri",colKey:"API key",colTry:"Try",colTime:"Queued",stQueued:"queued",stLeased:"leased",stRunning:"running",stSucceeded:"succeeded",stFailed:"failed",stDead:"dead",stCancelled:"cancelled",srcV1:"API",srcPlayground:"Playground",kpiDepthSub:"{q} queued · {l} leased",kpiQueuedSub:"Waiting for a worker",kpiDeadSub:"Exhausted attempts",kpiOldestSub:"Head of queue wait",wait:"Wait",started:"Started",cancelReq:"Cancel requested"},chat:{title:"Chat",new:"New chat",send:"Send",stop:"Stop",stopped:"stopped",placeholder:"Message… (Enter to send, Shift+Enter newline)",keyMode:"API key",keySelect:"API key",useSessionKey:"Signed-in admin key",useCustomKey:"Custom key",customKey:"Key",includeReasoning:"Show reasoning",resume:"Resume",resumePh:"Grok session UUID",resumeHint:"Continue a Grok CLI session (--resume)",fork:"Fork",memory:"Memory",noPlan:"No plan",permission:"Permission",effort:"Effort",effortDefault:"Default",effort_none:"None",effort_minimal:"Minimal",effort_low:"Low",effort_medium:"Medium",effort_high:"High",effort_xhigh:"X high",effort_max:"Max",tokens:"Tokens",cacheTokens:"cache",cost:"Cost",reasoning:"Thinking",needKey:"Enter or select an API key",attach:"Upload",attachLibrary:"From library",attachHint:"Drop files anywhere on this page, upload, or pick from library",dropTitle:"Drop files to attach",dropHint:"Release to upload — same formats as the attach button",formatsLabel:"Formats",formatsHint:"txt, md, csv, json, xml, html, pdf, images (png/jpg/webp/gif), code (js/ts/py/go/rs/java/c/cpp/css/yml/sql/sh…)",formatsReject:"Unsupported type: {name}. Allowed: {formats}",libraryTitle:"Previously uploaded files",librarySubtitle:"Select files owned by the current API key (same formats as upload).",librarySearch:"Search by name…",libraryEmpty:"No matching files for this key",libraryAdd:"Add selected",librarySelected:"{n} selected",libraryAlready:"Already attached",libraryLoadFail:"Could not load documents",uploading:"Uploading…",uploadFail:"Upload failed",uploadProgress:"Uploading {name}",uploadProgressMulti:"Uploading {name} ({i}/{n})",emptyTitle:"Start a conversation",emptyHint:"Send a message or attach files. Open a previous chat from the history panel to continue.",needContent:"Type a message or attach at least one file",tooManyFiles:"Too many files (max 10 per message)",fileOnlyPrompt:"Please review the attached files.",removeFile:"Remove",docs:"Attachments",you:"You",assistant:"Assistant",streaming:"Streaming…",emptyReply:"(empty reply)",systemPrompt:"System prompt",systemPlaceholder:"Optional system instructions for the model…",systemHint:"Sent as a system message on every turn. Not shown in the chat bubbles.",history:"History",historyEmpty:"No saved conversations yet",historySearch:"Search topics…",historyOpen:"Show history",historyClose:"Close history",rename:"Rename",renamePh:"Conversation topic",untitled:"Untitled chat",deleteConversation:"Delete",deleteConfirm:"Delete this conversation? This cannot be undone.",saveFail:"Could not save conversation",loadFail:"Could not load conversation",historyPrev:"Previous",historyNext:"Next",historyPage:"Page {n} / {total}",msgs:"{n} messages",settings:"Settings",settingsHide:"Hide settings",compress:"Summarize for context",compressConfirm:"Generate a conversation summary for later turns? Your full chat history stays on screen. Only the model context is shortened. This uses one model call.",compressing:"Summarizing…",compressNeedMore:"Need at least 3 messages (or 2 long ones) to summarize. Continue chatting, then try again.",compressFail:"Could not create summary",compressNeedSummary:"Create a summary first (Summarize for context).",compressedBadge:"Summary",compressOk:"Summary ready — full history kept. Context mode set to summary.",compressBusy:"Wait for the current reply to finish",compressResultTitle:"Conversation summary",compressView:"View summary",summaryMeta:"Created: {when} · Based on {n} messages",ctxPolicyTitle:"Model context",ctxRemark:"Full messages stay visible. This only controls what is sent to the model next.",ctxMode:"Context",ctxModeFull:"Full history",ctxModeSummary:"Summary + recent",ctxModeRecent:"Recent only",ctxModeFullLabel:"Sending full history to the model",ctxModeSummaryLabel:"Sending summary + last {n} messages",ctxModeRecentLabel:"Sending last {n} messages only",ctxRecentN:"Recent N",ctxLongHint:"Long thread detected — consider Summary or Recent to reduce tokens and lag.",loadOlder:"Load {n} earlier messages",showMore:"Show more",showLess:"Show less",copy:"Copy",copied:"Copied",copyFail:"Copy failed"},status:{success:"success",error:"error",timeout:"timeout",pending:"pending",active:"active",finished:"finished",online:"online",stopped:"stopped"},dash:{title:"Dashboard",subtitle:"Traffic, queue, safety, and protection at a glance.",last24:"Requests (24h)",totalChat:"Total chats",success:"Success",errors:"Errors / timeout",docs:"Documents",keys:"Active keys",concurrent:"Grok concurrency",recent:"Recent API chats",empty:"No data yet",emptyModels:"No model traffic in the last 24h",updated:"Updated",refresh:"Refresh",viewAll:"View all",openDdos:"DDoS center",openSettings:"Safety",openQueue:"Open queue",kpi24h:"Requests (24h)",kpi24hSub:"{ok} ok · {err} errors",kpiSuccessRate:"Success rate (24h)",kpiSuccessRateSub:"All-time {all}%",kpiErrors:"Errors (24h)",kpiErrorsSub:"All-time {all}",kpiKeys:"API keys",kpiKeysSub:"Active / total",kpiDocs:"Documents",kpiMedia:"Media assets",kpiMediaSub:"{n} in 24h",kpiDocsSub:"Stored files",kpiConv:"Playground threads",kpiConvSub:"{n} updated in 24h",kpiSessions:"OTP sessions",kpiSessionsSub:"Active admin logins",kpiConcurrent:"Grok concurrency",kpiConcurrentSub:"Active / max slots",kpiQueue:"Chat queue",kpiQueueSub:"Depth · running / max · dead",kpiQueueSubLive:"{run}/{max} run · {dead} dead{wait}",kpiQueuePaused:"Paused",kpiQueueDrain:"Drain",kpiQueueOff:"Disabled",kpiSafe:"Global safe",kpiSafeOn:"On",kpiSafeOff:"Off",kpiSafeSub:"{tools} · turns {turns} · {model}",kpiSafeSubEmpty:"Settings unavailable",queuePanel:"Chat queue",queueState:"State",queueLive:"Live",qQueued:"Queued",qRunning:"Running",qDead:"Dead",qSucceeded:"Succeeded",qWorker:"Worker",qWorkerActive:"active slots",qOldest:"oldest wait",qUnavailable:"Queue stats unavailable",safety:"Safety settings",globalSafe:"Global safe mode",safeTools:"Tools",safeTurns:"Max turns",safeTimeout:"Timeout",defaultModel:"Default model",safetyHint:"Affects safe-mode keys and forced-safe traffic. Playground OTP sessions use agent mode unless global safe is on.",protection:"Protection",autoBan:"Auto-ban",on:"On",off:"Off",ruleAuth:"Auth",ruleRate:"429",ruleConn:"Conn",ruleVelocity:"Velocity",bans:"Blacklist",blocked:"Blocked hits",rateHits:"Rate-limit hits",liveConn:"Live connections",proxy:"Proxy IP",hops:"hops",limits:"Key/IP limits",models24h:"Models (24h)",runtime:"Runtime",port:"Listen port",defaultPort:"default",env:"Environment",authMode:"Admin auth",authOtp:"OTP session",encryption:"Encryption",ready:"Ready",notReady:"Not ready"},chats:{title:"Chat history",total:"Total",decrypt:"Open a row to view decrypted content.",search:"Search",searchPh:"Request ID, key name, model…",filterTitle:"Search & filters",filterHint:"Filter, then open a row for full detail.",status:"Status",allStatus:"All statuses",model:"Model",allModels:"All models",apiKey:"API key",allKeys:"All keys",from:"From",to:"To",mode:"Mode",allModes:"All modes",hasDocs:"Has attachments",filter:"Apply filters",reset:"Reset",request:"Request",prompt:"Prompt",response:"Response",time:"Time",attachments:"Attachments",page:"Page",prev:"Previous",next:"Next",perPage:"Per page",detail:"Chat detail",noAttach:"No attachments",openFile:"Open / preview",close:"Close",copyPrompt:"Copy prompt",copyContent:"Copy content",copySystem:"Copy system prompt",copyRawPrompt:"Copy raw prompt",duration:"Duration",stream:"Stream",reasoning:"Reasoning / thought",content:"Content (output)",raw:"Raw stored response",rawPrompt:"Raw stored prompt",userPrompt:"User / conversation prompt",systemPrompt:"System prompt",systemHint:"Extracted from the stored prompt (system role messages).",noSystem:"No system prompt in this request.",hasSystem:"Has system",none:"(none)",file:"file",img:"img",previewFailed:"Preview failed"},keys:{title:"API Keys",new:"New key",searchPh:"Name or key prefix…",name:"Name",role:"Role",mode:"Mode",rate:"Rate / min",status:"Status",created:"Created",edit:"Edit",revoke:"Revoke",confirmRevoke:"Revoke this key?",empty:"No keys",usage24:"24h use",maxTurns:"Max turns",timeoutMs:"Timeout (ms)",ipWhitelist:"IP whitelist",ipWhitelistHint:"One IP or CIDR per line. Empty = allow all IPs.",ipWhitelistCol:"IP allow",ipAll:"All IPs",keyOnce:"Store this key securely — shown once:",roleClient:"client",roleAdmin:"admin",roleClientBadge:"client",roleAdminBadge:"admin",modeSafe:"safe (external)",modeAgent:"agent (full tools)",modeSafeBadge:"safe",modeAgentBadge:"agent",ipCount:"{n} IPs",ipPlaceholder:`127.0.0.1
203.0.113.0/24`},docs:{title:"Documents",total:"Total",file:"File",mime:"MIME",size:"Size",time:"Time",storage:"Storage",storageDb:"Database (encrypted)",storageFs:"Filesystem (encrypted)",storageHint:"Encrypted storage · DB under {dbMax}, files in {dir} · max {upMax}.",download:"Download",downloadFail:"Download failed",binaryPreview:"This is a binary file (e.g. PDF). Preview is not available — please use Download.",delete:"Delete",confirmDel:"Delete this document?",detail:"Document detail",preview:"Preview",copy:"Copy content",empty:"No documents",searchPh:"File name or MIME…",page:"Page",prev:"Previous",next:"Next"},audit:{title:"Audit logs",searchPh:"Action, resource, IP, key…",time:"Time",action:"Action",resource:"Resource",key:"Key",meta:"Meta",empty:"No logs",id:"ID",actions:{chat_create:"Chat create",document_upload:"Document upload",document_delete:"Document delete",document_list:"Document list",document_read:"Document read",document_download:"Document download",api_key_create:"API key create",api_key_update:"API key update",api_key_delete:"API key revoke",api_key_list:"API key list",settings_update:"Settings update",chat_admin_view:"Chat admin view",system_update:"System update",system_update_check:"Update check",ip_ban:"IP ban",ip_unban:"IP unban",ddos_policy_update:"DDoS policy update",pm2_start:"PM2 start",pm2_stop:"PM2 stop",pm2_restart:"PM2 restart",pm2_reload:"PM2 reload",pm2_config:"PM2 config",pm2_switch:"PM2 switch runner",playground_chat:"Playground chat",playground_upload:"Playground upload"},resources:{document:"Document",chat:"Chat",api_key:"API key",settings:"Settings",system:"System",pm2:"PM2",playground:"Playground",ip:"IP"},metaStorage:"Storage",metaAsKey:"As key id",metaAsKeyName:"As key name"},settings:{title:"Safety settings",hint:"Global safe mode for all keys.",globalSafe:"Global safe mode",globalSafeHint:"On = all keys safe. Off = each key’s own mode.",masterOn:"Safe mode on",masterOff:"Safe mode off",disabledBanner:"Global safe is off — keys use their own safe/agent mode.",tools:"Tools mode",toolsHint:"none: no shell/web/write. readonly: read/search only.",toolsNone:"none",toolsReadonly:"readonly",maxTurns:"Max turns",maxTurnsHint:"Safe-mode steps. Chat 3–6 · API 8–12 · multi-step 15–40.",timeout:"Timeout (ms)",timeoutHint:"Safe-mode deadline. 60s–120s normal · 300s–600s long jobs.",defaultModel:"Default model",defaultModelHint:"When client omits model.",modelSource:"Grok CLI",refreshModels:"Refresh models",panel:"Admin Panel",save:"Save",saved:"Saved",guideTitle:"Presets",guideIntro:"Apply, then tweak if needed.",guideApply:"Apply",guideActive:"Applied",guideApplyConfirm:"Apply “{name}” and save? Current values will be replaced.",guideApplied:"Preset saved",chipGlobalOn:"Safe: On",chipGlobalOff:"Safe: Off",scLocalTitle:"Local playground",scLocalDesc:"Full tools on your machine.",scLocalDetail:"Safe OFF · agent keys.",scProdTitle:"Public API",scProdDesc:"Least privilege for apps/customers.",scProdDetail:"Safe ON · tools none · turns 8–12 · 60–120s.",scCodeTitle:"Coding agent",scCodeDesc:"Trusted host only — edit & run.",scCodeDetail:"Safe OFF · agent keys.",scReadTitle:"Read-only",scReadDesc:"Explain/search code, no writes.",scReadDetail:"Safe ON · tools readonly · turns 8–15 · 120–180s.",scChatTitle:"Q&A only",scChatDesc:"Text answers, no tools.",scChatDetail:"Safe ON · tools none · turns 3–6 · 60s.",scLongTitle:"Long safe tasks",scLongDesc:"Many steps without max-turns fail.",scLongDetail:"Safe ON · none/readonly · turns 20–40 · 300–600s.",dangerTitle:"Danger zone",disablePanel:"Disable Admin Panel",disablePanelConfirm:"Disable panel and sign out? Re-enable: gctoac admin on",disablePanelDone:"Panel disabled. Re-enable: gctoac admin on",panelOffHint:"Turn off here. Re-enable on server: gctoac admin on",panelStatus:"Status",panelOn:"On",panelOff:"Off"},apiFeatures:{title:"API features",intro:"Toggle protocols & capabilities · applies in ~2s · no restart.",tabProtocols:"Protocols",tabMedia:"Media",tabCaps:"Capabilities",tabEmu:"Emulation",kpiEnabled:"Enabled",kpiEnabledSub:"Flags currently on",groupMeta:"{on} / {n} enabled",groupProtocols:"Protocol surfaces",groupMedia:"Media APIs (OpenAI-compatible)",groupCaps:"Grok CLI capabilities",groupEmu:"Emulation & safety",presetOpen:"Preset: Open",presetLocked:"Preset: Locked",presetDev:"Preset: Dev",presetConfirm:"Apply feature preset “{name}”? This overwrites all API feature flags.",flag:{openaiChat:"OpenAI Chat Completions",openaiResponses:"OpenAI Responses",anthropicMessages:"Anthropic Messages",imagesApi:"Images API",filesOpenAiAlias:"Files API alias",videoApi:"Videos API (async jobs)",audioApi:"Audio API (speech / STT)",tools:"Tools / function calling",structuredOutput:"Structured output (--json-schema)",vision:"Vision / image parts (--prompt-json)",reasoningEffort:"Reasoning effort",webSearch:"Web search tools",subagents:"Subagents",planMode:"Plan mode",memory:"Cross-session memory",sessionResume:"Session resume / continue",bestOfN:"best-of-n (removed in Grok 1.0+)",checkLoop:"Self-check loop (removed in Grok 1.0+)",systemOverride:"System prompt override",rules:"Extra rules",permissionMode:"Permission mode",sandbox:"Sandbox profile",usageEstimate:"Estimate token usage",assistantsEmulation:"Assistants-lite (local)",strictSampling:"Strict sampling (reject temperature…)",forceDisableToolsInSafe:"Force tool limits in safe mode"},hint:{openaiChat:"POST /v1/chat/completions",openaiResponses:"POST /v1/responses",anthropicMessages:"POST /v1/messages",imagesApi:"POST /v1/images/generations + /edits (agent key)",filesOpenAiAlias:"POST/GET /v1/files → documents + media store",videoApi:"POST /v1/videos + poll GET /v1/videos/:id",audioApi:"POST /v1/audio/speech + /transcriptions (needs provider)",tools:"Maps tools → Grok --tools + system tool list",structuredOutput:"response_format / json_schema",vision:"image_url content parts",reasoningEffort:"--reasoning-effort",webSearch:"When off: --disable-web-search",subagents:"--no-subagents when off",planMode:"--no-plan when off",memory:"--experimental-memory",sessionResume:"--resume / --continue",bestOfN:"Deprecated — Grok Build 1.0+ rejects this flag",checkLoop:"Deprecated — Grok Build 1.0+ rejects this flag",systemOverride:"--system-prompt-override",rules:"--rules",permissionMode:"--permission-mode",sandbox:"--sandbox",usageEstimate:"Fill usage with char/4 estimates",assistantsEmulation:"Local /v1/assistants + /v1/threads",strictSampling:"400 if temperature/top_p/stop sent",forceDisableToolsInSafe:"Keep safe-mode tool policy"}},media:{title:"Media library",intro:"Studio, assets, and video jobs. Needs imagesApi / tools (videoApi for video).",tabStudio:"Studio",tabAssets:"Assets",tabJobs:"Jobs",kpiAssetsSub:"Stored media files",kpiJobsSub:"Video generation jobs",kpiStudioSub:"Generate, edit, or image-to-video",assets:"Assets",jobs:"Video jobs",empty:"No media assets yet",jobsEmpty:"No video jobs yet",kind:"Kind",bytes:"Size",provider:"Provider",providerPh:"Provider name…",prompt:"Prompt",created:"Created",status:"Status",preview:"Preview",previewUnsupported:"This format cannot be previewed in the browser. Please download the file.",previewFail:"Failed to load preview",previewTruncated:"preview truncated",download:"Download",delete:"Delete",deleteConfirm:"Soft-delete this media asset?",allKinds:"All kinds",searchPh:"Prompt, filename, MIME, provider, or ID…",from:"From",to:"To",generate:"Generate image",generateTitle:"Generate image",studioTitle:"Media studio",studioHint:"Create images, edit existing images, or start image-to-video jobs. Execution limits follow Safety settings. Requires imagesApi and tools (videoApi for video).",generateHint:"Uses Grok Imagine tools (image_gen, image_edit, image_to_video).",generatePrompt:"Prompt",generatePromptPh:"Describe the image you want to create…",generateSize:"Size",aspectRatio:"Aspect ratio",aspectHint:"Grok Imagine aspect_ratio values (not OpenAI pixel sizes)",generateN:"Count",nHint:"Grok does not batch n; the gateway runs sequential generations (1–4)",generateKey:"API key",generateKeySession:"Signed-in admin session",generateSubmit:"Generate",generateBusy:"Generating… this may take a minute",generateOk:"Image generated. See the assets list below.",generateFail:"Image generation failed",generateNeedPrompt:"Please enter a prompt",modeGenerate:"Generate",modeEdit:"Edit",modeVideo:"Video",modelDefault:"system default",modelEmpty:"No models reported by Grok CLI",modelHint:"All models from the local Grok CLI; system default is pre-selected",editSubmit:"Edit image",editBusy:"Editing…",editOk:"Image edited. See the assets list below.",editNeedImage:"Select or drop a source image to edit",editImage:"Source image",editImageHint:"Required for image_edit",editPromptPh:"Describe the changes to apply…",videoSubmit:"Create video job",videoBusy:"Queuing video job…",videoOk:"Video job queued. See the Jobs tab.",videoVoice:"Voice",videoVoiceNone:"No speech",videoVoiceHint:"Optional preset voice — uses reference_to_video",videoDuration:"Duration",videoDurationHint:"Grok image_to_video / reference_to_video: 1–15 seconds",videoSource:"Source frame (optional)",videoSourceHint:"Optional. If omitted, a frame is generated from the prompt first, then animated.",videoNoSource:"Auto-generate frame from prompt",videoPromptPh:"Describe camera motion and the shot…",sourceTitle:"Source image",sourceHint:"Drag and drop an image, choose a local file, or pick any image from Documents or Media assets.",dropzoneAria:"Drop zone for source image",dropTitle:"Drop an image here",dropHint:"Or choose a local file / pick from the system library",dropTitleVideo:"Drop a source frame (optional)",dropHintVideo:"Optional for video. Empty source generates a frame from the prompt first.",pickFile:"Choose file",pickLibrary:"System library",clearSource:"Clear",sourceNeedImage:"Please provide an image file (PNG, JPEG, WebP, GIF…)",sourceKindUpload:"Upload",sourceKindAsset:"Media asset",sourceKindDocument:"Document",libraryTitle:"Select source file",librarySubtitle:"Any image stored in Documents or Media assets on this gateway.",libraryTabDocs:"Documents",libraryTabAssets:"Media assets",librarySearch:"Search by name, MIME, or ID…",libraryFormats:"Images only (PNG, JPEG, WebP, GIF, …)",libraryEmpty:"No matching files",librarySelect:"Use selected",libraryLoadFail:"Failed to load library"},usage:{title:"Usage & anti-abuse",window:"Window",requests:"Requests",success:"Success",errors:"Errors",errorRate:"Error rate",byModel:"By model",byKey:"Per API key",rateLimit:"Limit / min",util:"Est. utilization",lastUsed:"Last used",limits:"Gateway limits",global:"Global max / window",ipMax:"Unauth IP max",burst:"Chat burst (10s)",block:"Auth fail block threshold",concurrent:"Grok max concurrent",refresh:"Refresh"},ddos:{title:"DDoS control center",tabPolicy:"Policy",tabLive:"Traffic",tabBlacklist:"Blacklist",tabEvents:"Events",live:"Live connections",recent:"Recent requests",blacklist:"IP blacklist",stats:"Abuse stats",refresh:"Refresh",pause:"Pause auto-refresh",resume:"Resume auto-refresh",ban:"Ban IP",unban:"Unban",banConfirm:"Ban this IP?",banWhitelistWarn:"This IP is on the auto-ban whitelist. Ban anyway?",unbanConfirm:"Remove this IP from blacklist?",ip:"IP",method:"Method",path:"Path",key:"API key",duration:"Duration",state:"State",ua:"User-Agent",reason:"Reason",source:"Source",expires:"Expires",permanent:"Permanent",addBan:"Add ban",ttl:"TTL",ttlPerm:"Permanent",ttl1h:"1 hour",ttl24h:"24 hours",ttl7d:"7 days",activeConn:"Active",rateHits:"Rate-limit hits",blockedHits:"Blocked hits",autoBans:"Auto bans",topIps:"Top IPs (recent)",emptyLive:"No active connections",emptyBan:"Blacklist is empty",emptyEvents:"No auto-ban events yet",reasonPh:"Optional reason",banReasonDefault:"manual from admin",ipPlaceholder:"1.2.3.4",policyTitle:"Protection policy",policyHint:"All thresholds are live — no restart. Env values are only the initial defaults.",autoOn:"Auto-judgment ON",autoOff:"Auto-judgment OFF",autoBanMaster:"Enable automatic IP bans",autoBanMasterHint:"When off, rate limits still apply but IPs are never auto-banned.",masterOn:"Auto-ban on",masterOff:"Auto-ban off",disabledBanner:"Automatic IP bans are off — rate limits still apply, but IPs will not be auto-blacklisted.",presetTitle:"Policy profile",presetHint:"Pick a profile or edit fields — custom is detected automatically.",presetRelaxed:"Relaxed",presetBalanced:"Balanced",presetStrict:"Strict",presetCustom:"Custom",presetActiveLabel:"Active: {name}",presetFormLabel:"Form: {name} (unsaved)",presetTagActive:"Active",presetTagDraft:"Draft",presetTagSaved:"Saved",presetActiveHint:"Current profile: {name}. Click Save if you changed other fields.",presetCustomHint:"Values do not match Relaxed / Balanced / Strict — treated as Custom.",presetUnsavedHint:"Form shows {form}; server still has {saved}. Click Save policy to apply.",savePolicy:"Save policy",resetPolicy:"Reset to env defaults",policySaved:"Protection policy saved. Rate limiters reloaded.",policyReset:"Policy reset to environment defaults.",confirmReset:"Reset all DDoS policy fields to .env defaults?",sectionProxy:"Reverse proxy / CDN",proxyHint:"When traffic passes through nginx or Cloudflare, enable trust hops so bans, rate limits, and audit logs use the real client IP — not the proxy IP.",proxyTrustHops:"Trusted proxy hops",proxyTrustHopsHint:"0 = direct only (ignore headers). 1 = nginx or Cloudflare→app. 2 = Cloudflare→nginx→app.",proxyIpSource:"Client IP source",proxyIpSourceHint:"auto tries CF-Connecting-IP, then X-Real-IP, then X-Forwarded-For. Use “socket” only for direct connections.",proxySrcAuto:"Auto (recommended)",proxySrcCf:"Cloudflare (CF-Connecting-IP)",proxySrcNginx:"nginx (X-Real-IP)",proxySrcXff:"X-Forwarded-For only",proxySrcSocket:"TCP socket only (no proxy)",trustedProxies:"Trusted proxy IPs / CIDRs",trustedProxiesHint:"Only these peers may set CF-Connecting-IP / X-Real-IP / XFF. Default 127.0.0.1 — add your nginx/LB host if remote. Direct clients cannot spoof headers.",sectionLimits:"Rate limits",sectionAuth:"Failed authentication",sectionRate:"Rate-limit abuse (429)",sectionConn:"Connection flood",sectionVelocity:"Request velocity",sectionEscalate:"Repeat offender escalation",sectionWhitelist:"Auto-ban whitelist",whitelistHint:"One IP or CIDR per line. These IPs are never auto-banned.",rateWindow:"Window (sec)",rateMaxKey:"Max / key",rateMaxIp:"Max / IP (no key)",burstWindow:"Burst window (sec)",burstMax:"Burst max",enableRule:"Enabled",threshold:"Threshold",windowSec:"Window (sec)",banMin:"Ban duration (min)",escalateAfter:"Escalate after N auto-bans",escalateMin:"Escalated ban (min)",maxConcurrent:"Max concurrent / IP",velocityMax:"Max requests",eventsTitle:"Recent auto-ban events",eventTime:"When",eventSource:"Rule",eventDuration:"Ban for",sources:{manual:"Manual","auto-auth":"Auto · auth","auto-rate":"Auto · 429","auto-conn":"Auto · concurrent","auto-velocity":"Auto · velocity","auto-escalate":"Auto · escalated"}},pm2:{title:"PM2 control",tabRunner:"Runner",tabPort:"Port",tabConfig:"Config",tabLogs:"Logs",status:"Process status",start:"Start with PM2",stop:"Stop PM2",restart:"Restart",reload:"Reload",logs:"Logs",logsHint:"Error log first",clearLogs:"Clear logs",confirmClearLogs:"Clear PM2 and gctoac log files? This cannot be undone (files are truncated).",logsCleared:"Cleared {n} log file(s).",logsAutoTrim:"Auto-trim over {maxMb} MB → keep last ~{keepKb} KB (on each log read).",refresh:"Refresh",confirmStop:"Stop the PM2 process?",confirmRestart:"Restart under PM2? Port will be handed over cleanly.",unavailable:"PM2 not available",disabled:"PM2 admin is disabled",app:"App name",pid:"PID",uptime:"Uptime",memory:"Memory",cpu:"CPU",restarts:"Restarts",portBusy:"Port in use",port:"Port",portTitle:"Listen port",portHint:"HTTP port for the gateway Admin UI and API. Changing the port updates .env and restarts the runner so the new port takes effect.",fieldPort:"Port",portDefaultNote:"Default is 3847. Valid range: 1–65535.",savePort:"Save port & restart",useDefaultPort:"Use default (3847)",portInvalid:"Enter a valid port number (1–65535).",confirmPortChange:"Change listen port to {port} and restart the gateway? You will need to open Admin on the new port (e.g. http://localhost:{port}/admin).",portChangedMsg:"Port updated: {from} → {to}.",portSavedNeedRestart:"Port {port} saved to .env. Restart the gateway for it to take effect.",portAfterRestart:"After restart, open Admin at http://localhost:{port}/admin",hint:"Run with PM2 or detached gctoac. Switch anytime here or via CLI.",switchTitle:"Runner",switchHint:"Only one runner should bind the port.",currentRunner:"Current runner",runnerPm2:"PM2",runnerGctoac:"gctoac (detached)",runnerNone:"Not running",runnerUnknown:"Unknown / mixed",switchToPm2:"Switch to PM2",switchToGctoac:"Switch to gctoac",confirmSwitchPm2:"Switch to PM2? Gateway restarts under PM2 in a few seconds.",confirmSwitchGctoac:"Switch to gctoac? Gateway restarts as a detached process in a few seconds.",switchScheduled:"Switch scheduled. Admin will refresh automatically in about 10 seconds.",autoRefreshIn:"This page will reload automatically in {n} seconds…",autoRefreshNow:"Reloading…",gctoacPid:"gctoac PID",configTitle:"PM2 config",configHint:"Saved to pm2.runtime.json and applied via ecosystem.config.cjs. Save & apply restarts PM2 if it is the active runner.",saveConfig:"Save & apply",saveOnly:"Save only",resetConfig:"Reset defaults",confirmReset:"Reset PM2 config to defaults?",configSaved:"Config saved",fieldName:"App name",fieldScript:"Script",fieldCwd:"Working directory (cwd)",fieldInstances:"Instances",fieldExecMode:"Exec mode",fieldAutorestart:"Autorestart",fieldWatch:"Watch",fieldMaxMem:"Max memory restart",fieldMaxRestarts:"Max restarts",fieldMinUptime:"Min uptime",fieldRestartDelay:"Restart delay (ms)",fieldBackoff:"Exp backoff restart delay (ms)",fieldMergeLogs:"Merge logs",fieldTime:"Log timestamps",fieldErrorFile:"Error log file",fieldOutFile:"Out log file",fieldEnvExtra:"Extra env (KEY=value per line)",fieldPreferred:"Preferred runner",empty:"App not in pm2 list",modeFork:"fork",modeCluster:"cluster",phCwd:"(package root)",phInstances:"1 or max",phEnv:"NODE_ENV=production",statusOnline:"online",statusErrored:"errored",statusStopped:"stopped",msgOk:"OK",msgDisabled:"PM2 admin is disabled (PM2_ADMIN_ENABLED=false).",msgBinaryMissing:"pm2 not found on PATH. Install: npm install -g pm2",msgNotInList:'App "{app}" is not in the PM2 list — use Start with PM2 or Switch to PM2.',msgPortGctoac:"Port {port} is held by gctoac (pid {pid}). Use “Switch to PM2” to hand over.",msgPortBusy:"Port {port} is in use (pid {pids}).",msgErrored:"PM2 process errored — check logs / config, then Restart or fix port conflicts.",msgBothRunners:"Both runners detected; gctoac pid {pid} also holds resources. Prefer one via Switch.",msgError:"PM2 error: {error}",msgSwitchPm2:"Switching to PM2… The gateway will restart under PM2 in a few seconds.",msgSwitchGctoac:"Switching to gctoac… The gateway will restart as a detached process in a few seconds."},system:{title:"System",tabSoftware:"Software",tabSessions:"Grok sessions",sessionsHint:"Local Grok Build sessions on this machine (not gateway chat logs).",sessionsSearch:"Search title, summary, or id…",sessionDelete:"Delete",sessionDeleteConfirm:"Permanently delete Grok session {id}? This cannot be undone.",sessionId:"Session",sessionTitle:"Title",sessionCwd:"cwd",sessionUpdated:"Updated",tabPackage:"Package",tabEnv:"Environment",envHint:"Runtime env & version snapshot.",checkUpdate:"Check for updates",oneClick:"Update package & restart",selfUpdate:"Package version",selfHint:"Compare versions · update package restarts the gateway.",current:"This install",npm:"npm latest",github:"GitHub latest",install:"Install channel",confirmUpdate:"Update the package and restart the gateway? API will be briefly unavailable.",scheduled:"Update scheduled. Refresh this page in ~30s.",database:"Database",grokCli:"Grok CLI",grokInspect:"Grok Build environment",grokInspectHint:"Read-only snapshot from grok inspect --json (skills, MCP, plugins on this machine).",grokVersion:"Grok version",inspectChannel:"Channel",inspectDefaultModel:"Default model",inspectModels:"Models",inspectSkills:"Skills",inspectMcp:"MCP servers",inspectPlugins:"Plugins",inspectHooks:"Hooks",concurrency:"Concurrency",runtime:"Runtime health",software:"Required software",softwareHint:"Required tools and installed versions.",softName:"Software",softLevel:"Need",softInstalled:"Installed",softVersion:"Version",softStatus:"Status",softDetail:"Note",levelRequired:"Required",levelRecommended:"Recommended",levelOptional:"Optional",levelBundled:"Bundled",softOk:"OK",softMissing:"Missing",softWarn:"Warning",envTitle:"Environment",up:"Up",down:"Down",yes:"Yes",no:"No",badgeUpdate:"Update available",badgeOk:"Up to date",badgeAhead:"Newer than npm",badgeUnknown:"Unknown",statusHintUpdate:"A newer published version is available. Use “Update package & restart”.",statusHintOk:"This install matches the latest known release.",statusHintAhead:"Local version is newer than npm (typical for git / dev). “Update package” still pulls latest git commits if on the git channel.",statusHintUnknown:"Could not reach npm/GitHub to compare versions.",checkResult:"Version check",channelGit:"git (dev tree)",channelNpmGlobal:"npm global",channelNpmLocal:"npm local",channelUnknown:"unknown",encryption:"Encryption",ready:"Ready",notReady:"Not ready",allRequiredOk:"All required software present",requiredMissing:"Some required software is missing"},support:{title:"Support",subtitle:"Creator, sponsors, and YSK Limited — free product, real help",pillSupport:"Support",pillSponsor:"Sponsor · Linktree",pillHelp:"Questions? email@ysk.hk",creatorTitle:"Creator",creatorBody:"This Grok → OpenAI gateway is free and open source, for people who want to run Grok CLI themselves. Feedback and bug reports keep the project going.",sponsorTitle:"Support / sponsor",sponsorBody:"If this gateway saves you time, consider sponsoring development. Every bit helps keep it free for everyone.",githubSponsors:"GitHub Sponsors",linktree:"Linktree",walletsTitle:"Crypto / Web3 addresses",walletsHint:"Send only on the matching network. Double-check the address before you transfer.",net:"Network",addr:"Address",copy:"Copy",netEvm:"EVM (ETH/BSC/AVAX)",netNear:"NEAR",netAda:"ADA (Cardano)",yskTitle:"YSK Limited",yskBody:"Need hands-on help beyond the free Admin panel? YSK Limited can provide:",yskLi1:"Server install, hardening, and day-to-day ops",yskLi2:"Hosting stack (web, email, DNS, databases)",yskLi3:"Migration, automation, and custom integration",yskLi4:"Incident response and go-live checks",yskPrice:"No public price list — email us and we will scope it to your setup.",site:"ysk.hk",helpTitle:"Have a problem?",helpBody:"Email with OS, install / log path, and expected vs actual result. Every message is read.",docs:"Full docs are in the repo README"},common:{empty:"No data",active:"active",revoked:"revoked",save:"Save",cancel:"Close",loading:"Loading…",powered:"Powered by",actions:"Actions",yes:"Yes",no:"No",ok:"OK",confirm:"Confirm",notice:"Notice",confirmTitle:"Please confirm",dangerTitle:"Confirm action",apply:"Apply",reset:"Reset",search:"Search",prev:"Previous",next:"Next",perPage:"Per page",pagerTotal:"Total {n}",pagerPage:"Page {n} / {total}",filterTitle:"Search & filters",filterHint:"Narrow results, then apply",sortHint:"Click to sort (API). Default: newest first",all:"All",requestFailed:"Request failed",featureOff:"Off",ms:"{n} ms",perMin:"{n}/min",minutes:"{n} min",mb:"{n} MB",percent:"{n}%",ipLabel:"IP",uaLabel:"UA",httpStatus:"HTTP"},errors:{unauthorized:"Invalid or missing credentials. Please sign in again.",forbidden:"You do not have permission for this action.",not_found:"The requested resource was not found.",validation_error:"Invalid request. Please check your input.",rate_limit_exceeded:"Rate limit exceeded. Please try again later.",concurrency_limit_exceeded:"Too many concurrent Grok jobs. Please wait and retry.",internal_error:"An internal server error occurred.",grok_error:"Grok CLI returned an error.",grok_timeout:"Grok CLI timed out.",grok_not_available:"Grok CLI is not available on this server.",document_too_large:"The document exceeds the maximum allowed size.",document_type_not_allowed:"This document type is not allowed.",invalid_cwd:"The working directory is not allowed.",service_unavailable:"The service is temporarily unavailable.",queue_full:"The chat queue is full. Please try again later.",queue_draining:"The chat queue is paused or draining.",queue_wait_timeout:"Timed out while waiting in the chat queue.",queue_cancelled:"The chat job was cancelled.",media_not_supported:"This media feature is not available or is disabled.",media_provider_unavailable:"The media provider is not available.",media_generation_failed:"Media generation failed.",media_forbidden:"Media generation is not allowed for this API key. Use an agent-mode key or an admin session.",feature_disabled:"This API feature is disabled.",feature:{imagesApi:"Images API is disabled. Enable it under Admin → API features → Images API.",videoApi:"Video API is disabled. Enable it under Admin → API features → Videos API.",audioApi:"Audio API is disabled. Enable it under Admin → API features → Audio API.",tools:"Tools are disabled. Enable Tools under Admin → API features (required for image generation).",filesOpenAiAlias:"OpenAI Files API alias is disabled. Enable it under Admin → API features → Files API alias."},media:{agent_or_admin_required:"Image generation requires an agent-mode API key or an admin session. Safe-mode keys cannot use image tools.",source_required:"Provide an image file, a media asset, or a document as the source.",source_must_be_image:"The selected source must be an image for edit or video generation.",no_image_in_sandbox:"Grok finished but no image file was found in the sandbox or this run's session images/. This is not an imagesApi or API-key problem.",no_video_in_sandbox:"Grok finished but no video file was found in the sandbox or this run's session.",provider_no_edit:"The current media provider does not support image edits."}}},"zh-Hant":{brand:"Grok Gateway",brandSub:"管理面板",loginTitle:"管理員登入",loginLabel:"API 金鑰",loginOtpLabel:"一次性登入碼",loginBtn:"登入",loginCmdHint:"終端機取得 key：",loginOtpHint:"每次登入請在終端機產生新碼：",loginOtpExpiry:"登入碼 5 分鐘內有效，且只能使用一次。",loginOtpFail:"登入碼無效或已過期",loginLostKey:"舊 key 無法找回（只存 hash），請建立新的 admin key。",loginCopy:"複製",loginCopied:"已複製",needKey:"請輸入 API 金鑰",needOtp:"請輸入終端機產生的一次性登入碼",logout:"登出",shell:{menu:"開啟選單",closeMenu:"關閉選單"},nav:{dashboard:"儀表板",chat:"對話",chats:"對話記錄",keys:"API 金鑰",documents:"文件",media:"媒體庫",audit:"稽核日誌",settings:"安全設定",apiFeatures:"API 能力",usage:"用量與防護",ddos:"DDoS 中心",queue:"佇列",pm2:"PM2",system:"系統狀態",support:"支持"},queue:{title:"對話佇列",subtitle:"暫停、排空、重新入隊，並調整併發。",paused:"已暫停",running:"消費中",drain:"排空模式",mode:"模式",modeOff:"已停用",depth:"佇列深度",queued:"排隊中",leased:"已認領",activeJobs:"執行中",dead:"死信",oldest:"最長等待",concurrency:"每 Key / 全域",worker:"進程內 worker",workerInstance:"Worker 實例",workerInstanceHint:"本進程消費者 ID（租約持有者）。重啟後會變更。",kpiActiveSub:"本進程進行中 {n} 個",consumer:"消費者",admission:"接單",accepting:"接受新單",pause:"暫停消費",resume:"恢復消費",drainBtn:"排空",undrain:"停止排空",savePolicy:"儲存政策",refresh:"重新整理",jobs:"工作列表",tabOverview:"總覽",tabJobs:"工作列表",tabPolicy:"政策",jobsMeta:"共 {n} 筆",cancel:"取消",requeue:"重新入隊",purgeDead:"清理死信與舊工作",purgeTitle:"確認清理工作？",purgeConfirm:"會立即刪除全部死信（DLQ），以及完成已超過 24 小時的成功／失敗／取消工作。",purgeConfirmBtn:"確認刪除",purgeDoneTitle:"清理完成",purgeDoneMsg:"已刪除 {n} 筆工作。",cancelConfirm:"取消此工作？若正在執行，取消為協作式（cooperative）。",empty:"沒有符合篩選的工作",enabled:"啟用佇列",masterOn:"佇列已開",masterOff:"佇列已關",masterHint:"對話佇列總開關，即時生效。",disabledBanner:"佇列已關閉 — 新對話會跳過排隊、即時執行（仍受併發上限約束）。",globalConcurrency:"全域併發",perKeyConcurrency:"每 Key 併發",maxDepth:"全域佇列上限",maxDepthKey:"每 Key 上限",fairness:"公平策略",fifo:"全域 FIFO",wrr:"加權輪詢",playgroundPriority:"Playground 優先級（越小越先）",defaultPriority:"預設優先級",leaseMs:"租約（ms）",maxWaitMs:"最長等待（ms）",filterTitle:"篩選工作",filterHint:"依狀態篩選。會自動重新整理。",filterStatus:"狀態",allStatuses:"全部狀態",filterDead:"死信（DLQ）",filterQueued:"排隊中",filterRunning:"執行中 / 已認領",filterFailed:"失敗",filterSucceeded:"成功",filterCancelled:"已取消",errorCol:"錯誤",priorityBtn:"優先級",priorityPh:"優先級（0–1000，越小越先）",dlqTitle:"死信佇列",dlqHint:"已用盡重試次數 — 可重新入隊或清理。",viewDlq:"查看死信",statusPanel:"運行狀態",statusPanelHint:"消費者、接單與 worker 實例即時狀態；每隔數秒自動重新整理。",policyTitle:"佇列政策",policyHint:"可先選方案再微調數值；儲存後生效。編輯時會暫停自動重新整理。",presetTitle:"政策方案",presetHint:"一鍵套用。Active＝表單目前值 · Saved＝已儲存。",presetRelaxed:"寬鬆",presetBalanced:"均衡",presetStrict:"嚴格",presetCustom:"自訂",presetRelaxedHint:"較高併發、較深佇列 — 適合多 key／Playground 與突發流量。",presetBalancedHint:"預設生產平衡：公平輪詢、中等深度、每 key 同時只跑 1 個。",presetStrictHint:"較低上限 + 全域 FIFO — 流量不可信或主機資源緊張時使用。",presetCustomHint:"數值不符合內建方案。可繼續微調，或於上方選取一個方案。",presetActiveLabel:"目前：{name}",presetFormLabel:"草稿：{name}",presetTagActive:"目前",presetTagDraft:"草稿",presetTagSaved:"已套用",hintGlobalConc:"全域同時執行的工作上限",hintPerKeyConc:"單一 API key 同時執行上限",hintMaxDepth:"佇列總深度滿時拒收新單",hintMaxDepthKey:"該 key 排隊／執行過多時拒收",hintFairness:"WRR 按 key 輪流；FIFO 按全域優先級與時間",hintLease:"Worker 持有工作多久未完成會被回收",hintMaxWait:"客戶端排隊最長等待時間",colJob:"工作 / 請求",colSource:"來源",colStatus:"狀態",colModel:"模型",colPri:"優先",colKey:"API 金鑰",colTry:"嘗試",colTime:"入隊時間",stQueued:"排隊",stLeased:"已認領",stRunning:"執行中",stSucceeded:"成功",stFailed:"失敗",stDead:"死信",stCancelled:"已取消",srcV1:"API",srcPlayground:"Playground",kpiDepthSub:"{q} 排隊 · {l} 認領",kpiQueuedSub:"等待 worker",kpiDeadSub:"重試已盡",kpiOldestSub:"隊頭等待時間",wait:"等待",started:"開始",cancelReq:"已請求取消"},chat:{title:"對話",new:"新對話",send:"傳送",stop:"停止",stopped:"已停止",placeholder:"輸入訊息…（Enter 傳送，Shift+Enter 換行）",keyMode:"API 金鑰",keySelect:"API 金鑰",useSessionKey:"目前登入的 admin 金鑰",useCustomKey:"自訂金鑰",customKey:"金鑰",includeReasoning:"顯示思考",resume:"繼續 session",resumePh:"Grok session UUID",resumeHint:"用 --resume 接續 Grok CLI session",fork:"Fork",memory:"記憶",noPlan:"關 plan",permission:"權限",effort:"推理力度",effortDefault:"預設",effort_none:"無",effort_minimal:"最低",effort_low:"低",effort_medium:"中",effort_high:"高",effort_xhigh:"極高",effort_max:"最大",tokens:"Tokens",cacheTokens:"快取",cost:"費用",reasoning:"思考過程",needKey:"請輸入或選擇 API 金鑰",attach:"上傳",attachLibrary:"從已上傳選擇",attachHint:"可於本頁任意位置拖放檔案、上傳，或從已上傳庫挑選",dropTitle:"放開以附加檔案",dropHint:"放開即上傳 — 格式與「上傳」按鈕相同",formatsLabel:"格式",formatsHint:"txt、md、csv、json、xml、html、pdf、圖片（png/jpg/webp/gif）、程式碼（js/ts/py/go/rs/java/c/cpp/css/yml/sql/sh…）",formatsReject:"不支援的格式：{name}。允許：{formats}",libraryTitle:"已上傳的檔案",librarySubtitle:"選擇目前 API 金鑰名下的檔案（格式與上傳相同）。",librarySearch:"依檔名搜尋…",libraryEmpty:"此金鑰沒有符合的檔案",libraryAdd:"加入所選",librarySelected:"已選 {n} 個",libraryAlready:"已附加",libraryLoadFail:"無法載入檔案列表",uploading:"上傳中…",uploadFail:"上傳失敗",uploadProgress:"正在上傳 {name}",uploadProgressMulti:"正在上傳 {name}（{i}/{n}）",emptyTitle:"開始對話",emptyHint:"輸入訊息或附加檔案。可從右側歷史開啟舊對話繼續。",needContent:"請輸入訊息或至少附加一個檔案",tooManyFiles:"檔案太多（每則訊息最多 10 個）",fileOnlyPrompt:"請查看附加的檔案。",removeFile:"移除",docs:"附件",you:"你",assistant:"助理",streaming:"串流中…",emptyReply:"（無回覆內容）",systemPrompt:"系統提示",systemPlaceholder:"可選：模型系統指示（system 訊息）…",systemHint:"每次傳送會以 system 角色附帶，不會顯示於對話氣泡。",history:"歷史對話",historyEmpty:"尚未有已儲存的對話",historySearch:"搜尋主題…",historyOpen:"顯示歷史",historyClose:"關閉歷史",rename:"重新命名",renamePh:"對話主題",untitled:"未命名對話",deleteConversation:"刪除",deleteConfirm:"確定刪除此對話？此操作無法還原。",saveFail:"無法儲存對話",loadFail:"無法載入對話",historyPrev:"上一頁",historyNext:"下一頁",historyPage:"第 {n} / {total} 頁",msgs:"{n} 則訊息",settings:"設定",settingsHide:"收起設定",compress:"產生語境摘要",compressConfirm:"為之後回合產生對話摘要以節省 token？畫面上的完整對話記錄不會被刪除或改寫，只影響傳送給模型的內容。此操作會呼叫模型一次。",compressing:"正在產生摘要…",compressNeedMore:"至少需要 3 則訊息（或 2 則較長內容）才可產生摘要。請先繼續對話再試。",compressFail:"無法產生摘要",compressNeedSummary:"請先按「產生語境摘要」建立摘要。",compressedBadge:"摘要",compressOk:"摘要已就緒（完整記錄仍保留）。已切換為「摘要 + 最近訊息」模式。",compressBusy:"請等待目前回覆完成",compressResultTitle:"對話摘要",compressView:"查看摘要",summaryMeta:"產生時間：{when} · 依據 {n} 則訊息",ctxPolicyTitle:"模型上下文",ctxRemark:"完整訊息仍顯示於對話區。此設定只控制下一次傳送給模型的內容。",ctxMode:"上下文",ctxModeFull:"完整記錄",ctxModeSummary:"摘要 + 最近",ctxModeRecent:"僅最近",ctxModeFullLabel:"目前送出完整對話記錄",ctxModeSummaryLabel:"目前送出摘要 + 最近 {n} 則",ctxModeRecentLabel:"目前只送出最近 {n} 則",ctxRecentN:"最近則數",ctxLongHint:"對話較長 — 建議改用「摘要 + 最近」或「僅最近」，以減少 token 並避免介面卡頓。",loadOlder:"載入較早的 {n} 則訊息",showMore:"顯示更多",showLess:"收合",copy:"複製",copied:"已複製",copyFail:"複製失敗"},status:{success:"成功",error:"錯誤",timeout:"逾時",pending:"處理中",active:"進行中",finished:"已完成",online:"運行中",stopped:"已停止"},dash:{title:"儀表板",subtitle:"流量、佇列、安全與防護一覽。",last24:"最近 24h 請求",totalChat:"總對話",success:"成功",errors:"錯誤/逾時",docs:"文件",keys:"活躍金鑰",concurrent:"Grok 併發",recent:"最近 API 請求",empty:"暫無資料",emptyModels:"最近 24h 尚無模型用量",updated:"更新於",refresh:"重新整理",viewAll:"查看全部",openDdos:"DDoS 中心",openSettings:"安全設定",openQueue:"開啟佇列",kpi24h:"請求（24h）",kpi24hSub:"{ok} 成功 · {err} 錯誤",kpiSuccessRate:"成功率（24h）",kpiSuccessRateSub:"全部時間 {all}%",kpiErrors:"錯誤（24h）",kpiErrorsSub:"全部時間 {all}",kpiKeys:"API 金鑰",kpiKeysSub:"活躍 / 總數",kpiDocs:"文件",kpiMedia:"媒體資產",kpiMediaSub:"24 小時 {n} 個",kpiDocsSub:"已儲存檔案",kpiConv:"Playground 對話",kpiConvSub:"24h 內更新 {n} 則",kpiSessions:"OTP 工作階段",kpiSessionsSub:"目前有效的管理員登入",kpiConcurrent:"Grok 併發",kpiConcurrentSub:"進行中 / 上限",kpiQueue:"對話佇列",kpiQueueSub:"深度 · 執行 / 上限 · 死信",kpiQueueSubLive:"{run}/{max} 執行 · {dead} 死信{wait}",kpiQueuePaused:"已暫停",kpiQueueDrain:"排空",kpiQueueOff:"已停用",kpiSafe:"全域安全",kpiSafeOn:"開",kpiSafeOff:"關",kpiSafeSub:"{tools} · turns {turns} · {model}",kpiSafeSubEmpty:"無法讀取設定",queuePanel:"對話佇列",queueState:"狀態",queueLive:"運作中",qQueued:"排隊中",qRunning:"執行中",qDead:"死信",qSucceeded:"已成功",qWorker:"Worker",qWorkerActive:"活躍槽",qOldest:"最舊等待",qUnavailable:"無法取得佇列統計",safety:"安全設定",globalSafe:"全域安全模式",safeTools:"工具",safeTurns:"最大 turns",safeTimeout:"逾時",defaultModel:"預設模型",safetyHint:"影響 safe 模式金鑰與強制 safe 的流量。Playground OTP 預設 agent；開啟全域安全後會套用 safe 限制。",protection:"防護狀態",autoBan:"自動封鎖",on:"開",off:"關",ruleAuth:"認證",ruleRate:"429",ruleConn:"並發",ruleVelocity:"速率",bans:"黑名單",blocked:"已攔截",rateHits:"限流次數",liveConn:"即時連線",proxy:"代理 IP",hops:"層數",limits:"金鑰/IP 上限",models24h:"模型用量（24h）",runtime:"運行環境",port:"監聽連接埠",defaultPort:"預設",env:"環境",authMode:"管理登入",authOtp:"OTP 工作階段",encryption:"加密",ready:"就緒",notReady:"未就緒"},chats:{title:"對話記錄",total:"共",decrypt:"點選列項可查看解密後內容。",search:"搜尋",searchPh:"請求 ID、金鑰名稱、模型…",filterTitle:"搜尋與篩選",filterHint:"篩選後點列項查看詳情。",status:"狀態",allStatus:"全部狀態",model:"模型",allModels:"全部模型",apiKey:"API 金鑰",allKeys:"全部金鑰",from:"由",to:"至",mode:"模式",allModes:"全部模式",hasDocs:"有附件",filter:"套用篩選",reset:"重設",request:"請求",prompt:"提示",response:"回覆",time:"時間",attachments:"附件",page:"頁",prev:"上一頁",next:"下一頁",perPage:"每頁",detail:"對話詳情",noAttach:"無附件",openFile:"開啟 / 預覽",close:"關閉",copyPrompt:"複製提示",copyContent:"複製內容",copySystem:"複製 system prompt",copyRawPrompt:"複製原始 prompt",duration:"耗時",stream:"串流",reasoning:"思考過程",content:"輸出內容",raw:"原始儲存回覆",rawPrompt:"原始儲存 prompt",userPrompt:"用戶／對話 prompt",systemPrompt:"System prompt",systemHint:"從已儲存 prompt 中抽出 system 角色內容。",noSystem:"此請求沒有 system prompt。",hasSystem:"有 system",none:"（無）",file:"檔案",img:"圖片",previewFailed:"預覽失敗"},keys:{title:"API 金鑰",new:"新增金鑰",searchPh:"名稱或 key 前綴…",name:"名稱",role:"角色",mode:"模式",rate:"速率 / 分",status:"狀態",created:"建立",edit:"編輯",revoke:"撤銷",confirmRevoke:"確定撤銷此金鑰？",empty:"暫無",usage24:"24h 用量",maxTurns:"最大 turns",timeoutMs:"逾時 (ms)",ipWhitelist:"IP 白名單",ipWhitelistHint:"每行一個 IP 或 CIDR。留空 = 不限制 IP。",ipWhitelistCol:"IP 允許",ipAll:"全部 IP",keyOnce:"請妥善保存（明文只顯示一次）：",roleClient:"用戶 (client)",roleAdmin:"管理員 (admin)",roleClientBadge:"用戶",roleAdminBadge:"管理員",modeSafe:"safe（對外）",modeAgent:"agent（全能力）",modeSafeBadge:"安全",modeAgentBadge:"代理",ipCount:"{n} 個 IP",ipPlaceholder:`127.0.0.1
203.0.113.0/24`},docs:{title:"文件",total:"共",file:"檔名",mime:"類型",size:"大小",time:"時間",storage:"儲存位置",storageDb:"資料庫（加密）",storageFs:"檔案系統（加密）",storageHint:"加密儲存 · 小於 {dbMax} 入 DB，其餘於 {dir} · 上限 {upMax}。",download:"下載",downloadFail:"下載失敗",binaryPreview:"此為二進位檔（例如 PDF），無法在此預覽，請使用「下載」。",delete:"刪除",confirmDel:"確定刪除此文件？",detail:"文件詳情",preview:"預覽",copy:"複製內容",empty:"暫無",searchPh:"檔名或 MIME…",page:"頁",prev:"上一頁",next:"下一頁"},audit:{title:"稽核日誌",searchPh:"動作、資源、IP、金鑰…",time:"時間",action:"動作",resource:"資源",key:"金鑰",meta:"詳情",empty:"暫無日誌",id:"識別碼",actions:{chat_create:"建立對話",document_upload:"上傳文件",document_delete:"刪除文件",document_list:"列出文件",document_read:"讀取文件",document_download:"下載文件",api_key_create:"建立金鑰",api_key_update:"更新金鑰",api_key_delete:"撤銷金鑰",api_key_list:"列出金鑰",settings_update:"更新設定",chat_admin_view:"管理員查看對話",system_update:"系統更新",system_update_check:"檢查更新",ip_ban:"封鎖 IP",ip_unban:"解除 IP 封鎖",ddos_policy_update:"DDoS 策略更新",pm2_start:"PM2 啟動",pm2_stop:"PM2 停止",pm2_restart:"PM2 重啟",pm2_reload:"PM2 重載",pm2_config:"PM2 設定",pm2_switch:"PM2 切換 runner",playground_chat:"對話試玩",playground_upload:"試玩上傳"},resources:{document:"文件",chat:"對話",api_key:"API 金鑰",settings:"設定",system:"系統",pm2:"PM2",playground:"試玩",ip:"IP"},metaStorage:"儲存方式",metaAsKey:"代行金鑰 ID",metaAsKeyName:"代行金鑰名稱"},settings:{title:"安全設定",hint:"全域安全模式，套用至所有金鑰。",globalSafe:"全域安全模式",globalSafeHint:"開＝全部 safe。關＝跟各金鑰自身模式。",masterOn:"安全模式：開",masterOff:"安全模式：關",disabledBanner:"全域安全已關 — 各金鑰用自身 safe／agent 設定。",tools:"工具模式",toolsHint:"none：禁 shell／上網／寫入。readonly：只讀搜尋。",toolsNone:"none",toolsReadonly:"readonly",maxTurns:"最大 turns",maxTurnsHint:"safe 步數。問答 3–6 · API 8–12 · 多步驟 15–40。",timeout:"逾時（ms）",timeoutHint:"safe 時限。一般 60–120s · 長任務 300–600s。",defaultModel:"預設模型",defaultModelHint:"客戶端未指定 model 時使用。",modelSource:"Grok CLI",refreshModels:"重新整理模型",panel:"管理面板",save:"儲存",saved:"已儲存",guideTitle:"建議預設",guideIntro:"套用後可再微調。",guideApply:"套用",guideActive:"已應用",guideApplyConfirm:"套用「{name}」並儲存？會覆寫目前數值。",guideApplied:"已套用",chipGlobalOn:"安全：開",chipGlobalOff:"安全：關",scLocalTitle:"本機試用",scLocalDesc:"本機完整能力。",scLocalDetail:"安全關 · agent 金鑰。",scProdTitle:"對外 API",scProdDesc:"產品端點，最小權限。",scProdDetail:"安全開 · none · turns 8–12 · 60–120s。",scCodeTitle:"程式代理",scCodeDesc:"可信主機改檔／跑指令。",scCodeDetail:"安全關 · agent 金鑰。",scReadTitle:"只讀分析",scReadDesc:"解碼／搜尋，不寫入。",scReadDetail:"安全開 · readonly · turns 8–15 · 120–180s。",scChatTitle:"純問答",scChatDesc:"只回覆文字，不需使用工具。",scChatDetail:"安全開 · none · turns 3–6 · 60s。",scLongTitle:"長任務（safe）",scLongDesc:"多步驟，減少 max turns 失敗。",scLongDetail:"安全開 · none/readonly · turns 20–40 · 300–600s。",dangerTitle:"危險操作",disablePanel:"關閉管理面板",disablePanelConfirm:"關閉面板並登出？重開：gctoac admin on",disablePanelDone:"面板已關。重開：gctoac admin on",panelOffHint:"此處可關閉。重開請在伺服器執行 gctoac admin on。",panelStatus:"狀態",panelOn:"開",panelOff:"關"},apiFeatures:{title:"API 能力",intro:"開關協議與能力 · 約 2 秒生效 · 無需重啟。",tabProtocols:"協議",tabMedia:"媒體",tabCaps:"能力",tabEmu:"模擬",kpiEnabled:"已啟用",kpiEnabledSub:"目前開啟的開關",groupMeta:"已開 {on} / {n}",groupProtocols:"協議表面",groupMedia:"媒體 API（OpenAI 兼容）",groupCaps:"Grok CLI 能力",groupEmu:"模擬與安全",presetOpen:"預設：開放",presetLocked:"預設：鎖定",presetDev:"預設：開發",presetConfirm:"套用能力預設「{name}」？會覆寫全部 API 開關。",flag:{openaiChat:"OpenAI Chat Completions",openaiResponses:"OpenAI Responses",anthropicMessages:"Anthropic Messages",imagesApi:"Images API",filesOpenAiAlias:"Files API 別名",videoApi:"Videos API（異步 job）",audioApi:"Audio API（語音 / STT）",tools:"Tools / function calling",structuredOutput:"結構化輸出 (--json-schema)",vision:"視覺 / 圖片 (--prompt-json)",reasoningEffort:"推理力度",webSearch:"網絡搜尋工具",subagents:"子代理",planMode:"Plan 模式",memory:"跨 session 記憶",sessionResume:"恢復 session",bestOfN:"best-of-n（Grok 1.0+ 已移除）",checkLoop:"自我檢查迴圈（Grok 1.0+ 已移除）",systemOverride:"System prompt 覆寫",rules:"額外 rules",permissionMode:"權限模式",sandbox:"Sandbox profile",usageEstimate:"估算 token usage",assistantsEmulation:"Assistants-lite（本機）",strictSampling:"嚴格採樣（拒絕 temperature…）",forceDisableToolsInSafe:"Safe 模式強制工具限制"},hint:{openaiChat:"POST /v1/chat/completions",openaiResponses:"POST /v1/responses",anthropicMessages:"POST /v1/messages",imagesApi:"POST /v1/images/generations + /edits（要 agent key）",filesOpenAiAlias:"POST/GET /v1/files → documents + media",videoApi:"POST /v1/videos + poll GET /v1/videos/:id",audioApi:"POST /v1/audio/speech + /transcriptions（要 provider）",tools:"映射 tools → Grok --tools",structuredOutput:"response_format / json_schema",vision:"image_url content parts",reasoningEffort:"--reasoning-effort",webSearch:"關閉時加 --disable-web-search",subagents:"關閉時 --no-subagents",planMode:"關閉時 --no-plan",memory:"--experimental-memory",sessionResume:"--resume / --continue",bestOfN:"已棄用 — Grok Build 1.0+ 會拒絕此 flag",checkLoop:"已棄用 — Grok Build 1.0+ 會拒絕此 flag",systemOverride:"--system-prompt-override",rules:"--rules",permissionMode:"--permission-mode",sandbox:"--sandbox",usageEstimate:"usage 用字元/4 估算",assistantsEmulation:"本機 /v1/assistants + /v1/threads",strictSampling:"帶 temperature 等則 400",forceDisableToolsInSafe:"維持 safe 工具政策"}},media:{title:"媒體庫",intro:"工作室、資產與影片工作。需 imagesApi／tools（影片另需 videoApi）。",tabStudio:"工作室",tabAssets:"資產",tabJobs:"工作",kpiAssetsSub:"已儲存的媒體檔案",kpiJobsSub:"影片生成工作",kpiStudioSub:"生成、編輯或圖生影片",assets:"資產",jobs:"影片工作",empty:"尚無媒體資產",jobsEmpty:"尚無影片工作",kind:"類型",bytes:"大小",provider:"提供者",providerPh:"提供者名稱…",prompt:"提示詞",created:"建立時間",status:"狀態",preview:"預覽",previewUnsupported:"瀏覽器無法預覽此格式，請下載檔案後開啟。",previewFail:"無法載入預覽",previewTruncated:"預覽已截斷",download:"下載",delete:"刪除",deleteConfirm:"確定要軟刪除此媒體資產？",allKinds:"全部類型",searchPh:"提示詞、檔名、MIME、提供者或 ID…",from:"開始日期",to:"結束日期",generate:"生成圖片",generateTitle:"生成圖片",studioTitle:"媒體工作室",studioHint:"可生成圖片、編輯既有圖片，或建立圖生影片工作。執行限制依循安全設定。需啟用 imagesApi 與 tools（影片另需 videoApi）。",generateHint:"透過 Grok Imagine 工具（image_gen、image_edit、image_to_video）。",generatePrompt:"提示詞",generatePromptPh:"描述你想生成的圖像…",generateSize:"尺寸",aspectRatio:"長寬比",aspectHint:"採用 Grok Imagine 的 aspect_ratio（非 OpenAI 像素尺寸）",generateN:"數量",nHint:"Grok 不支援批量 n；閘道會依序執行 1–4 次",generateKey:"API 金鑰",generateKeySession:"目前登入的管理員工作階段",generateSubmit:"生成",generateBusy:"正在生成，可能需要一分鐘…",generateOk:"已生成圖像，請見下方資產列表。",generateFail:"圖像生成失敗",generateNeedPrompt:"請輸入提示詞",modeGenerate:"生成",modeEdit:"編輯",modeVideo:"影片",modelDefault:"系統預設",modelEmpty:"本機 Grok CLI 未回報模型",modelHint:"列出本機 Grok CLI 全部模型，並預選系統預設",editSubmit:"編輯圖像",editBusy:"正在編輯…",editOk:"已編輯圖像，請見下方資產列表。",editNeedImage:"請選擇或拖放來源圖像後再編輯",editImage:"來源圖像",editImageHint:"image_edit 必須提供來源圖像",editPromptPh:"描述要套用的變更…",videoSubmit:"建立影片工作",videoBusy:"正在將影片工作加入佇列…",videoOk:"影片工作已加入佇列，請見「影片工作」分頁。",videoVoice:"聲線",videoVoiceNone:"不加入對白",videoVoiceHint:"可選 preset voice — 會用 reference_to_video",videoDuration:"時長",videoDurationHint:"Grok image_to_video / reference_to_video：1–15 秒",videoSource:"來源幀（選填）",videoSourceHint:"選填。若未提供，會先依提示詞生成畫面，再進行動畫。",videoNoSource:"自動依提示詞生成畫面",videoPromptPh:"描述鏡頭運動與畫面內容…",sourceTitle:"來源圖像",sourceHint:"可拖放圖像、選擇本機檔案，或從文件庫／媒體資產中挑選任一圖像。",dropzoneAria:"來源圖像拖放區",dropTitle:"將圖像拖放至此",dropHint:"亦可選擇本機檔案，或從系統庫挑選",dropTitleVideo:"拖放來源幀（選填）",dropHintVideo:"影片可選填來源。未指定時，會先依提示詞生成畫面。",pickFile:"選擇檔案",pickLibrary:"系統庫",clearSource:"清除",sourceNeedImage:"請提供圖像檔（PNG、JPEG、WebP、GIF 等）",sourceKindUpload:"上傳",sourceKindAsset:"媒體資產",sourceKindDocument:"文件",libraryTitle:"選擇來源檔案",librarySubtitle:"可選取本閘道「文件」或「媒體資產」中的任一圖像。",libraryTabDocs:"文件",libraryTabAssets:"媒體資產",librarySearch:"依名稱、MIME 或 ID 搜尋…",libraryFormats:"僅圖像（PNG、JPEG、WebP、GIF 等）",libraryEmpty:"沒有符合的檔案",librarySelect:"使用所選",libraryLoadFail:"無法載入檔案庫"},usage:{title:"用量與防濫用",window:"統計區間",requests:"請求數",success:"成功",errors:"錯誤",errorRate:"錯誤率",byModel:"按模型",byKey:"按 API 金鑰",rateLimit:"上限 / 分",util:"估計使用率",lastUsed:"最近使用",limits:"Gateway 限流設定",global:"全域上限 / 視窗",ipMax:"未認證 IP 上限",burst:"對話短窗 burst（10s）",block:"認證失敗封鎖門檻",concurrent:"Grok 最大併發",refresh:"重新整理"},ddos:{title:"DDoS 控制中心",tabPolicy:"政策",tabLive:"流量",tabBlacklist:"黑名單",tabEvents:"事件",live:"即時連線",recent:"最近請求",blacklist:"IP 黑名單",stats:"濫用統計",refresh:"重新整理",pause:"暫停自動刷新",resume:"恢復自動刷新",ban:"封鎖 IP",unban:"解除封鎖",banConfirm:"確定封鎖此 IP？",banWhitelistWarn:"此 IP 在自動封鎖白名單內。仍要手動封鎖？",unbanConfirm:"確定從黑名單移除此 IP？",ip:"IP",method:"方法",path:"路徑",key:"API 金鑰",duration:"耗時",state:"狀態",ua:"瀏覽器識別 (UA)",reason:"原因",source:"來源",expires:"到期",permanent:"永久",addBan:"新增封鎖",ttl:"有效期",ttlPerm:"永久",ttl1h:"1 小時",ttl24h:"24 小時",ttl7d:"7 日",activeConn:"進行中",rateHits:"限流次數",blockedHits:"已封鎖攔截",autoBans:"自動封鎖",topIps:"熱門 IP（最近）",emptyLive:"目前無進行中連線",emptyBan:"黑名單為空",emptyEvents:"尚無自動封鎖事件",reasonPh:"可選原因",banReasonDefault:"管理員手動封鎖",ipPlaceholder:"1.2.3.4",policyTitle:"防護策略",policyHint:"所有門檻即時生效，無需重啟。環境變數僅作為初始預設值。",autoOn:"自動判斷：開",autoOff:"自動判斷：關",autoBanMaster:"啟用自動封鎖 IP",autoBanMasterHint:"關閉後仍會限流，但不會自動加入黑名單。",masterOn:"自動封鎖：開",masterOff:"自動封鎖：關",disabledBanner:"自動封鎖已關閉 — 仍會限流，但 IP 不會被自動加入黑名單。",presetTitle:"防護方案",presetHint:"點選預設方案，或自行改數值；系統會自動判斷是否為自訂。",presetRelaxed:"寬鬆",presetBalanced:"均衡",presetStrict:"嚴格",presetCustom:"自訂",presetActiveLabel:"目前：{name}",presetFormLabel:"表單：{name}（未儲存）",presetTagActive:"使用中",presetTagDraft:"草稿",presetTagSaved:"已儲存",presetActiveHint:"目前方案：{name}。若改動其他欄位請按「儲存策略」。",presetCustomHint:"目前數值不屬於寬鬆／均衡／嚴格，已判定為「自訂」。",presetUnsavedHint:"表單顯示「{form}」，伺服器仍為「{saved}」。請按「儲存策略」先套用。",savePolicy:"儲存策略",resetPolicy:"重設為環境預設",policySaved:"防護策略已儲存，限流器已重新載入。",policyReset:"已重設為環境變數預設值。",confirmReset:"確定將所有 DDoS 策略欄位重設為 .env 預設？",sectionProxy:"反向代理 / CDN",proxyHint:"流量經 nginx 或 Cloudflare 時，請設定信任層數，令封鎖、限流、稽核日誌使用真實用戶 IP，而非代理伺服器 IP。",proxyTrustHops:"信任代理層數",proxyTrustHopsHint:"0 = 直連（忽略 header）。1 = nginx 或 Cloudflare→應用。2 = Cloudflare→nginx→應用。",proxyIpSource:"客戶端 IP 來源",proxyIpSourceHint:"auto 會依序嘗試 CF-Connecting-IP、X-Real-IP、X-Forwarded-For。僅直連時先選「socket」。",proxySrcAuto:"自動（建議）",proxySrcCf:"Cloudflare（CF-Connecting-IP）",proxySrcNginx:"nginx（X-Real-IP）",proxySrcXff:"僅 X-Forwarded-For",proxySrcSocket:"僅 TCP socket（無代理）",trustedProxies:"可信代理 IP / CIDR",trustedProxiesHint:"只有這些 peer 才可設定 CF-Connecting-IP / X-Real-IP / XFF。預設 127.0.0.1（本機 nginx）。遠端代理請加入其 IP。直連客戶無法偽造 header。",sectionLimits:"限流",sectionAuth:"失敗認證",sectionRate:"限流濫用（429）",sectionConn:"連線洪水",sectionVelocity:"請求速率",sectionEscalate:"累犯升級",sectionWhitelist:"自動封鎖白名單",whitelistHint:"每行一個 IP 或 CIDR。白名單 IP 永不被自動封鎖。",rateWindow:"視窗（秒）",rateMaxKey:"金鑰上限",rateMaxIp:"未認證 IP 上限",burstWindow:"Burst 視窗（秒）",burstMax:"Burst 上限",enableRule:"啟用",threshold:"門檻",windowSec:"視窗（秒）",banMin:"封鎖時長（分）",escalateAfter:"累計自動封鎖 N 次後升級",escalateMin:"升級後封鎖（分）",maxConcurrent:"每 IP 最大並發",velocityMax:"最大請求數",eventsTitle:"最近自動封鎖事件",eventTime:"時間",eventSource:"規則",eventDuration:"封鎖時長",sources:{manual:"手動","auto-auth":"自動 · 認證","auto-rate":"自動 · 429","auto-conn":"自動 · 並發","auto-velocity":"自動 · 速率","auto-escalate":"自動 · 升級"}},pm2:{title:"PM2 控制",tabRunner:"運行方式",tabPort:"連接埠",tabConfig:"設定",tabLogs:"日誌",status:"進程狀態",start:"用 PM2 啟動",stop:"停止 PM2",restart:"重啟",reload:"重載",logs:"日誌",logsHint:"優先顯示錯誤日誌",clearLogs:"清除日誌",confirmClearLogs:"確定清除 PM2 與 gctoac 日誌檔？此操作無法復原（檔案會被清空）。",logsCleared:"已清除 {n} 個日誌檔。",logsAutoTrim:"超過 {maxMb} MB 會自動裁剪，只保留最後約 {keepKb} KB（每次讀取日誌時檢查）。",refresh:"重新整理",confirmStop:"確定停止 PM2 進程？",confirmRestart:"確定以 PM2 重啟？會妥善移交 port。",unavailable:"PM2 不可用",disabled:"已停用 PM2 管理",app:"應用名稱",pid:"進程 ID",uptime:"運行時間",memory:"記憶體",cpu:"CPU",restarts:"重啟次數",portBusy:"連接埠佔用中",port:"連接埠",portTitle:"監聽連接埠",portHint:"Gateway Admin 與 API 的 HTTP 連接埠。更改後會寫入 .env 並重啟進程，新連接埠才會生效。",fieldPort:"連接埠",portDefaultNote:"預設為 3847。有效範圍：1–65535。",savePort:"儲存連接埠並重啟",useDefaultPort:"使用預設（3847）",portInvalid:"請輸入有效連接埠（1–65535）。",confirmPortChange:"將監聽連接埠改為 {port} 並重啟 Gateway？之後請用新連接埠開啟 Admin（例如 http://localhost:{port}/admin）。",portChangedMsg:"連接埠已更新：{from} → {to}。",portSavedNeedRestart:"連接埠 {port} 已寫入 .env。請重啟後才會生效。",portAfterRestart:"重啟後請開啟 http://localhost:{port}/admin",hint:"可用 PM2 或 gctoac 運行，可在此或 CLI 切換。",switchTitle:"運行方式",switchHint:"同一時間只應有一個進程綁定連接埠。",currentRunner:"目前 runner",runnerPm2:"PM2",runnerGctoac:"gctoac（獨立進程）",runnerNone:"未運行",runnerUnknown:"未知／混合",switchToPm2:"切換到 PM2",switchToGctoac:"切換到 gctoac",confirmSwitchPm2:"確定切換到 PM2？gateway 會在數秒內以 PM2 重啟。",confirmSwitchGctoac:"確定切換到 gctoac？gateway 會在數秒內以獨立進程重啟。",switchScheduled:"已排程切換。管理面板將在約 10 秒後自動重新整理。",autoRefreshIn:"本頁將於 {n} 秒後自動重新載入…",autoRefreshNow:"正在重新載入…",gctoacPid:"gctoac 進程 ID",configTitle:"PM2 設定",configHint:"儲存至 pm2.runtime.json，經 ecosystem.config.cjs 套用。若目前用 PM2 運行，「儲存並套用」會重啟 PM2。",saveConfig:"儲存並套用",saveOnly:"只儲存",resetConfig:"還原預設",confirmReset:"確定將 PM2 設定還原為預設？",configSaved:"設定已儲存",fieldName:"應用名稱",fieldScript:"啟動腳本",fieldCwd:"工作目錄 (cwd)",fieldInstances:"實例數",fieldExecMode:"執行模式",fieldAutorestart:"自動重啟",fieldWatch:"檔案監視 (Watch)",fieldMaxMem:"記憶體上限重啟",fieldMaxRestarts:"最大重啟次數",fieldMinUptime:"最短運行時間",fieldRestartDelay:"重啟延遲 (ms)",fieldBackoff:"指數退避延遲 (ms)",fieldMergeLogs:"合併日誌",fieldTime:"日誌時間戳",fieldErrorFile:"錯誤日誌檔",fieldOutFile:"輸出日誌檔",fieldEnvExtra:"額外環境變數（每行 KEY=value）",fieldPreferred:"偏好 runner",empty:"pm2 列表中找不到此應用",modeFork:"fork",modeCluster:"cluster",phCwd:"（套件根目錄）",phInstances:"1 或 max",phEnv:"NODE_ENV=production",statusOnline:"運行中",statusErrored:"錯誤",statusStopped:"已停止",msgOk:"正常",msgDisabled:"PM2 管理已停用（PM2_ADMIN_ENABLED=false）。",msgBinaryMissing:"找不到 pm2，請執行：npm install -g pm2",msgNotInList:"應用「{app}」不在 PM2 列表中 — 請用「用 PM2 啟動」或「切換到 PM2」。",msgPortGctoac:"連接埠 {port} 正由 gctoac 佔用（pid {pid}）。請按「切換到 PM2」移交。",msgPortBusy:"連接埠 {port} 被佔用（pid {pids}）。",msgErrored:"PM2 進程出錯 — 請查日誌／設定，然後重啟或處理連接埠衝突。",msgBothRunners:"偵測到兩個 runner；gctoac pid {pid} 仍佔用資源。請用「切換」只保留一個。",msgError:"PM2 錯誤：{error}",msgSwitchPm2:"正在切換至 PM2… Gateway 將於數秒內以 PM2 重新啟動。",msgSwitchGctoac:"正在切換至 gctoac… Gateway 將於數秒內以獨立進程重新啟動。"},system:{title:"系統狀態",tabSoftware:"軟件",tabSessions:"Grok sessions",sessionsHint:"本機 Grok Build session（並非 gateway 對話紀錄）。",sessionsSearch:"搜尋標題、摘要或 id…",sessionDelete:"刪除",sessionDeleteConfirm:"永久刪除 Grok session {id}？無法復原。",sessionId:"Session",sessionTitle:"標題",sessionCwd:"cwd",sessionUpdated:"更新",tabPackage:"套件",tabEnv:"環境",envHint:"運行環境與版本快照。",checkUpdate:"檢查更新",oneClick:"更新套件並重啟",selfUpdate:"套件版本",selfHint:"對比版本 · 更新套件會重啟 gateway。",current:"本機版本",npm:"npm 最新版",github:"GitHub 最新版",install:"安裝渠道",confirmUpdate:"確定更新套件並重啟 gateway？期間 API 會短暫中斷。",scheduled:"已排程更新，請約 30 秒後重新整理頁面。",database:"資料庫",grokCli:"Grok CLI",grokInspect:"Grok Build 環境",grokInspectHint:"只讀快照（grok inspect --json）：本機 skills、MCP、plugins。",grokVersion:"Grok 版本",inspectChannel:"頻道",inspectDefaultModel:"預設模型",inspectModels:"模型數",inspectSkills:"Skills",inspectMcp:"MCP",inspectPlugins:"Plugins",inspectHooks:"Hooks",concurrency:"併發",runtime:"運行狀態",software:"系統軟件",softwareHint:"所需軟件與已安裝版本。",softName:"軟件",softLevel:"需求",softInstalled:"已安裝",softVersion:"版本",softStatus:"狀態",softDetail:"說明",levelRequired:"必須",levelRecommended:"建議",levelOptional:"可選",levelBundled:"內建",softOk:"正常",softMissing:"未安裝",softWarn:"注意",envTitle:"環境變數",up:"正常",down:"異常",yes:"是",no:"否",badgeUpdate:"有新版本",badgeOk:"已是最新",badgeAhead:"新於 npm",badgeUnknown:"無法比較",statusHintUpdate:"發佈庫有較新版本，可按「更新套件並重啟」。",statusHintOk:"本機版本與目前已知最新發佈版一致。",statusHintAhead:"本機版本比 npm 新（常見於 git／開發版）。若是 git 安裝，「更新套件」仍可拉取最新 commits。",statusHintUnknown:"無法連上 npm／GitHub，未能比較版本。",checkResult:"版本檢查結果",channelGit:"git（開發目錄）",channelNpmGlobal:"npm 全域",channelNpmLocal:"npm 本地",channelUnknown:"未知",encryption:"加密",ready:"就緒",notReady:"未就緒",allRequiredOk:"必須軟件齊全",requiredMissing:"有必須軟件缺失"},support:{title:"支持",subtitle:"作者、贊助與 YSK Limited — 免費產品，務實支援",pillSupport:"支持",pillSponsor:"支持／贊助 Linktree",pillHelp:"遇到問題？ email@ysk.hk",creatorTitle:"作者",creatorBody:"本 Grok → OpenAI Gateway 為免費開源產品，供希望自行運行 Grok CLI 作為 API 的使用者。項目以開源方式維護；你的意見與錯誤回報十分重要。",sponsorTitle:"支持／贊助",sponsorBody:"若本 Gateway 為你節省時間，歡迎贊助開發。每一份支持均有助產品繼續免費供所有人使用。",githubSponsors:"GitHub 贊助",linktree:"Linktree",walletsTitle:"加密貨幣／Web3 地址",walletsHint:"請只在對應網絡轉帳，轉帳前請再次核對地址。",net:"網絡",addr:"地址",copy:"複製",netEvm:"EVM (ETH/BSC/AVAX)",netNear:"NEAR",netAda:"ADA (Cardano)",yskTitle:"YSK Limited",yskBody:"需要超出免費面板的人手協助？YSK Limited 可以提供：",yskLi1:"伺服器安裝、加固與日常維運",yskLi2:"主機架構設計（網站、電郵、DNS、資料庫）",yskLi3:"遷移、自動化與客製整合",yskLi4:"事故處理與上線就緒檢查",yskPrice:"此處不標價 — 請來信，我們會按你的環境商討方案。",site:"ysk.hk",helpTitle:"遇到問題？",helpBody:"請來信說明作業系統、安裝紀錄路徑，以及預期與實際結果。每封來信均會閱讀。",docs:"完整文件見倉庫 README"},common:{empty:"暫無資料",active:"啟用",revoked:"已撤銷",save:"儲存",cancel:"關閉",loading:"載入中…",powered:"技術支援",actions:"操作",yes:"是",no:"否",ok:"確定",confirm:"確定",notice:"提示",confirmTitle:"請確認",dangerTitle:"確認操作",apply:"套用",reset:"重設",search:"搜尋",prev:"上一頁",next:"下一頁",perPage:"每頁",pagerTotal:"共 {n} 筆",pagerPage:"第 {n} / {total} 頁",filterTitle:"搜尋與篩選",filterHint:"設定條件後按「套用」",sortHint:"點擊欄位以 API 排序（預設：最新在前）",featureOff:"已關閉",all:"全部",requestFailed:"請求失敗",ms:"{n} 毫秒",perMin:"{n}/分",minutes:"{n} 分鐘",mb:"{n} MB",percent:"{n}%",ipLabel:"IP",uaLabel:"UA",httpStatus:"HTTP"},errors:{unauthorized:"憑證無效或缺失，請重新登入。",forbidden:"你沒有執行此操作的權限。",not_found:"找不到請求的資源。",validation_error:"請求無效，請檢查輸入內容。",rate_limit_exceeded:"已超過速率限制，請稍後再試。",concurrency_limit_exceeded:"Grok 並行工作過多，請稍候再試。",internal_error:"伺服器發生內部錯誤。",grok_error:"Grok CLI 回傳錯誤。",grok_timeout:"Grok CLI 執行逾時。",grok_not_available:"此伺服器無法使用 Grok CLI。",document_too_large:"文件大小超過允許上限。",document_type_not_allowed:"不允許此文件類型。",invalid_cwd:"不允許使用此工作目錄。",service_unavailable:"服務暫時無法使用。",queue_full:"對話佇列已滿，請稍後再試。",queue_draining:"對話佇列已暫停或正在排空。",queue_wait_timeout:"在對話佇列中等待逾時。",queue_cancelled:"對話工作已取消。",media_not_supported:"此媒體功能不可用或已停用。",media_provider_unavailable:"媒體提供者不可用。",media_generation_failed:"媒體生成失敗。",media_forbidden:"此 API 金鑰不允許生成媒體。請使用 agent 模式金鑰或管理員工作階段。",feature_disabled:"此 API 功能已停用。",feature:{imagesApi:"Images API 已停用。請至「管理 → API 能力 → Images API」啟用。",videoApi:"Video API 已停用。請至「管理 → API 能力 → Videos API」啟用。",audioApi:"Audio API 已停用。請至「管理 → API 能力 → Audio API」啟用。",tools:"Tools 已停用。請至「管理 → API 能力」啟用 Tools（圖像生成需要）。",filesOpenAiAlias:"OpenAI Files API 別名已停用。請至「管理 → API 能力 → Files API 別名」啟用。"},media:{agent_or_admin_required:"圖像生成需要 agent 模式 API 金鑰或管理員工作階段。安全模式金鑰無法使用圖像工具。",source_required:"請提供圖像檔、媒體資產或文件作為來源。",source_must_be_image:"編輯或生成影片時，來源必須為圖像。",no_image_in_sandbox:"Grok 已結束，但沙箱及今次 run 對應的 session images/ 均未找到圖像檔。這不是 imagesApi 或 API 金鑰問題。",no_video_in_sandbox:"Grok 已結束，但沙箱及今次 run 對應的 session 均未找到影片檔。",provider_no_edit:"目前媒體提供者不支援圖像編輯。"}}}};function ps(){const a=localStorage.getItem(Da);return a==="en"||a==="zh-Hant"?a:(navigator.language||navigator.userLanguage||"en").toLowerCase().startsWith("zh")?"zh-Hant":"en"}let nt=ps();function yt(){return nt}function Ha(a){a!=="en"&&a!=="zh-Hant"||(nt=a,localStorage.setItem(Da,a))}function e(a){const s=a.split(".");let o=Kt[nt]||Kt.en;for(const i of s)if(o&&typeof o=="object"&&i in o)o=o[i];else{o=Kt.en;for(const n of s)if(o&&typeof o=="object"&&n in o)o=o[n];else return a;break}return typeof o=="string"?o:a}function Te(a){return e(a)!==a}function q(a,s={}){let o=e(a);for(const[i,n]of Object.entries(s))o=o.replaceAll(`{${i}}`,String(n));return o}function Jt(){return`
  <div class="lang-switch" role="group" aria-label="${nt==="zh-Hant"?"語言":"Language"}">
    <button type="button" data-lang="en" class="${nt==="en"?"is-active":""}">EN</button>
    <button type="button" data-lang="zh-Hant" class="${nt==="zh-Hant"?"is-active":""}">中文</button>
  </div>`}const Oa=new Set([".txt",".md",".markdown",".csv",".json",".xml",".html",".htm",".js",".ts",".tsx",".jsx",".py",".java",".go",".rs",".c",".cpp",".h",".hpp",".css",".yml",".yaml",".toml",".ini",".env",".sh",".sql",".log",".pdf",".png",".jpg",".jpeg",".webp",".gif"]),fs=[...Oa].join(","),ia="/admin/api",Tt="gog_admin_session";let We=null,Qe=!1;function ra(a,s){const o=a?.error&&typeof a.error=="object"?a.error:a||{},i=typeof o.code=="string"?o.code:"",n=o.details&&typeof o.details=="object"?o.details:{},d=typeof n.feature=="string"?n.feature:typeof n.flag=="string"?n.flag:"",r=typeof n.reason=="string"?n.reason:"",u=String(o.message||a?.message||s||"");if(d&&(i==="feature_disabled"||i==="media_not_supported"||i==="forbidden")){const l=`errors.feature.${d}`;if(Te(l))return e(l)}if(i==="feature_disabled"&&Te("errors.feature_disabled")){const l=jt(u);return l&&Te(`errors.feature.${l}`)?e(`errors.feature.${l}`):e("errors.feature_disabled")}if(r&&Te(`errors.media.${r}`))return e(`errors.media.${r}`);if(i==="media_generation_failed"&&r&&Te(`errors.media.${r}`))return e(`errors.media.${r}`);if(i==="media_forbidden"&&Te("errors.media_forbidden"))return e("errors.media_forbidden");const m=jt(u);if(m&&Te(`errors.feature.${m}`))return e(`errors.feature.${m}`);if(i){const l=`errors.${i}`;if(Te(l))return e(l)}const p=jt(u);return p&&Te(`errors.feature.${p}`)?e(`errors.feature.${p}`):/agent-mode|agent mode|Safe keys cannot/i.test(u)?e("errors.media.agent_or_admin_required"):/no image file was found/i.test(u)?e("errors.media.no_image_in_sandbox"):/no video file was found/i.test(u)?e("errors.media.no_video_in_sandbox"):/does not support image edits/i.test(u)?e("errors.media.provider_no_edit"):/Provide an image file|sourceAssetId|sourceDocumentId/i.test(u)?e("errors.media.source_required"):/must be an image/i.test(u)?e("errors.media.source_must_be_image"):u||e("common.requestFailed")}function jt(a){const s=String(a||"");return/videoApi/i.test(s)||/Video API is disabled/i.test(s)?"videoApi":/imagesApi/i.test(s)||/Images API is disabled/i.test(s)?"imagesApi":/audioApi/i.test(s)||/Audio API is disabled/i.test(s)?"audioApi":/filesOpenAiAlias/i.test(s)||/Files API alias/i.test(s)?"filesOpenAiAlias":/Tools are disabled/i.test(s)||/\btools\b/i.test(s)&&/disabled/i.test(s)&&/image/i.test(s)?"tools":""}const c={key:sessionStorage.getItem(Tt)||"",page:"dashboard",me:null,error:"",modal:null,chatFilter:{q:"",status:"",model:"",apiKeyId:"",from:"",to:"",policyMode:"",hasDocuments:"",sortBy:"createdAt",sortDir:"desc",limit:50,offset:0},docFilter:{q:"",apiKeyId:"",storageType:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",limit:20,offset:0},keyFilter:{q:"",role:"",mode:"",isActive:"",sortBy:"createdAt",sortDir:"desc",limit:20,offset:0},auditFilter:{q:"",action:"",apiKeyId:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",limit:50,offset:0},usageFilter:{tab:"model",modelQ:"",keyQ:"",keyActive:"",modelPage:0,keyPage:0,pageSize:10,sortBy:"lastUsedAt",sortDir:"desc",modelSortBy:"requests",modelSortDir:"desc"},ddosFilter:{tab:"policy",liveQ:"",banQ:"",banSource:"",livePage:0,banPage:0,pageSize:15,liveSortBy:"startedAt",liveSortDir:"desc",banSortBy:"createdAt",banSortDir:"desc",eventSortBy:"at",eventSortDir:"desc"},mediaFilter:{tab:"studio",q:"",kind:"",provider:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",jobSortBy:"createdAt",jobSortDir:"desc",limit:20,offset:0},systemTab:"software",grokSessionQ:"",pm2Tab:"runner",apiFeaturesTab:"protocols",models:[],keys:[]},ys={login:"login",dashboard:"dashboard",chat:"chat",chats:"chats",keys:"keys",documents:"documents",media:"media",audit:"audit",settings:"settings","api-features":"apiFeatures",apifeatures:"apiFeatures",usage:"usage",ddos:"ddos",queue:"queue",pm2:"pm2",system:"system",support:"support"};function gs(a){return a==="apiFeatures"?"api-features":a||"dashboard"}function da(a){const s=String(a||"").replace(/^#\/?/,"").split("?")[0].split("/")[0].toLowerCase();return s&&ys[s]||null}function la(a){const s=`#/${gs(a)}`;location.hash!==s&&history.pushState(null,"",s)}function bs(){const a=da(location.hash);return a||(c.key?"dashboard":"login")}async function E(a,s={}){const o={...s.body?{"Content-Type":"application/json"}:{},...c.key?{Authorization:`Bearer ${c.key}`}:{},...s.headers||{}},i=await fetch(`${ia}${a}`,{...s,headers:o}),n=await i.text();let d=null;try{d=n?JSON.parse(n):null}catch{d={error:{message:n}}}if(!i.ok){const r=ra(d,i.statusText),u=d?.error?.code||"";i.status===401?c.page!=="login"&&At(!1):i.status===403&&!["media_forbidden","feature_disabled","forbidden","media_not_supported"].includes(u)&&c.page!=="login"&&At(!1);const m=new Error(r);throw m.status=i.status,m.code=u,m.details=d?.error?.details,m}return d}async function ka(a){const s=await a.text();let o=null;try{o=s?JSON.parse(s):null}catch{o={error:{message:s}}}if(!a.ok){const i=ra(o,a.statusText),n=new Error(i);throw n.status=a.status,n.code=o?.error?.code,n.details=o?.error?.details,n}return o}function At(a=!0){const s=c.key;a&&s&&String(s).startsWith("gog_sess_")&&fetch("/admin/api/auth/logout",{method:"POST",headers:{Authorization:`Bearer ${s}`}}).catch(()=>{}),a&&sessionStorage.removeItem(Tt),c.key="",c.me=null,c.page="login",la("login"),Nt()}function ca(a){ua(a,{writeHash:!0})}function ua(a,s={}){const o=a||"dashboard";c.page=o,c.modal=null,c.error="",o==="chats"&&(c.chatFilter.offset=0),o==="documents"&&(c.docFilter.offset=0),o==="keys"&&(c.keyFilter.offset=0),o==="audit"&&(c.auditFilter.offset=0),o==="media"&&(c.mediaFilter.offset=0),o!=="ddos"&&We&&(clearInterval(We),We=null),o!=="chat"&&document.body.classList.remove("chat-history-open"),s.writeHash!==!1&&la(o),Nt()}function t(a){return String(a??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}let xe=null,Bt=null;function ze(a){const s=Bt;Bt=null,xe&&(xe.remove(),xe=null),document.body.classList.remove("ui-dialog-open"),document.removeEventListener("keydown",ma,!0),s&&s(a)}function ma(a){if(xe&&a.key==="Escape"){a.preventDefault(),a.stopPropagation();const s=xe.dataset.cancelable!=="0";ze(s?xe.dataset.prompt==="1"?null:!1:!0)}}function _a(a){xe&&ze(!1);const s=a.variant||(a.showCancel===!1?"info":"confirm"),o=a.showCancel!==!1,i=!!a.input,n=a.title||e(s==="danger"?"common.dangerTitle":o?"common.confirmTitle":"common.notice"),d=a.confirmText||e(o?"common.confirm":"common.ok"),r=a.cancelText||e("common.cancel"),u=s==="danger"?"!":s==="info"&&!o?"i":"?",m=document.createElement("div");m.className="ui-dialog-back",m.id="ui-dialog-back",m.dataset.cancelable=o||i?"1":"0",m.dataset.prompt=i?"1":"0",m.setAttribute("role","presentation"),m.innerHTML=`
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
        ${o||i?`<button type="button" class="btn secondary sm" id="ui-dialog-cancel">${t(r)}</button>`:""}
        <button type="button" class="btn ${s==="danger"?"danger":""} sm" id="ui-dialog-ok">${t(d)}</button>
      </div>
    </div>`,document.body.appendChild(m),document.body.classList.add("ui-dialog-open"),xe=m,document.addEventListener("keydown",ma,!0);const p=m.querySelector("#ui-dialog-ok"),l=m.querySelector("#ui-dialog-cancel"),k=m.querySelector("#ui-dialog-input"),g=f=>{if(i){if(!f){ze(null);return}const b=k instanceof HTMLInputElement?k.value:"";ze(b);return}ze(!!f)};return p?.addEventListener("click",f=>{f.preventDefault(),g(!0)}),l?.addEventListener("click",f=>{f.preventDefault(),g(!1)}),m.addEventListener("click",f=>{f.target===m&&(o||i)&&g(!1)}),k instanceof HTMLInputElement&&k.addEventListener("keydown",f=>{f.key==="Enter"&&(f.preventDefault(),g(!0))}),requestAnimationFrame(()=>{k instanceof HTMLInputElement?(k.focus(),k.select()):p?.focus()}),new Promise(f=>{Bt=f})}async function pe(a){const s=typeof a=="string"?{message:a,showCancel:!1,variant:"info"}:{title:a.title,message:a.message,showCancel:!1,variant:a.variant||"info",confirmText:a.confirmText||e("common.ok")};await _a(s)}async function J(a){const s=typeof a=="string"?{message:a,showCancel:!0,variant:"confirm"}:{title:a.title,message:a.message,showCancel:!0,variant:a.variant||"confirm",confirmText:a.confirmText,cancelText:a.cancelText};return!!await _a(s)}function hs(){const a=typeof window<"u"?window.marked:null;if(!a||a.__gogConfigured)return a;try{typeof a.setOptions=="function"?a.setOptions({gfm:!0,breaks:!0}):a.marked&&typeof a.marked.setOptions=="function"&&a.marked.setOptions({gfm:!0,breaks:!0})}catch{}return a.__gogConfigured=!0,a}function Ra(a){if(!a)return"";const s=hs(),o=typeof window<"u"?window.DOMPurify||window.dompurify:null;if(!s)return t(a);let i="";try{if(typeof s.parse=="function")i=s.parse(a,{gfm:!0,breaks:!0});else if(typeof s=="function")i=s(a,{gfm:!0,breaks:!0});else if(s.marked&&typeof s.marked.parse=="function")i=s.marked.parse(a,{gfm:!0,breaks:!0});else return t(a)}catch{return t(a)}if(typeof i!="string"&&(i=String(i??"")),o&&typeof o.sanitize=="function"){i=o.sanitize(i,{USE_PROFILES:{html:!0},ADD_ATTR:["target","rel"]});try{i=i.replace(/<a\s+([^>]*href=)/gi,'<a target="_blank" rel="noopener noreferrer" $1')}catch{}return i}return t(a)}async function Rt(a){const s=String(a??"");if(!s)return!1;try{if(navigator.clipboard&&window.isSecureContext!==!1)return await navigator.clipboard.writeText(s),!0}catch{}try{const o=document.createElement("textarea");o.value=s,o.setAttribute("readonly",""),o.style.position="fixed",o.style.left="-9999px",document.body.appendChild(o),o.select();const i=document.execCommand("copy");return document.body.removeChild(o),i}catch{return!1}}function te(a){if(!a)return"-";try{return new Date(a).toLocaleString(yt()==="zh-Hant"?"zh-HK":"en-US")}catch{return a}}function Me(a){return a==null?"—":a<1024?`${a} B`:a<1024*1024?`${(a/1024).toFixed(1)} KB`:q("common.mb",{n:(a/1024/1024).toFixed(1)})}function gt(a){return a==null||a===""?"—":q("common.ms",{n:a})}function Fa(a){return a==null||a===""?"—":q("common.perMin",{n:a})}function U(a){c.error=a;const s=document.querySelector("#flash-error");s&&(s.hidden=!a,s.textContent=a)}function pa(a){const s=a==="success"?"success":a==="error"||a==="timeout"?"error":"pending",o=a==="success"?e("status.success"):a==="error"?e("status.error"):a==="timeout"?e("status.timeout"):a==="pending"?e("status.pending"):a||"-";return`<span class="badge ${s}">${t(o)}</span>`}function vs(a){const o={queued:{cls:"pending",label:e("queue.stQueued")},leased:{cls:"info",label:e("queue.stLeased")},running:{cls:"success",label:e("queue.stRunning")},succeeded:{cls:"success",label:e("queue.stSucceeded")},failed:{cls:"error",label:e("queue.stFailed")},dead:{cls:"error",label:e("queue.stDead")},cancelled:{cls:"muted",label:e("queue.stCancelled")}}[a]||{cls:"pending",label:a||"—"};return`<span class="badge ${o.cls}">${t(o.label)}</span>`}function $s(a){const s=a==="playground"?e("queue.srcPlayground"):a==="v1"?e("queue.srcV1"):a||"—";return`<span class="badge muted">${t(s)}</span>`}function Ft(a){const s=a==="agent"?"agent":a==="safe"?"safe":a||"safe",o=s==="agent"?e("keys.modeAgentBadge"):s==="safe"?e("keys.modeSafeBadge"):s;return`<span class="badge ${s==="agent"?"agent":"safe"}">${t(o)}</span>`}function ks(a){const s=String(a||"").toLowerCase(),o=s==="admin"?e("keys.roleAdminBadge"):s==="client"||s==="user"?e("keys.roleClientBadge"):a||"-";return t(o)}function vt(a){return String(a||"").toLowerCase().startsWith("image/")}function fa(a,s=""){const o=String(a||"").toLowerCase().trim(),n=(String(s||"").toLowerCase().match(/\.([a-z0-9]+)$/)||[])[1]||"";return o.startsWith("image/")||["png","jpg","jpeg","gif","webp","svg","bmp","avif","ico"].includes(n)?"image":o.startsWith("video/")||["mp4","webm","ogg","ogv","mov","m4v"].includes(n)?"video":o.startsWith("audio/")||["mp3","wav","ogg","oga","m4a","aac","flac","opus"].includes(n)?"audio":o==="application/pdf"||n==="pdf"?"pdf":o.startsWith("text/")||o==="application/json"||o==="application/xml"||o==="application/javascript"||["txt","md","csv","json","xml","html","htm","css","js","log","svg"].includes(n)?n==="svg"?"image":"text":null}function Ss(a,s=""){return fa(a,s)!=null}let xt=null;function Na(){if(xt){try{URL.revokeObjectURL(xt)}catch{}xt=null}}function ws(a,s,o){return a==="image"?`<img class="media-lb-media media-lb-img" src="${s}" alt="${t(o)}" />`:a==="video"?`<video class="media-lb-media media-lb-video" src="${s}" controls playsinline preload="metadata"></video>`:a==="audio"?`
      <div class="media-lb-audio-wrap">
        <div class="media-lb-audio-icon" aria-hidden="true">♪</div>
        <audio class="media-lb-media media-lb-audio" src="${s}" controls preload="metadata"></audio>
      </div>`:a==="pdf"?`<iframe class="media-lb-media media-lb-pdf" src="${s}#toolbar=1" title="${t(o)}"></iframe>`:a==="text"?`<div class="media-lb-text-loading muted">${t(e("common.loading")||"…")}</div>`:`<div class="data-empty"><strong>${t(e("media.previewUnsupported"))}</strong></div>`}function Sa(a,s){const o=a.mime||s.type||"",i=a.filename||a.id||"asset",n=fa(o,i)||"image",d=e("media.preview"),r=[i,o||"—",a.bytes!=null?Me(a.bytes):"",a.kind||""].filter(Boolean),u=t(r.join(" · ")),m=a.prompt?`<div class="media-lb-prompt"><span class="muted">${t(e("media.prompt"))}</span><p>${t(a.prompt)}</p></div>`:"";dt({title:d,subtitle:u,size:"xl",bodyHtml:`
      <div class="media-lightbox" data-preview-kind="${t(n)}">
        <div class="media-lb-stage">
          <div class="media-lb-text-loading muted">${t(e("common.loading")||"…")}</div>
        </div>
        ${m}
      </div>`,footerHtml:`
      <button type="button" class="btn secondary sm" id="media-lb-download">${t(e("media.download"))}</button>
      <button type="button" class="btn sm" id="media-lb-close">${t(e("common.cancel"))}</button>`});const p=document.querySelector("#modal-back .modal");p&&p.classList.add("modal--media-preview");const l=URL.createObjectURL(s);xt=l;const k=document.querySelector("#modal-back .media-lb-stage");k&&(k.innerHTML=ws(n,l,i));const g=()=>{document.querySelectorAll("#modal-back video, #modal-back audio").forEach(f=>{try{f.pause()}catch{}}),Na(),ye()};document.getElementById("modal-close")?.addEventListener("click",f=>{f.preventDefault(),g()}),document.getElementById("media-lb-close")?.addEventListener("click",f=>{f.preventDefault(),g()}),document.getElementById("modal-back")?.addEventListener("click",f=>{f.target?.id==="modal-back"&&g()}),document.getElementById("media-lb-download")?.addEventListener("click",()=>{const f=document.createElement("a");f.href=l,f.download=i,f.click()}),n==="text"&&s.text().then(f=>{const b=document.querySelector("#modal-back .media-lb-stage");if(!b)return;const $=4e5,A=f.length>$?f.slice(0,$)+`
… (${e("media.previewTruncated")})`:f;b.innerHTML=`<pre class="media-lb-text">${t(A)}</pre>`}).catch(()=>{const f=document.querySelector("#modal-back .media-lb-stage");f&&(f.innerHTML=`<div class="error-box">${t(e("media.previewFail"))}</div>`)})}function Ka(){return`
  <footer class="site-footer">
    <a class="powered-by" href="https://ysk.hk/" target="_blank" rel="noopener noreferrer">
      <img src="/admin/assets/logo.svg" alt="" width="22" height="22" />
      <span>${t(e("common.powered"))} <strong>YSK Limited</strong></span>
    </a>
  </footer>`}function Ps(){return{dashboard:e("nav.dashboard"),chat:e("nav.chat"),chats:e("nav.chats"),keys:e("nav.keys"),documents:e("nav.documents"),audit:e("nav.audit"),settings:e("nav.settings"),apiFeatures:e("nav.apiFeatures"),media:e("nav.media"),usage:e("nav.usage"),ddos:e("nav.ddos"),queue:e("nav.queue"),pm2:e("nav.pm2"),system:e("nav.system"),support:e("nav.support")}[c.page]||e("brand")}function wt(){document.body.classList.remove("nav-open")}function Es(){document.body.classList.add("nav-open")}function ne(a){return`
  <div class="app-shell">
    <header class="mobile-bar">
      <button type="button" class="icon-btn" id="nav-open" aria-label="${t(e("shell.menu"))}">☰</button>
      <div class="mobile-title">${t(Ps())}</div>
      ${Jt()}
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
        ${Jt()}
        ${re("dashboard",e("nav.dashboard"))}
        ${re("chat",e("nav.chat"))}
        ${re("chats",e("nav.chats"))}
        ${re("keys",e("nav.keys"))}
        ${re("documents",e("nav.documents"))}
        ${re("media",e("nav.media"))}
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
        <div id="flash-error" class="error-box" ${c.error?"":"hidden"}>${t(c.error)}</div>
        ${a}
      </main>
    </div>
    ${Ka()}
  </div>
  ${c.modal||""}
  `}function re(a,s){return`<button type="button" class="nav-btn ${c.page===a?"active":""}" data-nav="${a}">${t(s)}</button>`}function ie(){wt(),document.querySelectorAll("[data-nav]").forEach(s=>{s.onclick=()=>{wt(),ca(s.dataset.nav)}});const a=()=>At(!0);document.getElementById("btn-logout")?.addEventListener("click",a),document.getElementById("btn-logout-mobile")?.addEventListener("click",a),document.getElementById("nav-open")?.addEventListener("click",Es),document.getElementById("nav-backdrop")?.addEventListener("click",wt),document.addEventListener("keydown",s=>{s.key==="Escape"&&wt()},{once:!0}),document.querySelectorAll("[data-lang]").forEach(s=>{s.onclick=()=>{Ha(s.dataset.lang),Nt().catch(v)}}),ya(document)}function Is(a){if(!a)return"";const s=(a.getAttribute("data-label")||"").trim();if(s)return s;const o=a.querySelector(".th-sort-btn");return(o?[...o.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent||"").join(""):a.textContent||"").replace(/[▲▼]/g,"").replace(/\s+/g," ").trim()}function ya(a){(a||document).querySelectorAll("table.data-table").forEach(o=>{const i=[...o.querySelectorAll("thead th")].map(Is);o.querySelectorAll("tbody tr").forEach(n=>{n.classList.contains("empty-row")||[...n.children].forEach((d,r)=>{const u=[...d.children],m=d.classList.contains("row-actions")||!!d.querySelector(":scope > .row-actions")||u.length>0&&u.every(p=>p.matches("button, .btn, .row-actions"));if(d.classList.toggle("is-actions",m),d.classList.toggle("is-primary",r===0&&!m),m){d.removeAttribute("data-label");return}i[r]&&d.setAttribute("data-label",i[r])})})})}function v(a){console.error(a),U(a.message||String(a))}async function ja(){if(!c.key)return!1;const a=await E("/me");return c.me=a.data,!0}async function bt(a=!1){try{const s=await E(`/models${a?"?refresh=1":""}`);return c.models=s.data?.models||[],s.data}catch{return c.models=[],{models:[],source:"fallback",defaultModel:""}}}async function $t(){try{const a=await E("/keys?all=1");c.keys=a.data||[]}catch{c.keys=[]}}function ke(a){const s=(Array.isArray(a)?a:[a]).filter(Boolean);return s.length?`<div class="page-meta" role="status">${s.map(i=>`<span>${typeof i=="string"?t(i):i}</span>`).join('<span class="page-meta-sep" aria-hidden="true">·</span>')}</div>`:""}function Ne({title:a,hint:s,meta:o,searchHtml:i,gridHtml:n}){return`
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
    </div>`}function be({headHtml:a,bodyHtml:s,colSpan:o,emptyText:i,pagerHtml:n}){const d=s||`<tr class="empty-row"><td colspan="${o||6}">
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
    </div>`}function $e(a,s,o="sortBy",i="sortDir"){const n=s?.[o],d=s?.[i];return n&&a.set("sortBy",String(n)),(d==="asc"||d==="desc")&&a.set("sortDir",d),a}function _({field:a,label:s,filterRef:o,sortByKey:i="sortBy",sortDirKey:n="sortDir"}){const d=o?.[i]===a,r=d?o?.[n]||"desc":"",u=d&&r==="asc"?"ascending":d&&r==="desc"?"descending":"none",m=d?r==="asc"?" ▲":" ▼":"";return`<th class="th-sort${d?" is-sorted":""}" data-label="${t(s)}" data-sort-field="${t(a)}" data-sort-by-key="${t(i)}" data-sort-dir-key="${t(n)}" aria-sort="${u}" title="${t(e("common.sortHint")||"Sort")}"><button type="button" class="th-sort-btn">${t(s)}<span class="th-sort-ind" aria-hidden="true">${m}</span></button></th>`}function je(a,s){document.querySelectorAll("th.th-sort[data-sort-field]").forEach(o=>{(o.querySelector(".th-sort-btn")||o).addEventListener("click",n=>{n.preventDefault();const d=o.getAttribute("data-sort-field");if(!d||!a)return;const r=o.getAttribute("data-sort-by-key")||"sortBy",u=o.getAttribute("data-sort-dir-key")||"sortDir";a[r]===d?a[u]=a[u]==="asc"?"desc":"asc":(a[r]=d,a[u]="desc"),"offset"in a&&(a.offset=0),"modelPage"in a&&r==="modelSortBy"&&(a.modelPage=0),"keyPage"in a&&r==="sortBy"&&(a.keyPage=0),"livePage"in a&&r==="liveSortBy"&&(a.livePage=0),"banPage"in a&&r==="banSortBy"&&(a.banPage=0),s()})})}function qe({total:a,limit:s,offset:o,idPrefix:i}){const n=Math.max(1,Math.ceil((a||0)/s)||1),d=Math.floor(o/s)+1,r=o>0,u=o+s<a;return`
    <div class="data-pager" id="${i}-pager">
      <div class="data-pager-meta">
        <span>${t(q("common.pagerTotal",{n:a||0}))}</span>
        <span>${t(q("common.pagerPage",{n:d,total:n}))}</span>
        <label class="muted">${t(e("common.perPage"))}
          <select id="${i}-limit">
            ${[10,20,50,100].map(m=>`<option value="${m}" ${s===m?"selected":""}>${m}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="data-pager-actions">
        <button type="button" class="btn secondary sm" id="${i}-prev" ${r?"":"disabled"}>${t(e("common.prev"))}</button>
        <button type="button" class="btn secondary sm" id="${i}-next" ${u?"":"disabled"}>${t(e("common.next"))}</button>
      </div>
    </div>`}function rt(a,s,o){document.getElementById(`${a}-prev`)?.addEventListener("click",()=>{s.offset=Math.max(0,s.offset-s.limit),o()}),document.getElementById(`${a}-next`)?.addEventListener("click",()=>{s.offset=s.offset+s.limit,o()}),document.getElementById(`${a}-limit`)?.addEventListener("change",i=>{s.limit=Number(i.target.value)||20,s.offset=0,o()})}function ye(){document.querySelectorAll("#modal-back video, #modal-back audio").forEach(a=>{try{a.pause()}catch{}}),Na(),document.getElementById("modal-back")?.remove(),c.modal=null}function dt({title:a,subtitle:s,bodyHtml:o,footerHtml:i,size:n="md"}){ye();const d=`
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
    </div>`;document.getElementById("app").insertAdjacentHTML("beforeend",d);const r=()=>ye();document.getElementById("modal-close").onclick=r,document.getElementById("modal-back").onclick=m=>{m.target.id==="modal-back"&&r()};const u=m=>{m.key==="Escape"&&(r(),document.removeEventListener("keydown",u))};document.addEventListener("keydown",u)}async function Ua(){const a="gctoac admin otp";document.getElementById("app").innerHTML=`
    <div class="login-wrap">
      <div class="login-stage">
        <div class="login-card">
          <div class="login-brand">
            <img src="/admin/assets/logo.svg" alt="YSK" width="48" height="48" />
            <h1 class="brand-title">${t(e("loginTitle"))}</h1>
          </div>
          ${Jt()}
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
      ${Ka()}
    </div>
  `,document.querySelectorAll("[data-lang]").forEach(s=>{s.onclick=()=>{Ha(s.dataset.lang),Ua().catch(v)}}),document.getElementById("btn-copy-cmd").onclick=async()=>{try{await navigator.clipboard.writeText(a);const s=document.getElementById("btn-copy-cmd");s.textContent=e("loginCopied"),setTimeout(()=>{s.textContent=e("loginCopy")},1500)}catch{}},document.getElementById("btn-login").onclick=async()=>{const s=document.getElementById("login-key").value.trim();if(!s)return U(e("needOtp"));try{const o=await fetch("/admin/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:s})}),i=await o.json().catch(()=>({}));if(!o.ok)throw new Error(i?.error?.message||i?.message||e("loginOtpFail"));const n=i?.data?.token;if(!n)throw new Error(e("loginOtpFail"));c.key=n,sessionStorage.setItem(Tt,n),await ja(),c.error="",ca("dashboard")}catch(o){c.key="",sessionStorage.removeItem(Tt),U(o.message||e("loginOtpFail"))}},document.getElementById("login-key").onkeydown=s=>{s.key==="Enter"&&document.getElementById("btn-login").click()}}function he({label:a,value:s,sub:o,tone:i,href:n,valueId:d,subId:r}){const u=i?` dash-kpi--${i}`:"",m=d?` id="${t(d)}"`:"",p=r?` id="${t(r)}"`:"",l=`
    <div class="label">${t(a)}</div>
    <div class="value"${m}>${s}</div>
    ${o!=null&&o!==""?`<div class="dash-kpi-sub muted"${p}>${o}</div>`:""}`;return n?`<button type="button" class="card dash-kpi${u}" data-nav="${t(n)}">${l}</button>`:`<div class="card dash-kpi${u}">${l}</div>`}function Re(a,s,o){return a?`<span class="badge success">${t(s)}</span>`:`<span class="badge warn">${t(o)}</span>`}function ga({id:a,on:s,onLabel:o,offLabel:i,title:n}){return`<button type="button"
    class="master-toggle ${s?"is-on":"is-off"}"
    id="${t(a)}"
    aria-pressed="${s?"true":"false"}"
    title="${t(n||"")}">
    <span class="master-toggle-track" aria-hidden="true"><span class="master-toggle-knob"></span></span>
    <span class="master-toggle-label">${t(s?o:i)}</span>
  </button>`}function Je(a){const s=document.getElementById(a);return s?s.classList.contains("is-on"):!1}function Xe(a,s,o,i){const n=document.getElementById(a);if(!n)return;n.classList.toggle("is-on",!!s),n.classList.toggle("is-off",!s),n.setAttribute("aria-pressed",s?"true":"false");const d=n.querySelector(".master-toggle-label");d&&o!=null&&i!=null&&(d.textContent=s?o:i)}function Ye(a,s){const o=document.getElementById(a);o&&(o.hidden=!s)}function Ze(a,s){const o=document.getElementById(a);o&&o.classList.toggle("is-feature-off",!!s)}function xs(a){return{auto:e("ddos.proxySrcAuto"),cloudflare:e("ddos.proxySrcCf"),nginx:e("ddos.proxySrcNginx"),"x-forwarded-for":e("ddos.proxySrcXff"),socket:e("ddos.proxySrcSocket")}[a]||a||"—"}async function Xt(){const s=(await E("/stats")).data||{},o=s.totals||{},i=s.protection||{},n=s.runtime||{},d=s.concurrency||{},r=s.queue||null,u=s.safety||null,m=s.models24h||[],p=o.successRate24h??0,l=o.successRate??0,k=s.generatedAt?te(s.generatedAt):"—";let g="—",f=e("dash.kpiQueueSub"),b="";if(r){r.enabled?r.paused?(g=e("dash.kpiQueuePaused"),b="warn"):r.drainMode?(g=e("dash.kpiQueueDrain"),b="warn"):g=`${r.depth??0}`:(g=e("dash.kpiQueueOff"),b="warn");const x=r.oldestQueuedAgeMs>0?` · wait ${Math.round(r.oldestQueuedAgeMs/1e3)}s`:"";f=q("dash.kpiQueueSubLive",{run:r.running??0,max:r.globalConcurrency??"—",dead:r.dead??0,wait:x}),((r.dead||0)>0||(r.depth||0)>20)&&(b=b||"warn")}const $=!!u?.globalSafeMode,A=u?e($?"dash.kpiSafeOn":"dash.kpiSafeOff"):"—",B=t(u?q("dash.kpiSafeSub",{tools:u.safeToolsMode||"—",turns:u.safeMaxTurns??"—",model:u.defaultModel||"—"}):e("dash.kpiSafeSubEmpty")),R=(s.recentChats||[]).map(x=>`
    <tr>
      <td><button class="linkish cell-primary" data-chat="${x.id}">${t(x.requestId)}</button>
        <div class="cell-sub">${t(x.apiKey?.name||"")}</div></td>
      <td>${t(x.model)}</td>
      <td>${pa(x.status)}</td>
      <td>${Ft(x.policyMode||"-")}</td>
      <td>${gt(x.durationMs)}</td>
      <td>${te(x.createdAt)}</td>
    </tr>`).join(""),I=be({headHtml:`
      <th>${t(e("chats.request"))}</th>
      <th>${t(e("chats.model"))}</th>
      <th>${t(e("chats.status"))}</th>
      <th>${t(e("chats.mode"))}</th>
      <th>${t(e("chats.duration"))}</th>
      <th>${t(e("chats.time"))}</th>`,bodyHtml:R,colSpan:6,emptyText:e("dash.empty")}),K=Math.max(1,...m.map(x=>x.requests||0)),P=m.length?m.map(x=>{const y=Math.round((x.requests||0)/K*100);return`
          <div class="dash-bar-row">
            <div class="dash-bar-label" title="${t(x.model)}">${t(x.model)}</div>
            <div class="dash-bar-track"><span style="width:${y}%"></span></div>
            <div class="dash-bar-n">${x.requests}</div>
          </div>`}).join(""):`<div class="data-empty" style="padding:20px"><strong>${t(e("dash.emptyModels"))}</strong></div>`,S=(x,y)=>`<span class="dash-rule-chip ${x?"is-on":"is-off"}">${t(y)}</span>`,F=r?`
      <div class="dash-stat-grid">
        <div><div class="label">${t(e("dash.qQueued"))}</div><div class="value value-sm">${r.queued??0}</div></div>
        <div><div class="label">${t(e("dash.qRunning"))}</div><div class="value value-sm">${r.running??0}<span class="dash-kpi-den">/${r.globalConcurrency??"—"}</span></div></div>
        <div><div class="label">${t(e("dash.qDead"))}</div><div class="value value-sm">${r.dead??0}</div></div>
        <div><div class="label">${t(e("dash.qSucceeded"))}</div><div class="value value-sm">${r.succeeded??0}</div></div>
      </div>
      <div class="dash-prot-meta muted">
        ${t(e("dash.qWorker"))}: ${t(r.workerId||"—")}
        · ${t(e("dash.qWorkerActive"))}: ${r.workerActive??0}
        ${r.oldestQueuedAgeMs>0?` · ${t(e("dash.qOldest"))}: ${Math.round(r.oldestQueuedAgeMs/1e3)}s`:""}
      </div>`:`<div class="data-empty" style="padding:12px 0"><strong>${t(e("dash.qUnavailable"))}</strong></div>`;document.getElementById("app").innerHTML=ne(`
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
      ${he({label:e("dash.kpi24h"),value:o.chats24h??0,sub:q("dash.kpi24hSub",{ok:o.success24h??0,err:o.error24h??0}),tone:"primary",href:"chats"})}
      ${he({label:e("dash.kpiSuccessRate"),value:`${p}%`,sub:q("dash.kpiSuccessRateSub",{all:l}),tone:p>=90?"ok":p>=70?"warn":"danger",href:"usage"})}
      ${he({label:e("dash.kpiErrors"),value:o.error24h??0,sub:q("dash.kpiErrorsSub",{all:o.errors??0}),tone:(o.error24h||0)>0?"warn":"ok",href:"chats"})}
      ${he({label:e("dash.kpiQueue"),value:g,sub:f,tone:b,href:"queue"})}
      ${he({label:e("dash.kpiSafe"),value:A,sub:B,tone:u?$?"ok":"warn":"",href:"settings"})}
      ${he({label:e("dash.kpiKeys"),value:`${o.activeKeys??0}<span class="dash-kpi-den">/${o.totalKeys??0}</span>`,sub:e("dash.kpiKeysSub"),href:"keys"})}
      ${he({label:e("dash.kpiDocs"),value:o.documents??0,sub:e("dash.kpiDocsSub"),href:"documents"})}
      ${he({label:e("dash.kpiMedia")||"Media",value:o.mediaAssets??0,sub:q("dash.kpiMediaSub",{n:o.mediaAssets24h??0}),href:"media"})}
      ${he({label:e("dash.kpiConv"),value:o.conversations??0,sub:q("dash.kpiConvSub",{n:o.conversations24h??0}),href:"chat"})}
      ${he({label:e("dash.kpiSessions"),value:o.adminSessions??n.adminSessions??0,sub:e("dash.kpiSessionsSub")})}
      ${he({label:e("dash.kpiConcurrent"),value:`${d.active??0}<span class="dash-kpi-den">/${d.max??0}</span>`,sub:e("dash.kpiConcurrentSub"),tone:(d.active||0)>=(d.max||1)?"warn":""})}
    </div>

    <div class="dash-layout">
      <div class="dash-main">
        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${t(e("dash.recent"))}</strong>
            <button type="button" class="btn secondary sm" data-nav="chats">${t(e("dash.viewAll"))}</button>
          </div>
          ${I.replace("data-table-panel","data-table-panel dash-embed-table")}
        </div>

        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${t(e("dash.queuePanel"))}</strong>
            <button type="button" class="btn secondary sm" data-nav="queue">${t(e("dash.openQueue"))}</button>
          </div>
          <div class="panel-pad dash-prot">
            <div class="dash-prot-row">
              <span>${t(e("dash.queueState"))}</span>
              ${r?r.enabled?r.paused?`<span class="badge warn">${t(e("dash.kpiQueuePaused"))}</span>`:r.drainMode?`<span class="badge warn">${t(e("dash.kpiQueueDrain"))}</span>`:`<span class="badge success">${t(e("dash.queueLive"))}</span>`:`<span class="badge warn">${t(e("dash.kpiQueueOff"))}</span>`:`<span class="badge warn">${t(e("dash.kpiQueueOff"))}</span>`}
            </div>
            ${F}
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
              ${Re($,e("dash.on"),e("dash.off"))}
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
              ${Re(!!i.autoBanEnabled,e("dash.on"),e("dash.off"))}
            </div>
            <div class="dash-rule-row">
              ${S(i.autoAuthEnabled,e("dash.ruleAuth"))}
              ${S(i.autoRateEnabled,e("dash.ruleRate"))}
              ${S(i.autoConnEnabled,e("dash.ruleConn"))}
              ${S(i.autoVelocityEnabled,e("dash.ruleVelocity"))}
            </div>
            <div class="dash-stat-grid">
              <div><div class="label">${t(e("dash.bans"))}</div><div class="value value-sm">${i.bans??0}</div></div>
              <div><div class="label">${t(e("dash.blocked"))}</div><div class="value value-sm">${i.blockedHits??0}</div></div>
              <div><div class="label">${t(e("dash.rateHits"))}</div><div class="value value-sm">${i.rateLimitedHits??0}</div></div>
              <div><div class="label">${t(e("dash.liveConn"))}</div><div class="value value-sm">${i.activeConnections??0}</div></div>
            </div>
            <div class="dash-prot-meta muted">
              ${t(e("dash.proxy"))}: ${t(xs(i.proxyIpSource))}
              · ${t(e("dash.hops"))}: ${i.proxyTrustHops??0}
              · ${t(e("dash.limits"))}: ${i.rateLimitMax??"—"}/${i.rateLimitIpMax??"—"}
            </div>
          </div>
        </div>

        <div class="panel dash-panel">
          <div class="panel-h"><strong>${t(e("dash.models24h"))}</strong></div>
          <div class="panel-pad">${P}</div>
        </div>

        <div class="panel dash-panel">
          <div class="panel-h"><strong>${t(e("dash.runtime"))}</strong></div>
          <div class="panel-pad dash-runtime">
            <div class="dash-prot-row">
              <span>${t(e("dash.port"))}</span>
              <strong>${n.port??"—"}<span class="muted" style="font-weight:500"> (${t(e("dash.defaultPort"))} ${n.defaultPort??3847})</span></strong>
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
              ${Re(!!n.encryptionReady,e("dash.ready"),e("dash.notReady"))}
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
  `),ie(),document.getElementById("dash-refresh")?.addEventListener("click",()=>Xt().catch(v)),document.querySelectorAll("[data-nav]").forEach(x=>{x.onclick=()=>{const y=x.dataset.nav;y&&ca(y)}}),document.querySelectorAll("[data-chat]").forEach(x=>{x.onclick=()=>Wa(x.dataset.chat)})}function Ms(a){return a?.length?a.map(s=>`<span class="chip ${vt(s.mimeType)?"img":""}" title="${t(s.mimeType)}">${t(s.originalName||e("chats.file"))}</span>`).join(" "):'<span class="muted">—</span>'}function Ga(a){const s=String(a||"");if(!s.trim())return{system:"",body:"",hasRoles:!1};if(!/^(system|user|assistant|tool): /m.test(s))return{system:"",body:s,hasRoles:!1};const o=/(^|\n)(system|user|assistant|tool): /g,i=[];let n;for(;(n=o.exec(s))!==null;)i.push({role:n[2],contentStart:n.index+n[0].length,index:n.index});if(!i.length)return{system:"",body:s,hasRoles:!1};const d=i.map((m,p)=>{const l=p+1<i.length?i[p+1].index:s.length;return{role:m.role,content:s.slice(m.contentStart,l)}}),r=d.filter(m=>m.role==="system").map(m=>m.content),u=d.filter(m=>m.role!=="system").map(m=>`${m.role}: ${m.content}`);return{system:r.join(`

`).trim(),body:u.length?u.join(`
`):s,hasRoles:!0,blocks:d}}async function ut(){await Promise.all([bt(),$t()]);const a=c.chatFilter,s=new URLSearchParams;if(s.set("limit",String(a.limit)),s.set("offset",String(a.offset)),a.status&&s.set("status",a.status),a.model&&s.set("model",a.model),a.apiKeyId&&s.set("apiKeyId",a.apiKeyId),a.q&&s.set("q",a.q),a.from&&s.set("from",new Date(a.from).toISOString()),a.to){const l=new Date(a.to);l.setHours(23,59,59,999),s.set("to",l.toISOString())}a.policyMode&&s.set("policyMode",a.policyMode),a.hasDocuments!==""&&s.set("hasDocuments",a.hasDocuments),$e(s,a);const o=await E(`/chats?${s}`),i=o.total||0,n=[`<option value="">${t(e("chats.allModels"))}</option>`,...c.models.map(l=>`<option value="${t(l)}" ${a.model===l?"selected":""}>${t(l)}</option>`)].join(""),d=[`<option value="">${t(e("chats.allKeys"))}</option>`,...c.keys.map(l=>`<option value="${l.id}" ${a.apiKeyId===l.id?"selected":""}>${t(l.name)} (${t(l.keyPrefix)})</option>`)].join(""),r=(o.items||[]).map(l=>{const k=Ga(l.promptPreview||""),g=!!k.system,f=g?k.body.slice(0,160):l.promptPreview||"";return`
    <tr>
      <td><button class="linkish cell-primary" data-chat="${l.id}">${t(l.requestId)}</button></td>
      <td><div class="cell-primary">${t(l.apiKey?.name||"")}</div><div class="cell-sub">${t(l.apiKey?.keyPrefix||"")}</div></td>
      <td>${t(l.model)}</td>
      <td>${pa(l.status)} ${Ft(l.policyMode||"-")}</td>
      <td>${Ms(l.documents)} ${l.documentCount?`<span class="muted">×${l.documentCount}</span>`:""}</td>
      <td class="chats-preview-cell">
        ${g?`<span class="chip sys-chip" title="${t(k.system.slice(0,400))}">${t(e("chats.hasSystem"))}</span>`:""}
        <div class="muted preview-text">${t(f)}</div>
      </td>
      <td class="chats-preview-cell"><div class="muted preview-text">${t(l.contentPreview)}</div></td>
      <td>${te(l.createdAt)}</td>
      <td class="muted">${l.durationMs!=null?gt(l.durationMs):"—"}</td>
    </tr>`}).join(""),u=Ne({title:e("chats.filterTitle")||e("common.filterTitle"),hint:e("chats.filterHint")||e("common.filterHint"),meta:q("common.pagerTotal",{n:i}),searchHtml:`
      <div class="data-filter-search">
        <label for="f-q">${t(e("chats.search"))}</label>
        <input type="search" id="f-q" value="${t(a.q)}" placeholder="${t(e("chats.searchPh"))}" />
      </div>`,gridHtml:`
      <label>${t(e("chats.status"))}
        <select id="f-status">
          <option value="">${t(e("chats.allStatus"))}</option>
          ${["success","error","timeout","pending"].map(l=>`<option value="${l}" ${a.status===l?"selected":""}>${t(e(`status.${l}`))}</option>`).join("")}
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
      </label>`}),m=be({headHtml:`
      <th>${t(e("chats.request"))}</th>
      <th>${t(e("chats.apiKey"))}</th>
      ${_({field:"model",label:e("chats.model"),filterRef:a})}
      ${_({field:"status",label:e("chats.status"),filterRef:a})}
      <th>${t(e("chats.attachments"))}</th>
      <th>${t(e("chats.prompt"))}</th>
      <th>${t(e("chats.response"))}</th>
      ${_({field:"createdAt",label:e("chats.time"),filterRef:a})}
      ${_({field:"durationMs",label:e("ddos.duration"),filterRef:a})}`,bodyHtml:r,colSpan:9,emptyText:e("common.empty"),pagerHtml:qe({total:i,limit:a.limit,offset:a.offset,idPrefix:"chats"})});document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("chats.title"))}</h2>
    </div>
    ${ke([e("chats.decrypt")])}
    ${u}
    ${m}
  `),ie(),rt("chats",c.chatFilter,()=>ut().catch(v)),je(c.chatFilter,()=>ut().catch(v));const p=()=>{c.chatFilter.q=document.getElementById("f-q").value.trim(),c.chatFilter.status=document.getElementById("f-status").value,c.chatFilter.model=document.getElementById("f-model").value,c.chatFilter.apiKeyId=document.getElementById("f-key").value,c.chatFilter.policyMode=document.getElementById("f-mode").value,c.chatFilter.from=document.getElementById("f-from").value,c.chatFilter.to=document.getElementById("f-to").value,c.chatFilter.hasDocuments=document.getElementById("f-docs").checked?"true":"",c.chatFilter.offset=0,ut().catch(v)};document.querySelector("[data-filter-apply]").onclick=p,document.getElementById("f-q").onkeydown=l=>{l.key==="Enter"&&p()},document.querySelector("[data-filter-reset]").onclick=()=>{c.chatFilter={q:"",status:"",model:"",apiKeyId:"",from:"",to:"",policyMode:"",hasDocuments:"",sortBy:"createdAt",sortDir:"desc",limit:50,offset:0},ut().catch(v)},document.querySelectorAll("[data-chat]").forEach(l=>{l.onclick=()=>Wa(l.dataset.chat)})}async function Wa(a){const{data:s}=await E(`/chats/${a}`),o=s.response||{},i=s.documents||[];let n=`<p class="muted">${t(e("chats.noAttach"))}</p>`;if(i.length){const m=[];for(const p of i){let l="";if(vt(p.mimeType))try{const k=await E(`/documents/${p.id}`),g=await Va(k.data||{id:p.id,isImage:!0,mimeType:p.mimeType});g?.src&&(l=`<img class="preview" src="${g.src}" alt="${t(p.originalName)}" />`)}catch{l=`<span class="muted">${t(e("chats.previewFailed"))}</span>`}m.push(`
        <div class="attach-item">
          <div style="flex:1;min-width:0">
            <strong>${t(p.originalName)}</strong>
            <div class="muted">${t(p.mimeType)} · ${Me(p.sizeBytes)}</div>
            ${l}
          </div>
          <button class="btn secondary sm" data-open-doc="${p.id}">${t(e("chats.openFile"))}</button>
        </div>`)}n=`<div class="attach-list">${m.join("")}</div>`}const d=Ga(s.prompt||""),r=d.system?`<div class="block block-system">
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
      <div class="card"><div class="label">${t(e("chats.duration"))}</div><div class="value value-sm">${gt(s.durationMs)}</div></div>
      <div class="card"><div class="label">${t(e("chats.apiKey"))}</div><div class="value value-sm">${t(s.apiKey?.name||"")}</div></div>
      <div class="card"><div class="label">${t(e("chats.stream"))}</div><div class="value value-sm">${s.stream?e("common.yes"):e("common.no")}</div></div>
    </div>
    ${s.errorMessage?`<div class="error-box">${t(s.errorMessage)}</div>`:""}
    ${r}
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
    <div class="modal-meta-foot muted">${t(e("common.ipLabel"))}: ${t(s.ip||"—")} · ${t(e("common.uaLabel"))}: ${t(s.userAgent||"—")} · ${te(s.createdAt)}</div>`;dt({title:e("chats.detail"),subtitle:`${t(s.requestId)} · ${pa(s.status)} ${Ft(s.policyMode||"-")}`,bodyHtml:u,size:"xl",footerHtml:`<button type="button" class="btn secondary sm" id="modal-ok">${t(e("chats.close"))}</button>`}),document.getElementById("modal-ok")?.addEventListener("click",()=>ye()),document.querySelector('[data-copy="system"]')?.addEventListener("click",()=>{navigator.clipboard.writeText(d.system||"")}),document.querySelector('[data-copy="prompt"]')?.addEventListener("click",()=>{navigator.clipboard.writeText(d.body||s.prompt||"")}),document.querySelector('[data-copy="raw-prompt"]')?.addEventListener("click",()=>{navigator.clipboard.writeText(s.prompt||"")}),document.querySelector('[data-copy="content"]')?.addEventListener("click",()=>{navigator.clipboard.writeText(o.content||"")}),document.querySelectorAll("[data-open-doc]").forEach(m=>{m.onclick=()=>Ja(m.dataset.openDoc)})}async function Oe(){const a=c.keyFilter;let s={};try{const p=await E("/usage");for(const l of p.data?.perKey||[])s[l.apiKeyId]=l}catch{}const o=new URLSearchParams;o.set("limit",String(a.limit)),o.set("offset",String(a.offset)),a.q&&o.set("q",a.q),a.role&&o.set("role",a.role),a.mode&&o.set("mode",a.mode),a.isActive!==""&&o.set("isActive",a.isActive),$e(o,a);const i=await E(`/keys?${o}`),n=i.data||[],d=i.total??n.length,r=n.map(p=>{const l=s[p.id],k=l?.requests??"—",g=l?Math.round((l.utilization||0)*100):0,f=p.ipWhitelist||[],b=f.length?q("keys.ipCount",{n:f.length}):e("keys.ipAll");return`
    <tr>
      <td><div class="cell-primary">${t(p.name)}</div><div class="cell-sub">${t(p.keyPrefix)}…</div></td>
      <td>${ks(p.role)}</td>
      <td>${Ft(p.mode)}</td>
      <td>${Fa(p.rateLimit)}</td>
      <td title="${t(f.join(", "))}">${t(b)}</td>
      <td>
        <div>${k} <span class="muted">(${t(e("keys.usage24"))})</span></div>
        <div class="usage-bar ${g>80?"warn":""}"><span style="width:${g}%"></span></div>
      </td>
      <td>${p.isActive?`<span class="badge success">${t(e("common.active"))}</span>`:`<span class="badge error">${t(e("common.revoked"))}</span>`}</td>
      <td>${te(p.createdAt)}</td>
      <td><div class="row-actions">
        <button class="btn secondary sm" data-edit="${p.id}">${t(e("keys.edit"))}</button>
        ${p.isActive?`<button class="btn danger sm" data-revoke="${p.id}">${t(e("keys.revoke"))}</button>`:""}
      </div></td>
    </tr>`}).join(""),u=Ne({title:e("common.filterTitle"),hint:e("common.filterHint"),meta:q("common.pagerTotal",{n:d}),searchHtml:`
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
      </label>`}),m=be({headHtml:`
      ${_({field:"name",label:e("keys.name"),filterRef:a})}
      ${_({field:"role",label:e("keys.role"),filterRef:a})}
      ${_({field:"mode",label:e("keys.mode"),filterRef:a})}
      ${_({field:"rateLimit",label:e("keys.rate"),filterRef:a})}
      <th>${t(e("keys.ipWhitelistCol"))}</th>
      <th>${t(e("keys.usage24"))}</th>
      ${_({field:"isActive",label:e("keys.status"),filterRef:a})}
      ${_({field:"createdAt",label:e("keys.created"),filterRef:a})}
      <th>${t(e("common.actions"))}</th>`,bodyHtml:r,colSpan:9,emptyText:e("keys.empty"),pagerHtml:qe({total:d,limit:a.limit,offset:a.offset,idPrefix:"keys"})});document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("keys.title"))}</h2>
      <div class="toolbar">
        <button class="btn" id="btn-new-key">${t(e("keys.new"))}</button>
      </div>
    </div>
    ${u}
    ${m}
  `),ie(),rt("keys",c.keyFilter,()=>Oe().catch(v)),je(c.keyFilter,()=>Oe().catch(v)),document.querySelector("[data-filter-apply]").onclick=()=>{c.keyFilter.q=document.getElementById("kf-q").value.trim(),c.keyFilter.role=document.getElementById("kf-role").value,c.keyFilter.mode=document.getElementById("kf-mode").value,c.keyFilter.isActive=document.getElementById("kf-active").value,c.keyFilter.offset=0,Oe().catch(v)},document.querySelector("[data-filter-reset]").onclick=()=>{c.keyFilter={q:"",role:"",mode:"",isActive:"",sortBy:"createdAt",sortDir:"desc",limit:20,offset:0},Oe().catch(v)},document.getElementById("btn-new-key").onclick=()=>wa(),document.querySelectorAll("[data-edit]").forEach(p=>{const l=n.find(k=>k.id===p.dataset.edit);p.onclick=()=>wa(l)}),document.querySelectorAll("[data-revoke]").forEach(p=>{p.onclick=async()=>{await J({message:e("keys.confirmRevoke"),variant:"danger",confirmText:e("keys.revoke")})&&(await E(`/keys/${p.dataset.revoke}`,{method:"DELETE"}),Oe().catch(v))}})}function wa(a){const s=!!a,o=(a?.ipWhitelist||[]).join(`
`);dt({title:e(s?"keys.edit":"keys.new"),subtitle:s?`${t(a?.name||"")} · ${t(a?.keyPrefix||"")}…`:"",size:"md",bodyHtml:`
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
      <button type="button" class="btn sm" id="k-save">${t(e("common.save"))}</button>`}),document.getElementById("k-role").value=a?.role||"client",document.getElementById("k-mode").value=a?.mode||"safe",s&&(document.getElementById("k-active").value=String(a.isActive)),document.getElementById("k-cancel").onclick=()=>ye(),document.getElementById("k-save").onclick=async()=>{const i=document.getElementById("k-ip").value.split(/[\n,]+/).map(d=>d.trim()).filter(Boolean),n={name:document.getElementById("k-name").value.trim(),role:document.getElementById("k-role").value,mode:document.getElementById("k-mode").value,rateLimit:Number(document.getElementById("k-rate").value||60),maxTurns:document.getElementById("k-turns").value?Number(document.getElementById("k-turns").value):null,timeoutMs:document.getElementById("k-timeout").value?Number(document.getElementById("k-timeout").value):null,ipWhitelist:i};try{if(s)n.isActive=document.getElementById("k-active").value==="true",await E(`/keys/${a.id}`,{method:"PATCH",body:JSON.stringify(n)}),ye(),Oe().catch(v);else{const d=await E("/keys",{method:"POST",body:JSON.stringify(n)}),r=document.getElementById("k-created");r&&(r.hidden=!1,r.textContent=`${e("keys.keyOnce")}
${d.data?.key||JSON.stringify(d.data)}`);const u=document.getElementById("k-save");u&&(u.textContent=e("chats.close"),u.onclick=()=>{ye(),Oe().catch(v)})}}catch(d){v(d)}}}function Qa(a){return e(a==="filesystem"?"docs.storageFs":"docs.storageDb")}async function za(a,s){try{const o=await fetch(`${ia}/documents/${a}/download`,{headers:c.key?{Authorization:`Bearer ${c.key}`}:{}});if(!o.ok){const r=await o.text();let u=r;try{u=JSON.parse(r).error?.message||r}catch{}throw new Error(u||e("docs.downloadFail"))}const i=await o.blob(),n=URL.createObjectURL(i),d=document.createElement("a");d.href=n,d.download=s||"download",document.body.appendChild(d),d.click(),d.remove(),URL.revokeObjectURL(n)}catch(o){U(o.message||e("docs.downloadFail"))}}async function at(){await $t();const a=c.docFilter,s=new URLSearchParams({limit:String(a.limit),offset:String(a.offset)});if(a.q&&s.set("q",a.q),a.apiKeyId&&s.set("apiKeyId",a.apiKeyId),a.storageType&&s.set("storageType",a.storageType),a.from&&s.set("from",new Date(a.from).toISOString()),a.to){const l=new Date(a.to);l.setHours(23,59,59,999),s.set("to",l.toISOString())}$e(s,a);const o=await E(`/documents?${s}`),i=o.total??0,n=o.meta||{},d=q("docs.storageHint",{dir:n.storageDir||"—",dbMax:Me(n.documentDbMaxBytes),upMax:Me(n.uploadMaxBytes)}),r=[`<option value="">${t(e("common.all"))}</option>`,...c.keys.map(l=>`<option value="${l.id}" ${a.apiKeyId===l.id?"selected":""}>${t(l.name)}</option>`)].join(""),u=(o.data||[]).map(l=>`
    <tr>
      <td><button class="linkish cell-primary" data-doc="${l.id}">${t(l.originalName)}</button>
        ${vt(l.mimeType)?`<span class="chip img">${t(e("chats.img"))}</span>`:""}</td>
      <td>${t(l.apiKey?.name||"")}</td>
      <td>${t(l.mimeType)}</td>
      <td>${Me(l.sizeBytes)}</td>
      <td>
        <span title="${t(l.storagePath||"")}">${t(Qa(l.storageType))}</span>
        ${l.storagePath?`<div class="cell-sub">${t(l.storagePath)}</div>`:""}
      </td>
      <td>${te(l.createdAt)}</td>
      <td><div class="row-actions">
        <button class="btn secondary sm" data-dl="${l.id}" data-name="${t(l.originalName)}">${t(e("docs.download"))}</button>
        <button class="btn danger sm" data-del="${l.id}">${t(e("docs.delete"))}</button>
      </div></td>
    </tr>`).join(""),m=Ne({title:e("common.filterTitle"),hint:e("common.filterHint"),meta:q("common.pagerTotal",{n:i}),searchHtml:`
      <div class="data-filter-search">
        <label for="df-q">${t(e("common.search"))}</label>
        <input type="search" id="df-q" value="${t(a.q)}" placeholder="${t(e("docs.searchPh"))}" />
      </div>`,gridHtml:`
      <label>${t(e("chats.apiKey"))}
        <select id="df-key">${r}</select>
      </label>
      <label>${t(e("docs.storage"))}
        <select id="df-storage">
          <option value="">${t(e("common.all"))}</option>
          <option value="db" ${a.storageType==="db"?"selected":""}>${t(e("docs.storageDb"))}</option>
          <option value="filesystem" ${a.storageType==="filesystem"?"selected":""}>${t(e("docs.storageFs"))}</option>
        </select>
      </label>
      <label>${t(e("chats.from"))}<input type="date" id="df-from" value="${t(a.from)}" /></label>
      <label>${t(e("chats.to"))}<input type="date" id="df-to" value="${t(a.to)}" /></label>`}),p=be({headHtml:`
      ${_({field:"originalName",label:e("docs.file"),filterRef:a})}
      <th>${t(e("chats.apiKey"))}</th>
      ${_({field:"mimeType",label:e("docs.mime"),filterRef:a})}
      ${_({field:"sizeBytes",label:e("docs.size"),filterRef:a})}
      ${_({field:"storageType",label:e("docs.storage"),filterRef:a})}
      ${_({field:"createdAt",label:e("docs.time"),filterRef:a})}
      <th>${t(e("common.actions"))}</th>`,bodyHtml:u,colSpan:7,emptyText:e("docs.empty"),pagerHtml:qe({total:i,limit:a.limit,offset:a.offset,idPrefix:"docs"})});document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("docs.title"))}</h2>
    </div>
    ${ke([d])}
    ${m}
    ${p}
  `),ie(),rt("docs",c.docFilter,()=>at().catch(v)),je(c.docFilter,()=>at().catch(v)),document.querySelector("[data-filter-apply]").onclick=()=>{c.docFilter.q=document.getElementById("df-q").value.trim(),c.docFilter.apiKeyId=document.getElementById("df-key").value,c.docFilter.storageType=document.getElementById("df-storage").value,c.docFilter.from=document.getElementById("df-from").value,c.docFilter.to=document.getElementById("df-to").value,c.docFilter.offset=0,at().catch(v)},document.querySelector("[data-filter-reset]").onclick=()=>{c.docFilter={q:"",apiKeyId:"",storageType:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",limit:20,offset:0},at().catch(v)},document.querySelectorAll("[data-doc]").forEach(l=>{l.onclick=()=>Ja(l.dataset.doc)}),document.querySelectorAll("[data-dl]").forEach(l=>{l.onclick=()=>za(l.getAttribute("data-dl"),l.getAttribute("data-name")||"file")}),document.querySelectorAll("[data-del]").forEach(l=>{l.onclick=async()=>{await J({message:e("docs.confirmDel"),variant:"danger",confirmText:e("docs.delete")})&&(await E(`/documents/${l.dataset.del}`,{method:"DELETE"}),at().catch(v))}})}async function qs(a){const s=await fetch(`${ia}/documents/${a}/download`,{headers:c.key?{Authorization:`Bearer ${c.key}`}:{}});if(!s.ok){const i=await s.text();let n=i;try{n=JSON.parse(i)?.error?.message||i}catch{}throw new Error(n||e("docs.downloadFail"))}const o=await s.blob();return URL.createObjectURL(o)}async function Va(a){if(a?.imageDataUrl)return{src:a.imageDataUrl,revoke:null};if(a?.isImage||vt(a?.mimeType)){const s=await qs(a.id);return{src:s,revoke:s}}return null}async function Ja(a){const{data:s}=await E(`/documents/${a}`);let o,i=null;try{const r=await Va(s);r?(i=r.revoke,o=`<img class="preview doc-preview-img" src="${r.src}" alt="${t(s.originalName||"")}" />`):s.isBinary||s.content==null?o=`<div class="data-empty"><div class="data-empty-icon">⧉</div><strong>${t(e("docs.binaryPreview"))}</strong></div>`:o=`<div class="pre" id="doc-content">${t(s.content||e("chats.none"))}</div>`}catch{o=`<div class="data-empty"><div class="data-empty-icon">⧉</div><strong>${t(e("chats.previewFailed")||e("docs.binaryPreview"))}</strong></div>`}const n=`${Qa(s.storageType)}${s.storagePath?` · ${s.storagePath}`:""}`;dt({title:e("docs.detail"),subtitle:`${t(s.originalName)} · ${t(s.mimeType)} · ${Me(s.sizeBytes)}<br/><span class="muted">${t(e("docs.storage"))}: ${t(n)}</span>`,size:"lg",bodyHtml:`
      <div class="block">
        <h4>${t(e("docs.preview"))}</h4>
        ${o}
      </div>`,footerHtml:`
      ${!s.imageDataUrl&&!(s.isImage||vt(s.mimeType))&&s.content&&!s.isBinary?`<button type="button" class="btn secondary sm" id="doc-copy">${t(e("docs.copy"))}</button>`:""}
      <button type="button" class="btn sm" id="doc-download">${t(e("docs.download"))}</button>
      <button type="button" class="btn secondary sm" id="doc-close">${t(e("chats.close"))}</button>`});const d=()=>{if(i)try{URL.revokeObjectURL(i)}catch{}ye()};document.getElementById("doc-close")?.addEventListener("click",d),document.getElementById("doc-download").onclick=()=>za(s.id,s.originalName),document.getElementById("doc-copy")?.addEventListener("click",async()=>{if(await Rt(s.content||"")){const u=document.getElementById("doc-copy");u&&(u.textContent=e("chat.copied"))}})}function Pa(a){if(!a)return"-";const s=`audit.actions.${String(a).replace(/\./g,"_")}`,o=e(s);return o===s?a:o}function Ts(a){if(!a)return"";const s=`audit.resources.${String(a).replace(/\./g,"_")}`,o=e(s);return o===s?a:o}function As(a){if(!a)return"";try{const s=typeof a=="string"?JSON.parse(a):a;return!s||typeof s!="object"?String(a):Object.entries(s).map(([o,i])=>{const n={originalName:e("docs.file"),mimeType:e("docs.mime"),sizeBytes:e("docs.size"),storageType:e("audit.metaStorage"),asKeyId:e("audit.metaAsKey"),asKeyName:e("audit.metaAsKeyName"),model:e("chats.model"),stream:e("chats.stream")}[o]||o,d=typeof i=="object"?JSON.stringify(i):String(i??"");return`${n}: ${d}`}).join(" · ")}catch{return String(a)}}async function mt(){await $t();const a=c.auditFilter,s=new URLSearchParams;if(s.set("limit",String(a.limit)),s.set("offset",String(a.offset)),a.q&&s.set("q",a.q),a.action&&s.set("action",a.action),a.apiKeyId&&s.set("apiKeyId",a.apiKeyId),a.from&&s.set("from",new Date(a.from).toISOString()),a.to){const l=new Date(a.to);l.setHours(23,59,59,999),s.set("to",l.toISOString())}$e(s,a);const o=await E(`/audit-logs?${s}`),i=o.total??0,n=["","chat.create","document.upload","document.delete","document.download","api_key.create","api_key.update","api_key.delete","settings.update","playground.chat","ip.ban","ip.unban","ddos.policy_update","pm2.switch","system.update"],d=[`<option value="">${t(e("common.all"))}</option>`,...c.keys.map(l=>`<option value="${l.id}" ${a.apiKeyId===l.id?"selected":""}>${t(l.name)}</option>`)].join(""),r=n.map(l=>l?`<option value="${t(l)}" ${a.action===l?"selected":""}>${t(Pa(l))}</option>`:`<option value="">${t(e("common.all"))}</option>`).join(""),u=(o.data||[]).map(l=>`
    <tr>
      <td>${te(l.createdAt)}</td>
      <td title="${t(l.action||"")}"><span class="cell-primary">${t(Pa(l.action))}</span></td>
      <td>
        <div>${t(Ts(l.resource))}</div>
        ${l.resourceId?`<div class="cell-sub audit-id" title="${t(l.resourceId)}">${t(l.resourceId)}</div>`:""}
      </td>
      <td>${t(l.apiKey?.name||"-")}</td>
      <td class="muted audit-meta">${t(As(l.metaJson))}</td>
    </tr>`).join(""),m=Ne({title:e("common.filterTitle"),hint:e("common.filterHint"),meta:q("common.pagerTotal",{n:i}),searchHtml:`
      <div class="data-filter-search">
        <label for="af-q">${t(e("common.search"))}</label>
        <input type="search" id="af-q" value="${t(a.q)}" placeholder="${t(e("audit.searchPh"))}" />
      </div>`,gridHtml:`
      <label>${t(e("audit.action"))}
        <select id="af-action">${r}</select>
      </label>
      <label>${t(e("audit.key"))}
        <select id="af-key">${d}</select>
      </label>
      <label>${t(e("chats.from"))}<input type="date" id="af-from" value="${t(a.from)}" /></label>
      <label>${t(e("chats.to"))}<input type="date" id="af-to" value="${t(a.to)}" /></label>`}),p=be({headHtml:`
      ${_({field:"createdAt",label:e("audit.time"),filterRef:a})}
      ${_({field:"action",label:e("audit.action"),filterRef:a})}
      ${_({field:"resource",label:e("audit.resource"),filterRef:a})}
      <th>${t(e("audit.key"))}</th>
      <th>${t(e("audit.meta"))}</th>`,bodyHtml:u,colSpan:5,emptyText:e("audit.empty"),pagerHtml:qe({total:i,limit:a.limit,offset:a.offset,idPrefix:"audit"})});document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("audit.title"))}</h2>
    </div>
    ${m}
    ${p}
  `),ie(),rt("audit",c.auditFilter,()=>mt().catch(v)),je(c.auditFilter,()=>mt().catch(v)),document.querySelector("[data-filter-apply]").onclick=()=>{c.auditFilter.q=document.getElementById("af-q").value.trim(),c.auditFilter.action=document.getElementById("af-action").value,c.auditFilter.apiKeyId=document.getElementById("af-key").value,c.auditFilter.from=document.getElementById("af-from").value,c.auditFilter.to=document.getElementById("af-to").value,c.auditFilter.offset=0,mt().catch(v)},document.querySelector("[data-filter-reset]").onclick=()=>{c.auditFilter={q:"",action:"",apiKeyId:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",limit:50,offset:0},mt().catch(v)}}function Yt(){return[{id:"local",titleKey:"settings.scLocalTitle",descKey:"settings.scLocalDesc",detailKey:"settings.scLocalDetail",values:{globalSafeMode:!1,safeToolsMode:"none",safeMaxTurns:16,safeTimeoutMs:18e4}},{id:"prod",titleKey:"settings.scProdTitle",descKey:"settings.scProdDesc",detailKey:"settings.scProdDetail",values:{globalSafeMode:!0,safeToolsMode:"none",safeMaxTurns:10,safeTimeoutMs:12e4}},{id:"code",titleKey:"settings.scCodeTitle",descKey:"settings.scCodeDesc",detailKey:"settings.scCodeDetail",values:{globalSafeMode:!1,safeToolsMode:"none",safeMaxTurns:20,safeTimeoutMs:3e5}},{id:"read",titleKey:"settings.scReadTitle",descKey:"settings.scReadDesc",detailKey:"settings.scReadDetail",values:{globalSafeMode:!0,safeToolsMode:"readonly",safeMaxTurns:12,safeTimeoutMs:15e4}},{id:"chat",titleKey:"settings.scChatTitle",descKey:"settings.scChatDesc",detailKey:"settings.scChatDetail",values:{globalSafeMode:!0,safeToolsMode:"none",safeMaxTurns:5,safeTimeoutMs:6e4}},{id:"long",titleKey:"settings.scLongTitle",descKey:"settings.scLongDesc",detailKey:"settings.scLongDetail",values:{globalSafeMode:!0,safeToolsMode:"none",safeMaxTurns:40,safeTimeoutMs:6e5}}]}function Bs(){return{globalSafeMode:document.getElementById("s-master-global")?Je("s-master-global"):!1,safeToolsMode:document.getElementById("s-tools")?.value||"none",safeMaxTurns:Number(document.getElementById("s-turns")?.value),safeTimeoutMs:Number(document.getElementById("s-timeout")?.value)}}function Cs(a){const s=Bs();return!Number.isFinite(s.safeMaxTurns)||!Number.isFinite(s.safeTimeoutMs)?!1:s.globalSafeMode===!!a.globalSafeMode&&s.safeToolsMode===a.safeToolsMode&&s.safeMaxTurns===Number(a.safeMaxTurns)&&s.safeTimeoutMs===Number(a.safeTimeoutMs)}function ot(){for(const a of Yt()){const s=document.querySelector(`[data-preset="${a.id}"]`),o=document.querySelector(`[data-apply-preset="${a.id}"]`);if(!s||!o)continue;const i=Cs(a.values);s.classList.toggle("is-applied",i),o.textContent=e(i?"settings.guideActive":"settings.guideApply"),o.disabled=i,o.classList.toggle("is-applied",i),o.setAttribute("aria-pressed",i?"true":"false")}}function Ls(a){const s=document.getElementById("s-tools"),o=document.getElementById("s-turns"),i=document.getElementById("s-timeout"),n=!!a.globalSafeMode;Xe("s-master-global",n,e("settings.masterOn"),e("settings.masterOff")),Ze("settings-root",!n),Ye("settings-disabled-banner",!n),s&&a.safeToolsMode&&(s.value=a.safeToolsMode),o&&a.safeMaxTurns!=null&&(o.value=String(a.safeMaxTurns)),i&&a.safeTimeoutMs!=null&&(i.value=String(a.safeTimeoutMs)),ot()}async function Ds(a){if(a?.values&&await J({title:e(a.titleKey),message:q("settings.guideApplyConfirm",{name:e(a.titleKey)}),variant:"confirm",confirmText:e("settings.guideApply")})){Ls(a.values);try{await E("/settings",{method:"PUT",body:JSON.stringify({globalSafeMode:!!a.values.globalSafeMode,safeToolsMode:a.values.safeToolsMode,safeMaxTurns:Number(a.values.safeMaxTurns),safeTimeoutMs:Number(a.values.safeTimeoutMs),defaultModel:document.getElementById("s-model")?.value?.trim()||""})}),ot();const s=document.querySelector("#flash-error");s&&(s.hidden=!1,s.classList.add("flash-ok"),s.textContent=e("settings.guideApplied"),setTimeout(()=>{s.textContent===e("settings.guideApplied")&&(s.hidden=!0,s.classList.remove("flash-ok"),s.textContent="")},2500))}catch(s){v(s)}}}async function Xa(){const[{data:a},s]=await Promise.all([E("/settings"),bt()]),o=(s.models||c.models||[]).map(r=>`<option value="${t(r)}" ${a.defaultModel===r?"selected":""}>${t(r)}</option>`).join(""),i=Yt().map(r=>`
      <article class="settings-guide-card" data-preset="${t(r.id)}">
        <div class="settings-guide-card-h">
          <strong>${t(e(r.titleKey))}</strong>
          <button type="button" class="btn secondary sm" data-apply-preset="${t(r.id)}">${t(e("settings.guideApply"))}</button>
        </div>
        <p class="settings-guide-desc">${t(e(r.descKey))}</p>
        <p class="settings-guide-detail muted">${t(e(r.detailKey))}</p>
        <div class="settings-guide-chips">
          <span class="chip">${t(r.values.globalSafeMode?e("settings.chipGlobalOn"):e("settings.chipGlobalOff"))}</span>
          <span class="chip">${t(r.values.safeToolsMode)}</span>
          <span class="chip">turns ${r.values.safeMaxTurns}</span>
          <span class="chip">${Math.round(r.values.safeTimeoutMs/1e3)}s</span>
        </div>
      </article>`).join(""),n=!!a.globalSafeMode;document.getElementById("app").innerHTML=ne(`
    <div id="settings-root" class="${n?"":"is-feature-off"}">
    <div class="topbar">
      <h2>${t(e("settings.title"))}</h2>
      <div class="toolbar">
        ${ga({id:"s-master-global",on:n,onLabel:e("settings.masterOn"),offLabel:e("settings.masterOff"),title:e("settings.globalSafeHint")})}
        <button class="btn secondary sm" id="btn-refresh-models">${t(e("settings.refreshModels"))}</button>
      </div>
    </div>
    <div class="feature-off-banner" id="settings-disabled-banner" ${n?"hidden":""} role="status">
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
        <div class="settings-guide-grid">${i}</div>
      </div>
    </div>
    <div class="danger-zone">
      <h3>${t(e("settings.dangerTitle"))}</h3>
      <p class="muted">${t(e("settings.panelOffHint"))} · ${t(e("settings.panelStatus"))}: <strong>${a.adminPanelEnabled?e("settings.panelOn"):e("settings.panelOff")}</strong></p>
      <button class="btn danger sm" id="s-disable-panel" ${a.adminPanelEnabled?"":"disabled"}>${t(e("settings.disablePanel"))}</button>
    </div>
    </div>
  `),ie(),document.getElementById("s-tools").value=a.safeToolsMode||"none";const d=()=>ot();["s-tools","s-turns","s-timeout"].forEach(r=>{const u=document.getElementById(r);u&&(u.addEventListener("change",d),u.addEventListener("input",d))}),ot(),document.getElementById("s-master-global")?.addEventListener("click",async()=>{const r=!Je("s-master-global");Xe("s-master-global",r,e("settings.masterOn"),e("settings.masterOff")),Ze("settings-root",!r),Ye("settings-disabled-banner",!r),ot();try{await E("/settings",{method:"PUT",body:JSON.stringify({globalSafeMode:r,safeToolsMode:document.getElementById("s-tools").value,safeMaxTurns:Number(document.getElementById("s-turns").value),safeTimeoutMs:Number(document.getElementById("s-timeout").value),defaultModel:document.getElementById("s-model").value.trim()})})}catch(u){Xe("s-master-global",!r,e("settings.masterOn"),e("settings.masterOff")),Ze("settings-root",r),Ye("settings-disabled-banner",r),v(u)}}),document.getElementById("btn-refresh-models").onclick=async()=>{await bt(!0),Xa().catch(v)},document.getElementById("s-save").onclick=async()=>{try{await E("/settings",{method:"PUT",body:JSON.stringify({globalSafeMode:Je("s-master-global"),safeToolsMode:document.getElementById("s-tools").value,safeMaxTurns:Number(document.getElementById("s-turns").value),safeTimeoutMs:Number(document.getElementById("s-timeout").value),defaultModel:document.getElementById("s-model").value.trim()})}),ot();const r=document.querySelector("#flash-error");r&&(r.hidden=!1,r.classList.add("flash-ok"),r.textContent=e("settings.saved"),setTimeout(()=>{r.hidden=!0,r.classList.remove("flash-ok"),r.textContent=""},2e3))}catch(r){v(r)}},document.querySelectorAll("[data-apply-preset]").forEach(r=>{r.addEventListener("click",async()=>{if(r.disabled)return;const u=r.getAttribute("data-apply-preset"),m=Yt().find(p=>p.id===u);m&&await Ds(m)})}),document.getElementById("s-disable-panel").onclick=async()=>{if(await J({message:e("settings.disablePanelConfirm"),variant:"danger",confirmText:e("settings.disablePanel")}))try{await E("/settings",{method:"PUT",body:JSON.stringify({adminPanelEnabled:!1})}),await pe({message:e("settings.disablePanelDone"),title:e("common.notice")}),At(!1)}catch(r){v(r)}}}async function Mt(){const a=await E("/api-features");if(c.page!=="apiFeatures")return;const s=a.data||{},o=[{id:"protocols",title:e("apiFeatures.groupProtocols"),tabLabel:e("apiFeatures.tabProtocols"),keys:["openaiChat","openaiResponses","anthropicMessages"]},{id:"media",title:e("apiFeatures.groupMedia"),tabLabel:e("apiFeatures.tabMedia"),keys:["imagesApi","filesOpenAiAlias","videoApi","audioApi"]},{id:"caps",title:e("apiFeatures.groupCaps"),tabLabel:e("apiFeatures.tabCaps"),keys:["tools","structuredOutput","vision","reasoningEffort","webSearch","subagents","planMode","memory","sessionResume","bestOfN","checkLoop","systemOverride","rules","permissionMode","sandbox"]},{id:"emu",title:e("apiFeatures.groupEmu"),tabLabel:e("apiFeatures.tabEmu"),keys:["usageEstimate","assistantsEmulation","strictSampling","forceDisableToolsInSafe"]}],i=c.apiFeaturesTab==="media"||c.apiFeaturesTab==="caps"||c.apiFeaturesTab==="emu"||c.apiFeaturesTab==="protocols"?c.apiFeaturesTab:"protocols";c.apiFeaturesTab=i;const n=f=>e(`apiFeatures.flag.${f}`)||f,d=f=>e(`apiFeatures.hint.${f}`)||"",r=f=>f.filter(b=>!!s[b]).length,u=f=>f.map(b=>{const $=!!s[b];return`
          <div class="dash-prot-row api-feat-row" data-feat="${t(b)}">
            <div>
              <strong>${t(n(b))}</strong>
              <div class="muted api-feat-hint">${t(d(b))}</div>
            </div>
            <button type="button" class="master-toggle ${$?"is-on":"is-off"}" data-feat-toggle="${t(b)}" aria-pressed="${$?"true":"false"}">
              <span class="master-toggle-track" aria-hidden="true"><span class="master-toggle-knob"></span></span>
              <span class="master-toggle-label">${t(e($?"dash.on":"dash.off"))}</span>
            </button>
          </div>`}).join(""),m=o.reduce((f,b)=>f+b.keys.length,0),p=o.reduce((f,b)=>f+r(b.keys),0),l=`
    <div class="grid api-feat-kpi-grid">
      <div class="card">
        <div class="label">${t(e("apiFeatures.kpiEnabled"))}</div>
        <div class="value value-sm">${p}<span class="dash-kpi-den">/${m}</span></div>
        <div class="muted card-sub">${t(e("apiFeatures.kpiEnabledSub"))}</div>
      </div>
      ${o.map(f=>{const b=r(f.keys);return`
        <div class="card">
          <div class="label">${t(f.tabLabel)}</div>
          <div class="value value-sm">${b}<span class="dash-kpi-den">/${f.keys.length}</span></div>
          <div class="muted card-sub">${t(f.title)}</div>
        </div>`}).join("")}
    </div>`,k=o.map(f=>{const b=r(f.keys);return`
        <button type="button" role="tab" class="seg-tab ${i===f.id?"is-active":""}" data-feat-tab="${t(f.id)}" aria-selected="${i===f.id}">
          ${t(f.tabLabel)}
          <span class="seg-tab-count">${b}/${f.keys.length}</span>
        </button>`}).join(""),g=o.map(f=>`
        <div class="usage-tab-pane api-feat-tab-pane" id="api-feat-tab-${t(f.id)}" ${i===f.id?"":"hidden"}>
          <div class="panel data-table-panel api-feat-panel">
            <div class="panel-h">
              <div class="panel-h-text">
                <strong>${t(f.title)}</strong>
                <span class="muted panel-h-sub">${t(q("apiFeatures.groupMeta",{on:r(f.keys),n:f.keys.length}))}</span>
              </div>
            </div>
            <div class="panel-pad api-feat-list">${u(f.keys)}</div>
          </div>
        </div>`).join("");document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("apiFeatures.title"))}</h2>
      <div class="toolbar">
        <button type="button" class="btn secondary sm" data-feat-preset="open">${t(e("apiFeatures.presetOpen"))}</button>
        <button type="button" class="btn secondary sm" data-feat-preset="locked">${t(e("apiFeatures.presetLocked"))}</button>
        <button type="button" class="btn secondary sm" data-feat-preset="dev">${t(e("apiFeatures.presetDev"))}</button>
      </div>
    </div>
    ${ke([e("apiFeatures.intro")])}
    ${l}

    <div class="usage-tabs-panel panel api-feat-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("apiFeatures.title"))}">
        ${k}
      </div>
      <div class="usage-tab-body">
        ${g}
      </div>
    </div>
  `),ie(),document.querySelectorAll("[data-feat-tab]").forEach(f=>{f.addEventListener("click",()=>{const b=f.getAttribute("data-feat-tab")||"protocols",$=b==="media"||b==="caps"||b==="emu"||b==="protocols"?b:"protocols";c.apiFeaturesTab!==$&&(c.apiFeaturesTab=$,Mt().catch(v))})}),document.querySelectorAll("[data-feat-toggle]").forEach(f=>{f.addEventListener("click",async()=>{const b=f.getAttribute("data-feat-toggle");if(!b)return;const $=!f.classList.contains("is-on");try{await E("/api-features",{method:"PUT",body:JSON.stringify({[b]:$})}),await Mt()}catch(A){v(A)}})}),document.querySelectorAll("[data-feat-preset]").forEach(f=>{f.addEventListener("click",async()=>{const b=f.getAttribute("data-feat-preset");if(await J({message:q("apiFeatures.presetConfirm",{name:b}),confirmText:e("common.confirm")}))try{await E("/api-features/preset",{method:"POST",body:JSON.stringify({name:b})}),await Mt()}catch($){v($)}})})}async function Ee(){c.mediaFilter||(c.mediaFilter={tab:"studio",q:"",kind:"",provider:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",jobSortBy:"createdAt",jobSortDir:"desc",limit:20,offset:0}),c.mediaFilter.sortBy||(c.mediaFilter.sortBy="createdAt"),c.mediaFilter.sortDir||(c.mediaFilter.sortDir="desc"),c.mediaFilter.jobSortBy||(c.mediaFilter.jobSortBy="createdAt"),c.mediaFilter.jobSortDir||(c.mediaFilter.jobSortDir="desc"),c.mediaFilter.tab||(c.mediaFilter.tab="studio");const a=c.mediaFilter,s=a.tab==="assets"||a.tab==="jobs"||a.tab==="studio"?a.tab:"studio";a.tab=s;const o=new URLSearchParams({limit:String(a.limit),offset:String(a.offset)});if(a.q&&o.set("q",a.q),a.kind&&o.set("kind",a.kind),a.provider&&o.set("provider",a.provider),a.from&&o.set("from",new Date(a.from).toISOString()),a.to){const y=new Date(a.to);y.setHours(23,59,59,999),o.set("to",y.toISOString())}$e(o,a);const i=new URLSearchParams({limit:"50",offset:"0"});$e(i,a,"jobSortBy","jobSortDir");const[n,,d,r]=await Promise.all([bt(!1).catch(()=>({models:c.models||[],defaultModel:""})),$t().catch(()=>{}),E(`/media/assets?${o}`),E(`/media/jobs?${i}`).catch(()=>({data:[],total:0}))]),u=d.data||[],m=d.total??u.length,p=r.data||[],l=r.total??p.length,k=(c.keys||[]).filter(y=>y.isActive!==!1&&(y.mode==="agent"||y.role==="admin")),g=[`<option value="">${t(e("media.generateKeySession"))}</option>`,...k.map(y=>`<option value="${t(y.id)}">${t(y.name||y.id)} · ${t(y.keyPrefix||"")}… · ${t(y.mode||"")}</option>`)].join(""),f=n.models?.length?n.models:c.models||[],b=n.defaultModel||f[0]||"",$=f.length?f.map(y=>`<option value="${t(y)}" ${y===b?"selected":""}>${t(y)}${y===b?` · ${t(e("media.modelDefault"))}`:""}</option>`).join(""):`<option value="">${t(b||e("media.modelEmpty"))}</option>`,A=[["1:1","1:1 · square"],["16:9","16:9 · landscape"],["9:16","9:16 · portrait / story"],["4:3","4:3"],["3:4","3:4"],["3:2","3:2"],["2:3","2:3"],["auto","auto"]].map(([y,h],N)=>`<option value="${y}" ${N===0?"selected":""}>${t(h)}</option>`).join(""),B=u.map(y=>{const h=y.mime||"",N=y.filename||y.originalName||"",W=Ss(h,N),M=fa(h,N)||"",O=W?`<button type="button" class="btn ghost sm" data-media-preview="${t(y.id)}" data-media-mime="${t(h)}" data-media-name="${t(N)}" data-media-kind="${t(y.kind||"")}" data-media-bytes="${t(String(y.bytes??""))}" data-media-prompt="${t(y.prompt||"")}" data-preview-kind="${t(M)}" title="${t(e("media.preview"))}">${t(e("media.preview"))}</button>`:"";return`
    <tr>
      <td>
        <div class="cell-primary mono" title="${t(y.id)}">${t(String(y.id).slice(0,8))}…</div>
        <div class="cell-sub">${t(N||y.source||"—")}</div>
      </td>
      <td>${t(y.kind||"—")}</td>
      <td class="muted">${t(h||"—")}</td>
      <td>${Me(y.bytes)}</td>
      <td>${t(y.provider||"—")}</td>
      <td class="muted" title="${t(y.prompt||"")}">${t((y.prompt||"—").slice(0,48))}</td>
      <td>${te(y.created_at)}</td>
      <td><div class="row-actions">
        ${O}
        <button type="button" class="btn ghost sm" data-media-dl="${t(y.id)}" data-media-name="${t(N)}">${t(e("media.download"))}</button>
        <button type="button" class="btn danger sm" data-media-del="${t(y.id)}">${t(e("media.delete"))}</button>
      </div></td>
    </tr>`}).join(""),R=Ne({title:e("common.filterTitle"),hint:e("common.filterHint"),meta:q("common.pagerTotal",{n:m}),searchHtml:`
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
      </label>`}),I=be({headHtml:`
      <th>ID</th>
      ${_({field:"kind",label:e("media.kind"),filterRef:a})}
      ${_({field:"mime",label:"MIME",filterRef:a})}
      ${_({field:"byteSize",label:e("media.bytes"),filterRef:a})}
      ${_({field:"provider",label:e("media.provider"),filterRef:a})}
      <th>${t(e("media.prompt"))}</th>
      ${_({field:"createdAt",label:e("media.created"),filterRef:a})}
      <th>${t(e("common.actions"))}</th>`,bodyHtml:B,colSpan:8,emptyText:e("media.empty"),pagerHtml:qe({total:m,limit:a.limit,offset:a.offset,idPrefix:"media"})}),K=p.map(y=>`
    <tr>
      <td>
        <div class="cell-primary mono" title="${t(y.id)}">${t(String(y.id).slice(0,8))}…</div>
      </td>
      <td>${t(y.status||"—")}</td>
      <td class="muted" title="${t(y.prompt||"")}">${t((y.prompt||"—").slice(0,64))}</td>
      <td class="mono">${t(y.result_asset_id?String(y.result_asset_id).slice(0,8)+"…":"—")}</td>
      <td>${te(y.created_at)}</td>
    </tr>`).join(""),P=be({headHtml:`
      <th>ID</th>
      ${_({field:"status",label:e("media.status"),filterRef:a,sortByKey:"jobSortBy",sortDirKey:"jobSortDir"})}
      <th>${t(e("media.prompt"))}</th>
      <th>Asset</th>
      ${_({field:"createdAt",label:e("media.created"),filterRef:a,sortByKey:"jobSortBy",sortDirKey:"jobSortDir"})}`,bodyHtml:K,colSpan:5,emptyText:e("media.jobsEmpty")}),S=`
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
            <select id="mg-key">${g}</select>
          </label>
          <label>${t(e("chats.model"))}
            <select id="mg-model">${$}</select>
            <span class="hint">${t(e("media.modelHint"))}</span>
          </label>
          <label id="mg-aspect-wrap">${t(e("media.aspectRatio"))}
            <select id="mg-aspect">${A}</select>
            <span class="hint">${t(e("media.aspectHint"))}</span>
          </label>
          <label id="mg-n-wrap">${t(e("media.generateN"))}
            <input type="number" id="mg-n" min="1" max="4" value="1" />
            <span class="hint">${t(e("media.nHint"))}</span>
          </label>
          <label id="mg-voice-wrap" hidden>${t(e("media.videoVoice"))}
            <select id="mg-voice">
              <option value="">${t(e("media.videoVoiceNone"))}</option>
              ${["ara","eve","leo","rex","sal","mio"].map(y=>`<option value="${y}">${y}</option>`).join("")}
            </select>
            <span class="hint">${t(e("media.videoVoiceHint"))}</span>
          </label>
          <label id="mg-duration-wrap" hidden>${t(e("media.videoDuration"))}
            <select id="mg-duration">
              ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(y=>`<option value="${y}" ${y===6?"selected":""}>${y}s</option>`).join("")}
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
    </div>`,F=`
    <div class="grid media-kpi-grid" id="media-kpi-grid">
      <div class="card">
        <div class="label">${t(e("media.assets"))}</div>
        <div class="value value-sm">${m}</div>
        <div class="muted card-sub">${t(e("media.kpiAssetsSub"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("media.jobs"))}</div>
        <div class="value value-sm">${l}</div>
        <div class="muted card-sub">${t(e("media.kpiJobsSub"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("media.tabStudio"))}</div>
        <div class="value value-sm">${t(e("media.modeGenerate"))} / ${t(e("media.modeEdit"))} / ${t(e("media.modeVideo"))}</div>
        <div class="muted card-sub">${t(e("media.kpiStudioSub"))}</div>
      </div>
    </div>`;document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("media.title"))}</h2>
    </div>
    ${ke([e("media.intro")])}
    ${F}
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
          <span class="seg-tab-count">${l}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane media-tab-pane-studio" id="media-tab-studio" ${s==="studio"?"":"hidden"}>
          ${S}
        </div>
        <div class="usage-tab-pane media-tab-pane-assets" id="media-tab-assets" ${s==="assets"?"":"hidden"}>
          ${R}
          ${I}
        </div>
        <div class="usage-tab-pane media-tab-pane-jobs" id="media-tab-jobs" ${s==="jobs"?"":"hidden"}>
          ${P}
        </div>
      </div>
    </div>
  `),ie(),document.querySelectorAll("[data-media-tab]").forEach(y=>{y.addEventListener("click",()=>{const h=y.getAttribute("data-media-tab")||"studio",N=h==="assets"||h==="jobs"||h==="studio"?h:"studio";c.mediaFilter.tab!==N&&(c.mediaFilter.tab=N,Ee().catch(v))})});async function x(y){const h=await fetch(`/admin/api/media/assets/${y}/download`,{headers:{Authorization:`Bearer ${c.key}`}});if(!h.ok)throw new Error(await h.text());return h.blob()}{let y="generate",h=null;const N=()=>{const w=document.getElementById("mg-source-chip"),T=document.getElementById("mg-clear-source");if(!w)return;if(!h){w.hidden=!0,w.innerHTML="",T&&(T.hidden=!0);return}const Z=h.kind==="file"?e("media.sourceKindUpload"):h.kind==="asset"?e("media.sourceKindAsset"):e("media.sourceKindDocument");w.hidden=!1,w.innerHTML=`<span class="chip">${t(Z)}</span> <span class="mono">${t(h.name||h.id||"")}</span>`,T&&(T.hidden=!1)},W=w=>{h=w;const T=document.getElementById("mg-file");T&&w?.kind!=="file"&&(T.value=""),N()},M=w=>{y=w==="edit"||w==="video"?w:"generate",document.querySelectorAll("[data-mg-mode]").forEach(we=>{const Pe=we.getAttribute("data-mg-mode")===y;we.classList.toggle("is-active",Pe),we.setAttribute("aria-selected",Pe?"true":"false")});const T=document.getElementById("mg-source-section"),Z=document.getElementById("mg-n-wrap"),ce=document.getElementById("mg-duration-wrap"),Ge=document.getElementById("mg-voice-wrap"),Se=document.getElementById("mg-submit");T&&(T.hidden=y==="generate"),Z&&(Z.hidden=y==="video"),ce&&(ce.hidden=y!=="video"),Ge&&(Ge.hidden=y!=="video"),Se&&(Se.textContent=e(y==="edit"?"media.editSubmit":y==="video"?"media.videoSubmit":"media.generateSubmit"));const se=document.getElementById("mg-prompt");se&&(se.placeholder=e(y==="edit"?"media.editPromptPh":y==="video"?"media.videoPromptPh":"media.generatePromptPh"));const Le=document.getElementById("mg-drop-title"),fe=document.getElementById("mg-drop-hint");Le&&(Le.textContent=e(y==="video"?"media.dropTitleVideo":"media.dropTitle")),fe&&(fe.textContent=e(y==="video"?"media.dropHintVideo":"media.dropHint"))};document.querySelectorAll("[data-mg-mode]").forEach(w=>{w.addEventListener("click",()=>M(w.getAttribute("data-mg-mode")||"generate"))}),M("generate");const O=document.getElementById("mg-dropzone"),j=document.getElementById("mg-file"),le=w=>w?w.type&&w.type.startsWith("image/")?!0:/\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(w.name||""):!1,me=w=>{const T=[...w||[]].find(le);if(!T){U(e("media.sourceNeedImage"));return}W({kind:"file",file:T,name:T.name,mime:T.type||"image/*"}),U("")};if(document.getElementById("mg-pick-file")?.addEventListener("click",w=>{w.preventDefault(),w.stopPropagation(),j?.click()}),j?.addEventListener("change",()=>{j.files?.length&&me(j.files)}),document.getElementById("mg-clear-source")?.addEventListener("click",w=>{w.preventDefault(),w.stopPropagation(),W(null)}),document.getElementById("mg-pick-lib")?.addEventListener("click",w=>{w.preventDefault(),w.stopPropagation(),Hs({imagesOnly:!0,onPick:T=>{W({kind:T.kind,id:T.id,name:T.name,mime:T.mime}),U("")}}).catch(T=>U(T.message||e("media.libraryLoadFail")))}),O&&(O.addEventListener("click",w=>{w.target.closest("button")||j?.click()}),O.addEventListener("keydown",w=>{(w.key==="Enter"||w.key===" ")&&(w.preventDefault(),j?.click())}),["dragenter","dragover"].forEach(w=>{O.addEventListener(w,T=>{T.preventDefault(),T.stopPropagation(),O.classList.add("is-dragover")})}),["dragleave","drop"].forEach(w=>{O.addEventListener(w,T=>{T.preventDefault(),T.stopPropagation(),O.classList.remove("is-dragover")})}),O.addEventListener("drop",w=>{const T=w.dataTransfer;T?.files?.length&&me(T.files)})),c._mediaDragAbort)try{c._mediaDragAbort.abort()}catch{}c._mediaDragAbort=new AbortController;const G={signal:c._mediaDragAbort.signal},X=document.getElementById("app");let H=0;window.addEventListener("dragenter",w=>{y!=="generate"&&[...w.dataTransfer?.types||[]].includes("Files")&&(H+=1,X?.classList.add("is-media-file-drag"))},G),window.addEventListener("dragleave",()=>{H=Math.max(0,H-1),H===0&&X?.classList.remove("is-media-file-drag")},G),window.addEventListener("drop",w=>{H=0,X?.classList.remove("is-media-file-drag"),y!=="generate"&&w.dataTransfer?.files?.length&&(w.preventDefault(),me(w.dataTransfer.files))},G),window.addEventListener("dragover",w=>{y!=="generate"&&[...w.dataTransfer?.types||[]].includes("Files")&&w.preventDefault()},G),document.getElementById("mg-submit")?.addEventListener("click",async()=>{const w=document.getElementById("mg-prompt")?.value?.trim()||"";if(!w){U(e("media.generateNeedPrompt"));return}const T=document.getElementById("mg-key")?.value||"",Z=document.getElementById("mg-model")?.value||void 0,ce=document.getElementById("mg-aspect")?.value||"1:1",Ge=Math.min(4,Math.max(1,Number(document.getElementById("mg-n")?.value)||1)),Se=document.getElementById("mg-submit"),se=document.getElementById("mg-status"),Le=e(y==="video"?"media.videoBusy":y==="edit"?"media.editBusy":"media.generateBusy");Se&&(Se.disabled=!0,Se.textContent=Le),se&&(se.hidden=!1,se.textContent=Le),U("");try{if(y==="edit"){if(!h)throw new Error(e("media.editNeedImage"));const V=new FormData;V.append("prompt",w),V.append("aspect_ratio",ce),V.append("n",String(Ge)),V.append("response_format","url"),Z&&V.append("model",Z),T&&V.append("apiKeyId",T),h.kind==="file"&&h.file?V.append("image",h.file):h.kind==="asset"&&h.id?V.append("sourceAssetId",h.id):h.kind==="document"&&h.id&&V.append("sourceDocumentId",h.id),await ka(await fetch("/admin/api/media/edit",{method:"POST",headers:{Authorization:`Bearer ${c.key}`},body:V})),se&&(se.textContent=e("media.editOk")),c.mediaFilter.tab="assets",c.mediaFilter.offset=0,await Ee();return}if(y==="video"){const V=new FormData;V.append("prompt",w),V.append("aspect_ratio",ce),V.append("seconds",String(document.getElementById("mg-duration")?.value||6)),Z&&V.append("model",Z),T&&V.append("apiKeyId",T);const $a=document.getElementById("mg-voice")?.value||"";$a&&V.append("voices",$a),h?.kind==="file"&&h.file?V.append("image",h.file):h?.kind==="asset"&&h.id?V.append("source_asset_id",h.id):h?.kind==="document"&&h.id&&V.append("source_document_id",h.id),await ka(await fetch("/admin/api/media/videos",{method:"POST",headers:{Authorization:`Bearer ${c.key}`},body:V})),se&&(se.textContent=e("media.videoOk")),c.mediaFilter.tab="jobs",await Ee();return}const fe={prompt:w,aspect_ratio:ce,n:Ge,response_format:"url"};Z&&(fe.model=Z),T&&(fe.apiKeyId=T);const Pe=(await E("/media/generate",{method:"POST",body:JSON.stringify(fe)}))?.data?.grok?.asset_ids||[];if(se&&(se.textContent=e("media.generateOk")),c.mediaFilter.tab="assets",c.mediaFilter.offset=0,await Ee(),Pe[0])try{const V=await x(Pe[0]);Sa({id:Pe[0],mime:V.type||"image/png",filename:`generated-${String(Pe[0]).slice(0,8)}`,kind:"image",bytes:V.size,prompt:w},V)}catch{}}catch(fe){v(fe),se&&(se.textContent=fe.message||e("media.generateFail")),Se&&(Se.disabled=!1,M(y))}})}(s==="assets"||s==="jobs")&&je(c.mediaFilter,()=>Ee().catch(v)),s==="assets"&&(rt("media",c.mediaFilter,()=>Ee().catch(v)),document.querySelector("#media-tab-assets [data-filter-apply]")?.addEventListener("click",()=>{c.mediaFilter.q=document.getElementById("mf-q")?.value.trim()||"",c.mediaFilter.kind=document.getElementById("mf-kind")?.value||"",c.mediaFilter.provider=document.getElementById("mf-provider")?.value.trim()||"",c.mediaFilter.from=document.getElementById("mf-from")?.value||"",c.mediaFilter.to=document.getElementById("mf-to")?.value||"",c.mediaFilter.offset=0,Ee().catch(v)}),document.querySelector("#media-tab-assets [data-filter-reset]")?.addEventListener("click",()=>{const y=c.mediaFilter.tab;c.mediaFilter={tab:y,q:"",kind:"",provider:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",jobSortBy:"createdAt",jobSortDir:"desc",limit:20,offset:0},Ee().catch(v)}),document.querySelectorAll("[data-media-preview]").forEach(y=>{y.addEventListener("click",async()=>{try{const h=y.getAttribute("data-media-preview");if(!h)return;const N=y.getAttribute("data-media-mime")||"",W=y.getAttribute("data-media-name")||"",M=y.getAttribute("data-media-kind")||"",O=y.getAttribute("data-media-bytes")||"",j=y.getAttribute("data-media-prompt")||"",le=await x(h);Sa({id:h,mime:N||le.type||"",filename:W,kind:M,bytes:O?Number(O):le.size,prompt:j},le)}catch(h){v(h)}})}),document.querySelectorAll("[data-media-dl]").forEach(y=>{y.addEventListener("click",async()=>{try{const h=y.getAttribute("data-media-dl"),N=y.getAttribute("data-media-name")||"",W=await x(h),M=document.createElement("a");M.href=URL.createObjectURL(W),M.download=N||`media-${String(h).slice(0,8)}`,M.click(),setTimeout(()=>URL.revokeObjectURL(M.href),3e4)}catch(h){v(h)}})}),document.querySelectorAll("[data-media-del]").forEach(y=>{y.addEventListener("click",async()=>{const h=y.getAttribute("data-media-del");if(await J({message:e("media.deleteConfirm"),variant:"danger",confirmText:e("media.delete")}))try{await E(`/media/assets/${h}`,{method:"DELETE"}),await Ee()}catch(N){v(N)}})}))}async function Hs(a){const s=a.imagesOnly!==!1;let o="documents",i=0,n=null;dt({title:e("media.libraryTitle"),subtitle:t(e("media.librarySubtitle")),size:"md",bodyHtml:`
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
      <button type="button" class="btn sm" id="mlib-add" disabled>${t(e("media.librarySelect"))}</button>`});const d=document.getElementById("mlib-list"),r=document.getElementById("mlib-q"),u=document.getElementById("mlib-add");document.getElementById("mlib-cancel")?.addEventListener("click",()=>ye());const m=()=>{u&&(u.disabled=!n,u.textContent=n?`${e("media.librarySelect")} · ${n.name.slice(0,24)}`:e("media.librarySelect"))},p=b=>String(b||"").startsWith("image/"),l=b=>/\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(String(b||"")),k=b=>{if(d){if(!b.length){d.innerHTML=`<div class="data-empty chat-lib-empty"><strong>${t(e("media.libraryEmpty"))}</strong></div>`;return}d.innerHTML=b.map($=>{const A=n?.id===$.id&&n?.kind===$.kind;return`
          <label class="chat-lib-row ${A?"is-selected":""}" data-kind="${t($.kind)}" data-id="${t($.id)}">
            <input type="radio" name="mlib-pick" ${A?"checked":""} />
            <span class="chat-lib-meta">
              <span class="chat-lib-name" title="${t($.name)}">${t($.name)}</span>
              <span class="muted">${t($.kindLabel)} · ${t($.mime||"—")}${$.size!=null?` · ${Me($.size)}`:""}</span>
            </span>
          </label>`}).join(""),d.querySelectorAll(".chat-lib-row").forEach($=>{$.addEventListener("click",()=>{const A=$.getAttribute("data-kind"),B=$.getAttribute("data-id"),R=b.find(I=>I.id===B&&I.kind===A);R&&(n={kind:R.kind,id:R.id,name:R.name,mime:R.mime},d.querySelectorAll(".chat-lib-row").forEach(I=>{I.classList.toggle("is-selected",I.getAttribute("data-id")===B&&I.getAttribute("data-kind")===A);const K=I.querySelector("input");K&&(K.checked=I.getAttribute("data-id")===B&&I.getAttribute("data-kind")===A)}),m())})})}},g=async()=>{const b=++i;d&&(d.innerHTML=`<div class="muted chat-lib-status">${t(e("common.loading")||"…")}</div>`);try{const $=(r?.value||"").trim();let A=[];if(o==="assets"){const B=new URLSearchParams({limit:"80",offset:"0"});$&&B.set("q",$),s&&B.set("kind","image"),A=((await E(`/media/assets?${B}`)).data||[]).filter(I=>!s||p(I.mime)||l(I.filename)).map(I=>({kind:"asset",kindLabel:e("media.sourceKindAsset"),id:I.id,name:I.filename||I.prompt||I.id,mime:I.mime||"",size:I.bytes}))}else{const B=new URLSearchParams({limit:"80",offset:"0"});$&&B.set("q",$),A=((await E(`/documents?${B}`)).data||[]).filter(I=>!s||p(I.mimeType)||l(I.originalName)).map(I=>({kind:"document",kindLabel:e("media.sourceKindDocument"),id:I.id,name:I.originalName||I.id,mime:I.mimeType||"",size:I.sizeBytes}))}if(b!==i)return;k(A)}catch($){if(b!==i)return;d&&(d.innerHTML=`<div class="error-box">${t($.message||e("media.libraryLoadFail"))}</div>`)}};document.querySelectorAll("[data-mlib-tab]").forEach(b=>{b.addEventListener("click",()=>{o=b.getAttribute("data-mlib-tab")==="assets"?"assets":"documents",document.querySelectorAll("[data-mlib-tab]").forEach($=>{$.classList.toggle("is-active",$.getAttribute("data-mlib-tab")===o)}),n=null,m(),g()})});let f=null;r?.addEventListener("input",()=>{f&&clearTimeout(f),f=setTimeout(()=>g(),280)}),u?.addEventListener("click",()=>{n&&(a.onPick(n),ye())}),m(),await g()}async function ue(){const a=c.usageFilter;a.sortBy||(a.sortBy="lastUsedAt"),a.sortDir||(a.sortDir="desc"),a.modelSortBy||(a.modelSortBy="requests"),a.modelSortDir||(a.modelSortDir="desc");const s=new URLSearchParams;$e(s,a),a.modelSortBy&&s.set("modelSortBy",a.modelSortBy),(a.modelSortDir==="asc"||a.modelSortDir==="desc")&&s.set("modelSortDir",a.modelSortDir);const{data:o}=await E(`/usage?${s}`),i=o.totals||{},n=o.limits||{},d=a.pageSize||10;let r=o.byModel||[];if(a.modelQ.trim()){const P=a.modelQ.trim().toLowerCase();r=r.filter(S=>String(S.model||"").toLowerCase().includes(P))}const u=r.length,p=r.slice(a.modelPage*d,a.modelPage*d+d).map(P=>`<tr><td class="cell-primary">${t(P.model)}</td><td>${P.requests}</td></tr>`).join("");let l=o.perKey||[];if(a.keyQ.trim()){const P=a.keyQ.trim().toLowerCase();l=l.filter(S=>String(S.name||"").toLowerCase().includes(P)||String(S.keyPrefix||"").toLowerCase().includes(P))}a.keyActive==="true"&&(l=l.filter(P=>P.isActive)),a.keyActive==="false"&&(l=l.filter(P=>!P.isActive));const k=l.length,f=l.slice(a.keyPage*d,a.keyPage*d+d).map(P=>{const S=Math.round((P.utilization||0)*100);return`<tr>
        <td><div class="cell-primary">${t(P.name)}</div><div class="cell-sub">${t(P.keyPrefix)}</div></td>
        <td>${P.requests}</td>
        <td>${Fa(P.rateLimit)}</td>
        <td>
          <div>${q("common.percent",{n:S})}</div>
          <div class="usage-bar ${S>80?"warn":""}"><span style="width:${S}%"></span></div>
        </td>
        <td>${P.isActive?`<span class="badge success">${t(e("common.active"))}</span>`:`<span class="badge error">${t(e("common.revoked"))}</span>`}</td>
        <td class="muted">${P.lastUsedAt?te(P.lastUsedAt):"—"}</td>
      </tr>`}).join(""),b=qe({total:u,limit:d,offset:a.modelPage*d,idPrefix:"umodel"}),$=qe({total:k,limit:d,offset:a.keyPage*d,idPrefix:"ukey"}),A=a.tab==="key"?"key":"model",B=Ne({title:e("usage.byModel"),hint:e("common.filterHint"),searchHtml:`<div class="data-filter-search"><label>${t(e("common.search"))}<input type="search" id="uf-model" value="${t(a.modelQ)}" placeholder="${t(e("chats.model"))}" /></label></div>`,gridHtml:""}),R=be({headHtml:`
      ${_({field:"model",label:e("chats.model"),filterRef:a,sortByKey:"modelSortBy",sortDirKey:"modelSortDir"})}
      ${_({field:"requests",label:e("usage.requests"),filterRef:a,sortByKey:"modelSortBy",sortDirKey:"modelSortDir"})}`,bodyHtml:p,colSpan:2,emptyText:e("common.empty"),pagerHtml:b}),I=Ne({title:e("usage.byKey"),hint:e("common.filterHint"),searchHtml:`<div class="data-filter-search"><label>${t(e("common.search"))}<input type="search" id="uf-key" value="${t(a.keyQ)}" placeholder="${t(e("keys.name"))}" /></label></div>`,gridHtml:`<label>${t(e("keys.status"))}
      <select id="uf-active">
        <option value="">${t(e("common.all"))}</option>
        <option value="true" ${a.keyActive==="true"?"selected":""}>${t(e("common.active"))}</option>
        <option value="false" ${a.keyActive==="false"?"selected":""}>${t(e("common.revoked"))}</option>
      </select>
    </label>`}),K=be({headHtml:`
      ${_({field:"name",label:e("keys.name"),filterRef:a})}
      ${_({field:"requests",label:e("usage.requests"),filterRef:a})}
      ${_({field:"rateLimit",label:e("usage.rateLimit"),filterRef:a})}
      ${_({field:"utilization",label:e("usage.util"),filterRef:a})}
      ${_({field:"isActive",label:e("keys.status"),filterRef:a})}
      ${_({field:"lastUsedAt",label:e("usage.lastUsed")||e("media.created"),filterRef:a})}`,bodyHtml:f,colSpan:6,emptyText:e("common.empty"),pagerHtml:$});document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("usage.title"))}</h2>
      <button class="btn secondary sm" id="btn-usage-refresh">${t(e("usage.refresh"))}</button>
    </div>
    ${ke([`${e("usage.window")}: ${te(o.from)} → ${te(o.to)} (${q("common.minutes",{n:o.windowMinutes})})`])}
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
        <button type="button" role="tab" class="seg-tab ${A==="model"?"is-active":""}" data-usage-tab="model" aria-selected="${A==="model"}">
          ${t(e("usage.byModel"))}
          <span class="seg-tab-count">${u}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${A==="key"?"is-active":""}" data-usage-tab="key" aria-selected="${A==="key"}">
          ${t(e("usage.byKey"))}
          <span class="seg-tab-count">${k}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane" id="usage-tab-model" ${A==="model"?"":"hidden"}>
          ${B}
          ${R}
        </div>
        <div class="usage-tab-pane" id="usage-tab-key" ${A==="key"?"":"hidden"}>
          ${I}
          ${K}
        </div>
      </div>
    </div>
  `),ie(),je(c.usageFilter,()=>ue().catch(v)),document.getElementById("btn-usage-refresh").onclick=()=>ue().catch(v),document.querySelectorAll("[data-usage-tab]").forEach(P=>{P.onclick=()=>{const S=P.dataset.usageTab==="key"?"key":"model";c.usageFilter.tab!==S&&(c.usageFilter.tab=S,ue().catch(v))}}),document.getElementById("umodel-prev")?.addEventListener("click",()=>{c.usageFilter.modelPage=Math.max(0,a.modelPage-1),ue().catch(v)}),document.getElementById("umodel-next")?.addEventListener("click",()=>{(a.modelPage+1)*d<u&&(c.usageFilter.modelPage+=1,ue().catch(v))}),document.getElementById("umodel-limit")?.addEventListener("change",P=>{c.usageFilter.pageSize=Number(P.target.value)||10,c.usageFilter.modelPage=0,ue().catch(v)}),document.getElementById("ukey-prev")?.addEventListener("click",()=>{c.usageFilter.keyPage=Math.max(0,a.keyPage-1),ue().catch(v)}),document.getElementById("ukey-next")?.addEventListener("click",()=>{(a.keyPage+1)*d<k&&(c.usageFilter.keyPage+=1,ue().catch(v))}),document.getElementById("ukey-limit")?.addEventListener("change",P=>{c.usageFilter.pageSize=Number(P.target.value)||10,c.usageFilter.keyPage=0,ue().catch(v)}),document.querySelectorAll("#usage-tab-model [data-filter-apply]").forEach(P=>{P.onclick=()=>{c.usageFilter.modelQ=document.getElementById("uf-model")?.value?.trim()||"",c.usageFilter.modelPage=0,ue().catch(v)}}),document.querySelectorAll("#usage-tab-model [data-filter-reset]").forEach(P=>{P.onclick=()=>{c.usageFilter.modelQ="",c.usageFilter.modelPage=0,ue().catch(v)}}),document.querySelectorAll("#usage-tab-key [data-filter-apply]").forEach(P=>{P.onclick=()=>{c.usageFilter.keyQ=document.getElementById("uf-key")?.value?.trim()||"",c.usageFilter.keyActive=document.getElementById("uf-active")?.value||"",c.usageFilter.keyPage=0,ue().catch(v)}}),document.querySelectorAll("#usage-tab-key [data-filter-reset]").forEach(P=>{P.onclick=()=>{c.usageFilter.keyQ="",c.usageFilter.keyActive="",c.usageFilter.keyPage=0,ue().catch(v)}})}function Ea(a){const s=a.versionStatus||(a.updateAvailable?"update_available":a.latest?"up_to_date":"unknown");return s==="update_available"?{badge:`<span class="badge warn" title="${t(e("system.statusHintUpdate"))}">${t(e("system.badgeUpdate"))}</span>`,hint:e("system.statusHintUpdate")}:s==="ahead"?{badge:`<span class="badge pending" title="${t(e("system.statusHintAhead"))}">${t(e("system.badgeAhead"))}</span>`,hint:e("system.statusHintAhead")}:s==="up_to_date"?{badge:`<span class="badge success" title="${t(e("system.statusHintOk"))}">${t(e("system.badgeOk"))}</span>`,hint:e("system.statusHintOk")}:{badge:`<span class="badge pending" title="${t(e("system.statusHintUnknown"))}">${t(e("system.badgeUnknown"))}</span>`,hint:e("system.statusHintUnknown")}}function Os(a){return e(a==="git"?"system.channelGit":a==="npm-global"?"system.channelNpmGlobal":a==="npm-local"?"system.channelNpmLocal":"system.channelUnknown")}function _s(a){return a==="required"?e("system.levelRequired"):a==="recommended"?e("system.levelRecommended"):a==="optional"?e("system.levelOptional"):a==="bundled"?e("system.levelBundled"):a||"—"}function Rs(a){return a.installed?a.ok?`<span class="badge success">${t(e("system.softOk"))}</span>`:`<span class="badge warn">${t(e("system.softWarn"))}</span>`:a.level==="required"||a.level==="bundled"?`<span class="badge error">${t(e("system.softMissing"))}</span>`:`<span class="badge pending">${t(e("system.softMissing"))}</span>`}function Ia(a){return a==="up"?`<span class="badge success">${t(e("system.up"))}</span>`:`<span class="badge error">${t(e("system.down"))}</span>`}async function st(){const{data:a}=await E("/system");if(c.page!=="system")return;const s=a.version||{},o=Ea(s),i=a.software||{checks:[],allRequiredOk:!0},n=i.checks||[],d=c.systemTab==="package"||c.systemTab==="env"||c.systemTab==="sessions"?c.systemTab:"software";c.systemTab=d;let r={data:[],total:0};try{const S=new URLSearchParams({limit:d==="sessions"?"50":"1",offset:"0"});d==="sessions"&&c.grokSessionQ&&S.set("q",c.grokSessionQ);const F=await E(`/grok/sessions?${S}`);r={data:F.data||[],total:F.total||0}}catch(S){r={data:[],total:0,error:S.message||String(S)}}const u=n.map(S=>`
      <tr>
        <td><div class="cell-primary">${t(S.name||S.id)}</div>${S.requiredVersion?`<div class="cell-sub">${t(S.requiredVersion)}</div>`:""}</td>
        <td>${t(_s(S.level))}</td>
        <td>${t(S.installed?e("system.yes"):e("system.no"))}${S.path?`<div class="cell-sub soft-path">${t(S.path)}</div>`:""}</td>
        <td><code class="cell-code">${t(S.version||"—")}</code></td>
        <td>${Rs(S)}</td>
        <td class="muted">${t(S.detail||"")}</td>
      </tr>`).join(""),m=i.allRequiredOk?`<span class="badge success">${t(e("system.allRequiredOk"))}</span>`:`<span class="badge error">${t(e("system.requiredMissing"))}</span>`,p=a.encryption&&a.encryption.ready,l=Os(s.channel),k=s.installSource?`${l} · ${s.installSource}`:l,g=be({headHtml:`
      <th>${t(e("system.softName"))}</th>
      <th>${t(e("system.softLevel"))}</th>
      <th>${t(e("system.softInstalled"))}</th>
      <th>${t(e("system.softVersion"))}</th>
      <th>${t(e("system.softStatus"))}</th>
      <th>${t(e("system.softDetail"))}</th>`,bodyHtml:u,colSpan:6,emptyText:e("common.empty")}),f=`
    <div class="grid system-kpi-grid" id="system-kpi-grid">
      <div class="card">
        <div class="label">${t(e("system.database"))}</div>
        <div class="value value-sm">${Ia(a.database)}</div>
        <div class="muted card-sub">${t(e("system.runtime"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("system.grokCli"))}</div>
        <div class="value value-sm">${Ia(a.grokCli)}</div>
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
    </div>`,b=a.grokInspect,$=b?[[e("system.grokVersion"),b.grokVersion||"—"],[e("system.inspectChannel"),b.channel||"—"],[e("system.inspectDefaultModel"),b.defaultModel||"—"],[e("system.inspectModels"),String(b.models?.length??0)],[e("system.inspectSkills"),String(b.skills??0)],[e("system.inspectMcp"),String(b.mcpServers??0)],[e("system.inspectPlugins"),String(b.plugins??0)],[e("system.inspectHooks"),String(b.hooks??0)]]:[],A=b?`
    <div class="panel system-inspect-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("system.grokInspect"))}</strong>
          <span class="muted panel-h-sub">${t(e("system.grokInspectHint"))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <div class="grid system-inspect-grid">
          ${$.map(([S,F])=>`
            <div class="card">
              <div class="label">${t(S)}</div>
              <div class="value value-sm">${t(F)}</div>
            </div>`).join("")}
        </div>
        ${b.error?`<div class="error-box">${t(b.error)}</div>`:""}
      </div>
    </div>`:"",B=`
    <div class="system-tab-toolbar">
      <span class="muted">${t(e("system.softwareHint"))}</span>
      ${m}
    </div>
    ${A}
    ${g}`,R=`
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
    </div>`,I=`
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
    </div>`,K=(r.data||[]).map(S=>`
      <tr>
        <td><code class="cell-code">${t(S.id)}</code></td>
        <td><div class="cell-primary">${t(S.title||"—")}</div>
          <div class="cell-sub">${t(S.summary||"")}</div></td>
        <td class="muted">${t(S.cwd||"—")}</td>
        <td>${t((S.updatedAt||"").slice(0,19).replace("T"," ")||"—")}</td>
        <td>${S.messageCount!=null?S.messageCount:"—"}</td>
        <td><button type="button" class="btn danger sm" data-del-gsess="${t(S.id)}">${t(e("system.sessionDelete"))}</button></td>
      </tr>`).join(""),P=`
    <div class="system-tab-toolbar">
      <span class="muted">${t(e("system.sessionsHint"))}</span>
      <form id="gsess-search" class="inline-form">
        <input type="search" id="gsess-q" value="${t(c.grokSessionQ||"")}" placeholder="${t(e("system.sessionsSearch"))}" />
        <button type="submit" class="btn secondary sm">${t(e("common.search")||"Search")}</button>
      </form>
    </div>
    ${r.error?`<div class="error-box">${t(r.error)}</div>`:""}
    ${be({headHtml:`
        <th>${t(e("system.sessionId"))}</th>
        <th>${t(e("system.sessionTitle"))}</th>
        <th>${t(e("system.sessionCwd"))}</th>
        <th>${t(e("system.sessionUpdated"))}</th>
        <th>${t(e("chats.msgs")||"#")}</th>
        <th></th>`,bodyHtml:K,colSpan:6,emptyText:e("common.empty")})}
    <div class="muted">${t(String(r.total||0))}</div>`;document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("system.title"))}</h2>
      <div class="toolbar">
        <button class="btn secondary sm" id="btn-check-update" title="${t(e("system.selfHint"))}">${t(e("system.checkUpdate"))}</button>
        <button class="btn sm" id="btn-one-click-update" title="${t(e("system.confirmUpdate"))}">${t(e("system.oneClick"))}</button>
      </div>
    </div>
    ${ke([e("system.selfHint")])}
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
          <span class="seg-tab-count">${r.total}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane system-tab-pane-software" id="system-tab-software" ${d==="software"?"":"hidden"}>
          ${B}
        </div>
        <div class="usage-tab-pane system-tab-pane-package" id="system-tab-package" ${d==="package"?"":"hidden"}>
          ${R}
        </div>
        <div class="usage-tab-pane system-tab-pane-env" id="system-tab-env" ${d==="env"?"":"hidden"}>
          ${I}
        </div>
        <div class="usage-tab-pane system-tab-pane-sessions" id="system-tab-sessions" ${d==="sessions"?"":"hidden"}>
          ${P}
        </div>
      </div>
    </div>
  `),ie(),document.getElementById("gsess-search")?.addEventListener("submit",S=>{S.preventDefault(),c.grokSessionQ=document.getElementById("gsess-q")?.value||"",st().catch(v)}),document.querySelectorAll("[data-del-gsess]").forEach(S=>{S.addEventListener("click",async()=>{const F=S.getAttribute("data-del-gsess");if(!(!F||!await J({title:e("system.sessionDelete"),message:e("system.sessionDeleteConfirm").replace("{id}",F)})))try{await E(`/grok/sessions/${encodeURIComponent(F)}`,{method:"DELETE"}),await st()}catch(y){v(y)}})}),document.querySelectorAll("[data-system-tab]").forEach(S=>{S.addEventListener("click",()=>{const F=S.getAttribute("data-system-tab")||"software",x=F==="package"||F==="env"||F==="software"||F==="sessions"?F:"software";c.systemTab!==x&&(c.systemTab=x,st().catch(v))})}),document.getElementById("btn-check-update").onclick=async()=>{try{const F=(await E("/system/update-check")).data||{},x=Ea(F);await pe({title:e("system.checkResult"),message:`${e("system.current")}: ${F.current||"?"}
${e("system.npm")}: ${F.latestNpm||"n/a"}
${e("system.github")}: ${F.latestGithub||"n/a"}
${x.hint}`}),c.systemTab="package",st().catch(v)}catch(S){v(S)}},document.getElementById("btn-one-click-update").onclick=async()=>{if(!await J({message:e("system.confirmUpdate"),variant:"danger",confirmText:e("system.oneClick")}))return;c.systemTab!=="package"&&(c.systemTab="package",await st());const S=document.getElementById("update-log");try{const F=document.getElementById("btn-one-click-update");F&&(F.disabled=!0);const x=await E("/system/update",{method:"POST",body:JSON.stringify({restart:!0})});S&&(S.style.display="block",S.textContent=x.data&&(x.data.message||JSON.stringify(x.data,null,2))||e("system.scheduled")),await pe(x.data&&x.data.message||e("system.scheduled"))}catch(F){v(F)}}}function Zt(a){if(!a)return"—";const s=`ddos.sources.${a}`,o=e(s);return o===s?a:o}function Ie(a){return Math.max(1,Math.round(Number(a||0)/1e3))}function ve(a){return Math.max(1,Math.round(Number(a||0)/6e4))}function lt(a){return Math.max(1e3,Math.round(Number(a||0)*1e3))}function ct(a){return Math.max(1e3,Math.round(Number(a||0)*6e4))}function z(a,s){const o=Number(document.getElementById(a)?.value);return Number.isFinite(o)?o:s}function tt(a){return document.getElementById(a)?.checked===!0}function ea(){const a=(document.getElementById("dp-whitelist")?.value||"").split(/[\n,]+/).map(i=>i.trim()).filter(Boolean),s=(document.getElementById("dp-trustedProxies")?.value||"").split(/[\n,]+/).map(i=>i.trim()).filter(Boolean);return{autoBanEnabled:document.getElementById("ddos-master-autoban")?Je("ddos-master-autoban"):tt("dp-autoBanEnabled")||document.getElementById("dp-autoBanEnabled")?.value==="1",rateLimitWindowMs:lt(z("dp-rateWindowSec",60)),rateLimitMax:Math.floor(z("dp-rateMaxKey",120)),rateLimitIpMax:Math.floor(z("dp-rateMaxIp",60)),chatBurstWindowMs:lt(z("dp-burstWindowSec",10)),chatBurstMax:Math.floor(z("dp-burstMax",20)),autoAuthEnabled:tt("dp-autoAuthEnabled"),failedAuthThreshold:Math.floor(z("dp-authThreshold",20)),failedAuthWindowMs:lt(z("dp-authWindowSec",300)),authBanDurationMs:ct(z("dp-authBanMin",10)),autoRateEnabled:tt("dp-autoRateEnabled"),rateHitThreshold:Math.floor(z("dp-rateHitThreshold",30)),rateHitWindowMs:lt(z("dp-rateHitWindowSec",60)),rateBanDurationMs:ct(z("dp-rateBanMin",15)),autoConnEnabled:tt("dp-autoConnEnabled"),maxConcurrentPerIp:Math.floor(z("dp-maxConcurrent",20)),connBanDurationMs:ct(z("dp-connBanMin",10)),autoVelocityEnabled:tt("dp-autoVelocityEnabled"),velocityMaxRequests:Math.floor(z("dp-velocityMax",200)),velocityWindowMs:lt(z("dp-velocityWindowSec",60)),velocityBanDurationMs:ct(z("dp-velocityBanMin",10)),escalateEnabled:tt("dp-escalateEnabled"),escalateAfterBans:Math.floor(z("dp-escalateAfter",3)),escalateDurationMs:ct(z("dp-escalateMin",1440)),whitelist:a,proxyTrustHops:Math.max(0,Math.min(10,Math.floor(z("dp-proxyTrustHops",1)))),proxyIpSource:document.getElementById("dp-proxyIpSource")?.value||"auto",trustedProxies:s.length?s:["127.0.0.1","::1"]}}const Fs=["autoBanEnabled","rateLimitWindowMs","rateLimitMax","rateLimitIpMax","chatBurstWindowMs","chatBurstMax","autoAuthEnabled","failedAuthThreshold","failedAuthWindowMs","authBanDurationMs","autoRateEnabled","rateHitThreshold","rateHitWindowMs","rateBanDurationMs","autoConnEnabled","maxConcurrentPerIp","connBanDurationMs","autoVelocityEnabled","velocityMaxRequests","velocityWindowMs","velocityBanDurationMs","escalateEnabled","escalateAfterBans","escalateDurationMs"];function xa(a){if(!a)return{};const s={};for(const o of Fs){const i=a[o];typeof i=="boolean"?s[o]=i:typeof i=="number"&&Number.isFinite(i)?s[o]=Math.round(i):i==null?s[o]=null:s[o]=i}return s}function Ya(a,s){return JSON.stringify(xa(a))===JSON.stringify(xa(s))}function ta(a){const s=c._ddosPresetsCache;if(!s||!a)return"custom";for(const o of["relaxed","balanced","strict"])if(s[o]&&Ya(a,s[o]))return o;return"custom"}function qt(a){return e(a==="relaxed"?"ddos.presetRelaxed":a==="balanced"?"ddos.presetBalanced":a==="strict"?"ddos.presetStrict":"ddos.presetCustom")}function Za(a,{unsaved:s=!1}={}){const o=qt(a),i=a==="relaxed"?"relaxed":a==="balanced"?"balanced":a==="strict"?"strict":"custom",n=s?q("ddos.presetFormLabel",{name:o}):q("ddos.presetActiveLabel",{name:o});return`<span class="ddos-preset-badge is-${i}" id="ddos-preset-badge" title="${t(n)}">${t(n)}</span>`}function De(){if(!document.getElementById("ddos-policy-panel"))return;let a;try{a=ea()}catch{return}const s=ta(a),o=ta(c._ddosPolicyCache||a),i=!Ya(a,c._ddosPolicyCache||a);document.querySelectorAll("[data-ddos-preset]").forEach(u=>{const m=u.dataset.ddosPreset,p=m===s,l=m===o;u.classList.toggle("is-active",p),u.classList.toggle("is-saved",l&&!p),u.setAttribute("aria-pressed",p?"true":"false");const k=e(m==="relaxed"?"ddos.presetRelaxed":m==="balanced"?"ddos.presetBalanced":"ddos.presetStrict");p&&l?u.innerHTML=`${t(k)} <span class="preset-tag">${t(e("ddos.presetTagActive"))}</span>`:p&&i?u.innerHTML=`${t(k)} <span class="preset-tag preset-tag--draft">${t(e("ddos.presetTagDraft"))}</span>`:l?u.innerHTML=`${t(k)} <span class="preset-tag preset-tag--saved">${t(e("ddos.presetTagSaved"))}</span>`:u.textContent=k});const n=document.getElementById("ddos-preset-badge");if(n){const u=Za(s,{unsaved:i&&s!==o});n.outerHTML=u}const d=document.getElementById("ddos-preset-custom");d&&(d.classList.toggle("is-active",s==="custom"),d.setAttribute("aria-pressed",s==="custom"?"true":"false"));const r=document.getElementById("ddos-preset-hint");r&&(i&&s!==o?(r.textContent=q("ddos.presetUnsavedHint",{form:qt(s),saved:qt(o)}),r.hidden=!1):s==="custom"?(r.textContent=e("ddos.presetCustomHint"),r.hidden=!1):(r.textContent=q("ddos.presetActiveHint",{name:qt(s)}),r.hidden=!1))}function Ut(a){if(!a||!document.getElementById("dp-autoBanEnabled"))return;const s=(i,n)=>{const d=document.getElementById(i);d&&(d.type==="checkbox"?d.checked=!!n:d.value=n)},o=document.getElementById("dp-autoBanEnabled");o&&(o.type==="checkbox"?o.checked=!!a.autoBanEnabled:o.value=a.autoBanEnabled?"1":"0"),Xe("ddos-master-autoban",!!a.autoBanEnabled,e("ddos.masterOn"),e("ddos.masterOff")),Ze("ddos-root",!a.autoBanEnabled),Ye("ddos-disabled-banner",!a.autoBanEnabled),s("dp-rateWindowSec",Ie(a.rateLimitWindowMs)),s("dp-rateMaxKey",a.rateLimitMax),s("dp-rateMaxIp",a.rateLimitIpMax),s("dp-burstWindowSec",Ie(a.chatBurstWindowMs)),s("dp-burstMax",a.chatBurstMax),s("dp-autoAuthEnabled",a.autoAuthEnabled),s("dp-authThreshold",a.failedAuthThreshold),s("dp-authWindowSec",Ie(a.failedAuthWindowMs)),s("dp-authBanMin",ve(a.authBanDurationMs)),s("dp-autoRateEnabled",a.autoRateEnabled),s("dp-rateHitThreshold",a.rateHitThreshold),s("dp-rateHitWindowSec",Ie(a.rateHitWindowMs)),s("dp-rateBanMin",ve(a.rateBanDurationMs)),s("dp-autoConnEnabled",a.autoConnEnabled),s("dp-maxConcurrent",a.maxConcurrentPerIp),s("dp-connBanMin",ve(a.connBanDurationMs)),s("dp-autoVelocityEnabled",a.autoVelocityEnabled),s("dp-velocityMax",a.velocityMaxRequests),s("dp-velocityWindowSec",Ie(a.velocityWindowMs)),s("dp-velocityBanMin",ve(a.velocityBanDurationMs)),s("dp-escalateEnabled",a.escalateEnabled),s("dp-escalateAfter",a.escalateAfterBans),s("dp-escalateMin",ve(a.escalateDurationMs)),s("dp-whitelist",(a.whitelist||[]).join(`
`)),s("dp-proxyTrustHops",a.proxyTrustHops??1),s("dp-proxyIpSource",a.proxyIpSource||"auto"),s("dp-trustedProxies",(a.trustedProxies&&a.trustedProxies.length?a.trustedProxies:["127.0.0.1","::1"]).join(`
`)),ba(a.autoBanEnabled),De()}function ba(a){const s=document.getElementById("ddos-auto-badge");s&&(s.className=`badge ${a?"success":"pending"}`,s.textContent=e(a?"ddos.autoOn":"ddos.autoOff"))}function Ns(a){const s=(d,r)=>`<label class="data-filter-check policy-enable"><input type="checkbox" id="${d}" ${r?"checked":""} /> <span>${t(e("ddos.enableRule"))}</span></label>`,o=(d,r,u,m="1")=>`<label>${t(d)}<input type="number" id="${r}" value="${t(String(u))}" min="1" step="${m}" /></label>`,i=ta(a),n=Za(i);return`
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
            ${o(e("ddos.rateWindow"),"dp-rateWindowSec",Ie(a.rateLimitWindowMs))}
            ${o(e("ddos.rateMaxKey"),"dp-rateMaxKey",a.rateLimitMax)}
            ${o(e("ddos.rateMaxIp"),"dp-rateMaxIp",a.rateLimitIpMax)}
            ${o(e("ddos.burstWindow"),"dp-burstWindowSec",Ie(a.chatBurstWindowMs))}
            ${o(e("ddos.burstMax"),"dp-burstMax",a.chatBurstMax)}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionAuth"))}</h4>${s("dp-autoAuthEnabled",a.autoAuthEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.threshold"),"dp-authThreshold",a.failedAuthThreshold)}
            ${o(e("ddos.windowSec"),"dp-authWindowSec",Ie(a.failedAuthWindowMs))}
            ${o(e("ddos.banMin"),"dp-authBanMin",ve(a.authBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionRate"))}</h4>${s("dp-autoRateEnabled",a.autoRateEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.threshold"),"dp-rateHitThreshold",a.rateHitThreshold)}
            ${o(e("ddos.windowSec"),"dp-rateHitWindowSec",Ie(a.rateHitWindowMs))}
            ${o(e("ddos.banMin"),"dp-rateBanMin",ve(a.rateBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionConn"))}</h4>${s("dp-autoConnEnabled",a.autoConnEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.maxConcurrent"),"dp-maxConcurrent",a.maxConcurrentPerIp)}
            ${o(e("ddos.banMin"),"dp-connBanMin",ve(a.connBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionVelocity"))}</h4>${s("dp-autoVelocityEnabled",a.autoVelocityEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.velocityMax"),"dp-velocityMax",a.velocityMaxRequests)}
            ${o(e("ddos.windowSec"),"dp-velocityWindowSec",Ie(a.velocityWindowMs))}
            ${o(e("ddos.banMin"),"dp-velocityBanMin",ve(a.velocityBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionEscalate"))}</h4>${s("dp-escalateEnabled",a.escalateEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.escalateAfter"),"dp-escalateAfter",a.escalateAfterBans)}
            ${o(e("ddos.escalateMin"),"dp-escalateMin",ve(a.escalateDurationMs))}
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
    </div>`}function Ks(a){return a?.length?a.map(s=>`
    <tr>
      <td>${te(s.at)}</td>
      <td class="cell-primary">${t(s.ip)}</td>
      <td><span class="badge ${s.escalated?"warn":"pending"}">${t(Zt(s.source))}</span></td>
      <td class="muted" style="max-width:280px;word-break:break-word">${t(s.reason||"")}</td>
      <td>${t(ve(s.durationMs))} min</td>
    </tr>`).join(""):`<tr class="empty-row"><td colspan="5"><div class="data-empty"><strong>${t(e("ddos.emptyEvents"))}</strong></div></td></tr>`}async function ee(a={}){const s=!!a.soft&&document.getElementById("ddos-root"),o=document.querySelector(".main"),i=o?o.scrollTop:0;We&&(clearInterval(We),We=null);const n=c.ddosFilter;n.liveSortBy||(n.liveSortBy="startedAt"),n.liveSortDir||(n.liveSortDir="desc"),n.banSortBy||(n.banSortBy="createdAt"),n.banSortDir||(n.banSortDir="desc"),n.eventSortBy||(n.eventSortBy="at"),n.eventSortDir||(n.eventSortDir="desc");const d=new URLSearchParams;$e(d,n,"liveSortBy","liveSortDir");const r=new URLSearchParams;$e(r,n,"banSortBy","banSortDir");const u=new URLSearchParams;$e(u,n,"eventSortBy","eventSortDir");const m=[E(`/ddos/connections?${d}`),E(`/ddos/blacklist?${r}`),E("/ddos/stats"),E(`/ddos/events?${u}`)];s||m.push(E("/ddos/policy"));const p=await Promise.all(m),[l,k,g,f]=p,b=s?null:p[4],$=n.pageSize||15;let A=l.data?.active||[],B=l.data?.recent||[],R=k.data||[];const I=g.data||{},K=f.data||[],P=b?.data||c._ddosPolicyCache||null,S=b?.presets||c._ddosPresetsCache||null;P&&(c._ddosPolicyCache=P),S&&(c._ddosPresetsCache=S);const F=(c._ddosPolicyCache?.whitelist||[]).map(String);if(n.liveQ.trim()){const H=n.liveQ.trim().toLowerCase(),w=T=>[T.ip,T.path,T.method,T.apiKeyName,T.apiKeyPrefix].filter(Boolean).some(Z=>String(Z).toLowerCase().includes(H));A=A.filter(w),B=B.filter(w)}if(n.banQ.trim()){const H=n.banQ.trim().toLowerCase();R=R.filter(w=>String(w.ip||"").toLowerCase().includes(H)||String(w.reason||"").toLowerCase().includes(H))}n.banSource&&(R=R.filter(H=>H.source===n.banSource));const x=A.slice(n.livePage*$,n.livePage*$+$),y=R.slice(n.banPage*$,n.banPage*$+$),h=x.map(H=>`
    <tr>
      <td class="cell-primary">${t(H.ip)}</td>
      <td>${t(H.method)}</td>
      <td class="muted" style="max-width:220px;word-break:break-all">${t(H.path)}</td>
      <td>${t(H.apiKeyName||H.apiKeyPrefix||"—")}</td>
      <td><span class="badge pending">${t(e("status.active"))}</span></td>
      <td>${gt(Date.now()-H.startedAt)}</td>
      <td><div class="row-actions"><button class="btn danger sm" data-ban="${t(H.ip)}">${t(e("ddos.ban"))}</button></div></td>
    </tr>`).join(""),N=B.slice(0,40).map(H=>`
    <tr>
      <td class="cell-primary">${t(H.ip)}</td>
      <td>${t(H.method)} ${t(H.path)}</td>
      <td>${H.statusCode??"—"}</td>
      <td>${gt(H.durationMs)}</td>
      <td><div class="row-actions"><button class="btn danger sm" data-ban="${t(H.ip)}">${t(e("ddos.ban"))}</button></div></td>
    </tr>`).join(""),W=y.map(H=>`
    <tr>
      <td class="cell-primary">${t(H.ip)}</td>
      <td>${t(H.reason||"—")}</td>
      <td><span class="badge pending">${t(Zt(H.source))}</span></td>
      <td>${H.expiresAt?te(H.expiresAt):t(e("ddos.permanent"))}</td>
      <td><div class="row-actions"><button class="btn secondary sm" data-unban="${t(H.ip)}">${t(e("ddos.unban"))}</button></div></td>
    </tr>`).join(""),M=(I.topIps||[]).map(H=>`<tr><td class="cell-primary">${t(H.ip)}</td><td>${H.requests}</td>
      <td><div class="row-actions"><button class="btn danger sm" data-ban="${t(H.ip)}">${t(e("ddos.ban"))}</button></div></td></tr>`).join(""),O=Ks(K),j=`<tr class="empty-row"><td colspan="7"><div class="data-empty"><strong>${t(e("ddos.emptyLive"))}</strong></div></td></tr>`,le=`<tr class="empty-row"><td colspan="5"><div class="data-empty"><strong>${t(e("common.empty"))}</strong></div></td></tr>`,me=`<tr class="empty-row"><td colspan="5"><div class="data-empty"><strong>${t(e("ddos.emptyBan"))}</strong></div></td></tr>`,G=`<tr class="empty-row"><td colspan="3"><div class="data-empty"><strong>${t(e("common.empty"))}</strong></div></td></tr>`,X=["","manual","auto-auth","auto-rate","auto-conn","auto-velocity","auto-escalate"].map(H=>H?`<option value="${H}" ${n.banSource===H?"selected":""}>${t(Zt(H))}</option>`:`<option value="">${t(e("common.all"))}</option>`).join("");if(s){const H=(T,Z)=>{const ce=document.getElementById(T);ce&&(ce.innerHTML=Z)},w=(T,Z)=>{const ce=document.getElementById(T);ce&&(ce.textContent=Z)};w("ddos-stat-active",String(I.activeConnections??A.length)),w("ddos-stat-rate",String(I.rateLimitedHits??0)),w("ddos-stat-blocked",String(I.blockedHits??0)),w("ddos-stat-ban",String(R.length)),w("ddos-stat-auto",String(I.autoBanTotal??0)),w("ddos-tab-count-live",String(A.length)),w("ddos-tab-count-ban",String(R.length)),w("ddos-tab-count-events",String(K.length)),H("ddos-live-body",h||j),H("ddos-recent-body",N||le),H("ddos-ban-body",W||me),H("ddos-top-body",M||G),H("ddos-events-body",O),ya(document),I.policySummary&&ba(!!I.policySummary.autoBanEnabled),Ma(),o&&(o.scrollTop=i)}else{const H=P||{autoBanEnabled:!0,rateLimitWindowMs:6e4,rateLimitMax:120,rateLimitIpMax:60,chatBurstWindowMs:1e4,chatBurstMax:20,autoAuthEnabled:!0,failedAuthThreshold:20,failedAuthWindowMs:3e5,authBanDurationMs:6e5,autoRateEnabled:!0,rateHitThreshold:30,rateHitWindowMs:6e4,rateBanDurationMs:9e5,autoConnEnabled:!0,maxConcurrentPerIp:20,connBanDurationMs:6e5,autoVelocityEnabled:!0,velocityMaxRequests:200,velocityWindowMs:6e4,velocityBanDurationMs:6e5,escalateEnabled:!0,escalateAfterBans:3,escalateDurationMs:864e5,whitelist:["127.0.0.1","::1"],proxyTrustHops:1,proxyIpSource:"auto",trustedProxies:["127.0.0.1","::1"]},w=!!H.autoBanEnabled,T=n.tab==="live"||n.tab==="blacklist"||n.tab==="events"||n.tab==="policy"?n.tab:"policy";c.ddosFilter.tab=T;const Z=`
    <div class="grid ddos-kpi-grid">
      <div class="card"><div class="label">${t(e("ddos.activeConn"))}</div><div class="value value-sm" id="ddos-stat-active">${I.activeConnections??A.length}</div><div class="muted card-sub">${t(e("ddos.live"))}</div></div>
      <div class="card"><div class="label">${t(e("ddos.rateHits"))}</div><div class="value value-sm" id="ddos-stat-rate">${I.rateLimitedHits??0}</div><div class="muted card-sub">${t(e("ddos.stats"))}</div></div>
      <div class="card"><div class="label">${t(e("ddos.blockedHits"))}</div><div class="value value-sm" id="ddos-stat-blocked">${I.blockedHits??0}</div><div class="muted card-sub">${t(e("ddos.stats"))}</div></div>
      <div class="card"><div class="label">${t(e("ddos.blacklist"))}</div><div class="value value-sm" id="ddos-stat-ban">${R.length}</div><div class="muted card-sub">${t(e("ddos.tabBlacklist"))}</div></div>
      <div class="card"><div class="label">${t(e("ddos.autoBans"))}</div><div class="value value-sm" id="ddos-stat-auto">${I.autoBanTotal??0}</div><div class="muted card-sub">${t(e("ddos.tabEvents"))}</div></div>
    </div>`,ce=Ns(H),Ge=`
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
        <span class="muted">${t(q("common.pagerTotal",{n:A.length}))}</span>
      </div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          ${_({field:"ip",label:e("ddos.ip"),filterRef:n,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${_({field:"method",label:e("ddos.method"),filterRef:n,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${_({field:"path",label:e("ddos.path"),filterRef:n,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          <th>${t(e("ddos.key"))}</th>
          <th>${t(e("ddos.state"))}</th>
          ${_({field:"durationMs",label:e("ddos.duration"),filterRef:n,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          <th>${t(e("common.actions"))}</th>
        </tr></thead>
        <tbody id="ddos-live-body">${h||j}</tbody>
      </table>
      </div>
      ${qe({total:A.length,limit:$,offset:n.livePage*$,idPrefix:"ddoslive"})}
    </div>
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${t(e("ddos.recent"))}</strong></div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          ${_({field:"ip",label:e("ddos.ip"),filterRef:n,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${_({field:"path",label:e("ddos.path"),filterRef:n,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${_({field:"statusCode",label:e("common.httpStatus"),filterRef:n,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${_({field:"durationMs",label:e("ddos.duration"),filterRef:n,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          <th>${t(e("common.actions"))}</th>
        </tr></thead>
        <tbody id="ddos-recent-body">${N||le}</tbody>
      </table>
      </div>
    </div>`,Se=`
    <div class="panel data-filter-panel ddos-filter-panel">
      <div class="panel-h"><strong>${t(e("common.filterTitle"))}</strong></div>
      <div class="data-filter">
        <div class="data-filter-grid">
          <label>${t(e("ddos.blacklist"))}
            <input type="search" id="ddos-ban-q" value="${t(n.banQ)}" placeholder="IP / reason" />
          </label>
          <label>${t(e("ddos.source"))}
            <select id="ddos-ban-source">${X}</select>
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
        <span class="muted">${t(q("common.pagerTotal",{n:R.length}))}</span>
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
          ${_({field:"ip",label:e("ddos.ip"),filterRef:n,sortByKey:"banSortBy",sortDirKey:"banSortDir"})}
          ${_({field:"reason",label:e("ddos.reason"),filterRef:n,sortByKey:"banSortBy",sortDirKey:"banSortDir"})}
          ${_({field:"source",label:e("ddos.source"),filterRef:n,sortByKey:"banSortBy",sortDirKey:"banSortDir"})}
          ${_({field:"expiresAt",label:e("ddos.expires"),filterRef:n,sortByKey:"banSortBy",sortDirKey:"banSortDir"})}
          <th>${t(e("common.actions"))}</th>
        </tr></thead>
        <tbody id="ddos-ban-body">${W||me}</tbody>
      </table>
      </div>
      ${qe({total:R.length,limit:$,offset:n.banPage*$,idPrefix:"ddosban"})}
    </div>`,se=`
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${t(e("ddos.eventsTitle"))}</strong>
        <span class="muted">${t(q("common.pagerTotal",{n:K.length}))}</span>
      </div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          ${_({field:"at",label:e("ddos.eventTime"),filterRef:n,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
          ${_({field:"ip",label:e("ddos.ip"),filterRef:n,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
          ${_({field:"source",label:e("ddos.eventSource"),filterRef:n,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
          ${_({field:"reason",label:e("ddos.reason"),filterRef:n,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
          ${_({field:"durationMs",label:e("ddos.eventDuration"),filterRef:n,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
        </tr></thead>
        <tbody id="ddos-events-body">${O}</tbody>
      </table>
      </div>
    </div>
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${t(e("ddos.topIps"))}</strong></div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>${t(e("ddos.ip"))}</th><th>${t(e("usage.requests"))}</th><th>${t(e("common.actions"))}</th></tr></thead>
        <tbody id="ddos-top-body">${M||G}</tbody>
      </table>
      </div>
    </div>`;document.getElementById("app").innerHTML=ne(`
    <div id="ddos-root" class="${w?"":"is-feature-off"}">
    <div class="topbar">
      <h2>${t(e("ddos.title"))}</h2>
      <div class="toolbar">
        ${ga({id:"ddos-master-autoban",on:w,onLabel:e("ddos.masterOn"),offLabel:e("ddos.masterOff"),title:e("ddos.autoBanMasterHint")})}
        <button class="btn secondary sm" id="ddos-refresh">${t(e("ddos.refresh"))}</button>
        <button class="btn secondary sm" id="ddos-pause">${t(e(Qe?"ddos.resume":"ddos.pause"))}</button>
      </div>
    </div>
    ${ke([e("ddos.policyHint")])}
    <div class="feature-off-banner" id="ddos-disabled-banner" ${w?"hidden":""} role="status">
      <strong>${t(e("common.featureOff"))}</strong>
      <span>${t(e("ddos.disabledBanner"))}</span>
    </div>
    ${Z}

    <div class="usage-tabs-panel panel ddos-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("ddos.title"))}">
        <button type="button" role="tab" class="seg-tab ${T==="policy"?"is-active":""}" data-ddos-tab="policy" aria-selected="${T==="policy"}">
          ${t(e("ddos.tabPolicy"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${T==="live"?"is-active":""}" data-ddos-tab="live" aria-selected="${T==="live"}">
          ${t(e("ddos.tabLive"))}
          <span class="seg-tab-count" id="ddos-tab-count-live">${A.length}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${T==="blacklist"?"is-active":""}" data-ddos-tab="blacklist" aria-selected="${T==="blacklist"}">
          ${t(e("ddos.tabBlacklist"))}
          <span class="seg-tab-count" id="ddos-tab-count-ban">${R.length}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${T==="events"?"is-active":""}" data-ddos-tab="events" aria-selected="${T==="events"}">
          ${t(e("ddos.tabEvents"))}
          <span class="seg-tab-count" id="ddos-tab-count-events">${K.length}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-policy" id="ddos-tab-policy" ${T==="policy"?"":"hidden"}>
          ${ce}
        </div>
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-stack" id="ddos-tab-live" ${T==="live"?"":"hidden"}>
          ${Ge}
        </div>
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-stack" id="ddos-tab-blacklist" ${T==="blacklist"?"":"hidden"}>
          ${Se}
        </div>
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-stack" id="ddos-tab-events" ${T==="events"?"":"hidden"}>
          ${se}
        </div>
      </div>
    </div>
    </div>
  `),ie(),Ma(!0,F),je(c.ddosFilter,()=>ee().catch(v)),document.querySelectorAll("[data-ddos-tab]").forEach(fe=>{fe.addEventListener("click",()=>{const we=fe.getAttribute("data-ddos-tab")||"policy",Pe=we==="live"||we==="blacklist"||we==="events"||we==="policy"?we:"policy";c.ddosFilter.tab!==Pe&&(c.ddosFilter.tab=Pe,ee().catch(v))})}),document.getElementById("ddos-live-filter-apply")?.addEventListener("click",()=>{c.ddosFilter.liveQ=document.getElementById("ddos-live-q")?.value?.trim()||"",c.ddosFilter.livePage=0,ee().catch(v)}),document.getElementById("ddos-live-filter-reset")?.addEventListener("click",()=>{c.ddosFilter.liveQ="",c.ddosFilter.liveSortBy="startedAt",c.ddosFilter.liveSortDir="desc",c.ddosFilter.livePage=0,ee().catch(v)}),document.getElementById("ddos-ban-filter-apply")?.addEventListener("click",()=>{c.ddosFilter.banQ=document.getElementById("ddos-ban-q")?.value?.trim()||"",c.ddosFilter.banSource=document.getElementById("ddos-ban-source")?.value||"",c.ddosFilter.banPage=0,ee().catch(v)}),document.getElementById("ddos-ban-filter-reset")?.addEventListener("click",()=>{c.ddosFilter.banQ="",c.ddosFilter.banSource="",c.ddosFilter.banSortBy="createdAt",c.ddosFilter.banSortDir="desc",c.ddosFilter.banPage=0,ee().catch(v)}),document.getElementById("ddoslive-prev")?.addEventListener("click",()=>{c.ddosFilter.livePage=Math.max(0,n.livePage-1),ee().catch(v)}),document.getElementById("ddoslive-next")?.addEventListener("click",()=>{(n.livePage+1)*$<A.length&&(c.ddosFilter.livePage+=1,ee().catch(v))}),document.getElementById("ddosban-prev")?.addEventListener("click",()=>{c.ddosFilter.banPage=Math.max(0,n.banPage-1),ee().catch(v)}),document.getElementById("ddosban-next")?.addEventListener("click",()=>{(n.banPage+1)*$<R.length&&(c.ddosFilter.banPage+=1,ee().catch(v))});const Le=document.querySelector(".main");Le&&(Le.onscroll=()=>{c._ddosScrollPauseUntil=Date.now()+4e3})}!Qe&&c.page==="ddos"&&(We=setInterval(()=>{c.page!=="ddos"||Qe||c._ddosScrollPauseUntil&&Date.now()<c._ddosScrollPauseUntil||ee({soft:!0}).catch(()=>{})},2e3))}function Ma(a=!1,s=[]){const o=s.length?s:c._ddosPolicyCache?.whitelist||[],i=async n=>{if(!n)return;const d=o.some(r=>String(r)===n||String(r).startsWith(n));await J({message:e(d?"ddos.banWhitelistWarn":"ddos.banConfirm"),variant:"danger",confirmText:e("ddos.ban")})&&(await E("/ddos/blacklist",{method:"POST",body:JSON.stringify({ip:n,reason:e("ddos.banReasonDefault"),ttlSeconds:null})}),ee({soft:!0}).catch(v))};if(document.querySelectorAll("[data-ban]").forEach(n=>{n.onclick=()=>i(n.dataset.ban)}),document.querySelectorAll("[data-unban]").forEach(n=>{n.onclick=async()=>{await J({message:e("ddos.unbanConfirm"),variant:"danger",confirmText:e("ddos.unban")})&&(await E(`/ddos/blacklist/${encodeURIComponent(n.dataset.unban)}`,{method:"DELETE"}),ee({soft:!0}).catch(v))}}),a){document.getElementById("ban-add").onclick=async()=>{const d=document.getElementById("ban-ip").value.trim();if(!d||o.some(m=>String(m)===d)&&!await J({message:e("ddos.banWhitelistWarn"),variant:"danger",confirmText:e("ddos.ban")}))return;const u=document.getElementById("ban-ttl").value;await E("/ddos/blacklist",{method:"POST",body:JSON.stringify({ip:d,reason:document.getElementById("ban-reason").value.trim()||void 0,ttlSeconds:u?Number(u):null})}),ee({soft:!0}).catch(v)},document.getElementById("ddos-refresh").onclick=()=>ee({soft:!1}).catch(v),document.getElementById("ddos-pause").onclick=()=>{Qe=!Qe;const d=document.getElementById("ddos-pause");d&&(d.textContent=e(Qe?"ddos.resume":"ddos.pause")),Qe||ee({soft:!0}).catch(v)},document.getElementById("ddos-master-autoban")?.addEventListener("click",async()=>{const d=!Je("ddos-master-autoban");Xe("ddos-master-autoban",d,e("ddos.masterOn"),e("ddos.masterOff"));const r=document.getElementById("dp-autoBanEnabled");r&&(r.type==="checkbox"?r.checked=d:r.value=d?"1":"0"),ba(d),Ze("ddos-root",!d),Ye("ddos-disabled-banner",!d),De();try{const u=ea(),m=await E("/ddos/policy",{method:"PUT",body:JSON.stringify(u)});c._ddosPolicyCache=m.data,De()}catch(u){Xe("ddos-master-autoban",!d,e("ddos.masterOn"),e("ddos.masterOff")),Ze("ddos-root",d),Ye("ddos-disabled-banner",d),v(u)}});const n=document.getElementById("ddos-policy-panel");n?.addEventListener("input",()=>De()),n?.addEventListener("change",()=>De()),document.querySelectorAll("[data-ddos-preset]").forEach(d=>{d.onclick=()=>{const r=d.dataset.ddosPreset;if(r==="custom")return;const u=c._ddosPresetsCache?.[r];u&&Ut(u)}}),De(),document.getElementById("dp-save")?.addEventListener("click",async()=>{try{const d=ea(),r=await E("/ddos/policy",{method:"PUT",body:JSON.stringify(d)});c._ddosPolicyCache=r.data,Ut(r.data),De(),await pe({title:e("ddos.policyTitle"),message:e("ddos.policySaved")}),ee({soft:!0}).catch(v)}catch(d){v(d)}}),document.getElementById("dp-reset")?.addEventListener("click",async()=>{if(await J({message:e("ddos.confirmReset"),variant:"danger",confirmText:e("ddos.resetPolicy")}))try{const d=await E("/ddos/policy/reset",{method:"POST"});c._ddosPolicyCache=d.data,Ut(d.data),De(),await pe({title:e("ddos.policyTitle"),message:e("ddos.policyReset")}),ee({soft:!0}).catch(v)}catch(d){v(d)}})}}function Pt(a){return e(a==="pm2"?"pm2.runnerPm2":a==="gctoac"?"pm2.runnerGctoac":a==="none"?"pm2.runnerNone":"pm2.runnerUnknown")}function aa(a){if(!a)return"";const s=a.messageKey;if(s&&typeof s=="string"){if(s==="pm2.msgOk")return"";const i=a.messageParams||{},n=q(s,i);if(n&&n!==s)return n}const o=a.message||"";return!o||o==="ok"?"":o}function qa(a=10){const s=Math.max(1,Number(a)||10)*1e3;window.setTimeout(()=>{try{window.location.reload()}catch{window.location.href=window.location.href}},s)}function js(a,s){const o=s?.messageKey||(a==="pm2"?"pm2.msgSwitchPm2":"pm2.msgSwitchGctoac");let i=aa({messageKey:o,messageParams:s?.messageParams,message:void 0});i||(i=e(a==="pm2"?"pm2.msgSwitchPm2":"pm2.msgSwitchGctoac"));const n=s?.port||s?.messageParams?.port||(typeof location<"u"&&location.port?location.port:"3847");return[i,q("pm2.portAfterRestart",{port:n}),q("pm2.autoRefreshIn",{n:10})].filter(Boolean).join(`
`)}function Gt(a){return a==="pm2"?`<span class="badge success">${t(Pt(a))}</span>`:a==="gctoac"?`<span class="badge agent">${t(Pt(a))}</span>`:a==="none"?`<span class="badge pending">${t(Pt(a))}</span>`:`<span class="badge warn">${t(Pt(a))}</span>`}function Us(a){return!a||typeof a!="object"?"":Object.entries(a).map(([s,o])=>`${s}=${o}`).join(`
`)}function Gs(a){const s={};for(const o of(a||"").split(`
`)){const i=o.trim();if(!i||i.startsWith("#"))continue;const n=i.indexOf("=");n<=0||(s[i.slice(0,n).trim()]=i.slice(n+1).trim())}return s}function Ws(){const a=d=>document.getElementById(d)?.checked===!0,s=d=>document.getElementById(d)?.value??"";let o=s("pm2-cfg-instances").trim();if(o!=="max"){const d=Number(o);o=Number.isFinite(d)&&d>=1?d:1}const i=s("pm2-cfg-port").trim(),n=Number(i);return{port:Number.isFinite(n)&&n>=1&&n<=65535?n:void 0,name:s("pm2-cfg-name").trim()||"grok-openai-gateway",script:s("pm2-cfg-script").trim()||"dist/server.js",cwd:s("pm2-cfg-cwd").trim()||void 0,instances:o,exec_mode:s("pm2-cfg-exec")==="cluster"?"cluster":"fork",autorestart:a("pm2-cfg-autorestart"),watch:a("pm2-cfg-watch"),max_memory_restart:s("pm2-cfg-maxmem").trim()||"512M",max_restarts:Number(s("pm2-cfg-maxrestarts"))||10,min_uptime:s("pm2-cfg-minuptime").trim()||"5s",restart_delay:Number(s("pm2-cfg-restartdelay"))||2e3,exp_backoff_restart_delay:Number(s("pm2-cfg-backoff"))||1e3,merge_logs:a("pm2-cfg-mergelogs"),time:a("pm2-cfg-time"),error_file:s("pm2-cfg-errfile").trim()||"logs/pm2-error.log",out_file:s("pm2-cfg-outfile").trim()||"logs/pm2-out.log",env_extra:Gs(s("pm2-cfg-envextra")),preferred_runner:s("pm2-cfg-preferred")==="pm2"?"pm2":"gctoac"}}async function Ae(){const s=(await E("/pm2/status")).data||{},o=s.app,i=s.config||{},n=s.portHolders||{},d=n.pids&&n.pids.length>0||!1,r=aa(s);let u="",m=null;try{const M=await E("/pm2/logs?lines=80");u=(M.data?.stdout||"")+(M.data?.stderr?`
`+M.data.stderr:""),m=M.data||null}catch(M){u=M.message||""}s.lastError&&(u=`===== last errors =====
${s.lastError}

${u}`);const p=m?.files||[],l=p.length?p.filter(M=>M.exists).map(M=>`${M.label}: ${M.size<1024?M.size+" B":Math.round(M.size/1024)+" KB"}`).join(" · "):"",k=m?.maxBytes?Math.round(m.maxBytes/(1024*1024)):5,g=m?.keepBytes?Math.round(m.keepBytes/1024):512,f=o?.status||"—",b=f==="online"?e("pm2.statusOnline"):f==="errored"?e("pm2.statusErrored"):f==="stopped"?e("pm2.statusStopped"):f,$=f==="online"?`<span class="badge success">${t(b)}</span>`:f==="errored"?`<span class="badge error">${t(b)}</span>`:t(b),A=s.available,B=s.available&&o,R=s.runner||"unknown",I=r&&f!=="errored"&&s.available!==!1&&s.messageKey!=="pm2.msgErrored",K=Us(i.env_extra),P=c.pm2Tab==="port"||c.pm2Tab==="config"||c.pm2Tab==="logs"||c.pm2Tab==="runner"?c.pm2Tab:"runner";c.pm2Tab=P;const S=`
    <div class="grid pm2-kpi-grid" id="pm2-kpi-grid">
      <div class="card">
        <div class="label">${t(e("pm2.app"))}</div>
        <div class="value value-sm">${t(s.appName||i.name||"grok-openai-gateway")}</div>
        <div class="muted card-sub">${Gt(R)}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("pm2.status"))}</div>
        <div class="value value-sm">${$}</div>
        <div class="muted card-sub">${t(e("pm2.pid"))}: ${o?.pid&&o.pid!==0?o.pid:"—"}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("pm2.restarts"))}</div>
        <div class="value value-sm">${o?.restarts??"—"}</div>
        <div class="muted card-sub">CPU ${o?.cpu!=null?o.cpu+"%":"—"} · ${o?.memory!=null?q("common.mb",{n:Math.round(o.memory/1024/1024)}):"—"}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("pm2.port"))}</div>
        <div class="value value-sm">${s.port??"—"}</div>
        <div class="muted card-sub">${t(e("pm2.portBusy"))}: ${e(d?"common.yes":"common.no")}</div>
      </div>
    </div>`,F=`
    <div class="panel data-table-panel pm2-section-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("pm2.switchTitle"))}</strong>
          <span class="muted panel-h-sub">${t(e("pm2.switchHint"))}</span>
        </div>
        ${Gt(R)}
      </div>
      <div class="panel-pad">
        <div class="grid">
          <div class="card"><div class="label">${t(e("pm2.currentRunner"))}</div><div class="value value-sm">${Gt(R)}</div></div>
          <div class="card"><div class="label">${t(e("pm2.gctoacPid"))}</div><div class="value value-sm">${s.gctoac?.running&&s.gctoac?.pid?s.gctoac.pid:"—"}</div></div>
          <div class="card"><div class="label">${t(e("pm2.port"))}</div><div class="value value-sm">${s.port??"—"}</div></div>
          <div class="card"><div class="label">${t(e("pm2.portBusy"))}</div><div class="value value-sm">${e(d?"common.yes":"common.no")}</div></div>
        </div>
        <div class="toolbar settings-save-bar">
          <button class="btn sm" id="pm2-switch-pm2" ${A?"":"disabled"}>${t(e("pm2.switchToPm2"))}</button>
          <button class="btn secondary sm" id="pm2-switch-gctoac">${t(e("pm2.switchToGctoac"))}</button>
        </div>
      </div>
    </div>`,x=`
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
            <input type="number" id="pm2-cfg-port" min="1" max="65535" step="1" value="${t(String(s.port??3847))}" placeholder="3847" />
            <span class="hint">${t(e("pm2.portDefaultNote"))}</span>
          </label>
        </div>
        <div class="toolbar settings-save-bar">
          <button type="button" class="btn sm" id="pm2-port-save">${t(e("pm2.savePort"))}</button>
          <button type="button" class="btn secondary sm" id="pm2-port-default">${t(e("pm2.useDefaultPort"))}</button>
        </div>
      </div>
    </div>`,y=`
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
              <option value="gctoac" ${i.preferred_runner!=="pm2"?"selected":""}>gctoac</option>
              <option value="pm2" ${i.preferred_runner==="pm2"?"selected":""}>pm2</option>
            </select>
          </label>
          <label class="check"><input type="checkbox" id="pm2-cfg-autorestart" ${i.autorestart!==!1?"checked":""}/> ${t(e("pm2.fieldAutorestart"))}</label>
          <label class="check"><input type="checkbox" id="pm2-cfg-watch" ${i.watch?"checked":""}/> ${t(e("pm2.fieldWatch"))}</label>
          <label class="check"><input type="checkbox" id="pm2-cfg-mergelogs" ${i.merge_logs!==!1?"checked":""}/> ${t(e("pm2.fieldMergeLogs"))}</label>
          <label class="check"><input type="checkbox" id="pm2-cfg-time" ${i.time!==!1?"checked":""}/> ${t(e("pm2.fieldTime"))}</label>
          <label class="full">${t(e("pm2.fieldEnvExtra"))}<textarea id="pm2-cfg-envextra" rows="4" placeholder="${t(e("pm2.phEnv"))}">${t(K)}</textarea></label>
        </div>
        <div class="toolbar settings-save-bar">
          <button class="btn sm" id="pm2-cfg-save">${t(e("pm2.saveConfig"))}</button>
          <button class="btn secondary sm" id="pm2-cfg-save-only">${t(e("pm2.saveOnly"))}</button>
          <button class="btn secondary sm" id="pm2-cfg-reset">${t(e("pm2.resetConfig"))}</button>
        </div>
      </div>
    </div>`,h=`
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
          ${t(q("pm2.logsAutoTrim",{maxMb:k,keepKb:g}))}
          ${l?` · ${t(l)}`:""}
        </p>
        <pre class="pre pre-logs" id="pm2-logs-pre">${t(u||e("common.empty"))}</pre>
      </div>
    </div>`;document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("pm2.title"))}</h2>
      <div class="toolbar">
        <button class="btn secondary sm" id="pm2-refresh">${t(e("pm2.refresh"))}</button>
        <button class="btn sm" id="pm2-start" ${A?"":"disabled"}>${t(e("pm2.start"))}</button>
        <button class="btn secondary sm" id="pm2-stop" ${B?"":"disabled"}>${t(e("pm2.stop"))}</button>
        <button class="btn sm" id="pm2-restart" ${A?"":"disabled"}>${t(e("pm2.restart"))}</button>
        <button class="btn secondary sm" id="pm2-reload" ${!B||o?.status!=="online"?"disabled":""}>${t(e("pm2.reload"))}</button>
      </div>
    </div>
    ${ke([e("pm2.hint")])}
    ${r?`<div class="error-box${I?" warn-box":""}">${t(r)}</div>`:s.available?"":`<div class="error-box">${t(e("pm2.unavailable"))}</div>`}
    ${S}

    <div class="usage-tabs-panel panel pm2-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("pm2.title"))}">
        <button type="button" role="tab" class="seg-tab ${P==="runner"?"is-active":""}" data-pm2-tab="runner" aria-selected="${P==="runner"}">
          ${t(e("pm2.tabRunner"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${P==="port"?"is-active":""}" data-pm2-tab="port" aria-selected="${P==="port"}">
          ${t(e("pm2.tabPort"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${P==="config"?"is-active":""}" data-pm2-tab="config" aria-selected="${P==="config"}">
          ${t(e("pm2.tabConfig"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${P==="logs"?"is-active":""}" data-pm2-tab="logs" aria-selected="${P==="logs"}">
          ${t(e("pm2.tabLogs"))}
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-runner" ${P==="runner"?"":"hidden"}>
          ${F}
        </div>
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-port" ${P==="port"?"":"hidden"}>
          ${x}
        </div>
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-config" ${P==="config"?"":"hidden"}>
          ${y}
        </div>
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-logs" ${P==="logs"?"":"hidden"}>
          ${h}
        </div>
      </div>
    </div>
  `),ie(),document.querySelectorAll("[data-pm2-tab]").forEach(M=>{M.addEventListener("click",()=>{const O=M.getAttribute("data-pm2-tab")||"runner",j=O==="port"||O==="config"||O==="logs"||O==="runner"?O:"runner";c.pm2Tab!==j&&(c.pm2Tab=j,Ae().catch(v))})}),document.getElementById("pm2-logs-refresh")?.addEventListener("click",()=>{c.pm2Tab="logs",Ae().catch(v)}),document.getElementById("pm2-logs-clear")?.addEventListener("click",async()=>{if(await J({message:e("pm2.confirmClearLogs"),variant:"danger",confirmText:e("pm2.clearLogs")}))try{const O=(await E("/pm2/logs/clear",{method:"POST",body:JSON.stringify({which:"all"})})).data?.cleared?.length||0;await pe({message:q("pm2.logsCleared",{n:O})}),Ae().catch(v)}catch(M){v(M)}});const N=async M=>{if(await J({message:e(M==="pm2"?"pm2.confirmSwitchPm2":"pm2.confirmSwitchGctoac"),variant:"confirm",confirmText:e(M==="pm2"?"pm2.switchToPm2":"pm2.switchToGctoac")}))try{const j=await E("/pm2/switch",{method:"POST",body:JSON.stringify({mode:M})}),le=j?.data||j||{},me=js(M==="pm2"?"pm2":"gctoac",le);qa(10),await pe({title:e("common.notice"),message:me,confirmText:e("common.ok")});try{window.location.reload()}catch{window.location.href=window.location.href}}catch(j){v(j)}};document.getElementById("pm2-refresh").onclick=()=>Ae().catch(v),document.getElementById("pm2-switch-pm2").onclick=()=>N("pm2"),document.getElementById("pm2-switch-gctoac").onclick=()=>N("gctoac"),document.getElementById("pm2-start").onclick=()=>N("pm2"),document.getElementById("pm2-stop").onclick=async()=>{if(await J({message:e("pm2.confirmStop"),variant:"danger",confirmText:e("pm2.stop")}))try{await E("/pm2/stop",{method:"POST",body:"{}"}),Ae().catch(v)}catch(M){v(M)}},document.getElementById("pm2-restart").onclick=async()=>{if(await J({message:e("pm2.confirmRestart"),variant:"confirm",confirmText:e("pm2.restart")}))try{await N("pm2")}catch(M){v(M)}},document.getElementById("pm2-reload").onclick=async()=>{try{await E("/pm2/reload",{method:"POST",body:"{}"}),Ae().catch(v)}catch(M){v(M)}};const W=async M=>{try{const O={...Ws(),restart:M};if(O.port==null){await pe({message:e("pm2.portInvalid")});return}const j=await E("/pm2/config",{method:"PUT",body:JSON.stringify(O)});if(j.data?.scheduled){const le=j.data.portChange?`
${q("pm2.portChangedMsg",{from:j.data.portChange.previous,to:j.data.portChange.port})}`:"",me=aa(j.data.scheduled)||e("pm2.switchScheduled");qa(10),await pe({title:e("common.notice"),message:me+le+`
${q("pm2.autoRefreshIn",{n:10})}`});try{window.location.reload()}catch{window.location.href=window.location.href}}else await pe(j.data?.portChange?q("pm2.portSavedNeedRestart",{port:j.data.port}):e("pm2.configSaved")),Ae().catch(v)}catch(O){v(O)}};document.getElementById("pm2-cfg-save").onclick=()=>W(!0),document.getElementById("pm2-cfg-save-only").onclick=()=>W(!1),document.getElementById("pm2-port-default")?.addEventListener("click",()=>{const M=document.getElementById("pm2-cfg-port");M&&(M.value="3847")}),document.getElementById("pm2-port-save")?.addEventListener("click",async()=>{const M=Number(document.getElementById("pm2-cfg-port")?.value);if(!Number.isFinite(M)||M<1||M>65535){await pe({message:e("pm2.portInvalid")});return}if(await J({message:q("pm2.confirmPortChange",{port:M}),variant:"confirm",confirmText:e("pm2.savePort")}))try{const O=await E("/pm2/config",{method:"PUT",body:JSON.stringify({port:M,restart:!0})}),j=O.data?.scheduled?.message||(O.data?.portChange?q("pm2.portChangedMsg",{from:O.data.portChange.previous,to:O.data.portChange.port}):e("pm2.configSaved"));await pe(j+`
`+q("pm2.portAfterRestart",{port:M}))}catch(O){v(O)}}),document.getElementById("pm2-cfg-reset").onclick=async()=>{if(await J({message:e("pm2.confirmReset"),variant:"danger",confirmText:e("pm2.resetConfig")}))try{await E("/pm2/config/reset",{method:"POST",body:"{}"}),Ae().catch(v)}catch(M){v(M)}}}let Y=[],ge=null,ae=[],pt=!1,_e=0;const He=new Map,C={keyId:"",model:"",reasoning:!0,effort:"",resumeId:"",forkSession:!1,memory:!1,noPlan:!1,permissionMode:"",systemPrompt:"",systemOpen:!1,settingsOpen:!1},D={mode:"full",recentN:6,summary:"",summaryAt:null,summarySourceCount:0},Qs=3,es=40,zs=20,Vs=2200,L={conversationId:null,historyPage:0,historyLimit:20,historyQ:"",historyTotal:0,historyItems:[],historyLoading:!1,historyOpenMobile:!1,saving:!1,saveQueued:!1,renamingId:null};let Wt=null;const Ct=10,ha=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;function Js(a){const s=String(a||"").split(/[/\\]/).pop()||"",o=s.lastIndexOf(".");return o<0?"":s.slice(o).toLowerCase()}function Lt(a){return Oa.has(Js(a))}function Dt(){return e("chat.formatsHint")}function ts(){D.mode="full",D.recentN=6,D.summary="",D.summaryAt=null,D.summarySourceCount=0,_e=0,He.clear()}function Xs(a){const s=(a?.title||"").trim();if(s)return s;const o=(a?.preview||"").trim();return o||e("chat.untitled")}function Ys(){return Y.filter(a=>!a.streaming).map(a=>{const s={role:a.role,content:a.content||""};return a.reasoning&&(s.reasoning=a.reasoning),a.docs&&a.docs.length&&(s.docs=a.docs),a.error&&(s.error=!0),s})}function Zs(){return{contextMode:D.mode,contextRecentN:D.recentN,summaryText:D.summary||"",summaryAt:D.summaryAt,summarySourceCount:D.summarySourceCount||0}}function eo(a){a&&(D.mode=a.contextMode==="summary"||a.contextMode==="recent"?a.contextMode:"full",D.recentN=Math.min(40,Math.max(2,Number(a.contextRecentN)||6)),D.summary=(a.summaryText||"").trim(),D.summaryAt=a.summaryAt||null,D.summarySourceCount=Number(a.summarySourceCount)||0,D.mode==="summary"&&!D.summary&&(D.mode="full"))}function as(a){return a.reduce((s,o)=>s+(o.content||"").length+(o.reasoning||"").length,0)}function ss(){const a=Y.filter(s=>!s.streaming);return a.length<2?!1:a.length>=Qs?!0:as(a)>=800}function to(){const a=(C.systemPrompt||"").trim(),s=Y.filter(r=>!r.streaming),o=Math.min(40,Math.max(2,Number(D.recentN)||6));let i=s.map(r=>({role:r.role,content:r.content||""})),n=a;if(D.mode==="summary"&&D.summary){const r=(yt()==="zh-Hant"?`【先前對話摘要 — 僅供延續語境，完整記錄仍在用戶介面】
`:`[Prior conversation summary — full history remains in the UI]
`)+D.summary;n=n?`${n}

${r}`:r;const u=s.slice(D.summarySourceCount||0);i=(u.length?u:s.slice(-o)).slice(-o).map(p=>({role:p.role,content:p.content||""}))}else D.mode==="recent"&&(i=s.slice(-o).map(r=>({role:r.role,content:r.content||""})));const d=i.map(r=>({role:r.role,content:r.content}));return n&&d.unshift({role:"system",content:n}),d}function ao(){return D.mode==="summary"&&D.summary?q("chat.ctxModeSummaryLabel",{n:D.recentN}):D.mode==="recent"?q("chat.ctxModeRecentLabel",{n:D.recentN}):e("chat.ctxModeFullLabel")}function it(){const a=document.getElementById("chat-compress");if(!a)return;const s=Y.some(n=>n.streaming),o=!!ge||pt||s,i=ss();a.disabled=o||!i,a.textContent=e(pt?"chat.compressing":"chat.compress"),a.title=e(i?"chat.compress":"chat.compressNeedMore"),Fe(),et()}function et(){const a=document.getElementById("chat-ctx-mode"),s=document.getElementById("chat-ctx-n");if(a){const o=D.mode==="summary"&&!D.summary?"full":D.mode;a.value=o;const i=a.querySelector('option[value="summary"]');i&&(i.disabled=!D.summary)}s&&(s.value=String(D.recentN),s.disabled=D.mode==="full"),Ht()}function Fe(){const a=document.getElementById("chat-compress-banner");if(!a)return;const s=!!D.summary,o=Y.filter(d=>!d.streaming).length>40||as(Y)>6e4;if(!s&&D.mode==="full"&&!o){a.hidden=!0,a.innerHTML="";return}a.hidden=!1;const i=s?D.summary.length>160?`${D.summary.slice(0,159)}…`:D.summary:"",n=o?`<p class="chat-compress-warn">${t(e("chat.ctxLongHint"))}</p>`:"";a.innerHTML=`
    <div class="chat-compress-banner-inner">
      <div class="chat-compress-banner-text">
        <strong>${t(e("chat.ctxPolicyTitle"))}</strong>
        <span class="muted">${t(ao())}</span>
        <p class="chat-compress-remark">${t(e("chat.ctxRemark"))}</p>
        ${i?`<p class="chat-compress-preview">${t(i)}</p>`:""}
        ${n}
      </div>
      <div class="chat-compress-banner-actions">
        ${s?`<button type="button" class="btn secondary sm" id="chat-summary-view">${t(e("chat.compressView"))}</button>`:""}
      </div>
    </div>`,document.getElementById("chat-summary-view")?.addEventListener("click",()=>{os()})}async function os(){if(!D.summary){U(e("chat.compressNeedSummary"));return}const a=D.summaryAt?te(D.summaryAt):"—",s=Ra(D.summary);xe&&ze(!1);const o=document.createElement("div");return o.className="ui-dialog-back",o.id="ui-dialog-back",o.dataset.cancelable="1",o.innerHTML=`
    <div class="ui-dialog ui-dialog--info ui-dialog--large" role="dialog" aria-modal="true">
      <div class="ui-dialog-h">
        <div class="ui-dialog-icon" aria-hidden="true">Σ</div>
        <h3 class="ui-dialog-title">${t(e("chat.compressResultTitle"))}</h3>
      </div>
      <div class="ui-dialog-body ui-dialog-body--md">
        <p class="muted" style="margin:0 0 10px">${t(q("chat.summaryMeta",{when:a,n:D.summarySourceCount}))}</p>
        <div class="chat-content md">${s}</div>
      </div>
      <div class="ui-dialog-actions">
        <button type="button" class="btn secondary sm" id="ui-dialog-copy">${t(e("chat.copy"))}</button>
        <button type="button" class="btn sm" id="ui-dialog-ok">${t(e("common.ok"))}</button>
      </div>
    </div>`,document.body.appendChild(o),document.body.classList.add("ui-dialog-open"),xe=o,document.addEventListener("keydown",ma,!0),new Promise(i=>{Bt=i;const n=()=>ze(!0);o.querySelector("#ui-dialog-ok")?.addEventListener("click",n),o.addEventListener("click",d=>{d.target===o&&n()}),o.querySelector("#ui-dialog-copy")?.addEventListener("click",async()=>{const d=await Rt(D.summary),r=o.querySelector("#ui-dialog-copy");d&&r&&(r.textContent=e("chat.copied"),setTimeout(()=>{r.isConnected&&(r.textContent=e("chat.copy"))},1500))})})}function so(a){return a.map(s=>{const o=s.role||"user";let i=(s.content||"").trim();if(s.docs&&s.docs.length){const n=s.docs.map(d=>d.name).join(", ");i=i?`${i}
[attachments: ${n}]`:`[attachments: ${n}]`}return i.length>5e3&&(i=`${i.slice(0,4999)}…`),`${o}: ${i}`}).join(`

`)}function oo(){return yt()==="zh-Hant"?["你是對話摘要助手。只輸出精簡摘要，不要使用任何工具、不要上網、不要反問。","若已有舊摘要，請合併更新為一份。","請用繁體中文（或對齊原對話語言）條列：","1) 主題與目標 2) 已確定事實／決定 3) 未完成事項 4) 用戶偏好或約束","控制在約 600–1000 字。不要大段複製原文。只輸出摘要正文。"].join(`
`):["You are a conversation summary assistant. Output only a concise summary.","Merge any prior summary into one updated summary. No tools, no browsing, no questions.","Cover: (1) topics/goals (2) facts/decisions (3) open items (4) preferences.","Keep under ~600–1000 words. Summary body only."].join(`
`)}async function no(){if(pt||ge||Y.some(n=>n.streaming)){U(e("chat.compressBusy"));return}const a=Y.filter(n=>!n.streaming);if(!ss()){U(e("chat.compressNeedMore"));return}if(!await J({title:e("chat.compress"),message:e("chat.compressConfirm"),variant:"confirm",confirmText:e("chat.compress")}))return;const s=St();if(!s){U(e("chat.needKey"));return}de(),pt=!0,it();const o=document.getElementById("chat-send");o&&(o.disabled=!0);const i=document.getElementById("chat-stream-status");i&&(i.hidden=!1,i.textContent=e("chat.compressing"));try{let n=so(a);D.summary&&(n=(yt()==="zh-Hant"?`先前摘要：
${D.summary}

完整對話：
`:`Prior summary:
${D.summary}

Full conversation:
`)+n);const d=document.getElementById("chat-model")?.value||C.model||"grok-4.5",r=va(),u={model:d,stream:!1,include_reasoning:!1,messages:[{role:"system",content:oo()},{role:"user",content:(yt()==="zh-Hant"?`請為以下對話產生摘要（僅供之後回合作為語境，不會刪除用戶介面中的記錄）：

`:`Summarize the following conversation (for later context only; UI history is kept):

`)+n}]},m=kt();m&&(u.apiKeyId=m);const p=await fetch("/admin/api/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${s}`,"Content-Type":"application/json"},body:JSON.stringify(u)});if(!p.ok){const g=await p.text();let f=g;try{f=JSON.parse(g).error?.message||g}catch{}throw new Error(f||e("chat.compressFail"))}const l=await p.json();let k=l?.choices?.[0]?.message?.content||l?.choices?.[0]?.delta?.content||"";if(typeof k!="string"&&(k=String(k||"")),k=k.trim().replace(/^【對話摘要】\s*/u,"").replace(/^\[Conversation summary\]\s*/i,""),!k)throw new Error(e("chat.compressFail"));D.summary=k,D.summaryAt=new Date().toISOString(),D.summarySourceCount=a.length,D.mode="summary",Fe(),et(),U(""),i&&(i.hidden=!1,i.textContent=e("chat.compressOk"),setTimeout(()=>{const g=document.getElementById("chat-stream-status");g&&g.textContent===e("chat.compressOk")&&(g.hidden=!0,g.textContent="")},2800)),await ht().catch(()=>{}),await os()}catch(n){U(n.message||e("chat.compressFail"))}finally{pt=!1,it(),o&&(o.disabled=!1),i&&i.textContent===e("chat.compressing")&&(i.hidden=!0,i.textContent="")}}function sa(a){L.historyOpenMobile=!!a,document.body.classList.toggle("chat-history-open",L.historyOpenMobile)}function oa(){sa(!1)}async function Ke(){if(c.key){L.historyLoading=!0,Ce();try{const a=L.historyPage*L.historyLimit,s=new URLSearchParams({limit:String(L.historyLimit),offset:String(a)});L.historyQ.trim()&&s.set("q",L.historyQ.trim());const o=await E(`/conversations?${s}`);L.historyItems=o.data||[],L.historyTotal=o.total??0}catch(a){L.historyItems=[],L.historyTotal=0,console.warn(a)}finally{L.historyLoading=!1,Ce()}}}function Ce(){const a=document.getElementById("chat-history-list"),s=document.getElementById("chat-history-pager");if(a){if(L.historyLoading&&!L.historyItems.length?a.innerHTML=`<li class="chat-history-empty">${t(e("common.loading"))}</li>`:L.historyItems.length?a.innerHTML=L.historyItems.map(o=>{const i=L.conversationId===o.id?" is-active":"",n=Xs(o),d=o.title&&o.preview&&o.preview!==o.title?o.preview:o.model||q("chat.msgs",{n:o.messageCount||0}),r=L.renamingId===o.id,u=n,m=r?`<input type="text" class="chat-history-title-input" data-title-input="${t(o.id)}" value="${t(u)}" maxlength="120" placeholder="${t(e("chat.renamePh"))}" aria-label="${t(e("chat.renamePh"))}" />
            <span class="preview">${t(d||"—")}</span>
            <span class="meta"><span>${t(te(o.updatedAt))}</span></span>`:`<span class="title" data-title-label="${t(o.id)}" title="${t(e("chat.rename"))}">${t(n)}</span>
            <span class="preview">${t(d||"—")}</span>
            <span class="meta"><span>${t(te(o.updatedAt))}</span></span>`,p=r?`<div class="chat-history-item${i} is-editing" data-conv-body="${t(o.id)}">${m}</div>`:`<div class="chat-history-item${i}" data-open-conv="${t(o.id)}" role="button" tabindex="0" title="${t(n)}">${m}</div>`;return`
        <li class="chat-history-row${i}${r?" is-renaming":""}" data-conv-row="${t(o.id)}">
          ${p}
          <div class="chat-history-item-actions">
            <button type="button" class="icon-action" data-rename-conv="${t(o.id)}" title="${t(e("chat.rename"))}" aria-label="${t(e("chat.rename"))}">✎</button>
            <button type="button" class="icon-action danger" data-del-conv="${t(o.id)}" title="${t(e("chat.deleteConversation"))}" aria-label="${t(e("chat.deleteConversation"))}">×</button>
          </div>
        </li>`}).join(""):a.innerHTML=`<li class="chat-history-empty">${t(e("chat.historyEmpty"))}</li>`,s){const o=L.historyLimit,i=Math.max(1,Math.ceil(L.historyTotal/o)||1),n=Math.min(L.historyPage+1,i),d=q("chat.historyPage",{n,total:i}),r=L.historyPage>0,u=(L.historyPage+1)*o<L.historyTotal;s.innerHTML=`
      <button type="button" class="btn secondary sm" id="chat-hist-prev" ${r?"":"disabled"}>${t(e("chat.historyPrev"))}</button>
      <span>${t(d)}</span>
      <button type="button" class="btn secondary sm" id="chat-hist-next" ${u?"":"disabled"}>${t(e("chat.historyNext"))}</button>
    `;const m=document.getElementById("chat-hist-prev"),p=document.getElementById("chat-hist-next");m&&(m.onclick=()=>{L.historyPage>0&&(L.historyPage-=1,Ke())}),p&&(p.onclick=()=>{(L.historyPage+1)*o<L.historyTotal&&(L.historyPage+=1,Ke())})}if(a.querySelectorAll("[data-open-conv]").forEach(o=>{const i=o.getAttribute("data-open-conv");if(!i)return;let n=null;const d=()=>{n&&(clearTimeout(n),n=null)};o.addEventListener("click",r=>{L.renamingId||r.target instanceof Element&&r.target.closest(".chat-history-item-actions")||(d(),n=setTimeout(()=>{n=null,!L.renamingId&&Ta(i)},280))}),o.addEventListener("dblclick",r=>{r.preventDefault(),r.stopPropagation(),d(),Qt(i)}),o.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),L.renamingId||Ta(i))})}),a.querySelectorAll("[data-title-label]").forEach(o=>{o.addEventListener("dblclick",i=>{i.preventDefault(),i.stopPropagation();const n=o.getAttribute("data-title-label");n&&Qt(n)})}),a.querySelectorAll("[data-rename-conv]").forEach(o=>{o.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation();const n=o.getAttribute("data-rename-conv");n&&Qt(n)})}),a.querySelectorAll("[data-del-conv]").forEach(o=>{o.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation();const n=o.getAttribute("data-del-conv");n&&ro(n)})}),L.renamingId){const o=String(L.renamingId).replace(/\\/g,"\\\\").replace(/"/g,'\\"'),i=a.querySelector(`[data-title-input="${o}"]`);i instanceof HTMLInputElement&&(io(i,L.renamingId),requestAnimationFrame(()=>{i.isConnected&&(i.focus(),i.select())}))}}}function Qt(a){a&&(L.renamingId&&L.renamingId!==a&&(L.renamingId=null),L.renamingId=a,Ce())}function io(a,s){let o=!1;const i=async n=>{if(o)return;o=!0;const d=a.value;if(L.renamingId=null,!n){Ce();return}const r=String(d??"").trim().slice(0,120),u=L.historyItems.find(p=>p.id===s),m=u?(u.title||"").trim():"";if(r===m){Ce();return}u&&(u.title=r),Ce();try{await E(`/conversations/${s}`,{method:"PATCH",body:JSON.stringify({title:r})}),await Ke()}catch(p){U(p.message||e("chat.saveFail")),await Ke()}};a.addEventListener("keydown",n=>{n.stopPropagation(),n.key==="Enter"?(n.preventDefault(),i(!0)):n.key==="Escape"&&(n.preventDefault(),i(!1))}),a.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation()}),a.addEventListener("mousedown",n=>n.stopPropagation()),a.addEventListener("dblclick",n=>{n.preventDefault(),n.stopPropagation()}),a.addEventListener("blur",()=>{setTimeout(()=>i(!0),0)})}async function Ta(a){(!a||ge)&&ge&&ge.abort();try{U("");const s=await E(`/conversations/${a}`),o=s.data||s;L.conversationId=o.id,_e=0,He.clear(),Y=(o.messages||[]).filter(u=>!u.compressed).map(u=>({role:u.role,content:u.content||"",reasoning:u.reasoning||void 0,docs:u.docs,error:u.error})),ae=[],C.systemPrompt=o.systemPrompt||"",eo(o),o.model&&(C.model=o.model),o.apiKeyId&&(C.keyId=o.apiKeyId);const i=document.getElementById("chat-system");i&&(i.value=C.systemPrompt);const n=document.getElementById("chat-system-wrap");n&&(n.hidden=!C.systemPrompt.trim()&&!C.systemOpen);const d=document.getElementById("chat-model");d&&o.model&&(d.value=o.model);const r=document.getElementById("chat-key-select");r&&o.apiKeyId&&[...r.options].some(m=>m.value===o.apiKeyId)&&(r.value=o.apiKeyId,C.keyId=o.apiKeyId),Be(),Ue(),Ce(),Fe(),et(),oa()}catch(s){U(s.message||e("chat.loadFail"))}}function kt(){const a=va();return!a||String(a).startsWith("admin-session:")||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(a)?null:a}async function ht(){const a=Ys();if(!a.length&&!D.summary)return;if(L.saving){L.saveQueued=!0;return}L.saving=!0,L.saveQueued=!1,de();const s={messages:a,model:C.model||null,systemPrompt:C.systemPrompt||"",apiKeyId:kt(),...Zs()};try{if(L.conversationId)await E(`/conversations/${L.conversationId}`,{method:"PATCH",body:JSON.stringify(s)});else{if(!a.length)return;const o=await E("/conversations",{method:"POST",body:JSON.stringify({...s,title:""})}),i=o.data||o;L.conversationId=i.id}await Ke()}catch(o){console.warn(o)}finally{L.saving=!1,L.saveQueued&&(L.saveQueued=!1,ht().catch(()=>{}))}}async function ro(a){if(await J({title:e("chat.deleteConversation"),message:e("chat.deleteConfirm"),variant:"danger",confirmText:e("chat.deleteConversation")}))try{await E(`/conversations/${a}`,{method:"DELETE"}),L.conversationId===a&&(L.conversationId=null,Y=[],ae=[],ts(),Be(),Ue(),Fe(),et()),L.historyItems.length<=1&&L.historyPage>0&&(L.historyPage-=1),await Ke()}catch(s){U(s.message||e("common.requestFailed"))}}function lo(a=!0){ge&&ge.abort(),Y=[],ae=[],L.conversationId=null,ts(),a||(C.systemPrompt="",C.systemOpen=!1),Be(),Ue(),Ce(),Fe(),et()}function St(){return c.key}function va(){const s=document.getElementById("chat-key-select")?.value||C.keyId||"";return s&&s!=="session"?s:c.me?.id||""}function de(){const a=document.getElementById("chat-key-select"),s=document.getElementById("chat-model"),o=document.getElementById("chat-reasoning"),i=document.getElementById("chat-system");a&&(C.keyId=a.value==="session"?"":a.value),s&&(C.model=s.value),o&&(C.reasoning=o.checked);const n=document.getElementById("chat-effort");n&&(C.effort=n.value||"");const d=document.getElementById("chat-resume");d&&(C.resumeId=d.value.trim());const r=document.getElementById("chat-fork");r&&(C.forkSession=r.checked);const u=document.getElementById("chat-memory");u&&(C.memory=u.checked);const m=document.getElementById("chat-no-plan");m&&(C.noPlan=m.checked);const p=document.getElementById("chat-perm");p&&(C.permissionMode=p.value||""),i&&(C.systemPrompt=i.value),Ht()}function Ht(){const a=document.querySelector(".chat-shell"),s=document.getElementById("chat-settings-toggle"),o=document.getElementById("chat-settings-summary"),i=document.getElementById("chat-settings-toggle-label");if(a&&a.classList.toggle("is-settings-open",!!C.settingsOpen),s&&s.setAttribute("aria-expanded",C.settingsOpen?"true":"false"),i&&(i.textContent=C.settingsOpen?e("chat.settingsHide"):e("chat.settings")),o){const n=C.model||"—",d=D.mode==="summary"?"chat.ctxModeSummary":D.mode==="recent"?"chat.ctxModeRecent":"chat.ctxModeFull";o.textContent=`${n} · ${e(d)}`}}function Ue(){const a=document.getElementById("chat-pending");if(a){if(!ae.length){a.innerHTML="",a.hidden=!0;return}a.hidden=!1,a.innerHTML=ae.map((s,o)=>`
      <div class="chat-pending-item" title="${t(s.name)}">
        <span class="name">${t(s.name)}</span>
        <span class="muted">${Me(s.size)}</span>
        <button type="button" class="rm" data-rm-doc="${o}" aria-label="${t(e("chat.removeFile"))}">×</button>
      </div>`).join(""),a.querySelectorAll("[data-rm-doc]").forEach(s=>{s.onclick=()=>{const o=Number(s.getAttribute("data-rm-doc"));ae.splice(o,1),Ue()}})}}function co(a,s){return`${a}:${(s||"").length}:${(s||"").slice(0,40)}`}function Be(){const a=document.getElementById("chat-messages");if(!a)return;const s=a.scrollHeight-a.scrollTop-a.clientHeight<120,o=Y.some(l=>l.streaming),i=document.getElementById("chat-stream-status");if(i&&(i.hidden=!o,i.textContent=o?e("chat.streaming"):""),!Y.length){a.innerHTML=`
      <div class="chat-empty">
        <strong>${t(e("chat.emptyTitle"))}</strong>
        <p>${t(e("chat.emptyHint"))}</p>
      </div>`,it();return}const n=Y.length,d=Math.max(0,n-es);_e>d&&(_e=d);const r=_e,u=Y.slice(r),m=r,p=m>0?`<div class="chat-load-older">
          <button type="button" class="btn secondary sm" id="chat-load-older">${t(q("chat.loadOlder",{n:m}))}</button>
        </div>`:"";a.innerHTML=p+u.map((l,k)=>{const g=r+k,f=l.role==="user"?"user":"assistant",b=l.role==="user"?e("chat.you"):e("chat.assistant"),$=l.docs&&l.docs.length?`<div class="chat-attach-list">${l.docs.map(O=>`<span class="chat-attach-chip" title="${t(O.name)}"><span>📎 ${t(O.name)}</span></span>`).join("")}</div>`:"",B=!!l.reasoning?`<details class="chat-reasoning" ${l.streaming||!l.content?"open":""}>
            <summary>${t(e("chat.reasoning"))}${l.streaming&&!l.content?` · ${t(e("chat.streaming"))}`:""}</summary>
            <pre>${t(l.reasoning)}</pre>
          </details>`:"";let R=l.content||"";!R&&l.streaming&&(R=l.reasoning?"":"…");const I=l.error?" error":"",K=l.streaming?" is-streaming":"",P=f==="assistant"&&!l.streaming&&!!R;let S;if(P){const O=co(g,R);if(He.has(O))S=He.get(O);else if(S=Ra(R),He.set(O,S),He.size>200){const j=He.keys().next().value;He.delete(j)}}else S=t(R);const F=!l.streaming&&R.length>Vs,x=`${P?"chat-content md":"chat-content"}${F?" is-collapsible":""}`,y=F?`<button type="button" class="btn ghost sm chat-expand-btn" data-expand="${g}">${t(e("chat.showMore"))}</button>`:"",h=uo(l),N=h?`<div class="muted chat-spend">${t(h)}</div>`:"",W=Array.isArray(l.tools)&&l.tools.length?`<div class="chat-tools">${l.tools.map(O=>`<span class="chat-tool-chip" title="${t(O.arguments||"")}">${t(O.name||"tool")}</span>`).join("")}</div>`:"",M=R?`<button type="button" class="chat-copy-btn" data-copy-msg="${g}" title="${t(e("chat.copy"))}">${t(e("chat.copy"))}</button>`:"";return`<div class="chat-bubble ${f}${I}${K}" data-msg-idx="${g}">
        <div class="chat-bubble-head">
          <div class="chat-role">${t(b)}${l.streaming?` <span class="chat-live">${t(e("chat.streaming"))}</span>`:""}</div>
          ${M}
        </div>
        ${$}
        ${B}
        ${W}
        <div class="${x}" data-content-idx="${g}">${S}${l.streaming?'<span class="chat-cursor">▍</span>':""}</div>
        ${y}
        ${N}
      </div>`}).join(""),(s||o)&&(a.scrollTop=a.scrollHeight),it(),document.getElementById("chat-load-older")?.addEventListener("click",()=>{const l=a.scrollHeight;_e=Math.max(0,_e-zs),Be();const k=document.getElementById("chat-messages");k&&(k.scrollTop=k.scrollHeight-l)}),a.querySelectorAll("[data-expand]").forEach(l=>{l.addEventListener("click",()=>{const k=a.querySelector(`[data-content-idx="${l.getAttribute("data-expand")}"]`);k&&(k.classList.toggle("is-expanded"),l.textContent=k.classList.contains("is-expanded")?e("chat.showLess"):e("chat.showMore"))})}),a.querySelectorAll("[data-copy-msg]").forEach(l=>{l.addEventListener("click",async k=>{k.preventDefault(),k.stopPropagation();const g=Number(l.getAttribute("data-copy-msg")),f=Y[g];if(!f?.content)return;if(await Rt(f.content)){const $=l.textContent;l.textContent=e("chat.copied"),l.classList.add("is-copied"),setTimeout(()=>{l.isConnected&&(l.textContent=$||e("chat.copy"),l.classList.remove("is-copied"))},1600)}else U(e("chat.copyFail"))})})}function zt(a){const o=a.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),i=o.pop()||"",n=[];for(const d of o){const r=d.trim();if(!r||r.startsWith(":")||!r.startsWith("data:"))continue;const u=r.slice(5).trim();u&&n.push(u)}return{events:n,rest:i}}function uo(a){if(!a||a.streaming)return"";const s=[],o=a.usage;if(o&&(o.prompt_tokens||o.completion_tokens||o.total_tokens)){const n=o.prompt_tokens_details?.cached_tokens,d=n!=null?` · ${e("chat.cacheTokens")}: ${n}`:"";s.push(`${e("chat.tokens")}: ${o.prompt_tokens||0}+${o.completion_tokens||0}=${o.total_tokens||0}${d}`)}const i=a.grok?.cost?.total_cost_usd;return typeof i=="number"&&s.push(`${e("chat.cost")}: $${i.toFixed(6)}`),a.grok?.sessionId&&s.push(`${e("chat.resume")}: ${a.grok.sessionId}`),s.join(" · ")}function Et(a,s){if(!s||typeof s!="object")return!1;if(s.error){const r=ra({error:s.error});return a.error=!0,a.content=(a.content||"")+`
✗ ${r}`,!0}const o=s.choices?.[0]?.delta||{};let i=!1;if(o.reasoning_content&&(a.reasoning=(a.reasoning||"")+o.reasoning_content,i=!0),(o.thought&&!o.reasoning_content||o.thought&&o.reasoning_content&&o.thought!==o.reasoning_content)&&(a.reasoning=(a.reasoning||"")+o.thought,i=!0),typeof o.content=="string"&&o.content.length&&(a.content=(a.content||"")+o.content,i=!0),s.usage&&typeof s.usage=="object"&&(a.usage=s.usage,i=!0),s.grok&&typeof s.grok=="object"){if(a.grok={...a.grok||{},...s.grok},a.grok.sessionId){C.resumeId=a.grok.sessionId;const r=document.getElementById("chat-resume");r&&(r.value=a.grok.sessionId)}i=!0}if(s.grok_event&&typeof s.grok_event=="object"){const r=s.grok_event;if(Array.isArray(a.tools)||(a.tools=[]),r.type==="tool_call"||r.type==="tool_call_update"){const u=r.toolCallId,m=u?a.tools.find(g=>g.id===u):null,p=r.toolName||r.title||m?.name||"tool",l=r.rawInput!=null?typeof r.rawInput=="string"?r.rawInput:JSON.stringify(r.rawInput):m?.arguments||"",k=r.status?`${p} (${r.status})`:p;m?(m.name=k,l&&(m.arguments=l)):a.tools.push({id:u,name:k,arguments:l}),i=!0}}const n=s.choices?.[0]?.delta?.tool_calls;if(Array.isArray(n)&&n.length){Array.isArray(a.tools)||(a.tools=[]);for(const r of n){const u=r?.function?.name||r?.name||"tool",m=r?.function?.arguments||"";a.tools.push({id:r?.id,name:u,arguments:typeof m=="string"?m:JSON.stringify(m||{})})}i=!0}const d=s.choices?.[0]?.message;return d&&(d.content&&!a.content&&(a.content=d.content,i=!0),d.reasoning_content&&!a.reasoning&&(a.reasoning=d.reasoning_content,i=!0)),i}function mo(a,s){const o=St();return o?new Promise((i,n)=>{const d=new FormData;d.append("file",a,a.name);const r=kt();r&&d.append("apiKeyId",r);const u=new XMLHttpRequest;u.open("POST","/admin/api/documents"),u.setRequestHeader("Authorization",`Bearer ${o}`),u.upload.onprogress=m=>{if(s)if(m.lengthComputable&&m.total>0){const p=Math.min(100,Math.round(m.loaded/m.total*100));s({loaded:m.loaded,total:m.total,percent:p})}else s({loaded:m.loaded||0,total:0,percent:-1})},u.onload=()=>{let m=null;try{m=u.responseText?JSON.parse(u.responseText):null}catch{m=null}if(u.status<200||u.status>=300){const k=m?.error?.message||m?.message||u.responseText||u.statusText;n(new Error(k||e("chat.uploadFail")));return}const p=m?.data||m,l=p?.id;if(!l||typeof l!="string"){n(new Error(e("chat.uploadFail")));return}i({id:l,name:p.originalName||p.filename||a.name,mime:p.mimeType||a.type||"",size:p.sizeBytes??p.size??a.size??0})},u.onerror=()=>n(new Error(e("chat.uploadFail"))),u.onabort=()=>n(new Error(e("chat.uploadFail"))),u.send(d)}):Promise.reject(new Error(e("chat.needKey")))}function It(a){const s=document.getElementById("chat-upload-progress");if(!s)return;const{visible:o,fileName:i,fileIndex:n,fileTotal:d,percent:r,indeterminate:u}=a;if(!o){s.hidden=!0,s.setAttribute("aria-hidden","true");return}s.hidden=!1,s.setAttribute("aria-hidden","false");const m=document.getElementById("chat-upload-label"),p=document.getElementById("chat-upload-bar"),l=document.getElementById("chat-upload-pct"),k=i||"",g=n||1,f=d||1;m&&(m.textContent=f>1?q("chat.uploadProgressMulti",{name:k,i:g,n:f}):q("chat.uploadProgress",{name:k}));const b=!!u||r<0;p&&(p.classList.toggle("is-indeterminate",b),b?p.style.width="40%":p.style.width=`${Math.max(0,Math.min(100,r))}%`),l&&(l.textContent=b?e("chat.uploading"):q("common.percent",{n:Math.max(0,Math.min(100,r))}))}function po(a){const s=Array.isArray(a)?a:[];if(!s.length)return{added:0,skipped:0};let o=0,i=0;const n=new Set(ae.map(d=>d.id));for(const d of s){if(ae.length>=Ct){i+=s.length-o-i;break}const r=d?.id,u=d?.name||d?.originalName||"";if(!r||!ha.test(String(r))){i+=1;continue}if(!Lt(u)){i+=1;continue}if(n.has(r)){i+=1;continue}ae.push({id:r,name:u||r,mime:d.mime||d.mimeType||"",size:d.size??d.sizeBytes??0}),n.add(r),o+=1}return Ue(),{added:o,skipped:i}}async function fo(){if(!St()){U(e("chat.needKey"));return}const a=kt(),s=Math.max(0,Ct-ae.length);if(s<=0){U(e("chat.tooManyFiles"));return}const o=new Map;let i=0;dt({title:e("chat.libraryTitle"),subtitle:t(e("chat.librarySubtitle")),size:"md",bodyHtml:`
      <div class="chat-lib">
        <div class="chat-lib-toolbar">
          <input type="search" id="chat-lib-q" class="chat-lib-search" placeholder="${t(e("chat.librarySearch"))}" autocomplete="off" />
          <span class="muted chat-lib-count" id="chat-lib-count">${t(q("chat.librarySelected",{n:0}))}</span>
        </div>
        <div class="muted chat-lib-formats">${t(e("chat.formatsLabel"))}: ${t(Dt())}</div>
        <div id="chat-lib-list" class="chat-lib-list" role="listbox" aria-multiselectable="true">
          <div class="muted chat-lib-status">${t(e("common.loading")||"…")}</div>
        </div>
      </div>`,footerHtml:`
      <button type="button" class="btn secondary sm" id="chat-lib-cancel">${t(e("common.cancel"))}</button>
      <button type="button" class="btn sm" id="chat-lib-add" disabled>${t(e("chat.libraryAdd"))}</button>`});const n=document.getElementById("chat-lib-list"),d=document.getElementById("chat-lib-q"),r=document.getElementById("chat-lib-count"),u=document.getElementById("chat-lib-add");document.getElementById("chat-lib-cancel")?.addEventListener("click",()=>ye());const m=()=>{r&&(r.textContent=q("chat.librarySelected",{n:o.size})),u&&(u.disabled=o.size===0,u.textContent=o.size>0?`${e("chat.libraryAdd")} (${o.size})`:e("chat.libraryAdd"))},p=g=>{if(!n)return;const f=new Set(ae.map($=>$.id)),b=(g||[]).filter($=>Lt($.originalName));if(!b.length){n.innerHTML=`<div class="data-empty chat-lib-empty"><strong>${t(e("chat.libraryEmpty"))}</strong></div>`;return}n.innerHTML=b.map($=>{const A=f.has($.id),B=o.has($.id),R=A&&!B;return`
          <label class="chat-lib-row ${A?"is-already":""} ${B?"is-selected":""}" data-id="${t($.id)}">
            <input type="checkbox" data-lib-id="${t($.id)}" ${B?"checked":""} ${R?"disabled":""} />
            <span class="chat-lib-meta">
              <span class="chat-lib-name" title="${t($.originalName)}">${t($.originalName)}</span>
              <span class="muted">${t($.mimeType||"")} · ${Me($.sizeBytes||0)}${A?` · ${t(e("chat.libraryAlready"))}`:""}</span>
            </span>
          </label>`}).join(""),n.querySelectorAll("input[data-lib-id]").forEach($=>{$.addEventListener("change",()=>{const A=$.getAttribute("data-lib-id"),B=b.find(I=>I.id===A);if(!B)return;if($.checked){if(o.size>=s&&!o.has(A)){$.checked=!1,U(e("chat.tooManyFiles"));return}o.set(A,B)}else o.delete(A);const R=$.closest(".chat-lib-row");R&&R.classList.toggle("is-selected",$.checked),m()})})},l=async()=>{const g=++i;n&&(n.innerHTML=`<div class="muted chat-lib-status">${t(e("common.loading")||"…")}</div>`);try{const f=new URLSearchParams({limit:"50",offset:"0"});a&&f.set("apiKeyId",a);const b=(d?.value||"").trim();b&&f.set("q",b);const $=await E(`/documents?${f}`);if(g!==i)return;p($.data||[])}catch(f){if(g!==i)return;n&&(n.innerHTML=`<div class="error-box">${t(f.message||e("chat.libraryLoadFail"))}</div>`)}};let k=null;d?.addEventListener("input",()=>{k&&clearTimeout(k),k=setTimeout(()=>l(),280)}),u?.addEventListener("click",()=>{const g=[...o.values()],{added:f}=po(g.map(b=>({id:b.id,name:b.originalName,mime:b.mimeType,size:b.sizeBytes})));ye(),f>0&&U("")}),m(),await l(),d?.focus()}async function ns(a){const s=[...a||[]];if(!s.length)return;if(!St()){U(e("chat.needKey"));return}const o=s.filter(u=>!Lt(u.name)),i=s.filter(u=>Lt(u.name));if(o.length&&(U(q("chat.formatsReject",{name:o.map(u=>u.name).join(", "),formats:Dt()})),!i.length))return;if(ae.length+i.length>Ct){U(e("chat.tooManyFiles"));return}const n=document.getElementById("chat-attach"),d=document.getElementById("chat-send");n&&(n.disabled=!0,n.textContent=e("chat.uploading")),d&&(d.disabled=!0);const r=i.length;try{let u=0;for(const m of i){if(ae.length>=Ct)break;u+=1,It({visible:!0,fileName:m.name,fileIndex:u,fileTotal:r,percent:0,indeterminate:!1});const p=await mo(m,({percent:l})=>{It({visible:!0,fileName:m.name,fileIndex:u,fileTotal:r,percent:l<0?0:l,indeterminate:l<0})});It({visible:!0,fileName:m.name,fileIndex:u,fileTotal:r,percent:100,indeterminate:!1}),ae.some(l=>l.id===p.id)||ae.push(p),Ue()}o.length||U("")}catch(u){U(u.message||e("chat.uploadFail"))}finally{It({visible:!1}),n&&(n.disabled=!1,n.textContent=e("chat.attach")),d&&(d.disabled=!1)}}function yo(){const a=c.me?.id||"",s=c.me?`${e("chat.useSessionKey")} · ${c.me.name||""} (${c.me.keyPrefix||""}…)`:e("chat.useSessionKey"),o=C.keyId||"session",i=(c.keys||[]).filter(d=>d.isActive!==!1),n=[`<option value="session" ${o==="session"||o===a||!o?"selected":""}>${t(s)}</option>`];for(const d of i){if(a&&d.id===a)continue;const r=`${d.name||"key"} · ${d.keyPrefix||""}… · ${d.role||""}/${d.mode||""}`;n.push(`<option value="${t(d.id)}" ${o===d.id?"selected":""}>${t(r)}</option>`)}return n.join("")}async function go(){await Promise.all([bt(!1),$t()]);const a=c.models||[];!C.model&&a.length&&(C.model=a[0]);const s=a.map(m=>`<option value="${t(m)}" ${C.model===m?"selected":""}>${t(m)}</option>`).join("");sa(!1),document.getElementById("app").innerHTML=ne(`
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
        <div class="chat-shell${C.settingsOpen?" is-settings-open":""}">
          <div class="chat-settings-bar">
            <button type="button" class="chat-settings-toggle" id="chat-settings-toggle" aria-expanded="${C.settingsOpen?"true":"false"}" aria-controls="chat-toolbar">
              <span class="chat-settings-summary" id="chat-settings-summary"></span>
              <span class="chat-settings-caret" id="chat-settings-toggle-label">${t(C.settingsOpen?e("chat.settingsHide"):e("chat.settings"))}</span>
            </button>
          </div>
          <div class="chat-toolbar" id="chat-toolbar">
            <label class="chat-field-full">${t(e("chat.keySelect"))}
              <select id="chat-key-select">${yo()}</select>
            </label>
            <label>${t(e("chats.model"))}
              <select id="chat-model">${s||'<option value="grok-4.5">grok-4.5</option>'}</select>
            </label>
            <label class="check-inline" for="chat-reasoning">
              <input type="checkbox" id="chat-reasoning" ${C.reasoning!==!1?"checked":""} />
              ${t(e("chat.includeReasoning"))}
            </label>
            <label class="chat-ctx-label">${t(e("chat.effort"))}
              <select id="chat-effort">
                ${["","none","minimal","low","medium","high","xhigh","max"].map(m=>{const p=e(m?`chat.effort_${m}`:"chat.effortDefault"),l=(C.effort||"")===m?" selected":"";return`<option value="${t(m)}"${l}>${t(p)}</option>`}).join("")}
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
              <input type="number" id="chat-ctx-n" min="2" max="40" value="${D.recentN}" />
            </label>
            <button type="button" class="btn ghost sm chat-field-full" id="chat-system-toggle" title="${t(e("chat.systemHint"))}">
              ${t(e("chat.systemPrompt"))}${C.systemPrompt?" ·":""}
            </button>
            <label class="chat-ctx-label chat-field-full" title="${t(e("chat.resumeHint"))}">${t(e("chat.resume"))}
              <input type="text" id="chat-resume" value="${t(C.resumeId||"")}" placeholder="${t(e("chat.resumePh"))}" spellcheck="false" />
            </label>
            <div class="chat-checks">
            <label class="check-inline" for="chat-fork">
              <input type="checkbox" id="chat-fork" ${C.forkSession?"checked":""} />
              ${t(e("chat.fork"))}
            </label>
            <label class="check-inline" for="chat-memory">
              <input type="checkbox" id="chat-memory" ${C.memory?"checked":""} />
              ${t(e("chat.memory"))}
            </label>
            <label class="check-inline" for="chat-no-plan">
              <input type="checkbox" id="chat-no-plan" ${C.noPlan?"checked":""} />
              ${t(e("chat.noPlan"))}
            </label>
            </div>
            <label class="chat-ctx-label chat-field-full">${t(e("chat.permission"))}
              <select id="chat-perm">
                ${["","default","acceptEdits","auto","dontAsk","bypassPermissions","plan"].map(m=>{const p=m||e("chat.effortDefault"),l=(C.permissionMode||"")===m?" selected":"";return`<option value="${t(m)}"${l}>${t(p)}</option>`}).join("")}
              </select>
            </label>
          </div>
          <div class="chat-system-wrap" id="chat-system-wrap" ${C.systemOpen||C.systemPrompt?"":"hidden"}>
            <label class="chat-system-label" for="chat-system">${t(e("chat.systemPrompt"))}
              <span class="hint">${t(e("chat.systemHint"))}</span>
            </label>
            <textarea id="chat-system" rows="3" placeholder="${t(e("chat.systemPlaceholder"))}">${t(C.systemPrompt||"")}</textarea>
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
                <input type="file" id="chat-file" class="chat-file-input" multiple accept="${t(fs)}" />
                <button type="button" class="btn secondary sm" id="chat-attach" title="${t(e("chat.attachHint"))}">${t(e("chat.attach"))}</button>
                <button type="button" class="btn secondary sm" id="chat-attach-lib" title="${t(e("chat.libraryTitle"))}">${t(e("chat.attachLibrary"))}</button>
                <span class="chat-formats-hint" title="${t(Dt())}">
                  <span class="chat-formats-label">${t(e("chat.formatsLabel"))}</span>
                  <span class="muted">${t(Dt())}</span>
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
            <input type="search" id="chat-history-search" class="chat-history-search" placeholder="${t(e("chat.historySearch"))}" value="${t(L.historyQ)}" />
          </div>
          <ul class="chat-history-list" id="chat-history-list"></ul>
          <div class="chat-history-pager" id="chat-history-pager"></div>
        </aside>
      </div>
    </div>
  `),ie(),Be(),Ue(),Ce(),it(),Fe(),et(),Ht(),Ke().catch(()=>{}),document.getElementById("chat-settings-toggle")?.addEventListener("click",()=>{C.settingsOpen=!C.settingsOpen,Ht()}),document.getElementById("chat-key-select").onchange=()=>de();const o=document.getElementById("chat-ctx-mode"),i=document.getElementById("chat-ctx-n");o&&(o.onchange=()=>{const m=o.value;if(m==="summary"&&!D.summary){U(e("chat.compressNeedSummary")),o.value=D.mode==="recent"?"recent":"full";return}D.mode=m==="summary"||m==="recent"?m:"full",Fe(),et(),ht().catch(()=>{})}),i&&(i.onchange=()=>{D.recentN=Math.min(40,Math.max(2,Number(i.value)||6)),Fe(),ht().catch(()=>{})}),document.getElementById("chat-model").onchange=()=>de(),document.getElementById("chat-reasoning").onchange=()=>de(),document.getElementById("chat-effort")?.addEventListener("change",()=>de()),document.getElementById("chat-resume")?.addEventListener("change",()=>de()),document.getElementById("chat-fork")?.addEventListener("change",()=>de()),document.getElementById("chat-memory")?.addEventListener("change",()=>de()),document.getElementById("chat-no-plan")?.addEventListener("change",()=>de()),document.getElementById("chat-perm")?.addEventListener("change",()=>de()),document.getElementById("chat-system").oninput=()=>de(),document.getElementById("chat-system-toggle").onclick=()=>{de(),C.systemOpen=!C.systemOpen;const m=document.getElementById("chat-system-wrap");m&&(m.hidden=!C.systemOpen&&!C.systemPrompt.trim()),C.systemOpen&&document.getElementById("chat-system")?.focus()},document.getElementById("chat-new").onclick=()=>{lo(!0)},document.getElementById("chat-compress").onclick=()=>{no().catch(()=>{})},document.getElementById("chat-stop").onclick=()=>{ge&&ge.abort()},document.getElementById("chat-send").onclick=()=>Aa(),document.getElementById("chat-attach").onclick=()=>{document.getElementById("chat-file")?.click()},document.getElementById("chat-attach-lib")?.addEventListener("click",()=>{fo().catch(m=>U(m.message||e("chat.libraryLoadFail")))}),document.getElementById("chat-file").onchange=m=>{const p=m.target;ns(p.files).finally(()=>{p.value=""})};const n=document.getElementById("chat-history-toggle"),d=document.getElementById("chat-history-backdrop"),r=document.getElementById("chat-history-close-mobile");n&&(n.onclick=()=>{sa(!L.historyOpenMobile)}),d&&(d.onclick=()=>oa()),r&&(r.onclick=()=>oa());const u=document.getElementById("chat-history-search");u&&(u.oninput=()=>{L.historyQ=u.value,Wt&&clearTimeout(Wt),Wt=setTimeout(()=>{L.historyPage=0,Ke()},280)}),bo(),document.getElementById("chat-input").onkeydown=m=>{m.key==="Enter"&&!m.shiftKey&&(m.preventDefault(),Aa())}}function bo(){const a=document.getElementById("chat-page"),s=document.getElementById("chat-drop-overlay"),o=document.getElementById("chat-composer");if(!a)return;let i=0;const n=g=>{const f=g.dataTransfer?.types;return f?typeof f.includes=="function"?f.includes("Files"):[...f].includes("Files"):!1},d=g=>{a.classList.toggle("is-file-drag",g),o&&o.classList.toggle("is-dragover",g),s&&(s.hidden=!g,s.setAttribute("aria-hidden",g?"false":"true"))},r=g=>{n(g)&&(g.preventDefault(),g.stopPropagation(),i+=1,d(!0))},u=g=>{n(g)&&(g.preventDefault(),g.stopPropagation(),g.dataTransfer&&(g.dataTransfer.dropEffect="copy"),d(!0))},m=g=>{n(g)&&(g.preventDefault(),g.stopPropagation(),i=Math.max(0,i-1),i===0&&d(!1))},p=g=>{if(!n(g))return;g.preventDefault(),g.stopPropagation(),i=0,d(!1);const f=g.dataTransfer?.files;f?.length&&ns(f).catch(b=>U(b.message||e("chat.uploadFail")))};a.addEventListener("dragenter",r),a.addEventListener("dragover",u),a.addEventListener("dragleave",m),a.addEventListener("drop",p);const l=g=>{c.page==="chat"&&n(g)&&g.preventDefault()},k=g=>{c.page==="chat"&&n(g)&&g.preventDefault()};window.addEventListener("dragover",l),window.addEventListener("drop",k),a._chatDropCleanup=()=>{window.removeEventListener("dragover",l),window.removeEventListener("drop",k)}}function ho(a){const s=new Set,o=[],i=n=>{if(!n||typeof n!="string")return;const d=n.trim();!ha.test(d)||s.has(d)||(s.add(d),o.push(d))};for(const n of a||[])i(n?.id);for(const n of Y)if(n?.docs?.length)for(const d of n.docs)i(d?.id);return o}async function Aa(){de();const a=document.getElementById("chat-input");let s=a?.value.trim()||"";const o=[...ae];if(!s&&!o.length){U(e("chat.needContent"));return}const i=St();if(!i){U(e("chat.needKey"));return}if(!s&&o.length&&(s=e("chat.fileOnlyPrompt")),o.filter(B=>!B?.id||!ha.test(String(B.id))).length){U(e("chat.uploadFail"));return}const d=document.getElementById("chat-model")?.value||C.model||"grok-4.5",r=document.getElementById("chat-reasoning")?.checked!==!1,u=document.getElementById("chat-effort")?.value||C.effort||"";va();const m=o.map(B=>({id:B.id,name:B.name})),p=ho(o);Y.push({role:"user",content:s,docs:m.length?m:void 0}),a&&(a.value=""),ae=[],Ue();const l={role:"assistant",content:"",reasoning:"",streaming:!0};Y.push(l),_e=Math.max(0,Y.length-es),Be();const g=to(),f=document.getElementById("chat-send"),b=document.getElementById("chat-stop"),$=document.getElementById("chat-attach"),A=document.getElementById("chat-attach-lib");f&&(f.disabled=!0),$&&($.disabled=!0),A&&(A.disabled=!0),b&&(b.disabled=!1),ge=new AbortController;try{const B={model:d,stream:!0,include_reasoning:r,messages:g};u&&(B.reasoning_effort=u),de(),C.resumeId&&(B.resume=C.resumeId),C.forkSession&&(B.fork_session=!0),C.memory&&(B.experimental_memory=!0),C.noPlan&&(B.no_plan=!0),C.permissionMode&&(B.permission_mode=C.permissionMode),p.length&&(B.document_ids=p);const R=kt();R&&(B.apiKeyId=R);const I=await fetch("/admin/api/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${i}`,"Content-Type":"application/json"},body:JSON.stringify(B),signal:ge.signal});if(!I.ok){const K=await I.text();let P=K;try{P=JSON.parse(K).error?.message||K}catch{}throw new Error(P||I.statusText)}if(I.body&&typeof I.body.getReader=="function"){const K=I.body.getReader(),P=new TextDecoder;let S="",F=0;const x=(y=!1)=>{const h=performance.now();(y||h-F>40)&&(F=h,Be())};for(;;){const{done:y,value:h}=await K.read();if(y)break;S+=P.decode(h,{stream:!0});const{events:N,rest:W}=zt(S);S=W;let M=!1;for(const O of N)if(O!=="[DONE]")try{const j=JSON.parse(O);Et(l,j)&&(M=!0)}catch{}M&&x(!1)}if(S.trim()){const{events:y}=zt(S+`
`);for(const h of y)if(h!=="[DONE]")try{Et(l,JSON.parse(h))}catch{}}x(!0)}else{const K=await I.text(),{events:P}=zt(K+`
`);for(const S of P)if(S!=="[DONE]")try{Et(l,JSON.parse(S))}catch{try{const F=JSON.parse(K);Et(l,F)}catch{}}Be()}!l.content&&!l.reasoning&&(l.content=e("chat.emptyReply")),U("")}catch(B){B.name==="AbortError"?l.content=(l.content||"")+`
[${e("chat.stopped")}]`:(l.error=!0,l.content=(l.content||"")+`
✗ ${B.message||B}`,U(B.message||String(B)))}finally{l.streaming=!1,ge=null,Be(),it(),f&&(f.disabled=!1),$&&($.disabled=!1),A&&(A.disabled=!1),b&&(b.disabled=!0),ht().catch(()=>{})}}const Vt="email@ysk.hk",vo="https://github.com/sponsors/yanshekki",$o="https://linktr.ee/yanshekki",ko="https://ysk.hk/",So="https://github.com/yanshekki/Grok-Cli-to-OpenAI-compatible#readme";async function wo(){const s=[[e("support.netEvm"),"yanshekki.eth"],[e("support.netNear"),"yanshekki.near"],[e("support.netAda"),"$yanshekki"]].map(([o,i])=>`
      <tr>
        <td>${t(o)}</td>
        <td><code class="cell-code">${t(i)}</code></td>
        <td class="row-actions"><button type="button" class="btn secondary sm" data-copy="${t(i)}">${t(e("support.copy"))}</button></td>
      </tr>`).join("");document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("support.title"))}</h2>
    </div>
    ${ke([e("support.subtitle")])}
    <div class="support-pills" role="navigation">
      <button type="button" class="seg-tab is-active" data-jump="support-creator">${t(e("support.pillSupport"))}</button>
      <button type="button" class="seg-tab" data-jump="support-sponsor">${t(e("support.pillSponsor"))}</button>
      <a class="seg-tab" href="mailto:${Vt}">${t(e("support.pillHelp"))}</a>
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
            <a class="btn" href="${vo}" target="_blank" rel="noopener noreferrer">${t(e("support.githubSponsors"))}</a>
            <a class="btn secondary" href="${$o}" target="_blank" rel="noopener noreferrer">${t(e("support.linktree"))}</a>
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
          <a class="btn secondary sm" href="${ko}" target="_blank" rel="noopener noreferrer">${t(e("support.site"))}</a>
        </div>
      </section>
      <section class="panel support-panel" id="support-help">
        <div class="panel-h"><strong>${t(e("support.helpTitle"))}</strong></div>
        <div class="panel-pad">
          <p class="support-prose">${t(e("support.helpBody"))}</p>
          <a class="btn support-email-btn" href="mailto:${Vt}">${Vt}</a>
          <p class="support-docs"><a href="${So}" target="_blank" rel="noopener noreferrer">${t(e("support.docs"))}</a></p>
        </div>
      </section>
    </div>
  `),ie(),document.querySelectorAll("[data-jump]").forEach(o=>{o.addEventListener("click",()=>{const i=o.getAttribute("data-jump");i&&document.getElementById(i)?.scrollIntoView({behavior:"smooth",block:"start"})})}),document.querySelectorAll("[data-copy]").forEach(o=>{o.addEventListener("click",async()=>{const i=o.getAttribute("data-copy")||"",n=await Rt(i);o.textContent=e(n?"chat.copied":"support.copy"),setTimeout(()=>{o.textContent=e("support.copy")},1400)})})}async function Nt(){const a=document.getElementById("app");try{if(!c.key){await Ua();return}c.me||await ja(),c.page==="dashboard"?await Xt():c.page==="chat"?await go():c.page==="chats"?await ut():c.page==="keys"?await Oe():c.page==="documents"?await at():c.page==="media"?await Ee():c.page==="audit"?await mt():c.page==="settings"?await Xa():c.page==="apiFeatures"?await Mt():c.page==="usage"?await ue():c.page==="ddos"?await ee():c.page==="queue"?await oe():c.page==="pm2"?await Ae():c.page==="system"?await st():c.page==="support"?await wo():await Xt()}catch(s){a.innerHTML=ne(`<div class="error-box">${t(s.message)}</div>`),ie()}}let Ve=null;const Q={tab:"overview",status:"",sortBy:"queuedAt",sortDir:"desc",limit:20,offset:0};function Ot(a){return!a||a<0?"—":a<1e3?`${a}ms`:a<6e4?`${Math.round(a/1e3)}s`:a<36e5?`${Math.round(a/6e4)}m`:`${(a/36e5).toFixed(1)}h`}const Po=["enabled","globalConcurrency","perKeyConcurrency","maxQueueDepth","maxQueueDepthPerKey","fairness","defaultPriority","playgroundPriority","leaseMs","maxWaitMs"];function is(){return{relaxed:{enabled:!0,globalConcurrency:6,perKeyConcurrency:2,maxQueueDepth:200,maxQueueDepthPerKey:40,fairness:"weighted_round_robin",defaultPriority:100,playgroundPriority:40,leaseMs:6e4,maxWaitMs:9e5},balanced:{enabled:!0,globalConcurrency:4,perKeyConcurrency:1,maxQueueDepth:100,maxQueueDepthPerKey:20,fairness:"weighted_round_robin",defaultPriority:100,playgroundPriority:50,leaseMs:45e3,maxWaitMs:6e5},strict:{enabled:!0,globalConcurrency:2,perKeyConcurrency:1,maxQueueDepth:40,maxQueueDepthPerKey:8,fairness:"fifo_global",defaultPriority:100,playgroundPriority:80,leaseMs:3e4,maxWaitMs:3e5}}}function Ba(a){if(!a)return{};const s={};for(const o of Po){const i=a[o];typeof i=="boolean"?s[o]=i:typeof i=="number"&&Number.isFinite(i)?s[o]=Math.round(i):typeof i=="string"?s[o]=i:i==null?s[o]=null:s[o]=i}return s}function rs(a,s){return JSON.stringify(Ba(a))===JSON.stringify(Ba(s))}function na(a){if(!a)return"custom";const s=is();for(const o of["relaxed","balanced","strict"])if(rs(a,s[o]))return o;return"custom"}function Eo(a){return e(a==="relaxed"?"queue.presetRelaxed":a==="balanced"?"queue.presetBalanced":a==="strict"?"queue.presetStrict":"queue.presetCustom")}function ds(a,{unsaved:s=!1}={}){const o=Eo(a),i=a==="relaxed"?"relaxed":a==="balanced"?"balanced":a==="strict"?"strict":"custom",n=s?q("queue.presetFormLabel",{name:o}):q("queue.presetActiveLabel",{name:o});return`<span class="ddos-preset-badge is-${i}" id="queue-preset-badge" title="${t(n)}">${t(n)}</span>`}function ls(){return{enabled:document.getElementById("q-master-enabled")?Je("q-master-enabled"):!0,globalConcurrency:Math.max(1,Math.min(64,Math.floor(z("qp-gconc",4)))),perKeyConcurrency:Math.max(1,Math.min(16,Math.floor(z("qp-kconc",1)))),maxQueueDepth:Math.max(1,Math.floor(z("qp-depth",100))),maxQueueDepthPerKey:Math.max(1,Math.floor(z("qp-depthk",20))),fairness:document.getElementById("qp-fair")?.value==="fifo_global"?"fifo_global":"weighted_round_robin",defaultPriority:Math.max(0,Math.min(1e3,Math.floor(z("qp-pri",100)))),playgroundPriority:Math.max(0,Math.min(1e3,Math.floor(z("qp-ppri",50)))),leaseMs:Math.max(5e3,Math.floor(z("qp-lease",45e3))),maxWaitMs:Math.max(5e3,Math.floor(z("qp-wait",6e5)))}}function _t(a){Xe("q-master-enabled",a,e("queue.masterOn"),e("queue.masterOff")),Ze("queue-root",!a),Ye("queue-disabled-banner",!a);const s=document.getElementById("qk-pill-enabled");s&&(s.innerHTML=Re(a,e("dash.on"),e("dash.off")))}function Io(a){if(!a)return;const s=(i,n)=>{const d=document.getElementById(i);d&&(d.value=String(n))};_t(a.enabled!==!1),s("qp-gconc",a.globalConcurrency),s("qp-kconc",a.perKeyConcurrency),s("qp-depth",a.maxQueueDepth),s("qp-depthk",a.maxQueueDepthPerKey);const o=document.getElementById("qp-fair");o&&(o.value=a.fairness||"weighted_round_robin"),s("qp-pri",a.defaultPriority),s("qp-ppri",a.playgroundPriority),s("qp-lease",a.leaseMs),s("qp-wait",a.maxWaitMs),ft()}function ft(){if(!document.getElementById("queue-policy-panel"))return;let a;try{a=ls()}catch{return}const s=na(a),o=na(c._queuePolicyCache||a),i=!rs(a,c._queuePolicyCache||a);document.querySelectorAll("[data-queue-preset]").forEach(r=>{const u=r.dataset.queuePreset;if(u==="custom"){const k=s==="custom";r.classList.toggle("is-active",k),r.setAttribute("aria-pressed",k?"true":"false"),r.disabled=!k;return}const m=u===s,p=u===o;r.classList.toggle("is-active",m),r.classList.toggle("is-saved",p&&!m),r.setAttribute("aria-pressed",m?"true":"false");const l=e(u==="relaxed"?"queue.presetRelaxed":u==="balanced"?"queue.presetBalanced":"queue.presetStrict");m&&p?r.innerHTML=`${t(l)} <span class="preset-tag">${t(e("queue.presetTagActive"))}</span>`:m&&i?r.innerHTML=`${t(l)} <span class="preset-tag preset-tag--draft">${t(e("queue.presetTagDraft"))}</span>`:p?r.innerHTML=`${t(l)} <span class="preset-tag preset-tag--saved">${t(e("queue.presetTagSaved"))}</span>`:r.textContent=l});const n=document.getElementById("queue-preset-badge");n&&(n.outerHTML=ds(s,{unsaved:i&&s!==o}));const d=document.getElementById("queue-preset-hint");if(d){const r={relaxed:e("queue.presetRelaxedHint"),balanced:e("queue.presetBalancedHint"),strict:e("queue.presetStrictHint"),custom:e("queue.presetCustomHint")};d.textContent=r[s]||r.custom}}function xo(){document.querySelectorAll("[data-queue-preset]").forEach(a=>{a.dataset.queuePreset!=="custom"&&(a.onclick=()=>{const s=a.dataset.queuePreset,o=is()[s];o&&Io(o)})}),["qp-gconc","qp-kconc","qp-depth","qp-depthk","qp-fair","qp-pri","qp-ppri","qp-lease","qp-wait"].forEach(a=>{const s=document.getElementById(a);s&&(s.addEventListener("change",()=>ft()),s.addEventListener("input",()=>ft()))}),ft()}function Ca(){return document.querySelector(".main")}function cs(a){return a.map(s=>{const o=s.status==="queued"||s.status==="leased"||s.status==="running",i=s.status==="failed"||s.status==="dead"||s.status==="cancelled",n=s.startedAt||s.finishedAt?null:s.queuedAt?Date.now()-new Date(s.queuedAt).getTime():null;return`
    <tr data-q-row="${t(s.id)}">
      <td>
        <div class="cell-primary mono" title="${t(s.id||"")}">${t((s.id||"").slice(0,10))}…</div>
        <div class="cell-sub mono" title="${t(s.requestId||"")}">${t((s.requestId||"").slice(0,18))}${(s.requestId||"").length>18?"…":""}</div>
        ${s.errorMessage?`<div class="queue-job-err" title="${t(s.errorMessage)}">${t(String(s.errorMessage).slice(0,80))}</div>`:""}
      </td>
      <td>${$s(s.source)}</td>
      <td>
        ${vs(s.status)}
        ${s.cancelRequested?`<div class="cell-sub">${t(e("queue.cancelReq"))}</div>`:""}
      </td>
      <td class="mono" title="${t(s.model||"")}">${t(s.model||"—")}</td>
      <td><span class="queue-pri">${s.priority??"—"}</span></td>
      <td>
        <div class="cell-primary mono" title="${t(s.apiKeyId||"")}">${t((s.apiKeyId||"").slice(0,8))}…</div>
      </td>
      <td class="mono">${s.attempt??0}<span class="muted">/${s.maxAttempts??1}</span></td>
      <td>
        <div class="cell-primary">${te(s.queuedAt)}</div>
        ${n!=null&&s.status==="queued"?`<div class="cell-sub" data-q-wait>${t(e("queue.wait"))}: ${Ot(n)}</div>`:s.startedAt?`<div class="cell-sub">${t(e("queue.started"))}: ${te(s.startedAt)}</div>`:""}
      </td>
      <td>
        <div class="row-actions">
        ${o?`<button type="button" class="btn danger sm" data-q-cancel="${t(s.id)}">${t(e("queue.cancel"))}</button>`:""}
        ${s.status==="queued"?`<button type="button" class="btn secondary sm" data-q-pri="${t(s.id)}" data-pri="${s.priority}">${t(e("queue.priorityBtn"))}</button>`:""}
        ${i?`<button type="button" class="btn secondary sm" data-q-requeue="${t(s.id)}">${t(e("queue.requeue"))}</button>`:""}
        </div>
      </td>
    </tr>`}).join("")}function us(){document.querySelectorAll("[data-q-cancel]").forEach(a=>{a.onclick=async()=>{await J({title:e("queue.cancel"),message:e("queue.cancelConfirm"),variant:"danger",confirmText:e("queue.cancel")})&&(await E(`/queue/jobs/${a.dataset.qCancel}/cancel`,{method:"POST",body:"{}"}),oe().catch(v))}}),document.querySelectorAll("[data-q-requeue]").forEach(a=>{a.onclick=async()=>{await E(`/queue/jobs/${a.dataset.qRequeue}/requeue`,{method:"POST",body:"{}"}),oe().catch(v)}}),document.querySelectorAll("[data-q-pri]").forEach(a=>{a.onclick=async()=>{const s=Number(a.dataset.pri)||100,o=window.prompt(e("queue.priorityPh"),String(s));if(o==null)return;const i=Number(o);!Number.isFinite(i)||i<0||i>1e3||(await E(`/queue/jobs/${a.dataset.qPri}/priority`,{method:"POST",body:JSON.stringify({priority:i})}),oe().catch(v))}})}function ms(a){return a.enabled?a.paused?e("queue.paused"):a.drainMode?e("queue.drain"):e("queue.running"):e("queue.modeOff")}function Mo({s:a,pol:s,jobs:o,total:i,by:n}){const d=a.dead??n.dead??0,r=a.leased??n.leased??0,u=a.running??n.running??0,m=a.queued??n.queued??0,p=a.depth??m+r+u,l=ms(s),k=s.fairness==="fifo_global"?e("queue.fifo"):e("queue.wrr"),g=(x,y)=>{const h=document.getElementById(x);h&&(h.textContent=y)},f=(x,y)=>{const h=document.getElementById(x);h&&(h.innerHTML=y)};g("qk-depth",String(p)),g("qk-depth-sub",q("queue.kpiDepthSub",{q:m,l:r})),f("qk-running",`${u}<span class="dash-kpi-den">/${s.globalConcurrency??"—"}</span>`),g("qk-running-sub",q("queue.kpiActiveSub",{n:a.workerActive??0})),g("qk-queued",String(m)),g("qk-dead",String(d)),g("qk-oldest",a.oldestQueuedAgeMs?Ot(a.oldestQueuedAgeMs):"—"),g("qk-mode",l),g("qk-mode-sub",k);const b=document.getElementById("qk-worker-id");if(b){const x=a.workerId||"—";b.textContent=x,b.title=x}const $=(x,y,h,N)=>{const W=document.getElementById(x);W&&(W.outerHTML=`<span id="${x}">${Re(y,h,N)}</span>`)};$("qk-pill-enabled",s.enabled!==!1,e("dash.on"),e("dash.off")),$("qk-pill-consumer",!s.paused&&s.enabled!==!1,e("queue.running"),s.paused?e("queue.paused"):e("queue.modeOff")),$("qk-pill-admission",!s.drainMode,e("queue.accepting"),e("queue.drain")),g("qk-fairness-val",k),g("qk-conc-val",`${s.perKeyConcurrency??1} / ${s.globalConcurrency??"—"}`);const A=document.getElementById("queue-dlq-slot");A&&(d>0?(A.innerHTML=`
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
        </div>`,document.getElementById("q-filter-dead")?.addEventListener("click",()=>{Q.status="dead",Q.offset=0,Q.tab="jobs",oe().catch(v)})):A.innerHTML="");const B=(x,y)=>{const h=document.getElementById(x);h&&(h.textContent=String(y??0))};B("q-tab-count-jobs",i),B("q-tab-count-dead",d);const R=document.getElementById("qk-jobs-meta");R&&(R.textContent=q("queue.jobsMeta",{n:i}));const I=document.querySelector("#queue-jobs-table tbody");if(I){const x=o.map(h=>`${h.id}|${h.status}|${h.priority}|${h.attempt}|${h.cancelRequested?1:0}|${h.errorMessage||""}|${h.startedAt||""}|${h.finishedAt||""}`).join(";"),y=cs(o)||`<tr class="empty-row"><td colspan="9">
        <div class="data-empty">
          <div class="data-empty-icon">∅</div>
          <strong>${t(e("queue.empty"))}</strong>
        </div>
      </td></tr>`;if(I.dataset.qsig!==x){const h=document.querySelector("#queue-jobs-table .table-wrap"),N=h?.scrollLeft||0;I.dataset.qsig=x,I.innerHTML=y,us(),ya(document.querySelector("#queue-jobs-table")||document),h&&(h.scrollLeft=N)}else o.forEach(h=>{if(h.status!=="queued"||!h.queuedAt)return;const N=Date.now()-new Date(h.queuedAt).getTime(),W=String(h.id||"");let M=null;I.querySelectorAll("[data-q-row]").forEach(j=>{j.getAttribute("data-q-row")===W&&(M=j)});const O=M?.querySelector("[data-q-wait]");O&&(O.textContent=`${e("queue.wait")}: ${Ot(N)}`)})}if(document.querySelector("#queue-pager .data-pager-meta span")){const x=Math.max(1,Math.ceil((i||0)/Q.limit)||1),y=Math.floor(Q.offset/Q.limit)+1,h=document.querySelectorAll("#queue-pager .data-pager-meta > span");h[0]&&(h[0].textContent=q("common.pagerTotal",{n:i||0})),h[1]&&(h[1].textContent=q("common.pagerPage",{n:y,total:x}));const N=document.getElementById("queue-prev"),W=document.getElementById("queue-next");N&&(N.disabled=Q.offset<=0),W&&(W.disabled=Q.offset+Q.limit>=i)}const P=document.getElementById("q-pause");P&&(P.textContent=s.paused?e("queue.resume"):e("queue.pause"));const S=document.getElementById("q-drain");S&&(S.textContent=s.drainMode?e("queue.undrain"):e("queue.drainBtn"));const F=document.getElementById("q-master-enabled");F&&document.activeElement!==F&&_t(s.enabled!==!1)}function La(){Ve||(Ve=setInterval(()=>{if(c.page!=="queue"){clearInterval(Ve),Ve=null;return}const a=document.activeElement;a&&a.closest&&a.closest("#queue-policy-panel")&&(a.tagName==="INPUT"||a.tagName==="SELECT"||a.tagName==="TEXTAREA")||oe({soft:!0}).catch(()=>{})},4e3))}async function oe(a={}){const s=!!a.soft&&document.getElementById("queue-root");!s&&Ve&&(clearInterval(Ve),Ve=null);const o=Ca(),i=!s&&o?o.scrollTop:0,n=Q;n.sortBy||(n.sortBy="queuedAt"),n.sortDir||(n.sortDir="desc");const d=new URLSearchParams;d.set("limit",String(n.limit)),d.set("offset",String(n.offset)),n.status&&d.set("status",n.status),$e(d,n);const[r,u,m]=await Promise.all([E("/queue/stats"),E(`/queue/jobs?${d}`),E("/queue/policy")]);if(c.page!=="queue")return;const p=r.data||{},l=m.data||p.policy||{},k=u.data||[],g=u.total??k.length,f=p.byStatus||{},b=p.dead??f.dead??0,$=p.leased??f.leased??0,A=p.running??f.running??0,B=p.queued??f.queued??0,R=p.depth??B+$+A,I=ms(l);if(c._queuePolicyCache={...l},s){Mo({s:p,pol:l,jobs:k,total:g,by:f}),La();return}Q.tab||(Q.tab="overview");const K=Q.tab==="jobs"||Q.tab==="policy"?Q.tab:"overview";Q.tab=K;const P=cs(k),S=Ne({title:e("queue.filterTitle"),hint:e("queue.filterHint"),meta:q("queue.jobsMeta",{n:g}),gridHtml:`
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
      </label>`}),F=be({headHtml:`
      <th>${t(e("queue.colJob"))}</th>
      <th>${t(e("queue.colSource"))}</th>
      ${_({field:"status",label:e("queue.colStatus"),filterRef:n})}
      ${_({field:"model",label:e("queue.colModel"),filterRef:n})}
      ${_({field:"priority",label:e("queue.colPri"),filterRef:n})}
      <th>${t(e("queue.colKey"))}</th>
      ${_({field:"attempt",label:e("queue.colTry"),filterRef:n})}
      ${_({field:"queuedAt",label:e("queue.colTime"),filterRef:n})}
      <th>${t(e("common.actions"))}</th>`,bodyHtml:P,colSpan:9,emptyText:e("queue.empty"),pagerHtml:qe({total:g,limit:n.limit,offset:n.offset,idPrefix:"queue"})}),x=l.fairness==="fifo_global"?e("queue.fifo"):e("queue.wrr"),y=l.enabled!==!1,h=(G,X,H,w,T)=>`
    <div class="card">
      <div class="label">${t(G)}</div>
      <div class="value value-sm" id="${t(w)}">${X}</div>
      ${H!=null&&H!==""?`<div class="muted card-sub"${T?` id="${t(T)}"`:""}>${t(String(H))}</div>`:""}
    </div>`,N=`
    <div class="grid queue-kpi-grid" id="queue-kpi-grid">
      ${h(e("queue.depth"),t(String(R)),q("queue.kpiDepthSub",{q:B,l:$}),"qk-depth","qk-depth-sub")}
      ${h(e("queue.activeJobs"),`${A}<span class="dash-kpi-den">/${l.globalConcurrency??"—"}</span>`,q("queue.kpiActiveSub",{n:p.workerActive??0}),"qk-running","qk-running-sub")}
      ${h(e("queue.queued"),t(String(B)),e("queue.kpiQueuedSub"),"qk-queued","qk-queued-sub")}
      ${h(e("queue.dead"),t(String(b)),e("queue.kpiDeadSub"),"qk-dead","qk-dead-sub")}
      ${h(e("queue.oldest"),t(p.oldestQueuedAgeMs?Ot(p.oldestQueuedAgeMs):"—"),e("queue.kpiOldestSub"),"qk-oldest","qk-oldest-sub")}
      ${h(e("queue.mode"),t(I),x,"qk-mode","qk-mode-sub")}
    </div>`,W=`
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
            <span id="qk-pill-enabled">${Re(l.enabled!==!1,e("dash.on"),e("dash.off"))}</span>
          </div>
          <div class="queue-status-item">
            <span class="label">${t(e("queue.consumer"))}</span>
            <span id="qk-pill-consumer">${Re(!l.paused&&l.enabled!==!1,e("queue.running"),l.paused?e("queue.paused"):e("queue.modeOff"))}</span>
          </div>
          <div class="queue-status-item">
            <span class="label">${t(e("queue.admission"))}</span>
            <span id="qk-pill-admission">${Re(!l.drainMode,e("queue.accepting"),e("queue.drain"))}</span>
          </div>
          <div class="queue-status-item">
            <span class="label">${t(e("queue.fairness"))}</span>
            <strong class="queue-status-val" id="qk-fairness-val">${t(x)}</strong>
          </div>
          <div class="queue-status-item">
            <span class="label">${t(e("queue.concurrency"))}</span>
            <strong class="queue-status-val mono" id="qk-conc-val">${l.perKeyConcurrency??1} / ${l.globalConcurrency??"—"}</strong>
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
    ${b>0?`<div class="queue-dlq-banner" role="status">
      <div class="queue-dlq-text">
        <strong>${t(e("queue.dlqTitle"))}</strong>
        <span class="queue-dlq-count">${b}</span>
        <span class="muted">${t(e("queue.dlqHint"))}</span>
      </div>
      <div class="toolbar">
        <button type="button" class="btn secondary sm" id="q-filter-dead">${t(e("queue.viewDlq"))}</button>
        <button type="button" class="btn danger sm" id="q-purge-dlq">${t(e("queue.purgeDead"))}</button>
      </div>
    </div>`:""}
    </div>`,M=`
    ${S}
    <div id="queue-jobs-table" class="queue-jobs-table-host">${F}</div>`,O=`
    <div class="panel data-table-panel queue-policy-panel" id="queue-policy-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("queue.policyTitle"))}</strong>
          <span class="muted panel-h-sub">${t(e("queue.policyHint"))}</span>
        </div>
        ${ds(na(l))}
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
            <input type="number" id="qp-gconc" min="1" max="64" value="${Number(l.globalConcurrency)||2}" />
            <span class="hint">${t(e("queue.hintGlobalConc"))}</span>
          </label>
          <label>${t(e("queue.perKeyConcurrency"))}
            <input type="number" id="qp-kconc" min="1" max="16" value="${Number(l.perKeyConcurrency)||1}" />
            <span class="hint">${t(e("queue.hintPerKeyConc"))}</span>
          </label>
          <label>${t(e("queue.maxDepth"))}
            <input type="number" id="qp-depth" min="1" value="${Number(l.maxQueueDepth)||100}" />
            <span class="hint">${t(e("queue.hintMaxDepth"))}</span>
          </label>
          <label>${t(e("queue.maxDepthKey"))}
            <input type="number" id="qp-depthk" min="1" value="${Number(l.maxQueueDepthPerKey)||20}" />
            <span class="hint">${t(e("queue.hintMaxDepthKey"))}</span>
          </label>
          <label>${t(e("queue.fairness"))}
            <select id="qp-fair">
              <option value="weighted_round_robin" ${l.fairness==="weighted_round_robin"?"selected":""}>${t(e("queue.wrr"))}</option>
              <option value="fifo_global" ${l.fairness==="fifo_global"?"selected":""}>${t(e("queue.fifo"))}</option>
            </select>
            <span class="hint">${t(e("queue.hintFairness"))}</span>
          </label>
          <label>${t(e("queue.defaultPriority"))}
            <input type="number" id="qp-pri" min="0" max="1000" value="${Number(l.defaultPriority)||100}" />
          </label>
          <label>${t(e("queue.playgroundPriority"))}
            <input type="number" id="qp-ppri" min="0" max="1000" value="${Number(l.playgroundPriority)||50}" />
          </label>
          <label>${t(e("queue.leaseMs"))}
            <input type="number" id="qp-lease" min="5000" step="1000" value="${Number(l.leaseMs)||45e3}" />
            <span class="hint">${t(e("queue.hintLease"))}</span>
          </label>
          <label>${t(e("queue.maxWaitMs"))}
            <input type="number" id="qp-wait" min="5000" step="1000" value="${Number(l.maxWaitMs)||6e5}" />
            <span class="hint">${t(e("queue.hintMaxWait"))}</span>
          </label>
        </div>
        <div class="toolbar settings-save-bar">
          <button type="button" class="btn sm" id="qp-save">${t(e("queue.savePolicy"))}</button>
        </div>
      </div>
    </div>`;if(document.getElementById("app").innerHTML=ne(`
  <div id="queue-root" class="${y?"":"is-feature-off"}">
    <div class="topbar">
      <h2>${t(e("queue.title"))}</h2>
      <div class="toolbar">
        ${ga({id:"q-master-enabled",on:y,onLabel:e("queue.masterOn"),offLabel:e("queue.masterOff"),title:e("queue.masterHint")})}
        <button type="button" class="btn secondary sm" id="q-pause">${t(l.paused?e("queue.resume"):e("queue.pause"))}</button>
        <button type="button" class="btn secondary sm" id="q-drain">${t(l.drainMode?e("queue.undrain"):e("queue.drainBtn"))}</button>
        <button type="button" class="btn danger sm" id="q-purge">${t(e("queue.purgeDead"))}</button>
      </div>
    </div>
    ${ke([e("queue.subtitle")])}
    <div class="feature-off-banner" id="queue-disabled-banner" ${y?"hidden":""} role="status">
      <strong>${t(e("common.featureOff"))}</strong>
      <span>${t(e("queue.disabledBanner"))}</span>
    </div>

    ${N}

    <div class="usage-tabs-panel panel queue-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("queue.title"))}">
        <button type="button" role="tab" class="seg-tab ${K==="overview"?"is-active":""}" data-queue-tab="overview" aria-selected="${K==="overview"}">
          ${t(e("queue.tabOverview"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${K==="jobs"?"is-active":""}" data-queue-tab="jobs" aria-selected="${K==="jobs"}">
          ${t(e("queue.tabJobs"))}
          <span class="seg-tab-count" id="q-tab-count-jobs">${g}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${K==="policy"?"is-active":""}" data-queue-tab="policy" aria-selected="${K==="policy"}">
          ${t(e("queue.tabPolicy"))}
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane queue-tab-pane-overview" id="queue-tab-overview" ${K==="overview"?"":"hidden"}>
          ${W}
        </div>
        <div class="usage-tab-pane queue-tab-pane-jobs" id="queue-tab-jobs" ${K==="jobs"?"":"hidden"}>
          ${M}
        </div>
        <div class="usage-tab-pane queue-tab-pane-policy" id="queue-tab-policy" ${K==="policy"?"":"hidden"}>
          ${O}
        </div>
      </div>
    </div>
  </div>
  `),ie(),document.querySelectorAll("[data-queue-tab]").forEach(G=>{G.addEventListener("click",()=>{const X=G.getAttribute("data-queue-tab")||"overview";X!=="overview"&&X!=="jobs"&&X!=="policy"||Q.tab!==X&&(Q.tab=X,oe().catch(v))})}),i>0){const G=Ca();G&&(G.scrollTop=i,requestAnimationFrame(()=>{G.scrollTop=i}))}document.getElementById("q-master-enabled").onclick=async()=>{const G=!Je("q-master-enabled");_t(G);try{const X=await E("/queue/policy",{method:"PUT",body:JSON.stringify({enabled:G})});c._queuePolicyCache={...c._queuePolicyCache||{},...X.data||{enabled:G}},ft()}catch(X){_t(!G),v(X)}},document.getElementById("q-pause").onclick=async()=>{await E(l.paused?"/queue/resume":"/queue/pause",{method:"POST",body:"{}"}),oe().catch(v)},document.getElementById("q-drain").onclick=async()=>{await E(l.drainMode?"/queue/undrain":"/queue/drain",{method:"POST",body:"{}"}),oe().catch(v)};let j=!1;const le=async()=>{if(!j){j=!0;try{if(!await J({title:e("queue.purgeTitle"),message:e("queue.purgeConfirm"),variant:"danger",confirmText:e("queue.purgeConfirmBtn"),cancelText:e("common.cancel")}))return;const X=await E("/queue/purge-dead",{method:"POST",body:"{}"}),H=Number(X?.data?.deleted??0);await pe({title:e("queue.purgeDoneTitle"),message:q("queue.purgeDoneMsg",{n:H}),confirmText:e("common.ok")}),await oe()}finally{j=!1}}},me=document.getElementById("queue-root");me&&(me.onclick=G=>{G.target?.closest?.("#q-purge, #q-purge-dlq")&&(G.preventDefault(),le().catch(v))}),document.getElementById("q-filter-dead")?.addEventListener("click",()=>{Q.status="dead",Q.offset=0,Q.tab="jobs",oe().catch(v)}),document.querySelectorAll("[data-filter-apply]").forEach(G=>{G.onclick=()=>{Q.status=document.getElementById("qf-status")?.value||"",Q.offset=0,oe().catch(v)}}),document.querySelectorAll("[data-filter-reset]").forEach(G=>{G.onclick=()=>{Q.status="",Q.sortBy="queuedAt",Q.sortDir="desc",Q.offset=0,oe().catch(v)}}),rt("queue",Q,()=>oe().catch(v)),je(Q,()=>oe().catch(v)),document.getElementById("qp-save").onclick=async()=>{const G=ls();await E("/queue/policy",{method:"PUT",body:JSON.stringify(G)}),c._queuePolicyCache={...c._queuePolicyCache||{},...G},U(""),oe().catch(v)},xo(),us(),La()}c.page=bs();(!location.hash||location.hash==="#"||location.hash==="#/")&&la(c.page);window.addEventListener("hashchange",()=>{const a=da(location.hash);a&&a!==c.page&&ua(a,{writeHash:!1})});window.addEventListener("popstate",()=>{const a=da(location.hash);!a||a===c.page||ua(a,{writeHash:!1})});Nt();
//# sourceMappingURL=boot.js.map
