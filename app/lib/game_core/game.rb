# frozen_string_literal: true

module RacingSnakes
  # Core logic for the racing snakes game
  # invariants:
  #  all participating players have a unique player_id
  #  players is an array of valid AbsPlayer objects
  #  game.tick is monotonically increasing
  #  all players and trails are within the game bounds
  #  the board only contains valid player data and trail data
  class Game
    # TODO: describe class invariants
    def add_player(player_id)
      # preconditions: player_id is a 32 character string
      # player is not already in the game
      # a player is created with the player name (player_id)
      @players ||= []
      validate_player_id(player_id)
      @players << player_id

      # postconditions: player count is incremented by 1s a player is added which has the name
    end

    private

    def validate_player_id(player_id)
      raise ArgumentError, 'player_id must be a string' unless player_id.is_a?(String)
      raise ArgumentError, 'player_id must be a 32 character hex string' unless player_id.match?(/\A[a-f0-9]{32}\z/)
      raise ArgumentError, 'player_id already exists' if @players&.include?(player_id)
    end
  end
end
