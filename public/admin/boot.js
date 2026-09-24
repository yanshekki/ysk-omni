const Ya="gog_admin_lang",oa={en:{brand:"YSK Omni",brandSub:"Admin Panel",loginTitle:"Admin",loginLabel:"API Key",loginOtpLabel:"One-time login code",loginBtn:"Sign in",loginCmdHint:"Get a key from the terminal:",loginOtpHint:"Generate a code in terminal (required every login):",loginOtpExpiry:"Code expires in 5 minutes and can be used only once.",loginOtpFail:"Invalid or expired code",loginLostKey:"Lost old key? Create a new admin key (plaintext is not stored).",loginCopy:"Copy",loginCopied:"Copied",needKey:"Enter API key",needOtp:"Enter the one-time code from the terminal",logout:"Log out",shell:{menu:"Open menu",closeMenu:"Close menu"},nav:{dashboard:"Dashboard",chat:"Chat",chats:"Chat logs",keys:"API Keys",documents:"Documents",media:"Media",catalog:"Catalog",runtimes:"Runtimes",audit:"Audit Logs",settings:"Safety",apiFeatures:"API features",usage:"Usage & Limits",ddos:"DDoS Center",queue:"Queue",pm2:"PM2",system:"System",support:"Support"},queue:{title:"Chat queue",subtitle:"Pause, drain, requeue, and tune concurrency.",paused:"Paused",running:"Consuming",drain:"Drain mode",mode:"Mode",modeOff:"Disabled",depth:"Depth",queued:"Queued",leased:"Leased",activeJobs:"Running",dead:"Dead letter",oldest:"Oldest wait",concurrency:"Per-key / global",worker:"In-process workers",workerInstance:"Worker instance",workerInstanceHint:"This process’s consumer ID (lease owner). Changes on restart.",kpiActiveSub:"{n} active in this process",consumer:"Consumer",admission:"Admission",accepting:"Accepting jobs",pause:"Pause",resume:"Resume",drainBtn:"Drain",undrain:"Stop drain",savePolicy:"Save policy",refresh:"Refresh",jobs:"Jobs",tabOverview:"Overview",tabJobs:"Jobs",tabPolicy:"Policy",jobsMeta:"{n} matching",cancel:"Cancel",requeue:"Requeue",purgeDead:"Purge DLQ & old jobs",purgeTitle:"Purge finished jobs?",purgeConfirm:"Deletes all dead-letter (DLQ) jobs now, plus succeeded / failed / cancelled jobs finished more than 24 hours ago.",purgeConfirmBtn:"Delete",purgeDoneTitle:"Purge complete",purgeDoneMsg:"Deleted {n} job(s).",cancelConfirm:"Cancel this job? If it is running, cancellation is cooperative.",empty:"No jobs match this filter",enabled:"Queue enabled",masterOn:"Queue on",masterOff:"Queue off",masterHint:"Master switch for the durable chat queue. Applies immediately.",disabledBanner:"Queue is disabled — new chat requests bypass the queue and run immediately (subject to concurrency limits).",globalConcurrency:"Global concurrency",perKeyConcurrency:"Per-key concurrency",maxDepth:"Max queue depth",maxDepthKey:"Max per key",fairness:"Fairness",fifo:"Global FIFO",wrr:"Weighted round-robin",playgroundPriority:"Playground priority (lower first)",defaultPriority:"Default priority",leaseMs:"Lease (ms)",maxWaitMs:"Max wait (ms)",filterTitle:"Filter jobs",filterHint:"Filter by status. Auto-refreshes.",filterStatus:"Status",allStatuses:"All statuses",filterDead:"Dead letter (DLQ)",filterQueued:"Queued",filterRunning:"Running / leased",filterFailed:"Failed",filterSucceeded:"Succeeded",filterCancelled:"Cancelled",errorCol:"Error",priorityBtn:"Priority",priorityPh:"Priority (0–1000, lower first)",dlqTitle:"Dead letter queue",dlqHint:"Jobs that exhausted retries — requeue or purge when ready.",viewDlq:"View DLQ",statusPanel:"Runtime status",statusPanelHint:"Live consumer, admission, and worker identity. Auto-refreshes every few seconds.",policyTitle:"Queue policy",policyHint:"Pick a scheme or fine-tune values. Save to apply. Editing pauses auto-refresh.",presetTitle:"Policy schemes",presetHint:"One-click presets. Active = matches form · Saved = currently stored.",presetRelaxed:"Relaxed",presetBalanced:"Balanced",presetStrict:"Strict",presetCustom:"Custom",presetRelaxedHint:"Higher concurrency and deeper queues — better for multi-key playgrounds and burst traffic.",presetBalancedHint:"Default production balance: fair round-robin, moderate depth, one job per key.",presetStrictHint:"Tight limits + global FIFO — protects the host when traffic is untrusted or resource is scarce.",presetCustomHint:"Values do not match a built-in scheme. Adjust fields or pick a scheme above.",presetActiveLabel:"Active: {name}",presetFormLabel:"Draft: {name}",presetTagActive:"Active",presetTagDraft:"Draft",presetTagSaved:"Saved",hintGlobalConc:"Max jobs running at once across all keys",hintPerKeyConc:"Max concurrent jobs for a single API key",hintMaxDepth:"Reject new jobs when total queue is full",hintMaxDepthKey:"Reject when this key has too many waiting/running jobs",hintFairness:"WRR shares capacity across keys; FIFO is global order by priority/time",hintLease:"How long a worker holds a job before reclaim",hintMaxWait:"Client wait timeout while queued",colJob:"Job / request",colSource:"Source",colStatus:"Status",colModel:"Model",colPri:"Pri",colKey:"API key",colTry:"Try",colTime:"Queued",stQueued:"queued",stLeased:"leased",stRunning:"running",stSucceeded:"succeeded",stFailed:"failed",stDead:"dead",stCancelled:"cancelled",srcV1:"API",srcPlayground:"Playground",kpiDepthSub:"{q} queued · {l} leased",kpiQueuedSub:"Waiting for a worker",kpiDeadSub:"Exhausted attempts",kpiOldestSub:"Head of queue wait",wait:"Wait",started:"Started",cancelReq:"Cancel requested"},chat:{title:"Chat",new:"New chat",send:"Send",stop:"Stop",stopped:"stopped",placeholder:"Message… (Enter to send, Shift+Enter newline)",keyMode:"API key",keySelect:"API key",useSessionKey:"Signed-in admin key",useCustomKey:"Custom key",customKey:"Key",includeReasoning:"Show reasoning",resume:"Resume",resumePh:"Session UUID",resumeHint:"Continue a previous text-engine session",fork:"Fork",memory:"Memory",noPlan:"No plan",permission:"Permission",effort:"Effort",effortDefault:"Default",effort_none:"None",effort_minimal:"Minimal",effort_low:"Low",effort_medium:"Medium",effort_high:"High",effort_xhigh:"X high",effort_max:"Max",tokens:"Tokens",cacheTokens:"cache",cost:"Cost",reasoning:"Thinking",needKey:"Enter or select an API key",attach:"Upload",attachLibrary:"From library",attachHint:"Drop files anywhere on this page, upload, or pick from library",dropTitle:"Drop files to attach",dropHint:"Release to upload — same formats as the attach button",formatsLabel:"Formats",formatsHint:"txt, md, csv, json, xml, html, pdf, images (png/jpg/webp/gif), code (js/ts/py/go/rs/java/c/cpp/css/yml/sql/sh…)",formatsReject:"Unsupported type: {name}. Allowed: {formats}",libraryTitle:"Previously uploaded files",librarySubtitle:"Select files owned by the current API key (same formats as upload).",librarySearch:"Search by name…",libraryEmpty:"No matching files for this key",libraryAdd:"Add selected",librarySelected:"{n} selected",libraryAlready:"Already attached",libraryLoadFail:"Could not load documents",uploading:"Uploading…",uploadFail:"Upload failed",uploadProgress:"Uploading {name}",uploadProgressMulti:"Uploading {name} ({i}/{n})",emptyTitle:"Start a conversation",emptyHint:"Send a message or attach files. Choose an image, video, or speech model to generate media in the conversation.",needContent:"Type a message or attach at least one file",needAudioAttach:"Attach an audio file to transcribe",mediaBusy_image:"Generating image…",mediaBusy_video:"Generating video…",mediaBusy_tts:"Generating speech…",mediaBusy_stt:"Transcribing…",mediaDone_image:"Image saved to the media library.",mediaDone_video:"Video saved to the media library.",mediaDone_tts:"Speech saved to the media library.",mediaDone_stt:"Transcription saved.",openInLibrary:"Open in library",modelKind_text:"Text",modelKind_image:"Image",modelKind_video:"Video",modelKind_tts:"Speech",modelKind_stt:"Transcribe",tooManyFiles:"Too many files (max 10 per message)",fileOnlyPrompt:"Please review the attached files.",removeFile:"Remove",docs:"Attachments",you:"You",assistant:"Assistant",streaming:"Streaming…",emptyReply:"(empty reply)",systemPrompt:"System prompt",systemPlaceholder:"Optional system instructions for the model…",systemHint:"Sent as a system message on every turn. Not shown in the chat bubbles.",history:"History",historyEmpty:"No saved conversations yet",historySearch:"Search topics…",historyOpen:"Show history",historyClose:"Close history",rename:"Rename",renamePh:"Conversation topic",untitled:"Untitled chat",deleteConversation:"Delete",deleteConfirm:"Delete this conversation? This cannot be undone.",saveFail:"Could not save conversation",loadFail:"Could not load conversation",historyPrev:"Previous",historyNext:"Next",historyPage:"Page {n} / {total}",msgs:"{n} messages",settings:"Settings",settingsHide:"Hide settings",compress:"Summarize for context",compressConfirm:"Generate a conversation summary for later turns? Your full chat history stays on screen. Only the model context is shortened. This uses one model call.",compressing:"Summarizing…",compressNeedMore:"Need at least 3 messages (or 2 long ones) to summarize. Continue chatting, then try again.",compressFail:"Could not create summary",compressNeedSummary:"Create a summary first (Summarize for context).",compressedBadge:"Summary",compressOk:"Summary ready — full history kept. Context mode set to summary.",compressBusy:"Wait for the current reply to finish",compressResultTitle:"Conversation summary",compressView:"View summary",summaryMeta:"Created: {when} · Based on {n} messages",ctxPolicyTitle:"Model context",ctxRemark:"Full messages stay visible. This only controls what is sent to the model next.",ctxMode:"Context",ctxModeFull:"Full history",ctxModeSummary:"Summary + recent",ctxModeRecent:"Recent only",ctxModeFullLabel:"Sending full history to the model",ctxModeSummaryLabel:"Sending summary + last {n} messages",ctxModeRecentLabel:"Sending last {n} messages only",ctxRecentN:"Recent N",ctxLongHint:"Long thread detected — consider Summary or Recent to reduce tokens and lag.",loadOlder:"Load {n} earlier messages",showMore:"Show more",showLess:"Show less",copy:"Copy",copied:"Copied",copyFail:"Copy failed"},status:{success:"success",error:"error",timeout:"timeout",pending:"pending",active:"active",finished:"finished",online:"online",stopped:"stopped"},dash:{title:"Dashboard",subtitle:"Traffic, queue, safety, and protection at a glance.",last24:"Requests (24h)",totalChat:"Total chats",success:"Success",errors:"Errors / timeout",docs:"Documents",keys:"Active keys",concurrent:"Engine concurrency",recent:"Recent API chats",empty:"No data yet",emptyModels:"No model traffic in the last 24h",updated:"Updated",refresh:"Refresh",viewAll:"View all",openDdos:"DDoS center",openSettings:"Safety",openQueue:"Open queue",kpi24h:"Requests (24h)",kpi24hSub:"{ok} ok · {err} errors",kpiSuccessRate:"Success rate (24h)",kpiSuccessRateSub:"All-time {all}%",kpiErrors:"Errors (24h)",kpiErrorsSub:"All-time {all}",kpiKeys:"API keys",kpiKeysSub:"Active / total",kpiDocs:"Documents",kpiMedia:"Media assets",kpiMediaSub:"{n} in 24h",kpiDocsSub:"Stored files",kpiConv:"Playground threads",kpiConvSub:"{n} updated in 24h",kpiSessions:"OTP sessions",kpiSessionsSub:"Active admin logins",kpiConcurrent:"Engine concurrency",kpiConcurrentSub:"Active / max slots",kpiQueue:"Chat queue",kpiQueueSub:"Depth · running / max · dead",kpiQueueSubLive:"{run}/{max} run · {dead} dead{wait}",kpiQueuePaused:"Paused",kpiQueueDrain:"Drain",kpiQueueOff:"Disabled",kpiSafe:"Global safe",kpiSafeOn:"On",kpiSafeOff:"Off",kpiSafeSub:"{tools} · turns {turns} · {model}",kpiSafeSubEmpty:"Settings unavailable",queuePanel:"Chat queue",queueState:"State",queueLive:"Live",qQueued:"Queued",qRunning:"Running",qDead:"Dead",qSucceeded:"Succeeded",qWorker:"Worker",qWorkerActive:"active slots",qOldest:"oldest wait",qUnavailable:"Queue stats unavailable",safety:"Safety settings",globalSafe:"Global safe mode",safeTools:"Tools",safeTurns:"Max turns",safeTimeout:"Timeout",defaultModel:"Default model",safetyHint:"Affects safe-mode keys and forced-safe traffic. Playground OTP sessions use agent mode unless global safe is on.",protection:"Protection",autoBan:"Auto-ban",on:"On",off:"Off",ruleAuth:"Auth",ruleRate:"429",ruleConn:"Conn",ruleVelocity:"Velocity",bans:"Blacklist",blocked:"Blocked hits",rateHits:"Rate-limit hits",liveConn:"Live connections",proxy:"Proxy IP",hops:"hops",limits:"Key/IP limits",models24h:"Models (24h)",runtime:"Runtime",port:"Listen port",defaultPort:"default",env:"Environment",authMode:"Admin auth",authOtp:"OTP session",encryption:"Encryption",ready:"Ready",notReady:"Not ready"},chats:{title:"Chat history",total:"Total",decrypt:"Open a row to view decrypted content.",search:"Search",searchPh:"Request ID, key name, model…",filterTitle:"Search & filters",filterHint:"Filter, then open a row for full detail.",status:"Status",allStatus:"All statuses",model:"Model",allModels:"All models",apiKey:"API key",allKeys:"All keys",from:"From",to:"To",mode:"Mode",allModes:"All modes",hasDocs:"Has attachments",filter:"Apply filters",reset:"Reset",request:"Request",prompt:"Prompt",response:"Response",time:"Time",attachments:"Attachments",page:"Page",prev:"Previous",next:"Next",perPage:"Per page",detail:"Chat detail",noAttach:"No attachments",openFile:"Open / preview",close:"Close",copyPrompt:"Copy prompt",copyContent:"Copy content",copySystem:"Copy system prompt",copyRawPrompt:"Copy raw prompt",duration:"Duration",stream:"Stream",reasoning:"Reasoning / thought",content:"Content (output)",raw:"Raw stored response",rawPrompt:"Raw stored prompt",userPrompt:"User / conversation prompt",systemPrompt:"System prompt",systemHint:"Extracted from the stored prompt (system role messages).",noSystem:"No system prompt in this request.",hasSystem:"Has system",none:"(none)",file:"file",img:"img",previewFailed:"Preview failed"},keys:{title:"API Keys",new:"New key",searchPh:"Name or key prefix…",name:"Name",role:"Role",mode:"Mode",rate:"Rate / min",status:"Status",created:"Created",edit:"Edit",revoke:"Revoke",confirmRevoke:"Revoke this key?",empty:"No keys",usage24:"24h use",maxTurns:"Max turns",timeoutMs:"Timeout (ms)",ipWhitelist:"IP whitelist",ipWhitelistHint:"One IP or CIDR per line. Empty = allow all IPs.",ipWhitelistCol:"IP allow",ipAll:"All IPs",keyOnce:"Store this key securely — shown once:",roleClient:"client",roleAdmin:"admin",roleClientBadge:"client",roleAdminBadge:"admin",modeSafe:"safe (external)",modeAgent:"agent (full tools)",modeSafeBadge:"safe",modeAgentBadge:"agent",ipCount:"{n} IPs",ipPlaceholder:`127.0.0.1
203.0.113.0/24`,allowedModels:"Allowed models",allowedModelsHint:"Select models this key may use. Empty = no restriction. Users list them with GET /v1/models.",allowedModelsCol:"Models",modelsAll:"All models",modelsCount:"{n} models",modelsExtra:"Additional model ids",modelsExtraHint:"One model id per line for ids not listed above.",modelsPlaceholder:"org/repo:Q4_K_M"},docs:{title:"Documents",total:"Total",file:"File",mime:"MIME",size:"Size",time:"Time",storage:"Storage",storageDb:"Database (encrypted)",storageFs:"Filesystem (encrypted)",storageHint:"Encrypted storage · DB under {dbMax}, files in {dir} · max {upMax}.",download:"Download",downloadFail:"Download failed",binaryPreview:"This is a binary file (e.g. PDF). Preview is not available — please use Download.",delete:"Delete",confirmDel:"Delete this document?",detail:"Document detail",preview:"Preview",copy:"Copy content",empty:"No documents",searchPh:"File name or MIME…",page:"Page",prev:"Previous",next:"Next"},audit:{title:"Audit logs",searchPh:"Action, resource, IP, key…",time:"Time",action:"Action",resource:"Resource",key:"Key",meta:"Meta",empty:"No logs",id:"ID",actions:{chat_create:"Chat create",document_upload:"Document upload",document_delete:"Document delete",document_list:"Document list",document_read:"Document read",document_download:"Document download",api_key_create:"API key create",api_key_update:"API key update",api_key_delete:"API key revoke",api_key_list:"API key list",settings_update:"Settings update",chat_admin_view:"Chat admin view",system_update:"System update",system_update_check:"Update check",ip_ban:"IP ban",ip_unban:"IP unban",ddos_policy_update:"DDoS policy update",pm2_start:"PM2 start",pm2_stop:"PM2 stop",pm2_restart:"PM2 restart",pm2_reload:"PM2 reload",pm2_config:"PM2 config",pm2_switch:"PM2 switch runner",playground_chat:"Playground chat",playground_upload:"Playground upload"},resources:{document:"Document",chat:"Chat",api_key:"API key",settings:"Settings",system:"System",pm2:"PM2",playground:"Playground",ip:"IP"},metaStorage:"Storage",metaAsKey:"As key id",metaAsKeyName:"As key name"},settings:{title:"Safety settings",hint:"Global safe mode for all keys.",globalSafe:"Global safe mode",globalSafeHint:"On = all keys safe. Off = each key’s own mode.",masterOn:"Safe mode on",masterOff:"Safe mode off",disabledBanner:"Global safe is off — keys use their own safe/agent mode.",tools:"Tools mode",toolsHint:"none: no shell/web/write. readonly: read/search only.",toolsNone:"none",toolsReadonly:"readonly",maxTurns:"Max turns",maxTurnsHint:"Safe-mode steps. Chat 3–6 · API 8–12 · multi-step 15–40.",timeout:"Timeout (ms)",timeoutHint:"Safe-mode deadline. 60s–120s normal · 300s–600s long jobs.",defaultModel:"Default model",defaultModelHint:"When client omits model.",modelSource:"Local engines",refreshModels:"Refresh models",panel:"Admin Panel",save:"Save",saved:"Saved",guideTitle:"Presets",guideIntro:"Apply, then tweak if needed.",guideApply:"Apply",guideActive:"Applied",guideApplyConfirm:"Apply “{name}” and save? Current values will be replaced.",guideApplied:"Preset saved",chipGlobalOn:"Safe: On",chipGlobalOff:"Safe: Off",scLocalTitle:"Local playground",scLocalDesc:"Full tools on your machine.",scLocalDetail:"Safe OFF · agent keys.",scProdTitle:"Public API",scProdDesc:"Least privilege for apps/customers.",scProdDetail:"Safe ON · tools none · turns 8–12 · 60–120s.",scCodeTitle:"Coding agent",scCodeDesc:"Trusted host only — edit & run.",scCodeDetail:"Safe OFF · agent keys.",scReadTitle:"Read-only",scReadDesc:"Explain/search code, no writes.",scReadDetail:"Safe ON · tools readonly · turns 8–15 · 120–180s.",scChatTitle:"Q&A only",scChatDesc:"Text answers, no tools.",scChatDetail:"Safe ON · tools none · turns 3–6 · 60s.",scLongTitle:"Long safe tasks",scLongDesc:"Many steps without max-turns fail.",scLongDetail:"Safe ON · none/readonly · turns 20–40 · 300–600s.",dangerTitle:"Danger zone",disablePanel:"Disable Admin Panel",disablePanelConfirm:"Disable panel and sign out? Re-enable: ysk-omni admin on",disablePanelDone:"Panel disabled. Re-enable: ysk-omni admin on",panelOffHint:"Turn off here. Re-enable on server: ysk-omni admin on",panelStatus:"Status",panelOn:"On",panelOff:"Off"},apiFeatures:{title:"API features",intro:"Toggle protocols & capabilities · applies in ~2s · no restart.",tabProtocols:"Protocols",tabMedia:"Media",tabCaps:"Capabilities",tabEmu:"Emulation",kpiEnabled:"Enabled",kpiEnabledSub:"Flags currently on",groupMeta:"{on} / {n} enabled",groupProtocols:"Protocol surfaces",groupMedia:"Media APIs (OpenAI-compatible)",groupCaps:"Engine capabilities",groupEmu:"Emulation & safety",presetOpen:"Preset: Open",presetLocked:"Preset: Locked",presetDev:"Preset: Dev",presetConfirm:"Apply feature preset “{name}”? This overwrites all API feature flags.",flag:{openaiChat:"OpenAI Chat Completions",openaiResponses:"OpenAI Responses",anthropicMessages:"Anthropic Messages",imagesApi:"Images API",filesOpenAiAlias:"Files API alias",videoApi:"Videos API (async jobs)",audioApi:"Audio API (speech / STT)",tools:"Tools / function calling",structuredOutput:"Structured output (--json-schema)",vision:"Vision / image parts (--prompt-json)",reasoningEffort:"Reasoning effort",webSearch:"Web search tools",subagents:"Subagents",planMode:"Plan mode",memory:"Cross-session memory",sessionResume:"Session resume / continue",bestOfN:"best-of-n (removed)",checkLoop:"Self-check loop (removed)",systemOverride:"System prompt override",rules:"Extra rules",permissionMode:"Permission mode",sandbox:"Sandbox profile",usageEstimate:"Estimate token usage",assistantsEmulation:"Assistants-lite (local)",strictSampling:"Strict sampling (reject temperature…)",forceDisableToolsInSafe:"Force tool limits in safe mode"},hint:{openaiChat:"POST /v1/chat/completions",openaiResponses:"POST /v1/responses",anthropicMessages:"POST /v1/messages",imagesApi:"POST /v1/images/generations + /edits (agent key)",filesOpenAiAlias:"POST/GET /v1/files → documents + media store",videoApi:"POST /v1/videos + poll GET /v1/videos/:id",audioApi:"POST /v1/audio/speech + /transcriptions (needs provider)",tools:"Maps tools to the local engine tool list",structuredOutput:"response_format / json_schema",vision:"image_url content parts",reasoningEffort:"--reasoning-effort",webSearch:"When off: --disable-web-search",subagents:"--no-subagents when off",planMode:"--no-plan when off",memory:"--experimental-memory",sessionResume:"--resume / --continue",bestOfN:"Deprecated — this flag is rejected",checkLoop:"Deprecated — this flag is rejected",systemOverride:"--system-prompt-override",rules:"--rules",permissionMode:"--permission-mode",sandbox:"--sandbox",usageEstimate:"Fill usage with char/4 estimates",assistantsEmulation:"Local /v1/assistants + /v1/threads",strictSampling:"400 if temperature/top_p/stop sent",forceDisableToolsInSafe:"Keep safe-mode tool policy"}},catalog:{title:"Catalog",intro:"Search and pull models from Hugging Face, then load a local GGUF into llama-server.",tabPacks:"Curated packs",tabLocal:"Local models",tabHub:"Hugging Face",kpiLoaded:"Loaded",kpiLoadedSub:"Engines in VRAM",kpiLoadedNone:"None loaded",kpiVram:"VRAM",kpiVramSub:"{used} / {budget} MB estimated",kpiLocal:"On disk",kpiLocalSub:"Registry entries",kpiPacks:"Packs",kpiPacksSub:"Curated catalog",filterModality:"Modality",filterAll:"All",colName:"Model",colModality:"Modality",colRuntime:"Runtime",colQuant:"Quant",colVram:"VRAM",colSize:"Size",sizeEst:"est.",colStatus:"Status",colPath:"Path",pull:"Pull",pulling:"Pulling…",pullingBanner:"Downloading {id}",dlQueue:"Download queue",dlQueued:"Queued",dlActive:"Downloading",dlDone:"Completed",dlError:"Failed",dlEta:"About {time} remaining",dlEtaCalc:"Calculating time remaining",dlSpeed:"{speed}/s",dlWaiting:"Waiting for the current download to finish",pullAgain:"Pull again",onDisk:"On disk",load:"Load",unload:"Unload",delete:"Delete",deleteConfirm:"Delete {id} from disk and the local registry?",pullSpec:"Pull a specific model",pullSpecPh:"org/repo or org/repo:Q4_K_M",pullSpecBtn:"Pull",pullSpecHint:"Paste a Hub id. This downloads weights into the local registry.",hubBrowse:"Browse Hub",hubBrowseHint:"Search models this gateway can run (llama.cpp, vLLM, diffusion, whisper).",hubSearchBtn:"Search",loaded:"Loaded",idle:"Idle",emptyPacks:"No packs in this filter",emptyLocal:"The local registry is empty — pull a model from Hugging Face",emptyLocalHint:"Open Hugging Face, search or paste org/repo, then Pull.",hubHint:"Live Hugging Face Hub REST API (/api/models). Paginated with Link cursors. There is no RSS/Atom feed for the model index.",hubSearch:"Search Hub",hubSearchPh:"Qwen, llama, flux, whisper…",hubEmpty:"No Hub results",hubMore:"Load more",hubLoading:"Loading…",downloads:"Downloads",unsupported:"No local runtime",hubFail:"Hub search failed",sync:"Sync popular",syncing:"Syncing…",syncOk:"Synced {n} popular GGUF models",syncAt:"Last sync {when}",syncHint:"Adds the 50 most-downloaded GGUF ids to the list. This does not download files; Pull a row to fetch weights.",noQuant:"—",pullFail:"Pull failed",pullNoGguf:"No GGUF file in this repository. It was not added to local models.",loadFail:"Load failed",unloadFail:"Unload failed",mod:{text:"Text",image:"Image",video:"Video",tts:"Speech",stt:"Transcribe"}},runtimes:{title:"Runtimes",intro:"Install or uninstall inference engines on this host. One-click runs Homebrew, pip, winget, or Docker for this OS. The gateway does not use sudo.",kpiInstalled:"Ready",kpiMissing:"Not installed",kpiHost:"This host",kpiArch:"Architecture",filterOs:"Operating system",filterHost:"This host",filterAll:"All systems",osMac:"macOS",osLinux:"Linux",osWin:"Windows",filterMod:"Modality",statusInstalled:"Installed",statusConfigured:"URL configured",statusMissing:"Not installed",statusUnsupported:"Not for this OS",supportFull:"Supported",supportPartial:"Partial",supportNone:"Not supported",copyCmd:"Copy install command",install:"Install",reinstall:"Reinstall",installing:"Installing…",installDone:"Installed",installFail:"Install failed",installLog:"Install log",uninstall:"Uninstall",uninstalling:"Uninstalling…",uninstallDone:"Uninstalled",uninstallFail:"Uninstall failed",uninstallConfirm:"This will run the package manager to remove {name}. The gateway does not use sudo.",docs:"Documentation",refresh:"Re-scan PATH",path:"Detected",cmdFor:"Install on {os}",empty:"No runtimes match this filter",llamacpp:"Local GGUF text via llama-server",vllm:"High-throughput GPU serving for Hugging Face safetensors",mlx:"Native Apple Silicon text (mlx_lm.server)",ollama:"Convenient GGUF runner with an OpenAI /v1 port",ffmpeg:"Media transcode and playable video fixtures",whisper:"Speech-to-text worker (OpenAI transcriptions)",kokoro:"Text-to-speech worker (OpenAI speech)",comfy:"Image and video worker behind an OpenAI-compat adapter"},media:{title:"Media library",intro:"Studio, assets, and video jobs. Needs imagesApi / tools (videoApi for video).",tabStudio:"Studio",tabAssets:"Assets",tabJobs:"Jobs",kpiAssetsSub:"Stored media files",kpiJobsSub:"Video generation jobs",kpiStudioSub:"Generate, edit, or image-to-video",assets:"Assets",jobs:"Video jobs",empty:"No media assets yet",jobsEmpty:"No video jobs yet",kind:"Kind",bytes:"Size",provider:"Provider",providerPh:"Provider name…",prompt:"Prompt",created:"Created",status:"Status",preview:"Preview",previewUnsupported:"This format cannot be previewed in the browser. Please download the file.",previewFail:"Failed to load preview",previewTruncated:"preview truncated",download:"Download",delete:"Delete",deleteConfirm:"Soft-delete this media asset?",allKinds:"All kinds",searchPh:"Prompt, filename, MIME, provider, or ID…",from:"From",to:"To",generate:"Generate image",generateTitle:"Generate image",studioTitle:"Media studio",studioHint:"Create images, speech, transcriptions, edit images, or start video jobs. Execution limits follow Safety settings. Requires imagesApi and tools (audioApi for speech/transcription, videoApi for video).",generateHint:"Uses the local media worker (image, speech, transcription, video).",generatePrompt:"Prompt",generatePromptPh:"Describe the image you want to create…",generateSize:"Size",aspectRatio:"Aspect ratio",aspectHint:"aspect_ratio values (not OpenAI pixel sizes)",generateN:"Count",outputFormat:"File format",outputFormatHint:"The gateway converts automatically after generation",nHint:"The gateway runs sequential generations (1–4)",generateKey:"API key",generateKeySession:"Signed-in admin session",generateSubmit:"Generate",generateBusy:"Generating… this may take a minute",generateOk:"Image generated. See the assets list below.",generateFail:"Image generation failed",generateNeedPrompt:"Please enter a prompt",modeGenerate:"Generate",modeEdit:"Edit",modeVideo:"Video",modeSpeech:"Speech",modeTranscribe:"Transcribe",speechSubmit:"Generate speech",speechBusy:"Synthesizing speech…",speechOk:"Speech saved. See the assets list.",speechPromptPh:"Text to speak…",transcribeSubmit:"Transcribe",transcribeBusy:"Transcribing…",transcribeOk:"Transcription saved. See the assets list.",transcribeNeedAudio:"Select or drop an audio file to transcribe",dropTitleAudio:"Drop an audio file here",dropHintAudio:"WAV, MP3, M4A, OGG, or FLAC",sourceNeedAudio:"Please provide an audio file",libraryFormatsAudio:"Audio only (WAV, MP3, M4A, OGG, FLAC…)",modelDefault:"system default",modelEmpty:"No local models reported",modelHint:"All local registry models; system default is pre-selected",editSubmit:"Edit image",editBusy:"Editing…",editOk:"Image edited. See the assets list below.",editNeedImage:"Select or drop a source image to edit",editImage:"Source image",editImageHint:"Required for image_edit",editPromptPh:"Describe the changes to apply…",videoSubmit:"Create video job",videoBusy:"Queuing video job…",videoOk:"Video job queued. See the Jobs tab.",videoVoice:"Voice",videoVoiceNone:"No speech",videoVoiceHint:"Optional preset voice — uses reference_to_video",videoDuration:"Duration",videoDurationHint:"Video duration: 1–15 seconds",videoSource:"Source frame (optional)",videoSourceHint:"Optional. If omitted, a frame is generated from the prompt first, then animated.",videoNoSource:"Auto-generate frame from prompt",videoPromptPh:"Describe camera motion and the shot…",sourceTitle:"Source image",sourceHint:"Drag and drop an image, choose a local file, or pick any image from Documents or Media assets.",dropzoneAria:"Drop zone for source image",dropTitle:"Drop an image here",dropHint:"Or choose a local file / pick from the system library",dropTitleVideo:"Drop a source frame (optional)",dropHintVideo:"Optional for video. Empty source generates a frame from the prompt first.",pickFile:"Choose file",pickLibrary:"System library",clearSource:"Clear",sourceNeedImage:"Please provide an image file (PNG, JPEG, WebP, GIF…)",sourceKindUpload:"Upload",sourceKindAsset:"Media asset",sourceKindDocument:"Document",libraryTitle:"Select source file",librarySubtitle:"Any image stored in Documents or Media assets on this gateway.",libraryTabDocs:"Documents",libraryTabAssets:"Media assets",librarySearch:"Search by name, MIME, or ID…",libraryFormats:"Images only (PNG, JPEG, WebP, GIF, …)",libraryEmpty:"No matching files",librarySelect:"Use selected",libraryLoadFail:"Failed to load library"},usage:{title:"Usage & anti-abuse",window:"Window",requests:"Requests",success:"Success",errors:"Errors",errorRate:"Error rate",byModel:"By model",byKey:"Per API key",rateLimit:"Limit / min",util:"Est. utilization",lastUsed:"Last used",limits:"Gateway limits",global:"Global max / window",ipMax:"Unauth IP max",burst:"Chat burst (10s)",block:"Auth fail block threshold",concurrent:"Max concurrent engines",refresh:"Refresh"},ddos:{title:"DDoS control center",tabPolicy:"Policy",tabLive:"Traffic",tabBlacklist:"Blacklist",tabEvents:"Events",live:"Live connections",recent:"Recent requests",blacklist:"IP blacklist",stats:"Abuse stats",refresh:"Refresh",pause:"Pause auto-refresh",resume:"Resume auto-refresh",ban:"Ban IP",unban:"Unban",banConfirm:"Ban this IP?",banWhitelistWarn:"This IP is on the auto-ban whitelist. Ban anyway?",unbanConfirm:"Remove this IP from blacklist?",ip:"IP",method:"Method",path:"Path",key:"API key",duration:"Duration",state:"State",ua:"User-Agent",reason:"Reason",source:"Source",expires:"Expires",permanent:"Permanent",addBan:"Add ban",ttl:"TTL",ttlPerm:"Permanent",ttl1h:"1 hour",ttl24h:"24 hours",ttl7d:"7 days",activeConn:"Active",rateHits:"Rate-limit hits",blockedHits:"Blocked hits",autoBans:"Auto bans",topIps:"Top IPs (recent)",emptyLive:"No active connections",emptyBan:"Blacklist is empty",emptyEvents:"No auto-ban events yet",reasonPh:"Optional reason",banReasonDefault:"manual from admin",ipPlaceholder:"1.2.3.4",policyTitle:"Protection policy",policyHint:"All thresholds are live — no restart. Env values are only the initial defaults.",autoOn:"Auto-judgment ON",autoOff:"Auto-judgment OFF",autoBanMaster:"Enable automatic IP bans",autoBanMasterHint:"When off, rate limits still apply but IPs are never auto-banned.",masterOn:"Auto-ban on",masterOff:"Auto-ban off",disabledBanner:"Automatic IP bans are off — rate limits still apply, but IPs will not be auto-blacklisted.",presetTitle:"Policy profile",presetHint:"Pick a profile or edit fields — custom is detected automatically.",presetRelaxed:"Relaxed",presetBalanced:"Balanced",presetStrict:"Strict",presetCustom:"Custom",presetActiveLabel:"Active: {name}",presetFormLabel:"Form: {name} (unsaved)",presetTagActive:"Active",presetTagDraft:"Draft",presetTagSaved:"Saved",presetActiveHint:"Current profile: {name}. Click Save if you changed other fields.",presetCustomHint:"Values do not match Relaxed / Balanced / Strict — treated as Custom.",presetUnsavedHint:"Form shows {form}; server still has {saved}. Click Save policy to apply.",savePolicy:"Save policy",resetPolicy:"Reset to env defaults",policySaved:"Protection policy saved. Rate limiters reloaded.",policyReset:"Policy reset to environment defaults.",confirmReset:"Reset all DDoS policy fields to .env defaults?",sectionProxy:"Reverse proxy / CDN",proxyHint:"When traffic passes through nginx or Cloudflare, enable trust hops so bans, rate limits, and audit logs use the real client IP — not the proxy IP.",proxyTrustHops:"Trusted proxy hops",proxyTrustHopsHint:"0 = direct only (ignore headers). 1 = nginx or Cloudflare→app. 2 = Cloudflare→nginx→app.",proxyIpSource:"Client IP source",proxyIpSourceHint:"auto tries CF-Connecting-IP, then X-Real-IP, then X-Forwarded-For. Use “socket” only for direct connections.",proxySrcAuto:"Auto (recommended)",proxySrcCf:"Cloudflare (CF-Connecting-IP)",proxySrcNginx:"nginx (X-Real-IP)",proxySrcXff:"X-Forwarded-For only",proxySrcSocket:"TCP socket only (no proxy)",trustedProxies:"Trusted proxy IPs / CIDRs",trustedProxiesHint:"Only these peers may set CF-Connecting-IP / X-Real-IP / XFF. Default 127.0.0.1 — add your nginx/LB host if remote. Direct clients cannot spoof headers.",sectionLimits:"Rate limits",sectionAuth:"Failed authentication",sectionRate:"Rate-limit abuse (429)",sectionConn:"Connection flood",sectionVelocity:"Request velocity",sectionEscalate:"Repeat offender escalation",sectionWhitelist:"Auto-ban whitelist",whitelistHint:"One IP or CIDR per line. These IPs are never auto-banned.",rateWindow:"Window (sec)",rateMaxKey:"Max / key",rateMaxIp:"Max / IP (no key)",burstWindow:"Burst window (sec)",burstMax:"Burst max",enableRule:"Enabled",threshold:"Threshold",windowSec:"Window (sec)",banMin:"Ban duration (min)",escalateAfter:"Escalate after N auto-bans",escalateMin:"Escalated ban (min)",maxConcurrent:"Max concurrent / IP",velocityMax:"Max requests",eventsTitle:"Recent auto-ban events",eventTime:"When",eventSource:"Rule",eventDuration:"Ban for",sources:{manual:"Manual","auto-auth":"Auto · auth","auto-rate":"Auto · 429","auto-conn":"Auto · concurrent","auto-velocity":"Auto · velocity","auto-escalate":"Auto · escalated"}},pm2:{title:"PM2 control",tabRunner:"Runner",tabPort:"Port",tabConfig:"Config",tabLogs:"Logs",status:"Process status",start:"Start with PM2",stop:"Stop PM2",restart:"Restart",reload:"Reload",logs:"Logs",logsHint:"Error log first",clearLogs:"Clear logs",confirmClearLogs:"Clear PM2 and ysk-omni log files? This cannot be undone (files are truncated).",logsCleared:"Cleared {n} log file(s).",logsAutoTrim:"Auto-trim over {maxMb} MB → keep last ~{keepKb} KB (on each log read).",refresh:"Refresh",confirmStop:"Stop the PM2 process?",confirmRestart:"Restart under PM2? Port will be handed over cleanly.",unavailable:"PM2 not available",disabled:"PM2 admin is disabled",app:"App name",pid:"PID",uptime:"Uptime",memory:"Memory",cpu:"CPU",restarts:"Restarts",portBusy:"Port in use",port:"Port",portTitle:"Listen port",portHint:"HTTP port for the gateway Admin UI and API. Changing the port updates .env and restarts the runner so the new port takes effect.",fieldPort:"Port",portDefaultNote:"Default is 3850. Valid range: 1–65535.",savePort:"Save port & restart",useDefaultPort:"Use default (3850)",portInvalid:"Enter a valid port number (1–65535).",confirmPortChange:"Change listen port to {port} and restart the gateway? You will need to open Admin on the new port (e.g. http://localhost:{port}/admin).",portChangedMsg:"Port updated: {from} → {to}.",portSavedNeedRestart:"Port {port} saved to .env. Restart the gateway for it to take effect.",portAfterRestart:"After restart, open Admin at http://localhost:{port}/admin",hint:"Run with PM2 or detached ysk-omni. Switch anytime here or via CLI.",switchTitle:"Runner",switchHint:"Only one runner should bind the port.",currentRunner:"Current runner",runnerPm2:"PM2",runnerGctoac:"ysk-omni (detached)",runnerNone:"Not running",runnerUnknown:"Unknown / mixed",switchToPm2:"Switch to PM2",switchToGctoac:"Switch to ysk-omni",confirmSwitchPm2:"Switch to PM2? Gateway restarts under PM2 in a few seconds.",confirmSwitchGctoac:"Switch to ysk-omni? Gateway restarts as a detached process in a few seconds.",switchScheduled:"Switch scheduled. Admin will refresh automatically in about 10 seconds.",autoRefreshIn:"This page will reload automatically in {n} seconds…",autoRefreshNow:"Reloading…",omniPid:"ysk-omni PID",configTitle:"PM2 config",configHint:"Saved to pm2.runtime.json and applied via ecosystem.config.cjs. Save & apply restarts PM2 if it is the active runner.",saveConfig:"Save & apply",saveOnly:"Save only",resetConfig:"Reset defaults",confirmReset:"Reset PM2 config to defaults?",configSaved:"Config saved",fieldName:"App name",fieldScript:"Script",fieldCwd:"Working directory (cwd)",fieldInstances:"Instances",fieldExecMode:"Exec mode",fieldAutorestart:"Autorestart",fieldWatch:"Watch",fieldMaxMem:"Max memory restart",fieldMaxRestarts:"Max restarts",fieldMinUptime:"Min uptime",fieldRestartDelay:"Restart delay (ms)",fieldBackoff:"Exp backoff restart delay (ms)",fieldMergeLogs:"Merge logs",fieldTime:"Log timestamps",fieldErrorFile:"Error log file",fieldOutFile:"Out log file",fieldEnvExtra:"Extra env (KEY=value per line)",fieldPreferred:"Preferred runner",empty:"App not in pm2 list",modeFork:"fork",modeCluster:"cluster",phCwd:"(package root)",phInstances:"1 or max",phEnv:"NODE_ENV=production",statusOnline:"online",statusErrored:"errored",statusStopped:"stopped",msgOk:"OK",msgDisabled:"PM2 admin is disabled (PM2_ADMIN_ENABLED=false).",msgBinaryMissing:"pm2 not found on PATH. Install: npm install -g pm2",msgNotInList:'App "{app}" is not in the PM2 list — use Start with PM2 or Switch to PM2.',msgPortGctoac:"Port {port} is held by ysk-omni (pid {pid}). Use “Switch to PM2” to hand over.",msgPortBusy:"Port {port} is in use (pid {pids}).",msgErrored:"PM2 process errored — check logs / config, then Restart or fix port conflicts.",msgBothRunners:"Both runners detected; ysk-omni pid {pid} also holds resources. Prefer one via Switch.",msgError:"PM2 error: {error}",msgSwitchPm2:"Switching to PM2… The gateway will restart under PM2 in a few seconds.",msgSwitchGctoac:"Switching to ysk-omni… The gateway will restart as a detached process in a few seconds."},system:{title:"System",tabSoftware:"Software",tabSessions:"Local sessions",sessionsHint:"Local engine sessions on this machine (not gateway chat logs).",sessionsSearch:"Search title, summary, or id…",sessionDelete:"Delete",sessionDeleteConfirm:"Permanently delete session {id}? This cannot be undone.",sessionId:"Session",sessionTitle:"Title",sessionCwd:"cwd",sessionUpdated:"Updated",tabPackage:"Package",tabEnv:"Environment",envHint:"Runtime env & version snapshot.",checkUpdate:"Check for updates",oneClick:"Update package & restart",selfUpdate:"Package version",selfHint:"Compare versions · update package restarts the gateway.",current:"This install",npm:"npm latest",github:"GitHub latest",install:"Install channel",confirmUpdate:"Update the package and restart the gateway? API will be briefly unavailable.",scheduled:"Update scheduled. Refresh this page in ~30s.",database:"Database",grokCli:"Legacy CLI (removed)",grokInspect:"Legacy leftover",grokInspectHint:"Import leftover. The gateway does not spawn an external CLI; local engines are llama-server / vLLM.",grokVersion:"Engine version",inspectChannel:"Channel",inspectDefaultModel:"Default model",inspectModels:"Models",inspectSkills:"Skills",inspectMcp:"MCP servers",inspectPlugins:"Plugins",inspectHooks:"Hooks",concurrency:"Concurrency",runtime:"Runtime health",software:"Required software",softwareHint:"Required tools and installed versions.",softName:"Software",softLevel:"Need",softInstalled:"Installed",softVersion:"Version",softStatus:"Status",softDetail:"Note",levelRequired:"Required",levelRecommended:"Recommended",levelOptional:"Optional",levelBundled:"Bundled",softOk:"OK",softMissing:"Missing",softWarn:"Warning",envTitle:"Environment",up:"Up",down:"Down",yes:"Yes",no:"No",badgeUpdate:"Update available",badgeOk:"Up to date",badgeAhead:"Newer than npm",badgeUnknown:"Unknown",statusHintUpdate:"A newer published version is available. Use “Update package & restart”.",statusHintOk:"This install matches the latest known release.",statusHintAhead:"Local version is newer than npm (typical for git / dev). “Update package” still pulls latest git commits if on the git channel.",statusHintUnknown:"Could not reach npm/GitHub to compare versions.",checkResult:"Version check",channelGit:"git (dev tree)",channelNpmGlobal:"npm global",channelNpmLocal:"npm local",channelUnknown:"unknown",encryption:"Encryption",ready:"Ready",notReady:"Not ready",allRequiredOk:"All required software present",requiredMissing:"Some required software is missing"},support:{title:"Support",subtitle:"Creator, sponsors, and YSK Limited — free product, real help",pillSupport:"Support",pillSponsor:"Sponsor · Linktree",pillHelp:"Questions? email@ysk.hk",creatorTitle:"Creator",creatorBody:"This OpenAI-compatible gateway is a free open-source product for running local models as an API. The project is maintained in the open; your feedback and bug reports matter.",sponsorTitle:"Support / sponsor",sponsorBody:"If this gateway saves you time, consider sponsoring development. Every bit helps keep it free for everyone.",githubSponsors:"GitHub Sponsors",linktree:"Linktree",walletsTitle:"Crypto / Web3 addresses",walletsHint:"Send only on the matching network. Double-check the address before you transfer.",net:"Network",addr:"Address",copy:"Copy",netEvm:"EVM (ETH/BSC/AVAX)",netNear:"NEAR",netAda:"ADA (Cardano)",yskTitle:"YSK Limited",yskBody:"Need hands-on help beyond the free Admin panel? YSK Limited can provide:",yskLi1:"Server install, hardening, and day-to-day ops",yskLi2:"Hosting stack (web, email, DNS, databases)",yskLi3:"Migration, automation, and custom integration",yskLi4:"Incident response and go-live checks",yskPrice:"No public price list — email us and we will scope it to your setup.",site:"ysk.hk",helpTitle:"Have a problem?",helpBody:"Email with OS, install / log path, and expected vs actual result. Every message is read.",docs:"Full docs are in the repo README"},common:{empty:"No data",active:"active",revoked:"revoked",save:"Save",cancel:"Close",loading:"Loading…",powered:"Powered by",actions:"Actions",yes:"Yes",no:"No",ok:"OK",confirm:"Confirm",notice:"Notice",confirmTitle:"Please confirm",dangerTitle:"Confirm action",apply:"Apply",reset:"Reset",search:"Search",prev:"Previous",next:"Next",perPage:"Per page",pagerTotal:"Total {n}",pagerPage:"Page {n} / {total}",filterTitle:"Search & filters",filterHint:"Narrow results, then apply",sortHint:"Click to sort (API). Default: newest first",all:"All",requestFailed:"Request failed",featureOff:"Off",ms:"{n} ms",perMin:"{n}/min",minutes:"{n} min",mb:"{n} MB",percent:"{n}%",ipLabel:"IP",uaLabel:"UA",httpStatus:"HTTP"},errors:{unauthorized:"Invalid or missing credentials. Please sign in again.",forbidden:"You do not have permission for this action.",not_found:"The requested resource was not found.",validation_error:"Invalid request. Please check your input.",rate_limit_exceeded:"Rate limit exceeded. Please try again later.",concurrency_limit_exceeded:"Too many concurrent engine jobs. Please wait and retry.",internal_error:"An internal server error occurred.",grok_error:"The local engine returned an error.",grok_timeout:"The local engine timed out.",grok_not_available:"No local engine is available on this server.",document_too_large:"The document exceeds the maximum allowed size.",document_type_not_allowed:"This document type is not allowed.",invalid_cwd:"The working directory is not allowed.",service_unavailable:"The service is temporarily unavailable.",queue_full:"The chat queue is full. Please try again later.",queue_draining:"The chat queue is paused or draining.",queue_wait_timeout:"Timed out while waiting in the chat queue.",queue_cancelled:"The chat job was cancelled.",media_not_supported:"This media feature is not available or is disabled.",media_provider_unavailable:"The media provider is not available.",media_generation_failed:"Media generation failed.",media_forbidden:"Media generation is not allowed for this API key. Use an agent-mode key or an admin session.",feature_disabled:"This API feature is disabled.",feature:{imagesApi:"Images API is disabled. Enable it under Admin → API features → Images API.",videoApi:"Video API is disabled. Enable it under Admin → API features → Videos API.",audioApi:"Audio API is disabled. Enable it under Admin → API features → Audio API.",tools:"Tools are disabled. Enable Tools under Admin → API features (required for image generation).",filesOpenAiAlias:"OpenAI Files API alias is disabled. Enable it under Admin → API features → Files API alias."},media:{agent_or_admin_required:"Image generation requires an agent-mode API key or an admin session. Safe-mode keys cannot use image tools.",source_required:"Provide an image file, a media asset, or a document as the source.",source_must_be_image:"The selected source must be an image for edit or video generation.",no_image_in_sandbox:"Generation finished but no image file was found. This is not an imagesApi or API-key problem.",no_video_in_sandbox:"Generation finished but no video file was found.",provider_no_edit:"The current media provider does not support image edits."}}},"zh-Hant":{brand:"YSK Omni",brandSub:"管理面板",loginTitle:"管理員登入",loginLabel:"API 金鑰",loginOtpLabel:"一次性登入碼",loginBtn:"登入",loginCmdHint:"請於終端機取得金鑰：",loginOtpHint:"每次登入請在終端機產生新碼：",loginOtpExpiry:"登入碼 5 分鐘內有效，且只能使用一次。",loginOtpFail:"登入碼無效或已過期",loginLostKey:"舊金鑰無法找回（系統只儲存雜湊），請建立新的管理員金鑰。",loginCopy:"複製",loginCopied:"已複製",needKey:"請輸入 API 金鑰",needOtp:"請輸入終端機產生的一次性登入碼",logout:"登出",shell:{menu:"開啟選單",closeMenu:"關閉選單"},nav:{dashboard:"儀表板",chat:"對話",chats:"對話記錄",keys:"API 金鑰",documents:"文件",media:"媒體庫",catalog:"目錄",runtimes:"執行環境",audit:"審計日誌",settings:"安全設定",apiFeatures:"API 能力",usage:"用量與防護",ddos:"DDoS 中心",queue:"佇列",pm2:"PM2",system:"系統狀態",support:"支援"},queue:{title:"對話佇列",subtitle:"暫停、排空、重新入隊，並調整併發。",paused:"已暫停",running:"消費中",drain:"排空模式",mode:"模式",modeOff:"已停用",depth:"佇列深度",queued:"排隊中",leased:"已認領",activeJobs:"執行中",dead:"死信",oldest:"最長等待",concurrency:"每 Key / 全域",worker:"進程內 worker",workerInstance:"Worker 實例",workerInstanceHint:"本進程消費者 ID（租約持有者）。重啟後會變更。",kpiActiveSub:"本進程進行中 {n} 個",consumer:"消費者",admission:"接單",accepting:"接受新單",pause:"暫停消費",resume:"恢復消費",drainBtn:"排空",undrain:"停止排空",savePolicy:"儲存政策",refresh:"重新整理",jobs:"工作列表",tabOverview:"總覽",tabJobs:"工作列表",tabPolicy:"政策",jobsMeta:"共 {n} 筆",cancel:"取消",requeue:"重新入隊",purgeDead:"清理死信與舊工作",purgeTitle:"確認清理工作？",purgeConfirm:"會立即刪除全部死信（DLQ），以及完成已超過 24 小時的成功／失敗／取消工作。",purgeConfirmBtn:"確認刪除",purgeDoneTitle:"清理完成",purgeDoneMsg:"已刪除 {n} 筆工作。",cancelConfirm:"取消此工作？若正在執行，取消為協作式（cooperative）。",empty:"沒有符合篩選的工作",enabled:"啟用佇列",masterOn:"佇列已開",masterOff:"佇列已關",masterHint:"對話佇列總開關，即時生效。",disabledBanner:"佇列已關閉 — 新對話會跳過排隊、即時執行（仍受併發上限約束）。",globalConcurrency:"全域併發",perKeyConcurrency:"每 Key 併發",maxDepth:"全域佇列上限",maxDepthKey:"每 Key 上限",fairness:"公平策略",fifo:"全域 FIFO",wrr:"加權輪詢",playgroundPriority:"Playground 優先級（越小越先）",defaultPriority:"預設優先級",leaseMs:"租約（ms）",maxWaitMs:"最長等待（ms）",filterTitle:"篩選工作",filterHint:"依狀態篩選。會自動重新整理。",filterStatus:"狀態",allStatuses:"全部狀態",filterDead:"死信（DLQ）",filterQueued:"排隊中",filterRunning:"執行中 / 已認領",filterFailed:"失敗",filterSucceeded:"成功",filterCancelled:"已取消",errorCol:"錯誤",priorityBtn:"優先級",priorityPh:"優先級（0–1000，越小越先）",dlqTitle:"死信佇列",dlqHint:"已用盡重試次數 — 可重新入隊或清理。",viewDlq:"查看死信",statusPanel:"運行狀態",statusPanelHint:"消費者、接單與 worker 實例即時狀態；每隔數秒自動重新整理。",policyTitle:"佇列政策",policyHint:"可先選方案再微調數值；儲存後生效。編輯時會暫停自動重新整理。",presetTitle:"政策方案",presetHint:"一鍵套用。Active＝表單目前值 · Saved＝已儲存。",presetRelaxed:"寬鬆",presetBalanced:"均衡",presetStrict:"嚴格",presetCustom:"自訂",presetRelaxedHint:"較高併發、較深佇列 — 適合多 key／Playground 與突發流量。",presetBalancedHint:"預設生產平衡：公平輪詢、中等深度、每 key 同時只跑 1 個。",presetStrictHint:"較低上限 + 全域 FIFO — 流量不可信或主機資源緊張時使用。",presetCustomHint:"數值不符合內建方案。可繼續微調，或於上方選取一個方案。",presetActiveLabel:"目前：{name}",presetFormLabel:"草稿：{name}",presetTagActive:"目前",presetTagDraft:"草稿",presetTagSaved:"已套用",hintGlobalConc:"全域同時執行的工作上限",hintPerKeyConc:"單一 API key 同時執行上限",hintMaxDepth:"佇列總深度滿時拒收新單",hintMaxDepthKey:"該 key 排隊／執行過多時拒收",hintFairness:"WRR 按 key 輪流；FIFO 按全域優先級與時間",hintLease:"Worker 持有工作多久未完成會被回收",hintMaxWait:"客戶端排隊最長等待時間",colJob:"工作 / 請求",colSource:"來源",colStatus:"狀態",colModel:"模型",colPri:"優先",colKey:"API 金鑰",colTry:"嘗試",colTime:"入隊時間",stQueued:"排隊",stLeased:"已認領",stRunning:"執行中",stSucceeded:"成功",stFailed:"失敗",stDead:"死信",stCancelled:"已取消",srcV1:"API",srcPlayground:"Playground",kpiDepthSub:"{q} 排隊 · {l} 認領",kpiQueuedSub:"等待 worker",kpiDeadSub:"重試已盡",kpiOldestSub:"隊頭等待時間",wait:"等待",started:"開始",cancelReq:"已請求取消"},chat:{title:"對話",new:"新對話",send:"傳送",stop:"停止",stopped:"已停止",placeholder:"輸入訊息…（Enter 傳送，Shift+Enter 換行）",keyMode:"API 金鑰",keySelect:"API 金鑰",useSessionKey:"目前登入的 admin 金鑰",useCustomKey:"自訂金鑰",customKey:"金鑰",includeReasoning:"顯示思考",resume:"繼續 session",resumePh:"Session UUID",resumeHint:"接續先前文字引擎 session",fork:"Fork",memory:"記憶",noPlan:"關 plan",permission:"權限",effort:"推理力度",effortDefault:"預設",effort_none:"無",effort_minimal:"最低",effort_low:"低",effort_medium:"中",effort_high:"高",effort_xhigh:"極高",effort_max:"最大",tokens:"Tokens",cacheTokens:"快取",cost:"費用",reasoning:"思考過程",needKey:"請輸入或選擇 API 金鑰",attach:"上傳",attachLibrary:"從已上傳選擇",attachHint:"可於本頁任意位置拖放檔案、上傳，或從已上傳庫挑選",dropTitle:"放開以附加檔案",dropHint:"放開即上傳 — 格式與「上傳」按鈕相同",formatsLabel:"格式",formatsHint:"txt、md、csv、json、xml、html、pdf、圖片（png/jpg/webp/gif）、程式碼（js/ts/py/go/rs/java/c/cpp/css/yml/sql/sh…）",formatsReject:"不支援的格式：{name}。允許：{formats}",libraryTitle:"已上傳的檔案",librarySubtitle:"選擇目前 API 金鑰名下的檔案（格式與上傳相同）。",librarySearch:"依檔名搜尋…",libraryEmpty:"此金鑰沒有符合的檔案",libraryAdd:"加入所選",librarySelected:"已選 {n} 個",libraryAlready:"已附加",libraryLoadFail:"無法載入檔案列表",uploading:"上傳中…",uploadFail:"上傳失敗",uploadProgress:"正在上傳 {name}",uploadProgressMulti:"正在上傳 {name}（{i}/{n}）",emptyTitle:"開始對話",emptyHint:"輸入訊息或附加檔案。選擇圖像、影片或語音模型即可在對話中生成媒體。",needContent:"請輸入訊息或至少附加一個檔案",needAudioAttach:"請附加音訊檔以進行轉錄",mediaBusy_image:"正在生成圖像…",mediaBusy_video:"正在生成影片…",mediaBusy_tts:"正在合成語音…",mediaBusy_stt:"正在轉錄…",mediaDone_image:"圖像已儲存至媒體庫。",mediaDone_video:"影片已儲存至媒體庫。",mediaDone_tts:"語音已儲存至媒體庫。",mediaDone_stt:"轉錄已儲存。",openInLibrary:"在媒體庫開啟",modelKind_text:"文字",modelKind_image:"圖像",modelKind_video:"影片",modelKind_tts:"語音",modelKind_stt:"轉錄",tooManyFiles:"檔案太多（每則訊息最多 10 個）",fileOnlyPrompt:"請查看附加的檔案。",removeFile:"移除",docs:"附件",you:"你",assistant:"助理",streaming:"串流中…",emptyReply:"（無回覆內容）",systemPrompt:"系統提示",systemPlaceholder:"可選：模型系統指示（system 訊息）…",systemHint:"每次傳送會以 system 角色附帶，不會顯示於對話氣泡。",history:"歷史對話",historyEmpty:"尚未有已儲存的對話",historySearch:"搜尋主題…",historyOpen:"顯示歷史",historyClose:"關閉歷史",rename:"重新命名",renamePh:"對話主題",untitled:"未命名對話",deleteConversation:"刪除",deleteConfirm:"確定刪除此對話？此操作無法還原。",saveFail:"無法儲存對話",loadFail:"無法載入對話",historyPrev:"上一頁",historyNext:"下一頁",historyPage:"第 {n} / {total} 頁",msgs:"{n} 則訊息",settings:"設定",settingsHide:"收起設定",compress:"產生語境摘要",compressConfirm:"為之後回合產生對話摘要以節省 token？畫面上的完整對話記錄不會被刪除或改寫，只影響傳送給模型的內容。此操作會呼叫模型一次。",compressing:"正在產生摘要…",compressNeedMore:"至少需要 3 則訊息（或 2 則較長內容）才可產生摘要。請先繼續對話再試。",compressFail:"無法產生摘要",compressNeedSummary:"請先按「產生語境摘要」建立摘要。",compressedBadge:"摘要",compressOk:"摘要已就緒（完整記錄仍保留）。已切換為「摘要 + 最近訊息」模式。",compressBusy:"請等待目前回覆完成",compressResultTitle:"對話摘要",compressView:"查看摘要",summaryMeta:"產生時間：{when} · 依據 {n} 則訊息",ctxPolicyTitle:"模型上下文",ctxRemark:"完整訊息仍顯示於對話區。此設定只控制下一次傳送給模型的內容。",ctxMode:"上下文",ctxModeFull:"完整記錄",ctxModeSummary:"摘要 + 最近",ctxModeRecent:"僅最近",ctxModeFullLabel:"目前送出完整對話記錄",ctxModeSummaryLabel:"目前送出摘要 + 最近 {n} 則",ctxModeRecentLabel:"目前只送出最近 {n} 則",ctxRecentN:"最近則數",ctxLongHint:"對話較長 — 建議改用「摘要 + 最近」或「僅最近」，以減少 token 並避免介面卡頓。",loadOlder:"載入較早的 {n} 則訊息",showMore:"顯示更多",showLess:"收合",copy:"複製",copied:"已複製",copyFail:"複製失敗"},status:{success:"成功",error:"錯誤",timeout:"逾時",pending:"處理中",active:"進行中",finished:"已完成",online:"運行中",stopped:"已停止"},dash:{title:"儀表板",subtitle:"流量、佇列、安全與防護一覽。",last24:"最近 24h 請求",totalChat:"總對話",success:"成功",errors:"錯誤/逾時",docs:"文件",keys:"活躍金鑰",concurrent:"引擎併發",recent:"最近 API 請求",empty:"暫無資料",emptyModels:"最近 24h 尚無模型用量",updated:"更新於",refresh:"重新整理",viewAll:"查看全部",openDdos:"DDoS 中心",openSettings:"安全設定",openQueue:"開啟佇列",kpi24h:"請求（24h）",kpi24hSub:"{ok} 成功 · {err} 錯誤",kpiSuccessRate:"成功率（24h）",kpiSuccessRateSub:"全部時間 {all}%",kpiErrors:"錯誤（24h）",kpiErrorsSub:"全部時間 {all}",kpiKeys:"API 金鑰",kpiKeysSub:"活躍 / 總數",kpiDocs:"文件",kpiMedia:"媒體資產",kpiMediaSub:"24 小時 {n} 個",kpiDocsSub:"已儲存檔案",kpiConv:"Playground 對話",kpiConvSub:"24h 內更新 {n} 則",kpiSessions:"OTP 工作階段",kpiSessionsSub:"目前有效的管理員登入",kpiConcurrent:"引擎併發",kpiConcurrentSub:"進行中 / 上限",kpiQueue:"對話佇列",kpiQueueSub:"深度 · 執行 / 上限 · 死信",kpiQueueSubLive:"{run}/{max} 執行 · {dead} 死信{wait}",kpiQueuePaused:"已暫停",kpiQueueDrain:"排空",kpiQueueOff:"已停用",kpiSafe:"全域安全",kpiSafeOn:"開",kpiSafeOff:"關",kpiSafeSub:"{tools} · turns {turns} · {model}",kpiSafeSubEmpty:"無法讀取設定",queuePanel:"對話佇列",queueState:"狀態",queueLive:"運作中",qQueued:"排隊中",qRunning:"執行中",qDead:"死信",qSucceeded:"已成功",qWorker:"Worker",qWorkerActive:"活躍槽",qOldest:"最舊等待",qUnavailable:"無法取得佇列統計",safety:"安全設定",globalSafe:"全域安全模式",safeTools:"工具",safeTurns:"最大 turns",safeTimeout:"逾時",defaultModel:"預設模型",safetyHint:"影響 safe 模式金鑰與強制 safe 的流量。Playground OTP 預設 agent；開啟全域安全後會套用 safe 限制。",protection:"防護狀態",autoBan:"自動封鎖",on:"開",off:"關",ruleAuth:"認證",ruleRate:"429",ruleConn:"並發",ruleVelocity:"速率",bans:"黑名單",blocked:"已攔截",rateHits:"限流次數",liveConn:"即時連線",proxy:"代理 IP",hops:"層數",limits:"金鑰/IP 上限",models24h:"模型用量（24h）",runtime:"運行環境",port:"監聽連接埠",defaultPort:"預設",env:"環境",authMode:"管理登入",authOtp:"OTP 工作階段",encryption:"加密",ready:"就緒",notReady:"未就緒"},chats:{title:"對話記錄",total:"共",decrypt:"點選列項可查看解密後內容。",search:"搜尋",searchPh:"請求 ID、金鑰名稱、模型…",filterTitle:"搜尋與篩選",filterHint:"篩選後點列項查看詳情。",status:"狀態",allStatus:"全部狀態",model:"模型",allModels:"全部模型",apiKey:"API 金鑰",allKeys:"全部金鑰",from:"由",to:"至",mode:"模式",allModes:"全部模式",hasDocs:"有附件",filter:"套用篩選",reset:"重設",request:"請求",prompt:"提示",response:"回覆",time:"時間",attachments:"附件",page:"頁",prev:"上一頁",next:"下一頁",perPage:"每頁",detail:"對話詳情",noAttach:"無附件",openFile:"開啟 / 預覽",close:"關閉",copyPrompt:"複製提示",copyContent:"複製內容",copySystem:"複製 system prompt",copyRawPrompt:"複製原始 prompt",duration:"耗時",stream:"串流",reasoning:"思考過程",content:"輸出內容",raw:"原始儲存回覆",rawPrompt:"原始儲存 prompt",userPrompt:"用戶／對話 prompt",systemPrompt:"System prompt",systemHint:"從已儲存 prompt 中抽出 system 角色內容。",noSystem:"此請求沒有 system prompt。",hasSystem:"有 system",none:"（無）",file:"檔案",img:"圖片",previewFailed:"預覽失敗"},keys:{title:"API 金鑰",new:"新增金鑰",searchPh:"名稱或 key 前綴…",name:"名稱",role:"角色",mode:"模式",rate:"速率 / 分",status:"狀態",created:"建立",edit:"編輯",revoke:"撤銷",confirmRevoke:"確定撤銷此金鑰？",empty:"暫無",usage24:"24h 用量",maxTurns:"最大 turns",timeoutMs:"逾時 (ms)",ipWhitelist:"IP 白名單",ipWhitelistHint:"每行一個 IP 或 CIDR。留空 = 不限制 IP。",ipWhitelistCol:"IP 允許",ipAll:"全部 IP",keyOnce:"請妥善保存（明文只顯示一次）：",roleClient:"用戶 (client)",roleAdmin:"管理員 (admin)",roleClientBadge:"用戶",roleAdminBadge:"管理員",modeSafe:"safe（對外）",modeAgent:"agent（全能力）",modeSafeBadge:"安全",modeAgentBadge:"代理",ipCount:"{n} 個 IP",ipPlaceholder:`127.0.0.1
203.0.113.0/24`,allowedModels:"可用模型",allowedModelsHint:"勾選此金鑰可使用的模型。留空 = 不限制。用戶可透過 GET /v1/models 查詢可用模型清單。",allowedModelsCol:"模型",modelsAll:"全部模型",modelsCount:"{n} 個模型",modelsExtra:"其他模型 id",modelsExtraHint:"每行一個模型 id，用於上方未列出的識別名稱。",modelsPlaceholder:"org/repo:Q4_K_M"},docs:{title:"文件",total:"共",file:"檔名",mime:"類型",size:"大小",time:"時間",storage:"儲存位置",storageDb:"資料庫（加密）",storageFs:"檔案系統（加密）",storageHint:"加密儲存 · 小於 {dbMax} 入 DB，其餘於 {dir} · 上限 {upMax}。",download:"下載",downloadFail:"下載失敗",binaryPreview:"此為二進位檔（例如 PDF），無法在此預覽，請使用「下載」。",delete:"刪除",confirmDel:"確定刪除此文件？",detail:"文件詳情",preview:"預覽",copy:"複製內容",empty:"暫無",searchPh:"檔名或 MIME…",page:"頁",prev:"上一頁",next:"下一頁"},audit:{title:"審計日誌",searchPh:"動作、資源、IP、金鑰…",time:"時間",action:"動作",resource:"資源",key:"金鑰",meta:"詳情",empty:"暫無日誌",id:"識別碼",actions:{chat_create:"建立對話",document_upload:"上傳文件",document_delete:"刪除文件",document_list:"列出文件",document_read:"讀取文件",document_download:"下載文件",api_key_create:"建立金鑰",api_key_update:"更新金鑰",api_key_delete:"撤銷金鑰",api_key_list:"列出金鑰",settings_update:"更新設定",chat_admin_view:"管理員查看對話",system_update:"系統更新",system_update_check:"檢查更新",ip_ban:"封鎖 IP",ip_unban:"解除 IP 封鎖",ddos_policy_update:"DDoS 策略更新",pm2_start:"PM2 啟動",pm2_stop:"PM2 停止",pm2_restart:"PM2 重啟",pm2_reload:"PM2 重載",pm2_config:"PM2 設定",pm2_switch:"PM2 切換 runner",playground_chat:"對話試玩",playground_upload:"試玩上傳"},resources:{document:"文件",chat:"對話",api_key:"API 金鑰",settings:"設定",system:"系統",pm2:"PM2",playground:"試玩",ip:"IP"},metaStorage:"儲存方式",metaAsKey:"代行金鑰 ID",metaAsKeyName:"代行金鑰名稱"},settings:{title:"安全設定",hint:"全域安全模式，套用至所有金鑰。",globalSafe:"全域安全模式",globalSafeHint:"開＝全部 safe。關＝跟各金鑰自身模式。",masterOn:"安全模式：開",masterOff:"安全模式：關",disabledBanner:"全域安全已關 — 各金鑰用自身 safe／agent 設定。",tools:"工具模式",toolsHint:"none：禁 shell／上網／寫入。readonly：只讀搜尋。",toolsNone:"none",toolsReadonly:"readonly",maxTurns:"最大 turns",maxTurnsHint:"safe 步數。問答 3–6 · API 8–12 · 多步驟 15–40。",timeout:"逾時（ms）",timeoutHint:"safe 時限。一般 60–120s · 長任務 300–600s。",defaultModel:"預設模型",defaultModelHint:"客戶端未指定 model 時使用。",modelSource:"本機引擎",refreshModels:"重新整理模型",panel:"管理面板",save:"儲存",saved:"已儲存",guideTitle:"建議預設",guideIntro:"套用後可再微調。",guideApply:"套用",guideActive:"已應用",guideApplyConfirm:"套用「{name}」並儲存？會覆寫目前數值。",guideApplied:"已套用",chipGlobalOn:"安全：開",chipGlobalOff:"安全：關",scLocalTitle:"本機試用",scLocalDesc:"本機完整能力。",scLocalDetail:"安全關 · agent 金鑰。",scProdTitle:"對外 API",scProdDesc:"產品端點，最小權限。",scProdDetail:"安全開 · none · turns 8–12 · 60–120s。",scCodeTitle:"程式代理",scCodeDesc:"可信主機改檔／跑指令。",scCodeDetail:"安全關 · agent 金鑰。",scReadTitle:"只讀分析",scReadDesc:"解碼／搜尋，不寫入。",scReadDetail:"安全開 · readonly · turns 8–15 · 120–180s。",scChatTitle:"純問答",scChatDesc:"只回覆文字，不需使用工具。",scChatDetail:"安全開 · none · turns 3–6 · 60s。",scLongTitle:"長任務（safe）",scLongDesc:"多步驟，減少 max turns 失敗。",scLongDetail:"安全開 · none/readonly · turns 20–40 · 300–600s。",dangerTitle:"危險操作",disablePanel:"關閉管理面板",disablePanelConfirm:"關閉面板並登出？重開：ysk-omni admin on",disablePanelDone:"面板已關。重開：ysk-omni admin on",panelOffHint:"此處可關閉。重開請在伺服器執行 ysk-omni admin on。",panelStatus:"狀態",panelOn:"開",panelOff:"關"},apiFeatures:{title:"API 能力",intro:"開關協議與能力 · 約 2 秒生效 · 無需重啟。",tabProtocols:"協議",tabMedia:"媒體",tabCaps:"能力",tabEmu:"模擬",kpiEnabled:"已啟用",kpiEnabledSub:"目前開啟的開關",groupMeta:"已開 {on} / {n}",groupProtocols:"協議表面",groupMedia:"媒體 API（OpenAI 兼容）",groupCaps:"引擎能力",groupEmu:"模擬與安全",presetOpen:"預設：開放",presetLocked:"預設：鎖定",presetDev:"預設：開發",presetConfirm:"套用能力預設「{name}」？會覆寫全部 API 開關。",flag:{openaiChat:"OpenAI Chat Completions",openaiResponses:"OpenAI Responses",anthropicMessages:"Anthropic Messages",imagesApi:"Images API",filesOpenAiAlias:"Files API 別名",videoApi:"Videos API（異步 job）",audioApi:"Audio API（語音 / STT）",tools:"Tools / function calling",structuredOutput:"結構化輸出 (--json-schema)",vision:"視覺 / 圖片 (--prompt-json)",reasoningEffort:"推理力度",webSearch:"網絡搜尋工具",subagents:"子代理",planMode:"Plan 模式",memory:"跨 session 記憶",sessionResume:"恢復 session",bestOfN:"best-of-n（已移除）",checkLoop:"自我檢查迴圈（已移除）",systemOverride:"System prompt 覆寫",rules:"額外 rules",permissionMode:"權限模式",sandbox:"Sandbox profile",usageEstimate:"估算 token usage",assistantsEmulation:"Assistants-lite（本機）",strictSampling:"嚴格採樣（拒絕 temperature…）",forceDisableToolsInSafe:"Safe 模式強制工具限制"},hint:{openaiChat:"POST /v1/chat/completions",openaiResponses:"POST /v1/responses",anthropicMessages:"POST /v1/messages",imagesApi:"POST /v1/images/generations + /edits（要 agent key）",filesOpenAiAlias:"POST/GET /v1/files → documents + media",videoApi:"POST /v1/videos + poll GET /v1/videos/:id",audioApi:"POST /v1/audio/speech + /transcriptions（要 provider）",tools:"映射 tools 至本機引擎工具清單",structuredOutput:"response_format / json_schema",vision:"image_url content parts",reasoningEffort:"--reasoning-effort",webSearch:"關閉時加 --disable-web-search",subagents:"關閉時 --no-subagents",planMode:"關閉時 --no-plan",memory:"--experimental-memory",sessionResume:"--resume / --continue",bestOfN:"已棄用 — 閘道會拒絕此 flag",checkLoop:"已棄用 — 閘道會拒絕此 flag",systemOverride:"--system-prompt-override",rules:"--rules",permissionMode:"--permission-mode",sandbox:"--sandbox",usageEstimate:"usage 用字元/4 估算",assistantsEmulation:"本機 /v1/assistants + /v1/threads",strictSampling:"帶 temperature 等則 400",forceDisableToolsInSafe:"維持 safe 工具政策"}},catalog:{title:"目錄",intro:"從 Hugging Face 搜尋並拉取模型，再以 llama-server 載入本機 GGUF。",tabPacks:"精選包",tabLocal:"本機模型",tabHub:"Hugging Face",kpiLoaded:"已載入",kpiLoadedSub:"佔用 VRAM 的引擎",kpiLoadedNone:"尚未載入",kpiVram:"VRAM",kpiVramSub:"估計 {used} / {budget} MB",kpiLocal:"磁碟",kpiLocalSub:"本機登錄",kpiPacks:"精選",kpiPacksSub:"策展目錄",filterModality:"模態",filterAll:"全部",colName:"模型",colModality:"模態",colRuntime:"執行環境",colQuant:"量化",colVram:"VRAM",colSize:"大小",sizeEst:"估計",colStatus:"狀態",colPath:"路徑",pull:"Pull",pulling:"拉取中…",pullingBanner:"正在下載 {id}",dlQueue:"下載佇列",dlQueued:"排隊中",dlActive:"下載中",dlDone:"已完成",dlError:"失敗",dlEta:"預計尚餘 {time}",dlEtaCalc:"正在計算剩餘時間",dlSpeed:"{speed}/秒",dlWaiting:"等候目前下載完成",pullAgain:"再拉一次",onDisk:"已下載",load:"Load",unload:"Unload",delete:"刪除",deleteConfirm:"確定從磁碟及本機登錄刪除 {id}？",pullSpec:"指定模型下載",pullSpecPh:"org/repo 或 org/repo:Q4_K_M",pullSpecBtn:"Pull",pullSpecHint:"貼上 Hub 識別碼。此操作會將權重下載至本機登錄。",hubBrowse:"瀏覽 Hub",hubBrowseHint:"搜尋本閘道可執行的模型（llama.cpp、vLLM、diffusion、whisper）。",hubSearchBtn:"搜尋",loaded:"已載入",idle:"待命",emptyPacks:"此篩選沒有精選包",emptyLocal:"本機登錄為空，請從 Hugging Face 拉取模型",emptyLocalHint:"開啟 Hugging Face，搜尋或貼上 org/repo，然後按 Pull。",hubHint:"即時查官方 Hub REST（/api/models），用 Link cursor 翻頁。模型索引沒有 RSS／Atom。",hubSearch:"搜尋 Hub",hubSearchPh:"Qwen、llama、flux、whisper…",hubEmpty:"沒有 Hub 結果",hubMore:"載入更多",hubLoading:"載入中…",downloads:"下載數",unsupported:"無本機 runtime",hubFail:"Hub 搜尋失敗",sync:"同步熱門",syncing:"同步中…",syncOk:"已同步 {n} 個熱門 GGUF",syncAt:"上次同步 {when}",syncHint:"將下載次數最高的 50 個 GGUF 識別碼加入清單。此步驟不會下載檔案，請自行按 Pull 取得權重。",noQuant:"—",pullFail:"拉取失敗",pullNoGguf:"此儲存庫沒有 GGUF 檔，因此未加入本機模型。",loadFail:"載入失敗",unloadFail:"卸載失敗",mod:{text:"文字",image:"圖像",video:"影片",tts:"語音",stt:"轉錄"}},runtimes:{title:"執行環境",intro:"在此主機安裝或解除安裝推論引擎。可一鍵執行本作業系統的套件管理員（Homebrew、pip、winget 或 Docker）。閘道不會使用 sudo。",kpiInstalled:"已就緒",kpiMissing:"未安裝",kpiHost:"本機",kpiArch:"架構",filterOs:"作業系統",filterHost:"本機",filterAll:"全部系統",osMac:"macOS",osLinux:"Linux",osWin:"Windows",filterMod:"模態",statusInstalled:"已安裝",statusConfigured:"已設定 URL",statusMissing:"未安裝",statusUnsupported:"此作業系統不適用",supportFull:"支援",supportPartial:"部分支援",supportNone:"不支援",copyCmd:"複製安裝指令",install:"安裝",reinstall:"重新安裝",installing:"安裝中…",installDone:"安裝完成",installFail:"安裝失敗",installLog:"安裝紀錄",uninstall:"解除安裝",uninstalling:"解除安裝中…",uninstallDone:"已解除安裝",uninstallFail:"解除安裝失敗",uninstallConfirm:"將以套件管理員移除「{name}」。閘道不會使用 sudo。",docs:"文件",refresh:"重新偵測 PATH",path:"偵測結果",cmdFor:"於 {os} 安裝",empty:"沒有符合篩選的執行環境",llamacpp:"以 llama-server 提供本機 GGUF 文字推論",vllm:"以 GPU 高吞吐服務 Hugging Face safetensors",mlx:"Apple Silicon 原生文字（mlx_lm.server）",ollama:"便利的 GGUF 執行器，提供 OpenAI /v1",ffmpeg:"媒體轉碼與可播放影片樣本",whisper:"語音轉文字 worker（OpenAI transcriptions）",kokoro:"文字轉語音 worker（OpenAI speech）",comfy:"圖像／影片 worker，需 OpenAI 相容轉接層"},media:{title:"媒體庫",intro:"工作室、資產與影片工作。需 imagesApi／tools（影片另需 videoApi）。",tabStudio:"工作室",tabAssets:"資產",tabJobs:"工作",kpiAssetsSub:"已儲存的媒體檔案",kpiJobsSub:"影片生成工作",kpiStudioSub:"生成、編輯或圖生影片",assets:"資產",jobs:"影片工作",empty:"尚無媒體資產",jobsEmpty:"尚無影片工作",kind:"類型",bytes:"大小",provider:"提供者",providerPh:"提供者名稱…",prompt:"提示詞",created:"建立時間",status:"狀態",preview:"預覽",previewUnsupported:"瀏覽器無法預覽此格式，請下載檔案後開啟。",previewFail:"無法載入預覽",previewTruncated:"預覽已截斷",download:"下載",delete:"刪除",deleteConfirm:"確定要軟刪除此媒體資產？",allKinds:"全部類型",searchPh:"提示詞、檔名、MIME、提供者或 ID…",from:"開始日期",to:"結束日期",generate:"生成圖片",generateTitle:"生成圖片",studioTitle:"媒體工作室",studioHint:"可生成圖片、語音、轉錄、編輯圖像，或建立影片工作。執行限制依循安全設定。需啟用 imagesApi 與 tools（語音／轉錄另需 audioApi，影片另需 videoApi）。",generateHint:"透過本機媒體 worker（圖像、語音、轉錄、影片）。",generatePrompt:"提示詞",generatePromptPh:"描述你想生成的圖像…",generateSize:"尺寸",aspectRatio:"長寬比",aspectHint:"採用 aspect_ratio（非 OpenAI 像素尺寸）",generateN:"數量",outputFormat:"檔案格式",outputFormatHint:"生成後閘道會自動轉檔",nHint:"閘道會依序執行 1–4 次生成",generateKey:"API 金鑰",generateKeySession:"目前登入的管理員工作階段",generateSubmit:"生成",generateBusy:"正在生成，可能需要一分鐘…",generateOk:"已生成圖像，請見下方資產列表。",generateFail:"圖像生成失敗",generateNeedPrompt:"請輸入提示詞",modeGenerate:"生成",modeEdit:"編輯",modeVideo:"影片",modeSpeech:"語音",modeTranscribe:"轉錄",speechSubmit:"產生語音",speechBusy:"正在合成語音…",speechOk:"語音已儲存，請見資產列表。",speechPromptPh:"輸入要朗讀的文字…",transcribeSubmit:"轉錄",transcribeBusy:"正在轉錄…",transcribeOk:"轉錄已儲存，請見資產列表。",transcribeNeedAudio:"請選擇或拖放音訊檔後再轉錄",dropTitleAudio:"將音訊檔拖放至此",dropHintAudio:"WAV、MP3、M4A、OGG 或 FLAC",sourceNeedAudio:"請提供音訊檔",libraryFormatsAudio:"僅音訊（WAV、MP3、M4A、OGG、FLAC 等）",modelDefault:"系統預設",modelEmpty:"本機未回報模型",modelHint:"列出本機目錄全部模型，並預選系統預設",editSubmit:"編輯圖像",editBusy:"正在編輯…",editOk:"已編輯圖像，請見下方資產列表。",editNeedImage:"請選擇或拖放來源圖像後再編輯",editImage:"來源圖像",editImageHint:"image_edit 必須提供來源圖像",editPromptPh:"描述要套用的變更…",videoSubmit:"建立影片工作",videoBusy:"正在將影片工作加入佇列…",videoOk:"影片工作已加入佇列，請見「影片工作」分頁。",videoVoice:"聲線",videoVoiceNone:"不加入對白",videoVoiceHint:"可選 preset voice — 會用 reference_to_video",videoDuration:"時長",videoDurationHint:"影片時長：1–15 秒",videoSource:"來源幀（選填）",videoSourceHint:"選填。若未提供，會先依提示詞生成畫面，再進行動畫。",videoNoSource:"自動依提示詞生成畫面",videoPromptPh:"描述鏡頭運動與畫面內容…",sourceTitle:"來源圖像",sourceHint:"可拖放圖像、選擇本機檔案，或從文件庫／媒體資產中挑選任一圖像。",dropzoneAria:"來源圖像拖放區",dropTitle:"將圖像拖放至此",dropHint:"亦可選擇本機檔案，或從系統庫挑選",dropTitleVideo:"拖放來源幀（選填）",dropHintVideo:"影片可選填來源。未指定時，會先依提示詞生成畫面。",pickFile:"選擇檔案",pickLibrary:"系統庫",clearSource:"清除",sourceNeedImage:"請提供圖像檔（PNG、JPEG、WebP、GIF 等）",sourceKindUpload:"上傳",sourceKindAsset:"媒體資產",sourceKindDocument:"文件",libraryTitle:"選擇來源檔案",librarySubtitle:"可選取本閘道「文件」或「媒體資產」中的任一圖像。",libraryTabDocs:"文件",libraryTabAssets:"媒體資產",librarySearch:"依名稱、MIME 或 ID 搜尋…",libraryFormats:"僅圖像（PNG、JPEG、WebP、GIF 等）",libraryEmpty:"沒有符合的檔案",librarySelect:"使用所選",libraryLoadFail:"無法載入檔案庫"},usage:{title:"用量與防濫用",window:"統計區間",requests:"請求數",success:"成功",errors:"錯誤",errorRate:"錯誤率",byModel:"按模型",byKey:"按 API 金鑰",rateLimit:"上限 / 分",util:"估計使用率",lastUsed:"最近使用",limits:"Gateway 限流設定",global:"全域上限 / 視窗",ipMax:"未認證 IP 上限",burst:"對話短窗 burst（10s）",block:"認證失敗封鎖門檻",concurrent:"引擎最大併發",refresh:"重新整理"},ddos:{title:"DDoS 控制中心",tabPolicy:"政策",tabLive:"流量",tabBlacklist:"黑名單",tabEvents:"事件",live:"即時連線",recent:"最近請求",blacklist:"IP 黑名單",stats:"濫用統計",refresh:"重新整理",pause:"暫停自動刷新",resume:"恢復自動刷新",ban:"封鎖 IP",unban:"解除封鎖",banConfirm:"確定封鎖此 IP？",banWhitelistWarn:"此 IP 在自動封鎖白名單內。仍要手動封鎖？",unbanConfirm:"確定從黑名單移除此 IP？",ip:"IP",method:"方法",path:"路徑",key:"API 金鑰",duration:"耗時",state:"狀態",ua:"瀏覽器識別 (UA)",reason:"原因",source:"來源",expires:"到期",permanent:"永久",addBan:"新增封鎖",ttl:"有效期",ttlPerm:"永久",ttl1h:"1 小時",ttl24h:"24 小時",ttl7d:"7 日",activeConn:"進行中",rateHits:"限流次數",blockedHits:"已封鎖攔截",autoBans:"自動封鎖",topIps:"熱門 IP（最近）",emptyLive:"目前無進行中連線",emptyBan:"黑名單為空",emptyEvents:"尚無自動封鎖事件",reasonPh:"可選原因",banReasonDefault:"管理員手動封鎖",ipPlaceholder:"1.2.3.4",policyTitle:"防護策略",policyHint:"所有門檻即時生效，無需重啟。環境變數僅作為初始預設值。",autoOn:"自動判斷：開",autoOff:"自動判斷：關",autoBanMaster:"啟用自動封鎖 IP",autoBanMasterHint:"關閉後仍會限流，但不會自動加入黑名單。",masterOn:"自動封鎖：開",masterOff:"自動封鎖：關",disabledBanner:"自動封鎖已關閉 — 仍會限流，但 IP 不會被自動加入黑名單。",presetTitle:"防護方案",presetHint:"點選預設方案，或自行改數值；系統會自動判斷是否為自訂。",presetRelaxed:"寬鬆",presetBalanced:"均衡",presetStrict:"嚴格",presetCustom:"自訂",presetActiveLabel:"目前：{name}",presetFormLabel:"表單：{name}（未儲存）",presetTagActive:"使用中",presetTagDraft:"草稿",presetTagSaved:"已儲存",presetActiveHint:"目前方案：{name}。若改動其他欄位請按「儲存策略」。",presetCustomHint:"目前數值不屬於寬鬆／均衡／嚴格，已判定為「自訂」。",presetUnsavedHint:"表單顯示「{form}」，伺服器仍為「{saved}」。請按「儲存策略」先套用。",savePolicy:"儲存策略",resetPolicy:"重設為環境預設",policySaved:"防護策略已儲存，限流器已重新載入。",policyReset:"已重設為環境變數預設值。",confirmReset:"確定將所有 DDoS 策略欄位重設為 .env 預設？",sectionProxy:"反向代理 / CDN",proxyHint:"流量經 nginx 或 Cloudflare 時，請設定信任層數，令封鎖、限流、審計日誌使用真實用戶 IP，而非代理伺服器 IP。",proxyTrustHops:"信任代理層數",proxyTrustHopsHint:"0 = 直連（忽略 header）。1 = nginx 或 Cloudflare→應用。2 = Cloudflare→nginx→應用。",proxyIpSource:"客戶端 IP 來源",proxyIpSourceHint:"auto 會依序嘗試 CF-Connecting-IP、X-Real-IP、X-Forwarded-For。僅直連時先選「socket」。",proxySrcAuto:"自動（建議）",proxySrcCf:"Cloudflare（CF-Connecting-IP）",proxySrcNginx:"nginx（X-Real-IP）",proxySrcXff:"僅 X-Forwarded-For",proxySrcSocket:"僅 TCP socket（無代理）",trustedProxies:"可信代理 IP / CIDR",trustedProxiesHint:"只有這些 peer 才可設定 CF-Connecting-IP / X-Real-IP / XFF。預設 127.0.0.1（本機 nginx）。遠端代理請加入其 IP。直連客戶無法偽造 header。",sectionLimits:"限流",sectionAuth:"失敗認證",sectionRate:"限流濫用（429）",sectionConn:"連線洪水",sectionVelocity:"請求速率",sectionEscalate:"累犯升級",sectionWhitelist:"自動封鎖白名單",whitelistHint:"每行一個 IP 或 CIDR。白名單 IP 永不被自動封鎖。",rateWindow:"視窗（秒）",rateMaxKey:"金鑰上限",rateMaxIp:"未認證 IP 上限",burstWindow:"Burst 視窗（秒）",burstMax:"Burst 上限",enableRule:"啟用",threshold:"門檻",windowSec:"視窗（秒）",banMin:"封鎖時長（分）",escalateAfter:"累計自動封鎖 N 次後升級",escalateMin:"升級後封鎖（分）",maxConcurrent:"每 IP 最大並發",velocityMax:"最大請求數",eventsTitle:"最近自動封鎖事件",eventTime:"時間",eventSource:"規則",eventDuration:"封鎖時長",sources:{manual:"手動","auto-auth":"自動 · 認證","auto-rate":"自動 · 429","auto-conn":"自動 · 並發","auto-velocity":"自動 · 速率","auto-escalate":"自動 · 升級"}},pm2:{title:"PM2 控制",tabRunner:"運行方式",tabPort:"連接埠",tabConfig:"設定",tabLogs:"日誌",status:"進程狀態",start:"用 PM2 啟動",stop:"停止 PM2",restart:"重啟",reload:"重載",logs:"日誌",logsHint:"優先顯示錯誤日誌",clearLogs:"清除日誌",confirmClearLogs:"確定清除 PM2 與 ysk-omni 日誌檔？此操作無法復原（檔案會被清空）。",logsCleared:"已清除 {n} 個日誌檔。",logsAutoTrim:"超過 {maxMb} MB 會自動裁剪，只保留最後約 {keepKb} KB（每次讀取日誌時檢查）。",refresh:"重新整理",confirmStop:"確定停止 PM2 進程？",confirmRestart:"確定以 PM2 重啟？會妥善移交 port。",unavailable:"PM2 不可用",disabled:"已停用 PM2 管理",app:"應用名稱",pid:"進程 ID",uptime:"運行時間",memory:"記憶體",cpu:"CPU",restarts:"重啟次數",portBusy:"連接埠佔用中",port:"連接埠",portTitle:"監聽連接埠",portHint:"Gateway Admin 與 API 的 HTTP 連接埠。更改後會寫入 .env 並重啟進程，新連接埠才會生效。",fieldPort:"連接埠",portDefaultNote:"預設為 3850。有效範圍：1–65535。",savePort:"儲存連接埠並重啟",useDefaultPort:"使用預設（3850）",portInvalid:"請輸入有效連接埠（1–65535）。",confirmPortChange:"將監聽連接埠改為 {port} 並重啟 Gateway？之後請用新連接埠開啟 Admin（例如 http://localhost:{port}/admin）。",portChangedMsg:"連接埠已更新：{from} → {to}。",portSavedNeedRestart:"連接埠 {port} 已寫入 .env。請重啟後才會生效。",portAfterRestart:"重啟後請開啟 http://localhost:{port}/admin",hint:"可用 PM2 或 ysk-omni 運行，可在此或 CLI 切換。",switchTitle:"運行方式",switchHint:"同一時間只應有一個進程綁定連接埠。",currentRunner:"目前 runner",runnerPm2:"PM2",runnerGctoac:"ysk-omni（獨立進程）",runnerNone:"未運行",runnerUnknown:"未知／混合",switchToPm2:"切換到 PM2",switchToGctoac:"切換到 ysk-omni",confirmSwitchPm2:"確定切換到 PM2？gateway 會在數秒內以 PM2 重啟。",confirmSwitchGctoac:"確定切換到 ysk-omni？gateway 會在數秒內以獨立進程重啟。",switchScheduled:"已排程切換。管理面板將在約 10 秒後自動重新整理。",autoRefreshIn:"本頁將於 {n} 秒後自動重新載入…",autoRefreshNow:"正在重新載入…",omniPid:"ysk-omni 進程 ID",configTitle:"PM2 設定",configHint:"儲存至 pm2.runtime.json，經 ecosystem.config.cjs 套用。若目前用 PM2 運行，「儲存並套用」會重啟 PM2。",saveConfig:"儲存並套用",saveOnly:"只儲存",resetConfig:"還原預設",confirmReset:"確定將 PM2 設定還原為預設？",configSaved:"設定已儲存",fieldName:"應用名稱",fieldScript:"啟動腳本",fieldCwd:"工作目錄 (cwd)",fieldInstances:"實例數",fieldExecMode:"執行模式",fieldAutorestart:"自動重啟",fieldWatch:"檔案監視 (Watch)",fieldMaxMem:"記憶體上限重啟",fieldMaxRestarts:"最大重啟次數",fieldMinUptime:"最短運行時間",fieldRestartDelay:"重啟延遲 (ms)",fieldBackoff:"指數退避延遲 (ms)",fieldMergeLogs:"合併日誌",fieldTime:"日誌時間戳",fieldErrorFile:"錯誤日誌檔",fieldOutFile:"輸出日誌檔",fieldEnvExtra:"額外環境變數（每行 KEY=value）",fieldPreferred:"偏好 runner",empty:"pm2 列表中找不到此應用",modeFork:"fork",modeCluster:"cluster",phCwd:"（套件根目錄）",phInstances:"1 或 max",phEnv:"NODE_ENV=production",statusOnline:"運行中",statusErrored:"錯誤",statusStopped:"已停止",msgOk:"正常",msgDisabled:"PM2 管理已停用（PM2_ADMIN_ENABLED=false）。",msgBinaryMissing:"找不到 pm2，請執行：npm install -g pm2",msgNotInList:"應用「{app}」不在 PM2 列表中 — 請用「用 PM2 啟動」或「切換到 PM2」。",msgPortGctoac:"連接埠 {port} 正由 ysk-omni 佔用（pid {pid}）。請按「切換到 PM2」移交。",msgPortBusy:"連接埠 {port} 被佔用（pid {pids}）。",msgErrored:"PM2 進程出錯 — 請查日誌／設定，然後重啟或處理連接埠衝突。",msgBothRunners:"偵測到兩個 runner；ysk-omni pid {pid} 仍佔用資源。請用「切換」只保留一個。",msgError:"PM2 錯誤：{error}",msgSwitchPm2:"正在切換至 PM2… Gateway 將於數秒內以 PM2 重新啟動。",msgSwitchGctoac:"正在切換至 ysk-omni… Gateway 將於數秒內以獨立進程重新啟動。"},system:{title:"系統狀態",tabSoftware:"軟件",tabSessions:"本機 session",sessionsHint:"本機引擎 session（並非閘道對話紀錄）。",sessionsSearch:"搜尋標題、摘要或 id…",sessionDelete:"刪除",sessionDeleteConfirm:"永久刪除 session {id}？無法復原。",sessionId:"Session",sessionTitle:"標題",sessionCwd:"cwd",sessionUpdated:"更新",tabPackage:"套件",tabEnv:"環境",envHint:"運行環境與版本快照。",checkUpdate:"檢查更新",oneClick:"更新套件並重啟",selfUpdate:"套件版本",selfHint:"對比版本 · 更新套件會重啟 gateway。",current:"本機版本",npm:"npm 最新版",github:"GitHub 最新版",install:"安裝渠道",confirmUpdate:"確定更新套件並重啟 gateway？期間 API 會短暫中斷。",scheduled:"已排程更新，請約 30 秒後重新整理頁面。",database:"資料庫",grokCli:"舊 CLI（已移除）",grokInspect:"歷史殘留",grokInspectHint:"匯入殘留。閘道不再啟動外部 CLI；文字引擎是 llama-server / vLLM。",grokVersion:"引擎版本",inspectChannel:"頻道",inspectDefaultModel:"預設模型",inspectModels:"模型數",inspectSkills:"Skills",inspectMcp:"MCP",inspectPlugins:"Plugins",inspectHooks:"Hooks",concurrency:"併發",runtime:"運行狀態",software:"系統軟件",softwareHint:"所需軟件與已安裝版本。",softName:"軟件",softLevel:"需求",softInstalled:"已安裝",softVersion:"版本",softStatus:"狀態",softDetail:"說明",levelRequired:"必須",levelRecommended:"建議",levelOptional:"可選",levelBundled:"內建",softOk:"正常",softMissing:"未安裝",softWarn:"注意",envTitle:"環境變數",up:"正常",down:"異常",yes:"是",no:"否",badgeUpdate:"有新版本",badgeOk:"已是最新",badgeAhead:"新於 npm",badgeUnknown:"無法比較",statusHintUpdate:"發佈庫有較新版本，可按「更新套件並重啟」。",statusHintOk:"本機版本與目前已知最新發佈版一致。",statusHintAhead:"本機版本比 npm 新（常見於 git／開發版）。若是 git 安裝，「更新套件」仍可拉取最新 commits。",statusHintUnknown:"無法連上 npm／GitHub，未能比較版本。",checkResult:"版本檢查結果",channelGit:"git（開發目錄）",channelNpmGlobal:"npm 全域",channelNpmLocal:"npm 本地",channelUnknown:"未知",encryption:"加密",ready:"就緒",notReady:"未就緒",allRequiredOk:"必須軟件齊全",requiredMissing:"有必須軟件缺失"},support:{title:"支援",subtitle:"作者、贊助與 YSK Limited — 免費產品，務實支援",pillSupport:"支援",pillSponsor:"支援／贊助 Linktree",pillHelp:"遇到問題？ email@ysk.hk",creatorTitle:"作者",creatorBody:"本閘道為免費開源產品，供希望以本機模型提供 API 的使用者。項目以開源方式維護；你的意見與錯誤回報十分重要。",sponsorTitle:"支援／贊助",sponsorBody:"若本閘道為你節省時間，歡迎贊助開發。每一份支援均有助產品繼續免費供所有人使用。",githubSponsors:"GitHub 贊助",linktree:"Linktree",walletsTitle:"加密貨幣／Web3 地址",walletsHint:"請只在對應網絡轉帳，轉帳前請再次核對地址。",net:"網絡",addr:"地址",copy:"複製",netEvm:"EVM (ETH/BSC/AVAX)",netNear:"NEAR",netAda:"ADA (Cardano)",yskTitle:"YSK Limited",yskBody:"需要超出免費面板的人手協助？YSK Limited 可以提供：",yskLi1:"伺服器安裝、加固與日常維運",yskLi2:"主機架構設計（網站、電郵、DNS、資料庫）",yskLi3:"遷移、自動化與客製整合",yskLi4:"事故處理與上線就緒檢查",yskPrice:"此處不標價 — 請來信，我們會按你的環境商討方案。",site:"ysk.hk",helpTitle:"遇到問題？",helpBody:"請來信說明作業系統、安裝紀錄路徑，以及預期與實際結果。每封來信均會閱讀。",docs:"完整文件見倉庫 README"},common:{empty:"暫無資料",active:"啟用",revoked:"已撤銷",save:"儲存",cancel:"關閉",loading:"載入中…",powered:"技術支援",actions:"操作",yes:"是",no:"否",ok:"確定",confirm:"確定",notice:"提示",confirmTitle:"請確認",dangerTitle:"確認操作",apply:"套用",reset:"重設",search:"搜尋",prev:"上一頁",next:"下一頁",perPage:"每頁",pagerTotal:"共 {n} 筆",pagerPage:"第 {n} / {total} 頁",filterTitle:"搜尋與篩選",filterHint:"設定條件後按「套用」",sortHint:"點擊欄位以 API 排序（預設：最新在前）",featureOff:"已關閉",all:"全部",requestFailed:"請求失敗",ms:"{n} 毫秒",perMin:"{n}/分",minutes:"{n} 分鐘",mb:"{n} MB",percent:"{n}%",ipLabel:"IP",uaLabel:"UA",httpStatus:"HTTP"},errors:{unauthorized:"憑證無效或缺失，請重新登入。",forbidden:"你沒有執行此操作的權限。",not_found:"找不到請求的資源。",validation_error:"請求無效，請檢查輸入內容。",rate_limit_exceeded:"已超過速率限制，請稍後再試。",concurrency_limit_exceeded:"引擎並行工作過多，請稍候再試。",internal_error:"伺服器發生內部錯誤。",grok_error:"本機引擎回傳錯誤。",grok_timeout:"本機引擎執行逾時。",grok_not_available:"此伺服器沒有可用的本機引擎。",document_too_large:"文件大小超過允許上限。",document_type_not_allowed:"不允許此文件類型。",invalid_cwd:"不允許使用此工作目錄。",service_unavailable:"服務暫時無法使用。",queue_full:"對話佇列已滿，請稍後再試。",queue_draining:"對話佇列已暫停或正在排空。",queue_wait_timeout:"在對話佇列中等待逾時。",queue_cancelled:"對話工作已取消。",media_not_supported:"此媒體功能不可用或已停用。",media_provider_unavailable:"媒體提供者不可用。",media_generation_failed:"媒體生成失敗。",media_forbidden:"此 API 金鑰不允許生成媒體。請使用 agent 模式金鑰或管理員工作階段。",feature_disabled:"此 API 功能已停用。",feature:{imagesApi:"Images API 已停用。請至「管理 → API 能力 → Images API」啟用。",videoApi:"Video API 已停用。請至「管理 → API 能力 → Videos API」啟用。",audioApi:"Audio API 已停用。請至「管理 → API 能力 → Audio API」啟用。",tools:"Tools 已停用。請至「管理 → API 能力」啟用 Tools（圖像生成需要）。",filesOpenAiAlias:"OpenAI Files API 別名已停用。請至「管理 → API 能力 → Files API 別名」啟用。"},media:{agent_or_admin_required:"圖像生成需要 agent 模式 API 金鑰或管理員工作階段。安全模式金鑰無法使用圖像工具。",source_required:"請提供圖像檔、媒體資產或文件作為來源。",source_must_be_image:"編輯或生成影片時，來源必須為圖像。",no_image_in_sandbox:"生成已結束，但未找到圖像檔。這不是 imagesApi 或 API 金鑰問題。",no_video_in_sandbox:"生成已結束，但未找到影片檔。",provider_no_edit:"目前媒體提供者不支援圖像編輯。"}}}};function Fs(){const a=localStorage.getItem(Ya);return a==="en"||a==="zh-Hant"?a:(navigator.language||navigator.userLanguage||"en").toLowerCase().startsWith("zh")?"zh-Hant":"en"}let mt=Fs();function gt(){return mt}function Za(a){a!=="en"&&a!=="zh-Hant"||(mt=a,localStorage.setItem(Ya,a))}function e(a){const s=a.split(".");let o=oa[mt]||oa.en;for(const n of s)if(o&&typeof o=="object"&&n in o)o=o[n];else{o=oa.en;for(const i of s)if(o&&typeof o=="object"&&i in o)o=o[i];else return a;break}return typeof o=="string"?o:a}function ke(a){return e(a)!==a}function q(a,s={}){let o=e(a);for(const[n,i]of Object.entries(s))o=o.replaceAll(`{${n}}`,String(i));return o}function pa(){return`
  <div class="lang-switch" role="group" aria-label="${mt==="zh-Hant"?"語言":"Language"}">
    <button type="button" data-lang="en" class="${mt==="en"?"is-active":""}">EN</button>
    <button type="button" data-lang="zh-Hant" class="${mt==="zh-Hant"?"is-active":""}">中文</button>
  </div>`}const es=new Set([".txt",".md",".markdown",".csv",".json",".xml",".html",".htm",".js",".ts",".tsx",".jsx",".py",".java",".go",".rs",".c",".cpp",".h",".hpp",".css",".yml",".yaml",".toml",".ini",".env",".sh",".sql",".log",".pdf",".png",".jpg",".jpeg",".webp",".gif"]),Rs=[...es].join(","),ft="/admin/api",Qt="gog_admin_session";let Xe=null,Ye=!1;function Sa(a,s){const o=a?.error&&typeof a.error=="object"?a.error:a||{},n=typeof o.code=="string"?o.code:"",i=o.details&&typeof o.details=="object"?o.details:{},r=typeof i.feature=="string"?i.feature:typeof i.flag=="string"?i.flag:"",d=typeof i.reason=="string"?i.reason:"",u=String(o.message||a?.message||s||"");if(r&&(n==="feature_disabled"||n==="media_not_supported"||n==="forbidden")){const c=`errors.feature.${r}`;if(ke(c))return e(c)}if(n==="feature_disabled"&&ke("errors.feature_disabled")){const c=na(u);return c&&ke(`errors.feature.${c}`)?e(`errors.feature.${c}`):e("errors.feature_disabled")}if(d&&ke(`errors.media.${d}`))return e(`errors.media.${d}`);if(n==="media_generation_failed"&&d&&ke(`errors.media.${d}`))return e(`errors.media.${d}`);if(n==="media_forbidden"&&ke("errors.media_forbidden"))return e("errors.media_forbidden");const m=na(u);if(m&&ke(`errors.feature.${m}`))return e(`errors.feature.${m}`);if(n){const c=`errors.${n}`;if(ke(c))return e(c)}const g=na(u);return g&&ke(`errors.feature.${g}`)?e(`errors.feature.${g}`):/agent-mode|agent mode|Safe keys cannot/i.test(u)?e("errors.media.agent_or_admin_required"):/no image file was found/i.test(u)?e("errors.media.no_image_in_sandbox"):/no video file was found/i.test(u)?e("errors.media.no_video_in_sandbox"):/does not support image edits/i.test(u)?e("errors.media.provider_no_edit"):/Provide an image file|sourceAssetId|sourceDocumentId/i.test(u)?e("errors.media.source_required"):/must be an image/i.test(u)?e("errors.media.source_must_be_image"):u||e("common.requestFailed")}function na(a){const s=String(a||"");return/videoApi/i.test(s)||/Video API is disabled/i.test(s)?"videoApi":/imagesApi/i.test(s)||/Images API is disabled/i.test(s)?"imagesApi":/audioApi/i.test(s)||/Audio API is disabled/i.test(s)?"audioApi":/filesOpenAiAlias/i.test(s)||/Files API alias/i.test(s)?"filesOpenAiAlias":/Tools are disabled/i.test(s)||/\btools\b/i.test(s)&&/disabled/i.test(s)&&/image/i.test(s)?"tools":""}const l={key:sessionStorage.getItem(Qt)||"",page:"dashboard",me:null,error:"",modal:null,chatFilter:{q:"",status:"",model:"",apiKeyId:"",from:"",to:"",policyMode:"",hasDocuments:"",sortBy:"createdAt",sortDir:"desc",limit:50,offset:0},docFilter:{q:"",apiKeyId:"",storageType:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",limit:20,offset:0},keyFilter:{q:"",role:"",mode:"",isActive:"",sortBy:"createdAt",sortDir:"desc",limit:20,offset:0},auditFilter:{q:"",action:"",apiKeyId:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",limit:50,offset:0},usageFilter:{tab:"model",modelQ:"",keyQ:"",keyActive:"",modelPage:0,keyPage:0,pageSize:10,sortBy:"lastUsedAt",sortDir:"desc",modelSortBy:"requests",modelSortDir:"desc"},ddosFilter:{tab:"policy",liveQ:"",banQ:"",banSource:"",livePage:0,banPage:0,pageSize:15,liveSortBy:"startedAt",liveSortDir:"desc",banSortBy:"createdAt",banSortDir:"desc",eventSortBy:"at",eventSortDir:"desc"},mediaFilter:{tab:"studio",q:"",kind:"",provider:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",jobSortBy:"createdAt",jobSortDir:"desc",limit:20,offset:0},systemTab:"software",grokSessionQ:"",pm2Tab:"runner",apiFeaturesTab:"protocols",catalogTab:"local",catalogModality:"",catalogPulling:"",catalogPull:{id:"",bytes:0,total:0},catalogQueue:[],catalogQueueRunning:!1,catalogHubQ:"",catalogHubHits:null,catalogHubNext:"",catalogHubBusy:!1,catalogPopularSyncedAt:"",runtimesOs:"host",runtimesMod:"",runtimesReport:null,runtimesInstall:null,models:[],catalogLocal:[],keys:[]},Ns={login:"login",dashboard:"dashboard",chat:"chat",chats:"chats",keys:"keys",documents:"documents",media:"media",catalog:"catalog",runtimes:"runtimes",audit:"audit",settings:"settings","api-features":"apiFeatures",apifeatures:"apiFeatures",usage:"usage",ddos:"ddos",queue:"queue",pm2:"pm2",system:"system",support:"support"};function Ks(a){return a==="apiFeatures"?"api-features":a||"dashboard"}function Pa(a){const s=String(a||"").replace(/^#\/?/,"").split("?")[0].split("/")[0].toLowerCase();return s?s==="runtime"||s==="engines"||s==="engine"?"runtimes":Ns[s]||null:null}function Ea(a){const s=`#/${Ks(a)}`;location.hash!==s&&history.pushState(null,"",s)}function Us(){const a=Pa(location.hash);return a||(l.key?"dashboard":"login")}async function x(a,s={}){const o={...s.body?{"Content-Type":"application/json"}:{},...l.key?{Authorization:`Bearer ${l.key}`}:{},...s.headers||{}},n=await fetch(`${ft}${a}`,{...s,headers:o}),i=await n.text();let r=null;try{r=i?JSON.parse(i):null}catch{r={error:{message:i}}}if(!n.ok){const d=Sa(r,n.statusText),u=r?.error?.code||"";n.status===401?l.page!=="login"&&jt(!1):n.status===403&&!["media_forbidden","feature_disabled","forbidden","media_not_supported"].includes(u)&&l.page!=="login"&&jt(!1);const m=new Error(d);throw m.status=n.status,m.code=u,m.details=r?.error?.details,m}return r}async function Ft(a){const s=await a.text();let o=null;try{o=s?JSON.parse(s):null}catch{o={error:{message:s}}}if(!a.ok){const n=Sa(o,a.statusText),i=new Error(n);throw i.status=a.status,i.code=o?.error?.code,i.details=o?.error?.details,i}return o}function jt(a=!0){const s=l.key;a&&s&&String(s).startsWith("gog_sess_")&&fetch("/admin/api/auth/logout",{method:"POST",headers:{Authorization:`Bearer ${s}`}}).catch(()=>{}),a&&sessionStorage.removeItem(Qt),l.key="",l.me=null,l.page="login",Ea("login"),aa()}function Ma(a){xa(a,{writeHash:!0})}function xa(a,s={}){const o=a||"dashboard";l.page=o,l.modal=null,l.error="",o==="chats"&&(l.chatFilter.offset=0),o==="documents"&&(l.docFilter.offset=0),o==="keys"&&(l.keyFilter.offset=0),o==="audit"&&(l.auditFilter.offset=0),o==="media"&&(l.mediaFilter.offset=0),o!=="ddos"&&Xe&&(clearInterval(Xe),Xe=null),o!=="chat"&&document.body.classList.remove("chat-history-open"),s.writeHash!==!1&&Ea(o),aa()}function t(a){return String(a??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}let Be=null,Wt=null;function Ze(a){const s=Wt;Wt=null,Be&&(Be.remove(),Be=null),document.body.classList.remove("ui-dialog-open"),document.removeEventListener("keydown",Ia,!0),s&&s(a)}function Ia(a){if(Be&&a.key==="Escape"){a.preventDefault(),a.stopPropagation();const s=Be.dataset.cancelable!=="0";Ze(s?Be.dataset.prompt==="1"?null:!1:!0)}}function Aa(a){Be&&Ze(!1);const s=a.variant||(a.showCancel===!1?"info":"confirm"),o=a.showCancel!==!1,n=!!a.input,i=a.title||e(s==="danger"?"common.dangerTitle":o?"common.confirmTitle":"common.notice"),r=a.confirmText||e(o?"common.confirm":"common.ok"),d=a.cancelText||e("common.cancel"),u=s==="danger"?"!":s==="info"&&!o?"i":"?",m=document.createElement("div");m.className="ui-dialog-back",m.id="ui-dialog-back",m.dataset.cancelable=o||n?"1":"0",m.dataset.prompt=n?"1":"0",m.setAttribute("role","presentation"),m.innerHTML=`
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
        ${o||n?`<button type="button" class="btn secondary sm" id="ui-dialog-cancel">${t(d)}</button>`:""}
        <button type="button" class="btn ${s==="danger"?"danger":""} sm" id="ui-dialog-ok">${t(r)}</button>
      </div>
    </div>`,document.body.appendChild(m),document.body.classList.add("ui-dialog-open"),Be=m,document.addEventListener("keydown",Ia,!0);const g=m.querySelector("#ui-dialog-ok"),c=m.querySelector("#ui-dialog-cancel"),b=m.querySelector("#ui-dialog-input"),p=f=>{if(n){if(!f){Ze(null);return}const k=b instanceof HTMLInputElement?b.value:"";Ze(k);return}Ze(!!f)};return g?.addEventListener("click",f=>{f.preventDefault(),p(!0)}),c?.addEventListener("click",f=>{f.preventDefault(),p(!1)}),m.addEventListener("click",f=>{f.target===m&&(o||n)&&p(!1)}),b instanceof HTMLInputElement&&b.addEventListener("keydown",f=>{f.key==="Enter"&&(f.preventDefault(),p(!0))}),requestAnimationFrame(()=>{b instanceof HTMLInputElement?(b.focus(),b.select()):g?.focus()}),new Promise(f=>{Wt=f})}async function he(a){const s=typeof a=="string"?{message:a,showCancel:!1,variant:"info"}:{title:a.title,message:a.message,showCancel:!1,variant:a.variant||"info",confirmText:a.confirmText||e("common.ok")};await Aa(s)}async function Z(a){const s=typeof a=="string"?{message:a,showCancel:!0,variant:"confirm"}:{title:a.title,message:a.message,showCancel:!0,variant:a.variant||"confirm",confirmText:a.confirmText,cancelText:a.cancelText};return!!await Aa(s)}function Qs(){const a=typeof window<"u"?window.marked:null;if(!a||a.__gogConfigured)return a;try{typeof a.setOptions=="function"?a.setOptions({gfm:!0,breaks:!0}):a.marked&&typeof a.marked.setOptions=="function"&&a.marked.setOptions({gfm:!0,breaks:!0})}catch{}return a.__gogConfigured=!0,a}function ts(a){if(!a)return"";const s=Qs(),o=typeof window<"u"?window.DOMPurify||window.dompurify:null;if(!s)return t(a);let n="";try{if(typeof s.parse=="function")n=s.parse(a,{gfm:!0,breaks:!0});else if(typeof s=="function")n=s(a,{gfm:!0,breaks:!0});else if(s.marked&&typeof s.marked.parse=="function")n=s.marked.parse(a,{gfm:!0,breaks:!0});else return t(a)}catch{return t(a)}if(typeof n!="string"&&(n=String(n??"")),o&&typeof o.sanitize=="function"){n=o.sanitize(n,{USE_PROFILES:{html:!0},ADD_ATTR:["target","rel"]});try{n=n.replace(/<a\s+([^>]*href=)/gi,'<a target="_blank" rel="noopener noreferrer" $1')}catch{}return n}return t(a)}async function ea(a){const s=String(a??"");if(!s)return!1;try{if(navigator.clipboard&&window.isSecureContext!==!1)return await navigator.clipboard.writeText(s),!0}catch{}try{const o=document.createElement("textarea");o.value=s,o.setAttribute("readonly",""),o.style.position="fixed",o.style.left="-9999px",document.body.appendChild(o),o.select();const n=document.execCommand("copy");return document.body.removeChild(o),n}catch{return!1}}function se(a){if(!a)return"-";try{return new Date(a).toLocaleString(gt()==="zh-Hant"?"zh-HK":"en-US")}catch{return a}}function Ce(a){return a==null?"—":a<1024?`${a} B`:a<1024*1024?`${(a/1024).toFixed(1)} KB`:q("common.mb",{n:(a/1024/1024).toFixed(1)})}function xt(a){return a==null||a===""?"—":q("common.ms",{n:a})}function as(a){return a==null||a===""?"—":q("common.perMin",{n:a})}function j(a){l.error=a;const s=document.querySelector("#flash-error");s&&(s.hidden=!a,s.textContent=a)}function Ta(a){const s=a==="success"?"success":a==="error"||a==="timeout"?"error":"pending",o=a==="success"?e("status.success"):a==="error"?e("status.error"):a==="timeout"?e("status.timeout"):a==="pending"?e("status.pending"):a||"-";return`<span class="badge ${s}">${t(o)}</span>`}function js(a){const o={queued:{cls:"pending",label:e("queue.stQueued")},leased:{cls:"info",label:e("queue.stLeased")},running:{cls:"success",label:e("queue.stRunning")},succeeded:{cls:"success",label:e("queue.stSucceeded")},failed:{cls:"error",label:e("queue.stFailed")},dead:{cls:"error",label:e("queue.stDead")},cancelled:{cls:"muted",label:e("queue.stCancelled")}}[a]||{cls:"pending",label:a||"—"};return`<span class="badge ${o.cls}">${t(o.label)}</span>`}function Ws(a){const s=a==="playground"?e("queue.srcPlayground"):a==="v1"?e("queue.srcV1"):a||"—";return`<span class="badge muted">${t(s)}</span>`}function ta(a){const s=a==="agent"?"agent":a==="safe"?"safe":a||"safe",o=s==="agent"?e("keys.modeAgentBadge"):s==="safe"?e("keys.modeSafeBadge"):s;return`<span class="badge ${s==="agent"?"agent":"safe"}">${t(o)}</span>`}function Gs(a){const s=String(a||"").toLowerCase(),o=s==="admin"?e("keys.roleAdminBadge"):s==="client"||s==="user"?e("keys.roleClientBadge"):a||"-";return t(o)}function qt(a){return String(a||"").toLowerCase().startsWith("image/")}function qa(a,s=""){const o=String(a||"").toLowerCase().trim(),i=(String(s||"").toLowerCase().match(/\.([a-z0-9]+)$/)||[])[1]||"";return o.startsWith("image/")||["png","jpg","jpeg","gif","webp","svg","bmp","avif","ico"].includes(i)?"image":o.startsWith("video/")||["mp4","webm","ogg","ogv","mov","m4v"].includes(i)?"video":o.startsWith("audio/")||["mp3","wav","ogg","oga","m4a","aac","flac","opus"].includes(i)?"audio":o==="application/pdf"||i==="pdf"?"pdf":o.startsWith("text/")||o==="application/json"||o==="application/xml"||o==="application/javascript"||["txt","md","csv","json","xml","html","htm","css","js","log","svg"].includes(i)?i==="svg"?"image":"text":null}function zs(a,s=""){return qa(a,s)!=null}let Rt=null;function ss(){if(Rt){try{URL.revokeObjectURL(Rt)}catch{}Rt=null}}function Vs(a,s,o){return a==="image"?`<img class="media-lb-media media-lb-img" src="${s}" alt="${t(o)}" />`:a==="video"?`<video class="media-lb-media media-lb-video" src="${s}" controls playsinline preload="metadata"></video>`:a==="audio"?`
      <div class="media-lb-audio-wrap">
        <div class="media-lb-audio-icon" aria-hidden="true">♪</div>
        <audio class="media-lb-media media-lb-audio" src="${s}" controls preload="metadata"></audio>
      </div>`:a==="pdf"?`<iframe class="media-lb-media media-lb-pdf" src="${s}#toolbar=1" title="${t(o)}"></iframe>`:a==="text"?`<div class="media-lb-text-loading muted">${t(e("common.loading")||"…")}</div>`:`<div class="data-empty"><strong>${t(e("media.previewUnsupported"))}</strong></div>`}function Lt(a,s){const o=a.mime||s.type||"",n=a.filename||a.id||"asset",i=qa(o,n)||"image",r=e("media.preview"),d=[n,o||"—",a.bytes!=null?Ce(a.bytes):"",a.kind||""].filter(Boolean),u=t(d.join(" · ")),m=a.prompt?`<div class="media-lb-prompt"><span class="muted">${t(e("media.prompt"))}</span><p>${t(a.prompt)}</p></div>`:"";vt({title:r,subtitle:u,size:"xl",bodyHtml:`
      <div class="media-lightbox" data-preview-kind="${t(i)}">
        <div class="media-lb-stage">
          <div class="media-lb-text-loading muted">${t(e("common.loading")||"…")}</div>
        </div>
        ${m}
      </div>`,footerHtml:`
      <button type="button" class="btn secondary sm" id="media-lb-download">${t(e("media.download"))}</button>
      <button type="button" class="btn sm" id="media-lb-close">${t(e("common.cancel"))}</button>`});const g=document.querySelector("#modal-back .modal");g&&g.classList.add("modal--media-preview");const c=URL.createObjectURL(s);Rt=c;const b=document.querySelector("#modal-back .media-lb-stage");b&&(b.innerHTML=Vs(i,c,n));const p=()=>{document.querySelectorAll("#modal-back video, #modal-back audio").forEach(f=>{try{f.pause()}catch{}}),ss(),we()};document.getElementById("modal-close")?.addEventListener("click",f=>{f.preventDefault(),p()}),document.getElementById("media-lb-close")?.addEventListener("click",f=>{f.preventDefault(),p()}),document.getElementById("modal-back")?.addEventListener("click",f=>{f.target?.id==="modal-back"&&p()}),document.getElementById("media-lb-download")?.addEventListener("click",()=>{const f=document.createElement("a");f.href=c,f.download=n,f.click()}),i==="text"&&s.text().then(f=>{const k=document.querySelector("#modal-back .media-lb-stage");if(!k)return;const M=4e5,L=f.length>M?f.slice(0,M)+`
… (${e("media.previewTruncated")})`:f;k.innerHTML=`<pre class="media-lb-text">${t(L)}</pre>`}).catch(()=>{const f=document.querySelector("#modal-back .media-lb-stage");f&&(f.innerHTML=`<div class="error-box">${t(e("media.previewFail"))}</div>`)})}function os(){return`
  <footer class="site-footer">
    <a class="powered-by" href="https://ysk.hk/" target="_blank" rel="noopener noreferrer">
      <img src="/admin/assets/logo.svg" alt="" width="22" height="22" />
      <span>${t(e("common.powered"))} <strong>YSK Limited</strong></span>
    </a>
  </footer>`}function Js(){return{dashboard:e("nav.dashboard"),chat:e("nav.chat"),chats:e("nav.chats"),keys:e("nav.keys"),documents:e("nav.documents"),audit:e("nav.audit"),settings:e("nav.settings"),apiFeatures:e("nav.apiFeatures"),media:e("nav.media"),catalog:e("nav.catalog"),runtimes:e("nav.runtimes"),usage:e("nav.usage"),ddos:e("nav.ddos"),queue:e("nav.queue"),pm2:e("nav.pm2"),system:e("nav.system"),support:e("nav.support")}[l.page]||e("brand")}function Ht(){document.body.classList.remove("nav-open")}function Xs(){document.body.classList.add("nav-open")}function ne(a){return`
  <div class="app-shell">
    <header class="mobile-bar">
      <button type="button" class="icon-btn" id="nav-open" aria-label="${t(e("shell.menu"))}">☰</button>
      <div class="mobile-title">${t(Js())}</div>
      ${pa()}
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
        ${pa()}
        ${le("dashboard",e("nav.dashboard"))}
        ${le("chat",e("nav.chat"))}
        ${le("chats",e("nav.chats"))}
        ${le("keys",e("nav.keys"))}
        ${le("documents",e("nav.documents"))}
        ${le("media",e("nav.media"))}
        ${le("catalog",e("nav.catalog"))}
        ${le("runtimes",e("nav.runtimes")==="nav.runtimes"?"Runtimes":e("nav.runtimes"))}
        ${le("audit",e("nav.audit"))}
        ${le("settings",e("nav.settings"))}
        ${le("apiFeatures",e("nav.apiFeatures"))}
        ${le("usage",e("nav.usage"))}
        ${le("ddos",e("nav.ddos"))}
        ${le("queue",e("nav.queue"))}
        ${le("pm2",e("nav.pm2"))}
        ${le("system",e("nav.system"))}
        ${le("support",e("nav.support"))}
        <div class="sidebar-foot">
          <button class="btn secondary sm logout-btn" id="btn-logout">${t(e("logout"))}</button>
        </div>
      </aside>
      <main class="main">
        <div id="flash-error" class="error-box" ${l.error?"":"hidden"}>${t(l.error)}</div>
        ${a}
      </main>
    </div>
    ${os()}
  </div>
  ${l.modal||""}
  `}function le(a,s){return`<button type="button" class="nav-btn ${l.page===a?"active":""}" data-nav="${a}">${t(s)}</button>`}function ie(){Ht(),document.querySelectorAll("[data-nav]").forEach(s=>{s.onclick=()=>{Ht(),Ma(s.dataset.nav)}});const a=()=>jt(!0);document.getElementById("btn-logout")?.addEventListener("click",a),document.getElementById("btn-logout-mobile")?.addEventListener("click",a),document.getElementById("nav-open")?.addEventListener("click",Xs),document.getElementById("nav-backdrop")?.addEventListener("click",Ht),document.addEventListener("keydown",s=>{s.key==="Escape"&&Ht()},{once:!0}),document.querySelectorAll("[data-lang]").forEach(s=>{s.onclick=()=>{Za(s.dataset.lang),aa().catch(h)}}),Ba(document)}function Ys(a){if(!a)return"";const s=(a.getAttribute("data-label")||"").trim();if(s)return s;const o=a.querySelector(".th-sort-btn");return(o?[...o.childNodes].filter(i=>i.nodeType===Node.TEXT_NODE).map(i=>i.textContent||"").join(""):a.textContent||"").replace(/[▲▼]/g,"").replace(/\s+/g," ").trim()}function Ba(a){(a||document).querySelectorAll("table.data-table").forEach(o=>{const n=[...o.querySelectorAll("thead th")].map(Ys);o.querySelectorAll("tbody tr").forEach(i=>{i.classList.contains("empty-row")||[...i.children].forEach((r,d)=>{const u=[...r.children],m=r.classList.contains("row-actions")||!!r.querySelector(":scope > .row-actions")||u.length>0&&u.every(g=>g.matches("button, .btn, .row-actions"));if(r.classList.toggle("is-actions",m),r.classList.toggle("is-primary",d===0&&!m),m){r.removeAttribute("data-label");return}n[d]&&r.setAttribute("data-label",n[d])})})})}function h(a){console.error(a),j(a.message||String(a))}async function ns(){if(!l.key)return!1;const a=await x("/me");return l.me=a.data,!0}async function It(a=!1){try{const s=await x(`/models${a?"?refresh=1":""}`);return l.models=s.data?.models||[],s.data}catch{return l.models=[],{models:[],source:"fallback",defaultModel:""}}}async function Bt(){try{const a=await x("/keys?all=1");l.keys=a.data||[]}catch{l.keys=[]}}function ve(a){const s=(Array.isArray(a)?a:[a]).filter(Boolean);return s.length?`<div class="page-meta" role="status">${s.map(n=>`<span>${typeof n=="string"?t(n):n}</span>`).join('<span class="page-meta-sep" aria-hidden="true">·</span>')}</div>`:""}function Oe({title:a,hint:s,meta:o,searchHtml:n,gridHtml:i}){return`
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
    </div>`}function Pe({headHtml:a,bodyHtml:s,colSpan:o,emptyText:n,pagerHtml:i}){const r=s||`<tr class="empty-row"><td colspan="${o||6}">
      <div class="data-empty">
        <div class="data-empty-icon">∅</div>
        <strong>${t(n||e("common.empty"))}</strong>
      </div>
    </td></tr>`;return`
    <div class="panel data-table-panel">
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr>${a}</tr></thead>
          <tbody>${r}</tbody>
        </table>
      </div>
      ${i||""}
    </div>`}function Te(a,s,o="sortBy",n="sortDir"){const i=s?.[o],r=s?.[n];return i&&a.set("sortBy",String(i)),(r==="asc"||r==="desc")&&a.set("sortDir",r),a}function R({field:a,label:s,filterRef:o,sortByKey:n="sortBy",sortDirKey:i="sortDir"}){const r=o?.[n]===a,d=r?o?.[i]||"desc":"",u=r&&d==="asc"?"ascending":r&&d==="desc"?"descending":"none",m=r?d==="asc"?" ▲":" ▼":"";return`<th class="th-sort${r?" is-sorted":""}" data-label="${t(s)}" data-sort-field="${t(a)}" data-sort-by-key="${t(n)}" data-sort-dir-key="${t(i)}" aria-sort="${u}" title="${t(e("common.sortHint")||"Sort")}"><button type="button" class="th-sort-btn">${t(s)}<span class="th-sort-ind" aria-hidden="true">${m}</span></button></th>`}function Ge(a,s){document.querySelectorAll("th.th-sort[data-sort-field]").forEach(o=>{(o.querySelector(".th-sort-btn")||o).addEventListener("click",i=>{i.preventDefault();const r=o.getAttribute("data-sort-field");if(!r||!a)return;const d=o.getAttribute("data-sort-by-key")||"sortBy",u=o.getAttribute("data-sort-dir-key")||"sortDir";a[d]===r?a[u]=a[u]==="asc"?"desc":"asc":(a[d]=r,a[u]="desc"),"offset"in a&&(a.offset=0),"modelPage"in a&&d==="modelSortBy"&&(a.modelPage=0),"keyPage"in a&&d==="sortBy"&&(a.keyPage=0),"livePage"in a&&d==="liveSortBy"&&(a.livePage=0),"banPage"in a&&d==="banSortBy"&&(a.banPage=0),s()})})}function Le({total:a,limit:s,offset:o,idPrefix:n}){const i=Math.max(1,Math.ceil((a||0)/s)||1),r=Math.floor(o/s)+1,d=o>0,u=o+s<a;return`
    <div class="data-pager" id="${n}-pager">
      <div class="data-pager-meta">
        <span>${t(q("common.pagerTotal",{n:a||0}))}</span>
        <span>${t(q("common.pagerPage",{n:r,total:i}))}</span>
        <label class="muted">${t(e("common.perPage"))}
          <select id="${n}-limit">
            ${[10,20,50,100].map(m=>`<option value="${m}" ${s===m?"selected":""}>${m}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="data-pager-actions">
        <button type="button" class="btn secondary sm" id="${n}-prev" ${d?"":"disabled"}>${t(e("common.prev"))}</button>
        <button type="button" class="btn secondary sm" id="${n}-next" ${u?"":"disabled"}>${t(e("common.next"))}</button>
      </div>
    </div>`}function ht(a,s,o){document.getElementById(`${a}-prev`)?.addEventListener("click",()=>{s.offset=Math.max(0,s.offset-s.limit),o()}),document.getElementById(`${a}-next`)?.addEventListener("click",()=>{s.offset=s.offset+s.limit,o()}),document.getElementById(`${a}-limit`)?.addEventListener("change",n=>{s.limit=Number(n.target.value)||20,s.offset=0,o()})}function we(){document.querySelectorAll("#modal-back video, #modal-back audio").forEach(a=>{try{a.pause()}catch{}}),ss(),document.getElementById("modal-back")?.remove(),l.modal=null}function vt({title:a,subtitle:s,bodyHtml:o,footerHtml:n,size:i="md"}){we();const r=`
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
    </div>`;document.getElementById("app").insertAdjacentHTML("beforeend",r);const d=()=>we();document.getElementById("modal-close").onclick=d,document.getElementById("modal-back").onclick=m=>{m.target.id==="modal-back"&&d()};const u=m=>{m.key==="Escape"&&(d(),document.removeEventListener("keydown",u))};document.addEventListener("keydown",u)}async function is(){const a="ysk-omni admin otp";document.getElementById("app").innerHTML=`
    <div class="login-wrap">
      <div class="login-stage">
        <div class="login-card">
          <div class="login-brand">
            <img src="/admin/assets/logo.svg" alt="YSK" width="48" height="48" />
            <h1 class="brand-title">${t(e("loginTitle"))}</h1>
          </div>
          ${pa()}
          <div id="flash-error" class="error-box" ${l.error?"":"hidden"}>${t(l.error)}</div>
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
      ${os()}
    </div>
  `,document.querySelectorAll("[data-lang]").forEach(s=>{s.onclick=()=>{Za(s.dataset.lang),is().catch(h)}}),document.getElementById("btn-copy-cmd").onclick=async()=>{try{await navigator.clipboard.writeText(a);const s=document.getElementById("btn-copy-cmd");s.textContent=e("loginCopied"),setTimeout(()=>{s.textContent=e("loginCopy")},1500)}catch{}},document.getElementById("btn-login").onclick=async()=>{const s=document.getElementById("login-key").value.trim();if(!s)return j(e("needOtp"));try{const o=await fetch("/admin/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:s})}),n=await o.json().catch(()=>({}));if(!o.ok)throw new Error(n?.error?.message||n?.message||e("loginOtpFail"));const i=n?.data?.token;if(!i)throw new Error(e("loginOtpFail"));l.key=i,sessionStorage.setItem(Qt,i),await ns(),l.error="",Ma("dashboard")}catch(o){l.key="",sessionStorage.removeItem(Qt),j(o.message||e("loginOtpFail"))}},document.getElementById("login-key").onkeydown=s=>{s.key==="Enter"&&document.getElementById("btn-login").click()}}function Me({label:a,value:s,sub:o,tone:n,href:i,valueId:r,subId:d}){const u=n?` dash-kpi--${n}`:"",m=r?` id="${t(r)}"`:"",g=d?` id="${t(d)}"`:"",c=`
    <div class="label">${t(a)}</div>
    <div class="value"${m}>${s}</div>
    ${o!=null&&o!==""?`<div class="dash-kpi-sub muted"${g}>${o}</div>`:""}`;return i?`<button type="button" class="card dash-kpi${u}" data-nav="${t(i)}">${c}</button>`:`<div class="card dash-kpi${u}">${c}</div>`}function Qe(a,s,o){return a?`<span class="badge success">${t(s)}</span>`:`<span class="badge warn">${t(o)}</span>`}function Ca({id:a,on:s,onLabel:o,offLabel:n,title:i}){return`<button type="button"
    class="master-toggle ${s?"is-on":"is-off"}"
    id="${t(a)}"
    aria-pressed="${s?"true":"false"}"
    title="${t(i||"")}">
    <span class="master-toggle-track" aria-hidden="true"><span class="master-toggle-knob"></span></span>
    <span class="master-toggle-label">${t(s?o:n)}</span>
  </button>`}function tt(a){const s=document.getElementById(a);return s?s.classList.contains("is-on"):!1}function at(a,s,o,n){const i=document.getElementById(a);if(!i)return;i.classList.toggle("is-on",!!s),i.classList.toggle("is-off",!s),i.setAttribute("aria-pressed",s?"true":"false");const r=i.querySelector(".master-toggle-label");r&&o!=null&&n!=null&&(r.textContent=s?o:n)}function st(a,s){const o=document.getElementById(a);o&&(o.hidden=!s)}function ot(a,s){const o=document.getElementById(a);o&&o.classList.toggle("is-feature-off",!!s)}function Zs(a){return{auto:e("ddos.proxySrcAuto"),cloudflare:e("ddos.proxySrcCf"),nginx:e("ddos.proxySrcNginx"),"x-forwarded-for":e("ddos.proxySrcXff"),socket:e("ddos.proxySrcSocket")}[a]||a||"—"}async function ga(){const s=(await x("/stats")).data||{},o=s.totals||{},n=s.protection||{},i=s.runtime||{},r=s.concurrency||{},d=s.queue||null,u=s.safety||null,m=s.models24h||[],g=o.successRate24h??0,c=o.successRate??0,b=s.generatedAt?se(s.generatedAt):"—";let p="—",f=e("dash.kpiQueueSub"),k="";if(d){d.enabled?d.paused?(p=e("dash.kpiQueuePaused"),k="warn"):d.drainMode?(p=e("dash.kpiQueueDrain"),k="warn"):p=`${d.depth??0}`:(p=e("dash.kpiQueueOff"),k="warn");const I=d.oldestQueuedAgeMs>0?` · wait ${Math.round(d.oldestQueuedAgeMs/1e3)}s`:"";f=q("dash.kpiQueueSubLive",{run:d.running??0,max:d.globalConcurrency??"—",dead:d.dead??0,wait:I}),((d.dead||0)>0||(d.depth||0)>20)&&(k=k||"warn")}const M=!!u?.globalSafeMode,L=u?e(M?"dash.kpiSafeOn":"dash.kpiSafeOff"):"—",U=t(u?q("dash.kpiSafeSub",{tools:u.safeToolsMode||"—",turns:u.safeMaxTurns??"—",model:u.defaultModel||"—"}):e("dash.kpiSafeSubEmpty")),E=(s.recentChats||[]).map(I=>`
    <tr>
      <td><button class="linkish cell-primary" data-chat="${I.id}">${t(I.requestId)}</button>
        <div class="cell-sub">${t(I.apiKey?.name||"")}</div></td>
      <td>${t(I.model)}</td>
      <td>${Ta(I.status)}</td>
      <td>${ta(I.policyMode||"-")}</td>
      <td>${xt(I.durationMs)}</td>
      <td>${se(I.createdAt)}</td>
    </tr>`).join(""),B=Pe({headHtml:`
      <th>${t(e("chats.request"))}</th>
      <th>${t(e("chats.model"))}</th>
      <th>${t(e("chats.status"))}</th>
      <th>${t(e("chats.mode"))}</th>
      <th>${t(e("chats.duration"))}</th>
      <th>${t(e("chats.time"))}</th>`,bodyHtml:E,colSpan:6,emptyText:e("dash.empty")}),F=Math.max(1,...m.map(I=>I.requests||0)),S=m.length?m.map(I=>{const y=Math.round((I.requests||0)/F*100);return`
          <div class="dash-bar-row">
            <div class="dash-bar-label" title="${t(I.model)}">${t(I.model)}</div>
            <div class="dash-bar-track"><span style="width:${y}%"></span></div>
            <div class="dash-bar-n">${I.requests}</div>
          </div>`}).join(""):`<div class="data-empty" style="padding:20px"><strong>${t(e("dash.emptyModels"))}</strong></div>`,w=(I,y)=>`<span class="dash-rule-chip ${I?"is-on":"is-off"}">${t(y)}</span>`,A=d?`
      <div class="dash-stat-grid">
        <div><div class="label">${t(e("dash.qQueued"))}</div><div class="value value-sm">${d.queued??0}</div></div>
        <div><div class="label">${t(e("dash.qRunning"))}</div><div class="value value-sm">${d.running??0}<span class="dash-kpi-den">/${d.globalConcurrency??"—"}</span></div></div>
        <div><div class="label">${t(e("dash.qDead"))}</div><div class="value value-sm">${d.dead??0}</div></div>
        <div><div class="label">${t(e("dash.qSucceeded"))}</div><div class="value value-sm">${d.succeeded??0}</div></div>
      </div>
      <div class="dash-prot-meta muted">
        ${t(e("dash.qWorker"))}: ${t(d.workerId||"—")}
        · ${t(e("dash.qWorkerActive"))}: ${d.workerActive??0}
        ${d.oldestQueuedAgeMs>0?` · ${t(e("dash.qOldest"))}: ${Math.round(d.oldestQueuedAgeMs/1e3)}s`:""}
      </div>`:`<div class="data-empty" style="padding:12px 0"><strong>${t(e("dash.qUnavailable"))}</strong></div>`;document.getElementById("app").innerHTML=ne(`
    <div class="dash-hero">
      <div class="dash-hero-text">
        <h2>${t(e("dash.title"))}</h2>
        <p class="muted">${t(e("dash.subtitle"))}</p>
      </div>
      <div class="dash-hero-meta">
        <span class="muted">${t(e("dash.updated"))}: ${t(b)}</span>
        <button type="button" class="btn secondary sm" id="dash-refresh">${t(e("dash.refresh"))}</button>
      </div>
    </div>

    <div class="dash-kpi-grid">
      ${Me({label:e("dash.kpi24h"),value:o.chats24h??0,sub:q("dash.kpi24hSub",{ok:o.success24h??0,err:o.error24h??0}),tone:"primary",href:"chats"})}
      ${Me({label:e("dash.kpiSuccessRate"),value:`${g}%`,sub:q("dash.kpiSuccessRateSub",{all:c}),tone:g>=90?"ok":g>=70?"warn":"danger",href:"usage"})}
      ${Me({label:e("dash.kpiErrors"),value:o.error24h??0,sub:q("dash.kpiErrorsSub",{all:o.errors??0}),tone:(o.error24h||0)>0?"warn":"ok",href:"chats"})}
      ${Me({label:e("dash.kpiQueue"),value:p,sub:f,tone:k,href:"queue"})}
      ${Me({label:e("dash.kpiSafe"),value:L,sub:U,tone:u?M?"ok":"warn":"",href:"settings"})}
      ${Me({label:e("dash.kpiKeys"),value:`${o.activeKeys??0}<span class="dash-kpi-den">/${o.totalKeys??0}</span>`,sub:e("dash.kpiKeysSub"),href:"keys"})}
      ${Me({label:e("dash.kpiDocs"),value:o.documents??0,sub:e("dash.kpiDocsSub"),href:"documents"})}
      ${Me({label:e("dash.kpiMedia")||"Media",value:o.mediaAssets??0,sub:q("dash.kpiMediaSub",{n:o.mediaAssets24h??0}),href:"media"})}
      ${Me({label:e("dash.kpiConv"),value:o.conversations??0,sub:q("dash.kpiConvSub",{n:o.conversations24h??0}),href:"chat"})}
      ${Me({label:e("dash.kpiSessions"),value:o.adminSessions??i.adminSessions??0,sub:e("dash.kpiSessionsSub")})}
      ${Me({label:e("dash.kpiConcurrent"),value:`${r.active??0}<span class="dash-kpi-den">/${r.max??0}</span>`,sub:e("dash.kpiConcurrentSub"),tone:(r.active||0)>=(r.max||1)?"warn":""})}
    </div>

    <div class="dash-layout">
      <div class="dash-main">
        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${t(e("dash.recent"))}</strong>
            <button type="button" class="btn secondary sm" data-nav="chats">${t(e("dash.viewAll"))}</button>
          </div>
          ${B.replace("data-table-panel","data-table-panel dash-embed-table")}
        </div>

        <div class="panel dash-panel">
          <div class="panel-h">
            <strong>${t(e("dash.queuePanel"))}</strong>
            <button type="button" class="btn secondary sm" data-nav="queue">${t(e("dash.openQueue"))}</button>
          </div>
          <div class="panel-pad dash-prot">
            <div class="dash-prot-row">
              <span>${t(e("dash.queueState"))}</span>
              ${d?d.enabled?d.paused?`<span class="badge warn">${t(e("dash.kpiQueuePaused"))}</span>`:d.drainMode?`<span class="badge warn">${t(e("dash.kpiQueueDrain"))}</span>`:`<span class="badge success">${t(e("dash.queueLive"))}</span>`:`<span class="badge warn">${t(e("dash.kpiQueueOff"))}</span>`:`<span class="badge warn">${t(e("dash.kpiQueueOff"))}</span>`}
            </div>
            ${A}
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
              ${Qe(M,e("dash.on"),e("dash.off"))}
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
              ${Qe(!!n.autoBanEnabled,e("dash.on"),e("dash.off"))}
            </div>
            <div class="dash-rule-row">
              ${w(n.autoAuthEnabled,e("dash.ruleAuth"))}
              ${w(n.autoRateEnabled,e("dash.ruleRate"))}
              ${w(n.autoConnEnabled,e("dash.ruleConn"))}
              ${w(n.autoVelocityEnabled,e("dash.ruleVelocity"))}
            </div>
            <div class="dash-stat-grid">
              <div><div class="label">${t(e("dash.bans"))}</div><div class="value value-sm">${n.bans??0}</div></div>
              <div><div class="label">${t(e("dash.blocked"))}</div><div class="value value-sm">${n.blockedHits??0}</div></div>
              <div><div class="label">${t(e("dash.rateHits"))}</div><div class="value value-sm">${n.rateLimitedHits??0}</div></div>
              <div><div class="label">${t(e("dash.liveConn"))}</div><div class="value value-sm">${n.activeConnections??0}</div></div>
            </div>
            <div class="dash-prot-meta muted">
              ${t(e("dash.proxy"))}: ${t(Zs(n.proxyIpSource))}
              · ${t(e("dash.hops"))}: ${n.proxyTrustHops??0}
              · ${t(e("dash.limits"))}: ${n.rateLimitMax??"—"}/${n.rateLimitIpMax??"—"}
            </div>
          </div>
        </div>

        <div class="panel dash-panel">
          <div class="panel-h"><strong>${t(e("dash.models24h"))}</strong></div>
          <div class="panel-pad">${S}</div>
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
              ${Qe(!!i.encryptionReady,e("dash.ready"),e("dash.notReady"))}
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
  `),ie(),document.getElementById("dash-refresh")?.addEventListener("click",()=>ga().catch(h)),document.querySelectorAll("[data-nav]").forEach(I=>{I.onclick=()=>{const y=I.dataset.nav;y&&Ma(y)}}),document.querySelectorAll("[data-chat]").forEach(I=>{I.onclick=()=>ds(I.dataset.chat)})}function eo(a){return a?.length?a.map(s=>`<span class="chip ${qt(s.mimeType)?"img":""}" title="${t(s.mimeType)}">${t(s.originalName||e("chats.file"))}</span>`).join(" "):'<span class="muted">—</span>'}function ls(a){const s=String(a||"");if(!s.trim())return{system:"",body:"",hasRoles:!1};if(!/^(system|user|assistant|tool): /m.test(s))return{system:"",body:s,hasRoles:!1};const o=/(^|\n)(system|user|assistant|tool): /g,n=[];let i;for(;(i=o.exec(s))!==null;)n.push({role:i[2],contentStart:i.index+i[0].length,index:i.index});if(!n.length)return{system:"",body:s,hasRoles:!1};const r=n.map((m,g)=>{const c=g+1<n.length?n[g+1].index:s.length;return{role:m.role,content:s.slice(m.contentStart,c)}}),d=r.filter(m=>m.role==="system").map(m=>m.content),u=r.filter(m=>m.role!=="system").map(m=>`${m.role}: ${m.content}`);return{system:d.join(`

`).trim(),body:u.length?u.join(`
`):s,hasRoles:!0,blocks:r}}async function St(){await Promise.all([It(),Bt()]);const a=l.chatFilter,s=new URLSearchParams;if(s.set("limit",String(a.limit)),s.set("offset",String(a.offset)),a.status&&s.set("status",a.status),a.model&&s.set("model",a.model),a.apiKeyId&&s.set("apiKeyId",a.apiKeyId),a.q&&s.set("q",a.q),a.from&&s.set("from",new Date(a.from).toISOString()),a.to){const c=new Date(a.to);c.setHours(23,59,59,999),s.set("to",c.toISOString())}a.policyMode&&s.set("policyMode",a.policyMode),a.hasDocuments!==""&&s.set("hasDocuments",a.hasDocuments),Te(s,a);const o=await x(`/chats?${s}`),n=o.total||0,i=[`<option value="">${t(e("chats.allModels"))}</option>`,...l.models.map(c=>`<option value="${t(c)}" ${a.model===c?"selected":""}>${t(c)}</option>`)].join(""),r=[`<option value="">${t(e("chats.allKeys"))}</option>`,...l.keys.map(c=>`<option value="${c.id}" ${a.apiKeyId===c.id?"selected":""}>${t(c.name)} (${t(c.keyPrefix)})</option>`)].join(""),d=(o.items||[]).map(c=>{const b=ls(c.promptPreview||""),p=!!b.system,f=p?b.body.slice(0,160):c.promptPreview||"";return`
    <tr>
      <td><button class="linkish cell-primary" data-chat="${c.id}">${t(c.requestId)}</button></td>
      <td><div class="cell-primary">${t(c.apiKey?.name||"")}</div><div class="cell-sub">${t(c.apiKey?.keyPrefix||"")}</div></td>
      <td>${t(c.model)}</td>
      <td>${Ta(c.status)} ${ta(c.policyMode||"-")}</td>
      <td>${eo(c.documents)} ${c.documentCount?`<span class="muted">×${c.documentCount}</span>`:""}</td>
      <td class="chats-preview-cell">
        ${p?`<span class="chip sys-chip" title="${t(b.system.slice(0,400))}">${t(e("chats.hasSystem"))}</span>`:""}
        <div class="muted preview-text">${t(f)}</div>
      </td>
      <td class="chats-preview-cell"><div class="muted preview-text">${t(c.contentPreview)}</div></td>
      <td>${se(c.createdAt)}</td>
      <td class="muted">${c.durationMs!=null?xt(c.durationMs):"—"}</td>
    </tr>`}).join(""),u=Oe({title:e("chats.filterTitle")||e("common.filterTitle"),hint:e("chats.filterHint")||e("common.filterHint"),meta:q("common.pagerTotal",{n}),searchHtml:`
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
        <select id="f-key">${r}</select>
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
      </label>`}),m=Pe({headHtml:`
      <th>${t(e("chats.request"))}</th>
      <th>${t(e("chats.apiKey"))}</th>
      ${R({field:"model",label:e("chats.model"),filterRef:a})}
      ${R({field:"status",label:e("chats.status"),filterRef:a})}
      <th>${t(e("chats.attachments"))}</th>
      <th>${t(e("chats.prompt"))}</th>
      <th>${t(e("chats.response"))}</th>
      ${R({field:"createdAt",label:e("chats.time"),filterRef:a})}
      ${R({field:"durationMs",label:e("ddos.duration"),filterRef:a})}`,bodyHtml:d,colSpan:9,emptyText:e("common.empty"),pagerHtml:Le({total:n,limit:a.limit,offset:a.offset,idPrefix:"chats"})});document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("chats.title"))}</h2>
    </div>
    ${ve([e("chats.decrypt")])}
    ${u}
    ${m}
  `),ie(),ht("chats",l.chatFilter,()=>St().catch(h)),Ge(l.chatFilter,()=>St().catch(h));const g=()=>{l.chatFilter.q=document.getElementById("f-q").value.trim(),l.chatFilter.status=document.getElementById("f-status").value,l.chatFilter.model=document.getElementById("f-model").value,l.chatFilter.apiKeyId=document.getElementById("f-key").value,l.chatFilter.policyMode=document.getElementById("f-mode").value,l.chatFilter.from=document.getElementById("f-from").value,l.chatFilter.to=document.getElementById("f-to").value,l.chatFilter.hasDocuments=document.getElementById("f-docs").checked?"true":"",l.chatFilter.offset=0,St().catch(h)};document.querySelector("[data-filter-apply]").onclick=g,document.getElementById("f-q").onkeydown=c=>{c.key==="Enter"&&g()},document.querySelector("[data-filter-reset]").onclick=()=>{l.chatFilter={q:"",status:"",model:"",apiKeyId:"",from:"",to:"",policyMode:"",hasDocuments:"",sortBy:"createdAt",sortDir:"desc",limit:50,offset:0},St().catch(h)},document.querySelectorAll("[data-chat]").forEach(c=>{c.onclick=()=>ds(c.dataset.chat)})}async function ds(a){const{data:s}=await x(`/chats/${a}`),o=s.response||{},n=s.documents||[];let i=`<p class="muted">${t(e("chats.noAttach"))}</p>`;if(n.length){const m=[];for(const g of n){let c="";if(qt(g.mimeType))try{const b=await x(`/documents/${g.id}`),p=await us(b.data||{id:g.id,isImage:!0,mimeType:g.mimeType});p?.src&&(c=`<img class="preview" src="${p.src}" alt="${t(g.originalName)}" />`)}catch{c=`<span class="muted">${t(e("chats.previewFailed"))}</span>`}m.push(`
        <div class="attach-item">
          <div style="flex:1;min-width:0">
            <strong>${t(g.originalName)}</strong>
            <div class="muted">${t(g.mimeType)} · ${Ce(g.sizeBytes)}</div>
            ${c}
          </div>
          <button class="btn secondary sm" data-open-doc="${g.id}">${t(e("chats.openFile"))}</button>
        </div>`)}i=`<div class="attach-list">${m.join("")}</div>`}const r=ls(s.prompt||""),d=r.system?`<div class="block block-system">
        <div class="block-head">
          <h4>${t(e("chats.systemPrompt"))}</h4>
          <button class="btn secondary sm" data-copy="system">${t(e("chats.copySystem"))}</button>
        </div>
        <p class="hint">${t(e("chats.systemHint"))}</p>
        <div class="pre pre-system">${t(r.system)}</div>
      </div>`:`<div class="block block-system muted-block">
        <h4>${t(e("chats.systemPrompt"))}</h4>
        <p class="muted">${t(e("chats.noSystem"))}</p>
      </div>`,u=`
    <div class="grid modal-meta-grid">
      <div class="card"><div class="label">${t(e("chats.model"))}</div><div class="value value-sm">${t(s.model)}</div></div>
      <div class="card"><div class="label">${t(e("chats.duration"))}</div><div class="value value-sm">${xt(s.durationMs)}</div></div>
      <div class="card"><div class="label">${t(e("chats.apiKey"))}</div><div class="value value-sm">${t(s.apiKey?.name||"")}</div></div>
      <div class="card"><div class="label">${t(e("chats.stream"))}</div><div class="value value-sm">${s.stream?e("common.yes"):e("common.no")}</div></div>
    </div>
    ${s.errorMessage?`<div class="error-box">${t(s.errorMessage)}</div>`:""}
    ${d}
    <div class="block">
      <h4>${t(e("chats.attachments"))}</h4>
      ${i}
    </div>
    <div class="block">
      <div class="block-head">
        <h4>${t(e("chats.userPrompt"))}</h4>
        <button class="btn secondary sm" data-copy="prompt">${t(e("chats.copyPrompt"))}</button>
      </div>
      <div class="pre">${t(r.body||s.prompt||e("chats.none"))}</div>
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
    <div class="modal-meta-foot muted">${t(e("common.ipLabel"))}: ${t(s.ip||"—")} · ${t(e("common.uaLabel"))}: ${t(s.userAgent||"—")} · ${se(s.createdAt)}</div>`;vt({title:e("chats.detail"),subtitle:`${t(s.requestId)} · ${Ta(s.status)} ${ta(s.policyMode||"-")}`,bodyHtml:u,size:"xl",footerHtml:`<button type="button" class="btn secondary sm" id="modal-ok">${t(e("chats.close"))}</button>`}),document.getElementById("modal-ok")?.addEventListener("click",()=>we()),document.querySelector('[data-copy="system"]')?.addEventListener("click",()=>{navigator.clipboard.writeText(r.system||"")}),document.querySelector('[data-copy="prompt"]')?.addEventListener("click",()=>{navigator.clipboard.writeText(r.body||s.prompt||"")}),document.querySelector('[data-copy="raw-prompt"]')?.addEventListener("click",()=>{navigator.clipboard.writeText(s.prompt||"")}),document.querySelector('[data-copy="content"]')?.addEventListener("click",()=>{navigator.clipboard.writeText(o.content||"")}),document.querySelectorAll("[data-open-doc]").forEach(m=>{m.onclick=()=>ms(m.dataset.openDoc)})}async function Ke(){const a=l.keyFilter;let s={};try{const g=await x("/usage");for(const c of g.data?.perKey||[])s[c.apiKeyId]=c}catch{}const o=new URLSearchParams;o.set("limit",String(a.limit)),o.set("offset",String(a.offset)),a.q&&o.set("q",a.q),a.role&&o.set("role",a.role),a.mode&&o.set("mode",a.mode),a.isActive!==""&&o.set("isActive",a.isActive),Te(o,a);const n=await x(`/keys?${o}`),i=n.data||[],r=n.total??i.length,d=i.map(g=>{const c=s[g.id],b=c?.requests??"—",p=c?Math.round((c.utilization||0)*100):0,f=g.ipWhitelist||[],k=f.length?q("keys.ipCount",{n:f.length}):e("keys.ipAll"),M=g.allowedModels||[],L=M.length?M.length<=2?M.join(", "):q("keys.modelsCount",{n:M.length}):e("keys.modelsAll");return`
    <tr>
      <td><div class="cell-primary">${t(g.name)}</div><div class="cell-sub">${t(g.keyPrefix)}…</div></td>
      <td>${Gs(g.role)}</td>
      <td>${ta(g.mode)}</td>
      <td>${as(g.rateLimit)}</td>
      <td title="${t(f.join(", "))}">${t(k)}</td>
      <td title="${t(M.join(", "))}">${t(L)}</td>
      <td>
        <div>${b} <span class="muted">(${t(e("keys.usage24"))})</span></div>
        <div class="usage-bar ${p>80?"warn":""}"><span style="width:${p}%"></span></div>
      </td>
      <td>${g.isActive?`<span class="badge success">${t(e("common.active"))}</span>`:`<span class="badge error">${t(e("common.revoked"))}</span>`}</td>
      <td>${se(g.createdAt)}</td>
      <td><div class="row-actions">
        <button class="btn secondary sm" data-edit="${g.id}">${t(e("keys.edit"))}</button>
        ${g.isActive?`<button class="btn danger sm" data-revoke="${g.id}">${t(e("keys.revoke"))}</button>`:""}
      </div></td>
    </tr>`}).join(""),u=Oe({title:e("common.filterTitle"),hint:e("common.filterHint"),meta:q("common.pagerTotal",{n:r}),searchHtml:`
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
      </label>`}),m=Pe({headHtml:`
      ${R({field:"name",label:e("keys.name"),filterRef:a})}
      ${R({field:"role",label:e("keys.role"),filterRef:a})}
      ${R({field:"mode",label:e("keys.mode"),filterRef:a})}
      ${R({field:"rateLimit",label:e("keys.rate"),filterRef:a})}
      <th>${t(e("keys.ipWhitelistCol"))}</th>
      <th>${t(e("keys.allowedModelsCol"))}</th>
      <th>${t(e("keys.usage24"))}</th>
      ${R({field:"isActive",label:e("keys.status"),filterRef:a})}
      ${R({field:"createdAt",label:e("keys.created"),filterRef:a})}
      <th>${t(e("common.actions"))}</th>`,bodyHtml:d,colSpan:10,emptyText:e("keys.empty"),pagerHtml:Le({total:r,limit:a.limit,offset:a.offset,idPrefix:"keys"})});document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("keys.title"))}</h2>
      <div class="toolbar">
        <button class="btn" id="btn-new-key">${t(e("keys.new"))}</button>
      </div>
    </div>
    ${u}
    ${m}
  `),ie(),ht("keys",l.keyFilter,()=>Ke().catch(h)),Ge(l.keyFilter,()=>Ke().catch(h)),document.querySelector("[data-filter-apply]").onclick=()=>{l.keyFilter.q=document.getElementById("kf-q").value.trim(),l.keyFilter.role=document.getElementById("kf-role").value,l.keyFilter.mode=document.getElementById("kf-mode").value,l.keyFilter.isActive=document.getElementById("kf-active").value,l.keyFilter.offset=0,Ke().catch(h)},document.querySelector("[data-filter-reset]").onclick=()=>{l.keyFilter={q:"",role:"",mode:"",isActive:"",sortBy:"createdAt",sortDir:"desc",limit:20,offset:0},Ke().catch(h)},document.getElementById("btn-new-key").onclick=()=>Fa().catch(h),document.querySelectorAll("[data-edit]").forEach(g=>{const c=i.find(b=>b.id===g.dataset.edit);g.onclick=()=>Fa(c).catch(h)}),document.querySelectorAll("[data-revoke]").forEach(g=>{g.onclick=async()=>{await Z({message:e("keys.confirmRevoke"),variant:"danger",confirmText:e("keys.revoke")})&&(await x(`/keys/${g.dataset.revoke}`,{method:"DELETE"}),Ke().catch(h))}})}async function Fa(a){const s=!!a,o=(a?.ipWhitelist||[]).join(`
`),n=new Set(a?.allowedModels||[]);let i=["piper/lessac-high","echo"];try{const u=await x("/catalog"),m=(u.local||[]).map(c=>c.id).filter(Boolean),g=(u.loaded||[]).map(c=>c.id||c).filter(Boolean);i=[...new Set([...g,...m,...i])]}catch{}const r=[...n].filter(u=>!i.includes(u)),d=i.map(u=>`
        <label class="key-model-item">
          <input type="checkbox" data-k-model value="${t(u)}" ${n.has(u)?"checked":""} />
          <span>${t(u)}</span>
        </label>`).join("");vt({title:e(s?"keys.edit":"keys.new"),subtitle:s?`${t(a?.name||"")} · ${t(a?.keyPrefix||"")}…`:"",size:"lg",bodyHtml:`
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
        <div class="full key-models-field">
          <span>${t(e("keys.allowedModels"))}</span>
          <div class="key-model-list" id="k-models">${d}</div>
          <span class="field-hint">${t(e("keys.allowedModelsHint"))}</span>
        </div>
        <label class="full">${t(e("keys.modelsExtra"))}
          <textarea id="k-models-extra" rows="3" placeholder="${t(e("keys.modelsPlaceholder"))}">${t(r.join(`
`))}</textarea>
          <span class="field-hint">${t(e("keys.modelsExtraHint"))}</span>
        </label>
        ${s?`<label class="full">${t(e("keys.status"))}
          <select id="k-active"><option value="true">${t(e("common.active"))}</option><option value="false">${t(e("common.revoked"))}</option></select>
        </label>`:""}
      </div>
      <pre id="k-created" class="pre key-once-box" hidden></pre>`,footerHtml:`
      <button type="button" class="btn secondary sm" id="k-cancel">${t(e("common.cancel"))}</button>
      <button type="button" class="btn sm" id="k-save">${t(e("common.save"))}</button>`}),document.getElementById("k-role").value=a?.role||"client",document.getElementById("k-mode").value=a?.mode||"safe",s&&(document.getElementById("k-active").value=String(a.isActive)),document.getElementById("k-cancel").onclick=()=>we(),document.getElementById("k-save").onclick=async()=>{const u=document.getElementById("k-ip").value.split(/[\n,]+/).map(p=>p.trim()).filter(Boolean),m=[...document.querySelectorAll("[data-k-model]:checked")].map(p=>p.value),g=document.getElementById("k-models-extra").value.split(/[\n,]+/).map(p=>p.trim()).filter(Boolean),c=[...new Set([...m,...g])],b={name:document.getElementById("k-name").value.trim(),role:document.getElementById("k-role").value,mode:document.getElementById("k-mode").value,rateLimit:Number(document.getElementById("k-rate").value||60),maxTurns:document.getElementById("k-turns").value?Number(document.getElementById("k-turns").value):null,timeoutMs:document.getElementById("k-timeout").value?Number(document.getElementById("k-timeout").value):null,ipWhitelist:u,allowedModels:c};try{if(s)b.isActive=document.getElementById("k-active").value==="true",await x(`/keys/${a.id}`,{method:"PATCH",body:JSON.stringify(b)}),we(),Ke().catch(h);else{const p=await x("/keys",{method:"POST",body:JSON.stringify(b)}),f=document.getElementById("k-created");f&&(f.hidden=!1,f.textContent=`${e("keys.keyOnce")}
${p.data?.key||JSON.stringify(p.data)}`);const k=document.getElementById("k-save");k&&(k.textContent=e("chats.close"),k.onclick=()=>{we(),Ke().catch(h)})}}catch(p){h(p)}}}function rs(a){return e(a==="filesystem"?"docs.storageFs":"docs.storageDb")}async function cs(a,s){try{const o=await fetch(`${ft}/documents/${a}/download`,{headers:l.key?{Authorization:`Bearer ${l.key}`}:{}});if(!o.ok){const d=await o.text();let u=d;try{u=JSON.parse(d).error?.message||d}catch{}throw new Error(u||e("docs.downloadFail"))}const n=await o.blob(),i=URL.createObjectURL(n),r=document.createElement("a");r.href=i,r.download=s||"download",document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(i)}catch(o){j(o.message||e("docs.downloadFail"))}}async function dt(){await Bt();const a=l.docFilter,s=new URLSearchParams({limit:String(a.limit),offset:String(a.offset)});if(a.q&&s.set("q",a.q),a.apiKeyId&&s.set("apiKeyId",a.apiKeyId),a.storageType&&s.set("storageType",a.storageType),a.from&&s.set("from",new Date(a.from).toISOString()),a.to){const c=new Date(a.to);c.setHours(23,59,59,999),s.set("to",c.toISOString())}Te(s,a);const o=await x(`/documents?${s}`),n=o.total??0,i=o.meta||{},r=q("docs.storageHint",{dir:i.storageDir||"—",dbMax:Ce(i.documentDbMaxBytes),upMax:Ce(i.uploadMaxBytes)}),d=[`<option value="">${t(e("common.all"))}</option>`,...l.keys.map(c=>`<option value="${c.id}" ${a.apiKeyId===c.id?"selected":""}>${t(c.name)}</option>`)].join(""),u=(o.data||[]).map(c=>`
    <tr>
      <td><button class="linkish cell-primary" data-doc="${c.id}">${t(c.originalName)}</button>
        ${qt(c.mimeType)?`<span class="chip img">${t(e("chats.img"))}</span>`:""}</td>
      <td>${t(c.apiKey?.name||"")}</td>
      <td>${t(c.mimeType)}</td>
      <td>${Ce(c.sizeBytes)}</td>
      <td>
        <span title="${t(c.storagePath||"")}">${t(rs(c.storageType))}</span>
        ${c.storagePath?`<div class="cell-sub">${t(c.storagePath)}</div>`:""}
      </td>
      <td>${se(c.createdAt)}</td>
      <td><div class="row-actions">
        <button class="btn secondary sm" data-dl="${c.id}" data-name="${t(c.originalName)}">${t(e("docs.download"))}</button>
        <button class="btn danger sm" data-del="${c.id}">${t(e("docs.delete"))}</button>
      </div></td>
    </tr>`).join(""),m=Oe({title:e("common.filterTitle"),hint:e("common.filterHint"),meta:q("common.pagerTotal",{n}),searchHtml:`
      <div class="data-filter-search">
        <label for="df-q">${t(e("common.search"))}</label>
        <input type="search" id="df-q" value="${t(a.q)}" placeholder="${t(e("docs.searchPh"))}" />
      </div>`,gridHtml:`
      <label>${t(e("chats.apiKey"))}
        <select id="df-key">${d}</select>
      </label>
      <label>${t(e("docs.storage"))}
        <select id="df-storage">
          <option value="">${t(e("common.all"))}</option>
          <option value="db" ${a.storageType==="db"?"selected":""}>${t(e("docs.storageDb"))}</option>
          <option value="filesystem" ${a.storageType==="filesystem"?"selected":""}>${t(e("docs.storageFs"))}</option>
        </select>
      </label>
      <label>${t(e("chats.from"))}<input type="date" id="df-from" value="${t(a.from)}" /></label>
      <label>${t(e("chats.to"))}<input type="date" id="df-to" value="${t(a.to)}" /></label>`}),g=Pe({headHtml:`
      ${R({field:"originalName",label:e("docs.file"),filterRef:a})}
      <th>${t(e("chats.apiKey"))}</th>
      ${R({field:"mimeType",label:e("docs.mime"),filterRef:a})}
      ${R({field:"sizeBytes",label:e("docs.size"),filterRef:a})}
      ${R({field:"storageType",label:e("docs.storage"),filterRef:a})}
      ${R({field:"createdAt",label:e("docs.time"),filterRef:a})}
      <th>${t(e("common.actions"))}</th>`,bodyHtml:u,colSpan:7,emptyText:e("docs.empty"),pagerHtml:Le({total:n,limit:a.limit,offset:a.offset,idPrefix:"docs"})});document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("docs.title"))}</h2>
    </div>
    ${ve([r])}
    ${m}
    ${g}
  `),ie(),ht("docs",l.docFilter,()=>dt().catch(h)),Ge(l.docFilter,()=>dt().catch(h)),document.querySelector("[data-filter-apply]").onclick=()=>{l.docFilter.q=document.getElementById("df-q").value.trim(),l.docFilter.apiKeyId=document.getElementById("df-key").value,l.docFilter.storageType=document.getElementById("df-storage").value,l.docFilter.from=document.getElementById("df-from").value,l.docFilter.to=document.getElementById("df-to").value,l.docFilter.offset=0,dt().catch(h)},document.querySelector("[data-filter-reset]").onclick=()=>{l.docFilter={q:"",apiKeyId:"",storageType:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",limit:20,offset:0},dt().catch(h)},document.querySelectorAll("[data-doc]").forEach(c=>{c.onclick=()=>ms(c.dataset.doc)}),document.querySelectorAll("[data-dl]").forEach(c=>{c.onclick=()=>cs(c.getAttribute("data-dl"),c.getAttribute("data-name")||"file")}),document.querySelectorAll("[data-del]").forEach(c=>{c.onclick=async()=>{await Z({message:e("docs.confirmDel"),variant:"danger",confirmText:e("docs.delete")})&&(await x(`/documents/${c.dataset.del}`,{method:"DELETE"}),dt().catch(h))}})}async function to(a){const s=await fetch(`${ft}/documents/${a}/download`,{headers:l.key?{Authorization:`Bearer ${l.key}`}:{}});if(!s.ok){const n=await s.text();let i=n;try{i=JSON.parse(n)?.error?.message||n}catch{}throw new Error(i||e("docs.downloadFail"))}const o=await s.blob();return URL.createObjectURL(o)}async function us(a){if(a?.imageDataUrl)return{src:a.imageDataUrl,revoke:null};if(a?.isImage||qt(a?.mimeType)){const s=await to(a.id);return{src:s,revoke:s}}return null}async function ms(a){const{data:s}=await x(`/documents/${a}`);let o,n=null;try{const d=await us(s);d?(n=d.revoke,o=`<img class="preview doc-preview-img" src="${d.src}" alt="${t(s.originalName||"")}" />`):s.isBinary||s.content==null?o=`<div class="data-empty"><div class="data-empty-icon">⧉</div><strong>${t(e("docs.binaryPreview"))}</strong></div>`:o=`<div class="pre" id="doc-content">${t(s.content||e("chats.none"))}</div>`}catch{o=`<div class="data-empty"><div class="data-empty-icon">⧉</div><strong>${t(e("chats.previewFailed")||e("docs.binaryPreview"))}</strong></div>`}const i=`${rs(s.storageType)}${s.storagePath?` · ${s.storagePath}`:""}`;vt({title:e("docs.detail"),subtitle:`${t(s.originalName)} · ${t(s.mimeType)} · ${Ce(s.sizeBytes)}<br/><span class="muted">${t(e("docs.storage"))}: ${t(i)}</span>`,size:"lg",bodyHtml:`
      <div class="block">
        <h4>${t(e("docs.preview"))}</h4>
        ${o}
      </div>`,footerHtml:`
      ${!s.imageDataUrl&&!(s.isImage||qt(s.mimeType))&&s.content&&!s.isBinary?`<button type="button" class="btn secondary sm" id="doc-copy">${t(e("docs.copy"))}</button>`:""}
      <button type="button" class="btn sm" id="doc-download">${t(e("docs.download"))}</button>
      <button type="button" class="btn secondary sm" id="doc-close">${t(e("chats.close"))}</button>`});const r=()=>{if(n)try{URL.revokeObjectURL(n)}catch{}we()};document.getElementById("doc-close")?.addEventListener("click",r),document.getElementById("doc-download").onclick=()=>cs(s.id,s.originalName),document.getElementById("doc-copy")?.addEventListener("click",async()=>{if(await ea(s.content||"")){const u=document.getElementById("doc-copy");u&&(u.textContent=e("chat.copied"))}})}function Ra(a){if(!a)return"-";const s=`audit.actions.${String(a).replace(/\./g,"_")}`,o=e(s);return o===s?a:o}function ao(a){if(!a)return"";const s=`audit.resources.${String(a).replace(/\./g,"_")}`,o=e(s);return o===s?a:o}function so(a){if(!a)return"";try{const s=typeof a=="string"?JSON.parse(a):a;return!s||typeof s!="object"?String(a):Object.entries(s).map(([o,n])=>{const i={originalName:e("docs.file"),mimeType:e("docs.mime"),sizeBytes:e("docs.size"),storageType:e("audit.metaStorage"),asKeyId:e("audit.metaAsKey"),asKeyName:e("audit.metaAsKeyName"),model:e("chats.model"),stream:e("chats.stream")}[o]||o,r=typeof n=="object"?JSON.stringify(n):String(n??"");return`${i}: ${r}`}).join(" · ")}catch{return String(a)}}async function Pt(){await Bt();const a=l.auditFilter,s=new URLSearchParams;if(s.set("limit",String(a.limit)),s.set("offset",String(a.offset)),a.q&&s.set("q",a.q),a.action&&s.set("action",a.action),a.apiKeyId&&s.set("apiKeyId",a.apiKeyId),a.from&&s.set("from",new Date(a.from).toISOString()),a.to){const c=new Date(a.to);c.setHours(23,59,59,999),s.set("to",c.toISOString())}Te(s,a);const o=await x(`/audit-logs?${s}`),n=o.total??0,i=["","chat.create","document.upload","document.delete","document.download","api_key.create","api_key.update","api_key.delete","settings.update","playground.chat","ip.ban","ip.unban","ddos.policy_update","pm2.switch","system.update"],r=[`<option value="">${t(e("common.all"))}</option>`,...l.keys.map(c=>`<option value="${c.id}" ${a.apiKeyId===c.id?"selected":""}>${t(c.name)}</option>`)].join(""),d=i.map(c=>c?`<option value="${t(c)}" ${a.action===c?"selected":""}>${t(Ra(c))}</option>`:`<option value="">${t(e("common.all"))}</option>`).join(""),u=(o.data||[]).map(c=>`
    <tr>
      <td>${se(c.createdAt)}</td>
      <td title="${t(c.action||"")}"><span class="cell-primary">${t(Ra(c.action))}</span></td>
      <td>
        <div>${t(ao(c.resource))}</div>
        ${c.resourceId?`<div class="cell-sub audit-id" title="${t(c.resourceId)}">${t(c.resourceId)}</div>`:""}
      </td>
      <td>${t(c.apiKey?.name||"-")}</td>
      <td class="muted audit-meta">${t(so(c.metaJson))}</td>
    </tr>`).join(""),m=Oe({title:e("common.filterTitle"),hint:e("common.filterHint"),meta:q("common.pagerTotal",{n}),searchHtml:`
      <div class="data-filter-search">
        <label for="af-q">${t(e("common.search"))}</label>
        <input type="search" id="af-q" value="${t(a.q)}" placeholder="${t(e("audit.searchPh"))}" />
      </div>`,gridHtml:`
      <label>${t(e("audit.action"))}
        <select id="af-action">${d}</select>
      </label>
      <label>${t(e("audit.key"))}
        <select id="af-key">${r}</select>
      </label>
      <label>${t(e("chats.from"))}<input type="date" id="af-from" value="${t(a.from)}" /></label>
      <label>${t(e("chats.to"))}<input type="date" id="af-to" value="${t(a.to)}" /></label>`}),g=Pe({headHtml:`
      ${R({field:"createdAt",label:e("audit.time"),filterRef:a})}
      ${R({field:"action",label:e("audit.action"),filterRef:a})}
      ${R({field:"resource",label:e("audit.resource"),filterRef:a})}
      <th>${t(e("audit.key"))}</th>
      <th>${t(e("audit.meta"))}</th>`,bodyHtml:u,colSpan:5,emptyText:e("audit.empty"),pagerHtml:Le({total:n,limit:a.limit,offset:a.offset,idPrefix:"audit"})});document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("audit.title"))}</h2>
    </div>
    ${m}
    ${g}
  `),ie(),ht("audit",l.auditFilter,()=>Pt().catch(h)),Ge(l.auditFilter,()=>Pt().catch(h)),document.querySelector("[data-filter-apply]").onclick=()=>{l.auditFilter.q=document.getElementById("af-q").value.trim(),l.auditFilter.action=document.getElementById("af-action").value,l.auditFilter.apiKeyId=document.getElementById("af-key").value,l.auditFilter.from=document.getElementById("af-from").value,l.auditFilter.to=document.getElementById("af-to").value,l.auditFilter.offset=0,Pt().catch(h)},document.querySelector("[data-filter-reset]").onclick=()=>{l.auditFilter={q:"",action:"",apiKeyId:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",limit:50,offset:0},Pt().catch(h)}}function fa(){return[{id:"local",titleKey:"settings.scLocalTitle",descKey:"settings.scLocalDesc",detailKey:"settings.scLocalDetail",values:{globalSafeMode:!1,safeToolsMode:"none",safeMaxTurns:16,safeTimeoutMs:18e4}},{id:"prod",titleKey:"settings.scProdTitle",descKey:"settings.scProdDesc",detailKey:"settings.scProdDetail",values:{globalSafeMode:!0,safeToolsMode:"none",safeMaxTurns:10,safeTimeoutMs:12e4}},{id:"code",titleKey:"settings.scCodeTitle",descKey:"settings.scCodeDesc",detailKey:"settings.scCodeDetail",values:{globalSafeMode:!1,safeToolsMode:"none",safeMaxTurns:20,safeTimeoutMs:3e5}},{id:"read",titleKey:"settings.scReadTitle",descKey:"settings.scReadDesc",detailKey:"settings.scReadDetail",values:{globalSafeMode:!0,safeToolsMode:"readonly",safeMaxTurns:12,safeTimeoutMs:15e4}},{id:"chat",titleKey:"settings.scChatTitle",descKey:"settings.scChatDesc",detailKey:"settings.scChatDetail",values:{globalSafeMode:!0,safeToolsMode:"none",safeMaxTurns:5,safeTimeoutMs:6e4}},{id:"long",titleKey:"settings.scLongTitle",descKey:"settings.scLongDesc",detailKey:"settings.scLongDetail",values:{globalSafeMode:!0,safeToolsMode:"none",safeMaxTurns:40,safeTimeoutMs:6e5}}]}function oo(){return{globalSafeMode:document.getElementById("s-master-global")?tt("s-master-global"):!1,safeToolsMode:document.getElementById("s-tools")?.value||"none",safeMaxTurns:Number(document.getElementById("s-turns")?.value),safeTimeoutMs:Number(document.getElementById("s-timeout")?.value)}}function no(a){const s=oo();return!Number.isFinite(s.safeMaxTurns)||!Number.isFinite(s.safeTimeoutMs)?!1:s.globalSafeMode===!!a.globalSafeMode&&s.safeToolsMode===a.safeToolsMode&&s.safeMaxTurns===Number(a.safeMaxTurns)&&s.safeTimeoutMs===Number(a.safeTimeoutMs)}function ut(){for(const a of fa()){const s=document.querySelector(`[data-preset="${a.id}"]`),o=document.querySelector(`[data-apply-preset="${a.id}"]`);if(!s||!o)continue;const n=no(a.values);s.classList.toggle("is-applied",n),o.textContent=e(n?"settings.guideActive":"settings.guideApply"),o.disabled=n,o.classList.toggle("is-applied",n),o.setAttribute("aria-pressed",n?"true":"false")}}function io(a){const s=document.getElementById("s-tools"),o=document.getElementById("s-turns"),n=document.getElementById("s-timeout"),i=!!a.globalSafeMode;at("s-master-global",i,e("settings.masterOn"),e("settings.masterOff")),ot("settings-root",!i),st("settings-disabled-banner",!i),s&&a.safeToolsMode&&(s.value=a.safeToolsMode),o&&a.safeMaxTurns!=null&&(o.value=String(a.safeMaxTurns)),n&&a.safeTimeoutMs!=null&&(n.value=String(a.safeTimeoutMs)),ut()}async function lo(a){if(a?.values&&await Z({title:e(a.titleKey),message:q("settings.guideApplyConfirm",{name:e(a.titleKey)}),variant:"confirm",confirmText:e("settings.guideApply")})){io(a.values);try{await x("/settings",{method:"PUT",body:JSON.stringify({globalSafeMode:!!a.values.globalSafeMode,safeToolsMode:a.values.safeToolsMode,safeMaxTurns:Number(a.values.safeMaxTurns),safeTimeoutMs:Number(a.values.safeTimeoutMs),defaultModel:document.getElementById("s-model")?.value?.trim()||""})}),ut();const s=document.querySelector("#flash-error");s&&(s.hidden=!1,s.classList.add("flash-ok"),s.textContent=e("settings.guideApplied"),setTimeout(()=>{s.textContent===e("settings.guideApplied")&&(s.hidden=!0,s.classList.remove("flash-ok"),s.textContent="")},2500))}catch(s){h(s)}}}async function ps(){const[{data:a},s]=await Promise.all([x("/settings"),It()]),o=(s.models||l.models||[]).map(d=>`<option value="${t(d)}" ${a.defaultModel===d?"selected":""}>${t(d)}</option>`).join(""),n=fa().map(d=>`
      <article class="settings-guide-card" data-preset="${t(d.id)}">
        <div class="settings-guide-card-h">
          <strong>${t(e(d.titleKey))}</strong>
          <button type="button" class="btn secondary sm" data-apply-preset="${t(d.id)}">${t(e("settings.guideApply"))}</button>
        </div>
        <p class="settings-guide-desc">${t(e(d.descKey))}</p>
        <p class="settings-guide-detail muted">${t(e(d.detailKey))}</p>
        <div class="settings-guide-chips">
          <span class="chip">${t(d.values.globalSafeMode?e("settings.chipGlobalOn"):e("settings.chipGlobalOff"))}</span>
          <span class="chip">${t(d.values.safeToolsMode)}</span>
          <span class="chip">turns ${d.values.safeMaxTurns}</span>
          <span class="chip">${Math.round(d.values.safeTimeoutMs/1e3)}s</span>
        </div>
      </article>`).join(""),i=!!a.globalSafeMode;document.getElementById("app").innerHTML=ne(`
    <div id="settings-root" class="${i?"":"is-feature-off"}">
    <div class="topbar">
      <h2>${t(e("settings.title"))}</h2>
      <div class="toolbar">
        ${Ca({id:"s-master-global",on:i,onLabel:e("settings.masterOn"),offLabel:e("settings.masterOff"),title:e("settings.globalSafeHint")})}
        <button class="btn secondary sm" id="btn-refresh-models">${t(e("settings.refreshModels"))}</button>
      </div>
    </div>
    <div class="feature-off-banner" id="settings-disabled-banner" ${i?"hidden":""} role="status">
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
        <div class="settings-guide-grid">${n}</div>
      </div>
    </div>
    <div class="danger-zone">
      <h3>${t(e("settings.dangerTitle"))}</h3>
      <p class="muted">${t(e("settings.panelOffHint"))} · ${t(e("settings.panelStatus"))}: <strong>${a.adminPanelEnabled?e("settings.panelOn"):e("settings.panelOff")}</strong></p>
      <button class="btn danger sm" id="s-disable-panel" ${a.adminPanelEnabled?"":"disabled"}>${t(e("settings.disablePanel"))}</button>
    </div>
    </div>
  `),ie(),document.getElementById("s-tools").value=a.safeToolsMode||"none";const r=()=>ut();["s-tools","s-turns","s-timeout"].forEach(d=>{const u=document.getElementById(d);u&&(u.addEventListener("change",r),u.addEventListener("input",r))}),ut(),document.getElementById("s-master-global")?.addEventListener("click",async()=>{const d=!tt("s-master-global");at("s-master-global",d,e("settings.masterOn"),e("settings.masterOff")),ot("settings-root",!d),st("settings-disabled-banner",!d),ut();try{await x("/settings",{method:"PUT",body:JSON.stringify({globalSafeMode:d,safeToolsMode:document.getElementById("s-tools").value,safeMaxTurns:Number(document.getElementById("s-turns").value),safeTimeoutMs:Number(document.getElementById("s-timeout").value),defaultModel:document.getElementById("s-model").value.trim()})})}catch(u){at("s-master-global",!d,e("settings.masterOn"),e("settings.masterOff")),ot("settings-root",d),st("settings-disabled-banner",d),h(u)}}),document.getElementById("btn-refresh-models").onclick=async()=>{await It(!0),ps().catch(h)},document.getElementById("s-save").onclick=async()=>{try{await x("/settings",{method:"PUT",body:JSON.stringify({globalSafeMode:tt("s-master-global"),safeToolsMode:document.getElementById("s-tools").value,safeMaxTurns:Number(document.getElementById("s-turns").value),safeTimeoutMs:Number(document.getElementById("s-timeout").value),defaultModel:document.getElementById("s-model").value.trim()})}),ut();const d=document.querySelector("#flash-error");d&&(d.hidden=!1,d.classList.add("flash-ok"),d.textContent=e("settings.saved"),setTimeout(()=>{d.hidden=!0,d.classList.remove("flash-ok"),d.textContent=""},2e3))}catch(d){h(d)}},document.querySelectorAll("[data-apply-preset]").forEach(d=>{d.addEventListener("click",async()=>{if(d.disabled)return;const u=d.getAttribute("data-apply-preset"),m=fa().find(g=>g.id===u);m&&await lo(m)})}),document.getElementById("s-disable-panel").onclick=async()=>{if(await Z({message:e("settings.disablePanelConfirm"),variant:"danger",confirmText:e("settings.disablePanel")}))try{await x("/settings",{method:"PUT",body:JSON.stringify({adminPanelEnabled:!1})}),await he({message:e("settings.disablePanelDone"),title:e("common.notice")}),jt(!1)}catch(d){h(d)}}}async function Nt(){const a=await x("/api-features");if(l.page!=="apiFeatures")return;const s=a.data||{},o=[{id:"protocols",title:e("apiFeatures.groupProtocols"),tabLabel:e("apiFeatures.tabProtocols"),keys:["openaiChat","openaiResponses","anthropicMessages"]},{id:"media",title:e("apiFeatures.groupMedia"),tabLabel:e("apiFeatures.tabMedia"),keys:["imagesApi","filesOpenAiAlias","videoApi","audioApi"]},{id:"caps",title:e("apiFeatures.groupCaps"),tabLabel:e("apiFeatures.tabCaps"),keys:["tools","structuredOutput","vision","reasoningEffort","webSearch","subagents","planMode","memory","sessionResume","bestOfN","checkLoop","systemOverride","rules","permissionMode","sandbox"]},{id:"emu",title:e("apiFeatures.groupEmu"),tabLabel:e("apiFeatures.tabEmu"),keys:["usageEstimate","assistantsEmulation","strictSampling","forceDisableToolsInSafe"]}],n=l.apiFeaturesTab==="media"||l.apiFeaturesTab==="caps"||l.apiFeaturesTab==="emu"||l.apiFeaturesTab==="protocols"?l.apiFeaturesTab:"protocols";l.apiFeaturesTab=n;const i=f=>e(`apiFeatures.flag.${f}`)||f,r=f=>e(`apiFeatures.hint.${f}`)||"",d=f=>f.filter(k=>!!s[k]).length,u=f=>f.map(k=>{const M=!!s[k];return`
          <div class="dash-prot-row api-feat-row" data-feat="${t(k)}">
            <div>
              <strong>${t(i(k))}</strong>
              <div class="muted api-feat-hint">${t(r(k))}</div>
            </div>
            <button type="button" class="master-toggle ${M?"is-on":"is-off"}" data-feat-toggle="${t(k)}" aria-pressed="${M?"true":"false"}">
              <span class="master-toggle-track" aria-hidden="true"><span class="master-toggle-knob"></span></span>
              <span class="master-toggle-label">${t(e(M?"dash.on":"dash.off"))}</span>
            </button>
          </div>`}).join(""),m=o.reduce((f,k)=>f+k.keys.length,0),g=o.reduce((f,k)=>f+d(k.keys),0),c=`
    <div class="grid api-feat-kpi-grid">
      <div class="card">
        <div class="label">${t(e("apiFeatures.kpiEnabled"))}</div>
        <div class="value value-sm">${g}<span class="dash-kpi-den">/${m}</span></div>
        <div class="muted card-sub">${t(e("apiFeatures.kpiEnabledSub"))}</div>
      </div>
      ${o.map(f=>{const k=d(f.keys);return`
        <div class="card">
          <div class="label">${t(f.tabLabel)}</div>
          <div class="value value-sm">${k}<span class="dash-kpi-den">/${f.keys.length}</span></div>
          <div class="muted card-sub">${t(f.title)}</div>
        </div>`}).join("")}
    </div>`,b=o.map(f=>{const k=d(f.keys);return`
        <button type="button" role="tab" class="seg-tab ${n===f.id?"is-active":""}" data-feat-tab="${t(f.id)}" aria-selected="${n===f.id}">
          ${t(f.tabLabel)}
          <span class="seg-tab-count">${k}/${f.keys.length}</span>
        </button>`}).join(""),p=o.map(f=>`
        <div class="usage-tab-pane api-feat-tab-pane" id="api-feat-tab-${t(f.id)}" ${n===f.id?"":"hidden"}>
          <div class="panel data-table-panel api-feat-panel">
            <div class="panel-h">
              <div class="panel-h-text">
                <strong>${t(f.title)}</strong>
                <span class="muted panel-h-sub">${t(q("apiFeatures.groupMeta",{on:d(f.keys),n:f.keys.length}))}</span>
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
    ${ve([e("apiFeatures.intro")])}
    ${c}

    <div class="usage-tabs-panel panel api-feat-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("apiFeatures.title"))}">
        ${b}
      </div>
      <div class="usage-tab-body">
        ${p}
      </div>
    </div>
  `),ie(),document.querySelectorAll("[data-feat-tab]").forEach(f=>{f.addEventListener("click",()=>{const k=f.getAttribute("data-feat-tab")||"protocols",M=k==="media"||k==="caps"||k==="emu"||k==="protocols"?k:"protocols";l.apiFeaturesTab!==M&&(l.apiFeaturesTab=M,Nt().catch(h))})}),document.querySelectorAll("[data-feat-toggle]").forEach(f=>{f.addEventListener("click",async()=>{const k=f.getAttribute("data-feat-toggle");if(!k)return;const M=!f.classList.contains("is-on");try{await x("/api-features",{method:"PUT",body:JSON.stringify({[k]:M})}),await Nt()}catch(L){h(L)}})}),document.querySelectorAll("[data-feat-preset]").forEach(f=>{f.addEventListener("click",async()=>{const k=f.getAttribute("data-feat-preset");if(await Z({message:q("apiFeatures.presetConfirm",{name:k}),confirmText:e("common.confirm")}))try{await x("/api-features/preset",{method:"POST",body:JSON.stringify({name:k})}),await Nt()}catch(M){h(M)}})})}async function $e(){l.mediaFilter||(l.mediaFilter={tab:"studio",q:"",kind:"",provider:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",jobSortBy:"createdAt",jobSortDir:"desc",limit:20,offset:0}),l.mediaFilter.sortBy||(l.mediaFilter.sortBy="createdAt"),l.mediaFilter.sortDir||(l.mediaFilter.sortDir="desc"),l.mediaFilter.jobSortBy||(l.mediaFilter.jobSortBy="createdAt"),l.mediaFilter.jobSortDir||(l.mediaFilter.jobSortDir="desc"),l.mediaFilter.tab||(l.mediaFilter.tab="studio");const a=l.mediaFilter,s=a.tab==="assets"||a.tab==="jobs"||a.tab==="studio"?a.tab:"studio";a.tab=s;const o=new URLSearchParams({limit:String(a.limit),offset:String(a.offset)});if(a.q&&o.set("q",a.q),a.kind&&o.set("kind",a.kind),a.provider&&o.set("provider",a.provider),a.from&&o.set("from",new Date(a.from).toISOString()),a.to){const y=new Date(a.to);y.setHours(23,59,59,999),o.set("to",y.toISOString())}Te(o,a);const n=new URLSearchParams({limit:"50",offset:"0"});Te(n,a,"jobSortBy","jobSortDir");const[i,,r,d]=await Promise.all([It(!1).catch(()=>({models:l.models||[],defaultModel:""})),Bt().catch(()=>{}),x(`/media/assets?${o}`),x(`/media/jobs?${n}`).catch(()=>({data:[],total:0}))]),u=r.data||[],m=r.total??u.length,g=d.data||[],c=d.total??g.length,b=(l.keys||[]).filter(y=>y.isActive!==!1&&(y.mode==="agent"||y.role==="admin")),p=[`<option value="">${t(e("media.generateKeySession"))}</option>`,...b.map(y=>`<option value="${t(y.id)}">${t(y.name||y.id)} · ${t(y.keyPrefix||"")}… · ${t(y.mode||"")}</option>`)].join(""),f=i.models?.length?i.models:l.models||[],k=i.defaultModel||f[0]||"",M=f.length?f.map(y=>`<option value="${t(y)}" ${y===k?"selected":""}>${t(y)}${y===k?` · ${t(e("media.modelDefault"))}`:""}</option>`).join(""):`<option value="">${t(k||e("media.modelEmpty"))}</option>`,L=[["1:1","1:1 · square"],["16:9","16:9 · landscape"],["9:16","9:16 · portrait / story"],["4:3","4:3"],["3:4","3:4"],["3:2","3:2"],["2:3","2:3"],["auto","auto"]].map(([y,$],v)=>`<option value="${y}" ${v===0?"selected":""}>${t($)}</option>`).join(""),U=u.map(y=>{const $=y.mime||"",v=y.filename||y.originalName||"",O=zs($,v),T=qa($,v)||"",N=O?`<button type="button" class="btn ghost sm" data-media-preview="${t(y.id)}" data-media-mime="${t($)}" data-media-name="${t(v)}" data-media-kind="${t(y.kind||"")}" data-media-bytes="${t(String(y.bytes??""))}" data-media-prompt="${t(y.prompt||"")}" data-preview-kind="${t(T)}" title="${t(e("media.preview"))}">${t(e("media.preview"))}</button>`:"";return`
    <tr>
      <td>
        <div class="cell-primary mono" title="${t(y.id)}">${t(String(y.id).slice(0,8))}…</div>
        <div class="cell-sub">${t(v||y.source||"—")}</div>
      </td>
      <td>${t(y.kind||"—")}</td>
      <td class="muted">${t($||"—")}</td>
      <td>${Ce(y.bytes)}</td>
      <td>${t(y.provider||"—")}</td>
      <td class="muted" title="${t(y.prompt||"")}">${t((y.prompt||"—").slice(0,48))}</td>
      <td>${se(y.created_at)}</td>
      <td><div class="row-actions">
        ${N}
        <button type="button" class="btn ghost sm" data-media-dl="${t(y.id)}" data-media-name="${t(v)}">${t(e("media.download"))}</button>
        <button type="button" class="btn danger sm" data-media-del="${t(y.id)}">${t(e("media.delete"))}</button>
      </div></td>
    </tr>`}).join(""),E=Oe({title:e("common.filterTitle"),hint:e("common.filterHint"),meta:q("common.pagerTotal",{n:m}),searchHtml:`
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
      </label>`}),B=Pe({headHtml:`
      <th>ID</th>
      ${R({field:"kind",label:e("media.kind"),filterRef:a})}
      ${R({field:"mime",label:"MIME",filterRef:a})}
      ${R({field:"byteSize",label:e("media.bytes"),filterRef:a})}
      ${R({field:"provider",label:e("media.provider"),filterRef:a})}
      <th>${t(e("media.prompt"))}</th>
      ${R({field:"createdAt",label:e("media.created"),filterRef:a})}
      <th>${t(e("common.actions"))}</th>`,bodyHtml:U,colSpan:8,emptyText:e("media.empty"),pagerHtml:Le({total:m,limit:a.limit,offset:a.offset,idPrefix:"media"})}),F=g.map(y=>`
    <tr>
      <td>
        <div class="cell-primary mono" title="${t(y.id)}">${t(String(y.id).slice(0,8))}…</div>
      </td>
      <td>${t(y.status||"—")}</td>
      <td class="muted" title="${t(y.prompt||"")}">${t((y.prompt||"—").slice(0,64))}</td>
      <td class="mono">${t(y.result_asset_id?String(y.result_asset_id).slice(0,8)+"…":"—")}</td>
      <td>${se(y.created_at)}</td>
    </tr>`).join(""),S=Pe({headHtml:`
      <th>ID</th>
      ${R({field:"status",label:e("media.status"),filterRef:a,sortByKey:"jobSortBy",sortDirKey:"jobSortDir"})}
      <th>${t(e("media.prompt"))}</th>
      <th>Asset</th>
      ${R({field:"createdAt",label:e("media.created"),filterRef:a,sortByKey:"jobSortBy",sortDirKey:"jobSortDir"})}`,bodyHtml:F,colSpan:5,emptyText:e("media.jobsEmpty")}),w=`
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
          <button type="button" class="seg-tab" data-mg-mode="speech" role="tab" aria-selected="false">${t(e("media.modeSpeech"))}</button>
          <button type="button" class="seg-tab" data-mg-mode="transcribe" role="tab" aria-selected="false">${t(e("media.modeTranscribe"))}</button>
        </div>
        <div class="form-grid">
          <label class="full" id="mg-prompt-wrap">${t(e("media.generatePrompt"))}
            <textarea id="mg-prompt" rows="3" placeholder="${t(e("media.generatePromptPh"))}"></textarea>
          </label>
          <label>${t(e("media.generateKey"))}
            <select id="mg-key">${p}</select>
          </label>
          <label>${t(e("chats.model"))}
            <select id="mg-model">${M}</select>
            <span class="hint">${t(e("media.modelHint"))}</span>
          </label>
          <label id="mg-aspect-wrap">${t(e("media.aspectRatio"))}
            <select id="mg-aspect">${L}</select>
            <span class="hint">${t(e("media.aspectHint"))}</span>
          </label>
          <label id="mg-n-wrap">${t(e("media.generateN"))}
            <input type="number" id="mg-n" min="1" max="4" value="1" />
            <span class="hint">${t(e("media.nHint"))}</span>
          </label>
          <label id="mg-format-wrap">${t(e("media.outputFormat"))}
            <select id="mg-format"></select>
            <span class="hint">${t(e("media.outputFormatHint"))}</span>
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
    </div>`,A=`
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
    </div>`;document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("media.title"))}</h2>
    </div>
    ${ve([e("media.intro")])}
    ${A}
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
          ${w}
        </div>
        <div class="usage-tab-pane media-tab-pane-assets" id="media-tab-assets" ${s==="assets"?"":"hidden"}>
          ${E}
          ${B}
        </div>
        <div class="usage-tab-pane media-tab-pane-jobs" id="media-tab-jobs" ${s==="jobs"?"":"hidden"}>
          ${S}
        </div>
      </div>
    </div>
  `),ie(),document.querySelectorAll("[data-media-tab]").forEach(y=>{y.addEventListener("click",()=>{const $=y.getAttribute("data-media-tab")||"studio",v=$==="assets"||$==="jobs"||$==="studio"?$:"studio";l.mediaFilter.tab!==v&&(l.mediaFilter.tab=v,$e().catch(h))})});async function I(y){const $=await fetch(`/admin/api/media/assets/${y}/download`,{headers:{Authorization:`Bearer ${l.key}`}});if(!$.ok)throw new Error(await $.text());return $.blob()}{let y="generate",$=null;const v=()=>{const P=document.getElementById("mg-source-chip"),K=document.getElementById("mg-clear-source");if(!P)return;if(!$){P.hidden=!0,P.innerHTML="",K&&(K.hidden=!0);return}const Y=$.kind==="file"?e("media.sourceKindUpload"):$.kind==="asset"?e("media.sourceKindAsset"):e("media.sourceKindDocument");P.hidden=!1,P.innerHTML=`<span class="chip">${t(Y)}</span> <span class="mono">${t($.name||$.id||"")}</span>`,K&&(K.hidden=!1)},O=P=>{$=P;const K=document.getElementById("mg-file");K&&P?.kind!=="file"&&(K.value=""),v()},T=P=>{y=P==="edit"||P==="video"||P==="speech"||P==="transcribe"?P:"generate",document.querySelectorAll("[data-mg-mode]").forEach(re=>{const Fe=re.getAttribute("data-mg-mode")===y;re.classList.toggle("is-active",Fe),re.setAttribute("aria-selected",Fe?"true":"false")});const K=document.getElementById("mg-source-section"),Y=document.getElementById("mg-n-wrap"),fe=document.getElementById("mg-duration-wrap"),_e=document.getElementById("mg-voice-wrap"),Ve=document.getElementById("mg-aspect-wrap"),Ee=document.getElementById("mg-prompt-wrap"),te=document.getElementById("mg-submit");K&&(K.hidden=y==="generate"||y==="speech"),Y&&(Y.hidden=y!=="generate"&&y!=="edit"),fe&&(fe.hidden=y!=="video"),_e&&(_e.hidden=y!=="video"),Ve&&(Ve.hidden=y==="speech"||y==="transcribe"),Ee&&(Ee.hidden=y==="transcribe");const pe=document.getElementById("mg-format"),ye=document.getElementById("mg-format-wrap");if(ye&&(ye.hidden=!1),pe){const re=y==="speech"?["wav","mp3","opus","flac","aac"]:y==="transcribe"?["txt","json","srt","vtt"]:y==="video"?["mp4","webm","mov"]:["png","jpeg","webp"],Fe=pe.value;pe.innerHTML=re.map(it=>`<option value="${it}" ${it===Fe?"selected":""}>${it}</option>`).join(""),re.includes(pe.value)||(pe.value=re[0])}const sa=document.getElementById("mg-file");sa&&(sa.accept=y==="transcribe"?"audio/*":"image/*"),te&&(te.textContent=e(y==="edit"?"media.editSubmit":y==="video"?"media.videoSubmit":y==="speech"?"media.speechSubmit":y==="transcribe"?"media.transcribeSubmit":"media.generateSubmit"));const Je=document.getElementById("mg-prompt");Je&&(Je.placeholder=e(y==="edit"?"media.editPromptPh":y==="video"?"media.videoPromptPh":y==="speech"?"media.speechPromptPh":"media.generatePromptPh"));const W=document.getElementById("mg-drop-title"),be=document.getElementById("mg-drop-hint");W&&(W.textContent=e(y==="video"?"media.dropTitleVideo":y==="transcribe"?"media.dropTitleAudio":"media.dropTitle")),be&&(be.textContent=e(y==="video"?"media.dropHintVideo":y==="transcribe"?"media.dropHintAudio":"media.dropHint"))};document.querySelectorAll("[data-mg-mode]").forEach(P=>{P.addEventListener("click",()=>T(P.getAttribute("data-mg-mode")||"generate"))}),T("generate");const N=document.getElementById("mg-dropzone"),Q=document.getElementById("mg-file"),z=P=>P?P.type&&P.type.startsWith("image/")?!0:/\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(P.name||""):!1,ue=P=>P?P.type&&P.type.startsWith("audio/")?!0:/\.(wav|mp3|m4a|aac|ogg|oga|flac|opus|webm)$/i.test(P.name||""):!1,G=P=>{const K=y==="transcribe"?ue:z,Y=[...P||[]].find(K);if(!Y){j(e(y==="transcribe"?"media.sourceNeedAudio":"media.sourceNeedImage"));return}O({kind:"file",file:Y,name:Y.name,mime:Y.type||(y==="transcribe"?"audio/*":"image/*")}),j("")};if(document.getElementById("mg-pick-file")?.addEventListener("click",P=>{P.preventDefault(),P.stopPropagation(),Q?.click()}),Q?.addEventListener("change",()=>{Q.files?.length&&G(Q.files)}),document.getElementById("mg-clear-source")?.addEventListener("click",P=>{P.preventDefault(),P.stopPropagation(),O(null)}),document.getElementById("mg-pick-lib")?.addEventListener("click",P=>{P.preventDefault(),P.stopPropagation(),ro({imagesOnly:y!=="transcribe",audioOnly:y==="transcribe",onPick:K=>{O({kind:K.kind,id:K.id,name:K.name,mime:K.mime}),j("")}}).catch(K=>j(K.message||e("media.libraryLoadFail")))}),N&&(N.addEventListener("click",P=>{P.target.closest("button")||Q?.click()}),N.addEventListener("keydown",P=>{(P.key==="Enter"||P.key===" ")&&(P.preventDefault(),Q?.click())}),["dragenter","dragover"].forEach(P=>{N.addEventListener(P,K=>{K.preventDefault(),K.stopPropagation(),N.classList.add("is-dragover")})}),["dragleave","drop"].forEach(P=>{N.addEventListener(P,K=>{K.preventDefault(),K.stopPropagation(),N.classList.remove("is-dragover")})}),N.addEventListener("drop",P=>{const K=P.dataTransfer;K?.files?.length&&G(K.files)})),l._mediaDragAbort)try{l._mediaDragAbort.abort()}catch{}l._mediaDragAbort=new AbortController;const ee={signal:l._mediaDragAbort.signal},_=document.getElementById("app");let X=0;window.addEventListener("dragenter",P=>{y==="generate"||y==="speech"||[...P.dataTransfer?.types||[]].includes("Files")&&(X+=1,_?.classList.add("is-media-file-drag"))},ee),window.addEventListener("dragleave",()=>{X=Math.max(0,X-1),X===0&&_?.classList.remove("is-media-file-drag")},ee),window.addEventListener("drop",P=>{X=0,_?.classList.remove("is-media-file-drag"),!(y==="generate"||y==="speech")&&P.dataTransfer?.files?.length&&(P.preventDefault(),G(P.dataTransfer.files))},ee),window.addEventListener("dragover",P=>{y==="generate"||y==="speech"||[...P.dataTransfer?.types||[]].includes("Files")&&P.preventDefault()},ee),document.getElementById("mg-submit")?.addEventListener("click",async()=>{const P=document.getElementById("mg-prompt")?.value?.trim()||"";if(!P&&y!=="transcribe"){j(e("media.generateNeedPrompt"));return}const K=document.getElementById("mg-key")?.value||"",Y=document.getElementById("mg-model")?.value||void 0,fe=document.getElementById("mg-format")?.value||void 0,_e=document.getElementById("mg-aspect")?.value||"1:1",Ve=Math.min(4,Math.max(1,Number(document.getElementById("mg-n")?.value)||1)),Ee=document.getElementById("mg-submit"),te=document.getElementById("mg-status"),pe=e(y==="video"?"media.videoBusy":y==="edit"?"media.editBusy":y==="speech"?"media.speechBusy":y==="transcribe"?"media.transcribeBusy":"media.generateBusy");Ee&&(Ee.disabled=!0,Ee.textContent=pe),te&&(te.hidden=!1,te.textContent=pe),j("");try{if(y==="edit"){if(!$)throw new Error(e("media.editNeedImage"));const W=new FormData;W.append("prompt",P),W.append("aspect_ratio",_e),W.append("n",String(Ve)),W.append("response_format","url"),Y&&W.append("model",Y),K&&W.append("apiKeyId",K),$.kind==="file"&&$.file?W.append("image",$.file):$.kind==="asset"&&$.id?W.append("sourceAssetId",$.id):$.kind==="document"&&$.id&&W.append("sourceDocumentId",$.id),await Ft(await fetch("/admin/api/media/edit",{method:"POST",headers:{Authorization:`Bearer ${l.key}`},body:W})),te&&(te.textContent=e("media.editOk")),l.mediaFilter.tab="assets",l.mediaFilter.offset=0,await $e();return}if(y==="speech"){if(!P)throw new Error(e("media.generateNeedPrompt"));const be=(await x("/media/speech",{method:"POST",body:JSON.stringify({input:P,...Y?{model:Y}:{},...K?{apiKeyId:K}:{},...fe?{format:fe}:{}})}))?.data?.asset_id;if(te&&(te.textContent=e("media.speechOk")),l.mediaFilter.tab="assets",l.mediaFilter.offset=0,await $e(),be)try{const re=await I(be);Lt({id:be,mime:re.type||"audio/wav",filename:`speech-${String(be).slice(0,8)}.wav`,kind:"audio",bytes:re.size,prompt:P},re)}catch{}return}if(y==="transcribe"){if(!$)throw new Error(e("media.transcribeNeedAudio"));const W=new FormData;K&&W.append("apiKeyId",K),fe&&W.append("format",fe),$.kind==="file"&&$.file?W.append("file",$.file):$.kind==="asset"&&$.id?W.append("sourceAssetId",$.id):$.kind==="document"&&$.id&&W.append("sourceDocumentId",$.id);const be=await Ft(await fetch("/admin/api/media/transcribe",{method:"POST",headers:{Authorization:`Bearer ${l.key}`},body:W})),re=be?.data?.asset_id,Fe=be?.data?.text||"";if(te&&(te.textContent=Fe?`${e("media.transcribeOk")} ${Fe.slice(0,120)}`:e("media.transcribeOk")),l.mediaFilter.tab="assets",l.mediaFilter.offset=0,await $e(),re)try{const it=await I(re);Lt({id:re,mime:"text/plain",filename:`transcript-${String(re).slice(0,8)}.txt`,kind:"file",bytes:it.size,prompt:Fe.slice(0,200)},it)}catch{}return}if(y==="video"){const W=new FormData;W.append("prompt",P),W.append("aspect_ratio",_e),W.append("seconds",String(document.getElementById("mg-duration")?.value||6)),Y&&W.append("model",Y),K&&W.append("apiKeyId",K),fe&&W.append("format",fe);const be=document.getElementById("mg-voice")?.value||"";be&&W.append("voices",be),$?.kind==="file"&&$.file?W.append("image",$.file):$?.kind==="asset"&&$.id?W.append("source_asset_id",$.id):$?.kind==="document"&&$.id&&W.append("source_document_id",$.id),await Ft(await fetch("/admin/api/media/videos",{method:"POST",headers:{Authorization:`Bearer ${l.key}`},body:W})),te&&(te.textContent=e("media.videoOk")),l.mediaFilter.tab="jobs",await $e();return}const ye={prompt:P,aspect_ratio:_e,n:Ve,response_format:"url"};Y&&(ye.model=Y),K&&(ye.apiKeyId=K),fe&&(ye.format=fe);const Je=(await x("/media/generate",{method:"POST",body:JSON.stringify(ye)}))?.data?.grok?.asset_ids||[];if(te&&(te.textContent=e("media.generateOk")),l.mediaFilter.tab="assets",l.mediaFilter.offset=0,await $e(),Je[0])try{const W=await I(Je[0]);Lt({id:Je[0],mime:W.type||"image/png",filename:`generated-${String(Je[0]).slice(0,8)}`,kind:"image",bytes:W.size,prompt:P},W)}catch{}}catch(ye){h(ye),te&&(te.textContent=ye.message||e("media.generateFail")),Ee&&(Ee.disabled=!1,T(y))}})}(s==="assets"||s==="jobs")&&Ge(l.mediaFilter,()=>$e().catch(h)),s==="assets"&&(ht("media",l.mediaFilter,()=>$e().catch(h)),document.querySelector("#media-tab-assets [data-filter-apply]")?.addEventListener("click",()=>{l.mediaFilter.q=document.getElementById("mf-q")?.value.trim()||"",l.mediaFilter.kind=document.getElementById("mf-kind")?.value||"",l.mediaFilter.provider=document.getElementById("mf-provider")?.value.trim()||"",l.mediaFilter.from=document.getElementById("mf-from")?.value||"",l.mediaFilter.to=document.getElementById("mf-to")?.value||"",l.mediaFilter.offset=0,$e().catch(h)}),document.querySelector("#media-tab-assets [data-filter-reset]")?.addEventListener("click",()=>{const y=l.mediaFilter.tab;l.mediaFilter={tab:y,q:"",kind:"",provider:"",from:"",to:"",sortBy:"createdAt",sortDir:"desc",jobSortBy:"createdAt",jobSortDir:"desc",limit:20,offset:0},$e().catch(h)}),document.querySelectorAll("[data-media-preview]").forEach(y=>{y.addEventListener("click",async()=>{try{const $=y.getAttribute("data-media-preview");if(!$)return;const v=y.getAttribute("data-media-mime")||"",O=y.getAttribute("data-media-name")||"",T=y.getAttribute("data-media-kind")||"",N=y.getAttribute("data-media-bytes")||"",Q=y.getAttribute("data-media-prompt")||"",z=await I($);Lt({id:$,mime:v||z.type||"",filename:O,kind:T,bytes:N?Number(N):z.size,prompt:Q},z)}catch($){h($)}})}),document.querySelectorAll("[data-media-dl]").forEach(y=>{y.addEventListener("click",async()=>{try{const $=y.getAttribute("data-media-dl"),v=y.getAttribute("data-media-name")||"",O=await I($),T=document.createElement("a");T.href=URL.createObjectURL(O),T.download=v||`media-${String($).slice(0,8)}`,T.click(),setTimeout(()=>URL.revokeObjectURL(T.href),3e4)}catch($){h($)}})}),document.querySelectorAll("[data-media-del]").forEach(y=>{y.addEventListener("click",async()=>{const $=y.getAttribute("data-media-del");if(await Z({message:e("media.deleteConfirm"),variant:"danger",confirmText:e("media.delete")}))try{await x(`/media/assets/${$}`,{method:"DELETE"}),await $e()}catch(v){h(v)}})}))}async function ro(a){const s=!!a.audioOnly,o=!s&&a.imagesOnly!==!1;let n="documents",i=0,r=null;vt({title:e("media.libraryTitle"),subtitle:t(e("media.librarySubtitle")),size:"md",bodyHtml:`
      <div class="chat-lib media-lib">
        <div class="seg-tabs" role="tablist" style="margin-bottom:0.75rem">
          <button type="button" class="seg-tab is-active" data-mlib-tab="documents">${t(e("media.libraryTabDocs"))}</button>
          <button type="button" class="seg-tab" data-mlib-tab="assets">${t(e("media.libraryTabAssets"))}</button>
        </div>
        <div class="chat-lib-toolbar">
          <input type="search" id="mlib-q" class="chat-lib-search" placeholder="${t(e("media.librarySearch"))}" autocomplete="off" />
          <span class="muted chat-lib-count" id="mlib-count"></span>
        </div>
        <div class="muted chat-lib-formats">${t(e(s?"media.libraryFormatsAudio":"media.libraryFormats"))}</div>
        <div id="mlib-list" class="chat-lib-list" role="listbox">
          <div class="muted chat-lib-status">${t(e("common.loading")||"…")}</div>
        </div>
      </div>`,footerHtml:`
      <button type="button" class="btn secondary sm" id="mlib-cancel">${t(e("common.cancel"))}</button>
      <button type="button" class="btn sm" id="mlib-add" disabled>${t(e("media.librarySelect"))}</button>`});const d=document.getElementById("mlib-list"),u=document.getElementById("mlib-q"),m=document.getElementById("mlib-add");document.getElementById("mlib-cancel")?.addEventListener("click",()=>we());const g=()=>{m&&(m.disabled=!r,m.textContent=r?`${e("media.librarySelect")} · ${r.name.slice(0,24)}`:e("media.librarySelect"))},c=E=>String(E||"").startsWith("image/"),b=E=>/\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(String(E||"")),p=E=>String(E||"").startsWith("audio/"),f=E=>/\.(wav|mp3|m4a|aac|ogg|oga|flac|opus|webm)$/i.test(String(E||"")),k=(E,B)=>s?p(E)||f(B):o?c(E)||b(B):!0,M=E=>{if(d){if(!E.length){d.innerHTML=`<div class="data-empty chat-lib-empty"><strong>${t(e("media.libraryEmpty"))}</strong></div>`;return}d.innerHTML=E.map(B=>{const F=r?.id===B.id&&r?.kind===B.kind;return`
          <label class="chat-lib-row ${F?"is-selected":""}" data-kind="${t(B.kind)}" data-id="${t(B.id)}">
            <input type="radio" name="mlib-pick" ${F?"checked":""} />
            <span class="chat-lib-meta">
              <span class="chat-lib-name" title="${t(B.name)}">${t(B.name)}</span>
              <span class="muted">${t(B.kindLabel)} · ${t(B.mime||"—")}${B.size!=null?` · ${Ce(B.size)}`:""}</span>
            </span>
          </label>`}).join(""),d.querySelectorAll(".chat-lib-row").forEach(B=>{B.addEventListener("click",()=>{const F=B.getAttribute("data-kind"),S=B.getAttribute("data-id"),w=E.find(A=>A.id===S&&A.kind===F);w&&(r={kind:w.kind,id:w.id,name:w.name,mime:w.mime},d.querySelectorAll(".chat-lib-row").forEach(A=>{A.classList.toggle("is-selected",A.getAttribute("data-id")===S&&A.getAttribute("data-kind")===F);const I=A.querySelector("input");I&&(I.checked=A.getAttribute("data-id")===S&&A.getAttribute("data-kind")===F)}),g())})})}},L=async()=>{const E=++i;d&&(d.innerHTML=`<div class="muted chat-lib-status">${t(e("common.loading")||"…")}</div>`);try{const B=(u?.value||"").trim();let F=[];if(n==="assets"){const S=new URLSearchParams({limit:"80",offset:"0"});B&&S.set("q",B),o&&S.set("kind","image"),s&&S.set("kind","audio"),F=((await x(`/media/assets?${S}`)).data||[]).filter(A=>k(A.mime,A.filename)).map(A=>({kind:"asset",kindLabel:e("media.sourceKindAsset"),id:A.id,name:A.filename||A.prompt||A.id,mime:A.mime||"",size:A.bytes}))}else{const S=new URLSearchParams({limit:"80",offset:"0"});B&&S.set("q",B),F=((await x(`/documents?${S}`)).data||[]).filter(A=>k(A.mimeType,A.originalName)).map(A=>({kind:"document",kindLabel:e("media.sourceKindDocument"),id:A.id,name:A.originalName||A.id,mime:A.mimeType||"",size:A.sizeBytes}))}if(E!==i)return;M(F)}catch(B){if(E!==i)return;d&&(d.innerHTML=`<div class="error-box">${t(B.message||e("media.libraryLoadFail"))}</div>`)}};document.querySelectorAll("[data-mlib-tab]").forEach(E=>{E.addEventListener("click",()=>{n=E.getAttribute("data-mlib-tab")==="assets"?"assets":"documents",document.querySelectorAll("[data-mlib-tab]").forEach(B=>{B.classList.toggle("is-active",B.getAttribute("data-mlib-tab")===n)}),r=null,g(),L()})});let U=null;u?.addEventListener("input",()=>{U&&clearTimeout(U),U=setTimeout(()=>L(),280)}),m?.addEventListener("click",()=>{r&&(a.onPick(r),we())}),g(),await L()}async function ge(){const a=l.usageFilter;a.sortBy||(a.sortBy="lastUsedAt"),a.sortDir||(a.sortDir="desc"),a.modelSortBy||(a.modelSortBy="requests"),a.modelSortDir||(a.modelSortDir="desc");const s=new URLSearchParams;Te(s,a),a.modelSortBy&&s.set("modelSortBy",a.modelSortBy),(a.modelSortDir==="asc"||a.modelSortDir==="desc")&&s.set("modelSortDir",a.modelSortDir);const{data:o}=await x(`/usage?${s}`),n=o.totals||{},i=o.limits||{},r=a.pageSize||10;let d=o.byModel||[];if(a.modelQ.trim()){const S=a.modelQ.trim().toLowerCase();d=d.filter(w=>String(w.model||"").toLowerCase().includes(S))}const u=d.length,g=d.slice(a.modelPage*r,a.modelPage*r+r).map(S=>`<tr><td class="cell-primary">${t(S.model)}</td><td>${S.requests}</td></tr>`).join("");let c=o.perKey||[];if(a.keyQ.trim()){const S=a.keyQ.trim().toLowerCase();c=c.filter(w=>String(w.name||"").toLowerCase().includes(S)||String(w.keyPrefix||"").toLowerCase().includes(S))}a.keyActive==="true"&&(c=c.filter(S=>S.isActive)),a.keyActive==="false"&&(c=c.filter(S=>!S.isActive));const b=c.length,f=c.slice(a.keyPage*r,a.keyPage*r+r).map(S=>{const w=Math.round((S.utilization||0)*100);return`<tr>
        <td><div class="cell-primary">${t(S.name)}</div><div class="cell-sub">${t(S.keyPrefix)}</div></td>
        <td>${S.requests}</td>
        <td>${as(S.rateLimit)}</td>
        <td>
          <div>${q("common.percent",{n:w})}</div>
          <div class="usage-bar ${w>80?"warn":""}"><span style="width:${w}%"></span></div>
        </td>
        <td>${S.isActive?`<span class="badge success">${t(e("common.active"))}</span>`:`<span class="badge error">${t(e("common.revoked"))}</span>`}</td>
        <td class="muted">${S.lastUsedAt?se(S.lastUsedAt):"—"}</td>
      </tr>`}).join(""),k=Le({total:u,limit:r,offset:a.modelPage*r,idPrefix:"umodel"}),M=Le({total:b,limit:r,offset:a.keyPage*r,idPrefix:"ukey"}),L=a.tab==="key"?"key":"model",U=Oe({title:e("usage.byModel"),hint:e("common.filterHint"),searchHtml:`<div class="data-filter-search"><label>${t(e("common.search"))}<input type="search" id="uf-model" value="${t(a.modelQ)}" placeholder="${t(e("chats.model"))}" /></label></div>`,gridHtml:""}),E=Pe({headHtml:`
      ${R({field:"model",label:e("chats.model"),filterRef:a,sortByKey:"modelSortBy",sortDirKey:"modelSortDir"})}
      ${R({field:"requests",label:e("usage.requests"),filterRef:a,sortByKey:"modelSortBy",sortDirKey:"modelSortDir"})}`,bodyHtml:g,colSpan:2,emptyText:e("common.empty"),pagerHtml:k}),B=Oe({title:e("usage.byKey"),hint:e("common.filterHint"),searchHtml:`<div class="data-filter-search"><label>${t(e("common.search"))}<input type="search" id="uf-key" value="${t(a.keyQ)}" placeholder="${t(e("keys.name"))}" /></label></div>`,gridHtml:`<label>${t(e("keys.status"))}
      <select id="uf-active">
        <option value="">${t(e("common.all"))}</option>
        <option value="true" ${a.keyActive==="true"?"selected":""}>${t(e("common.active"))}</option>
        <option value="false" ${a.keyActive==="false"?"selected":""}>${t(e("common.revoked"))}</option>
      </select>
    </label>`}),F=Pe({headHtml:`
      ${R({field:"name",label:e("keys.name"),filterRef:a})}
      ${R({field:"requests",label:e("usage.requests"),filterRef:a})}
      ${R({field:"rateLimit",label:e("usage.rateLimit"),filterRef:a})}
      ${R({field:"utilization",label:e("usage.util"),filterRef:a})}
      ${R({field:"isActive",label:e("keys.status"),filterRef:a})}
      ${R({field:"lastUsedAt",label:e("usage.lastUsed")||e("media.created"),filterRef:a})}`,bodyHtml:f,colSpan:6,emptyText:e("common.empty"),pagerHtml:M});document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("usage.title"))}</h2>
      <button class="btn secondary sm" id="btn-usage-refresh">${t(e("usage.refresh"))}</button>
    </div>
    ${ve([`${e("usage.window")}: ${se(o.from)} → ${se(o.to)} (${q("common.minutes",{n:o.windowMinutes})})`])}
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
        <button type="button" role="tab" class="seg-tab ${L==="model"?"is-active":""}" data-usage-tab="model" aria-selected="${L==="model"}">
          ${t(e("usage.byModel"))}
          <span class="seg-tab-count">${u}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${L==="key"?"is-active":""}" data-usage-tab="key" aria-selected="${L==="key"}">
          ${t(e("usage.byKey"))}
          <span class="seg-tab-count">${b}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane" id="usage-tab-model" ${L==="model"?"":"hidden"}>
          ${U}
          ${E}
        </div>
        <div class="usage-tab-pane" id="usage-tab-key" ${L==="key"?"":"hidden"}>
          ${B}
          ${F}
        </div>
      </div>
    </div>
  `),ie(),Ge(l.usageFilter,()=>ge().catch(h)),document.getElementById("btn-usage-refresh").onclick=()=>ge().catch(h),document.querySelectorAll("[data-usage-tab]").forEach(S=>{S.onclick=()=>{const w=S.dataset.usageTab==="key"?"key":"model";l.usageFilter.tab!==w&&(l.usageFilter.tab=w,ge().catch(h))}}),document.getElementById("umodel-prev")?.addEventListener("click",()=>{l.usageFilter.modelPage=Math.max(0,a.modelPage-1),ge().catch(h)}),document.getElementById("umodel-next")?.addEventListener("click",()=>{(a.modelPage+1)*r<u&&(l.usageFilter.modelPage+=1,ge().catch(h))}),document.getElementById("umodel-limit")?.addEventListener("change",S=>{l.usageFilter.pageSize=Number(S.target.value)||10,l.usageFilter.modelPage=0,ge().catch(h)}),document.getElementById("ukey-prev")?.addEventListener("click",()=>{l.usageFilter.keyPage=Math.max(0,a.keyPage-1),ge().catch(h)}),document.getElementById("ukey-next")?.addEventListener("click",()=>{(a.keyPage+1)*r<b&&(l.usageFilter.keyPage+=1,ge().catch(h))}),document.getElementById("ukey-limit")?.addEventListener("change",S=>{l.usageFilter.pageSize=Number(S.target.value)||10,l.usageFilter.keyPage=0,ge().catch(h)}),document.querySelectorAll("#usage-tab-model [data-filter-apply]").forEach(S=>{S.onclick=()=>{l.usageFilter.modelQ=document.getElementById("uf-model")?.value?.trim()||"",l.usageFilter.modelPage=0,ge().catch(h)}}),document.querySelectorAll("#usage-tab-model [data-filter-reset]").forEach(S=>{S.onclick=()=>{l.usageFilter.modelQ="",l.usageFilter.modelPage=0,ge().catch(h)}}),document.querySelectorAll("#usage-tab-key [data-filter-apply]").forEach(S=>{S.onclick=()=>{l.usageFilter.keyQ=document.getElementById("uf-key")?.value?.trim()||"",l.usageFilter.keyActive=document.getElementById("uf-active")?.value||"",l.usageFilter.keyPage=0,ge().catch(h)}}),document.querySelectorAll("#usage-tab-key [data-filter-reset]").forEach(S=>{S.onclick=()=>{l.usageFilter.keyQ="",l.usageFilter.keyActive="",l.usageFilter.keyPage=0,ge().catch(h)}})}function Na(a){const s=a.versionStatus||(a.updateAvailable?"update_available":a.latest?"up_to_date":"unknown");return s==="update_available"?{badge:`<span class="badge warn" title="${t(e("system.statusHintUpdate"))}">${t(e("system.badgeUpdate"))}</span>`,hint:e("system.statusHintUpdate")}:s==="ahead"?{badge:`<span class="badge pending" title="${t(e("system.statusHintAhead"))}">${t(e("system.badgeAhead"))}</span>`,hint:e("system.statusHintAhead")}:s==="up_to_date"?{badge:`<span class="badge success" title="${t(e("system.statusHintOk"))}">${t(e("system.badgeOk"))}</span>`,hint:e("system.statusHintOk")}:{badge:`<span class="badge pending" title="${t(e("system.statusHintUnknown"))}">${t(e("system.badgeUnknown"))}</span>`,hint:e("system.statusHintUnknown")}}function co(a){return e(a==="git"?"system.channelGit":a==="npm-global"?"system.channelNpmGlobal":a==="npm-local"?"system.channelNpmLocal":"system.channelUnknown")}function uo(a){return a==="required"?e("system.levelRequired"):a==="recommended"?e("system.levelRecommended"):a==="optional"?e("system.levelOptional"):a==="bundled"?e("system.levelBundled"):a||"—"}function mo(a){return a.installed?a.ok?`<span class="badge success">${t(e("system.softOk"))}</span>`:`<span class="badge warn">${t(e("system.softWarn"))}</span>`:a.level==="required"||a.level==="bundled"?`<span class="badge error">${t(e("system.softMissing"))}</span>`:`<span class="badge pending">${t(e("system.softMissing"))}</span>`}function Ka(a){return a==="up"?`<span class="badge success">${t(e("system.up"))}</span>`:`<span class="badge error">${t(e("system.down"))}</span>`}async function rt(){const{data:a}=await x("/system");if(l.page!=="system")return;const s=a.version||{},o=Na(s),n=a.software||{checks:[],allRequiredOk:!0},i=n.checks||[],r=l.systemTab==="package"||l.systemTab==="env"||l.systemTab==="sessions"?l.systemTab:"software";l.systemTab=r;let d={data:[],total:0};try{const w=new URLSearchParams({limit:r==="sessions"?"50":"1",offset:"0"});r==="sessions"&&l.grokSessionQ&&w.set("q",l.grokSessionQ);const A=await x(`/grok/sessions?${w}`);d={data:A.data||[],total:A.total||0}}catch(w){d={data:[],total:0,error:w.message||String(w)}}const u=i.map(w=>`
      <tr>
        <td><div class="cell-primary">${t(w.name||w.id)}</div>${w.requiredVersion?`<div class="cell-sub">${t(w.requiredVersion)}</div>`:""}</td>
        <td>${t(uo(w.level))}</td>
        <td>${t(w.installed?e("system.yes"):e("system.no"))}${w.path?`<div class="cell-sub soft-path">${t(w.path)}</div>`:""}</td>
        <td><code class="cell-code">${t(w.version||"—")}</code></td>
        <td>${mo(w)}</td>
        <td class="muted">${t(w.detail||"")}</td>
      </tr>`).join(""),m=n.allRequiredOk?`<span class="badge success">${t(e("system.allRequiredOk"))}</span>`:`<span class="badge error">${t(e("system.requiredMissing"))}</span>`,g=a.encryption&&a.encryption.ready,c=co(s.channel),b=s.installSource?`${c} · ${s.installSource}`:c,p=Pe({headHtml:`
      <th>${t(e("system.softName"))}</th>
      <th>${t(e("system.softLevel"))}</th>
      <th>${t(e("system.softInstalled"))}</th>
      <th>${t(e("system.softVersion"))}</th>
      <th>${t(e("system.softStatus"))}</th>
      <th>${t(e("system.softDetail"))}</th>`,bodyHtml:u,colSpan:6,emptyText:e("common.empty")}),f=`
    <div class="grid system-kpi-grid" id="system-kpi-grid">
      <div class="card">
        <div class="label">${t(e("system.database"))}</div>
        <div class="value value-sm">${Ka(a.database)}</div>
        <div class="muted card-sub">${t(e("system.runtime"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("system.grokCli"))}</div>
        <div class="value value-sm">${Ka(a.grokCli)}</div>
        <div class="muted card-sub">${t(a.grokInspect?.grokVersion?`${a.grokInspect.grokVersion}${a.grokInspect.channel?` · ${a.grokInspect.channel}`:""}`:e("system.runtime"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("system.concurrency"))}</div>
        <div class="value value-sm">${a.concurrency?.active??0}<span class="dash-kpi-den">/${a.concurrency?.max??"—"}</span></div>
        <div class="muted card-sub">${t(e("system.concurrency"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("system.encryption"))}</div>
        <div class="value value-sm">${g?`<span class="badge success">${t(e("system.ready"))}</span>`:`<span class="badge error">${t(e("system.notReady"))}</span>`}</div>
        <div class="muted card-sub">${t(e("system.runtime"))}</div>
      </div>
    </div>`,k=a.grokInspect,M=k?[[e("system.grokVersion"),k.grokVersion||"—"],[e("system.inspectChannel"),k.channel||"—"],[e("system.inspectDefaultModel"),k.defaultModel||"—"],[e("system.inspectModels"),String(k.models?.length??0)],[e("system.inspectSkills"),String(k.skills??0)],[e("system.inspectMcp"),String(k.mcpServers??0)],[e("system.inspectPlugins"),String(k.plugins??0)],[e("system.inspectHooks"),String(k.hooks??0)]]:[],L=k?`
    <div class="panel system-inspect-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("system.grokInspect"))}</strong>
          <span class="muted panel-h-sub">${t(e("system.grokInspectHint"))}</span>
        </div>
      </div>
      <div class="panel-pad">
        <div class="grid system-inspect-grid">
          ${M.map(([w,A])=>`
            <div class="card">
              <div class="label">${t(w)}</div>
              <div class="value value-sm">${t(A)}</div>
            </div>`).join("")}
        </div>
        ${k.error?`<div class="error-box">${t(k.error)}</div>`:""}
      </div>
    </div>`:"",U=`
    <div class="system-tab-toolbar">
      <span class="muted">${t(e("system.softwareHint"))}</span>
      ${m}
    </div>
    ${L}
    ${p}`,E=`
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
          <div class="card"><div class="label">${t(e("system.install"))}</div><div class="value value-sm">${t(b)}</div></div>
        </div>
        <pre id="update-log" class="pre" style="display:none;margin-top:12px"></pre>
      </div>
    </div>`,B=`
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
    </div>`,F=(d.data||[]).map(w=>`
      <tr>
        <td><code class="cell-code">${t(w.id)}</code></td>
        <td><div class="cell-primary">${t(w.title||"—")}</div>
          <div class="cell-sub">${t(w.summary||"")}</div></td>
        <td class="muted">${t(w.cwd||"—")}</td>
        <td>${t((w.updatedAt||"").slice(0,19).replace("T"," ")||"—")}</td>
        <td>${w.messageCount!=null?w.messageCount:"—"}</td>
        <td><button type="button" class="btn danger sm" data-del-gsess="${t(w.id)}">${t(e("system.sessionDelete"))}</button></td>
      </tr>`).join(""),S=`
    <div class="system-tab-toolbar">
      <span class="muted">${t(e("system.sessionsHint"))}</span>
      <form id="gsess-search" class="inline-form">
        <input type="search" id="gsess-q" value="${t(l.grokSessionQ||"")}" placeholder="${t(e("system.sessionsSearch"))}" />
        <button type="submit" class="btn secondary sm">${t(e("common.search")||"Search")}</button>
      </form>
    </div>
    ${d.error?`<div class="error-box">${t(d.error)}</div>`:""}
    ${Pe({headHtml:`
        <th>${t(e("system.sessionId"))}</th>
        <th>${t(e("system.sessionTitle"))}</th>
        <th>${t(e("system.sessionCwd"))}</th>
        <th>${t(e("system.sessionUpdated"))}</th>
        <th>${t(e("chats.msgs")||"#")}</th>
        <th></th>`,bodyHtml:F,colSpan:6,emptyText:e("common.empty")})}
    <div class="muted">${t(String(d.total||0))}</div>`;document.getElementById("app").innerHTML=ne(`
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
        <button type="button" role="tab" class="seg-tab ${r==="software"?"is-active":""}" data-system-tab="software" aria-selected="${r==="software"}">
          ${t(e("system.tabSoftware"))}
          <span class="seg-tab-count">${i.length}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${r==="package"?"is-active":""}" data-system-tab="package" aria-selected="${r==="package"}">
          ${t(e("system.tabPackage"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${r==="env"?"is-active":""}" data-system-tab="env" aria-selected="${r==="env"}">
          ${t(e("system.tabEnv"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${r==="sessions"?"is-active":""}" data-system-tab="sessions" aria-selected="${r==="sessions"}">
          ${t(e("system.tabSessions"))}
          <span class="seg-tab-count">${d.total}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane system-tab-pane-software" id="system-tab-software" ${r==="software"?"":"hidden"}>
          ${U}
        </div>
        <div class="usage-tab-pane system-tab-pane-package" id="system-tab-package" ${r==="package"?"":"hidden"}>
          ${E}
        </div>
        <div class="usage-tab-pane system-tab-pane-env" id="system-tab-env" ${r==="env"?"":"hidden"}>
          ${B}
        </div>
        <div class="usage-tab-pane system-tab-pane-sessions" id="system-tab-sessions" ${r==="sessions"?"":"hidden"}>
          ${S}
        </div>
      </div>
    </div>
  `),ie(),document.getElementById("gsess-search")?.addEventListener("submit",w=>{w.preventDefault(),l.grokSessionQ=document.getElementById("gsess-q")?.value||"",rt().catch(h)}),document.querySelectorAll("[data-del-gsess]").forEach(w=>{w.addEventListener("click",async()=>{const A=w.getAttribute("data-del-gsess");if(!(!A||!await Z({title:e("system.sessionDelete"),message:e("system.sessionDeleteConfirm").replace("{id}",A)})))try{await x(`/grok/sessions/${encodeURIComponent(A)}`,{method:"DELETE"}),await rt()}catch(y){h(y)}})}),document.querySelectorAll("[data-system-tab]").forEach(w=>{w.addEventListener("click",()=>{const A=w.getAttribute("data-system-tab")||"software",I=A==="package"||A==="env"||A==="software"||A==="sessions"?A:"software";l.systemTab!==I&&(l.systemTab=I,rt().catch(h))})}),document.getElementById("btn-check-update").onclick=async()=>{try{const A=(await x("/system/update-check")).data||{},I=Na(A);await he({title:e("system.checkResult"),message:`${e("system.current")}: ${A.current||"?"}
${e("system.npm")}: ${A.latestNpm||"n/a"}
${e("system.github")}: ${A.latestGithub||"n/a"}
${I.hint}`}),l.systemTab="package",rt().catch(h)}catch(w){h(w)}},document.getElementById("btn-one-click-update").onclick=async()=>{if(!await Z({message:e("system.confirmUpdate"),variant:"danger",confirmText:e("system.oneClick")}))return;l.systemTab!=="package"&&(l.systemTab="package",await rt());const w=document.getElementById("update-log");try{const A=document.getElementById("btn-one-click-update");A&&(A.disabled=!0);const I=await x("/system/update",{method:"POST",body:JSON.stringify({restart:!0})});w&&(w.style.display="block",w.textContent=I.data&&(I.data.message||JSON.stringify(I.data,null,2))||e("system.scheduled")),await he(I.data&&I.data.message||e("system.scheduled"))}catch(A){h(A)}}}function ya(a){if(!a)return"—";const s=`ddos.sources.${a}`,o=e(s);return o===s?a:o}function qe(a){return Math.max(1,Math.round(Number(a||0)/1e3))}function Ae(a){return Math.max(1,Math.round(Number(a||0)/6e4))}function $t(a){return Math.max(1e3,Math.round(Number(a||0)*1e3))}function kt(a){return Math.max(1e3,Math.round(Number(a||0)*6e4))}function J(a,s){const o=Number(document.getElementById(a)?.value);return Number.isFinite(o)?o:s}function lt(a){return document.getElementById(a)?.checked===!0}function ba(){const a=(document.getElementById("dp-whitelist")?.value||"").split(/[\n,]+/).map(n=>n.trim()).filter(Boolean),s=(document.getElementById("dp-trustedProxies")?.value||"").split(/[\n,]+/).map(n=>n.trim()).filter(Boolean);return{autoBanEnabled:document.getElementById("ddos-master-autoban")?tt("ddos-master-autoban"):lt("dp-autoBanEnabled")||document.getElementById("dp-autoBanEnabled")?.value==="1",rateLimitWindowMs:$t(J("dp-rateWindowSec",60)),rateLimitMax:Math.floor(J("dp-rateMaxKey",120)),rateLimitIpMax:Math.floor(J("dp-rateMaxIp",60)),chatBurstWindowMs:$t(J("dp-burstWindowSec",10)),chatBurstMax:Math.floor(J("dp-burstMax",20)),autoAuthEnabled:lt("dp-autoAuthEnabled"),failedAuthThreshold:Math.floor(J("dp-authThreshold",20)),failedAuthWindowMs:$t(J("dp-authWindowSec",300)),authBanDurationMs:kt(J("dp-authBanMin",10)),autoRateEnabled:lt("dp-autoRateEnabled"),rateHitThreshold:Math.floor(J("dp-rateHitThreshold",30)),rateHitWindowMs:$t(J("dp-rateHitWindowSec",60)),rateBanDurationMs:kt(J("dp-rateBanMin",15)),autoConnEnabled:lt("dp-autoConnEnabled"),maxConcurrentPerIp:Math.floor(J("dp-maxConcurrent",20)),connBanDurationMs:kt(J("dp-connBanMin",10)),autoVelocityEnabled:lt("dp-autoVelocityEnabled"),velocityMaxRequests:Math.floor(J("dp-velocityMax",200)),velocityWindowMs:$t(J("dp-velocityWindowSec",60)),velocityBanDurationMs:kt(J("dp-velocityBanMin",10)),escalateEnabled:lt("dp-escalateEnabled"),escalateAfterBans:Math.floor(J("dp-escalateAfter",3)),escalateDurationMs:kt(J("dp-escalateMin",1440)),whitelist:a,proxyTrustHops:Math.max(0,Math.min(10,Math.floor(J("dp-proxyTrustHops",1)))),proxyIpSource:document.getElementById("dp-proxyIpSource")?.value||"auto",trustedProxies:s.length?s:["127.0.0.1","::1"]}}const po=["autoBanEnabled","rateLimitWindowMs","rateLimitMax","rateLimitIpMax","chatBurstWindowMs","chatBurstMax","autoAuthEnabled","failedAuthThreshold","failedAuthWindowMs","authBanDurationMs","autoRateEnabled","rateHitThreshold","rateHitWindowMs","rateBanDurationMs","autoConnEnabled","maxConcurrentPerIp","connBanDurationMs","autoVelocityEnabled","velocityMaxRequests","velocityWindowMs","velocityBanDurationMs","escalateEnabled","escalateAfterBans","escalateDurationMs"];function Ua(a){if(!a)return{};const s={};for(const o of po){const n=a[o];typeof n=="boolean"?s[o]=n:typeof n=="number"&&Number.isFinite(n)?s[o]=Math.round(n):n==null?s[o]=null:s[o]=n}return s}function gs(a,s){return JSON.stringify(Ua(a))===JSON.stringify(Ua(s))}function ha(a){const s=l._ddosPresetsCache;if(!s||!a)return"custom";for(const o of["relaxed","balanced","strict"])if(s[o]&&gs(a,s[o]))return o;return"custom"}function Kt(a){return e(a==="relaxed"?"ddos.presetRelaxed":a==="balanced"?"ddos.presetBalanced":a==="strict"?"ddos.presetStrict":"ddos.presetCustom")}function fs(a,{unsaved:s=!1}={}){const o=Kt(a),n=a==="relaxed"?"relaxed":a==="balanced"?"balanced":a==="strict"?"strict":"custom",i=s?q("ddos.presetFormLabel",{name:o}):q("ddos.presetActiveLabel",{name:o});return`<span class="ddos-preset-badge is-${n}" id="ddos-preset-badge" title="${t(i)}">${t(i)}</span>`}function Re(){if(!document.getElementById("ddos-policy-panel"))return;let a;try{a=ba()}catch{return}const s=ha(a),o=ha(l._ddosPolicyCache||a),n=!gs(a,l._ddosPolicyCache||a);document.querySelectorAll("[data-ddos-preset]").forEach(u=>{const m=u.dataset.ddosPreset,g=m===s,c=m===o;u.classList.toggle("is-active",g),u.classList.toggle("is-saved",c&&!g),u.setAttribute("aria-pressed",g?"true":"false");const b=e(m==="relaxed"?"ddos.presetRelaxed":m==="balanced"?"ddos.presetBalanced":"ddos.presetStrict");g&&c?u.innerHTML=`${t(b)} <span class="preset-tag">${t(e("ddos.presetTagActive"))}</span>`:g&&n?u.innerHTML=`${t(b)} <span class="preset-tag preset-tag--draft">${t(e("ddos.presetTagDraft"))}</span>`:c?u.innerHTML=`${t(b)} <span class="preset-tag preset-tag--saved">${t(e("ddos.presetTagSaved"))}</span>`:u.textContent=b});const i=document.getElementById("ddos-preset-badge");if(i){const u=fs(s,{unsaved:n&&s!==o});i.outerHTML=u}const r=document.getElementById("ddos-preset-custom");r&&(r.classList.toggle("is-active",s==="custom"),r.setAttribute("aria-pressed",s==="custom"?"true":"false"));const d=document.getElementById("ddos-preset-hint");d&&(n&&s!==o?(d.textContent=q("ddos.presetUnsavedHint",{form:Kt(s),saved:Kt(o)}),d.hidden=!1):s==="custom"?(d.textContent=e("ddos.presetCustomHint"),d.hidden=!1):(d.textContent=q("ddos.presetActiveHint",{name:Kt(s)}),d.hidden=!1))}function ia(a){if(!a||!document.getElementById("dp-autoBanEnabled"))return;const s=(n,i)=>{const r=document.getElementById(n);r&&(r.type==="checkbox"?r.checked=!!i:r.value=i)},o=document.getElementById("dp-autoBanEnabled");o&&(o.type==="checkbox"?o.checked=!!a.autoBanEnabled:o.value=a.autoBanEnabled?"1":"0"),at("ddos-master-autoban",!!a.autoBanEnabled,e("ddos.masterOn"),e("ddos.masterOff")),ot("ddos-root",!a.autoBanEnabled),st("ddos-disabled-banner",!a.autoBanEnabled),s("dp-rateWindowSec",qe(a.rateLimitWindowMs)),s("dp-rateMaxKey",a.rateLimitMax),s("dp-rateMaxIp",a.rateLimitIpMax),s("dp-burstWindowSec",qe(a.chatBurstWindowMs)),s("dp-burstMax",a.chatBurstMax),s("dp-autoAuthEnabled",a.autoAuthEnabled),s("dp-authThreshold",a.failedAuthThreshold),s("dp-authWindowSec",qe(a.failedAuthWindowMs)),s("dp-authBanMin",Ae(a.authBanDurationMs)),s("dp-autoRateEnabled",a.autoRateEnabled),s("dp-rateHitThreshold",a.rateHitThreshold),s("dp-rateHitWindowSec",qe(a.rateHitWindowMs)),s("dp-rateBanMin",Ae(a.rateBanDurationMs)),s("dp-autoConnEnabled",a.autoConnEnabled),s("dp-maxConcurrent",a.maxConcurrentPerIp),s("dp-connBanMin",Ae(a.connBanDurationMs)),s("dp-autoVelocityEnabled",a.autoVelocityEnabled),s("dp-velocityMax",a.velocityMaxRequests),s("dp-velocityWindowSec",qe(a.velocityWindowMs)),s("dp-velocityBanMin",Ae(a.velocityBanDurationMs)),s("dp-escalateEnabled",a.escalateEnabled),s("dp-escalateAfter",a.escalateAfterBans),s("dp-escalateMin",Ae(a.escalateDurationMs)),s("dp-whitelist",(a.whitelist||[]).join(`
`)),s("dp-proxyTrustHops",a.proxyTrustHops??1),s("dp-proxyIpSource",a.proxyIpSource||"auto"),s("dp-trustedProxies",(a.trustedProxies&&a.trustedProxies.length?a.trustedProxies:["127.0.0.1","::1"]).join(`
`)),La(a.autoBanEnabled),Re()}function La(a){const s=document.getElementById("ddos-auto-badge");s&&(s.className=`badge ${a?"success":"pending"}`,s.textContent=e(a?"ddos.autoOn":"ddos.autoOff"))}function go(a){const s=(r,d)=>`<label class="data-filter-check policy-enable"><input type="checkbox" id="${r}" ${d?"checked":""} /> <span>${t(e("ddos.enableRule"))}</span></label>`,o=(r,d,u,m="1")=>`<label>${t(r)}<input type="number" id="${d}" value="${t(String(u))}" min="1" step="${m}" /></label>`,n=ha(a),i=fs(n);return`
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
            ${o(e("ddos.rateWindow"),"dp-rateWindowSec",qe(a.rateLimitWindowMs))}
            ${o(e("ddos.rateMaxKey"),"dp-rateMaxKey",a.rateLimitMax)}
            ${o(e("ddos.rateMaxIp"),"dp-rateMaxIp",a.rateLimitIpMax)}
            ${o(e("ddos.burstWindow"),"dp-burstWindowSec",qe(a.chatBurstWindowMs))}
            ${o(e("ddos.burstMax"),"dp-burstMax",a.chatBurstMax)}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionAuth"))}</h4>${s("dp-autoAuthEnabled",a.autoAuthEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.threshold"),"dp-authThreshold",a.failedAuthThreshold)}
            ${o(e("ddos.windowSec"),"dp-authWindowSec",qe(a.failedAuthWindowMs))}
            ${o(e("ddos.banMin"),"dp-authBanMin",Ae(a.authBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionRate"))}</h4>${s("dp-autoRateEnabled",a.autoRateEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.threshold"),"dp-rateHitThreshold",a.rateHitThreshold)}
            ${o(e("ddos.windowSec"),"dp-rateHitWindowSec",qe(a.rateHitWindowMs))}
            ${o(e("ddos.banMin"),"dp-rateBanMin",Ae(a.rateBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionConn"))}</h4>${s("dp-autoConnEnabled",a.autoConnEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.maxConcurrent"),"dp-maxConcurrent",a.maxConcurrentPerIp)}
            ${o(e("ddos.banMin"),"dp-connBanMin",Ae(a.connBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionVelocity"))}</h4>${s("dp-autoVelocityEnabled",a.autoVelocityEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.velocityMax"),"dp-velocityMax",a.velocityMaxRequests)}
            ${o(e("ddos.windowSec"),"dp-velocityWindowSec",qe(a.velocityWindowMs))}
            ${o(e("ddos.banMin"),"dp-velocityBanMin",Ae(a.velocityBanDurationMs))}
          </div>
        </div>

        <div class="policy-section">
          <div class="policy-section-h"><h4>${t(e("ddos.sectionEscalate"))}</h4>${s("dp-escalateEnabled",a.escalateEnabled)}</div>
          <div class="form-grid">
            ${o(e("ddos.escalateAfter"),"dp-escalateAfter",a.escalateAfterBans)}
            ${o(e("ddos.escalateMin"),"dp-escalateMin",Ae(a.escalateDurationMs))}
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
    </div>`}function fo(a){return a?.length?a.map(s=>`
    <tr>
      <td>${se(s.at)}</td>
      <td class="cell-primary">${t(s.ip)}</td>
      <td><span class="badge ${s.escalated?"warn":"pending"}">${t(ya(s.source))}</span></td>
      <td class="muted" style="max-width:280px;word-break:break-word">${t(s.reason||"")}</td>
      <td>${t(Ae(s.durationMs))} min</td>
    </tr>`).join(""):`<tr class="empty-row"><td colspan="5"><div class="data-empty"><strong>${t(e("ddos.emptyEvents"))}</strong></div></td></tr>`}async function oe(a={}){const s=!!a.soft&&document.getElementById("ddos-root"),o=document.querySelector(".main"),n=o?o.scrollTop:0;Xe&&(clearInterval(Xe),Xe=null);const i=l.ddosFilter;i.liveSortBy||(i.liveSortBy="startedAt"),i.liveSortDir||(i.liveSortDir="desc"),i.banSortBy||(i.banSortBy="createdAt"),i.banSortDir||(i.banSortDir="desc"),i.eventSortBy||(i.eventSortBy="at"),i.eventSortDir||(i.eventSortDir="desc");const r=new URLSearchParams;Te(r,i,"liveSortBy","liveSortDir");const d=new URLSearchParams;Te(d,i,"banSortBy","banSortDir");const u=new URLSearchParams;Te(u,i,"eventSortBy","eventSortDir");const m=[x(`/ddos/connections?${r}`),x(`/ddos/blacklist?${d}`),x("/ddos/stats"),x(`/ddos/events?${u}`)];s||m.push(x("/ddos/policy"));const g=await Promise.all(m),[c,b,p,f]=g,k=s?null:g[4],M=i.pageSize||15;let L=c.data?.active||[],U=c.data?.recent||[],E=b.data||[];const B=p.data||{},F=f.data||[],S=k?.data||l._ddosPolicyCache||null,w=k?.presets||l._ddosPresetsCache||null;S&&(l._ddosPolicyCache=S),w&&(l._ddosPresetsCache=w);const A=(l._ddosPolicyCache?.whitelist||[]).map(String);if(i.liveQ.trim()){const _=i.liveQ.trim().toLowerCase(),X=P=>[P.ip,P.path,P.method,P.apiKeyName,P.apiKeyPrefix].filter(Boolean).some(K=>String(K).toLowerCase().includes(_));L=L.filter(X),U=U.filter(X)}if(i.banQ.trim()){const _=i.banQ.trim().toLowerCase();E=E.filter(X=>String(X.ip||"").toLowerCase().includes(_)||String(X.reason||"").toLowerCase().includes(_))}i.banSource&&(E=E.filter(_=>_.source===i.banSource));const I=L.slice(i.livePage*M,i.livePage*M+M),y=E.slice(i.banPage*M,i.banPage*M+M),$=I.map(_=>`
    <tr>
      <td class="cell-primary">${t(_.ip)}</td>
      <td>${t(_.method)}</td>
      <td class="muted" style="max-width:220px;word-break:break-all">${t(_.path)}</td>
      <td>${t(_.apiKeyName||_.apiKeyPrefix||"—")}</td>
      <td><span class="badge pending">${t(e("status.active"))}</span></td>
      <td>${xt(Date.now()-_.startedAt)}</td>
      <td><div class="row-actions"><button class="btn danger sm" data-ban="${t(_.ip)}">${t(e("ddos.ban"))}</button></div></td>
    </tr>`).join(""),v=U.slice(0,40).map(_=>`
    <tr>
      <td class="cell-primary">${t(_.ip)}</td>
      <td>${t(_.method)} ${t(_.path)}</td>
      <td>${_.statusCode??"—"}</td>
      <td>${xt(_.durationMs)}</td>
      <td><div class="row-actions"><button class="btn danger sm" data-ban="${t(_.ip)}">${t(e("ddos.ban"))}</button></div></td>
    </tr>`).join(""),O=y.map(_=>`
    <tr>
      <td class="cell-primary">${t(_.ip)}</td>
      <td>${t(_.reason||"—")}</td>
      <td><span class="badge pending">${t(ya(_.source))}</span></td>
      <td>${_.expiresAt?se(_.expiresAt):t(e("ddos.permanent"))}</td>
      <td><div class="row-actions"><button class="btn secondary sm" data-unban="${t(_.ip)}">${t(e("ddos.unban"))}</button></div></td>
    </tr>`).join(""),T=(B.topIps||[]).map(_=>`<tr><td class="cell-primary">${t(_.ip)}</td><td>${_.requests}</td>
      <td><div class="row-actions"><button class="btn danger sm" data-ban="${t(_.ip)}">${t(e("ddos.ban"))}</button></div></td></tr>`).join(""),N=fo(F),Q=`<tr class="empty-row"><td colspan="7"><div class="data-empty"><strong>${t(e("ddos.emptyLive"))}</strong></div></td></tr>`,z=`<tr class="empty-row"><td colspan="5"><div class="data-empty"><strong>${t(e("common.empty"))}</strong></div></td></tr>`,ue=`<tr class="empty-row"><td colspan="5"><div class="data-empty"><strong>${t(e("ddos.emptyBan"))}</strong></div></td></tr>`,G=`<tr class="empty-row"><td colspan="3"><div class="data-empty"><strong>${t(e("common.empty"))}</strong></div></td></tr>`,ee=["","manual","auto-auth","auto-rate","auto-conn","auto-velocity","auto-escalate"].map(_=>_?`<option value="${_}" ${i.banSource===_?"selected":""}>${t(ya(_))}</option>`:`<option value="">${t(e("common.all"))}</option>`).join("");if(s){const _=(P,K)=>{const Y=document.getElementById(P);Y&&(Y.innerHTML=K)},X=(P,K)=>{const Y=document.getElementById(P);Y&&(Y.textContent=K)};X("ddos-stat-active",String(B.activeConnections??L.length)),X("ddos-stat-rate",String(B.rateLimitedHits??0)),X("ddos-stat-blocked",String(B.blockedHits??0)),X("ddos-stat-ban",String(E.length)),X("ddos-stat-auto",String(B.autoBanTotal??0)),X("ddos-tab-count-live",String(L.length)),X("ddos-tab-count-ban",String(E.length)),X("ddos-tab-count-events",String(F.length)),_("ddos-live-body",$||Q),_("ddos-recent-body",v||z),_("ddos-ban-body",O||ue),_("ddos-top-body",T||G),_("ddos-events-body",N),Ba(document),B.policySummary&&La(!!B.policySummary.autoBanEnabled),Qa(),o&&(o.scrollTop=n)}else{const _=S||{autoBanEnabled:!0,rateLimitWindowMs:6e4,rateLimitMax:120,rateLimitIpMax:60,chatBurstWindowMs:1e4,chatBurstMax:20,autoAuthEnabled:!0,failedAuthThreshold:20,failedAuthWindowMs:3e5,authBanDurationMs:6e5,autoRateEnabled:!0,rateHitThreshold:30,rateHitWindowMs:6e4,rateBanDurationMs:9e5,autoConnEnabled:!0,maxConcurrentPerIp:20,connBanDurationMs:6e5,autoVelocityEnabled:!0,velocityMaxRequests:200,velocityWindowMs:6e4,velocityBanDurationMs:6e5,escalateEnabled:!0,escalateAfterBans:3,escalateDurationMs:864e5,whitelist:["127.0.0.1","::1"],proxyTrustHops:1,proxyIpSource:"auto",trustedProxies:["127.0.0.1","::1"]},X=!!_.autoBanEnabled,P=i.tab==="live"||i.tab==="blacklist"||i.tab==="events"||i.tab==="policy"?i.tab:"policy";l.ddosFilter.tab=P;const K=`
    <div class="grid ddos-kpi-grid">
      <div class="card"><div class="label">${t(e("ddos.activeConn"))}</div><div class="value value-sm" id="ddos-stat-active">${B.activeConnections??L.length}</div><div class="muted card-sub">${t(e("ddos.live"))}</div></div>
      <div class="card"><div class="label">${t(e("ddos.rateHits"))}</div><div class="value value-sm" id="ddos-stat-rate">${B.rateLimitedHits??0}</div><div class="muted card-sub">${t(e("ddos.stats"))}</div></div>
      <div class="card"><div class="label">${t(e("ddos.blockedHits"))}</div><div class="value value-sm" id="ddos-stat-blocked">${B.blockedHits??0}</div><div class="muted card-sub">${t(e("ddos.stats"))}</div></div>
      <div class="card"><div class="label">${t(e("ddos.blacklist"))}</div><div class="value value-sm" id="ddos-stat-ban">${E.length}</div><div class="muted card-sub">${t(e("ddos.tabBlacklist"))}</div></div>
      <div class="card"><div class="label">${t(e("ddos.autoBans"))}</div><div class="value value-sm" id="ddos-stat-auto">${B.autoBanTotal??0}</div><div class="muted card-sub">${t(e("ddos.tabEvents"))}</div></div>
    </div>`,Y=go(_),fe=`
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
        <span class="muted">${t(q("common.pagerTotal",{n:L.length}))}</span>
      </div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          ${R({field:"ip",label:e("ddos.ip"),filterRef:i,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${R({field:"method",label:e("ddos.method"),filterRef:i,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${R({field:"path",label:e("ddos.path"),filterRef:i,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          <th>${t(e("ddos.key"))}</th>
          <th>${t(e("ddos.state"))}</th>
          ${R({field:"durationMs",label:e("ddos.duration"),filterRef:i,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          <th>${t(e("common.actions"))}</th>
        </tr></thead>
        <tbody id="ddos-live-body">${$||Q}</tbody>
      </table>
      </div>
      ${Le({total:L.length,limit:M,offset:i.livePage*M,idPrefix:"ddoslive"})}
    </div>
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${t(e("ddos.recent"))}</strong></div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          ${R({field:"ip",label:e("ddos.ip"),filterRef:i,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${R({field:"path",label:e("ddos.path"),filterRef:i,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${R({field:"statusCode",label:e("common.httpStatus"),filterRef:i,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          ${R({field:"durationMs",label:e("ddos.duration"),filterRef:i,sortByKey:"liveSortBy",sortDirKey:"liveSortDir"})}
          <th>${t(e("common.actions"))}</th>
        </tr></thead>
        <tbody id="ddos-recent-body">${v||z}</tbody>
      </table>
      </div>
    </div>`,_e=`
    <div class="panel data-filter-panel ddos-filter-panel">
      <div class="panel-h"><strong>${t(e("common.filterTitle"))}</strong></div>
      <div class="data-filter">
        <div class="data-filter-grid">
          <label>${t(e("ddos.blacklist"))}
            <input type="search" id="ddos-ban-q" value="${t(i.banQ)}" placeholder="IP / reason" />
          </label>
          <label>${t(e("ddos.source"))}
            <select id="ddos-ban-source">${ee}</select>
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
        <span class="muted">${t(q("common.pagerTotal",{n:E.length}))}</span>
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
          ${R({field:"ip",label:e("ddos.ip"),filterRef:i,sortByKey:"banSortBy",sortDirKey:"banSortDir"})}
          ${R({field:"reason",label:e("ddos.reason"),filterRef:i,sortByKey:"banSortBy",sortDirKey:"banSortDir"})}
          ${R({field:"source",label:e("ddos.source"),filterRef:i,sortByKey:"banSortBy",sortDirKey:"banSortDir"})}
          ${R({field:"expiresAt",label:e("ddos.expires"),filterRef:i,sortByKey:"banSortBy",sortDirKey:"banSortDir"})}
          <th>${t(e("common.actions"))}</th>
        </tr></thead>
        <tbody id="ddos-ban-body">${O||ue}</tbody>
      </table>
      </div>
      ${Le({total:E.length,limit:M,offset:i.banPage*M,idPrefix:"ddosban"})}
    </div>`,Ve=`
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${t(e("ddos.eventsTitle"))}</strong>
        <span class="muted">${t(q("common.pagerTotal",{n:F.length}))}</span>
      </div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr>
          ${R({field:"at",label:e("ddos.eventTime"),filterRef:i,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
          ${R({field:"ip",label:e("ddos.ip"),filterRef:i,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
          ${R({field:"source",label:e("ddos.eventSource"),filterRef:i,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
          ${R({field:"reason",label:e("ddos.reason"),filterRef:i,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
          ${R({field:"durationMs",label:e("ddos.eventDuration"),filterRef:i,sortByKey:"eventSortBy",sortDirKey:"eventSortDir"})}
        </tr></thead>
        <tbody id="ddos-events-body">${N}</tbody>
      </table>
      </div>
    </div>
    <div class="panel data-table-panel ddos-stack-panel">
      <div class="panel-h"><strong>${t(e("ddos.topIps"))}</strong></div>
      <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>${t(e("ddos.ip"))}</th><th>${t(e("usage.requests"))}</th><th>${t(e("common.actions"))}</th></tr></thead>
        <tbody id="ddos-top-body">${T||G}</tbody>
      </table>
      </div>
    </div>`;document.getElementById("app").innerHTML=ne(`
    <div id="ddos-root" class="${X?"":"is-feature-off"}">
    <div class="topbar">
      <h2>${t(e("ddos.title"))}</h2>
      <div class="toolbar">
        ${Ca({id:"ddos-master-autoban",on:X,onLabel:e("ddos.masterOn"),offLabel:e("ddos.masterOff"),title:e("ddos.autoBanMasterHint")})}
        <button class="btn secondary sm" id="ddos-refresh">${t(e("ddos.refresh"))}</button>
        <button class="btn secondary sm" id="ddos-pause">${t(e(Ye?"ddos.resume":"ddos.pause"))}</button>
      </div>
    </div>
    ${ve([e("ddos.policyHint")])}
    <div class="feature-off-banner" id="ddos-disabled-banner" ${X?"hidden":""} role="status">
      <strong>${t(e("common.featureOff"))}</strong>
      <span>${t(e("ddos.disabledBanner"))}</span>
    </div>
    ${K}

    <div class="usage-tabs-panel panel ddos-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("ddos.title"))}">
        <button type="button" role="tab" class="seg-tab ${P==="policy"?"is-active":""}" data-ddos-tab="policy" aria-selected="${P==="policy"}">
          ${t(e("ddos.tabPolicy"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${P==="live"?"is-active":""}" data-ddos-tab="live" aria-selected="${P==="live"}">
          ${t(e("ddos.tabLive"))}
          <span class="seg-tab-count" id="ddos-tab-count-live">${L.length}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${P==="blacklist"?"is-active":""}" data-ddos-tab="blacklist" aria-selected="${P==="blacklist"}">
          ${t(e("ddos.tabBlacklist"))}
          <span class="seg-tab-count" id="ddos-tab-count-ban">${E.length}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${P==="events"?"is-active":""}" data-ddos-tab="events" aria-selected="${P==="events"}">
          ${t(e("ddos.tabEvents"))}
          <span class="seg-tab-count" id="ddos-tab-count-events">${F.length}</span>
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-policy" id="ddos-tab-policy" ${P==="policy"?"":"hidden"}>
          ${Y}
        </div>
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-stack" id="ddos-tab-live" ${P==="live"?"":"hidden"}>
          ${fe}
        </div>
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-stack" id="ddos-tab-blacklist" ${P==="blacklist"?"":"hidden"}>
          ${_e}
        </div>
        <div class="usage-tab-pane ddos-tab-pane ddos-tab-pane-stack" id="ddos-tab-events" ${P==="events"?"":"hidden"}>
          ${Ve}
        </div>
      </div>
    </div>
    </div>
  `),ie(),Qa(!0,A),Ge(l.ddosFilter,()=>oe().catch(h)),document.querySelectorAll("[data-ddos-tab]").forEach(te=>{te.addEventListener("click",()=>{const pe=te.getAttribute("data-ddos-tab")||"policy",ye=pe==="live"||pe==="blacklist"||pe==="events"||pe==="policy"?pe:"policy";l.ddosFilter.tab!==ye&&(l.ddosFilter.tab=ye,oe().catch(h))})}),document.getElementById("ddos-live-filter-apply")?.addEventListener("click",()=>{l.ddosFilter.liveQ=document.getElementById("ddos-live-q")?.value?.trim()||"",l.ddosFilter.livePage=0,oe().catch(h)}),document.getElementById("ddos-live-filter-reset")?.addEventListener("click",()=>{l.ddosFilter.liveQ="",l.ddosFilter.liveSortBy="startedAt",l.ddosFilter.liveSortDir="desc",l.ddosFilter.livePage=0,oe().catch(h)}),document.getElementById("ddos-ban-filter-apply")?.addEventListener("click",()=>{l.ddosFilter.banQ=document.getElementById("ddos-ban-q")?.value?.trim()||"",l.ddosFilter.banSource=document.getElementById("ddos-ban-source")?.value||"",l.ddosFilter.banPage=0,oe().catch(h)}),document.getElementById("ddos-ban-filter-reset")?.addEventListener("click",()=>{l.ddosFilter.banQ="",l.ddosFilter.banSource="",l.ddosFilter.banSortBy="createdAt",l.ddosFilter.banSortDir="desc",l.ddosFilter.banPage=0,oe().catch(h)}),document.getElementById("ddoslive-prev")?.addEventListener("click",()=>{l.ddosFilter.livePage=Math.max(0,i.livePage-1),oe().catch(h)}),document.getElementById("ddoslive-next")?.addEventListener("click",()=>{(i.livePage+1)*M<L.length&&(l.ddosFilter.livePage+=1,oe().catch(h))}),document.getElementById("ddosban-prev")?.addEventListener("click",()=>{l.ddosFilter.banPage=Math.max(0,i.banPage-1),oe().catch(h)}),document.getElementById("ddosban-next")?.addEventListener("click",()=>{(i.banPage+1)*M<E.length&&(l.ddosFilter.banPage+=1,oe().catch(h))});const Ee=document.querySelector(".main");Ee&&(Ee.onscroll=()=>{l._ddosScrollPauseUntil=Date.now()+4e3})}!Ye&&l.page==="ddos"&&(Xe=setInterval(()=>{l.page!=="ddos"||Ye||l._ddosScrollPauseUntil&&Date.now()<l._ddosScrollPauseUntil||oe({soft:!0}).catch(()=>{})},2e3))}function Qa(a=!1,s=[]){const o=s.length?s:l._ddosPolicyCache?.whitelist||[],n=async i=>{if(!i)return;const r=o.some(d=>String(d)===i||String(d).startsWith(i));await Z({message:e(r?"ddos.banWhitelistWarn":"ddos.banConfirm"),variant:"danger",confirmText:e("ddos.ban")})&&(await x("/ddos/blacklist",{method:"POST",body:JSON.stringify({ip:i,reason:e("ddos.banReasonDefault"),ttlSeconds:null})}),oe({soft:!0}).catch(h))};if(document.querySelectorAll("[data-ban]").forEach(i=>{i.onclick=()=>n(i.dataset.ban)}),document.querySelectorAll("[data-unban]").forEach(i=>{i.onclick=async()=>{await Z({message:e("ddos.unbanConfirm"),variant:"danger",confirmText:e("ddos.unban")})&&(await x(`/ddos/blacklist/${encodeURIComponent(i.dataset.unban)}`,{method:"DELETE"}),oe({soft:!0}).catch(h))}}),a){document.getElementById("ban-add").onclick=async()=>{const r=document.getElementById("ban-ip").value.trim();if(!r||o.some(m=>String(m)===r)&&!await Z({message:e("ddos.banWhitelistWarn"),variant:"danger",confirmText:e("ddos.ban")}))return;const u=document.getElementById("ban-ttl").value;await x("/ddos/blacklist",{method:"POST",body:JSON.stringify({ip:r,reason:document.getElementById("ban-reason").value.trim()||void 0,ttlSeconds:u?Number(u):null})}),oe({soft:!0}).catch(h)},document.getElementById("ddos-refresh").onclick=()=>oe({soft:!1}).catch(h),document.getElementById("ddos-pause").onclick=()=>{Ye=!Ye;const r=document.getElementById("ddos-pause");r&&(r.textContent=e(Ye?"ddos.resume":"ddos.pause")),Ye||oe({soft:!0}).catch(h)},document.getElementById("ddos-master-autoban")?.addEventListener("click",async()=>{const r=!tt("ddos-master-autoban");at("ddos-master-autoban",r,e("ddos.masterOn"),e("ddos.masterOff"));const d=document.getElementById("dp-autoBanEnabled");d&&(d.type==="checkbox"?d.checked=r:d.value=r?"1":"0"),La(r),ot("ddos-root",!r),st("ddos-disabled-banner",!r),Re();try{const u=ba(),m=await x("/ddos/policy",{method:"PUT",body:JSON.stringify(u)});l._ddosPolicyCache=m.data,Re()}catch(u){at("ddos-master-autoban",!r,e("ddos.masterOn"),e("ddos.masterOff")),ot("ddos-root",r),st("ddos-disabled-banner",r),h(u)}});const i=document.getElementById("ddos-policy-panel");i?.addEventListener("input",()=>Re()),i?.addEventListener("change",()=>Re()),document.querySelectorAll("[data-ddos-preset]").forEach(r=>{r.onclick=()=>{const d=r.dataset.ddosPreset;if(d==="custom")return;const u=l._ddosPresetsCache?.[d];u&&ia(u)}}),Re(),document.getElementById("dp-save")?.addEventListener("click",async()=>{try{const r=ba(),d=await x("/ddos/policy",{method:"PUT",body:JSON.stringify(r)});l._ddosPolicyCache=d.data,ia(d.data),Re(),await he({title:e("ddos.policyTitle"),message:e("ddos.policySaved")}),oe({soft:!0}).catch(h)}catch(r){h(r)}}),document.getElementById("dp-reset")?.addEventListener("click",async()=>{if(await Z({message:e("ddos.confirmReset"),variant:"danger",confirmText:e("ddos.resetPolicy")}))try{const r=await x("/ddos/policy/reset",{method:"POST"});l._ddosPolicyCache=r.data,ia(r.data),Re(),await he({title:e("ddos.policyTitle"),message:e("ddos.policyReset")}),oe({soft:!0}).catch(h)}catch(r){h(r)}})}}function Dt(a){return e(a==="pm2"?"pm2.runnerPm2":a==="ysk-omni"?"pm2.runnerGctoac":a==="none"?"pm2.runnerNone":"pm2.runnerUnknown")}function va(a){if(!a)return"";const s=a.messageKey;if(s&&typeof s=="string"){if(s==="pm2.msgOk")return"";const n=a.messageParams||{},i=q(s,n);if(i&&i!==s)return i}const o=a.message||"";return!o||o==="ok"?"":o}function ja(a=10){const s=Math.max(1,Number(a)||10)*1e3;window.setTimeout(()=>{try{window.location.reload()}catch{window.location.href=window.location.href}},s)}function yo(a,s){const o=s?.messageKey||(a==="pm2"?"pm2.msgSwitchPm2":"pm2.msgSwitchGctoac");let n=va({messageKey:o,messageParams:s?.messageParams,message:void 0});n||(n=e(a==="pm2"?"pm2.msgSwitchPm2":"pm2.msgSwitchGctoac"));const i=s?.port||s?.messageParams?.port||(typeof location<"u"&&location.port?location.port:"3850");return[n,q("pm2.portAfterRestart",{port:i}),q("pm2.autoRefreshIn",{n:10})].filter(Boolean).join(`
`)}function la(a){return a==="pm2"?`<span class="badge success">${t(Dt(a))}</span>`:a==="ysk-omni"?`<span class="badge agent">${t(Dt(a))}</span>`:a==="none"?`<span class="badge pending">${t(Dt(a))}</span>`:`<span class="badge warn">${t(Dt(a))}</span>`}function bo(a){return!a||typeof a!="object"?"":Object.entries(a).map(([s,o])=>`${s}=${o}`).join(`
`)}function ho(a){const s={};for(const o of(a||"").split(`
`)){const n=o.trim();if(!n||n.startsWith("#"))continue;const i=n.indexOf("=");i<=0||(s[n.slice(0,i).trim()]=n.slice(i+1).trim())}return s}function vo(){const a=r=>document.getElementById(r)?.checked===!0,s=r=>document.getElementById(r)?.value??"";let o=s("pm2-cfg-instances").trim();if(o!=="max"){const r=Number(o);o=Number.isFinite(r)&&r>=1?r:1}const n=s("pm2-cfg-port").trim(),i=Number(n);return{port:Number.isFinite(i)&&i>=1&&i<=65535?i:void 0,name:s("pm2-cfg-name").trim()||"ysk-omni",script:s("pm2-cfg-script").trim()||"dist/server.js",cwd:s("pm2-cfg-cwd").trim()||void 0,instances:o,exec_mode:s("pm2-cfg-exec")==="cluster"?"cluster":"fork",autorestart:a("pm2-cfg-autorestart"),watch:a("pm2-cfg-watch"),max_memory_restart:s("pm2-cfg-maxmem").trim()||"512M",max_restarts:Number(s("pm2-cfg-maxrestarts"))||10,min_uptime:s("pm2-cfg-minuptime").trim()||"5s",restart_delay:Number(s("pm2-cfg-restartdelay"))||2e3,exp_backoff_restart_delay:Number(s("pm2-cfg-backoff"))||1e3,merge_logs:a("pm2-cfg-mergelogs"),time:a("pm2-cfg-time"),error_file:s("pm2-cfg-errfile").trim()||"logs/pm2-error.log",out_file:s("pm2-cfg-outfile").trim()||"logs/pm2-out.log",env_extra:ho(s("pm2-cfg-envextra")),preferred_runner:s("pm2-cfg-preferred")==="pm2"?"pm2":"ysk-omni"}}async function He(){const s=(await x("/pm2/status")).data||{},o=s.app,n=s.config||{},i=s.portHolders||{},r=i.pids&&i.pids.length>0||!1,d=va(s);let u="",m=null;try{const T=await x("/pm2/logs?lines=80");u=(T.data?.stdout||"")+(T.data?.stderr?`
`+T.data.stderr:""),m=T.data||null}catch(T){u=T.message||""}s.lastError&&(u=`===== last errors =====
${s.lastError}

${u}`);const g=m?.files||[],c=g.length?g.filter(T=>T.exists).map(T=>`${T.label}: ${T.size<1024?T.size+" B":Math.round(T.size/1024)+" KB"}`).join(" · "):"",b=m?.maxBytes?Math.round(m.maxBytes/(1024*1024)):5,p=m?.keepBytes?Math.round(m.keepBytes/1024):512,f=o?.status||"—",k=f==="online"?e("pm2.statusOnline"):f==="errored"?e("pm2.statusErrored"):f==="stopped"?e("pm2.statusStopped"):f,M=f==="online"?`<span class="badge success">${t(k)}</span>`:f==="errored"?`<span class="badge error">${t(k)}</span>`:t(k),L=s.available,U=s.available&&o,E=s.runner||"unknown",B=d&&f!=="errored"&&s.available!==!1&&s.messageKey!=="pm2.msgErrored",F=bo(n.env_extra),S=l.pm2Tab==="port"||l.pm2Tab==="config"||l.pm2Tab==="logs"||l.pm2Tab==="runner"?l.pm2Tab:"runner";l.pm2Tab=S;const w=`
    <div class="grid pm2-kpi-grid" id="pm2-kpi-grid">
      <div class="card">
        <div class="label">${t(e("pm2.app"))}</div>
        <div class="value value-sm">${t(s.appName||n.name||"ysk-omni")}</div>
        <div class="muted card-sub">${la(E)}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("pm2.status"))}</div>
        <div class="value value-sm">${M}</div>
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
        <div class="muted card-sub">${t(e("pm2.portBusy"))}: ${e(r?"common.yes":"common.no")}</div>
      </div>
    </div>`,A=`
    <div class="panel data-table-panel pm2-section-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("pm2.switchTitle"))}</strong>
          <span class="muted panel-h-sub">${t(e("pm2.switchHint"))}</span>
        </div>
        ${la(E)}
      </div>
      <div class="panel-pad">
        <div class="grid">
          <div class="card"><div class="label">${t(e("pm2.currentRunner"))}</div><div class="value value-sm">${la(E)}</div></div>
          <div class="card"><div class="label">${t(e("pm2.omniPid"))}</div><div class="value value-sm">${s.omni?.running&&s.omni?.pid?s.ysk-omni.pid:"—"}</div></div>
          <div class="card"><div class="label">${t(e("pm2.port"))}</div><div class="value value-sm">${s.port??"—"}</div></div>
          <div class="card"><div class="label">${t(e("pm2.portBusy"))}</div><div class="value value-sm">${e(r?"common.yes":"common.no")}</div></div>
        </div>
        <div class="toolbar settings-save-bar">
          <button class="btn sm" id="pm2-switch-pm2" ${L?"":"disabled"}>${t(e("pm2.switchToPm2"))}</button>
          <button class="btn secondary sm" id="pm2-switch-ysk-omni">${t(e("pm2.switchToGctoac"))}</button>
        </div>
      </div>
    </div>`,I=`
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
          <label class="full">${t(e("pm2.fieldEnvExtra"))}<textarea id="pm2-cfg-envextra" rows="4" placeholder="${t(e("pm2.phEnv"))}">${t(F)}</textarea></label>
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
          ${t(q("pm2.logsAutoTrim",{maxMb:b,keepKb:p}))}
          ${c?` · ${t(c)}`:""}
        </p>
        <pre class="pre pre-logs" id="pm2-logs-pre">${t(u||e("common.empty"))}</pre>
      </div>
    </div>`;document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("pm2.title"))}</h2>
      <div class="toolbar">
        <button class="btn secondary sm" id="pm2-refresh">${t(e("pm2.refresh"))}</button>
        <button class="btn sm" id="pm2-start" ${L?"":"disabled"}>${t(e("pm2.start"))}</button>
        <button class="btn secondary sm" id="pm2-stop" ${U?"":"disabled"}>${t(e("pm2.stop"))}</button>
        <button class="btn sm" id="pm2-restart" ${L?"":"disabled"}>${t(e("pm2.restart"))}</button>
        <button class="btn secondary sm" id="pm2-reload" ${!U||o?.status!=="online"?"disabled":""}>${t(e("pm2.reload"))}</button>
      </div>
    </div>
    ${ve([e("pm2.hint")])}
    ${d?`<div class="error-box${B?" warn-box":""}">${t(d)}</div>`:s.available?"":`<div class="error-box">${t(e("pm2.unavailable"))}</div>`}
    ${w}

    <div class="usage-tabs-panel panel pm2-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("pm2.title"))}">
        <button type="button" role="tab" class="seg-tab ${S==="runner"?"is-active":""}" data-pm2-tab="runner" aria-selected="${S==="runner"}">
          ${t(e("pm2.tabRunner"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${S==="port"?"is-active":""}" data-pm2-tab="port" aria-selected="${S==="port"}">
          ${t(e("pm2.tabPort"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${S==="config"?"is-active":""}" data-pm2-tab="config" aria-selected="${S==="config"}">
          ${t(e("pm2.tabConfig"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${S==="logs"?"is-active":""}" data-pm2-tab="logs" aria-selected="${S==="logs"}">
          ${t(e("pm2.tabLogs"))}
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-runner" ${S==="runner"?"":"hidden"}>
          ${A}
        </div>
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-port" ${S==="port"?"":"hidden"}>
          ${I}
        </div>
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-config" ${S==="config"?"":"hidden"}>
          ${y}
        </div>
        <div class="usage-tab-pane pm2-tab-pane" id="pm2-tab-logs" ${S==="logs"?"":"hidden"}>
          ${$}
        </div>
      </div>
    </div>
  `),ie(),document.querySelectorAll("[data-pm2-tab]").forEach(T=>{T.addEventListener("click",()=>{const N=T.getAttribute("data-pm2-tab")||"runner",Q=N==="port"||N==="config"||N==="logs"||N==="runner"?N:"runner";l.pm2Tab!==Q&&(l.pm2Tab=Q,He().catch(h))})}),document.getElementById("pm2-logs-refresh")?.addEventListener("click",()=>{l.pm2Tab="logs",He().catch(h)}),document.getElementById("pm2-logs-clear")?.addEventListener("click",async()=>{if(await Z({message:e("pm2.confirmClearLogs"),variant:"danger",confirmText:e("pm2.clearLogs")}))try{const N=(await x("/pm2/logs/clear",{method:"POST",body:JSON.stringify({which:"all"})})).data?.cleared?.length||0;await he({message:q("pm2.logsCleared",{n:N})}),He().catch(h)}catch(T){h(T)}});const v=async T=>{if(await Z({message:e(T==="pm2"?"pm2.confirmSwitchPm2":"pm2.confirmSwitchGctoac"),variant:"confirm",confirmText:e(T==="pm2"?"pm2.switchToPm2":"pm2.switchToGctoac")}))try{const Q=await x("/pm2/switch",{method:"POST",body:JSON.stringify({mode:T})}),z=Q?.data||Q||{},ue=yo(T==="pm2"?"pm2":"ysk-omni",z);ja(10),await he({title:e("common.notice"),message:ue,confirmText:e("common.ok")});try{window.location.reload()}catch{window.location.href=window.location.href}}catch(Q){h(Q)}};document.getElementById("pm2-refresh").onclick=()=>He().catch(h),document.getElementById("pm2-switch-pm2").onclick=()=>v("pm2"),document.getElementById("pm2-switch-ysk-omni").onclick=()=>v("ysk-omni"),document.getElementById("pm2-start").onclick=()=>v("pm2"),document.getElementById("pm2-stop").onclick=async()=>{if(await Z({message:e("pm2.confirmStop"),variant:"danger",confirmText:e("pm2.stop")}))try{await x("/pm2/stop",{method:"POST",body:"{}"}),He().catch(h)}catch(T){h(T)}},document.getElementById("pm2-restart").onclick=async()=>{if(await Z({message:e("pm2.confirmRestart"),variant:"confirm",confirmText:e("pm2.restart")}))try{await v("pm2")}catch(T){h(T)}},document.getElementById("pm2-reload").onclick=async()=>{try{await x("/pm2/reload",{method:"POST",body:"{}"}),He().catch(h)}catch(T){h(T)}};const O=async T=>{try{const N={...vo(),restart:T};if(N.port==null){await he({message:e("pm2.portInvalid")});return}const Q=await x("/pm2/config",{method:"PUT",body:JSON.stringify(N)});if(Q.data?.scheduled){const z=Q.data.portChange?`
${q("pm2.portChangedMsg",{from:Q.data.portChange.previous,to:Q.data.portChange.port})}`:"",ue=va(Q.data.scheduled)||e("pm2.switchScheduled");ja(10),await he({title:e("common.notice"),message:ue+z+`
${q("pm2.autoRefreshIn",{n:10})}`});try{window.location.reload()}catch{window.location.href=window.location.href}}else await he(Q.data?.portChange?q("pm2.portSavedNeedRestart",{port:Q.data.port}):e("pm2.configSaved")),He().catch(h)}catch(N){h(N)}};document.getElementById("pm2-cfg-save").onclick=()=>O(!0),document.getElementById("pm2-cfg-save-only").onclick=()=>O(!1),document.getElementById("pm2-port-default")?.addEventListener("click",()=>{const T=document.getElementById("pm2-cfg-port");T&&(T.value="3850")}),document.getElementById("pm2-port-save")?.addEventListener("click",async()=>{const T=Number(document.getElementById("pm2-cfg-port")?.value);if(!Number.isFinite(T)||T<1||T>65535){await he({message:e("pm2.portInvalid")});return}if(await Z({message:q("pm2.confirmPortChange",{port:T}),variant:"confirm",confirmText:e("pm2.savePort")}))try{const N=await x("/pm2/config",{method:"PUT",body:JSON.stringify({port:T,restart:!0})}),Q=N.data?.scheduled?.message||(N.data?.portChange?q("pm2.portChangedMsg",{from:N.data.portChange.previous,to:N.data.portChange.port}):e("pm2.configSaved"));await he(Q+`
`+q("pm2.portAfterRestart",{port:T}))}catch(N){h(N)}}),document.getElementById("pm2-cfg-reset").onclick=async()=>{if(await Z({message:e("pm2.confirmReset"),variant:"danger",confirmText:e("pm2.resetConfig")}))try{await x("/pm2/config/reset",{method:"POST",body:"{}"}),He().catch(h)}catch(T){h(T)}}}let ae=[],Se=null,de=[],Et=!1,Ue=0;const Ne=new Map,C={keyId:"",model:"",reasoning:!0,effort:"",resumeId:"",forkSession:!1,memory:!1,noPlan:!1,permissionMode:"",systemPrompt:"",systemOpen:!1,settingsOpen:!1},D={mode:"full",recentN:6,summary:"",summaryAt:null,summarySourceCount:0},$o=3,ys=40,ko=20,wo=2200,H={conversationId:null,historyPage:0,historyLimit:20,historyQ:"",historyTotal:0,historyItems:[],historyLoading:!1,historyOpenMobile:!1,saving:!1,saveQueued:!1,renamingId:null};let da=null;const Gt=10,Ha=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;function So(a){const s=String(a||"").split(/[/\\]/).pop()||"",o=s.lastIndexOf(".");return o<0?"":s.slice(o).toLowerCase()}function zt(a){return es.has(So(a))}function Vt(){return e("chat.formatsHint")}function bs(){D.mode="full",D.recentN=6,D.summary="",D.summaryAt=null,D.summarySourceCount=0,Ue=0,Ne.clear()}function Po(a){const s=(a?.title||"").trim();if(s)return s;const o=(a?.preview||"").trim();return o||e("chat.untitled")}function Eo(){return ae.filter(a=>!a.streaming).map(a=>{const s={role:a.role,content:a.content||""};return a.reasoning&&(s.reasoning=a.reasoning),a.docs&&a.docs.length&&(s.docs=a.docs),a.error&&(s.error=!0),s})}function Mo(){return{contextMode:D.mode,contextRecentN:D.recentN,summaryText:D.summary||"",summaryAt:D.summaryAt,summarySourceCount:D.summarySourceCount||0}}function xo(a){a&&(D.mode=a.contextMode==="summary"||a.contextMode==="recent"?a.contextMode:"full",D.recentN=Math.min(40,Math.max(2,Number(a.contextRecentN)||6)),D.summary=(a.summaryText||"").trim(),D.summaryAt=a.summaryAt||null,D.summarySourceCount=Number(a.summarySourceCount)||0,D.mode==="summary"&&!D.summary&&(D.mode="full"))}function hs(a){return a.reduce((s,o)=>s+(o.content||"").length+(o.reasoning||"").length,0)}function vs(){const a=ae.filter(s=>!s.streaming);return a.length<2?!1:a.length>=$o?!0:hs(a)>=800}function Io(){const a=(C.systemPrompt||"").trim(),s=ae.filter(d=>!d.streaming),o=Math.min(40,Math.max(2,Number(D.recentN)||6));let n=s.map(d=>({role:d.role,content:d.content||""})),i=a;if(D.mode==="summary"&&D.summary){const d=(gt()==="zh-Hant"?`【先前對話摘要 — 僅供延續語境，完整記錄仍在用戶介面】
`:`[Prior conversation summary — full history remains in the UI]
`)+D.summary;i=i?`${i}

${d}`:d;const u=s.slice(D.summarySourceCount||0);n=(u.length?u:s.slice(-o)).slice(-o).map(g=>({role:g.role,content:g.content||""}))}else D.mode==="recent"&&(n=s.slice(-o).map(d=>({role:d.role,content:d.content||""})));const r=n.map(d=>({role:d.role,content:d.content}));return i&&r.unshift({role:"system",content:i}),r}function Ao(){return D.mode==="summary"&&D.summary?q("chat.ctxModeSummaryLabel",{n:D.recentN}):D.mode==="recent"?q("chat.ctxModeRecentLabel",{n:D.recentN}):e("chat.ctxModeFullLabel")}function yt(){const a=document.getElementById("chat-compress");if(!a)return;const s=ae.some(i=>i.streaming),o=!!Se||Et||s,n=vs();a.disabled=o||!n,a.textContent=e(Et?"chat.compressing":"chat.compress"),a.title=e(n?"chat.compress":"chat.compressNeedMore"),je(),nt()}function nt(){const a=document.getElementById("chat-ctx-mode"),s=document.getElementById("chat-ctx-n");if(a){const o=D.mode==="summary"&&!D.summary?"full":D.mode;a.value=o;const n=a.querySelector('option[value="summary"]');n&&(n.disabled=!D.summary)}s&&(s.value=String(D.recentN),s.disabled=D.mode==="full"),Jt()}function je(){const a=document.getElementById("chat-compress-banner");if(!a)return;const s=!!D.summary,o=ae.filter(r=>!r.streaming).length>40||hs(ae)>6e4;if(!s&&D.mode==="full"&&!o){a.hidden=!0,a.innerHTML="";return}a.hidden=!1;const n=s?D.summary.length>160?`${D.summary.slice(0,159)}…`:D.summary:"",i=o?`<p class="chat-compress-warn">${t(e("chat.ctxLongHint"))}</p>`:"";a.innerHTML=`
    <div class="chat-compress-banner-inner">
      <div class="chat-compress-banner-text">
        <strong>${t(e("chat.ctxPolicyTitle"))}</strong>
        <span class="muted">${t(Ao())}</span>
        <p class="chat-compress-remark">${t(e("chat.ctxRemark"))}</p>
        ${n?`<p class="chat-compress-preview">${t(n)}</p>`:""}
        ${i}
      </div>
      <div class="chat-compress-banner-actions">
        ${s?`<button type="button" class="btn secondary sm" id="chat-summary-view">${t(e("chat.compressView"))}</button>`:""}
      </div>
    </div>`,document.getElementById("chat-summary-view")?.addEventListener("click",()=>{$s()})}async function $s(){if(!D.summary){j(e("chat.compressNeedSummary"));return}const a=D.summaryAt?se(D.summaryAt):"—",s=ts(D.summary);Be&&Ze(!1);const o=document.createElement("div");return o.className="ui-dialog-back",o.id="ui-dialog-back",o.dataset.cancelable="1",o.innerHTML=`
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
    </div>`,document.body.appendChild(o),document.body.classList.add("ui-dialog-open"),Be=o,document.addEventListener("keydown",Ia,!0),new Promise(n=>{Wt=n;const i=()=>Ze(!0);o.querySelector("#ui-dialog-ok")?.addEventListener("click",i),o.addEventListener("click",r=>{r.target===o&&i()}),o.querySelector("#ui-dialog-copy")?.addEventListener("click",async()=>{const r=await ea(D.summary),d=o.querySelector("#ui-dialog-copy");r&&d&&(d.textContent=e("chat.copied"),setTimeout(()=>{d.isConnected&&(d.textContent=e("chat.copy"))},1500))})})}function To(a){return a.map(s=>{const o=s.role||"user";let n=(s.content||"").trim();if(s.docs&&s.docs.length){const i=s.docs.map(r=>r.name).join(", ");n=n?`${n}
[attachments: ${i}]`:`[attachments: ${i}]`}return n.length>5e3&&(n=`${n.slice(0,4999)}…`),`${o}: ${n}`}).join(`

`)}function qo(){return gt()==="zh-Hant"?["你是對話摘要助手。只輸出精簡摘要，不要使用任何工具、不要上網、不要反問。","若已有舊摘要，請合併更新為一份。","請用繁體中文（或對齊原對話語言）條列：","1) 主題與目標 2) 已確定事實／決定 3) 未完成事項 4) 用戶偏好或約束","控制在約 600–1000 字。不要大段複製原文。只輸出摘要正文。"].join(`
`):["You are a conversation summary assistant. Output only a concise summary.","Merge any prior summary into one updated summary. No tools, no browsing, no questions.","Cover: (1) topics/goals (2) facts/decisions (3) open items (4) preferences.","Keep under ~600–1000 words. Summary body only."].join(`
`)}async function Bo(){if(Et||Se||ae.some(i=>i.streaming)){j(e("chat.compressBusy"));return}const a=ae.filter(i=>!i.streaming);if(!vs()){j(e("chat.compressNeedMore"));return}if(!await Z({title:e("chat.compress"),message:e("chat.compressConfirm"),variant:"confirm",confirmText:e("chat.compress")}))return;const s=Ct();if(!s){j(e("chat.needKey"));return}me(),Et=!0,yt();const o=document.getElementById("chat-send");o&&(o.disabled=!0);const n=document.getElementById("chat-stream-status");n&&(n.hidden=!1,n.textContent=e("chat.compressing"));try{let i=To(a);D.summary&&(i=(gt()==="zh-Hant"?`先前摘要：
${D.summary}

完整對話：
`:`Prior summary:
${D.summary}

Full conversation:
`)+i);let r=document.getElementById("chat-model")?.value||C.model||"echo";_a(r,l.catalogLocal)!=="text"&&(r=(l.catalogLocal||[]).find(p=>p.runtime==="llamacpp")?.id||"echo");const d=Da(),u={model:r,stream:!1,include_reasoning:!1,messages:[{role:"system",content:qo()},{role:"user",content:(gt()==="zh-Hant"?`請為以下對話產生摘要（僅供之後回合作為語境，不會刪除用戶介面中的記錄）：

`:`Summarize the following conversation (for later context only; UI history is kept):

`)+i}]},m=bt();m&&(u.apiKeyId=m);const g=await fetch("/admin/api/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${s}`,"Content-Type":"application/json"},body:JSON.stringify(u)});if(!g.ok){const p=await g.text();let f=p;try{f=JSON.parse(p).error?.message||p}catch{}throw new Error(f||e("chat.compressFail"))}const c=await g.json();let b=c?.choices?.[0]?.message?.content||c?.choices?.[0]?.delta?.content||"";if(typeof b!="string"&&(b=String(b||"")),b=b.trim().replace(/^【對話摘要】\s*/u,"").replace(/^\[Conversation summary\]\s*/i,""),!b)throw new Error(e("chat.compressFail"));D.summary=b,D.summaryAt=new Date().toISOString(),D.summarySourceCount=a.length,D.mode="summary",je(),nt(),j(""),n&&(n.hidden=!1,n.textContent=e("chat.compressOk"),setTimeout(()=>{const p=document.getElementById("chat-stream-status");p&&p.textContent===e("chat.compressOk")&&(p.hidden=!0,p.textContent="")},2800)),await At().catch(()=>{}),await $s()}catch(i){j(i.message||e("chat.compressFail"))}finally{Et=!1,yt(),o&&(o.disabled=!1),n&&n.textContent===e("chat.compressing")&&(n.hidden=!0,n.textContent="")}}function $a(a){H.historyOpenMobile=!!a,document.body.classList.toggle("chat-history-open",H.historyOpenMobile)}function ka(){$a(!1)}async function We(){if(l.key){H.historyLoading=!0,De();try{const a=H.historyPage*H.historyLimit,s=new URLSearchParams({limit:String(H.historyLimit),offset:String(a)});H.historyQ.trim()&&s.set("q",H.historyQ.trim());const o=await x(`/conversations?${s}`);H.historyItems=o.data||[],H.historyTotal=o.total??0}catch(a){H.historyItems=[],H.historyTotal=0,console.warn(a)}finally{H.historyLoading=!1,De()}}}function De(){const a=document.getElementById("chat-history-list"),s=document.getElementById("chat-history-pager");if(a){if(H.historyLoading&&!H.historyItems.length?a.innerHTML=`<li class="chat-history-empty">${t(e("common.loading"))}</li>`:H.historyItems.length?a.innerHTML=H.historyItems.map(o=>{const n=H.conversationId===o.id?" is-active":"",i=Po(o),r=o.title&&o.preview&&o.preview!==o.title?o.preview:o.model||q("chat.msgs",{n:o.messageCount||0}),d=H.renamingId===o.id,u=i,m=d?`<input type="text" class="chat-history-title-input" data-title-input="${t(o.id)}" value="${t(u)}" maxlength="120" placeholder="${t(e("chat.renamePh"))}" aria-label="${t(e("chat.renamePh"))}" />
            <span class="preview">${t(r||"—")}</span>
            <span class="meta"><span>${t(se(o.updatedAt))}</span></span>`:`<span class="title" data-title-label="${t(o.id)}" title="${t(e("chat.rename"))}">${t(i)}</span>
            <span class="preview">${t(r||"—")}</span>
            <span class="meta"><span>${t(se(o.updatedAt))}</span></span>`,g=d?`<div class="chat-history-item${n} is-editing" data-conv-body="${t(o.id)}">${m}</div>`:`<div class="chat-history-item${n}" data-open-conv="${t(o.id)}" role="button" tabindex="0" title="${t(i)}">${m}</div>`;return`
        <li class="chat-history-row${n}${d?" is-renaming":""}" data-conv-row="${t(o.id)}">
          ${g}
          <div class="chat-history-item-actions">
            <button type="button" class="icon-action" data-rename-conv="${t(o.id)}" title="${t(e("chat.rename"))}" aria-label="${t(e("chat.rename"))}">✎</button>
            <button type="button" class="icon-action danger" data-del-conv="${t(o.id)}" title="${t(e("chat.deleteConversation"))}" aria-label="${t(e("chat.deleteConversation"))}">×</button>
          </div>
        </li>`}).join(""):a.innerHTML=`<li class="chat-history-empty">${t(e("chat.historyEmpty"))}</li>`,s){const o=H.historyLimit,n=Math.max(1,Math.ceil(H.historyTotal/o)||1),i=Math.min(H.historyPage+1,n),r=q("chat.historyPage",{n:i,total:n}),d=H.historyPage>0,u=(H.historyPage+1)*o<H.historyTotal;s.innerHTML=`
      <button type="button" class="btn secondary sm" id="chat-hist-prev" ${d?"":"disabled"}>${t(e("chat.historyPrev"))}</button>
      <span>${t(r)}</span>
      <button type="button" class="btn secondary sm" id="chat-hist-next" ${u?"":"disabled"}>${t(e("chat.historyNext"))}</button>
    `;const m=document.getElementById("chat-hist-prev"),g=document.getElementById("chat-hist-next");m&&(m.onclick=()=>{H.historyPage>0&&(H.historyPage-=1,We())}),g&&(g.onclick=()=>{(H.historyPage+1)*o<H.historyTotal&&(H.historyPage+=1,We())})}if(a.querySelectorAll("[data-open-conv]").forEach(o=>{const n=o.getAttribute("data-open-conv");if(!n)return;let i=null;const r=()=>{i&&(clearTimeout(i),i=null)};o.addEventListener("click",d=>{H.renamingId||d.target instanceof Element&&d.target.closest(".chat-history-item-actions")||(r(),i=setTimeout(()=>{i=null,!H.renamingId&&Wa(n)},280))}),o.addEventListener("dblclick",d=>{d.preventDefault(),d.stopPropagation(),r(),ra(n)}),o.addEventListener("keydown",d=>{(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),H.renamingId||Wa(n))})}),a.querySelectorAll("[data-title-label]").forEach(o=>{o.addEventListener("dblclick",n=>{n.preventDefault(),n.stopPropagation();const i=o.getAttribute("data-title-label");i&&ra(i)})}),a.querySelectorAll("[data-rename-conv]").forEach(o=>{o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const i=o.getAttribute("data-rename-conv");i&&ra(i)})}),a.querySelectorAll("[data-del-conv]").forEach(o=>{o.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation();const i=o.getAttribute("data-del-conv");i&&Lo(i)})}),H.renamingId){const o=String(H.renamingId).replace(/\\/g,"\\\\").replace(/"/g,'\\"'),n=a.querySelector(`[data-title-input="${o}"]`);n instanceof HTMLInputElement&&(Co(n,H.renamingId),requestAnimationFrame(()=>{n.isConnected&&(n.focus(),n.select())}))}}}function ra(a){a&&(H.renamingId&&H.renamingId!==a&&(H.renamingId=null),H.renamingId=a,De())}function Co(a,s){let o=!1;const n=async i=>{if(o)return;o=!0;const r=a.value;if(H.renamingId=null,!i){De();return}const d=String(r??"").trim().slice(0,120),u=H.historyItems.find(g=>g.id===s),m=u?(u.title||"").trim():"";if(d===m){De();return}u&&(u.title=d),De();try{await x(`/conversations/${s}`,{method:"PATCH",body:JSON.stringify({title:d})}),await We()}catch(g){j(g.message||e("chat.saveFail")),await We()}};a.addEventListener("keydown",i=>{i.stopPropagation(),i.key==="Enter"?(i.preventDefault(),n(!0)):i.key==="Escape"&&(i.preventDefault(),n(!1))}),a.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation()}),a.addEventListener("mousedown",i=>i.stopPropagation()),a.addEventListener("dblclick",i=>{i.preventDefault(),i.stopPropagation()}),a.addEventListener("blur",()=>{setTimeout(()=>n(!0),0)})}async function Wa(a){(!a||Se)&&Se&&Se.abort();try{j("");const s=await x(`/conversations/${a}`),o=s.data||s;H.conversationId=o.id,Ue=0,Ne.clear(),ae=(o.messages||[]).filter(u=>!u.compressed).map(u=>({role:u.role,content:u.content||"",reasoning:u.reasoning||void 0,docs:u.docs,error:u.error})),de=[],C.systemPrompt=o.systemPrompt||"",xo(o),o.model&&(C.model=o.model),o.apiKeyId&&(C.keyId=o.apiKeyId);const n=document.getElementById("chat-system");n&&(n.value=C.systemPrompt);const i=document.getElementById("chat-system-wrap");i&&(i.hidden=!C.systemPrompt.trim()&&!C.systemOpen);const r=document.getElementById("chat-model");r&&o.model&&(r.value=o.model);const d=document.getElementById("chat-key-select");d&&o.apiKeyId&&[...d.options].some(m=>m.value===o.apiKeyId)&&(d.value=o.apiKeyId,C.keyId=o.apiKeyId),Ie(),ze(),De(),je(),nt(),ka()}catch(s){j(s.message||e("chat.loadFail"))}}function bt(){const a=Da();return!a||String(a).startsWith("admin-session:")||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(a)?null:a}async function At(){const a=Eo();if(!a.length&&!D.summary)return;if(H.saving){H.saveQueued=!0;return}H.saving=!0,H.saveQueued=!1,me();const s={messages:a,model:C.model||null,systemPrompt:C.systemPrompt||"",apiKeyId:bt(),...Mo()};try{if(H.conversationId)await x(`/conversations/${H.conversationId}`,{method:"PATCH",body:JSON.stringify(s)});else{if(!a.length)return;const o=await x("/conversations",{method:"POST",body:JSON.stringify({...s,title:""})}),n=o.data||o;H.conversationId=n.id}await We()}catch(o){console.warn(o)}finally{H.saving=!1,H.saveQueued&&(H.saveQueued=!1,At().catch(()=>{}))}}async function Lo(a){if(await Z({title:e("chat.deleteConversation"),message:e("chat.deleteConfirm"),variant:"danger",confirmText:e("chat.deleteConversation")}))try{await x(`/conversations/${a}`,{method:"DELETE"}),H.conversationId===a&&(H.conversationId=null,ae=[],de=[],bs(),Ie(),ze(),je(),nt()),H.historyItems.length<=1&&H.historyPage>0&&(H.historyPage-=1),await We()}catch(s){j(s.message||e("common.requestFailed"))}}function Ho(a=!0){Se&&Se.abort(),ae=[],de=[],H.conversationId=null,bs(),a||(C.systemPrompt="",C.systemOpen=!1),Ie(),ze(),De(),je(),nt()}function Ct(){return l.key}function Da(){const s=document.getElementById("chat-key-select")?.value||C.keyId||"";return s&&s!=="session"?s:l.me?.id||""}function me(){const a=document.getElementById("chat-key-select"),s=document.getElementById("chat-model"),o=document.getElementById("chat-reasoning"),n=document.getElementById("chat-system");a&&(C.keyId=a.value==="session"?"":a.value),s&&(C.model=s.value),o&&(C.reasoning=o.checked);const i=document.getElementById("chat-effort");i&&(C.effort=i.value||"");const r=document.getElementById("chat-resume");r&&(C.resumeId=r.value.trim());const d=document.getElementById("chat-fork");d&&(C.forkSession=d.checked);const u=document.getElementById("chat-memory");u&&(C.memory=u.checked);const m=document.getElementById("chat-no-plan");m&&(C.noPlan=m.checked);const g=document.getElementById("chat-perm");g&&(C.permissionMode=g.value||""),n&&(C.systemPrompt=n.value),Jt()}function Jt(){const a=document.querySelector(".chat-shell"),s=document.getElementById("chat-settings-toggle"),o=document.getElementById("chat-settings-summary"),n=document.getElementById("chat-settings-toggle-label");if(a&&a.classList.toggle("is-settings-open",!!C.settingsOpen),s&&s.setAttribute("aria-expanded",C.settingsOpen?"true":"false"),n&&(n.textContent=C.settingsOpen?e("chat.settingsHide"):e("chat.settings")),o){const i=C.model||"—",r=D.mode==="summary"?"chat.ctxModeSummary":D.mode==="recent"?"chat.ctxModeRecent":"chat.ctxModeFull";o.textContent=`${i} · ${e(r)}`}}function ze(){const a=document.getElementById("chat-pending");if(a){if(!de.length){a.innerHTML="",a.hidden=!0;return}a.hidden=!1,a.innerHTML=de.map((s,o)=>`
      <div class="chat-pending-item" title="${t(s.name)}">
        <span class="name">${t(s.name)}</span>
        <span class="muted">${Ce(s.size)}</span>
        <button type="button" class="rm" data-rm-doc="${o}" aria-label="${t(e("chat.removeFile"))}">×</button>
      </div>`).join(""),a.querySelectorAll("[data-rm-doc]").forEach(s=>{s.onclick=()=>{const o=Number(s.getAttribute("data-rm-doc"));de.splice(o,1),ze()}})}}function Do(a,s){return`${a}:${(s||"").length}:${(s||"").slice(0,40)}`}function Ie(){const a=document.getElementById("chat-messages");if(!a)return;const s=a.scrollHeight-a.scrollTop-a.clientHeight<120,o=ae.some(c=>c.streaming),n=document.getElementById("chat-stream-status");if(n&&(n.hidden=!o,n.textContent=o?e("chat.streaming"):""),!ae.length){a.innerHTML=`
      <div class="chat-empty">
        <strong>${t(e("chat.emptyTitle"))}</strong>
        <p>${t(e("chat.emptyHint"))}</p>
      </div>`,yt();return}const i=ae.length,r=Math.max(0,i-ys);Ue>r&&(Ue=r);const d=Ue,u=ae.slice(d),m=d,g=m>0?`<div class="chat-load-older">
          <button type="button" class="btn secondary sm" id="chat-load-older">${t(q("chat.loadOlder",{n:m}))}</button>
        </div>`:"";a.innerHTML=g+u.map((c,b)=>{const p=d+b,f=c.role==="user"?"user":"assistant",k=c.role==="user"?e("chat.you"):e("chat.assistant"),M=c.docs&&c.docs.length?`<div class="chat-attach-list">${c.docs.map(z=>`<span class="chat-attach-chip" title="${t(z.name)}"><span>📎 ${t(z.name)}</span></span>`).join("")}</div>`:"",U=!!c.reasoning?`<details class="chat-reasoning" ${c.streaming||!c.content?"open":""}>
            <summary>${t(e("chat.reasoning"))}${c.streaming&&!c.content?` · ${t(e("chat.streaming"))}`:""}</summary>
            <pre>${t(c.reasoning)}</pre>
          </details>`:"";let E=c.content||"";!E&&c.streaming&&(E=c.reasoning?"":"…");const B=c.error?" error":"",F=c.streaming?" is-streaming":"",S=f==="assistant"&&!c.streaming&&!!E;let w;if(S){const z=Do(p,E);if(Ne.has(z))w=Ne.get(z);else if(w=ts(E),Ne.set(z,w),Ne.size>200){const ue=Ne.keys().next().value;Ne.delete(ue)}}else w=t(E);const A=!c.streaming&&E.length>wo,I=`${S?"chat-content md":"chat-content"}${A?" is-collapsible":""}`,y=A?`<button type="button" class="btn ghost sm chat-expand-btn" data-expand="${p}">${t(e("chat.showMore"))}</button>`:"",$=Oo(c),v=$?`<div class="muted chat-spend">${t($)}</div>`:"",O=c.media,T=O?.assetId?`<div class="chat-media" data-chat-media="${t(O.assetId)}" data-chat-media-kind="${t(O.kind||"image")}"></div>
             <a class="chat-media-open" href="#/media">${t(e("chat.openInLibrary"))}</a>`:"",N=Array.isArray(c.tools)&&c.tools.length?`<div class="chat-tools">${c.tools.map(z=>`<span class="chat-tool-chip" title="${t(z.arguments||"")}">${t(z.name||"tool")}</span>`).join("")}</div>`:"",Q=E?`<button type="button" class="chat-copy-btn" data-copy-msg="${p}" title="${t(e("chat.copy"))}">${t(e("chat.copy"))}</button>`:"";return`<div class="chat-bubble ${f}${B}${F}" data-msg-idx="${p}">
        <div class="chat-bubble-head">
          <div class="chat-role">${t(k)}${c.streaming?` <span class="chat-live">${t(e("chat.streaming"))}</span>`:""}</div>
          ${Q}
        </div>
        ${M}
        ${U}
        ${N}
        ${T}
        <div class="${I}" data-content-idx="${p}">${w}${c.streaming?'<span class="chat-cursor">▍</span>':""}</div>
        ${y}
        ${v}
      </div>`}).join(""),(s||o)&&(a.scrollTop=a.scrollHeight),yt(),Uo().catch(()=>{}),document.getElementById("chat-load-older")?.addEventListener("click",()=>{const c=a.scrollHeight;Ue=Math.max(0,Ue-ko),Ie();const b=document.getElementById("chat-messages");b&&(b.scrollTop=b.scrollHeight-c)}),a.querySelectorAll("[data-expand]").forEach(c=>{c.addEventListener("click",()=>{const b=a.querySelector(`[data-content-idx="${c.getAttribute("data-expand")}"]`);b&&(b.classList.toggle("is-expanded"),c.textContent=b.classList.contains("is-expanded")?e("chat.showLess"):e("chat.showMore"))})}),a.querySelectorAll("[data-copy-msg]").forEach(c=>{c.addEventListener("click",async b=>{b.preventDefault(),b.stopPropagation();const p=Number(c.getAttribute("data-copy-msg")),f=ae[p];if(!f?.content)return;if(await ea(f.content)){const M=c.textContent;c.textContent=e("chat.copied"),c.classList.add("is-copied"),setTimeout(()=>{c.isConnected&&(c.textContent=M||e("chat.copy"),c.classList.remove("is-copied"))},1600)}else j(e("chat.copyFail"))})})}function ca(a){const o=a.replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`),n=o.pop()||"",i=[];for(const r of o){const d=r.trim();if(!d||d.startsWith(":")||!d.startsWith("data:"))continue;const u=d.slice(5).trim();u&&i.push(u)}return{events:i,rest:n}}function Oo(a){if(!a||a.streaming)return"";const s=[],o=a.usage;if(o&&(o.prompt_tokens||o.completion_tokens||o.total_tokens)){const i=o.prompt_tokens_details?.cached_tokens,r=i!=null?` · ${e("chat.cacheTokens")}: ${i}`:"";s.push(`${e("chat.tokens")}: ${o.prompt_tokens||0}+${o.completion_tokens||0}=${o.total_tokens||0}${r}`)}const n=a.grok?.cost?.total_cost_usd;return typeof n=="number"&&s.push(`${e("chat.cost")}: $${n.toFixed(6)}`),a.grok?.sessionId&&s.push(`${e("chat.resume")}: ${a.grok.sessionId}`),s.join(" · ")}function Ot(a,s){if(!s||typeof s!="object")return!1;if(s.error){const d=Sa({error:s.error});return a.error=!0,a.content=(a.content||"")+`
✗ ${d}`,!0}const o=s.choices?.[0]?.delta||{};let n=!1;if(o.reasoning_content&&(a.reasoning=(a.reasoning||"")+o.reasoning_content,n=!0),(o.thought&&!o.reasoning_content||o.thought&&o.reasoning_content&&o.thought!==o.reasoning_content)&&(a.reasoning=(a.reasoning||"")+o.thought,n=!0),typeof o.content=="string"&&o.content.length&&(a.content=(a.content||"")+o.content,n=!0),s.usage&&typeof s.usage=="object"&&(a.usage=s.usage,n=!0),s.grok&&typeof s.grok=="object"){if(a.grok={...a.grok||{},...s.grok},a.grok.sessionId){C.resumeId=a.grok.sessionId;const d=document.getElementById("chat-resume");d&&(d.value=a.grok.sessionId)}n=!0}if(s.grok_event&&typeof s.grok_event=="object"){const d=s.grok_event;if(Array.isArray(a.tools)||(a.tools=[]),d.type==="tool_call"||d.type==="tool_call_update"){const u=d.toolCallId,m=u?a.tools.find(p=>p.id===u):null,g=d.toolName||d.title||m?.name||"tool",c=d.rawInput!=null?typeof d.rawInput=="string"?d.rawInput:JSON.stringify(d.rawInput):m?.arguments||"",b=d.status?`${g} (${d.status})`:g;m?(m.name=b,c&&(m.arguments=c)):a.tools.push({id:u,name:b,arguments:c}),n=!0}}const i=s.choices?.[0]?.delta?.tool_calls;if(Array.isArray(i)&&i.length){Array.isArray(a.tools)||(a.tools=[]);for(const d of i){const u=d?.function?.name||d?.name||"tool",m=d?.function?.arguments||"";a.tools.push({id:d?.id,name:u,arguments:typeof m=="string"?m:JSON.stringify(m||{})})}n=!0}const r=s.choices?.[0]?.message;return r&&(r.content&&!a.content&&(a.content=r.content,n=!0),r.reasoning_content&&!a.reasoning&&(a.reasoning=r.reasoning_content,n=!0)),n}function _o(a,s){const o=Ct();return o?new Promise((n,i)=>{const r=new FormData;r.append("file",a,a.name);const d=bt();d&&r.append("apiKeyId",d);const u=new XMLHttpRequest;u.open("POST","/admin/api/documents"),u.setRequestHeader("Authorization",`Bearer ${o}`),u.upload.onprogress=m=>{if(s)if(m.lengthComputable&&m.total>0){const g=Math.min(100,Math.round(m.loaded/m.total*100));s({loaded:m.loaded,total:m.total,percent:g})}else s({loaded:m.loaded||0,total:0,percent:-1})},u.onload=()=>{let m=null;try{m=u.responseText?JSON.parse(u.responseText):null}catch{m=null}if(u.status<200||u.status>=300){const b=m?.error?.message||m?.message||u.responseText||u.statusText;i(new Error(b||e("chat.uploadFail")));return}const g=m?.data||m,c=g?.id;if(!c||typeof c!="string"){i(new Error(e("chat.uploadFail")));return}n({id:c,name:g.originalName||g.filename||a.name,mime:g.mimeType||a.type||"",size:g.sizeBytes??g.size??a.size??0})},u.onerror=()=>i(new Error(e("chat.uploadFail"))),u.onabort=()=>i(new Error(e("chat.uploadFail"))),u.send(r)}):Promise.reject(new Error(e("chat.needKey")))}function _t(a){const s=document.getElementById("chat-upload-progress");if(!s)return;const{visible:o,fileName:n,fileIndex:i,fileTotal:r,percent:d,indeterminate:u}=a;if(!o){s.hidden=!0,s.setAttribute("aria-hidden","true");return}s.hidden=!1,s.setAttribute("aria-hidden","false");const m=document.getElementById("chat-upload-label"),g=document.getElementById("chat-upload-bar"),c=document.getElementById("chat-upload-pct"),b=n||"",p=i||1,f=r||1;m&&(m.textContent=f>1?q("chat.uploadProgressMulti",{name:b,i:p,n:f}):q("chat.uploadProgress",{name:b}));const k=!!u||d<0;g&&(g.classList.toggle("is-indeterminate",k),k?g.style.width="40%":g.style.width=`${Math.max(0,Math.min(100,d))}%`),c&&(c.textContent=k?e("chat.uploading"):q("common.percent",{n:Math.max(0,Math.min(100,d))}))}function Fo(a){const s=Array.isArray(a)?a:[];if(!s.length)return{added:0,skipped:0};let o=0,n=0;const i=new Set(de.map(r=>r.id));for(const r of s){if(de.length>=Gt){n+=s.length-o-n;break}const d=r?.id,u=r?.name||r?.originalName||"";if(!d||!Ha.test(String(d))){n+=1;continue}if(!zt(u)){n+=1;continue}if(i.has(d)){n+=1;continue}de.push({id:d,name:u||d,mime:r.mime||r.mimeType||"",size:r.size??r.sizeBytes??0}),i.add(d),o+=1}return ze(),{added:o,skipped:n}}async function Ro(){if(!Ct()){j(e("chat.needKey"));return}const a=bt(),s=Math.max(0,Gt-de.length);if(s<=0){j(e("chat.tooManyFiles"));return}const o=new Map;let n=0;vt({title:e("chat.libraryTitle"),subtitle:t(e("chat.librarySubtitle")),size:"md",bodyHtml:`
      <div class="chat-lib">
        <div class="chat-lib-toolbar">
          <input type="search" id="chat-lib-q" class="chat-lib-search" placeholder="${t(e("chat.librarySearch"))}" autocomplete="off" />
          <span class="muted chat-lib-count" id="chat-lib-count">${t(q("chat.librarySelected",{n:0}))}</span>
        </div>
        <div class="muted chat-lib-formats">${t(e("chat.formatsLabel"))}: ${t(Vt())}</div>
        <div id="chat-lib-list" class="chat-lib-list" role="listbox" aria-multiselectable="true">
          <div class="muted chat-lib-status">${t(e("common.loading")||"…")}</div>
        </div>
      </div>`,footerHtml:`
      <button type="button" class="btn secondary sm" id="chat-lib-cancel">${t(e("common.cancel"))}</button>
      <button type="button" class="btn sm" id="chat-lib-add" disabled>${t(e("chat.libraryAdd"))}</button>`});const i=document.getElementById("chat-lib-list"),r=document.getElementById("chat-lib-q"),d=document.getElementById("chat-lib-count"),u=document.getElementById("chat-lib-add");document.getElementById("chat-lib-cancel")?.addEventListener("click",()=>we());const m=()=>{d&&(d.textContent=q("chat.librarySelected",{n:o.size})),u&&(u.disabled=o.size===0,u.textContent=o.size>0?`${e("chat.libraryAdd")} (${o.size})`:e("chat.libraryAdd"))},g=p=>{if(!i)return;const f=new Set(de.map(M=>M.id)),k=(p||[]).filter(M=>zt(M.originalName));if(!k.length){i.innerHTML=`<div class="data-empty chat-lib-empty"><strong>${t(e("chat.libraryEmpty"))}</strong></div>`;return}i.innerHTML=k.map(M=>{const L=f.has(M.id),U=o.has(M.id),E=L&&!U;return`
          <label class="chat-lib-row ${L?"is-already":""} ${U?"is-selected":""}" data-id="${t(M.id)}">
            <input type="checkbox" data-lib-id="${t(M.id)}" ${U?"checked":""} ${E?"disabled":""} />
            <span class="chat-lib-meta">
              <span class="chat-lib-name" title="${t(M.originalName)}">${t(M.originalName)}</span>
              <span class="muted">${t(M.mimeType||"")} · ${Ce(M.sizeBytes||0)}${L?` · ${t(e("chat.libraryAlready"))}`:""}</span>
            </span>
          </label>`}).join(""),i.querySelectorAll("input[data-lib-id]").forEach(M=>{M.addEventListener("change",()=>{const L=M.getAttribute("data-lib-id"),U=k.find(B=>B.id===L);if(!U)return;if(M.checked){if(o.size>=s&&!o.has(L)){M.checked=!1,j(e("chat.tooManyFiles"));return}o.set(L,U)}else o.delete(L);const E=M.closest(".chat-lib-row");E&&E.classList.toggle("is-selected",M.checked),m()})})},c=async()=>{const p=++n;i&&(i.innerHTML=`<div class="muted chat-lib-status">${t(e("common.loading")||"…")}</div>`);try{const f=new URLSearchParams({limit:"50",offset:"0"});a&&f.set("apiKeyId",a);const k=(r?.value||"").trim();k&&f.set("q",k);const M=await x(`/documents?${f}`);if(p!==n)return;g(M.data||[])}catch(f){if(p!==n)return;i&&(i.innerHTML=`<div class="error-box">${t(f.message||e("chat.libraryLoadFail"))}</div>`)}};let b=null;r?.addEventListener("input",()=>{b&&clearTimeout(b),b=setTimeout(()=>c(),280)}),u?.addEventListener("click",()=>{const p=[...o.values()],{added:f}=Fo(p.map(k=>({id:k.id,name:k.originalName,mime:k.mimeType,size:k.sizeBytes})));we(),f>0&&j("")}),m(),await c(),r?.focus()}async function ks(a){const s=[...a||[]];if(!s.length)return;if(!Ct()){j(e("chat.needKey"));return}const o=s.filter(u=>!zt(u.name)),n=s.filter(u=>zt(u.name));if(o.length&&(j(q("chat.formatsReject",{name:o.map(u=>u.name).join(", "),formats:Vt()})),!n.length))return;if(de.length+n.length>Gt){j(e("chat.tooManyFiles"));return}const i=document.getElementById("chat-attach"),r=document.getElementById("chat-send");i&&(i.disabled=!0,i.textContent=e("chat.uploading")),r&&(r.disabled=!0);const d=n.length;try{let u=0;for(const m of n){if(de.length>=Gt)break;u+=1,_t({visible:!0,fileName:m.name,fileIndex:u,fileTotal:d,percent:0,indeterminate:!1});const g=await _o(m,({percent:c})=>{_t({visible:!0,fileName:m.name,fileIndex:u,fileTotal:d,percent:c<0?0:c,indeterminate:c<0})});_t({visible:!0,fileName:m.name,fileIndex:u,fileTotal:d,percent:100,indeterminate:!1}),de.some(c=>c.id===g.id)||de.push(g),ze()}o.length||j("")}catch(u){j(u.message||e("chat.uploadFail"))}finally{_t({visible:!1}),i&&(i.disabled=!1,i.textContent=e("chat.attach")),r&&(r.disabled=!1)}}function No(){const a=l.me?.id||"",s=l.me?`${e("chat.useSessionKey")} · ${l.me.name||""} (${l.me.keyPrefix||""}…)`:e("chat.useSessionKey"),o=C.keyId||"session",n=(l.keys||[]).filter(r=>r.isActive!==!1),i=[`<option value="session" ${o==="session"||o===a||!o?"selected":""}>${t(s)}</option>`];for(const r of n){if(a&&r.id===a)continue;const d=`${r.name||"key"} · ${r.keyPrefix||""}… · ${r.role||""}/${r.mode||""}`;i.push(`<option value="${t(r.id)}" ${o===r.id?"selected":""}>${t(d)}</option>`)}return i.join("")}const Oa="piper/lessac-high";function _a(a,s){const o=String(a||"");if(!o||o==="echo")return"text";if(o===Oa||/^piper\//i.test(o))return"tts";const n=(s||l.catalogLocal||[]).find(d=>d.id===o||d.repoId===o),i=String(n?.runtime||""),r=String(n?.modality||"");return i==="whisper"||r==="stt"?"stt":i==="tts"||r==="tts"?"tts":r==="video"||/zeroscope|ltx-video|text-to-video|cogvideox|wan2/i.test(o)?"video":i==="diffusion"||r==="image"||/sdxl|tiny-sd|stable-diffusion/i.test(o)?"image":"text"}function ws(a,s){const o=_a(a,s),n=e(`chat.modelKind_${o}`);return a===Oa?`Piper lessac-high · ${n}`:`${a} · ${n}`}async function Ko(a){const s=await fetch(`/admin/api/media/assets/${a}/download`,{headers:{Authorization:`Bearer ${l.key}`}});if(!s.ok)throw new Error(await s.text());return s.blob()}async function Uo(){const a=document.querySelectorAll("[data-chat-media]");for(const s of a){if(s.getAttribute("data-hydrated")==="1")continue;const o=s.getAttribute("data-chat-media"),n=s.getAttribute("data-chat-media-kind");if(o)try{const i=await Ko(o),r=URL.createObjectURL(i);s.setAttribute("data-hydrated","1"),n==="image"?s.innerHTML=`<img src="${r}" alt="" />`:n==="video"?s.innerHTML=`<video controls src="${r}" playsinline></video>`:n==="audio"&&(s.innerHTML=`<audio controls src="${r}"></audio>`)}catch{s.textContent=e("chat.uploadFail")}}}async function Qo(a){for(let s=0;s<90;s+=1){const n=((await x("/media/jobs?limit=50&offset=0")).data||[]).find(i=>i.id===a);if(n&&(n.status==="completed"||n.status==="failed"))return n;await new Promise(i=>setTimeout(i,2e3))}throw new Error(e("chat.mediaBusy_video"))}async function jo(a,{text:s,pending:o,model:n,apiKeyId:i}){const r=i?{apiKeyId:i}:{};if(a==="image"){const d=await x("/media/generate",{method:"POST",body:JSON.stringify({prompt:s,model:n,format:"png",n:1,...r})}),u=d.data?.grok?.asset_ids?.[0]||d.grok?.asset_ids?.[0];if(!u)throw new Error(e("chat.emptyReply"));return{kind:"image",assetId:u,mime:"image/png",caption:e("chat.mediaDone_image")}}if(a==="video"){const d=await x("/media/videos",{method:"POST",body:JSON.stringify({prompt:s,model:n,format:"mp4",...r})}),m=(d.data||d).id;if(!m)throw new Error(e("chat.emptyReply"));const g=await Qo(m);if(g.status!=="completed"||!g.result_asset_id)throw new Error(g.error||e("chat.emptyReply"));return{kind:"video",assetId:g.result_asset_id,mime:"video/mp4",caption:e("chat.mediaDone_video")}}if(a==="tts"){const d=await x("/media/speech",{method:"POST",body:JSON.stringify({input:s,format:"wav",...r})}),u=d.data?.asset_id;if(!u)throw new Error(e("chat.emptyReply"));return{kind:"audio",assetId:u,mime:d.data?.mime||"audio/wav",caption:e("chat.mediaDone_tts")}}if(a==="stt"){const d=o?.[0]?.id;if(!d)throw new Error(e("chat.needAudioAttach"));const u=new FormData;u.append("sourceDocumentId",d),i&&u.append("apiKeyId",i);const m=await Ft(await fetch("/admin/api/media/transcribe",{method:"POST",headers:{Authorization:`Bearer ${l.key}`},body:u}));return{kind:"text",assetId:m.data?.asset_id,text:m.data?.text||"",caption:m.data?.text||e("chat.mediaDone_stt")}}throw new Error(e("chat.emptyReply"))}function Wo(a){if(!a||a==="session")return null;const o=(l.keys||[]).find(n=>n.id===a)?.allowedModels;return!o||!o.length?null:o}function Ss(a,s){const o=Wo(s);if(!o)return a;const n=new Set(o);return a.filter(i=>n.has(i))}function Go(){const a=document.getElementById("chat-model");if(!a)return;const s=l.playgroundAllModels||l.models||[],o=Ss(s,C.keyId);o.length&&C.model&&!o.includes(C.model)&&(C.model=o[0]),a.innerHTML=o.length?o.map(n=>`<option value="${t(n)}" ${C.model===n?"selected":""}>${t(ws(n,l.catalogLocal))}</option>`).join(""):'<option value="echo">echo</option>'}function zo(a,s,o){const n=new Set,i=[],r=d=>{const u=String(d||"").trim();!u||n.has(u)||(n.add(u),i.push(u))};for(const d of s||[])r(d.id||d);for(const d of o||[])r(d.id||d);for(const d of a||[])d!=="echo"&&r(d);return r(Oa),r("echo"),i}async function Vo(){const[,,a]=await Promise.all([It(!1),Bt(),x("/catalog").catch(()=>({loaded:[],local:[]}))]);l.catalogLocal=a.local||[];const s=zo(l.models||[],a.loaded||[],a.local||[]);l.playgroundAllModels=s;const o=Ss(s,C.keyId);l.models=o;const n=a.loaded&&a.loaded[0]&&a.loaded[0].id||o.find(b=>b!=="echo")||"echo";(!C.model||C.model==="echo"||!o.includes(C.model))&&(C.model=n);const i=o.map(b=>`<option value="${t(b)}" ${C.model===b?"selected":""}>${t(ws(b,l.catalogLocal))}</option>`).join("");$a(!1),document.getElementById("app").innerHTML=ne(`
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
              <select id="chat-key-select">${No()}</select>
            </label>
            <label>${t(e("chats.model"))}
              <select id="chat-model">${i||'<option value="echo">echo</option>'}</select>
            </label>
            <label class="check-inline" for="chat-reasoning">
              <input type="checkbox" id="chat-reasoning" ${C.reasoning!==!1?"checked":""} />
              ${t(e("chat.includeReasoning"))}
            </label>
            <label class="chat-ctx-label">${t(e("chat.effort"))}
              <select id="chat-effort">
                ${["","none","minimal","low","medium","high","xhigh","max"].map(b=>{const p=e(b?`chat.effort_${b}`:"chat.effortDefault"),f=(C.effort||"")===b?" selected":"";return`<option value="${t(b)}"${f}>${t(p)}</option>`}).join("")}
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
                ${["","default","acceptEdits","auto","dontAsk","bypassPermissions","plan"].map(b=>{const p=b||e("chat.effortDefault"),f=(C.permissionMode||"")===b?" selected":"";return`<option value="${t(b)}"${f}>${t(p)}</option>`}).join("")}
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
                <input type="file" id="chat-file" class="chat-file-input" multiple accept="${t(Rs)}" />
                <button type="button" class="btn secondary sm" id="chat-attach" title="${t(e("chat.attachHint"))}">${t(e("chat.attach"))}</button>
                <button type="button" class="btn secondary sm" id="chat-attach-lib" title="${t(e("chat.libraryTitle"))}">${t(e("chat.attachLibrary"))}</button>
                <span class="chat-formats-hint" title="${t(Vt())}">
                  <span class="chat-formats-label">${t(e("chat.formatsLabel"))}</span>
                  <span class="muted">${t(Vt())}</span>
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
            <input type="search" id="chat-history-search" class="chat-history-search" placeholder="${t(e("chat.historySearch"))}" value="${t(H.historyQ)}" />
          </div>
          <ul class="chat-history-list" id="chat-history-list"></ul>
          <div class="chat-history-pager" id="chat-history-pager"></div>
        </aside>
      </div>
    </div>
  `),ie(),Ie(),ze(),De(),yt(),je(),nt(),Jt(),We().catch(()=>{}),document.getElementById("chat-settings-toggle")?.addEventListener("click",()=>{C.settingsOpen=!C.settingsOpen,Jt()}),document.getElementById("chat-key-select").onchange=()=>{me(),Go()};const r=document.getElementById("chat-ctx-mode"),d=document.getElementById("chat-ctx-n");r&&(r.onchange=()=>{const b=r.value;if(b==="summary"&&!D.summary){j(e("chat.compressNeedSummary")),r.value=D.mode==="recent"?"recent":"full";return}D.mode=b==="summary"||b==="recent"?b:"full",je(),nt(),At().catch(()=>{})}),d&&(d.onchange=()=>{D.recentN=Math.min(40,Math.max(2,Number(d.value)||6)),je(),At().catch(()=>{})}),document.getElementById("chat-model").onchange=()=>me(),document.getElementById("chat-reasoning").onchange=()=>me(),document.getElementById("chat-effort")?.addEventListener("change",()=>me()),document.getElementById("chat-resume")?.addEventListener("change",()=>me()),document.getElementById("chat-fork")?.addEventListener("change",()=>me()),document.getElementById("chat-memory")?.addEventListener("change",()=>me()),document.getElementById("chat-no-plan")?.addEventListener("change",()=>me()),document.getElementById("chat-perm")?.addEventListener("change",()=>me()),document.getElementById("chat-system").oninput=()=>me(),document.getElementById("chat-system-toggle").onclick=()=>{me(),C.systemOpen=!C.systemOpen;const b=document.getElementById("chat-system-wrap");b&&(b.hidden=!C.systemOpen&&!C.systemPrompt.trim()),C.systemOpen&&document.getElementById("chat-system")?.focus()},document.getElementById("chat-new").onclick=()=>{Ho(!0)},document.getElementById("chat-compress").onclick=()=>{Bo().catch(()=>{})},document.getElementById("chat-stop").onclick=()=>{Se&&Se.abort()},document.getElementById("chat-send").onclick=()=>Ga(),document.getElementById("chat-attach").onclick=()=>{document.getElementById("chat-file")?.click()},document.getElementById("chat-attach-lib")?.addEventListener("click",()=>{Ro().catch(b=>j(b.message||e("chat.libraryLoadFail")))}),document.getElementById("chat-file").onchange=b=>{const p=b.target;ks(p.files).finally(()=>{p.value=""})};const u=document.getElementById("chat-history-toggle"),m=document.getElementById("chat-history-backdrop"),g=document.getElementById("chat-history-close-mobile");u&&(u.onclick=()=>{$a(!H.historyOpenMobile)}),m&&(m.onclick=()=>ka()),g&&(g.onclick=()=>ka());const c=document.getElementById("chat-history-search");c&&(c.oninput=()=>{H.historyQ=c.value,da&&clearTimeout(da),da=setTimeout(()=>{H.historyPage=0,We()},280)}),Jo(),document.getElementById("chat-input").onkeydown=b=>{b.key==="Enter"&&!b.shiftKey&&(b.preventDefault(),Ga())}}function Jo(){const a=document.getElementById("chat-page"),s=document.getElementById("chat-drop-overlay"),o=document.getElementById("chat-composer");if(!a)return;let n=0;const i=p=>{const f=p.dataTransfer?.types;return f?typeof f.includes=="function"?f.includes("Files"):[...f].includes("Files"):!1},r=p=>{a.classList.toggle("is-file-drag",p),o&&o.classList.toggle("is-dragover",p),s&&(s.hidden=!p,s.setAttribute("aria-hidden",p?"false":"true"))},d=p=>{i(p)&&(p.preventDefault(),p.stopPropagation(),n+=1,r(!0))},u=p=>{i(p)&&(p.preventDefault(),p.stopPropagation(),p.dataTransfer&&(p.dataTransfer.dropEffect="copy"),r(!0))},m=p=>{i(p)&&(p.preventDefault(),p.stopPropagation(),n=Math.max(0,n-1),n===0&&r(!1))},g=p=>{if(!i(p))return;p.preventDefault(),p.stopPropagation(),n=0,r(!1);const f=p.dataTransfer?.files;f?.length&&ks(f).catch(k=>j(k.message||e("chat.uploadFail")))};a.addEventListener("dragenter",d),a.addEventListener("dragover",u),a.addEventListener("dragleave",m),a.addEventListener("drop",g);const c=p=>{l.page==="chat"&&i(p)&&p.preventDefault()},b=p=>{l.page==="chat"&&i(p)&&p.preventDefault()};window.addEventListener("dragover",c),window.addEventListener("drop",b),a._chatDropCleanup=()=>{window.removeEventListener("dragover",c),window.removeEventListener("drop",b)}}function Xo(a){const s=new Set,o=[],n=i=>{if(!i||typeof i!="string")return;const r=i.trim();!Ha.test(r)||s.has(r)||(s.add(r),o.push(r))};for(const i of a||[])n(i?.id);for(const i of ae)if(i?.docs?.length)for(const r of i.docs)n(r?.id);return o}async function Ga(){me();const a=document.getElementById("chat-input");let s=a?.value.trim()||"";const o=[...de];if(!s&&!o.length){j(e("chat.needContent"));return}const n=Ct();if(!n){j(e("chat.needKey"));return}if(!s&&o.length&&(s=e("chat.fileOnlyPrompt")),o.filter(E=>!E?.id||!Ha.test(String(E.id))).length){j(e("chat.uploadFail"));return}const r=document.getElementById("chat-model")?.value||C.model||"echo",d=_a(r,l.catalogLocal);if(d==="stt"&&!o.length){j(e("chat.needAudioAttach"));return}const u=document.getElementById("chat-reasoning")?.checked!==!1,m=document.getElementById("chat-effort")?.value||C.effort||"";Da();const g=o.map(E=>({id:E.id,name:E.name})),c=Xo(o);ae.push({role:"user",content:s,docs:g.length?g:void 0}),a&&(a.value=""),de=[],ze();const b={role:"assistant",content:"",reasoning:"",streaming:!0};ae.push(b),Ue=Math.max(0,ae.length-ys),Ie();const f=Io(),k=document.getElementById("chat-send"),M=document.getElementById("chat-stop"),L=document.getElementById("chat-attach"),U=document.getElementById("chat-attach-lib");k&&(k.disabled=!0),L&&(L.disabled=!0),U&&(U.disabled=!0),M&&(M.disabled=!1),Se=new AbortController;try{if(d!=="text"){b.content=e(`chat.mediaBusy_${d}`),Ie();const S=await jo(d,{text:s,pending:o,model:r,apiKeyId:bt()});b.streaming=!1,b.content=S.caption||"",b.media=S,Ie();return}const E={model:r,stream:!0,include_reasoning:u,messages:f};m&&(E.reasoning_effort=m),me(),C.resumeId&&(E.resume=C.resumeId),C.forkSession&&(E.fork_session=!0),C.memory&&(E.experimental_memory=!0),C.noPlan&&(E.no_plan=!0),C.permissionMode&&(E.permission_mode=C.permissionMode),c.length&&(E.document_ids=c);const B=bt();B&&(E.apiKeyId=B);const F=await fetch("/admin/api/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${n}`,"Content-Type":"application/json"},body:JSON.stringify(E),signal:Se.signal});if(!F.ok){const S=await F.text();let w=S;try{w=JSON.parse(S).error?.message||S}catch{}throw new Error(w||F.statusText)}if(F.body&&typeof F.body.getReader=="function"){const S=F.body.getReader(),w=new TextDecoder;let A="",I=0;const y=($=!1)=>{const v=performance.now();($||v-I>40)&&(I=v,Ie())};for(;;){const{done:$,value:v}=await S.read();if($)break;A+=w.decode(v,{stream:!0});const{events:O,rest:T}=ca(A);A=T;let N=!1;for(const Q of O)if(Q!=="[DONE]")try{const z=JSON.parse(Q);Ot(b,z)&&(N=!0)}catch{}N&&y(!1)}if(A.trim()){const{events:$}=ca(A+`
`);for(const v of $)if(v!=="[DONE]")try{Ot(b,JSON.parse(v))}catch{}}y(!0)}else{const S=await F.text(),{events:w}=ca(S+`
`);for(const A of w)if(A!=="[DONE]")try{Ot(b,JSON.parse(A))}catch{try{const I=JSON.parse(S);Ot(b,I)}catch{}}Ie()}!b.content&&!b.reasoning&&(b.content=e("chat.emptyReply")),j("")}catch(E){E.name==="AbortError"?b.content=(b.content||"")+`
[${e("chat.stopped")}]`:(b.error=!0,b.content=(b.content||"")+`
✗ ${E.message||E}`,j(E.message||String(E)))}finally{b.streaming=!1,Se=null,Ie(),yt(),k&&(k.disabled=!1),L&&(L.disabled=!1),U&&(U.disabled=!1),M&&(M.disabled=!0),At().catch(()=>{})}}const ua="email@ysk.hk",Yo="https://github.com/sponsors/yanshekki",Zo="https://linktr.ee/yanshekki",en="https://ysk.hk/",tn="https://github.com/yanshekki/ysk-omni#readme";async function an(){const s=[[e("support.netEvm"),"yanshekki.eth"],[e("support.netNear"),"yanshekki.near"],[e("support.netAda"),"$yanshekki"]].map(([o,n])=>`
      <tr>
        <td>${t(o)}</td>
        <td><code class="cell-code">${t(n)}</code></td>
        <td class="row-actions"><button type="button" class="btn secondary sm" data-copy="${t(n)}">${t(e("support.copy"))}</button></td>
      </tr>`).join("");document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("support.title"))}</h2>
    </div>
    ${ve([e("support.subtitle")])}
    <div class="support-pills" role="navigation">
      <button type="button" class="seg-tab is-active" data-jump="support-creator">${t(e("support.pillSupport"))}</button>
      <button type="button" class="seg-tab" data-jump="support-sponsor">${t(e("support.pillSponsor"))}</button>
      <a class="seg-tab" href="mailto:${ua}">${t(e("support.pillHelp"))}</a>
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
            <a class="btn" href="${Yo}" target="_blank" rel="noopener noreferrer">${t(e("support.githubSponsors"))}</a>
            <a class="btn secondary" href="${Zo}" target="_blank" rel="noopener noreferrer">${t(e("support.linktree"))}</a>
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
          <a class="btn secondary sm" href="${en}" target="_blank" rel="noopener noreferrer">${t(e("support.site"))}</a>
        </div>
      </section>
      <section class="panel support-panel" id="support-help">
        <div class="panel-h"><strong>${t(e("support.helpTitle"))}</strong></div>
        <div class="panel-pad">
          <p class="support-prose">${t(e("support.helpBody"))}</p>
          <a class="btn support-email-btn" href="mailto:${ua}">${ua}</a>
          <p class="support-docs"><a href="${tn}" target="_blank" rel="noopener noreferrer">${t(e("support.docs"))}</a></p>
        </div>
      </section>
    </div>
  `),ie(),document.querySelectorAll("[data-jump]").forEach(o=>{o.addEventListener("click",()=>{const n=o.getAttribute("data-jump");n&&document.getElementById(n)?.scrollIntoView({behavior:"smooth",block:"start"})})}),document.querySelectorAll("[data-copy]").forEach(o=>{o.addEventListener("click",async()=>{const n=o.getAttribute("data-copy")||"",i=await ea(n);o.textContent=e(i?"chat.copied":"support.copy"),setTimeout(()=>{o.textContent=e("support.copy")},1400)})})}const sn=[{id:"Qwen/Qwen2.5-0.5B-Instruct-GGUF",modality:"text",runtime:"llamacpp",quants:["Q4_K_M","Q5_K_M","Q8_0"],vramMb:512},{id:"Qwen/Qwen2.5-7B-Instruct",modality:"text",runtime:"vllm",quants:[],vramMb:16e3},{id:"Tongyi-MAI/Z-Image-Turbo",label:"Z-Image-Turbo",modality:"image",runtime:"diffusion",quants:[],vramMb:8e3},{id:"black-forest-labs/FLUX.2-klein-4B",label:"FLUX.2 Klein 4B",modality:"image",runtime:"diffusion",quants:[],vramMb:8e3},{id:"Qwen/Qwen3-TTS",modality:"tts",runtime:"diffusion",quants:[],vramMb:4e3},{id:"Systran/faster-whisper-small",modality:"stt",runtime:"whisper",quants:[],vramMb:1e3},{id:"Lightricks/LTX-2.5",label:"LTX-2.5",modality:"video",runtime:"diffusion",quants:[],vramMb:12e3},{id:"Wan-AI/Wan2.2",label:"Wan 2.2",modality:"video",runtime:"diffusion",quants:[],vramMb:2e4}];function Xt(a){return a.label||String(a.id||"").split("/").pop()||a.id||""}function Ps(a,s){const o=String(a.id||"");return(s||[]).filter(n=>n.id===o||n.repoId===o||String(n.id||"").startsWith(`${o}:`))}function Ut(a){const s=`catalog.mod.${a}`;return ke(s)?e(s):a||"—"}function on(a){const s=a||[];return s.includes("Q4_K_M")?"Q4_K_M":s[0]||""}function nn(a){const s=Number(a)||0;return s>=1e6?`${(s/1e6).toFixed(1)}M`:s>=1e3?`${(s/1e3).toFixed(1)}k`:String(s)}function Tt(a){const s=Number(a)||0;return s<=0?"—":s>=1024?`${(s/1024).toFixed(1)} GB`:`${Math.round(s).toLocaleString()} MB`}function ln(a){const s=a?.status,o=a?.entry?.path;if(s==="done"&&o)return;const n=String(a?.reason||"");throw n.includes("no GGUF")?new Error(e("catalog.pullNoGguf")):new Error(n||e("catalog.pullFail"))}function dn(a){const s=Math.max(0,Math.round(Number(a)||0));if(s<1)return e("catalog.dlEtaCalc");const o=gt()==="zh-Hant",n=Math.floor(s/3600),i=Math.floor(s%3600/60),r=s%60;return n>0?o?`${n} 小時 ${i} 分`:`${n}h ${i}m`:i>0?o?`${i} 分 ${r} 秒`:`${i}m ${r}s`:o?`${r} 秒`:`${r}s`}function rn(a){const s=Number(a)||0;return s<=0?"—":`${Tt(s/(1024*1024))}`}function Es(a){const s=a.samples||[];if(s.length<2)return 0;const o=s[0],n=s[s.length-1],i=(n.t-o.t)/1e3;return i<.4?0:Math.max(0,(n.bytes-o.bytes)/i)}function cn(a){const s=Es(a);return!s||!a.total||a.bytes>=a.total?null:(a.total-a.bytes)/s}function un(a){return a.total?Math.min(100,Math.max(0,Math.round(a.bytes/a.total*100))):0}function Ms(a){return(l.catalogQueue||[]).some(s=>(s.id===a||s.spec===a||String(s.spec).startsWith(`${a}:`))&&(s.status==="queued"||s.status==="downloading"))}function xs(){const a=(l.catalogQueue||[]).filter(o=>o.status==="queued"||o.status==="downloading"||o.status==="done");if(!a.length)return"";const s=a.map(o=>{const n=un(o),i=Es(o),r=cn(o),u=o.status==="downloading"&&o.total<=0?" is-indeterminate":"";let m=e("catalog.dlQueued");if(o.status==="downloading"){const c=[];o.total>0&&(c.push(`${n}%`),c.push(`${Tt(o.bytes/(1024*1024))} / ${Tt(o.total/(1024*1024))}`)),i>0&&c.push(q("catalog.dlSpeed",{speed:rn(i)})),c.push(r!=null?q("catalog.dlEta",{time:dn(r)}):e("catalog.dlEtaCalc")),m=c.join(" · ")}else o.status==="done"?m=e("catalog.dlDone"):o.status==="error"?m=o.error||e("catalog.dlError"):m=e("catalog.dlWaiting");const g=o.status==="downloading"?e("catalog.dlActive"):o.status==="queued"?e("catalog.dlQueued"):o.status==="done"?e("catalog.dlDone"):e("catalog.dlError");return`
        <div class="catalog-dl-job catalog-dl-${t(o.status)}" data-dl-id="${t(o.spec)}">
          <div class="catalog-dl-job-head">
            <div>
              <div class="cell-primary">${t(o.label||o.id)}</div>
              <div class="cell-sub mono">${t(o.spec)}</div>
            </div>
            <span class="badge ${o.status==="error"?"warn":o.status==="done"?"success":"muted"}">${t(g)}</span>
          </div>
          <div class="catalog-pull-progress${u}">
            <div class="catalog-pull-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${n}">
              <span style="width:${o.total>0?n:0}%"></span>
            </div>
            <div class="catalog-pull-meta muted">${t(m)}</div>
          </div>
        </div>`}).join("");return`
    <section id="cat-dl-dock" class="panel catalog-dl-dock" aria-live="polite">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("catalog.dlQueue"))}</strong>
          <span class="muted">${t(String(a.length))}</span>
        </div>
      </div>
      <div class="catalog-dl-list">${s}</div>
    </section>`}function ct(){const a=document.getElementById("cat-dl-dock"),s=xs();if(!s){a&&a.remove();return}if(a){a.outerHTML=s;return}const o=document.querySelector(".catalog-tabs-panel");o&&o.insertAdjacentHTML("beforebegin",s)}function Is(a,s){const o=l.catalogQueue||[];o.some(n=>n.spec===a&&(n.status==="queued"||n.status==="downloading"))||(o.push({id:a.split(":")[0],spec:a,label:s||a,status:"queued",bytes:0,total:0,samples:[],error:""}),l.catalogQueue=o,ct(),As().catch(h))}async function As(){if(l.catalogQueueRunning)return;const a=(l.catalogQueue||[]).find(s=>s.status==="queued");if(a){l.catalogQueueRunning=!0,a.status="downloading",a.samples=[{t:Date.now(),bytes:0}],ct();try{const s=await fetch(`${ft}/catalog/pull`,{method:"POST",headers:{"Content-Type":"application/json",...l.key?{Authorization:`Bearer ${l.key}`}:{}},body:JSON.stringify({model:a.spec})}),o=s.body&&s.body.getReader?s.body.getReader():null;let n="";if(o){const d=new TextDecoder;for(;;){const{done:u,value:m}=await o.read();if(u)break;n+=d.decode(m,{stream:!0});const g=n.split(`
`).map(b=>b.trim()).filter(Boolean),c=g[g.length-1];if(c)try{const b=JSON.parse(c);b.status==="downloading"&&(a.bytes=Number(b.bytes)||0,a.total=Number(b.total)||0,a.samples.push({t:Date.now(),bytes:a.bytes}),a.samples.length>10&&a.samples.shift(),ct())}catch{}}}else n=await s.text();const i=n.split(`
`).map(d=>d.trim()).filter(Boolean),r=i.length?JSON.parse(i[i.length-1]):{};if(!s.ok)throw new Error(r.error?.message||r.reason||s.statusText);ln(r),a.status="done",a.bytes=a.total||a.bytes,ct(),setTimeout(()=>{l.catalogQueue=(l.catalogQueue||[]).filter(u=>u!==a);const d=(l.catalogQueue||[]).some(u=>u.status==="queued"||u.status==="downloading");l.page==="catalog"&&!d?xe().catch(h):ct()},1800)}catch(s){l.catalogQueue=(l.catalogQueue||[]).filter(n=>n!==a),ct();const o=s instanceof Error?s.message:String(s);!o.includes("GGUF")&&!o.includes("GGUF 檔")&&h(s)}finally{l.catalogQueueRunning=!1,As().catch(h)}}}function Ts(a,s){const o=Ps({id:a.id},s),n=Ms(a.id),i=a.runtime==="llamacpp"||a.runtime==="whisper"||a.runtime==="diffusion"||a.runtime==="tts",r=i?`<button type="button" class="btn ${o.length?"secondary":""} sm" data-pull="${t(a.id)}" ${n?"disabled":""}>${t(n?e("catalog.pulling"):o.length?e("catalog.pullAgain"):e("catalog.pull"))}</button>`:`<span class="muted">${t(e("catalog.unsupported"))}</span>`;return`
      <tr>
        <td>
          <div class="cell-primary">${t(Xt(a))}</div>
          <div class="cell-sub mono">${t(a.id)}</div>
        </td>
        <td><span class="badge muted">${t(Ut(a.modality))}</span></td>
        <td><span class="badge muted">${t(a.runtime||"—")}</span></td>
        <td class="catalog-vram-cell">
          <div class="cell-primary">${t(Tt(a.sizeMb))}</div>
          <div class="cell-sub">${t(a.sizeLabel||e("catalog.sizeEst"))}</div>
        </td>
        <td class="catalog-vram-cell">
          <div class="cell-primary">${t(Tt(a.vramMb))}</div>
          <div class="cell-sub">${a.paramsB?t(`${a.paramsB}B`):t(e("catalog.sizeEst"))}</div>
        </td>
        <td>${t(nn(a.downloads))}</td>
        <td>${o.length?`<span class="badge success">${t(e("catalog.onDisk"))}</span>`:i?'<span class="muted">—</span>':`<span class="badge warn">${t(e("catalog.unsupported"))}</span>`}</td>
        <td>
          <div class="row-actions">
            ${r}
          </div>
        </td>
      </tr>`}function qs(a){(a||document).querySelectorAll("[data-pull]").forEach(s=>{s.dataset.boundPull!=="1"&&(s.dataset.boundPull="1",s.onclick=()=>{const o=s.getAttribute("data-pull")||"",n=document.querySelector(`[data-quant-for="${CSS.escape(o)}"]`),i=n&&n.value?n.value:"",r=i?`${o}:${i}`:o;Is(r,Xt({id:o})),s.disabled=!0})})}function mn(a,s,o){return`
    <div class="data-pager" id="cat-hub-pager">
      <div class="data-pager-meta">
        <span id="cat-hub-count">${t(q("common.pagerTotal",{n:a}))}</span>
      </div>
      <div class="data-pager-actions">
        <button type="button" class="btn secondary sm" id="cat-hub-more" ${s?"":"disabled"}>${t(e("catalog.hubMore"))}</button>
      </div>
    </div>`}async function wt({append:a=!1}={}){if(l.catalogHubBusy)return;l.catalogHubBusy=!0;const s=document.getElementById("cat-hub-more");s&&(s.disabled=!0,s.textContent=e("catalog.hubLoading"));const o=window.scrollY;try{const n=new URLSearchParams;l.catalogHubQ&&n.set("q",l.catalogHubQ),l.catalogModality&&n.set("modality",l.catalogModality),a&&l.catalogHubNext&&n.set("cursor",l.catalogHubNext);const i=await x(`/catalog/hub?${n}`),r=(i.hits||[]).filter(d=>d.supported!==!1);if(l.catalogHubHits=a?[...l.catalogHubHits||[],...r]:r,l.catalogHubNext=i.nextCursor||"",a){const d=document.getElementById("cat-hub-tbody");if(d){d.querySelector(".empty-row")?.remove();const c=l.catalogLocal||[];d.insertAdjacentHTML("beforeend",r.map(b=>Ts(b,c)).join("")),qs(d)}const u=document.getElementById("cat-hub-count"),m=(l.catalogHubHits||[]).length;u&&(u.textContent=q("common.pagerTotal",{n:m}));const g=document.querySelector("#catalog-tab-hub .panel-h-meta");g&&(g.textContent=q("common.pagerTotal",{n:m})),s&&(s.textContent=e("catalog.hubMore"),s.disabled=!l.catalogHubNext,l.catalogHubNext||s.remove()),window.scrollTo(0,o);return}await xe()}catch(n){a||(l.catalogHubHits=[]),h(n),a||await xe()}finally{l.catalogHubBusy=!1,s&&document.body.contains(s)&&(s.disabled=!l.catalogHubNext,s.textContent=e("catalog.hubMore")),a&&window.scrollTo(0,o)}}async function xe(){let a={};try{a=await x("/catalog")}catch(v){h(v)}const s=a.packs&&a.packs.length?a.packs:sn,o=a.local||[];l.catalogLocal=o;const n=a.loaded||[];a.popularSyncedAt&&(l.catalogPopularSyncedAt=a.popularSyncedAt),l.catalogHubHits==null&&Array.isArray(a.popular)&&a.popular.length&&(l.catalogHubHits=a.popular);const i=new Set(n.map(v=>v.id)),r=a.usedMb??0,d=a.budgetMb??0,u=d?Math.min(100,Math.round(r/d*100)):0,m=l.catalogTab==="hub"||l.catalogTab==="local"?l.catalogTab:"local";l.catalogTab=m;const g=l.catalogModality||"",c=["text","image","video","tts","stt"],b=g?s.filter(v=>v.modality===g):s,p=b.map(v=>{const O=Ps(v,o),T=v.quants||[],N=on(T),Q=T.length?`<select class="catalog-quant-select" data-quant-for="${t(v.id)}">${T.map(G=>`<option value="${t(G)}" ${G===N?"selected":""}>${t(G)}</option>`).join("")}</select>`:`<span class="muted">${t(e("catalog.noQuant"))}</span>`,z=Ms(v.id),ue=z?e("catalog.pulling"):O.length?e("catalog.pullAgain"):e("catalog.pull");return`
      <tr>
        <td>
          <div class="cell-primary">${t(Xt(v))}</div>
          <div class="cell-sub mono" title="${t(v.id)}">${t(v.id)}</div>
        </td>
        <td><span class="badge muted">${t(Ut(v.modality))}</span></td>
        <td><span class="badge muted">${t(v.runtime||"—")}</span></td>
        <td>${Q}</td>
        <td class="catalog-vram-cell">${v.vramMb??0} MB</td>
        <td>${O.length?`<span class="badge success">${t(e("catalog.onDisk"))}</span>`:'<span class="muted">—</span>'}</td>
        <td>
          <div class="row-actions">
            <button type="button" class="btn ${O.length?"secondary":""} sm" data-pull="${t(v.id)}" ${z?"disabled":""}>${t(ue)}</button>
          </div>
        </td>
      </tr>`}).join(""),f=`
    <tr class="empty-row"><td colspan="7">
      <div class="data-empty">
        <div class="data-empty-icon">∅</div>
        <strong>${t(e("catalog.emptyPacks"))}</strong>
      </div>
    </td></tr>`,k=o.map(v=>{const O=i.has(v.id);return`
      <tr>
        <td>
          <div class="cell-primary mono">${t(v.id)}</div>
          <div class="cell-sub" title="${t(v.path||"")}">${t(v.path||"—")}</div>
        </td>
        <td class="catalog-vram-cell">${v.vramMb??0} MB</td>
        <td>${O?`<span class="badge success">${t(e("catalog.loaded"))}</span>`:`<span class="badge muted">${t(e("catalog.idle"))}</span>`}</td>
        <td>
          <div class="row-actions">
            <button type="button" class="btn sm" data-load="${t(v.id)}" data-vram="${v.vramMb??0}" ${O?"disabled":""}>${t(e("catalog.load"))}</button>
            <button type="button" class="btn secondary sm" data-unload="${t(v.id)}" ${O?"":"disabled"}>${t(e("catalog.unload"))}</button>
            <button type="button" class="btn danger sm" data-rm="${t(v.id)}">${t(e("catalog.delete"))}</button>
          </div>
        </td>
      </tr>`}).join(""),M=`
    <tr class="empty-row"><td colspan="4">
      <div class="data-empty">
        <div class="data-empty-icon">∅</div>
        <strong>${t(e("catalog.emptyLocal"))}</strong>
        <p class="muted">${t(e("catalog.emptyLocalHint"))}</p>
      </div>
    </td></tr>`,L=n.map(v=>Xt({id:v.id})).join(", "),U=`
    <div class="grid catalog-kpi-grid media-kpi-grid">
      <div class="card">
        <div class="label">${t(e("catalog.kpiLoaded"))}</div>
        <div class="value value-sm">${n.length}</div>
        <div class="muted card-sub">${t(L||e("catalog.kpiLoadedNone"))}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("catalog.kpiVram"))}</div>
        <div class="value value-sm">${r}<span class="dash-kpi-den">/${d}</span></div>
        <div class="usage-bar ${u>80?"warn":""}"><span style="width:${u}%"></span></div>
        <div class="muted card-sub">${t(q("catalog.kpiVramSub",{used:r,budget:d}))}</div>
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
    </div>`;Oe({title:e("catalog.filterModality"),hint:e("catalog.intro"),meta:q("common.pagerTotal",{n:b.length}),searchHtml:"",gridHtml:`
      <label>${t(e("catalog.filterModality"))}
        <select id="cat-mod">
          <option value="">${t(e("catalog.filterAll"))}</option>
          ${c.map(v=>`<option value="${t(v)}" ${g===v?"selected":""}>${t(Ut(v))}</option>`).join("")}
        </select>
      </label>`}),`${t(e("catalog.colName"))}${t(e("catalog.colModality"))}${t(e("catalog.colRuntime"))}${t(e("catalog.colQuant"))}${t(e("catalog.colVram"))}${t(e("catalog.colStatus"))}${t(e("common.actions"))}${p||f}`;const E=`
    <div class="panel data-table-panel">
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>${t(e("catalog.colName"))}</th>
            <th>${t(e("catalog.colVram"))}</th>
            <th>${t(e("catalog.colStatus"))}</th>
            <th>${t(e("common.actions"))}</th>
          </tr></thead>
          <tbody>${k||M}</tbody>
        </table>
      </div>
    </div>`,B=(Array.isArray(l.catalogHubHits)?l.catalogHubHits:[]).filter(v=>v.supported!==!1),F=B.map(v=>Ts(v,o)).join(""),S=`
    <tr class="empty-row"><td colspan="8">
      <div class="data-empty">
        <div class="data-empty-icon">∅</div>
        <strong>${t(e("catalog.hubEmpty"))}</strong>
      </div>
    </td></tr>`,w=[["",e("catalog.filterAll")],...c.map(v=>[v,Ut(v)])].map(([v,O])=>`<button type="button" class="catalog-mod-chip ${g===v?"is-on":""}" data-hub-mod="${t(v)}" aria-pressed="${g===v}">${t(O)}</button>`).join(""),A=`
    <div class="catalog-hub-stack">
      <div class="panel catalog-hub-card">
        <div class="panel-h">
          <div class="panel-h-text">
            <strong>${t(e("catalog.hubBrowse"))}</strong>
            <span class="muted">${t(e("catalog.hubBrowseHint"))}</span>
          </div>
          ${B.length?`<span class="panel-h-meta muted">${t(q("common.pagerTotal",{n:B.length}))}</span>`:""}
        </div>
        <div class="catalog-hub-row">
          <input type="search" id="cat-hub-q" value="${t(l.catalogHubQ||"")}" placeholder="${t(e("catalog.hubSearchPh"))}" aria-label="${t(e("catalog.hubSearch"))}" />
          <button type="button" class="btn sm" id="cat-hub-go">${t(e("catalog.hubSearchBtn"))}</button>
          <button type="button" class="btn secondary sm" id="cat-hub-reset">${t(e("common.reset"))}</button>
        </div>
        <div class="catalog-mod-chips" role="group" aria-label="${t(e("catalog.filterModality"))}">${w}</div>
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
    </div>`,I=`
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
          <tbody id="cat-hub-tbody">${F||S}</tbody>
        </table>
      </div>
      ${B.length?mn(B.length,!!l.catalogHubNext):""}
    </div>`;document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("catalog.title"))}</h2>
      <div class="toolbar">
        <button type="button" class="btn secondary sm" data-nav="runtimes">${t(e("nav.runtimes"))}</button>
        <button type="button" class="btn sm" id="cat-sync">${t(e("catalog.sync"))}</button>
      </div>
    </div>
    ${ve([e("catalog.intro"),e("catalog.syncHint"),l.catalogPopularSyncedAt?q("catalog.syncAt",{when:se(l.catalogPopularSyncedAt)}):""])}
    ${U}
    ${xs()}
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
          ${E}
        </div>
        <div class="usage-tab-pane catalog-tab-pane" id="catalog-tab-hub" ${m==="hub"?"":"hidden"}>
          ${A}
          ${I}
        </div>
      </div>
    </div>
  `),ie(),document.querySelectorAll("[data-catalog-tab]").forEach(v=>{v.onclick=()=>{const O=v.getAttribute("data-catalog-tab")||"local";l.catalogTab=O,document.querySelectorAll(".catalog-tab-pane").forEach(T=>{T.hidden=T.id!==`catalog-tab-${O}`}),document.querySelectorAll("[data-catalog-tab]").forEach(T=>{const N=T.getAttribute("data-catalog-tab")===O;T.classList.toggle("is-active",N),T.setAttribute("aria-selected",String(N))})}});const y=document.getElementById("cat-mod");y&&(y.onchange=()=>{l.catalogModality=y.value,xe().catch(h)}),document.querySelector("#catalog-tab-packs [data-filter-apply]")?.addEventListener("click",()=>{l.catalogModality=document.getElementById("cat-mod")?.value||"",xe().catch(h)}),document.querySelector("#catalog-tab-packs [data-filter-reset]")?.addEventListener("click",()=>{l.catalogModality="",xe().catch(h)});const $=()=>{l.catalogHubQ=document.getElementById("cat-hub-q")?.value.trim()||"",l.catalogHubHits=null,wt().catch(h)};document.getElementById("cat-hub-go")?.addEventListener("click",$),document.getElementById("cat-hub-reset")?.addEventListener("click",()=>{l.catalogHubQ="",l.catalogModality="",l.catalogHubHits=null,wt().catch(h)}),document.querySelectorAll("[data-hub-mod]").forEach(v=>{v.addEventListener("click",()=>{l.catalogModality=v.getAttribute("data-hub-mod")||"",l.catalogHubQ=document.getElementById("cat-hub-q")?.value.trim()||"",l.catalogHubHits=null,wt().catch(h)})}),document.getElementById("cat-hub-q")?.addEventListener("keydown",v=>{v.key==="Enter"&&(v.preventDefault(),$())}),document.getElementById("cat-spec")?.addEventListener("keydown",v=>{v.key==="Enter"&&(v.preventDefault(),document.getElementById("cat-spec-pull")?.click())}),document.getElementById("cat-hub-more")?.addEventListener("click",()=>{wt({append:!0}).catch(h)}),m==="hub"&&l.catalogHubHits==null&&!l.catalogHubBusy&&wt().catch(h),document.getElementById("cat-sync")?.addEventListener("click",async()=>{const v=document.getElementById("cat-sync");if(v){v.setAttribute("disabled","disabled"),v.textContent=e("catalog.syncing");try{const O=await x("/catalog/sync",{method:"POST",body:JSON.stringify({})});l.catalogHubHits=O.hits||[],l.catalogHubNext="",l.catalogHubQ="",l.catalogTab="hub",l.catalogPopularSyncedAt=O.syncedAt||"",await xe()}catch(O){v.removeAttribute("disabled"),v.textContent=e("catalog.sync"),h(O)}}}),qs(document),document.querySelectorAll("[data-load]").forEach(v=>{v.onclick=async()=>{try{await x("/models/load",{method:"POST",body:JSON.stringify({id:v.getAttribute("data-load"),vramMb:Number(v.getAttribute("data-vram")||0)})}),await xe()}catch(O){h(O)}}}),document.querySelectorAll("[data-unload]").forEach(v=>{v.onclick=async()=>{try{await x("/models/unload",{method:"POST",body:JSON.stringify({id:v.getAttribute("data-unload")})}),await xe()}catch(O){h(O)}}}),document.querySelectorAll("[data-rm]").forEach(v=>{v.onclick=async()=>{const O=v.getAttribute("data-rm")||"";if(await Z({variant:"danger",message:q("catalog.deleteConfirm",{id:O}),confirmText:e("catalog.delete")}))try{await x("/catalog/rm",{method:"POST",body:JSON.stringify({id:O})}),await xe()}catch(N){h(N)}}}),document.getElementById("cat-spec-pull")?.addEventListener("click",()=>{const v=document.getElementById("cat-spec")?.value.trim();v&&Is(v,v)})}function pn(a){return a==="installed"?`<span class="badge success">${t(e("runtimes.statusInstalled"))}</span>`:a==="configured"?`<span class="badge success">${t(e("runtimes.statusConfigured"))}</span>`:a==="unsupported"?`<span class="badge muted">${t(e("runtimes.statusUnsupported"))}</span>`:`<span class="badge warn">${t(e("runtimes.statusMissing"))}</span>`}function gn(a){return e(a==="full"?"runtimes.supportFull":a==="partial"?"runtimes.supportPartial":"runtimes.supportNone")}function ma(){const a=l.runtimesInstall,s=document.getElementById("rt-install-log");s&&a&&(s.textContent=(a.lines||[]).join(`
`),s.scrollTop=s.scrollHeight);const o=a&&a.status==="running";document.querySelectorAll("[data-rt-install]").forEach(n=>{const i=n.getAttribute("data-rt-install");n.disabled=!!o,o&&a.id===i&&a.action!=="uninstall"&&(n.textContent=e("runtimes.installing"))}),document.querySelectorAll("[data-rt-uninstall]").forEach(n=>{const i=n.getAttribute("data-rt-uninstall");n.disabled=!!o,o&&a.id===i&&a.action==="uninstall"&&(n.textContent=e("runtimes.uninstalling"))})}async function za(a,s){if(l.runtimesInstall?.status==="running")return;const o=s==="uninstall"?"uninstall":"install";l.runtimesInstall={id:a,action:o,status:"running",lines:[]},await pt();try{const n=o==="uninstall"?`${ft}/runtimes/uninstall`:`${ft}/runtimes/install`,i=await fetch(n,{method:"POST",headers:{"Content-Type":"application/json",...l.key?{Authorization:`Bearer ${l.key}`}:{}},body:JSON.stringify({id:a})}),r=i.body&&i.body.getReader?i.body.getReader():null;if(!i.ok||!r){const d=await i.text();let u=d;try{u=JSON.parse(d)?.error?.message||d}catch{}l.runtimesInstall.status="error",l.runtimesInstall.lines.push(u||i.statusText),ma()}else{const d=new TextDecoder;let u="";const m=g=>{if(g)try{const c=JSON.parse(g);if(c.type==="step"&&Array.isArray(c.argv))l.runtimesInstall.lines.push(`$ ${c.argv.join(" ")}`);else if(c.type==="log"&&c.line)l.runtimesInstall.lines.push(c.line);else if(c.type==="error"&&c.message)l.runtimesInstall.lines.push(c.message),l.runtimesInstall.status="error";else if(c.type==="done"){l.runtimesInstall.status=c.code===0?"done":"error";const b=l.runtimesInstall.action==="uninstall"?"runtimes.uninstallDone":"runtimes.installDone",p=l.runtimesInstall.action==="uninstall"?"runtimes.uninstallFail":"runtimes.installFail";l.runtimesInstall.lines.push(c.code===0?e(b):e(p))}l.runtimesInstall.lines.length>200&&(l.runtimesInstall.lines=l.runtimesInstall.lines.slice(-200)),ma()}catch{}};for(;;){const{done:g,value:c}=await r.read();if(g){u+=d.decode();break}u+=d.decode(c,{stream:!0});const b=u.split(`
`);u=b.pop()||"";for(const p of b)m(p.trim())}m(u.trim())}}catch(n){l.runtimesInstall.status="error",l.runtimesInstall.lines.push(n.message||String(n)),ma()}l.runtimesReport=null,await pt()}async function pt(){if(!l.runtimesReport)try{l.runtimesReport=await x("/runtimes")}catch(p){h(p),l.runtimesReport={host:{os:"linux",osLabel:"Linux",arch:"",platform:"—"},items:[]}}const a=l.runtimesReport,s=a.host?.os||"linux",o=l.runtimesOs||"host",n=o==="host"||o==="all"?s:o,i=l.runtimesMod||"",r=(a.items||[]).filter(p=>{if(i&&!(p.modalities||[]).includes(i))return!1;if(o==="all")return!0;const f=o==="host"?s:o;return(p.support||{})[f]!=="none"}),d=(a.items||[]).filter(p=>p.status==="installed"||p.status==="configured").length,u=(a.items||[]).filter(p=>p.status==="missing").length,m=[["host",e("runtimes.filterHost")],["all",e("runtimes.filterAll")],["darwin",e("runtimes.osMac")],["linux",e("runtimes.osLinux")],["win32",e("runtimes.osWin")]].map(([p,f])=>`<button type="button" class="catalog-mod-chip ${o===p?"is-on":""}" data-rt-os="${p}">${t(f)}</button>`).join(""),g=[["",e("catalog.filterAll")],["text",e("catalog.mod.text")],["image",e("catalog.mod.image")],["video",e("catalog.mod.video")],["tts",e("catalog.mod.tts")],["stt",e("catalog.mod.stt")]].map(([p,f])=>`<button type="button" class="catalog-mod-chip ${i===p?"is-on":""}" data-rt-mod="${t(p)}">${t(f)}</button>`).join(""),c=l.runtimesInstall,b=r.map(p=>{const f=p.install&&p.install[n]||"",k=p.notes&&p.notes[n]||p.detail||"",M=["darwin","linux","win32"].map(I=>{const y=(p.support||{})[I]||"none",$=y==="full"?"success":y==="partial"?"warn":"muted",v=e(I==="darwin"?"runtimes.osMac":I==="win32"?"runtimes.osWin":"runtimes.osLinux");return`<span class="badge ${$}" title="${t(v)}">${t(v)} · ${t(gn(y))}</span>`}).join(""),L=(p.modalities||[]).map(I=>`<span class="badge muted">${t(ke(`catalog.mod.${I}`)?e(`catalog.mod.${I}`):I)}</span>`).join(""),U=!!p.installable&&n===s,E=!!p.uninstallable&&n===s&&(p.status==="installed"||p.status==="configured"),B=c&&c.id===p.id,F=c?.status==="running",S=F&&B&&c.action!=="uninstall"?e("runtimes.installing"):p.status==="installed"||p.status==="configured"?e("runtimes.reinstall"):e("runtimes.install"),w=F&&B&&c.action==="uninstall"?e("runtimes.uninstalling"):e("runtimes.uninstall"),A=B&&(c.lines||[]).length?`<pre class="runtime-install-log" id="rt-install-log">${t((c.lines||[]).join(`
`))}</pre>`:B?'<pre class="runtime-install-log" id="rt-install-log"></pre>':"";return`
        <article class="panel runtime-card ${B&&F?"is-installing":""}" data-runtime-id="${t(p.id)}">
          <div class="panel-h">
            <div class="panel-h-text">
              <strong>${t(p.name)}</strong>
              <span class="muted">${t(ke(`runtimes.${p.id}`)?e(`runtimes.${p.id}`):"")}</span>
            </div>
            ${pn(p.status)}
          </div>
          <div class="panel-pad runtime-card-body">
            <div class="runtime-card-mods">${L}</div>
            <div class="runtime-os-row">${M}</div>
            ${p.path?`<div class="cell-sub mono">${t(e("runtimes.path"))}: ${t(p.path)}${p.version?` · ${t(p.version)}`:""}</div>`:`<div class="cell-sub muted">${t(k)}</div>`}
            <pre class="runtime-cmd">${t(f)}</pre>
            ${A}
            <div class="runtime-card-actions">
              ${U?`<button type="button" class="btn sm" data-rt-install="${t(p.id)}" ${F?"disabled":""}>${t(S)}</button>`:""}
              ${E?`<button type="button" class="btn danger sm" data-rt-uninstall="${t(p.id)}" data-rt-name="${t(p.name)}" ${F?"disabled":""}>${t(w)}</button>`:""}
              <button type="button" class="btn secondary sm" data-copy-cmd="${encodeURIComponent(f)}">${t(e("runtimes.copyCmd"))}</button>
              <a class="btn secondary sm" href="${t(p.docs)}" target="_blank" rel="noopener noreferrer">${t(e("runtimes.docs"))}</a>
            </div>
          </div>
        </article>`}).join("");document.getElementById("app").innerHTML=ne(`
    <div class="topbar">
      <h2>${t(e("runtimes.title"))}</h2>
      <div class="toolbar">
        <button type="button" class="btn secondary sm" id="rt-refresh">${t(e("runtimes.refresh"))}</button>
      </div>
    </div>
    ${ve([e("runtimes.intro"),q("runtimes.cmdFor",{os:e(n==="darwin"?"runtimes.osMac":n==="win32"?"runtimes.osWin":"runtimes.osLinux")})])}
    <div class="grid catalog-kpi-grid media-kpi-grid">
      <div class="card">
        <div class="label">${t(e("runtimes.kpiInstalled"))}</div>
        <div class="value value-sm">${d}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("runtimes.kpiMissing"))}</div>
        <div class="value value-sm">${u}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("runtimes.kpiHost"))}</div>
        <div class="value value-sm">${t(a.host?.osLabel||"—")}</div>
        <div class="muted card-sub">${t(a.host?.platform||"")}</div>
      </div>
      <div class="card">
        <div class="label">${t(e("runtimes.kpiArch"))}</div>
        <div class="value value-sm">${t(a.host?.arch||"—")}</div>
      </div>
    </div>
    <div class="panel catalog-hub-card" style="margin-bottom:14px">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("runtimes.filterOs"))}</strong>
        </div>
      </div>
      <div class="catalog-mod-chips" style="padding-top:12px">${m}</div>
      <div class="catalog-mod-chips">${g}</div>
    </div>
    <div class="runtime-grid">
      ${b||`<div class="data-empty"><strong>${t(e("runtimes.empty"))}</strong></div>`}
    </div>
  `),ie(),document.querySelectorAll("[data-rt-os]").forEach(p=>{p.onclick=()=>{l.runtimesOs=p.getAttribute("data-rt-os")||"host",pt().catch(h)}}),document.querySelectorAll("[data-rt-mod]").forEach(p=>{p.onclick=()=>{l.runtimesMod=p.getAttribute("data-rt-mod")||"",pt().catch(h)}}),document.getElementById("rt-refresh")?.addEventListener("click",()=>{l.runtimesReport=null,pt().catch(h)}),document.querySelectorAll("[data-rt-install]").forEach(p=>{p.onclick=()=>{const f=p.getAttribute("data-rt-install");f&&za(f,"install").catch(h)}}),document.querySelectorAll("[data-rt-uninstall]").forEach(p=>{p.onclick=async()=>{const f=p.getAttribute("data-rt-uninstall"),k=p.getAttribute("data-rt-name")||f;if(!f)return;await Aa({variant:"danger",title:e("runtimes.uninstall"),message:q("runtimes.uninstallConfirm",{name:k}),confirmText:e("runtimes.uninstall")})&&za(f,"uninstall").catch(h)}}),document.querySelectorAll("[data-copy-cmd]").forEach(p=>{p.onclick=async()=>{let f=p.getAttribute("data-copy-cmd")||"";try{f=decodeURIComponent(f)}catch{}try{await navigator.clipboard.writeText(f),p.textContent=e("loginCopied"),setTimeout(()=>{p.textContent=e("runtimes.copyCmd")},1200)}catch{}}})}async function aa(){const a=document.getElementById("app");try{if(!l.key){await is();return}l.me||await ns(),l.page==="dashboard"?await ga():l.page==="chat"?await Vo():l.page==="chats"?await St():l.page==="keys"?await Ke():l.page==="documents"?await dt():l.page==="media"?await $e():l.page==="catalog"?await xe():l.page==="runtimes"?await pt():l.page==="audit"?await Pt():l.page==="settings"?await ps():l.page==="apiFeatures"?await Nt():l.page==="usage"?await ge():l.page==="ddos"?await oe():l.page==="queue"?await ce():l.page==="pm2"?await He():l.page==="system"?await rt():l.page==="support"?await an():await ga()}catch(s){a.innerHTML=ne(`<div class="error-box">${t(s.message)}</div>`),ie()}}let et=null;const V={tab:"overview",status:"",sortBy:"queuedAt",sortDir:"desc",limit:20,offset:0};function Yt(a){return!a||a<0?"—":a<1e3?`${a}ms`:a<6e4?`${Math.round(a/1e3)}s`:a<36e5?`${Math.round(a/6e4)}m`:`${(a/36e5).toFixed(1)}h`}const fn=["enabled","globalConcurrency","perKeyConcurrency","maxQueueDepth","maxQueueDepthPerKey","fairness","defaultPriority","playgroundPriority","leaseMs","maxWaitMs"];function Bs(){return{relaxed:{enabled:!0,globalConcurrency:6,perKeyConcurrency:2,maxQueueDepth:200,maxQueueDepthPerKey:40,fairness:"weighted_round_robin",defaultPriority:100,playgroundPriority:40,leaseMs:6e4,maxWaitMs:9e5},balanced:{enabled:!0,globalConcurrency:4,perKeyConcurrency:1,maxQueueDepth:100,maxQueueDepthPerKey:20,fairness:"weighted_round_robin",defaultPriority:100,playgroundPriority:50,leaseMs:45e3,maxWaitMs:6e5},strict:{enabled:!0,globalConcurrency:2,perKeyConcurrency:1,maxQueueDepth:40,maxQueueDepthPerKey:8,fairness:"fifo_global",defaultPriority:100,playgroundPriority:80,leaseMs:3e4,maxWaitMs:3e5}}}function Va(a){if(!a)return{};const s={};for(const o of fn){const n=a[o];typeof n=="boolean"?s[o]=n:typeof n=="number"&&Number.isFinite(n)?s[o]=Math.round(n):typeof n=="string"?s[o]=n:n==null?s[o]=null:s[o]=n}return s}function Cs(a,s){return JSON.stringify(Va(a))===JSON.stringify(Va(s))}function wa(a){if(!a)return"custom";const s=Bs();for(const o of["relaxed","balanced","strict"])if(Cs(a,s[o]))return o;return"custom"}function yn(a){return e(a==="relaxed"?"queue.presetRelaxed":a==="balanced"?"queue.presetBalanced":a==="strict"?"queue.presetStrict":"queue.presetCustom")}function Ls(a,{unsaved:s=!1}={}){const o=yn(a),n=a==="relaxed"?"relaxed":a==="balanced"?"balanced":a==="strict"?"strict":"custom",i=s?q("queue.presetFormLabel",{name:o}):q("queue.presetActiveLabel",{name:o});return`<span class="ddos-preset-badge is-${n}" id="queue-preset-badge" title="${t(i)}">${t(i)}</span>`}function Hs(){return{enabled:document.getElementById("q-master-enabled")?tt("q-master-enabled"):!0,globalConcurrency:Math.max(1,Math.min(64,Math.floor(J("qp-gconc",4)))),perKeyConcurrency:Math.max(1,Math.min(16,Math.floor(J("qp-kconc",1)))),maxQueueDepth:Math.max(1,Math.floor(J("qp-depth",100))),maxQueueDepthPerKey:Math.max(1,Math.floor(J("qp-depthk",20))),fairness:document.getElementById("qp-fair")?.value==="fifo_global"?"fifo_global":"weighted_round_robin",defaultPriority:Math.max(0,Math.min(1e3,Math.floor(J("qp-pri",100)))),playgroundPriority:Math.max(0,Math.min(1e3,Math.floor(J("qp-ppri",50)))),leaseMs:Math.max(5e3,Math.floor(J("qp-lease",45e3))),maxWaitMs:Math.max(5e3,Math.floor(J("qp-wait",6e5)))}}function Zt(a){at("q-master-enabled",a,e("queue.masterOn"),e("queue.masterOff")),ot("queue-root",!a),st("queue-disabled-banner",!a);const s=document.getElementById("qk-pill-enabled");s&&(s.innerHTML=Qe(a,e("dash.on"),e("dash.off")))}function bn(a){if(!a)return;const s=(n,i)=>{const r=document.getElementById(n);r&&(r.value=String(i))};Zt(a.enabled!==!1),s("qp-gconc",a.globalConcurrency),s("qp-kconc",a.perKeyConcurrency),s("qp-depth",a.maxQueueDepth),s("qp-depthk",a.maxQueueDepthPerKey);const o=document.getElementById("qp-fair");o&&(o.value=a.fairness||"weighted_round_robin"),s("qp-pri",a.defaultPriority),s("qp-ppri",a.playgroundPriority),s("qp-lease",a.leaseMs),s("qp-wait",a.maxWaitMs),Mt()}function Mt(){if(!document.getElementById("queue-policy-panel"))return;let a;try{a=Hs()}catch{return}const s=wa(a),o=wa(l._queuePolicyCache||a),n=!Cs(a,l._queuePolicyCache||a);document.querySelectorAll("[data-queue-preset]").forEach(d=>{const u=d.dataset.queuePreset;if(u==="custom"){const b=s==="custom";d.classList.toggle("is-active",b),d.setAttribute("aria-pressed",b?"true":"false"),d.disabled=!b;return}const m=u===s,g=u===o;d.classList.toggle("is-active",m),d.classList.toggle("is-saved",g&&!m),d.setAttribute("aria-pressed",m?"true":"false");const c=e(u==="relaxed"?"queue.presetRelaxed":u==="balanced"?"queue.presetBalanced":"queue.presetStrict");m&&g?d.innerHTML=`${t(c)} <span class="preset-tag">${t(e("queue.presetTagActive"))}</span>`:m&&n?d.innerHTML=`${t(c)} <span class="preset-tag preset-tag--draft">${t(e("queue.presetTagDraft"))}</span>`:g?d.innerHTML=`${t(c)} <span class="preset-tag preset-tag--saved">${t(e("queue.presetTagSaved"))}</span>`:d.textContent=c});const i=document.getElementById("queue-preset-badge");i&&(i.outerHTML=Ls(s,{unsaved:n&&s!==o}));const r=document.getElementById("queue-preset-hint");if(r){const d={relaxed:e("queue.presetRelaxedHint"),balanced:e("queue.presetBalancedHint"),strict:e("queue.presetStrictHint"),custom:e("queue.presetCustomHint")};r.textContent=d[s]||d.custom}}function hn(){document.querySelectorAll("[data-queue-preset]").forEach(a=>{a.dataset.queuePreset!=="custom"&&(a.onclick=()=>{const s=a.dataset.queuePreset,o=Bs()[s];o&&bn(o)})}),["qp-gconc","qp-kconc","qp-depth","qp-depthk","qp-fair","qp-pri","qp-ppri","qp-lease","qp-wait"].forEach(a=>{const s=document.getElementById(a);s&&(s.addEventListener("change",()=>Mt()),s.addEventListener("input",()=>Mt()))}),Mt()}function Ja(){return document.querySelector(".main")}function Ds(a){return a.map(s=>{const o=s.status==="queued"||s.status==="leased"||s.status==="running",n=s.status==="failed"||s.status==="dead"||s.status==="cancelled",i=s.startedAt||s.finishedAt?null:s.queuedAt?Date.now()-new Date(s.queuedAt).getTime():null;return`
    <tr data-q-row="${t(s.id)}">
      <td>
        <div class="cell-primary mono" title="${t(s.id||"")}">${t((s.id||"").slice(0,10))}…</div>
        <div class="cell-sub mono" title="${t(s.requestId||"")}">${t((s.requestId||"").slice(0,18))}${(s.requestId||"").length>18?"…":""}</div>
        ${s.errorMessage?`<div class="queue-job-err" title="${t(s.errorMessage)}">${t(String(s.errorMessage).slice(0,80))}</div>`:""}
      </td>
      <td>${Ws(s.source)}</td>
      <td>
        ${js(s.status)}
        ${s.cancelRequested?`<div class="cell-sub">${t(e("queue.cancelReq"))}</div>`:""}
      </td>
      <td class="mono" title="${t(s.model||"")}">${t(s.model||"—")}</td>
      <td><span class="queue-pri">${s.priority??"—"}</span></td>
      <td>
        <div class="cell-primary mono" title="${t(s.apiKeyId||"")}">${t((s.apiKeyId||"").slice(0,8))}…</div>
      </td>
      <td class="mono">${s.attempt??0}<span class="muted">/${s.maxAttempts??1}</span></td>
      <td>
        <div class="cell-primary">${se(s.queuedAt)}</div>
        ${i!=null&&s.status==="queued"?`<div class="cell-sub" data-q-wait>${t(e("queue.wait"))}: ${Yt(i)}</div>`:s.startedAt?`<div class="cell-sub">${t(e("queue.started"))}: ${se(s.startedAt)}</div>`:""}
      </td>
      <td>
        <div class="row-actions">
        ${o?`<button type="button" class="btn danger sm" data-q-cancel="${t(s.id)}">${t(e("queue.cancel"))}</button>`:""}
        ${s.status==="queued"?`<button type="button" class="btn secondary sm" data-q-pri="${t(s.id)}" data-pri="${s.priority}">${t(e("queue.priorityBtn"))}</button>`:""}
        ${n?`<button type="button" class="btn secondary sm" data-q-requeue="${t(s.id)}">${t(e("queue.requeue"))}</button>`:""}
        </div>
      </td>
    </tr>`}).join("")}function Os(){document.querySelectorAll("[data-q-cancel]").forEach(a=>{a.onclick=async()=>{await Z({title:e("queue.cancel"),message:e("queue.cancelConfirm"),variant:"danger",confirmText:e("queue.cancel")})&&(await x(`/queue/jobs/${a.dataset.qCancel}/cancel`,{method:"POST",body:"{}"}),ce().catch(h))}}),document.querySelectorAll("[data-q-requeue]").forEach(a=>{a.onclick=async()=>{await x(`/queue/jobs/${a.dataset.qRequeue}/requeue`,{method:"POST",body:"{}"}),ce().catch(h)}}),document.querySelectorAll("[data-q-pri]").forEach(a=>{a.onclick=async()=>{const s=Number(a.dataset.pri)||100,o=window.prompt(e("queue.priorityPh"),String(s));if(o==null)return;const n=Number(o);!Number.isFinite(n)||n<0||n>1e3||(await x(`/queue/jobs/${a.dataset.qPri}/priority`,{method:"POST",body:JSON.stringify({priority:n})}),ce().catch(h))}})}function _s(a){return a.enabled?a.paused?e("queue.paused"):a.drainMode?e("queue.drain"):e("queue.running"):e("queue.modeOff")}function vn({s:a,pol:s,jobs:o,total:n,by:i}){const r=a.dead??i.dead??0,d=a.leased??i.leased??0,u=a.running??i.running??0,m=a.queued??i.queued??0,g=a.depth??m+d+u,c=_s(s),b=s.fairness==="fifo_global"?e("queue.fifo"):e("queue.wrr"),p=(I,y)=>{const $=document.getElementById(I);$&&($.textContent=y)},f=(I,y)=>{const $=document.getElementById(I);$&&($.innerHTML=y)};p("qk-depth",String(g)),p("qk-depth-sub",q("queue.kpiDepthSub",{q:m,l:d})),f("qk-running",`${u}<span class="dash-kpi-den">/${s.globalConcurrency??"—"}</span>`),p("qk-running-sub",q("queue.kpiActiveSub",{n:a.workerActive??0})),p("qk-queued",String(m)),p("qk-dead",String(r)),p("qk-oldest",a.oldestQueuedAgeMs?Yt(a.oldestQueuedAgeMs):"—"),p("qk-mode",c),p("qk-mode-sub",b);const k=document.getElementById("qk-worker-id");if(k){const I=a.workerId||"—";k.textContent=I,k.title=I}const M=(I,y,$,v)=>{const O=document.getElementById(I);O&&(O.outerHTML=`<span id="${I}">${Qe(y,$,v)}</span>`)};M("qk-pill-enabled",s.enabled!==!1,e("dash.on"),e("dash.off")),M("qk-pill-consumer",!s.paused&&s.enabled!==!1,e("queue.running"),s.paused?e("queue.paused"):e("queue.modeOff")),M("qk-pill-admission",!s.drainMode,e("queue.accepting"),e("queue.drain")),p("qk-fairness-val",b),p("qk-conc-val",`${s.perKeyConcurrency??1} / ${s.globalConcurrency??"—"}`);const L=document.getElementById("queue-dlq-slot");L&&(r>0?(L.innerHTML=`
        <div class="queue-dlq-banner" role="status">
          <div class="queue-dlq-text">
            <strong>${t(e("queue.dlqTitle"))}</strong>
            <span class="queue-dlq-count">${r}</span>
            <span class="muted">${t(e("queue.dlqHint"))}</span>
          </div>
          <div class="toolbar">
            <button type="button" class="btn secondary sm" id="q-filter-dead">${t(e("queue.viewDlq"))}</button>
            <button type="button" class="btn danger sm" id="q-purge-dlq">${t(e("queue.purgeDead"))}</button>
          </div>
        </div>`,document.getElementById("q-filter-dead")?.addEventListener("click",()=>{V.status="dead",V.offset=0,V.tab="jobs",ce().catch(h)})):L.innerHTML="");const U=(I,y)=>{const $=document.getElementById(I);$&&($.textContent=String(y??0))};U("q-tab-count-jobs",n),U("q-tab-count-dead",r);const E=document.getElementById("qk-jobs-meta");E&&(E.textContent=q("queue.jobsMeta",{n}));const B=document.querySelector("#queue-jobs-table tbody");if(B){const I=o.map($=>`${$.id}|${$.status}|${$.priority}|${$.attempt}|${$.cancelRequested?1:0}|${$.errorMessage||""}|${$.startedAt||""}|${$.finishedAt||""}`).join(";"),y=Ds(o)||`<tr class="empty-row"><td colspan="9">
        <div class="data-empty">
          <div class="data-empty-icon">∅</div>
          <strong>${t(e("queue.empty"))}</strong>
        </div>
      </td></tr>`;if(B.dataset.qsig!==I){const $=document.querySelector("#queue-jobs-table .table-wrap"),v=$?.scrollLeft||0;B.dataset.qsig=I,B.innerHTML=y,Os(),Ba(document.querySelector("#queue-jobs-table")||document),$&&($.scrollLeft=v)}else o.forEach($=>{if($.status!=="queued"||!$.queuedAt)return;const v=Date.now()-new Date($.queuedAt).getTime(),O=String($.id||"");let T=null;B.querySelectorAll("[data-q-row]").forEach(Q=>{Q.getAttribute("data-q-row")===O&&(T=Q)});const N=T?.querySelector("[data-q-wait]");N&&(N.textContent=`${e("queue.wait")}: ${Yt(v)}`)})}if(document.querySelector("#queue-pager .data-pager-meta span")){const I=Math.max(1,Math.ceil((n||0)/V.limit)||1),y=Math.floor(V.offset/V.limit)+1,$=document.querySelectorAll("#queue-pager .data-pager-meta > span");$[0]&&($[0].textContent=q("common.pagerTotal",{n:n||0})),$[1]&&($[1].textContent=q("common.pagerPage",{n:y,total:I}));const v=document.getElementById("queue-prev"),O=document.getElementById("queue-next");v&&(v.disabled=V.offset<=0),O&&(O.disabled=V.offset+V.limit>=n)}const S=document.getElementById("q-pause");S&&(S.textContent=s.paused?e("queue.resume"):e("queue.pause"));const w=document.getElementById("q-drain");w&&(w.textContent=s.drainMode?e("queue.undrain"):e("queue.drainBtn"));const A=document.getElementById("q-master-enabled");A&&document.activeElement!==A&&Zt(s.enabled!==!1)}function Xa(){et||(et=setInterval(()=>{if(l.page!=="queue"){clearInterval(et),et=null;return}const a=document.activeElement;a&&a.closest&&a.closest("#queue-policy-panel")&&(a.tagName==="INPUT"||a.tagName==="SELECT"||a.tagName==="TEXTAREA")||ce({soft:!0}).catch(()=>{})},4e3))}async function ce(a={}){const s=!!a.soft&&document.getElementById("queue-root");!s&&et&&(clearInterval(et),et=null);const o=Ja(),n=!s&&o?o.scrollTop:0,i=V;i.sortBy||(i.sortBy="queuedAt"),i.sortDir||(i.sortDir="desc");const r=new URLSearchParams;r.set("limit",String(i.limit)),r.set("offset",String(i.offset)),i.status&&r.set("status",i.status),Te(r,i);const[d,u,m]=await Promise.all([x("/queue/stats"),x(`/queue/jobs?${r}`),x("/queue/policy")]);if(l.page!=="queue")return;const g=d.data||{},c=m.data||g.policy||{},b=u.data||[],p=u.total??b.length,f=g.byStatus||{},k=g.dead??f.dead??0,M=g.leased??f.leased??0,L=g.running??f.running??0,U=g.queued??f.queued??0,E=g.depth??U+M+L,B=_s(c);if(l._queuePolicyCache={...c},s){vn({s:g,pol:c,jobs:b,total:p,by:f}),Xa();return}V.tab||(V.tab="overview");const F=V.tab==="jobs"||V.tab==="policy"?V.tab:"overview";V.tab=F;const S=Ds(b),w=Oe({title:e("queue.filterTitle"),hint:e("queue.filterHint"),meta:q("queue.jobsMeta",{n:p}),gridHtml:`
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
      </label>`}),A=Pe({headHtml:`
      <th>${t(e("queue.colJob"))}</th>
      <th>${t(e("queue.colSource"))}</th>
      ${R({field:"status",label:e("queue.colStatus"),filterRef:i})}
      ${R({field:"model",label:e("queue.colModel"),filterRef:i})}
      ${R({field:"priority",label:e("queue.colPri"),filterRef:i})}
      <th>${t(e("queue.colKey"))}</th>
      ${R({field:"attempt",label:e("queue.colTry"),filterRef:i})}
      ${R({field:"queuedAt",label:e("queue.colTime"),filterRef:i})}
      <th>${t(e("common.actions"))}</th>`,bodyHtml:S,colSpan:9,emptyText:e("queue.empty"),pagerHtml:Le({total:p,limit:i.limit,offset:i.offset,idPrefix:"queue"})}),I=c.fairness==="fifo_global"?e("queue.fifo"):e("queue.wrr"),y=c.enabled!==!1,$=(G,ee,_,X,P)=>`
    <div class="card">
      <div class="label">${t(G)}</div>
      <div class="value value-sm" id="${t(X)}">${ee}</div>
      ${_!=null&&_!==""?`<div class="muted card-sub"${P?` id="${t(P)}"`:""}>${t(String(_))}</div>`:""}
    </div>`,v=`
    <div class="grid queue-kpi-grid" id="queue-kpi-grid">
      ${$(e("queue.depth"),t(String(E)),q("queue.kpiDepthSub",{q:U,l:M}),"qk-depth","qk-depth-sub")}
      ${$(e("queue.activeJobs"),`${L}<span class="dash-kpi-den">/${c.globalConcurrency??"—"}</span>`,q("queue.kpiActiveSub",{n:g.workerActive??0}),"qk-running","qk-running-sub")}
      ${$(e("queue.queued"),t(String(U)),e("queue.kpiQueuedSub"),"qk-queued","qk-queued-sub")}
      ${$(e("queue.dead"),t(String(k)),e("queue.kpiDeadSub"),"qk-dead","qk-dead-sub")}
      ${$(e("queue.oldest"),t(g.oldestQueuedAgeMs?Yt(g.oldestQueuedAgeMs):"—"),e("queue.kpiOldestSub"),"qk-oldest","qk-oldest-sub")}
      ${$(e("queue.mode"),t(B),I,"qk-mode","qk-mode-sub")}
    </div>`,O=`
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
            <span id="qk-pill-enabled">${Qe(c.enabled!==!1,e("dash.on"),e("dash.off"))}</span>
          </div>
          <div class="queue-status-item">
            <span class="label">${t(e("queue.consumer"))}</span>
            <span id="qk-pill-consumer">${Qe(!c.paused&&c.enabled!==!1,e("queue.running"),c.paused?e("queue.paused"):e("queue.modeOff"))}</span>
          </div>
          <div class="queue-status-item">
            <span class="label">${t(e("queue.admission"))}</span>
            <span id="qk-pill-admission">${Qe(!c.drainMode,e("queue.accepting"),e("queue.drain"))}</span>
          </div>
          <div class="queue-status-item">
            <span class="label">${t(e("queue.fairness"))}</span>
            <strong class="queue-status-val" id="qk-fairness-val">${t(I)}</strong>
          </div>
          <div class="queue-status-item">
            <span class="label">${t(e("queue.concurrency"))}</span>
            <strong class="queue-status-val mono" id="qk-conc-val">${c.perKeyConcurrency??1} / ${c.globalConcurrency??"—"}</strong>
          </div>
          <div class="queue-status-item queue-status-item--worker">
            <span class="label">${t(e("queue.workerInstance"))}</span>
            <code class="queue-worker-id" id="qk-worker-id" title="${t(g.workerId||"")}">${t(g.workerId||"—")}</code>
            <span class="queue-worker-hint muted">${t(e("queue.workerInstanceHint"))}</span>
          </div>
        </div>
      </div>
    </div>

    <div id="queue-dlq-slot">
    ${k>0?`<div class="queue-dlq-banner" role="status">
      <div class="queue-dlq-text">
        <strong>${t(e("queue.dlqTitle"))}</strong>
        <span class="queue-dlq-count">${k}</span>
        <span class="muted">${t(e("queue.dlqHint"))}</span>
      </div>
      <div class="toolbar">
        <button type="button" class="btn secondary sm" id="q-filter-dead">${t(e("queue.viewDlq"))}</button>
        <button type="button" class="btn danger sm" id="q-purge-dlq">${t(e("queue.purgeDead"))}</button>
      </div>
    </div>`:""}
    </div>`,T=`
    ${w}
    <div id="queue-jobs-table" class="queue-jobs-table-host">${A}</div>`,N=`
    <div class="panel data-table-panel queue-policy-panel" id="queue-policy-panel">
      <div class="panel-h">
        <div class="panel-h-text">
          <strong>${t(e("queue.policyTitle"))}</strong>
          <span class="muted panel-h-sub">${t(e("queue.policyHint"))}</span>
        </div>
        ${Ls(wa(c))}
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
    </div>`;if(document.getElementById("app").innerHTML=ne(`
  <div id="queue-root" class="${y?"":"is-feature-off"}">
    <div class="topbar">
      <h2>${t(e("queue.title"))}</h2>
      <div class="toolbar">
        ${Ca({id:"q-master-enabled",on:y,onLabel:e("queue.masterOn"),offLabel:e("queue.masterOff"),title:e("queue.masterHint")})}
        <button type="button" class="btn secondary sm" id="q-pause">${t(c.paused?e("queue.resume"):e("queue.pause"))}</button>
        <button type="button" class="btn secondary sm" id="q-drain">${t(c.drainMode?e("queue.undrain"):e("queue.drainBtn"))}</button>
        <button type="button" class="btn danger sm" id="q-purge">${t(e("queue.purgeDead"))}</button>
      </div>
    </div>
    ${ve([e("queue.subtitle")])}
    <div class="feature-off-banner" id="queue-disabled-banner" ${y?"hidden":""} role="status">
      <strong>${t(e("common.featureOff"))}</strong>
      <span>${t(e("queue.disabledBanner"))}</span>
    </div>

    ${v}

    <div class="usage-tabs-panel panel queue-tabs-panel">
      <div class="seg-tabs" role="tablist" aria-label="${t(e("queue.title"))}">
        <button type="button" role="tab" class="seg-tab ${F==="overview"?"is-active":""}" data-queue-tab="overview" aria-selected="${F==="overview"}">
          ${t(e("queue.tabOverview"))}
        </button>
        <button type="button" role="tab" class="seg-tab ${F==="jobs"?"is-active":""}" data-queue-tab="jobs" aria-selected="${F==="jobs"}">
          ${t(e("queue.tabJobs"))}
          <span class="seg-tab-count" id="q-tab-count-jobs">${p}</span>
        </button>
        <button type="button" role="tab" class="seg-tab ${F==="policy"?"is-active":""}" data-queue-tab="policy" aria-selected="${F==="policy"}">
          ${t(e("queue.tabPolicy"))}
        </button>
      </div>
      <div class="usage-tab-body">
        <div class="usage-tab-pane queue-tab-pane-overview" id="queue-tab-overview" ${F==="overview"?"":"hidden"}>
          ${O}
        </div>
        <div class="usage-tab-pane queue-tab-pane-jobs" id="queue-tab-jobs" ${F==="jobs"?"":"hidden"}>
          ${T}
        </div>
        <div class="usage-tab-pane queue-tab-pane-policy" id="queue-tab-policy" ${F==="policy"?"":"hidden"}>
          ${N}
        </div>
      </div>
    </div>
  </div>
  `),ie(),document.querySelectorAll("[data-queue-tab]").forEach(G=>{G.addEventListener("click",()=>{const ee=G.getAttribute("data-queue-tab")||"overview";ee!=="overview"&&ee!=="jobs"&&ee!=="policy"||V.tab!==ee&&(V.tab=ee,ce().catch(h))})}),n>0){const G=Ja();G&&(G.scrollTop=n,requestAnimationFrame(()=>{G.scrollTop=n}))}document.getElementById("q-master-enabled").onclick=async()=>{const G=!tt("q-master-enabled");Zt(G);try{const ee=await x("/queue/policy",{method:"PUT",body:JSON.stringify({enabled:G})});l._queuePolicyCache={...l._queuePolicyCache||{},...ee.data||{enabled:G}},Mt()}catch(ee){Zt(!G),h(ee)}},document.getElementById("q-pause").onclick=async()=>{await x(c.paused?"/queue/resume":"/queue/pause",{method:"POST",body:"{}"}),ce().catch(h)},document.getElementById("q-drain").onclick=async()=>{await x(c.drainMode?"/queue/undrain":"/queue/drain",{method:"POST",body:"{}"}),ce().catch(h)};let Q=!1;const z=async()=>{if(!Q){Q=!0;try{if(!await Z({title:e("queue.purgeTitle"),message:e("queue.purgeConfirm"),variant:"danger",confirmText:e("queue.purgeConfirmBtn"),cancelText:e("common.cancel")}))return;const ee=await x("/queue/purge-dead",{method:"POST",body:"{}"}),_=Number(ee?.data?.deleted??0);await he({title:e("queue.purgeDoneTitle"),message:q("queue.purgeDoneMsg",{n:_}),confirmText:e("common.ok")}),await ce()}finally{Q=!1}}},ue=document.getElementById("queue-root");ue&&(ue.onclick=G=>{G.target?.closest?.("#q-purge, #q-purge-dlq")&&(G.preventDefault(),z().catch(h))}),document.getElementById("q-filter-dead")?.addEventListener("click",()=>{V.status="dead",V.offset=0,V.tab="jobs",ce().catch(h)}),document.querySelectorAll("[data-filter-apply]").forEach(G=>{G.onclick=()=>{V.status=document.getElementById("qf-status")?.value||"",V.offset=0,ce().catch(h)}}),document.querySelectorAll("[data-filter-reset]").forEach(G=>{G.onclick=()=>{V.status="",V.sortBy="queuedAt",V.sortDir="desc",V.offset=0,ce().catch(h)}}),ht("queue",V,()=>ce().catch(h)),Ge(V,()=>ce().catch(h)),document.getElementById("qp-save").onclick=async()=>{const G=Hs();await x("/queue/policy",{method:"PUT",body:JSON.stringify(G)}),l._queuePolicyCache={...l._queuePolicyCache||{},...G},j(""),ce().catch(h)},hn(),Os(),Xa()}l.page=Us();(!location.hash||location.hash==="#"||location.hash==="#/")&&Ea(l.page);window.addEventListener("hashchange",()=>{const a=Pa(location.hash);a&&a!==l.page&&xa(a,{writeHash:!1})});window.addEventListener("popstate",()=>{const a=Pa(location.hash);!a||a===l.page||xa(a,{writeHash:!1})});aa();
//# sourceMappingURL=boot.js.map
