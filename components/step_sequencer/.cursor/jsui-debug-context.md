# jsui debug context

- phase: done
- last_step: "Removed flush from paint (had caused blank until focus lost). Flush only via setTimeout(0) or from bang. User confirmed working as expected."
- user_result: confirmed working (no error, immediate UI update, no blank, outlet data goes out)
- symptom: (1) "error calling function onclick"; (2) UI does not update until click outside; (3) intermittency; (4) blank after click until focus lost.
- handler: onclick
- fix_applied: "Queue outlet work in pendingOutletWork; never call outlet from onclick or from paint. schedule(fn) pushes and flushes via setTimeout(0) when available; bang handler also flushes queue. Hit-test, state, safeRedraw() in onclick."
- next_step: None. See .cursor/rules/jsui-onclick-errors.mdc for full resolved summary.
