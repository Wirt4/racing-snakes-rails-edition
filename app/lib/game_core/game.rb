module RacingSnakes
  class Game
    # TODO: describe class invariants
    def add_player(player_id)
      # preconditions: player_id is a 32 character string
      # player is not already in the game
      # a player is created with the playername

      return if player_id.is_a?(String)

      raise ArgumentError, 'player_id must be a string'

      # postconditions: player count is incremented by 1s a player is added wich has the name
    end
  end
end
