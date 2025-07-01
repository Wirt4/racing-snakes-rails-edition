# frozen_string_literal: true

module RacingSnakes
  # Core logic for the racing snakes game
  # invariants:
  #  all participating players have a unique player_id
  #  players is an array of valid AbsPlayer objects
  #  game.tick is monotonically increasing
  #  frame_number is a non-negative integer
  #  the board only contains valid player data and trail data
  class Game
    attr_reader :players, :frame_number, :waiting_for_players

    def initialize(player_factory: RacingSnakes::PlayerFactory)
      @player_factory = player_factory
      @players = []
      @frame_number = 0
      @waiting_for_players = true
      @game_over = false
    end

    def tick
      # precondition frame_number is a non-negative integer
      # postcondition: frame_number is incremented by 1
      @frame_number += 1
    end

    def waiting_for_players?
      # precondition: class has been initialized
      # postcondition: once the method returns false, it stays false
      @waiting_for_players
    end

    def game_over?
      # precondition: class has been initialized
      # postcondition: once the method returns true, it stays true
      @game_over
    end

    def add_player(player_id)
      # preconditions:
      # player is not already in the game
      # a player is created with the player name (player_id) //todo: need to test this?
      # player's position is inside the board bounds
      # player's position does not occupy another player or trail
      @players ||= []

      raise ArgumentError, 'player_id already exists' if @players.map(&:id)&.include?(player_id)

      @players << @player_factory.build(player_id)
      return if @players.size < 2

      @waiting_for_players = false

      # postconditions: player count is incremented by 1s a player is added which has the name
    end
  end
end
