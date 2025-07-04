# frozen_string_literal: true

module RacingSnakes
  # Factory class to create player instances
  class PlayerFactory
    def self.build(player_id)
      RacingSnakes::HumanPlayer.new(player_id)
    end
  end
end
