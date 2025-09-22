# frozen_string_literal: true

class PlayButtonComponent < ViewComponent::Base
  def initialize(label:, path:)
    @label = label
    @path = path
  end
end
