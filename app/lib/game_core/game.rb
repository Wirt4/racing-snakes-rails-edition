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
    attr_reader :players, :frame_number

    def initialize(player_factory: RacingSnakes::PlayerFactory)
      @player_factory = player_factory
      @players = []
      @frame_number = 0
    end

    def tick
      # preconditions frame_number is a non-negative integer
      # postconditions: frame_number is incremented by 1
      @frame_number += 1
    end

    def add_player(player_id)
      # preconditions: player_id is a 32 character string
      # player is not already in the game
      # a player is created with the player name (player_id)
      @players ||= []

      raise ArgumentError, 'player_id already exists' if @players.map(&:id)&.include?(player_id)

      @players << @player_factory.build(player_id)

      # postconditions: player count is incremented by 1s a player is added which has the name
    end
  end
end
