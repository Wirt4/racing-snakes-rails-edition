# frozen_string_literal: true

module RacingSnakes
  # AbstractBoard is an abstract class that represents a game board.
  # Invariants: width and height are always positive integers.
  class AbstractBoard
    attr_reader :width, :height

    def collisions(roster: RacingSnakes::AbstractPlayerRoster)
      # NOTE: should return an array of player_ids, if no collisions, return an empty array
      raise NotImplementedError, 'This method should be overridden in a subclass'
    end
  end
end
