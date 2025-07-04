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

    def initialize(player_roster: RacingSnakes::AbstractPlayerRoster, board: RacingSnakes::AbstractBoard)
      @player_roster = player_roster
      @board = board
      @game_over = false
    end

    def update
      # precondition(s):
      # waiting_for_players? and game_over are false
      # postcondition(s):
      # all active players have moved according to their inputs and speed
      # crashed players have been deactivated
      # the trails on the board have been updated
      # moving players have left a trail, crashed players have trails removed

      raise 'Game state is not updatable' if waiting_for_players? || @game_over

      @player_roster.move_players
      crashed_player_ids = @board.collisions(roster: @player_roster)
      @player_roster.deactivate(crashed_players: crashed_player_ids)
      @board.update_trails(roster: @player_roster)
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

    def state
      # precondition: class has been initialized
      # postcondition: internal state is unchanged, status is returned as a hash

      { waiting_for_players: waiting_for_players?, game_over: game_over?, players: @player_roster.state }
    end
  end
end
