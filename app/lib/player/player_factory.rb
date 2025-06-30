module RacingSnakes
  class PlayerFactory
    def self.build(player_id)
      RacingSnakes::HumanPlayer.new(player_id: player_id)
    end
  end
end
