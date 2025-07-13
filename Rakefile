# frozen_string_literal: true

# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require_relative 'config/application'

Rails.application.load_tasks
desc 'Install gems using Bundler API'

task :install do
  system('bundle install')
end

desc 'Run tests'
task :test do
  sh 'bundle exec rspec'
end

desc 'Run RuboCop'
task :lint do
  sh 'bundle exec rubocop'
end

desc 'Run Rails server locally'
task :localhost do
  Dir.chdir('app/raycaster') do
    system('npm run build:all') || abort('❌ Failed to build raycaster assets')
  end
  sh 'bin/dev'
end
