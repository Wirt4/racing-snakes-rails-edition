# frozen_string_literal: true

module RacingSnakes
  # AbstractPlayer is an abstract class that represents a player in the game.
  # invariants: id is always an alphanumeric string.
  # TODO: move checking logic to this parent class
  class AbstractPlayer
    attr_reader :id
  end
end
