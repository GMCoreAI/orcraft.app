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
- "So, what is Orcraft?": the controller with the tutorial suite loaded; a group is run and the tree starts moving. `controller open; ~run "Statuses and Results"`
- "Tests are written in plain Python": cut to a test file in the editor, the test class with its config fields and a dimension. `editor orcraft-test-suite-tutorial/test_group_advanced_configuration_parameters/test_matrix_and_cases/test_matrix_and_cases.py:13`
- "The controller reads that code and builds the GUI from it": back to the controller, another group is started, then the matrix test is selected and its generated configuration panel fills the right side. `controller ~run "Structure and Lifecycle"; ~select "Matrix and Cases"`
- "from the GUI, from the command line, or from CI": three quick cuts, a group's panel with its Run button, a terminal running a test from the command line, the nightly validation runs on GitHub Actions. `controller select "Advanced Configuration Parameters" | terminal 01-cli x2 | browser https://github.com/GMCoreAI/ci-workflows/actions/workflows/nightly-validation.yml "ci-workflows"`
- "on a fleet of remote machines": the Endpoints group selected, the fleet cards below. `controller select "Endpoints"`
- "And an AI agent can do all of it": a terminal with an AI agent request typed in; the agent writes a run file and runs a test on GMG-LEGACY for real. `terminal 01-agent`
- "In the next few minutes": back to the controller, the suite selected with the results of the runs, hold until the narration ends. `controller select "Orcraft Tutorial"`
