#spefic for nvim workflows

.PHONY: test lint ci

test:
	bundle exec rspec --require ./spec/support/quickfix_formatter.rb --format QuickfixFormatter


lint::
	bundle exec rubocop

format:
	bundle exec rubocop -A

ci: rubocop test

