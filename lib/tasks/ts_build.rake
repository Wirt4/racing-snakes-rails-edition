# lib/tasks/ts_build.rake
namespace :ts do
  desc 'Build TypeScript frontend'
  task :build do
    puts '🏗️  Building TypeScript assets with npm...'
    Dir.chdir('app/raycaster') do
      system('npm run build:all') or raise '❌ TypeScript build failed!'
    end
  end
end

# Hook into assets:precompile
Rake::Task['assets:precompile'].enhance(['ts:build'])
