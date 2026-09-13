# Scene 1 - Intro

Estimated narration: 45 s.

## Narration

So, what is Orcraft?

Orcraft is a platform for test development and orchestration. It lets you, and
your AI agents, run the entire testing operation.

The idea is simple. Tests are written in plain Python, in a defined structure.
The controller reads that code and builds the GUI from it. Nothing else to
configure. No JSON, no YAML, no plugins to maintain.

From there, the same suite runs from the GUI, from the command line, or from
CI. On your local machine, or on a fleet of remote machines, wherever an
endpoint application is installed.

And an AI agent can do all of it. Write the tests. Configure the run. Execute
it on your machines. And read the results.

In the next few minutes, we'll follow one suite through that whole loop. From
code, to GUI, to CI, with an AI agent at the keyboard.

## Visual

- Before the narration: your logo animation and sonic (CapCut, not recorded).
- "So, what is Orcraft?": the controller with the tutorial session loaded, a slow hold, no cursor movement. `controller open`
- "Tests are written in plain Python": cut to a test file in the editor, the test class with its config fields and a dimension. `editor orcraft-test-suite-tutorial/test_group_advanced_configuration_parameters/test_matrix_and_cases/test_matrix_and_cases.py:13`
- "The controller reads that code and builds the GUI from it": back to the controller, the same test selected, its generated configuration panel filling the right side. `controller select "Matrix and Cases"`
- "from the GUI, from the command line, or from CI": three quick cuts, a group's panel with its Run button, a terminal running a test from the command line, the run file of a CI snapshot. `controller select "Advanced Configuration Parameters" | terminal 01-cli | editor {ci}/ci_run.py`
- "on a fleet of remote machines": the Endpoints group selected, the fleet cards below. `controller select "Endpoints"`
- "And an AI agent can do all of it": a terminal with an AI agent request typed in, a few lines of its answer. `terminal 01-agent`
- "In the next few minutes": back to the controller, hold until the narration ends. `controller select "Matrix and Cases"`
