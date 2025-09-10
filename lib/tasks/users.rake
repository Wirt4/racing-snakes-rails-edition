namespace :users do
  desc 'Clean up guest users older than 24 hours'
  task cleanup_guests: :environment do
    expired = User.where(guest: true).where('created_at < ?', 1.day.ago)
    deleted_count = expired.delete_all
    puts "Deleted #{deleted_count} expired guest users"
  end
end
