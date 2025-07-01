module RacingSnakes
  # Abstract class for player roster management
  # Players can be added, removed, and have their functions called en masse.
  # Invariants:
  # - All participating players have a unique player_id
  class AbstractPlayerRoster
    attr_reader :players

    def initialize(player_factory: RacingSnakes::PlayerFactory)
      raise NotImplementedError, 'This class is abstract and cannot be instantiated directly'
    end

    def add_player(player_id)
      raise NotImplementedError, 'This method should be overridden in subclasses'
    end

    def move_players
      raise NotImplementedError, 'This method should be overridden in subclasses'
    end
  end
end
