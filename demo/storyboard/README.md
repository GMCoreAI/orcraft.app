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
section (what Mark says, sent as is to ElevenLabs) and a Visual section: one
bullet per cut, opening with the narration phrase the cut lands on, then what
the viewer sees, then the shot in backticks. Timings are estimates at Mark's
pace and are replaced by the generated clip lengths.

The shot vocabulary:

- `controller <step>; <step>` - the controller window after the steps. A step
  prefixed with `~` happens during the recording, so the viewer sees it. Steps:
  `open` (the tutorial suite loaded with the fleet endpoints and the maze
  folder configured), `select "<node>"` (that tree node selected, its panel
  shown), `run "<node>"` (Run pressed on that node and confirmed).
- `controller` - the controller as the previous cut left it.
- `editor <path>[:<line>]` - the file open in VS Code, path relative to
  `C:\orcraft`; `{ci}` stands for its newest CI snapshot folder.
- `browser <url> "<title>"` - the page in the default browser's app window,
  found by a fragment of its title.
- `terminal <name>` - the demo terminal playing `transcripts/<name>.txt`. A
  transcript's `!run` runs a real command at build time; the `runs` folder
  holds the run files an AI agent would write, copied to `C:\orcraft\runs`.
- Several of these joined with ` | ` are quick cuts sharing the phrase's time;
  `x2` after a part gives it twice the share.

A new scene is therefore one markdown file here; the runner changes only when
a scene needs a kind of shot that does not exist yet.

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
