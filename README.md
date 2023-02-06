# GPT Explain Diff JavaScript action

This action receives as input a git diff (e.g. a PR diff) and asks chatgpt to summarize and explain the changes made in that diff.

## Inputs

### `diff`

**Required** The diff to be explained.

### `apikey`

**Required** Your OpenAI api key. See "[OpenAI API](https://openai.com/api/)"

## Outputs

### `explanation`

The explanation from GPT3

## Example usage

```yaml
uses: actions/hello-world-javascript-action@main
with:
  who-to-greet: 'Mona the Octocat'
```

### To explain the changes made in a PR
```yaml
name: Explain PR

on:
  pull_request:
    types: [opened, synchronize]

env:
  DIFF: ${{ compare(github.base_ref, github.head_ref) }}

jobs:
  explain-diff:
    runs-on: ubuntu-latest

    steps:
    - name: Explain Diff
      uses: actions/explain-diff
      with:
        diff: ${{ env.DIFF }}
        apikey: ${{ secrets.OPENAI_APIKEY }}
```

### To explain the changes made in a PR and post the result as a comment in the PR itself
```yaml
name: Explain PR

on:
  pull_request:
    types: [opened, synchronize]

env:
  DIFF: ${{ compare(github.base_ref, github.head_ref) }}

jobs:
  explain-diff:
    runs-on: ubuntu-latest

    steps:
    - name: Explain Diff
      uses: actions/explain-diff
      with:
        diff: ${{ env.DIFF }}
        apikey: ${{ secrets.OPENAI_APIKEY }}
    
    - name: Post Comment
      uses: actions/github-script@0.9.1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      if: steps.explain.outputs.explanation
      run: |
        const octokit = require('@octokit/rest')({ auth: process.env.GITHUB_TOKEN });
        octokit.pulls.createComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          pull_number: context.payload.pull_request.number,
          body: steps.explain.outputs.explanation
        });
```

 in the GitHub Help documentation.