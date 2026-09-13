# Orcraft demo video - storyboard

Purpose: show the main principles, not every feature. One suite follows the
whole loop: code, GUI, endpoints, run, results, CI export, AI agent.

Voice: ElevenLabs, "Mark - Casual, Relaxed and Light", speed 1.05,
stability 70, similarity 75, style 0, Multilingual v2.

The `transcripts` folder holds the text the demo terminal plays in a
command-line cut, one file per cut; a `$` line is typed, `!run` runs the
command and shows its real output, other lines are printed as they are.

The runner that turns a scene into a clip lives in the private controller
repository under `scripts/demo` (it encodes the controller's automation
protocol); a scene is built with `python orcraft-controller/scripts/demo/build.py <n>`
and lands in `demo/build`, which is not versioned.

One file per scene, numbered in playing order. Each file has a Narration
section (what Mark says, sent as is to ElevenLabs) and a Visual section (what
the controller does on screen while he says it, driven by the runner).
Timings are estimates at Mark's pace and are replaced by the generated clip
lengths.

## Scenes

1. 01-intro.md - what Orcraft is and the loop the video follows.
2. 02-code-to-gui.md - a test class in the editor, its config fields,
   dimensions and endpoint placeholders, then the same test's panel in the
   controller, generated from the code.
3. 03-endpoints.md - the Endpoints panel, adding a machine, the package upload
   and version update happening on their own.
4. 04-running.md - plan a group, run it across several endpoints in parallel,
   the tree statistics live, the log of one step.
5. 05-results.md - the details dialog at group level, export to a spreadsheet,
   Export for Agents.
6. 06-ci-export.md - Export for CI from the session, run the snapshot from the
   command line, the same results without the GUI.
7. 07-ai-agent.md - one request to an AI agent: run this suite on those
   machines and report. The agent writes the run file, runs it, reads the log,
   answers.
8. 08-outro.md - the tagline, pip install orcraft, orcraft.app.
