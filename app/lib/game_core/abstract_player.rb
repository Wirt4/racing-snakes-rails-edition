# frozen_string_literal: true

module RacingSnakes
  # AbstractPlayer is an abstract class that represents a player in the game.
  # invariants: id is always an alphanumeric string.
  # TODO: move checking logic to this parent class
  class AbstractPlayer
    attr_reader :id
    attr_accessor :eliminated

    def initialize(id)
      raise ArgumentError, 'player id must be a string' unless id.is_a?(String)

      @eliminated = false
    end

    def eliminated?
      !!@eliminated
    end

    def move
      # This method should be implemented by subclasses.
      # It represents the player's move logic.
      raise NotImplementedError, 'Subclasses must implement the move method'
    end
  end
end
