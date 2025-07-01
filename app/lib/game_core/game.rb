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

    def initialize(player_factory: RacingSnakes::PlayerFactory, player_roster_factory: RacingSnakes::PlayerRosterFactory)
      @player_factory = player_factory
      @players = []
      @frame_number = 0
      @waiting_for_players = true
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
      move_players
      @frame_number += 1
    end

    def waiting_for_players?
      # precondition: class has been initialized
      # postcondition: once the method returns false, it stays false
      @waiting_for_players
    end

    def game_over?
      # precondition: tick has been called at least once
      # postcondition: once the method returns true, it stays true
      return @game_over if @game_over == true

      inactive_players = @players.select(&:eliminated?)
      @game_over = true if !@waiting_for_players && inactive_players.size >= @players.size - 1

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

    private

    def move_players
      @players.each do |player|
        next if player.eliminated?

        player.move
      end
    end
  end
end
