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
    attr_reader :players

    def initialize(player_factory: RacingSnakes::PlayerFactory)
      @player_factory = player_factory
      @players = []
    end

    def add_player(player_id)
      # preconditions: player_id is a 32 character string
      # player is not already in the game
      # a player is created with the player name (player_id)
      @players ||= []
      @unique_player_ids ||= []
      validate_player_id(player_id)
      @players << @player_factory.build(player_id)
      @unique_player_ids << player_id

      # postconditions: player count is incremented by 1s a player is added which has the name
    end

    private

    def validate_player_id(player_id)
      raise ArgumentError, 'player_id must be a string' unless player_id.is_a?(String)
      raise ArgumentError, 'player_id must be a 32 character hex string' unless player_id.match?(/\A[a-f0-9]{32}\z/)
      raise ArgumentError, 'player_id already exists' if @unique_player_ids&.include?(player_id)
    end
  end
end
