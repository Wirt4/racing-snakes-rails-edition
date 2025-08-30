# Racing Snakes: Rails Edition
<img src="/assets/readme_pic.jpg" alt="two snakes chasing each other on a grid" width="550" />

## Description
_Racing Snakes: Rails Edition_ is a lightweight Ruby on Rails application that parses, ranks, and displays race results using clean MVC architecture and test-driven development practices. An extension of "Racing Snakes"(https://github.com/Wirt4/racing_snakes), this project showcases practical Ruby skills, RSpec testing discipline, and deploy-ready Rails workflows.
## Who Is This Project For
### Hosted Project
For people who want to play a fun little game without a ton of overhead for setup.
### The repository
For developers who want to develop and extend a deploy-read Rails app.
## Dependencies
To run locally, you'll need:
- **Ruby** 3.3.4
- **Rails** 7.1.3
- **Bundler** 2.5.15

Install dependencies with 
```bash
bundle install
```
```bash
rake install
```
## Instructions For Use
### Hosting
To host locally, run
```bash
bin/rails server
or 
```bash
rake localhost
```

To run tests, run 
```bash
bundler exec rspec
```
or
```bash
rake test
```
To profile the TypeScript raycaster, run
```bash
rake profile
```
This runs the app with the cpu-profile flag. Outputs are stored in app/raycaster/tmp and can be opened with Chrome DevTools.

In development, you can also run rubocop for linting and style checks:
bundler exec rubocop
```bash
rake lint
```
### neovim shortcuts
If you use neovim, you can use the following shortcuts to run tests and lint.
```vim
make test
```
```vim
make lint
```
Then you can use `:copen` to open the results in a quickfix window.

### Controls
The player whips around hairpin 90 degree turns in a trippy digital space.
#### Desktop
Left/Right Arrows
#### Mobile View
Tap of left or right side of view screen

## Terms of Use
The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
