#spefic for nvim workflows

.PHONY: test lint ci

ruby-test:
	bundle exec rspec --require ./spec/support/quickfix_formatter.rb --format QuickfixFormatter

ts-test:
	cd app/raycaster && npx jest
lint:
	bundle exec rubocop

format:
	bundle exec rubocop -A

ci: rubocop test

