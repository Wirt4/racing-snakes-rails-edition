module RacingSnakes
  # AbstractBoard is an abstract class that represents a game board.
  # Invariants: width and height are always positive integers.
  class AbstractBoard
    attr_reader :width, :height

    def in_bounds?(position)
      raise NotImplementedError, 'This method should be overridden in a subclass'
    end
  end
end
