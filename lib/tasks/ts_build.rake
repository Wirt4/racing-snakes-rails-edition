# lib/tasks/ts_build.rake
namespace :ts do
  desc 'Build TypeScript frontend'
  task :build do
    puts '🏗️  Building TypeScript assets with npm...'
    Dir.chdir('app/raycasting') do
      system('npm run build') or raise '❌ TypeScript build failed!'
    end
  end
end

# Hook into assets:precompile
Rake::Task['assets:precompile'].enhance(['ts:build'])
