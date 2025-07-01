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

    def initialize(player_roster: RacingSnakes::AbstractPlayerRoster)
      @player_roster = player_roster
      @frame_number = 0
      @game_over = false
    end

    def tick
      # precondition frame_number is a non-negative integer
      # postconditions: frame_number is incremented by 1
      # each player
      # 1. moves if non-eliminated
      # 2. checks for collisions with other players or the board edgea
      # 4 if the player has a collision, it is eliminated
      # 5. if the player is eliminated, its trail is removed from the board
      # 6. if the player is not eliminated, its trail is updated on the board
      @player_roster.move_players
      @frame_number += 1
    end

    def waiting_for_players?
      # precondition: class has been initialized
      # postcondition: once the method returns false, it stays false
      @player_roster.count < 2
    end

    def game_over?
      # precondition: tick has been called at least once
      # postcondition: once the method returns true, it stays true
      return @game_over if @game_over == true

      @game_over = true if !waiting_for_players && @player_roster.active_players <= 1

      @game_over
    end

    def add_player(player_id)
      @player_roster.add_player(player_id)

      return if @player_roster.count < 2

      @waiting_for_players = false
    end
  end
end
