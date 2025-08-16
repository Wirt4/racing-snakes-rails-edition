# frozen_string_literal: true

require 'rspec/core/formatters/base_text_formatter'

class QuickfixFormatter < RSpec::Core::Formatters::BaseTextFormatter
  RSpec::Core::Formatters.register self, :example_failed

  def example_failed(notification)
    location = notification.example.metadata[:location]
    file, line = location.split(':')
    message = notification.message_lines.join(' ').gsub(/\s+/, ' ')
    output.puts "#{file}:#{line}: #{message}"
  end
end
